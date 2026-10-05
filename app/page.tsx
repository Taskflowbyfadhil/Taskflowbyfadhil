'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Memberikan jeda splash screen sebentar, lalu langsung arahkan ke halaman login
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 1200); // Jeda 1.2 detik untuk splash screen

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9f9fb]">
      <div className="flex flex-col items-center gap-4">
        {/* Logo atau Icon Splash Screen */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-emerald-600/20 animate-pulse">
          T
        </div>
        <div className="text-slate-800 font-semibold text-lg tracking-tight">
          TaskFlow
        </div>
        <div className="text-emerald-700 font-medium text-sm">
          Memuat aplikasi...
        </div>
      </div>
    </div>
  );
}