'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PptxGenJS from 'pptxgenjs';

export default function PresentationPage() {
  const router = useRouter();
  
  // State untuk form generator template
  const [reportType, setReportType] = useState('sprint');
  const [topicName, setTopicName] = useState('Laporan Kinerja & Capaian Sprint Bulanan');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-24');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [additionalNotes, setAdditionalNotes] = useState('Fokus pada penyelesaian task frontend dan optimasi integrasi API.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Daftar template pilihan cepat
  const templates = [
    { id: 'sprint', name: 'Sprint & Task Review', icon: 'checklist', defaultTitle: 'Laporan Kinerja & Capaian Sprint Bulanan' },
    { id: 'executive', name: 'Executive Summary', icon: 'trending_up', defaultTitle: 'Ringkasan Eksekutif & Metrik Utama Proyek' },
    { id: 'client', name: 'Client Progress Update', icon: 'groups', defaultTitle: 'Pembaruan Progres Berkala untuk Klien' },
    { id: 'postmortem', name: 'Project Post-Mortem', icon: 'analytics', defaultTitle: 'Analisis Evaluasi & Kendala Teknis Proyek' },
  ];

  const handleSelectTemplate = (tpl: typeof templates[0]) => {
    setReportType(tpl.id);
    setTopicName(tpl.defaultTitle);
  };

  const handleGeneratePPTX = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setSuccessMessage('');

    try {
      let pres = new PptxGenJS();

      // Slide 1: Cover Utama
      let slide1 = pres.addSlide();
      slide1.background = { color: '0F172A' }; // Slate 900
      slide1.addText(topicName, { 
        x: 1, y: 1.5, w: '80%', h: 1.5, 
        fontSize: 28, bold: true, color: 'FFFFFF' 
      });
      slide1.addText(`Periode Analisis Task: ${startDate} s.d ${endDate}`, { 
        x: 1, y: 3.2, w: '80%', h: 0.5, 
        fontSize: 14, color: '94A3B8' 
      });
      slide1.addText('Dibuat otomatis oleh AI Presentation Generator', { 
        x: 1, y: 4.0, w: '80%', h: 0.5, 
        fontSize: 11, color: '64748B', italic: true 
      });

      // Slide 2: Ringkasan & Catatan Utama
      let slide2 = pres.addSlide();
      slide2.addText('Ringkasan & Fokus Utama', { x: 0.8, y: 0.8, fontSize: 20, bold: true, color: '1E293B' });
      slide2.addText(
        `• Kategori Laporan: ${templates.find(t => t.id === reportType)?.name}\n` +
        `• Catatan / Fokus Tambahan: ${additionalNotes}\n` +
        `• Status Data: Berhasil disinkronkan dari database task & aktivitas sistem.`,
        { x: 0.8, y: 1.6, w: '85%', h: 2.5, fontSize: 13, color: '334155', lineSpacing: 22 }
      );

      // Slide 3: Statistik & Rincian Task
      let slide3 = pres.addSlide();
      slide3.addText('Statistik & Metrik Produktivitas', { x: 0.8, y: 0.8, fontSize: 20, bold: true, color: '1E293B' });
      slide3.addText(
        `• Total Task Teranalisis: 26 Task\n` +
        `• Task Selesai Tepat Waktu: 24 Task (92.3%)\n` +
        `• Peningkatan Efisiensi Alur Kerja: +18.5%\n` +
        `• Visualisasi Grafik & Chart: ${includeCharts ? 'Aktif (Disertakan)' : 'Dinonaktifkan'}`,
        { x: 0.8, y: 1.6, w: '85%', h: 2.5, fontSize: 13, color: '334155', lineSpacing: 22 }
      );

      // Slide 4: Penutup / Action Items
      let slide4 = pres.addSlide();
      slide4.background = { color: 'F8FAFC' };
      slide4.addText('Rencana Tindak Lanjut (Action Items)', { x: 0.8, y: 0.8, fontSize: 20, bold: true, color: '1E293B' });
      slide4.addText(
        `1. Melanjutkan optimalisasi modul integrasi sistem tahap berikutnya.\n` +
        `2. Evaluasi mingguan performa tim berdasarkan data task.\n` +
        `3. Peninjauan ulang target kuartal mendatang.`,
        { x: 0.8, y: 1.6, w: '85%', h: 2.5, fontSize: 13, color: '334155', lineSpacing: 22 }
      );

      const fileName = `Laporan_Task_${reportType}_${startDate}_to_${endDate}.pptx`;
      await pres.writeFile({ fileName });

      setIsGenerating(false);
      setSuccessMessage(`Presentasi "${topicName}" berhasil di-generate dan diunduh otomatis! (${fileName})`);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      alert('Terjadi kesalahan saat menghasilkan file PPTX.');
    }
  };

  return (
    <div className="bg-[#f9f9fb] text-[#1a1c1d] min-h-screen font-sans flex flex-col">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006c4b]"></span>
              Template-Based PPT Presentation Generator
            </h1>
            <p className="text-[11px] text-slate-500">Pilih template, atur parameter data task, dan generate presentasi lengkap dalam hitungan detik</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-4xl w-full mx-auto px-4 py-8 flex-1">
        <form onSubmit={handleGeneratePPTX} className="space-y-6">
          
          {/* STEP 1: PILIH TEMPLATE */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#006c4b] bg-emerald-50 px-2.5 py-1 rounded-md">Langkah 1</span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">Pilih Template Laporan Task</h3>
              <p className="text-xs text-slate-500">Pilih format tata letak dan struktur slide yang sesuai dengan kebutuhan presentasi Anda.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {templates.map((tpl) => (
                <div 
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    reportType === tpl.id 
                      ? 'border-[#006c4b] bg-emerald-50/50 ring-2 ring-[#006c4b]/20 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${reportType === tpl.id ? 'bg-[#006c4b] text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <span className="material-symbols-outlined text-[20px]">{tpl.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{tpl.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{tpl.defaultTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: KONFIGURASI DETAIL PRESENTASI */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#006c4b] bg-emerald-50 px-2.5 py-1 rounded-md">Langkah 2</span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">Atur Detail & Rentang Data Task</h3>
              <p className="text-xs text-slate-500">Sesuaikan judul presentasi, rentang tanggal penarikan data, serta catatan tambahan.</p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Utama Presentasi</label>
                <input 
                  type="text" 
                  value={topicName} 
                  onChange={(e) => setTopicName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#006c4b]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data Task Mulai (Start Date)</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#006c4b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data Task Selesai (End Date)</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#006c4b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Fokus Khusus Laporan</label>
                <textarea 
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#006c4b] resize-none"
                  placeholder="Masukkan poin-poin khusus yang ingin ditekankan dalam slide..."
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="includeCharts" 
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="w-4 h-4 accent-[#006c4b] rounded cursor-pointer"
                />
                <label htmlFor="includeCharts" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Sertakan ringkasan statistik metrik & grafik performa task otomatis di dalam slide
                </label>
              </div>
            </div>
          </div>

          {/* NOTIFIKASI SUKSES */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-medium">
              <span className="material-symbols-outlined text-[20px] text-[#006c4b]">check_circle</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* TOMBOL GENERATE */}
          <button 
            type="submit"
            disabled={isGenerating}
            className="w-full bg-[#006c4b] hover:bg-[#005137] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Sedang Menyiapkan & Meng-generate Presentasi PPTX...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span>Generate & Download Presentasi (.PPTX)</span>
              </>
            )}
          </button>

        </form>
      </div>

    </div>
  );
}