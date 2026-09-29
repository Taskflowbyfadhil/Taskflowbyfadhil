'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoPlanPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'current' | 'nextMonth'>('current');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Selesai' | 'Berjalan' | 'Menunggu'>('all');

  // Data Rencana Bulan Ini (4 Minggu)
  const currentPlans = [
    { week: 'Minggu 1', focus: 'Optimasi Database & Perbaikan Bug Kritis', status: 'Selesai', issuesHandled: 4, source: 'Laporan Bug #102' },
    { week: 'Minggu 2', focus: 'Implementasi Fitur Autentikasi OAuth 2.0', status: 'Berjalan', issuesHandled: 2, source: 'Task Backlog Sprint' },
    { week: 'Minggu 3', focus: 'Uji Coba Performa (Stress Testing) & Keamanan', status: 'Menunggu', issuesHandled: 3, source: 'Review Keamanan Bulanan' },
    { week: 'Minggu 4', focus: 'Peluncuran Pembaruan (Deployment to Production)', status: 'Menunggu', issuesHandled: 1, source: 'Release Plan Q3' },
  ];

  // Data Rekomendasi Rencana 1 Bulan ke Depan (Berdasarkan Tren Task, Laporan, & Masalah)
  const nextMonthPlans = [
    { week: 'Bulan Depan - M1', focus: 'Scaling Server & Mitigasi Bottleneck Latensi API', status: 'Menunggu', issuesHandled: 6, source: 'Analisis Log & Laporan Server' },
    { week: 'Bulan Depan - M2', focus: 'Redesain UI Dashboard Berdasarkan Feedback Pengguna', status: 'Menunggu', issuesHandled: 5, source: 'Task UX Research & Tiket CS' },
    { week: 'Bulan Depan - M3', focus: 'Automasi Unit Testing & Integrasi CI/CD Pipeline', status: 'Menunggu', issuesHandled: 3, source: 'Laporan Quality Assurance' },
    { week: 'Bulan Depan - M4', focus: 'Audit Keamanan Lanjutan & Penutupan Celah CORS/XSS', status: 'Menunggu', issuesHandled: 4, source: 'Laporan Pentest Eksternal' },
  ];

  const activePlans = activeTab === 'current' ? currentPlans : nextMonthPlans;
  const filteredPlans = statusFilter === 'all' 
    ? activePlans 
    : activePlans.filter(p => p.status === statusFilter);

  const completedCount = currentPlans.filter(p => p.status === 'Selesai').length;
  const totalIssuesIdentified = [...currentPlans, ...nextMonthPlans].reduce((acc, curr) => acc + curr.issuesHandled, 0);
  const overallProgress = Math.round((completedCount / currentPlans.length) * 100);

  return (
    <div className="bg-[#f8fafc] text-[#1a1c1d] min-h-screen font-sans pb-24">
      <main className="pt-6 md:pt-10 px-4 md:px-8 max-w-5xl mx-auto space-y-6">

        {/* HEADER & TOMBOL KEMBALI */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] md:text-xs font-semibold mb-2 border border-purple-200">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              Smart AI Planning & Issue Analytics
            </div>
            <h1 className="text-xl md:text-3xl font-black tracking-tight text-slate-900">Auto Plan (Smart Planning)</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Rencana kerja otomatis berbasis tren tugas, laporan operasional, dan eskalasi masalah.
            </p>
          </div>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Kembali ke Dashboard</span>
          </button>
        </div>

        {/* STATISTIK RINGKASAN */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl">
              <span className="material-symbols-outlined">track_changes</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Agenda</p>
              <h3 className="text-xl font-black text-slate-900">{currentPlans.length} Minggu</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Selesai</p>
              <h3 className="text-xl font-black text-slate-900">{completedCount} Agenda</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl">
              <span className="material-symbols-outlined">bug_report</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Masalah/Isu</p>
              <h3 className="text-xl font-black text-slate-900">{totalIssuesIdentified} Isu Teratasi</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
              <span className="material-symbols-outlined">donut_large</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pencapaian</p>
              <h3 className="text-xl font-black text-slate-900">{overallProgress}%</h3>
            </div>
          </div>
        </div>

        {/* KONTROL UTAMA & TAB PERIODE */}
        <div className="bg-white p-6 md:p-8 rounded-[28px] md:rounded-[32px] shadow-sm border border-slate-200/80 space-y-6">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900">Rekomendasi Rencana Kerja & Analisis</h3>
              <p className="text-xs text-slate-400 mt-0.5">Pilih rentang waktu untuk melihat rincian rencana berdasarkan task & laporan.</p>
            </div>

            {/* Tombol Pemilihan Periode Utama */}
            <div className="flex items-center gap-2 bg-purple-50/60 p-1.5 rounded-2xl border border-purple-100">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'current'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-700 hover:bg-purple-100/60'
                }`}
              >
                Bulan Ini (Aktif)
              </button>
              <button
                onClick={() => setActiveTab('nextMonth')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'nextMonth'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-700 hover:bg-purple-100/60'
                }`}
              >
                1 Bulan ke Depan (Outlook)
              </button>
            </div>
          </div>

          {/* Sub-filter Status */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <span className="text-xs font-bold text-slate-700">
              Menampilkan Rencana: <span className="text-purple-600">{activeTab === 'current' ? 'Bulan Berjalan' : 'Proyeksi 1 Bulan Kedepan'}</span>
            </span>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
              {(['all', 'Berjalan', 'Selesai', 'Menunggu'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st === 'all' ? 'Semua' : st}
                </button>
              ))}
            </div>
          </div>

          {/* DAFTAR RENCANA KERJA */}
          <div className="space-y-3.5">
            {filteredPlans.length > 0 ? (
              filteredPlans.map((p, idx) => (
                <div 
                  key={idx} 
                  className="group p-4 md:p-5 bg-slate-50 hover:bg-slate-50/80 rounded-2xl border border-slate-200/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:shadow-sm"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[11px] font-extrabold uppercase tracking-wider">
                        {p.week}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Sumber: <span className="text-slate-700 font-semibold">{p.source}</span>
                      </span>
                      <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">warning</span> {p.issuesHandled} Isu Terkait
                      </span>
                    </div>
                    <h4 className="text-sm md:text-base font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                      {p.focus}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      p.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      p.status === 'Berjalan' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Tidak ada agenda untuk filter status ini.
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}