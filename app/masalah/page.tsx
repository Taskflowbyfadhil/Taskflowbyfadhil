'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

export interface Issue {
  id: string;
  title: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'unsolved' | 'in-investigation' | 'solved';
  reportedDate: string;
  reportedBy: string;
  assignee: string;
  description: string;
  solutionSuggestion: string;
  resolvedDate?: string;
}

const INITIAL_ISSUES: Issue[] = [
  {
    id: 'ISS-001',
    title: 'Gagal koneksi API Midtrans saat Checkout',
    category: 'Payment',
    severity: 'critical',
    status: 'in-investigation',
    reportedDate: '2026-09-20',
    reportedBy: 'Budi',
    assignee: 'Tim Backend',
    description: 'Callback webhook sering timeout ketika traffic melonjak tinggi.',
    solutionSuggestion: 'Tingkatkan batas timeout server dan implementasikan antrean (queue) webhook.',
  },
  {
    id: 'ISS-002',
    title: 'Layout bergeser di Safari iOS versi lama',
    category: 'UI/UX',
    severity: 'medium',
    status: 'unsolved',
    reportedDate: '2026-09-21',
    reportedBy: 'Sarah',
    assignee: 'Alex',
    description: 'Tombol submit tertutup keyboard bawaan di iPhone versi 14.',
    solutionSuggestion: 'Tambahkan padding dinamis atau gunakan event resize window pada CSS flexbox.',
  },
  {
    id: 'ISS-003',
    title: 'Error 500 pada export data laporan bulanan',
    category: 'Backend',
    severity: 'high',
    status: 'solved',
    reportedDate: '2026-09-18',
    reportedBy: 'Alex',
    assignee: 'Budi',
    description: 'Memory limit terlampaui saat memproses lebih dari 10.000 baris data.',
    solutionSuggestion: 'Gunakan teknik chunking / streaming data saat melakukan export excel.',
    resolvedDate: '2026-09-19',
  },
];

