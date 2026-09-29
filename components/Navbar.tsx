'use client';

import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  activePage: 'dashboard' | 'tasks' | 'masalah' | 'reports' | 'settings';
}

export default function Navbar({ activePage }: NavbarProps) {
  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-1 py-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg md:hidden">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center px-2.5 py-1.5 transition-all ${
            activePage === 'dashboard'
              ? 'bg-emerald-100 text-[#006c4b] rounded-2xl font-bold'
              : 'text-slate-400 hover:text-slate-700 font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span className="text-[10px] mt-0.5">Dashboard</span>
        </Link>

        <Link
          href="/tasks"
          className={`flex flex-col items-center justify-center px-2.5 py-1.5 transition-all ${
            activePage === 'tasks'
              ? 'bg-emerald-100 text-[#006c4b] rounded-2xl font-bold'
              : 'text-slate-400 hover:text-slate-700 font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">task</span>
          <span className="text-[10px] mt-0.5">Task</span>
        </Link>

        <Link
          href="/masalah"
          className={`flex flex-col items-center justify-center px-2.5 py-1.5 transition-all ${
            activePage === 'masalah'
              ? 'bg-emerald-100 text-[#006c4b] rounded-2xl font-bold'
              : 'text-slate-400 hover:text-slate-700 font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">report_problem</span>
          <span className="text-[10px] mt-0.5">Masalah</span>
        </Link>

        {/* Menu Laporan Ditambahkan untuk Mobile */}
        <Link
          href="/reports"
          className={`flex flex-col items-center justify-center px-2.5 py-1.5 transition-all ${
            activePage === 'reports'
              ? 'bg-emerald-100 text-[#006c4b] rounded-2xl font-bold'
              : 'text-slate-400 hover:text-slate-700 font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">bar_chart</span>
          <span className="text-[10px] mt-0.5">Laporan</span>
        </Link>

        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center px-2.5 py-1.5 transition-all ${
            activePage === 'settings'
              ? 'bg-emerald-100 text-[#006c4b] rounded-2xl font-bold'
              : 'text-slate-400 hover:text-slate-700 font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="text-[10px] mt-0.5">Settings</span>
        </Link>
      </nav>

      {/* Desktop / Tablet Floating Bottom Dock Navigation */}
      <div className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <nav className="flex items-center gap-2 bg-white/90 backdrop-blur-md p-2 rounded-full border border-slate-200 shadow-xl shadow-slate-200/50">
          <Link
            href="/dashboard"
            className={`text-xs font-semibold flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
              activePage === 'dashboard'
                ? 'bg-[#00b37e] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span> Dashboard
          </Link>

          <Link
            href="/tasks"
            className={`text-xs font-semibold flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
              activePage === 'tasks'
                ? 'bg-[#00b37e] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">task</span> Task
          </Link>

          <Link
            href="/masalah"
            className={`text-xs font-semibold flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
              activePage === 'masalah'
                ? 'bg-[#00b37e] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">report_problem</span> Masalah
          </Link>

          {/* Menu Laporan Ditambahkan untuk Desktop */}
          <Link
            href="/reports"
            className={`text-xs font-semibold flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
              activePage === 'reports'
                ? 'bg-[#00b37e] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">bar_chart</span> Laporan
          </Link>

          <Link
            href="/settings"
            className={`text-xs font-semibold flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
              activePage === 'settings'
                ? 'bg-[#00b37e] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">settings</span> Settings
          </Link>
        </nav>
      </div>
    </>
  );
}