'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Langsung arahkan ke halaman login atau dashboard
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f9f9fb]">
      <div className="text-emerald-700 font-medium">Memuat TaskFlow...</div>
    </div>
  );
}