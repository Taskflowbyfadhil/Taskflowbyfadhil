'use client';

import React from 'react';

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-40 bg-[#f9f9fb]/80 backdrop-blur-md flex items-center justify-between px-5 md:px-8 pb-3.5 pt-[calc(env(safe-area-inset-top)+14px)] border-b border-slate-200/60">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#006c4b] text-white flex items-center justify-center font-bold text-base shadow-sm">
          TF
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-[#006c4b]">TaskFlow</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm" aria-label="Cari">
          <span className="material-symbols-outlined text-[#006c4b] text-[20px]">search</span>
        </button>
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-100 text-[#006c4b] border border-emerald-300 font-bold flex items-center justify-center text-sm">
          A
        </div>
      </div>
    </header>
  );
}