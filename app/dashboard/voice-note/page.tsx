'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Deklarasi tipe untuk Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceNotePage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('Rekaman suara akan muncul di sini secara detail dan akurat setelah Anda mulai merekam...');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef(isRecording);
  const timerRef = useRef<any>(null);

  // Sinkronisasi ref dengan state
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Timer durasi rekaman
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'id-ID'; // Bahasa Indonesia

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += text + ' ';
          } else {
            interimTranscript += text;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        if (currentText) {
          setTranscript((prev) => {
            if (prev.startsWith('Rekaman suara akan muncul')) {
              return currentText;
            }
            return finalTranscript ? prev + ' ' + finalTranscript : prev;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning/error:', event.error);
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return;
        }
        setErrorMessage(`Kendala transkrip: ${event.error}`);
      };

      recognition.onend = () => {
        if (isRecordingRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error(e);
          }
        }
      };

      recognitionRef.current = recognition;
    } else {
      setErrorMessage('Browser Anda tidak mendukung transkrip suara otomatis.');
    }

    // Setup Media Recorder untuk file audio beresolusi tinggi
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioBlob(blob);
          setAudioUrl(url);
          audioChunksRef.current = [];
        };
      })
      .catch((err) => {
        console.error('Error accessing microphone:', err);
        setErrorMessage('Gagal mengakses mikrofon. Pastikan izin telah diberikan.');
      });
  }, []);

  const startRecording = () => {
    setErrorMessage('');
    setAudioUrl(null);
    setAudioBlob(null);
    if (transcript.startsWith('Rekaman suara akan muncul')) {
      setTranscript('');
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
    }

    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDownloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Catatan_Detail_Transkrip_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadAudio = () => {
    if (!audioBlob) return;
    const element = document.createElement('a');
    element.href = URL.createObjectURL(audioBlob);
    element.download = `Rekaman_Audio_Lengkap_${new Date().toISOString().slice(0, 10)}.webm`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-[#f8fafc] text-[#1a1c1d] min-h-screen font-sans pb-24">
      <main className="pt-6 md:pt-10 px-4 md:px-8 max-w-4xl mx-auto space-y-6">

        {/* HEADER & TOMBOL KEMBALI */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] md:text-xs font-semibold mb-2 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Voice AI Studio & Transcriber
            </div>
            <h1 className="text-xl md:text-3xl font-black tracking-tight text-slate-900">Note from Voice (Voice AI)</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Rekam suara dengan akurasi tinggi, dapatkan transkrip detail kata per kata, serta unduh file audio & catatannya.
            </p>
          </div>
          
          {/* TOMBOL KEMBALI KE DASHBOARD */}
          <button
            onClick={() => router.push('/dashboard')}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Kembali ke Dashboard</span>
          </button>
        </div>

        {/* KARTU UTAMA PEREKAMAN */}
        <div className="bg-white p-6 md:p-10 rounded-[28px] md:rounded-[32px] shadow-sm border border-slate-200/80 text-center space-y-6 relative overflow-hidden">
          
          {/* Efek Ambient Background saat Merekam */}
          {isRecording && (
            <div className="absolute inset-0 bg-rose-500/5 pointer-events-none animate-pulse"></div>
          )}

          {/* Indikator Animasi Mikrofon */}
          <div className="relative z-10">
            <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto rounded-3xl flex items-center justify-center text-white text-3xl md:text-4xl transition-all shadow-xl ${
              isRecording 
                ? 'bg-gradient-to-tr from-rose-600 to-orange-500 animate-bounce shadow-rose-500/30' 
                : 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/20 hover:scale-105'
            }`}>
              <span className="material-symbols-outlined text-[36px] md:text-[44px]">
                {isRecording ? 'mic' : 'mic_none'}
              </span>
            </div>
            
            {isRecording && (
              <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-mono font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                <span>{formatDuration(recordingTime)}</span>
              </div>
            )}
          </div>
          
          <div className="relative z-10">
            <h3 className="text-base md:text-xl font-bold text-slate-900">
              {isRecording ? 'Sedang Merekam Secara Detail...' : 'Tekan untuk Mulai Merekam'}
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-md mx-auto">
              {isRecording 
                ? 'Sistem mendengarkan setiap detail ucapan Anda secara real-time dengan teknologi AI.' 
                : 'Pastikan mikrofon aktif dan berbicara dengan jelas untuk hasil transkrip terbaik.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-2xl flex items-center justify-center gap-2 max-w-lg mx-auto">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TOMBOL AKSI UTAMA */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            {!isRecording ? (
              <button 
                onClick={startRecording}
                className="px-6 md:px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs md:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">mic</span>
                <span>Mulai Rekam Suara Detail</span>
              </button>
            ) : (
              <button 
                onClick={stopRecording}
                className="px-6 md:px-8 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs md:text-sm transition-all shadow-lg shadow-rose-600/30 animate-pulse active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">stop_circle</span>
                <span>Hentikan & Simpan Hasil Detail</span>
              </button>
            )}

            {audioUrl && !isRecording && (
              <button 
                onClick={handleDownloadAudio}
                className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs md:text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">audio_file</span>
                <span>Download File Audio (.webm)</span>
              </button>
            )}

            {!isRecording && transcript && !transcript.startsWith('Rekaman suara akan muncul') && (
              <button 
                onClick={handleDownloadText}
                className="px-5 py-3 rounded-2xl bg-[#006c4b] hover:bg-[#005137] text-white font-bold text-xs md:text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                <span>Download Catatan Detail (.txt)</span>
              </button>
            )}
          </div>

          {/* PEMUTAR AUDIO HASIL REKAMAN */}
          {audioUrl && !isRecording && (
            <div className="mt-6 p-4 md:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col items-center space-y-3 max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-purple-600 text-base">headphones</span>
                <span>Pemutar Audio Hasil Rekaman</span>
              </div>
              <audio controls src={audioUrl} className="w-full h-10 accent-amber-500"></audio>
            </div>
          )}

          {/* KOTAK TRANSKRIP TEKS */}
          <div className="text-left mt-6 p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-base">description</span>
                <h4 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider">Hasil Transkrip Teks Sangat Detail</h4>
              </div>
              {isRecording && (
                <span className="text-[11px] text-rose-600 font-semibold animate-pulse flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span> Merekam kata demi kata...
                </span>
              )}
            </div>
            
            <textarea 
              rows={8}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full bg-white text-xs md:text-sm text-slate-700 p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 resize-none leading-relaxed shadow-2xs font-mono"
              placeholder="Transkrip detail akan tampil di sini..."
            ></textarea>

            <div className="flex justify-between items-center text-[10px] md:text-xs text-slate-400 font-medium">
              <span>* Anda dapat langsung mengedit atau menyempurnakan teks di atas sebelum mengunduhnya.</span>
              <span>Total Karakter: {transcript.length}</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}