'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
// Contoh import hook autentikasi Anda (sesuaikan dengan struktur project Anda)
// import { useAuth } from '@/context/AuthContext'; 

export default function DashboardPage() {
  const router = useRouter();
  
  // Contoh pengambilan data user aktif (ganti sesuai implementasi Auth Anda)
  // const { user } = useAuth();
  // const userId = user?.id || 'default-user-id';
  // const userName = user?.name || 'Alex';

  // Simulasi state user aktif sementara
  const [currentUser] = useState({
    id: 'USR-001',
    name: 'Alex',
    role: 'Frontend Engineer'
  });

  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // State Modal Kalender & Tambah Agenda
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(24);

  // State Daftar Agenda (Difilter/diambil berdasarkan currentUser.id)
  const [calendarEvents, setCalendarEvents] = useState([
    { id: '1', userId: 'USR-001', time: '10:00 - 11:30', title: 'Client Requirement Gathering', category: 'Client', color: 'bg-blue-50 text-blue-700 border-blue-100', date: 24 },
    { id: '2', userId: 'USR-001', time: '14:00 - 15:00', title: 'Finalize Vendor Contracts', category: 'Legal', color: 'bg-emerald-50 text-[#006c4b] border-emerald-100', date: 24 },
    { id: '3', userId: 'USR-001', time: '16:00 - 17:00', title: 'Weekly Engineering Sync', category: 'Engineering', color: 'bg-purple-50 text-purple-700 border-purple-100', date: 24 },
  ]);

  // Form Input Tambah Agenda Baru
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00 - 10:00');
  const [newCategory, setNewCategory] = useState('Internal');

  // Widget Absensi berdasarkan User ID
  const [attendanceStatus, setAttendanceStatus] = useState<'NONE' | 'CHECKED_IN' | 'CHECKED_OUT'>('NONE');
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  const [attendanceSummary, setAttendanceSummary] = useState({
    tepatWaktu: 18,
    terlambat: 1,
    cuti: 0,
    sakit: 1,
    event: 1,
    lembur: 2,
    percentage: '98%'
  });

  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // CONTOH: Fetch data berdasarkan currentUser.id saat komponen dimuat
    // fetchUserData(currentUser.id);

    return () => clearInterval(timer);
  }, [currentUser.id]);

  const formattedTime = isMounted && currentTime
    ? currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  const formattedDate = isMounted && currentTime
    ? currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Memuat tanggal...';

  const handleCheckIn = () => {
    if (!currentTime) return;
    const timeStr = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setCheckInTime(timeStr);
    setAttendanceStatus('CHECKED_IN');
    
    // Kirim data absensi ke backend dengan menyertakan currentUser.id
    // api.post('/attendance/check-in', { userId: currentUser.id, time: timeStr });
  };

  const handleCheckOut = () => {
    if (!currentTime) return;
    const timeStr = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setCheckOutTime(timeStr);
    setAttendanceStatus('CHECKED_OUT');

    // Kirim data absensi keluar ke backend berdasarkan currentUser.id
    // api.post('/attendance/check-out', { userId: currentUser.id, time: timeStr });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let colorClass = 'bg-slate-50 text-slate-700 border-slate-200';
    if (newCategory === 'Client') colorClass = 'bg-blue-50 text-blue-700 border-blue-100';
    else if (newCategory === 'Legal') colorClass = 'bg-emerald-50 text-[#006c4b] border-emerald-100';
    else if (newCategory === 'Engineering') colorClass = 'bg-purple-50 text-purple-700 border-purple-100';
    else if (newCategory === 'Internal') colorClass = 'bg-amber-50 text-amber-700 border-amber-100';

    const newAgendaItem = {
      id: Date.now().toString(),
      userId: currentUser.id, // Menyimpan ID user pembuat agenda
      time: newTime,
      title: newTitle,
      category: newCategory,
      color: colorClass,
      date: selectedDate
    };

    setCalendarEvents([newAgendaItem, ...calendarEvents]);
    setNewTitle('');

    // Kirim ke API backend
    // api.post('/agenda', newAgendaItem);
  };

  // Filter agenda hanya untuk user yang sedang aktif
  const userFilteredEvents = calendarEvents.filter(ev => ev.userId === currentUser.id);

  const recentlyActivities = [
    { title: 'Menyelesaikan API Endpoint Auth', time: '10m lalu', category: 'Backend', status: 'Completed' },
    { title: 'Commit perbaikan layout halaman mobile', time: '45m lalu', category: 'Frontend', status: 'Completed' },
    { title: 'Review Pull Request #142', time: '2h lalu', category: 'Code Review', status: 'Approved' },
  ];

  return (
    <div className="bg-[#f9f9fb] text-[#1a1c1d] min-h-screen font-sans pb-32">
      <Header />

      <main className="pt-4 md:pt-6 px-4 md:px-8 max-w-7xl mx-auto space-y-5 md:space-y-7">

        {/* HERO BANNER - Menyesuaikan Nama User Aktif */}
        <div className="relative overflow-hidden rounded-[24px] md:rounded-[32px] bg-gradient-to-r from-slate-900 via-[#005137] to-[#006c4b] p-6 md:p-10 text-white shadow-xl">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-[11px] md:text-xs font-semibold mb-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Dashboard Utama Perusahaan ({currentUser.role})
              </div>
              <h1 className="text-xl md:text-3xl font-black tracking-tight">Halo, {currentUser.name}! Selamat Bertugas 👋</h1>
              <p className="text-slate-200 text-xs md:text-sm mt-1 font-medium max-w-xl">
                Semua sistem berjalan optimal. Anda memiliki {userFilteredEvents.length} agenda aktif bulan ini dan target penyelesaian task minggu ini mencapai 82%.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 md:px-6 py-3 md:py-4 rounded-2xl text-left md:text-right shrink-0 w-full md:w-auto flex md:flex-col justify-between items-center md:items-end">
              <div>
                <span className="text-[10px] md:text-[11px] uppercase tracking-wider text-emerald-200 font-bold block mb-0.5">Waktu Server</span>
                <span className="text-xl md:text-2xl font-mono font-extrabold tracking-tight">{formattedTime}</span>
              </div>
              <span className="text-[10px] md:text-[11px] text-slate-300 block mt-0.5">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* WIDGET ABSENSI */}
        <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 md:w-2 bg-[#006c4b]"></div>
          <div className="flex items-center gap-3.5 md:gap-5 w-full md:w-auto">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-emerald-50 text-[#006c4b] border border-emerald-100 flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px] md:text-[32px]">fingerprint</span>
            </div>
            <div>
              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 md:mb-1">Status Kehadiran Hari Ini ({currentUser.name})</span>
              <div className="text-sm md:text-xl font-bold text-slate-900 flex items-center gap-2">
                {attendanceStatus === 'NONE' && <span className="text-slate-600 flex items-center gap-1.5 md:gap-2 text-xs md:text-base"><span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-slate-400"></span> Belum Melakukan Absen</span>}
                {attendanceStatus === 'CHECKED_IN' && <span className="text-[#006c4b] flex items-center gap-1.5 md:gap-2 text-xs md:text-base"><span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#00b37e] animate-pulse"></span> Hadir (Masuk Pkl {checkInTime})</span>}
                {attendanceStatus === 'CHECKED_OUT' && <span className="text-blue-600 flex items-center gap-1.5 md:gap-2 text-xs md:text-base"><span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-blue-500"></span> Selesai Kerja (Pulang Pkl {checkOutTime})</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 md:gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <button 
              onClick={handleCheckIn} 
              disabled={attendanceStatus !== 'NONE'} 
              className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[11px] md:text-xs font-bold flex items-center justify-center gap-1.5 md:gap-2 transition-all active:scale-95 shadow-sm ${
                attendanceStatus === 'NONE' 
                  ? 'bg-[#006c4b] hover:bg-[#005137] text-white cursor-pointer' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] md:text-[18px]">login</span> Absen Masuk
            </button>
            <button 
              onClick={handleCheckOut} 
              disabled={attendanceStatus !== 'CHECKED_IN'} 
              className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[11px] md:text-xs font-bold flex items-center justify-center gap-1.5 md:gap-2 transition-all active:scale-95 shadow-sm ${
                attendanceStatus === 'CHECKED_IN' 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] md:text-[18px]">logout</span> Absen Keluar
            </button>
          </div>
        </div>

        {/* TASK OVERVIEW & RINGKASAN ABSENSI (Bagian lainnya tetap disesuaikan dengan filter ID user) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {/* Task Overview */}
          <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-emerald-50 text-[#006c4b] border border-emerald-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">task_alt</span>
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900">Task Overview ({currentUser.name})</h3>
                    <p className="text-[11px] md:text-xs text-slate-500">Statistik penyelesaian tugas pribadi</p>
                  </div>
                </div>
                <span className="text-[10px] md:text-xs font-bold text-[#006c4b] bg-emerald-50 border border-emerald-100 px-2.5 md:px-3 py-1 rounded-full">+18% minggu ini</span>
              </div>
              {/* Grafik statistik tugas mingguan user */}
              <div className="flex items-end justify-between gap-2 md:gap-3 h-28 md:h-36 pt-2 md:pt-4 px-1 md:px-2 mb-4 md:mb-6">
                <div className="w-full flex justify-between items-end h-full">
                  <div className="w-8 md:w-10 bg-slate-100 rounded-t-xl h-[55%] flex flex-col items-center justify-end pb-2"><span className="text-[10px] text-slate-400 font-bold">Sen</span></div>
                  <div className="w-8 md:w-10 bg-slate-100 rounded-t-xl h-[70%] flex flex-col items-center justify-end pb-2"><span className="text-[10px] text-slate-400 font-bold">Sel</span></div>
                  <div className="w-8 md:w-10 bg-slate-100 rounded-t-xl h-[65%] flex flex-col items-center justify-end pb-2"><span className="text-[10px] text-slate-400 font-bold">Rab</span></div>
                  <div className="w-8 md:w-10 bg-gradient-to-t from-[#005137] to-[#00b37e] rounded-t-xl h-[95%] shadow-md flex flex-col items-center justify-end pb-2"><span className="text-[10px] text-white font-bold">Kam</span></div>
                  <div className="w-8 md:w-10 bg-slate-100 rounded-t-xl h-[45%] flex flex-col items-center justify-end pb-2"><span className="text-[10px] text-slate-400 font-bold">Jum</span></div>
                </div>
              </div>
            </div>

            <div className="pt-3 md:pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 flex-1 justify-center">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span className="text-[11px] font-bold text-slate-600">To Do: 12</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100 flex-1 justify-center">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-[11px] font-bold text-amber-700">Progress: 18</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 flex-1 justify-center">
                <span className="w-2 h-2 rounded-full bg-[#00b37e]"></span>
                <span className="text-[11px] font-bold text-[#006c4b]">Done: 18</span>
              </div>
            </div>
          </div>

          {/* Ringkasan Absensi User */}
          <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4 md:mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">badge</span>
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">Rekap Absensi</h3>
                  <p className="text-[11px] md:text-xs text-slate-500">Keaktifan bulan ini ({currentUser.name})</p>
                </div>
              </div>
              <span className="text-[10px] md:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">{attendanceSummary.percentage} Kehadiran</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 md:gap-3.5">
              <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Tepat Waktu</span>
                <span className="text-lg md:text-xl font-extrabold text-[#006c4b]">{attendanceSummary.tepatWaktu}</span>
              </div>
              <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Terlambat</span>
                <span className="text-lg md:text-xl font-extrabold text-amber-500">{attendanceSummary.terlambat}</span>
              </div>
              <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Cuti / Izin</span>
                <span className="text-lg md:text-xl font-extrabold text-blue-600">{attendanceSummary.cuti}</span>
              </div>
              <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Sakit</span>
                <span className="text-lg md:text-xl font-extrabold text-rose-500">{attendanceSummary.sakit}</span>
              </div>
              <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Event / Dinas</span>
                <span className="text-lg md:text-xl font-extrabold text-purple-600">{attendanceSummary.event}</span>
              </div>
              <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Lembur Aktif</span>
                <span className="text-lg md:text-xl font-extrabold text-orange-500">{attendanceSummary.lembur}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AGENDA & JADWAL USER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
          <div 
            onClick={() => setIsCalendarModalOpen(true)}
            className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm border border-slate-200/80 lg:col-span-2 flex flex-col justify-between cursor-pointer hover:border-emerald-300 transition-all group"
          >
            <div>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">calendar_month</span>
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-[#006c4b] transition-colors">
                      Agenda & Jadwal Pribadi ({currentUser.name})
                    </h3>
                    <p className="text-[11px] md:text-xs text-slate-500">September 2026 — Klik untuk mengelola agenda</p>
                  </div>
                </div>
                <span className="text-[10px] md:text-xs font-bold text-orange-700 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                  {userFilteredEvents.length} Agenda Aktif
                </span>
              </div>

              <div className="space-y-3">
                {userFilteredEvents.length > 0 ? (
                  userFilteredEvents.slice(0, 3).map((ev) => (
                    <div key={ev.id} className="p-3.5 md:p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="text-[11px] md:text-xs font-mono font-bold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200">
                          {ev.time} (Tgl {ev.date})
                        </div>
                        <div>
                          <h4 className="text-[11px] md:text-xs font-bold text-slate-900">{ev.title}</h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md mt-0.5 inline-block border ${ev.color}`}>{ev.category}</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">Belum ada agenda untuk user ini.</p>
                )}
              </div>
            </div>
          </div>

          {/* Aktivitas Terbaru */}
          <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">history</span>
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900">Aktivitas Saya</h3>
                    <p className="text-[11px] md:text-xs text-slate-500">Log pekerjaan {currentUser.name}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5">
                {recentlyActivities.map((act, idx) => (
                  <div key={idx} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[11px] md:text-xs font-bold text-slate-900 leading-snug">{act.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{act.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">{act.category}</span>
                      <span className="text-[10px] text-[#006c4b] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00b37e]"></span> {act.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* MODAL KALENDER & TAMBAH AGENDA */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[28px] md:rounded-[32px] p-6 md:p-8 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined">event_note</span>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900">Kelola Agenda - {currentUser.name}</h3>
                  <p className="text-xs text-slate-500">September 2026 — Tambah Agenda Berdasarkan ID User Aktif</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCalendarModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Pilih Tanggal Agenda</h4>
              <div className="grid grid-cols-7 gap-2">
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                  <div key={day} className="text-center text-[10px] font-bold text-slate-400 py-1">{day}</div>
                ))}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((dateNum) => {
                  const isSelected = selectedDate === dateNum;
                  const hasAgenda = userFilteredEvents.some(ev => ev.date === dateNum);

                  return (
                    <button
                      key={dateNum}
                      onClick={() => setSelectedDate(dateNum)}
                      className={`h-10 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                        isSelected 
                          ? 'bg-[#006c4b] text-white shadow-md' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100'
                      }`}
                    >
                      <span>{dateNum}</span>
                      {hasAgenda && !isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 absolute bottom-1.5"></span>
                      )}
                      {hasAgenda && isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-1.5"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleAddEvent} className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tambah Agenda Baru (User: {currentUser.name})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Judul Agenda</label>
                  <input 
                    type="text" 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    placeholder="Contoh: Meeting Evaluasi Q3" 
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#006c4b]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Waktu</label>
                  <input 
                    type="text" 
                    value={newTime} 
                    onChange={(e) => setNewTime(e.target.value)} 
                    placeholder="09:00 - 10:30" 
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#006c4b]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Kategori</label>
                <select 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#006c4b]"
                >
                  <option value="Internal">Internal</option>
                  <option value="Client">Client</option>
                  <option value="Legal">Legal</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-[#006c4b] hover:bg-[#005137] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Simpan Agenda
              </button>
            </form>
          </div>
        </div>
      )}

      <Navbar activePage="dashboard" />
    </div>
  );
}