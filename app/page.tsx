'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [activeUsersCount, setActiveUsersCount] = useState<number>(1468);
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, text: 'Sarah P. (Jakarta) menyelesaikan Task Sprint #2', time: 'Baru saja' },
    { id: 2, text: 'Dimas P. mencatat laporan kehadiran harian', time: '12 detik lalu' },
    { id: 3, text: 'Riani L. menggunakan AI Agent untuk analisis masalah', time: '28 detik lalu' },
  ]);

  // Simulasi aktivitas live ala sosial media
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsersCount((prev) => {
        const change = Math.floor(Math.random() * 7) - 3;
        const updated = prev + change;
        return updated > 1400 ? updated : 1425;
      });

      const sampleNames = ['Budi S.', 'Siti M.', 'Rizky K.', 'Dewi A.', 'Eko W.', 'Fajar N.'];
      const sampleActions = [
        'membuat task baru via AI Agent',
        'melaporkan kendala proyek di modul Masalah',
        'mengunduh laporan bulanan tim',
        'melakukan absensi masuk via geo-location'
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
    <div className="bg-[#f9f9fb] text-[#1a1c1d] min-h-screen flex flex-col items-center font-sans antialiased selection:bg-[#00b37e] selection:text-[#003d28] overflow-x-hidden relative">
      
      {/* ========================================================= */}
      {/* WIDGET LIVE PENGGUNA AKTIF: MELAYANG TRANSPARAN DI TENGAH-KANAN */}
      {/* ========================================================= */}
      <aside aria-label="Aktivitas Pengguna Real-Time" className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-2.5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl w-72 pointer-events-none transition-all">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">Live Activity</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            {activeUsersCount.toLocaleString()} Online
          </span>
        </div>

        <div className="space-y-2">
          {recentActivities.map((act, idx) => (
            <div 
              key={act.id} 
              className="text-[12px] text-slate-700 dark:text-slate-300 bg-white/40 dark:bg-slate-800/40 p-2.5 rounded-xl border border-white/30 backdrop-blur-sm"
              style={{ opacity: idx === 0 ? 1 : idx === 1 ? 0.75 : 0.4 }}
            >
              <p className="font-medium leading-snug">{act.text}</p>
              <span className="text-[10px] text-slate-500 mt-1 block">{act.time}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Navbar Sederhana */}
      <header className="w-full max-w-6xl px-6 py-6 flex items-center justify-between z-20">
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
          Tingkatkan produktivitas harian Anda dengan fitur AI cerdas, manajemen tugas tanpa batas, dan kolaborasi tim yang efisien dalam satu platform terintegrasi.
        </p>

        {/* Tombol Aksi Utama */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full justify-center max-w-md mb-24">
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
        {/* BAGIAN PENJELASAN FITUR LENGKAP DENGAN MOCKUP PROFESIONAL */}
        {/* ========================================================= */}
        <div className="w-full text-left space-y-24 mb-20">
          
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-[28px] md:text-[36px] font-extrabold text-[#1a1c1d] tracking-tight mb-3">
              Solusi Terintegrasi untuk <span className="text-[#00b37e]">Setiap Kebutuhan Tim</span>
            </h2>
            <p className="text-[15px] text-[#6E717C]">
              Jelajahi modul profesional yang dirancang untuk mengoptimalkan operasional perusahaan dari ujung ke ujung.
            </p>
          </div>

          {/* 1. Modul Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">task_alt</span>
              </div>
              <span className="text-[12px] font-bold text-emerald-600 uppercase tracking-wider">Modul Tasks</span>
              <h3 className="text-[24px] font-bold text-slate-900">Manajemen Tugas Real-Time dengan Papan Kanban</h3>
              <p className="text-[14px] text-[#6E717C] leading-relaxed">
                Pantau progres pengerjaan tugas harian anggota tim dengan drag-and-drop intuitif. Atur prioritas, tenggat waktu, dan lampiran file dalam satu tempat.
              </p>
              <ul className="space-y-2 text-[13px] text-slate-700 font-medium">
                <li className="flex items-center gap-2">✓ Status pengerjaan (To Do, In Progress, Done)</li>
                <li className="flex items-center gap-2">✓ Penugasan multi-user & sub-tugas detail</li>
              </ul>
            </div>
            {/* Mockup Smartphone / Layar Interaktif Tasks */}
            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 p-6 rounded-[32px] shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-bold text-white">📱 Tampilan Layar: Pembuatan Task</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Aktif</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-xs space-y-2">
                  <div className="font-semibold text-emerald-400">✨ Buat Tugas Baru Bersama AI</div>
                  <div className="bg-slate-800 p-2 rounded text-slate-300">"Rancang ulang landing page dan optimalkan SEO mobile..."</div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                    <span>Prioritas: Tinggi</span>
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded">Simpan Task</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Modul Masalah / Issues */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Mockup Smartphone / Layar Masalah */}
            <div className="order-2 md:order-1 bg-gradient-to-tr from-slate-900 to-slate-800 p-6 rounded-[32px] shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl"></div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-bold text-white">📱 Tampilan Layar: Daftar Masalah</span>
                  <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">Urgent</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-amber-400">⚠️ Bug Integrasi Payment Gateway</span>
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Critical</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Callback QRIS timeout pada transaksi jam 10:00 WIB.</p>
                  <div className="text-[10px] text-slate-500 pt-1">Ditugaskan ke: Tim Backend DevOps</div>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2 space-y-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">bug_report</span>
              </div>
              <span className="text-[12px] font-bold text-amber-600 uppercase tracking-wider">Modul Masalah (Issues)</span>
              <h3 className="text-[24px] font-bold text-slate-900">Pelacakan & Penanganan Kendala Sistem Cepat</h3>
              <p className="text-[14px] text-[#6E717C] leading-relaxed">
                Catat, eskalasi, dan selesaikan kendala teknis maupun operasional proyek secara terstruktur. Pastikan tidak ada bug atau hambatan yang terlewat.
              </p>
              <ul className="space-y-2 text-[13px] text-slate-700 font-medium">
                <li className="flex items-center gap-2">✓ Penandaan tingkat keparahan (Low, Medium, Critical)</li>
                <li className="flex items-center gap-2">✓ Riwayat penanganan & audit penyelesaian masalah</li>
              </ul>
            </div>
          </div>

          {/* 3. Modul Laporan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">analytics</span>
              </div>
              <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Modul Laporan (Reports)</span>
              <h3 className="text-[24px] font-bold text-slate-900">Analisis Performa & Ekspor Data Profesional</h3>
              <p className="text-[14px] text-[#6E717C] leading-relaxed">
                Hasilkan laporan analitik produktivitas harian, mingguan, hingga bulanan dalam format grafik interaktif atau unduh instan ke PDF dan Excel.
              </p>
              <ul className="space-y-2 text-[13px] text-slate-700 font-medium">
                <li className="flex items-center gap-2">✓ Grafik pencapaian target proyek secara realtime</li>
                <li className="flex items-center gap-2">✓ Ekspor laporan satu klik untuk manajemen tingkat atas</li>
              </ul>
            </div>
            
            {/* Mockup Smartphone / Layar Laporan */}
            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 p-6 rounded-[32px] shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-bold text-white">📱 Tampilan Layar: Laporan Analitik</span>
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">PDF Ready</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-xs space-y-2">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>Produktivitas Tim Q3</span>
                    <span className="text-emerald-400">+24.5%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-3/4"></div>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1">Total Tugas Selesai: 342 dari 400 Target</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Modul Absensi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Mockup Smartphone / Layar Absensi */}
            <div className="order-2 md:order-1 bg-gradient-to-tr from-slate-900 to-slate-800 p-6 rounded-[32px] shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"></div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-bold text-white">📱 Tampilan Layar: Absensi Karyawan</span>
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">GPS Active</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-purple-400">📍 Check-In Kantor Pusat</span>
                    <span className="text-[10px] text-emerald-400 font-mono">08:15 WIB</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Lokasi terverifikasi dalam radius 20 meter kantor.</p>
                  <div className="w-full bg-purple-600 text-center py-1.5 rounded text-white font-semibold text-[11px]">
                    Status: Hadir Tepat Waktu
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-4">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">fingerprint</span>
              </div>
              <span className="text-[12px] font-bold text-purple-600 uppercase tracking-wider">Modul Absensi</span>
              <h3 className="text-[24px] font-bold text-slate-900">Kehadiran Tim Berbasis Lokasi & Waktu</h3>
              <p className="text-[14px] text-[#6E717C] leading-relaxed">
                Catat kehadiran karyawan secara akurat menggunakan validasi GPS dan timestamp otomatis. Memudahkan pengelolaan absensi remote maupun work from office.
              </p>
              <ul className="space-y-2 text-[13px] text-slate-700 font-medium">
                <li className="flex items-center gap-2">✓ Validasi radius lokasi kantor otomatis</li>
                <li className="flex items-center gap-2">✓ Rekapitulasi ketidakhadiran & cuti terintegrasi</li>
              </ul>
            </div>
          </div>

          {/* 5. Modul AI Agent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
              </div>
              <span className="text-[12px] font-bold text-emerald-600 uppercase tracking-wider">Modul AI Agent</span>
              <h3 className="text-[24px] font-bold text-slate-900">Asisten Pintar Otomasi Proyek Otomatis</h3>
              <p className="text-[14px] text-[#6E717C] leading-relaxed">
                Manfaatkan kecerdasan buatan untuk merancang struktur proyek, memberikan rekomendasi penyelesaian tugas, hingga merangkum diskusi tim dalam hitungan detik.
              </p>
              <ul className="space-y-2 text-[13px] text-slate-700 font-medium">
                <li className="flex items-center gap-2">✓ Pembuatan rincian tugas otomatis via perintah teks</li>
                <li className="flex items-center gap-2">✓ Rekomendasi solusi cepat saat menghadapi kendala</li>
              </ul>
            </div>
            
            {/* Mockup Smartphone / Layar AI Agent */}
            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 p-6 rounded-[32px] shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-bold text-white">📱 Tampilan Layar: AI Assistant</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Online V2.4</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-xs space-y-2">
                  <div className="text-slate-300">🤖 AI: "Halo! Apakah Anda ingin saya buatkan draf tugas untuk peluncuran produk bulan depan?"</div>
                  <div className="bg-emerald-600/20 border border-emerald-500/30 p-2 rounded text-emerald-300">
                    "Ya, buatkan 5 tahapan sprint utama."
                  </div>
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