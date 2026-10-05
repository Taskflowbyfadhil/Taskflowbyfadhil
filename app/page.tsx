'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f9f9fb] flex flex-col justify-between text-slate-800">
      {/* Header / Navbar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
            T
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">TaskFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition shadow-sm"
          >
            Daftar Gratis
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-6 border border-emerald-100">
          🚀 Kelola Tugas Menjadi Lebih Mudah
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
          Manage Proyek lebih cepat dan tepat bersama <span className="text-emerald-600">TaskFlow</span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-600 max-w-2xl mb-10">
          Platform manajemen tugas modern yang dirancang untuk membantu Anda dan tim mengorganisasi pekerjaan secara efisien, transparan, dan tanpa hambatan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 text-center"
          >
            Mulai Sekarang — Gratis
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition text-center"
          >
            Sudah punya akun? Masuk
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-400 border-t border-slate-100">
        &copy; {new Date().getFullYear()} TaskFlow. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}