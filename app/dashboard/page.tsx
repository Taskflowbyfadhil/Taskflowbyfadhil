'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  

  // State Modal Kalender & Tambah Agenda
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(24);

  // State Daftar Agenda
  const [calendarEvents, setCalendarEvents] = useState([
    { time: '10:00 - 11:30', title: 'Client Requirement Gathering', category: 'Client', color: 'bg-blue-50 text-blue-700 border-blue-100', date: 24 },
    { time: '14:00 - 15:00', title: 'Finalize Vendor Contracts', category: 'Legal', color: 'bg-emerald-50 text-[#006c4b] border-emerald-100', date: 24 },
    { time: '16:00 - 17:00', title: 'Weekly Engineering Sync', category: 'Engineering', color: 'bg-purple-50 text-purple-700 border-purple-100', date: 24 },
  ]);

  // Form Input Tambah Agenda Baru
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00 - 10:00');
  const [newCategory, setNewCategory] = useState('Internal');

  // Widget Absensi
  const [attendanceStatus, setAttendanceStatus] = useState<'NONE' | 'CHECKED_IN' | 'CHECKED_OUT'>('NONE');
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  const [attendanceSummary] = useState({
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
    return () => clearInterval(timer);
  }, []);

  const formattedTime = isMounted && currentTime
    ? currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  const formattedDate = isMounted && currentTime
    ? currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Memuat tanggal...';

  const handleCheckIn = () => {
    if (!currentTime) return;
    setCheckInTime(currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    setAttendanceStatus('CHECKED_IN');
  };

  const handleCheckOut = () => {
    if (!currentTime) return;
    setCheckOutTime(currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    setAttendanceStatus('CHECKED_OUT');
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
      time: newTime,
      title: newTitle,
      category: newCategory,
      color: colorClass,
      date: selectedDate
    };

    setCalendarEvents([newAgendaItem, ...calendarEvents]);
    setNewTitle('');
  };

  const exploreApps = [
    {
      id: 'PRESENTASI',
      title: 'Presentasi AI',
      category: 'Auto Report',
      desc: 'Buat slide presentasi profesional secara otomatis dari data task mingguan.',
      icon: 'slideshow',
      gradient: 'from-blue-600 to-indigo-700',
      route: '/dashboard/presentation',
    },
    {
      id: 'VOICE_NOTE',
      title: 'Voice to Note',
      category: 'Voice AI',
      desc: 'Rekam meeting atau ide, ubah otomatis menjadi transkrip dan ringkasan.',
      icon: 'mic',
      gradient: 'from-amber-500 to-orange-600',
      route: '/dashboard/voice-note',
    },
    {
      id: 'AUTO_PLAN',
      title: 'Auto Planning',
      category: 'Smart Strategy',
      desc: 'Rencana kerja pintar berdasarkan tren penyelesaian tugas dan kapasitas.',
      icon: 'psychology',
      gradient: 'from-purple-600 to-pink-600',
      route: '/dashboard/autoplan',
    },
  ];

  const recentlyActivities = [
    { title: 'Menyelesaikan API Endpoint Auth', time: '10m lalu', category: 'Backend', status: 'Completed' },
    { title: 'Commit perbaikan layout halaman mobile', time: '45m lalu', category: 'Frontend', status: 'Completed' },
    { title: 'Review Pull Request #142', time: '2h lalu', category: 'Code Review', status: 'Approved' },
  ];

  return (
    <div className="bg-[#f9f9fb] text-[#1a1c1d] min-h-screen font-sans pb-32">
      
      {/* Header Universal */}
      <Header />

      <main className="pt-4 md:pt-6 px-4 md:px-8 max-w-7xl mx-auto space-y-5 md:space-y-7">

        {/* HERO BANNER */}
        <div className="relative overflow-hidden rounded-[24px] md:rounded-[32px] bg-gradient-to-r from-slate-900 via-[#005137] to-[#006c4b] p-6 md:p-10 text-white shadow-xl">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-[11px] md:text-xs font-semibold mb-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Dashboard Utama Perusahaan
              </div>
              <h1 className="text-xl md:text-3xl font-black tracking-tight">Halo, Alex! Selamat Bertugas 👋</h1>
              <p className="text-slate-200 text-xs md:text-sm mt-1 font-medium max-w-xl">
                Semua sistem berjalan optimal. Anda memiliki {calendarEvents.length} agenda aktif bulan ini dan target penyelesaian task minggu ini mencapai 82%.
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
              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 md:mb-1">Status Kehadiran Hari Ini</span>
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

        {/* TASK OVERVIEW & ABSENSI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-emerald-50 text-[#006c4b] border border-emerald-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">task_alt</span>
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900">Task Overview</h3>
                    <p className="text-[11px] md:text-xs text-slate-500">Statistik penyelesaian tugas mingguan</p>
                  </div>
                </div>
                <span className="text-[10px] md:text-xs font-bold text-[#006c4b] bg-emerald-50 border border-emerald-100 px-2.5 md:px-3 py-1 rounded-full">+18% minggu ini</span>
              </div>

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

          {/* RINGKASAN ABSENSI */}
          <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4 md:mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">badge</span>
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">Ringkasan Absensi</h3>
                  <p className="text-[11px] md:text-xs text-slate-500">Rekap keaktifan bulan September</p>
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

        {/* EXPLORE APPS & FEATURES - macOS Launchpad Style with Premium 3D Icons */}
<div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm border border-slate-200/80">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
        <span className="material-symbols-outlined text-[20px] md:text-[24px]">apps</span>
      </div>
      <div>
        <h3 className="text-sm md:text-base font-bold text-slate-900">Explore Apps & Features</h3>
        <p className="text-[11px] md:text-xs text-slate-500">Utilitas AI cerdas untuk efisiensi kerja harian</p>
      </div>
    </div>

    {/* Kategori Tab Filter ala Launchpad */}
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
      {['All', 'Auto Report', 'Voice AI', 'Productivity', 'Finance', 'AI Tools'].map((cat, idx) => (
        <button
          key={idx}
          type="button"
          className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
            idx === 0 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  </div>
  
  {/* Grid Aplikasi ala Launchpad macOS dengan Rute Sesuai Struktur Folder */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 pt-2 pb-4">
    {[
      {
        id: 1,
        title: 'Presentasi AI',
        category: 'Auto Report',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/9312/9312230.png',
        gradient: 'from-blue-500/20 to-indigo-500/20',
        route: '/dashboard/presentation',
      },
      {
        id: 2,
        title: 'Voice to Note',
        category: 'Voice AI',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/9312/9312277.png',
        gradient: 'from-amber-500/20 to-orange-500/20',
        route: '/dashboard/voice-note',
      },
      {
        id: 3,
        title: 'Auto Planning',
        category: 'AI Tools',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/8635/8635581.png',
        gradient: 'from-fuchsia-500/20 to-pink-500/20',
        route: '/dashboard/autoplan',
      },
      {
        id: 4,
        title: 'Smart Summarizer',
        category: 'AI Tools',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/9431/9431187.png',
        gradient: 'from-emerald-500/20 to-teal-500/20',
        route: '/dashboard/summarizer', // Bisa disesuaikan nanti jika foldernya sudah dibuat
      },
      {
        id: 5,
        title: 'Focus Pomodoro',
        category: 'Productivity',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/8635/8635591.png',
        gradient: 'from-rose-500/20 to-red-500/20',
        route: '/dashboard/pomodoro',
      },
      {
        id: 6,
        title: 'Meeting Minutes',
        category: 'Voice AI',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/9312/9312204.png',
        gradient: 'from-cyan-500/20 to-blue-500/20',
        route: '/dashboard/meeting-minutes',
      },
      {
        id: 7,
        title: 'Expense Tracker',
        category: 'Finance',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/9312/9312154.png',
        gradient: 'from-violet-500/20 to-purple-500/20',
        route: '/dashboard/expense-tracker',
      },
      {
        id: 8,
        title: 'AI Task Generator',
        category: 'Productivity',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/9431/9431252.png',
        gradient: 'from-yellow-500/20 to-amber-500/20',
        route: '/dashboard/task-generator',
      },
    ].map((app) => (
      <div 
        key={app.id} 
        onClick={() => router.push(app.route)}
        className="group flex flex-col items-center cursor-pointer transition-all duration-300"
      >
        {/* Kotak Ikon Squircle ala macOS */}
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[22px] md:rounded-[28px] bg-gradient-to-br ${app.gradient} bg-white backdrop-blur-md shadow-md shadow-slate-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 border border-slate-200/80 relative overflow-hidden p-3 md:p-3.5`}>
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
          
          <img 
            src={app.iconUrl} 
            alt={app.title} 
            className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300" 
          />
        </div>

        {/* Teks Nama Aplikasi */}
        <span className="mt-2.5 text-xs md:text-sm font-semibold text-slate-800 text-center leading-tight group-hover:text-[#006c4b] transition-colors line-clamp-1">
          {app.title}
        </span>

        {/* Label Kategori Kecil */}
        <span className="mt-1 text-[10px] text-slate-400 font-medium line-clamp-1">
          {app.category}
        </span>
      </div>
    ))}
  </div>
</div>

        {/* AGENDA & AKTIVITAS */}
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
                      Agenda & Jadwal Bulan Ini (Klik untuk Kalender)
                    </h3>
                    <p className="text-[11px] md:text-xs text-slate-500">September 2026 — Kelola dan Tambah Agenda</p>
                  </div>
                </div>
                <span className="text-[10px] md:text-xs font-bold text-orange-700 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                  {calendarEvents.length} Agenda Aktif
                </span>
              </div>

              <div className="space-y-3">
                {calendarEvents.slice(0, 3).map((ev, idx) => (
                  <div key={idx} className="p-3.5 md:p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
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
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">history</span>
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900">Aktivitas Terbaru</h3>
                    <p className="text-[11px] md:text-xs text-slate-500">Log pekerjaan hari ini</p>
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
                  <h3 className="text-base md:text-lg font-bold text-slate-900">Kalender & Manajemen Agenda</h3>
                  <p className="text-xs text-slate-500">September 2026 — Pilih Tanggal & Tambah Agenda Baru</p>
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
                  const hasAgenda = calendarEvents.some(ev => ev.date === dateNum);

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
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tambah Agenda Baru untuk Tgl {selectedDate}</h4>
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

      {/* Navigation Bar Universal (Sesuai SettingsPage) */}
      <Navbar activePage="dashboard" />
    </div>
  );
}