export default function MasalahPage() {
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State Daftar Kategori yang Bersifat Dinamis (Bisa Ditambah & Dihapus)
  const [categories, setCategories] = useState<string[]>([
    'UI/UX',
    'Payment',
    'Backend',
    'Database',
    'Other',
  ]);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');

  // State dropdown interaktif pada list item
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  
  // State dropdown filter di bagian atas
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);
  const [isSeverityDropdownOpen, setIsSeverityDropdownOpen] = useState<boolean>(false);

  // State dropdown di dalam MODAL
  const [modalCategoryOpen, setModalCategoryOpen] = useState<boolean>(false);
  const [modalSeverityOpen, setModalSeverityOpen] = useState<boolean>(false);
  const [modalStatusOpen, setModalStatusOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Tutup semua dropdown jika klik di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
        setIsStatusDropdownOpen(false);
        setIsSeverityDropdownOpen(false);
        setModalCategoryOpen(false);
        setModalSeverityOpen(false);
        setModalStatusOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Modal State untuk Tambah & Edit Masalah
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
  
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('UI/UX');
  const [newSeverity, setNewSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [newStatus, setNewStatus] = useState<'unsolved' | 'in-investigation' | 'solved'>('unsolved');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newSolution, setNewSolution] = useState<string>('');
  const [newReporter, setNewReporter] = useState<string>('Admin');
  const [newAssignee, setNewAssignee] = useState<string>('Tim IT');

  const openAddModal = () => {
    setEditingIssueId(null);
    setNewTitle('');
    setNewCategory(categories[0] || 'UI/UX');
    setNewSeverity('medium');
    setNewStatus('unsolved');
    setNewDescription('');
    setNewSolution('');
    setNewReporter('Admin');
    setNewAssignee('Tim IT');
    setCustomCategoryInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (issue: Issue) => {
    setEditingIssueId(issue.id);
    setNewTitle(issue.title);
    setNewCategory(issue.category);
    setNewSeverity(issue.severity);
    setNewStatus(issue.status);
    setNewDescription(issue.description);
    setNewSolution(issue.solutionSuggestion);
    setNewReporter(issue.reportedBy);
    setNewAssignee(issue.assignee);
    setCustomCategoryInput('');
    setIsModalOpen(true);
  };

  // Tambah kategori baru ke dalam daftar
  const handleAddCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;

    if (!categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
    }
    setNewCategory(trimmed);
    setCustomCategoryInput('');
  };

  // Hapus kategori dari daftar (kecuali jika sedang dipilih)
  const handleDeleteCategory = (catToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (categories.length <= 1) {
      alert('Minimal harus ada 1 kategori.');
      return;
    }
    if (newCategory === catToDelete) {
      alert('Tidak dapat menghapus kategori yang sedang aktif dipilih.');
      return;
    }
    setCategories(categories.filter((c) => c !== catToDelete));
  };

  // Filter Logic
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (selectedStatus !== 'all' && issue.status !== selectedStatus) return false;
      if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) return false;
      if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase()) && !issue.id.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [issues, selectedStatus, selectedSeverity, searchQuery]);

  const handleSaveIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const today = new Date().toISOString().split('T')[0];

    if (editingIssueId) {
      setIssues(
        issues.map((item) => {
          if (item.id === editingIssueId) {
            return {
              ...item,
              title: newTitle,
              category: newCategory,
              severity: newSeverity,
              status: newStatus,
              description: newDescription,
              solutionSuggestion: newSolution || 'Belum ada saran solusi tercatat.',
              reportedBy: newReporter,
              assignee: newAssignee,
              resolvedDate: newStatus === 'solved' && !item.resolvedDate ? today : newStatus !== 'solved' ? undefined : item.resolvedDate,
            };
          }
          return item;
        })
      );
    } else {
      const newIssueItem: Issue = {
        id: `ISS-00${issues.length + 1}`,
        title: newTitle,
        category: newCategory,
        severity: newSeverity,
        status: newStatus,
        reportedDate: today,
        reportedBy: newReporter,
        assignee: newAssignee,
        description: newDescription,
        solutionSuggestion: newSolution || 'Belum ada saran solusi tercatat.',
        resolvedDate: newStatus === 'solved' ? today : undefined,
      };
      setIssues([newIssueItem, ...issues]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteIssue = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan masalah ini?')) {
      setIssues(issues.filter((item) => item.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, targetStatus: Issue['status']) => {
    const today = new Date().toISOString().split('T')[0];
    setIssues(
      issues.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: targetStatus,
            resolvedDate: targetStatus === 'solved' ? today : undefined,
          };
        }
        return item;
      })
    );
    setActiveDropdownId(null);
  };

  return (
    <div className="bg-[#f9f9fb] text-[#1a1c1d] min-h-screen font-sans pb-28 md:pb-32" ref={containerRef}>
      {/* TOP HEADER */}
      <Header />

      <main className="pt-4 md:pt-8 px-5 md:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER HALAMAN & TOMBOL LAPOR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a1c1d] tracking-tight">Manajemen & Pelacakan Masalah</h2>
            <p className="text-sm text-slate-500 mt-1">Pantau bug, kendala teknis, status solved/unsolved, serta input saran solusi.</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#006c4b] hover:bg-[#005137] text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm w-full md:w-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">report_problem</span>
            <span>Laporkan Masalah Baru</span>
          </button>
        </div>

        {/* STATISTIK RINGKASAN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Masalah</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{issues.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100">
              <span className="material-symbols-outlined">analytics</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-600">Belum Selesai (Unsolved)</p>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
                {issues.filter(i => i.status === 'unsolved' || i.status === 'in-investigation').length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600">Sudah Selesai (Solved)</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
                {issues.filter(i => i.status === 'solved').length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
          </div>
        </div>

        {/* FILTER & SEARCH BAR */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
            
            {/* Custom Dropdown Status */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsStatusDropdownOpen(!isStatusDropdownOpen);
                  setIsSeverityDropdownOpen(false);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#006c4b] flex items-center gap-2 cursor-pointer"
              >
                <span>Status: {selectedStatus === 'all' ? 'Semua Status' : selectedStatus}</span>
                <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden">
                  <div className="p-1 space-y-0.5">
                    {[
                      { label: 'Semua Status', value: 'all' },
                      { label: 'Unsolved', value: 'unsolved' },
                      { label: 'In Investigation', value: 'in-investigation' },
                      { label: 'Solved', value: 'solved' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSelectedStatus(opt.value);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl cursor-pointer ${
                          selectedStatus === opt.value ? 'bg-emerald-50 text-[#006c4b]' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Dropdown Severity */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSeverityDropdownOpen(!isSeverityDropdownOpen);
                  setIsStatusDropdownOpen(false);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#006c4b] flex items-center gap-2 cursor-pointer"
              >
                <span>Severity: {selectedSeverity === 'all' ? 'Semua Tingkat' : selectedSeverity}</span>
                <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
              </button>

              {isSeverityDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden">
                  <div className="p-1 space-y-0.5">
                    {[
                      { label: 'Semua Tingkat', value: 'all' },
                      { label: 'Low', value: 'low' },
                      { label: 'Medium', value: 'medium' },
                      { label: 'High', value: 'high' },
                      { label: 'Critical', value: 'critical' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSelectedSeverity(opt.value);
                          setIsSeverityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl cursor-pointer ${
                          selectedSeverity === opt.value ? 'bg-emerald-50 text-[#006c4b]' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari ID atau judul masalah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#006c4b]"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
              search
            </span>
          </div>
        </div>

        {/* DAFTAR MASALAH */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c4b]">list_alt</span>
              Daftar Masalah ({filteredIssues.length})
            </h3>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">task_alt</span>
              <p className="text-xs font-medium">Tidak ada laporan masalah yang cocok dengan filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-emerald-200 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-[#006c4b] bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                        {issue.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          issue.severity === 'critical'
                            ? 'bg-rose-100 text-rose-700'
                            : issue.severity === 'high'
                            ? 'bg-orange-100 text-orange-700'
                            : issue.severity === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {issue.severity}
                      </span>
                      <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-medium">
                        {issue.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800">{issue.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{issue.description}</p>

                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-xs space-y-1">
                      <div className="font-bold text-[#006c4b] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">lightbulb</span>
                        Saran / Catatan Solusi:
                      </div>
                      <p className="text-slate-700">{issue.solutionSuggestion}</p>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 flex-wrap">
                      <span>Dilaporkan: <strong className="text-slate-600">{issue.reportedBy}</strong> ({issue.reportedDate})</span>
                      <span>•</span>
                      <span>PIC: <strong className="text-slate-600">{issue.assignee}</strong></span>
                      {issue.resolvedDate && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 font-semibold">Selesai: {issue.resolvedDate}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 shrink-0">
                    
                    {/* DROPDOWN STATUS ITEM */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdownId(activeDropdownId === issue.id ? null : issue.id)}
                        className={`text-[11px] font-bold px-3.5 py-2 rounded-xl uppercase transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                          issue.status === 'solved'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : issue.status === 'in-investigation'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        <span>Status: {issue.status}</span>
                        <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                      </button>

                      {activeDropdownId === issue.id && (
                        <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 overflow-hidden">
                          <div className="p-1 space-y-1">
                            <button
                              onClick={() => handleUpdateStatus(issue.id, 'unsolved')}
                              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-amber-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                            >
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Unsolved
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(issue.id, 'in-investigation')}
                              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-blue-700 hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                            >
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span> In Investigation
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(issue.id, 'solved')}
                              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
                            >
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Solved
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => openEditModal(issue)}
                      className="p-2.5 rounded-xl text-slate-500 hover:text-[#006c4b] hover:bg-emerald-50 transition-all border border-slate-200 bg-white cursor-pointer"
                      title="Edit Masalah & Solusi"
                    >
                      <span className="material-symbols-outlined text-lg">edit_note</span>
                    </button>

                    <button
                      onClick={() => handleDeleteIssue(issue.id)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-slate-200 bg-white cursor-pointer"
                      title="Hapus Masalah"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* MODAL FORM TAMBAH / EDIT MASALAH DENGAN KATEGORI CUSTOM (TAMBAH & HAPUS) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingIssueId ? 'Edit Masalah & Input Solusi' : 'Laporkan Masalah Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveIssue} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kendala / Bug</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tombol login tidak merespons di HP Android"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#006c4b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                {/* KATEGORI DINAMIS DROPDOWN (BISA TAMBAH & HAPUS) */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <button
                    type="button"
                    onClick={() => {
                      setModalCategoryOpen(!modalCategoryOpen);
                      setModalSeverityOpen(false);
                      setModalStatusOpen(false);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 flex items-center justify-between hover:border-[#006c4b] cursor-pointer"
                  >
                    <span className="truncate">{newCategory}</span>
                    <span className="material-symbols-outlined text-sm shrink-0">arrow_drop_down</span>
                  </button>

                  {modalCategoryOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-2 space-y-2">
                      
                      {/* Input untuk menambah kategori custom baru */}
                      <div className="flex gap-1.5 pb-2 border-b border-slate-100">
                        <input
                          type="text"
                          placeholder="Tambah kategori baru..."
                          value={customCategoryInput}
                          onChange={(e) => setCustomCategoryInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900 focus:outline-none focus:border-[#006c4b]"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomCategory}
                          className="bg-[#006c4b] text-white px-2.5 py-1.5 rounded-xl text-[11px] font-bold hover:bg-[#005137] shrink-0 cursor-pointer"
                        >
                          Tambah
                        </button>
                      </div>

                      {/* List Pilihan Kategori beserta Tombol Hapus */}
                      <div className="max-h-40 overflow-y-auto space-y-0.5">
                        {categories.map((cat) => (
                          <div
                            key={cat}
                            onClick={() => {
                              setNewCategory(cat);
                              setModalCategoryOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between cursor-pointer group ${
                              newCategory === cat ? 'bg-emerald-50 text-[#006c4b]' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="truncate">{cat}</span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteCategory(cat, e)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all opacity-60 group-hover:opacity-100"
                              title="Hapus kategori ini"
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                </div>

                {/* SEVERITY DROPDOWN */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat (Severity)</label>
                  <button
                    type="button"
                    onClick={() => {
                      setModalSeverityOpen(!modalSeverityOpen);
                      setModalCategoryOpen(false);
                      setModalStatusOpen(false);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 flex items-center justify-between uppercase hover:border-[#006c4b] cursor-pointer"
                  >
                    <span>{newSeverity}</span>
                    <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                  </button>

                  {modalSeverityOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-30 overflow-hidden">
                      <div className="p-1 space-y-0.5">
                        {(['low', 'medium', 'high', 'critical'] as const).map((sev) => (
                          <button
                            key={sev}
                            type="button"
                            onClick={() => {
                              setNewSeverity(sev);
                              setModalSeverityOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl uppercase cursor-pointer ${
                              newSeverity === sev ? 'bg-emerald-50 text-[#006c4b]' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {sev}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">
                
                {/* STATUS MASALAH DROPDOWN */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Masalah</label>
                  <button
                    type="button"
                    onClick={() => {
                      setModalStatusOpen(!modalStatusOpen);
                      setModalCategoryOpen(false);
                      setModalSeverityOpen(false);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 flex items-center justify-between capitalize hover:border-[#006c4b] cursor-pointer"
                  >
                    <span>{newStatus}</span>
                    <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                  </button>

                  {modalStatusOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-30 overflow-hidden">
                      <div className="p-1 space-y-0.5">
                        {[
                          { label: 'Unsolved', value: 'unsolved' },
                          { label: 'In Investigation', value: 'in-investigation' },
                          { label: 'Solved', value: 'solved' },
                        ].map((st) => (
                          <button
                            key={st.value}
                            type="button"
                            onClick={() => {
                              setNewStatus(st.value as any);
                              setModalStatusOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl cursor-pointer ${
                              newStatus === st.value ? 'bg-emerald-50 text-[#006c4b]' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Penanggung Jawab (PIC)</label>
                  <input
                    type="text"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#006c4b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Detail Masalah</label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan langkah-langkah memunculkan bug..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#006c4b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-700 mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">lightbulb</span>
                  Input Saran / Catatan Solusi
                </label>
                <textarea
                  rows={2}
                  placeholder="Masukkan rekomendasi perbaikan atau cara penyelesaian..."
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#006c4b]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#006c4b] hover:bg-[#005137] text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  {editingIssueId ? 'Simpan Perubahan' : 'Simpan Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UNIVERSAL BOTTOM NAVIGATION */}
      <Navbar activePage="masalah" />
    </div>
  );
}