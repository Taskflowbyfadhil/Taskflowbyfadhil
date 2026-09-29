'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [activeUsersCount, setActiveUsersCount] = useState(1468);
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, text: 'Sarah P. menyelesaikan Task #104', time: 'Baru saja' },
    { id: 2, text: 'Dimas P. mencatat Laporan Kehadiran', time: '5 detik lalu' },
    { id: 3, text: 'Riani L. menggunakan AI Agent', time: '12 detik lalu' },
  ]);

  // Simulasi aktivitas live & counter pengguna aktif
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsersCount((prev) => {
        const change = Math.floor(Math.random() * 7) - 3;
        const updated = prev + change;
        return updated > 1400 ? updated : 1420;
      });

      const sampleNames = ['Budi S.', 'Siti M.', 'Rizky K.', 'Dewi A.', 'Eko W.', 'Fajar N.'];
      const sampleActions = [
        'membuat Task baru',
        'melaporkan Masalah (Issue)',
        'mengunduh Laporan Bulanan',
        'melakukan Absensi Karyawan',
        'berinteraksi dengan AI Agent'
      ];
      
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomAction = sampleActions[Math.floor(Math.random() * sampleActions.length)];

      setRecentActivities((prev) => [
        { id: Date.now(), text: `${randomName} ${randomAction}`, time: 'Baru saja' },
        prev[0],
        prev[1]
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center relative selection:bg-[#00b37e] selection:text-white">
      {/* External CSS for Google Material Icons */}
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" 
      />

      {/* ========================================================= */}
      {/* FLOATING TRANSPARENT LIVE ACTIVITY (TENGAH KANAN)          */}
      {/* ========================================================= */}
      <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-2.5 pointer-events-none max-w-[280px]">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 text-white px-3.5 py-2 rounded-2xl shadow-lg flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider">Live Activity</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">{activeUsersCount} Online</span>
        </div>

        {recentActivities.map((act, idx) => (
          <div 
            key={act.id}
            className="pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 text-slate-900 dark:text-white px-4 py-3 rounded-2xl shadow-xl flex flex-col gap-1 transition-all duration-500 animate-pulse"
            style={{ opacity: idx === 0 ? 1 : idx === 1 ? 0.75 : 0.5 }}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00b37e]"></span>
              <p className="text-[12px] font-semibold leading-snug">{act.text}</p>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono self-end">{act.time}</span>
          </div>
        ))}
      </div>

      {/* Navbar Sederhana */}
      <header className="w-full max-w-6xl px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 50"
            fill="none"
            className="h-8 w-auto"
          >
            <g transform="translate(10, 5)">
              <path
                d="M4 22L12 30L28 10"
                stroke="#00B37E"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22L20 30L36 10"
                stroke="#00B37E"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
            </g>
            <text
              x="60"
              y="32"
              fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
              fontSize="24"
              fontWeight="800"
              fill="#0F0F0F"
              letterSpacing="-0.5px"
            >
              Task<tspan fill="#00B37E">Flow</tspan>
            </text>
          </svg>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/pricing')}
            className="text-[13px] font-semibold text-[#1a1c1d] hover:text-[#00b37e] transition-colors px-4 py-2 cursor-pointer"
          >
            Harga / Paket
          </button>
          <button
            onClick={() => router.push('/pricing')}
            className="bg-[#1a1c1d] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
          >
            Mulai Sekarang
          </button>
        </div>
      </header>

      {/* Hero Section Utama */}
      <main className="w-full max-w-5xl px-6 py-12 md:py-20 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2 bg-[#00b37e]/10 text-[#006c4b] text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00b37e] animate-pulse"></span>
          Resmi Diluncurkan — Akses Seumur Hidup Tersedia!
        </div>

        <h1 className="text-[36px] md:text-[56px] font-extrabold text-[#1a1c1d] tracking-tight max-w-3xl leading-[1.15] mb-6">
          Kelola Proyek & Tugas Tim Lebih Cepat dengan <span className="text-[#00b37e]">TaskFlow</span>
        </h1>

        <p className="text-[16px] md:text-[18px] text-[#6E717C] max-w-2xl mb-10 leading-relaxed">
          Platform produktivitas lengkap dengan manajemen tugas, pelacakan masalah, absensi, laporan mendalam, dan AI Agent cerdas dalam satu sistem terpadu.
        </p>

        {/* Tombol Aksi Utama */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full justify-center max-w-md mb-20">
          <button
            onClick={() => router.push('/pricing')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-[14px] font-semibold text-white bg-[#1a1c1d] hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Lihat Pilihan Paket</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-[14px] font-semibold text-[#1a1c1d] bg-white border border-[#e2e2e4] hover:bg-[#f3f3f5] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>Masuk ke Dashboard (Tamu)</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* BAGIAN PENJELASAN FITUR LENGKAP TASKFLOW                  */}
        {/* ========================================================= */}
        <div className="w-full mt-4 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-[28px] md:text-[36px] font-extrabold text-[#1a1c1d] tracking-tight mb-3">
              Semua Fitur Unggulan untuk Kebutuhan Tim Anda
            </h2>
            <p className="text-[15px] text-[#6E717C] max-w-xl mx-auto">
              Dirancang khusus untuk menghapus batasan operasional dan memaksimalkan efisiensi perusahaan atau startup Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            
            {/* 1. Tasks & Proyek */}
            <div className="bg-white border border-[#e2e2e4] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-emerald-50 text-[#00b37e] rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[24px]">task_alt</span>
                </div>
                <h3 className="text-[18px] font-bold text-[#1a1c1d] mb-2">Manajemen Tugas (Tasks)</h3>
                <p className="text-[13px] text-[#6E717C] leading-relaxed mb-4">
                  Atur daftar pekerjaan, tetapkan prioritas, tenggat waktu (deadline), dan pantau status pengerjaan anggota tim secara real-time.
                </p>
              </div>
              <span className="text-[12px] font-semibold text-[#00b37e] flex items-center gap-1">
                <span>Kelola tugas harian</span>
                <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
              </span>
            </div>

            {/* 2. Masalah / Issues Tracker */}
            <div className="bg-white border border-[#e2e2e4] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[24px]">bug_report</span>
                </div>
                <h3 className="text-[18px] font-bold text-[#1a1c1d] mb-2">Pelacakan Masalah (Issues)</h3>
                <p className="text-[13px] text-[#6E717C] leading-relaxed mb-4">
                  Catat, laporkan, dan selesaikan kendala teknis atau kendala proyek secara terstruktur dengan sistem tiket dan tingkat keparahan.
                </p>
              </div>
              <span className="text-[12px] font-semibold text-rose-600 flex items-center gap-1">
                <span>Selesaikan kendala cepat</span>
                <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
              </span>
            </div>

            {/* 3. Laporan (Reports) */}
            <div className="bg-white border border-[#e2e2e4] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[24px]">bar_chart</span>
                </div>
                <h3 className="text-[18px] font-bold text-[#1a1c1d] mb-2">Laporan Komprehensif</h3>
                <p className="text-[13px] text-[#6E717C] leading-relaxed mb-4">
                  Dapatkan analitik visual dan ringkasan performa produktivitas mingguan maupun bulanan untuk bahan evaluasi bisnis.
                </p>
              </div>
              <span className="text-[12px] font-semibold text-blue-600 flex items-center gap-1">
                <span>Analisis data akurat</span>
                <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
              </span>
            </div>

            {/* 4. Absensi Kehadiran */}
            <div className="bg-white border border-[#e2e2e4] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[24px]">badge</span>
                </div>
                <h3 className="text-[18px] font-bold text-[#1a1c1d] mb-2">Absensi & Kehadiran Tim</h3>
                <p className="text-[13px] text-[#6E717C] leading-relaxed mb-4">
                  Pantau jam masuk, izin, cuti, dan kehadiran karyawan secara terpusat dengan riwayat catatan digital yang transparan.
                </p>
              </div>
              <span className="text-[12px] font-semibold text-amber-600 flex items-center gap-1">
                <span>Pantau presensi tim</span>
                <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
              </span>
            </div>

            {/* 5. AI Agent Cerdas */}
            <div className="bg-white border border-[#e2e2e4] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[24px]">smart_toy</span>
                </div>
                <h3 className="text-[18px] font-bold text-[#1a1c1d] mb-2">AI Agent Otomasi</h3>
                <p className="text-[13px] text-[#6E717C] leading-relaxed mb-4">
                  Asisten pintar yang siap membantu merumuskan rincian tugas, merangkum dokumen laporan, hingga memberikan ide solusi proyek.
                </p>
              </div>
              <span className="text-[12px] font-semibold text-purple-600 flex items-center gap-1">
                <span>Gunakan asisten AI</span>
                <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
              </span>
            </div>

            {/* 6. Kolaborasi & Lainnya */}
            <div className="bg-white border border-[#e2e2e4] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[24px]">groups</span>
                </div>
                <h3 className="text-[18px] font-bold text-[#1a1c1d] mb-2">Kolaborasi & Integrasi</h3>
                <p className="text-[13px] text-[#6E717C] leading-relaxed mb-4">
                  Undang anggota tim tanpa batas, sinkronisasi jadwal, dan pembayaran langganan/lifetime via QRIS instan yang aman.
                </p>
              </div>
              <span className="text-[12px] font-semibold text-indigo-600 flex items-center gap-1">
                <span>Maksimalkan kolaborasi</span>
                <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
              </span>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* TESTIMONI PENGGUNA DENGAN INISIAL                         */}
        {/* ========================================================= */}
        <div className="w-full mt-6 mb-16 pt-10 border-t border-[#e2e2e4] flex flex-col items-center">
          <div className="text-center mb-10">
            <h3 className="text-[22px] md:text-[26px] font-extrabold text-[#1a1c1d] tracking-tight mb-2">
              Apa Kata Pengguna Tentang TaskFlow?
            </h3>
            <p className="text-[13px] text-[#6E717C]">Ulasan langsung dari komunitas profesional yang sedang aktif online.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="bg-white border border-[#e2e2e4] rounded-[22px] p-5 shadow-sm text-left flex flex-col justify-between transition-transform duration-500 hover:-translate-y-2">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed mb-4">
                  &ldquo;Gila sih, fitur AI untuk breakdown tugasnya ngebantu banget bikin perencanaan sprint mingguan tim jadi super cepat.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-[13px] flex items-center justify-center shadow-sm">
                  SP
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-slate-900">Sarah Puspita</h4>
                  <span className="text-[11px] text-emerald-600 font-medium">Verified User</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e2e2e4] rounded-[22px] p-5 shadow-sm text-left flex flex-col justify-between transition-transform duration-500 hover:-translate-y-2">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed mb-4">
                  &ldquo;Tampilan bersih, ringan, dan opsi akses seumur hidupnya sangat worth it buat freelancer kayak saya tanpa beban bulanan.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-[13px] flex items-center justify-center shadow-sm">
                  DP
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-slate-900">Dimas Pratama</h4>
                  <span className="text-[11px] text-blue-600 font-medium">Verified User</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e2e2e4] rounded-[22px] p-5 shadow-sm text-left flex flex-col justify-between transition-transform duration-500 hover:-translate-y-2">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">&#x2605;</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed mb-4">
                  &ldquo;Manajemen proyek jadi sangat transparan. Semua anggota tim bisa memantau progres tugas secara real-time tanpa ribet.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-[13px] flex items-center justify-center shadow-sm">
                  RL
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-slate-900">Riani Lestari</h4>
                  <span className="text-[11px] text-purple-600 font-medium">Verified User</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl px-6 py-10 border-t border-[#e2e2e4] mt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#6E717C] z-10">
        <p>© 2026 TaskFlow Indonesia. Hak cipta dilindungi.</p>
        <div className="flex items-center gap-6">
          <a href="/privacy" className="hover:text-[#1a1c1d] transition-colors">Kebijakan Privasi</a>
          <a href="/terms" className="hover:text-[#1a1c1d] transition-colors">Syarat & Ketentuan</a>
          <a href="/pricing" className="hover:text-[#1a1c1d] transition-colors">Harga</a>
        </div>
      </footer>

    </div>
  );
}