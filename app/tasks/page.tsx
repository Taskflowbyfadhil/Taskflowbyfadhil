'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

export interface Task {
  id: string;
  title: string;
  category: string;
  color: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  description?: string;
  assignees?: string[];
}

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Redesign Mobile App UI',
    category: 'delivery-app',
    color: '#00B37E',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-09-21',
    description: 'Perbarui tata letak halaman utama',
    assignees: ['Alex', 'Sarah'],
  },
  {
    id: '2',
    title: 'Integrasi Payment Gateway',
    category: 'marketing',
    color: '#6C5CE7',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-09-25',
    description: 'Pasang Midtrans di checkout',
    assignees: ['Budi'],
  },
  {
    id: '3',
    title: 'Fix Dynamic Route Errors',
    category: 'internal',
    color: '#FF5733',
    status: 'done',
    priority: 'high',
    dueDate: '2026-09-21',
    description: 'Selesaikan masalah params Next 15',
    assignees: ['Alex'],
  },
];

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  // State Filter & Search
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Kalender State
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth()); 

  // State untuk Data Hari Libur Nasional Otomatis dengan Fallback
  const [holidays, setHolidays] = useState<Record<string, string>>({});
  const [loadingHolidays, setLoadingHolidays] = useState<boolean>(false);

  // State untuk Keterangan Teks di Bawah Kalender saat Tanggal diklik
  const [clickedDateInfo, setClickedDateInfo] = useState<{ dateStr: string; info: string } | null>(null);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  // Fetch hari libur nasional otomatis dengan fallback aman jika gagal fetch
  useEffect(() => {
    async function fetchHolidays() {
      setLoadingHolidays(true);
      try {
        const response = await fetch(`https://api-harilibur.vercel.app/api?year=${currentYear}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        const holidayMap: Record<string, string> = {};
        if (Array.isArray(data)) {
          data.forEach((item: { holiday_date: string; holiday_name: string; is_national_holiday: boolean }) => {
            if (item.is_national_holiday) {
              holidayMap[item.holiday_date] = item.holiday_name;
            }
          });
        }
        setHolidays(holidayMap);
      } catch (error) {
        console.warn('Gagal mengambil API libur online, menggunakan data offline/cadangan.', error);
        
        if (currentYear === 2026) {
          setHolidays({
            '2026-01-01': 'Tahun Baru Masehi',
            '2026-01-16': 'Isra Mikraj Nabi Muhammad SAW',
            '2026-02-17': 'Tahun Baru Imlek',
            '2026-03-19': 'Hari Suci Nyepi',
            '2026-03-21': 'Hari Raya Idulfitri 1447H',
            '2026-03-22': 'Hari Raya Idulfitri 1447H',
            '2026-05-01': 'Hari Buruh Internasional',
            '2026-05-14': 'Kenaikan Yesus Kristus',
            '2026-05-27': 'Hari Raya Iduladha',
            '2026-05-31': 'Hari Raya Waisak',
            '2026-06-01': 'Hari Lahir Pancasila',
            '2026-06-16': 'Tahun Baru Islam',
            '2026-08-17': 'Proklamasi Kemerdekaan RI',
            '2026-08-25': 'Maulid Nabi Muhammad SAW',
            '2026-12-25': 'Hari Raya Natal',
          });
        } else {
          setHolidays({});
        }
      } finally {
        setLoadingHolidays(false);
      }
    }

    fetchHolidays();
  }, [currentYear]);

  // Fungsi navigasi bulan
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Map task berdasarkan tanggal untuk kalender bulanan
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      if (!map[t.dueDate]) map[t.dueDate] = [];
      map[t.dueDate].push(t);
    });
    return map;
  }, [tasks]);

  // Generate Hari dalam 1 Bulan penuh untuk Kalender Bulanan Desktop/Tablet
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = [];
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ dayNum: prevMonthDays - i, dateStr: '', isCurrentMonth: false });
    }

    for (let i = 1; i <= totalDays; i++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(i).padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
      days.push({ dayNum: i, dateStr, isCurrentMonth: true });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Logic Filtering Otomatis
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (selectedStatusFilter !== 'all' && task.status !== selectedStatusFilter) return false;
      if (selectedCategoryFilter !== 'all' && task.category !== selectedCategoryFilter) return false;
      if (selectedDate && task.dueDate !== selectedDate) return false;
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [tasks, selectedStatusFilter, selectedCategoryFilter, selectedDate, searchQuery]);

  // Statistik Ringkasan Data Task
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    return { total, completed, inProgress, todo };
  }, [tasks]);

  const handleDateClick = (dateStr: string, holidayName?: string, isSunday?: boolean) => {
    if (!dateStr) return;
    
    if (selectedDate === dateStr) {
      setSelectedDate('');
      setClickedDateInfo(null);
    } else {
      setSelectedDate(dateStr);
      
      let info = 'Hari kerja biasa (Bukan tanggal merah/libur)';
      if (holidayName) {
        info = `Libur Nasional: ${holidayName}`;
      } else if (isSunday) {
        info = 'Hari Minggu (Libur Mingguan)';
      }

      setClickedDateInfo({
        dateStr: new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        info: info,
      });
    }
  };

  const handleResetFilters = () => {
    setSelectedStatusFilter('all');
    setSelectedCategoryFilter('all');
    setSelectedDate('');
    setClickedDateInfo(null);
    setSearchQuery('');
  };

  const handleDeleteTask = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus task ini?');
    if (!confirmDelete) return;

    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' }).catch(() => {});
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus task.');
    }
  };

  return (
    <div className="bg-[#f8fafc] text-[#1e293b] min-h-screen font-sans pb-32">
      {/* ----------------- TOP HEADER ----------------- */}
      <Header />

      {/* ----------------- MAIN CONTENT AREA ----------------- */}
      <main className="pt-6 md:pt-10 px-4 md:px-8 max-w-7xl mx-auto space-y-8">

        {/* 1. HEADER HALAMAN & TOMBOL AKSI */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-[28px] border border-slate-200/80 shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold mb-1 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Workspace Tugas Tim
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Task Management</h2>
            <p className="text-xs md:text-sm text-slate-500">Kelola tugas harian, tinjau progres bulanan, dan filter prioritas tim Anda.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/tasks/new"
              className="bg-[#006c4b] hover:bg-[#005137] text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm shadow-emerald-900/10 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Task Baru</span>
            </Link>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">assignment</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Task</p>
              <h3 className="text-xl font-black text-slate-900">{stats.total}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">To Do</p>
              <h3 className="text-xl font-black text-slate-900">{stats.todo}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">autorenew</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">In Progress</p>
              <h3 className="text-xl font-black text-slate-900">{stats.inProgress}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Selesai (Done)</p>
              <h3 className="text-xl font-black text-slate-900">{stats.completed}</h3>
            </div>
          </div>
        </div>

        {/* 2. LAYOUT UTAMA: KALENDER BULANAN & DAFTAR TASK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* SISI KIRI: KALENDER 1 BULAN PENUH + NAVIGASI BULAN & KETERANGAN DI BAWAH */}
          <div className="lg:col-span-5 bg-white rounded-[28px] p-6 shadow-xs border border-slate-200/80 space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#006c4b] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">calendar_month</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 capitalize">
                  {new Date(currentYear, currentMonth).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </h3>
              </div>
              
              {/* Tombol Navigasi Bulan */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1 rounded-lg hover:bg-white text-slate-600 transition-all cursor-pointer shadow-2xs"
                  title="Bulan Sebelumnya"
                >
                  <span className="material-symbols-outlined text-sm leading-none">chevron_left</span>
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-1 rounded-lg hover:bg-white text-slate-600 transition-all cursor-pointer shadow-2xs"
                  title="Bulan Berikutnya"
                >
                  <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Status sinkronisasi libur */}
            <div className="text-[11px] text-slate-500 flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
              <span className="font-medium">{loadingHolidays ? "Memuat hari libur..." : "🎉 Libur Nasional Tersinkronisasi"}</span>
              {selectedDate && (
                <button
                  onClick={handleResetFilters}
                  className="font-bold text-[#006c4b] hover:underline cursor-pointer"
                >
                  Reset Tanggal
                </button>
              )}
            </div>

            {/* Header Hari Kalender Bulanan */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-slate-400 uppercase tracking-wider pb-1">
              <span>Min</span>
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span>Jum</span>
              <span>Sab</span>
            </div>

            {/* Grid Tanggal 1 Bulan */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {calendarDays.map((item, index) => {
                if (!item.isCurrentMonth) {
                  return <div key={index} className="py-2.5 opacity-20 text-xs text-slate-300">-</div>;
                }

                const isToday = item.dateStr === todayStr;
                const isSelected = item.dateStr === selectedDate;
                const dayTasks = tasksByDate[item.dateStr] || [];
                const hasTask = dayTasks.length > 0;
                const holidayName = holidays[item.dateStr];
                const isSunday = new Date(item.dateStr).getDay() === 0;

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(item.dateStr, holidayName, isSunday)}
                    title={holidayName ? `Libur: ${holidayName}` : isSunday ? 'Hari Minggu' : 'Klik untuk lihat detail'}
                    className={`relative flex flex-col items-center justify-between p-1.5 rounded-2xl border transition-all active:scale-95 min-h-[60px] cursor-pointer ${
                      isSelected
                        ? 'bg-[#006c4b] text-white border-[#006c4b] shadow-md font-bold'
                        : holidayName || isSunday
                        ? 'bg-rose-50/80 border-rose-200 text-rose-700 hover:bg-rose-100'
                        : isToday
                        ? 'bg-emerald-50 border-emerald-300 text-[#006c4b] font-bold'
                        : hasTask
                        ? 'bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-300 font-semibold'
                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-xs ${holidayName ? 'font-extrabold text-rose-600' : ''}`}>{item.dayNum}</span>
                    
                    {holidayName ? (
                      <span className="text-[8px] leading-tight font-medium bg-rose-100 text-rose-700 px-1 py-0.5 rounded line-clamp-2 w-full mt-1">
                        {holidayName}
                      </span>
                    ) : hasTask ? (
                      <div className="flex items-center gap-0.5 mt-1">
                        {dayTasks.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#006c4b]'}`}
                          />
                        ))}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Keterangan Teks Kecil Dinamis di Bawah Kalender */}
            <div className="pt-2 border-t border-slate-100 min-h-[40px] flex items-center">
              {clickedDateInfo ? (
                <p className="text-[11px] text-slate-700 font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full flex items-center justify-between">
                  <span>📅 <strong className="text-slate-900">{clickedDateInfo.dateStr}:</strong> {clickedDateInfo.info}</span>
                  <button 
                    onClick={() => { setSelectedDate(''); setClickedDateInfo(null); }}
                    className="text-rose-600 hover:underline text-[10px] font-bold shrink-0 ml-2 cursor-pointer"
                  >
                    Tutup
                  </button>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 italic text-center w-full">
                  * Klik tanggal pada kalender untuk melihat informasi libur nasional atau filter tugas harian.
                </p>
              )}
            </div>
          </div>

          {/* SISI KANAN: FILTER BAR & DAFTAR TASK */}
          <div className="lg:col-span-7 space-y-6">

            {/* FILTER & SEARCH BAR */}
            <div className="bg-white rounded-[24px] p-5 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#006c4b]"
                >
                  <option value="all">Semua Status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#006c4b]"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="delivery-app">Delivery App</option>
                  <option value="marketing">Marketing</option>
                  <option value="internal">Internal Tools</option>
                </select>

                {(selectedStatusFilter !== 'all' || selectedCategoryFilter !== 'all' || selectedDate || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 cursor-pointer"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Cari task..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#006c4b]"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                  search
                </span>
              </div>
            </div>

            {/* DAFTAR TASK CARD */}
            <div className="bg-white rounded-[28px] p-6 shadow-xs border border-slate-200/80 flex flex-col gap-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006c4b]">format_list_bulleted</span>
                  Daftar Task ({filteredTasks.length})
                </h3>
                {selectedDate && (
                  <span className="text-xs bg-emerald-50 text-[#006c4b] border border-emerald-100 px-3 py-1 rounded-full font-bold">
                    Filter Tgl: {selectedDate} {holidays[selectedDate] ? `(${holidays[selectedDate]})` : ''}
                  </span>
                )}
              </div>

              {filteredTasks.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">task</span>
                  <p className="text-xs font-medium">Tidak ada task yang cocok dengan kriteria filter atau tanggal tersebut.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {filteredTasks.map((task) => (
                    <Link
                      key={task.id}
                      href={`/tasks/${task.id}`}
                      className="group p-4.5 bg-slate-50 hover:bg-emerald-50/20 rounded-2xl border border-slate-200/70 hover:border-[#006c4b] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-sm cursor-pointer"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 overflow-hidden">
                        <div
                          className="w-2.5 h-12 rounded-full shrink-0 mt-0.5 sm:mt-0"
                          style={{ backgroundColor: task.color }}
                        />
                        <div className="flex flex-col overflow-hidden space-y-1">
                          <span className="text-sm md:text-base font-bold text-slate-800 group-hover:text-[#006c4b] truncate transition-colors">
                            {task.title}
                          </span>
                          {task.description && (
                            <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap pt-0.5">
                            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                              {task.category}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-medium">
                              <span className="material-symbols-outlined text-[13px]">event</span>
                              {task.dueDate}
                            </span>
                            {task.assignees && task.assignees.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-slate-600">
                                  <span className="material-symbols-outlined text-[13px]">group</span>
                                  {task.assignees.join(', ')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                        <span
                          className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            task.status === 'done'
                              ? 'bg-emerald-100 text-emerald-700'
                              : task.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {task.status}
                        </span>

                        <div className="flex items-center gap-1">
                          <span className="p-2 rounded-xl text-slate-400 group-hover:text-[#006c4b] group-hover:bg-white transition-all border border-transparent group-hover:border-slate-200" title="Edit Detail Task">
                            <span className="material-symbols-outlined text-base">edit</span>
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteTask(e, task.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-200 cursor-pointer"
                            title="Hapus Task"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* ----------------- UNIVERSAL BOTTOM NAVIGATION ----------------- */}
      <Navbar activePage="tasks" />
    </div>
  );
}