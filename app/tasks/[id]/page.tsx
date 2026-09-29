'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

interface Task {
  id: string;
  title: string;
  category: string;
  color: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  description?: string;
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // State form detail task (Sama persis dengan halaman buat task baru)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('delivery-app');
  const [color, setColor] = useState('#00B37E');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'review' | 'done'>('todo');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Ambil data task berdasarkan ID saat halaman dibuka
  useEffect(() => {
    async function fetchTaskDetail() {
      try {
        const res = await fetch(`/api/tasks/${id}`);
        if (!res.ok) throw new Error('Gagal mengambil detail task');
        
        const data: Task = await res.json();
        setTitle(data.title || '');
        setCategory(data.category || 'delivery-app');
        setColor(data.color || '#00B37E');
        setStatus(data.status || 'todo');
        setPriority(data.priority || 'medium');
        setDueDate(data.dueDate || '');
        setDescription(data.description || '');
      } catch (error) {
        console.error(error);
        // Fallback data simulasi jika API belum terhubung sepenuhnya
        setTitle('Contoh Task ' + id);
        setCategory('delivery-app');
        setColor('#00B37E');
        setStatus('in-progress');
        setPriority('high');
        setDueDate('2026-09-21');
        setDescription('Deskripsi detail untuk task ID ' + id);
      } finally {
        setLoading(false);
      }
    }

    fetchTaskDetail();
  }, [id]);

  // Fungsi untuk menyimpan perubahan detail / update progres task
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          category,
          color,
          status,
          priority,
          dueDate,
          description,
        }),
      });

      if (!res.ok) {
        console.warn('API belum terhubung, melanjutkan navigasi kembali...');
      }

      router.push('/tasks');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat memperbarui task.');
    } finally {
      setSaving(false);
    }
  };

  // Fungsi untuk menghapus task
  const handleDeleteTask = async () => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus task ini?');
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        console.warn('API belum terhubung, melanjutkan navigasi...');
      }

      router.push('/tasks');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus task.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f9f9fb] text-[#1a1c1d] min-h-screen font-sans flex items-center justify-center">
        <div className="text-sm font-semibold text-slate-500 flex items-center gap-2">
          <span className="material-symbols-outlined animate-spin text-[#006c4b]">progress_activity</span>
          Memuat detail task...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9fb] text-[#1a1c1d] min-h-screen font-sans pb-28 md:pb-32">
      {/* TOP HEADER */}
      <Header />

      {/* MAIN CONTENT AREA */}
      <main className="pt-4 md:pt-8 px-5 md:px-8 max-w-3xl mx-auto space-y-6">

        {/* Header Title & Tombol Hapus */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1c1d]">Detail & Update Task</h2>
            <p className="text-sm text-slate-500 mt-1">Ubah detail informasi atau progres task ID: {id}</p>
          </div>
          <button
            type="button"
            onClick={handleDeleteTask}
            disabled={deleting}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border border-rose-200"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            <span>{deleting ? 'Menghapus...' : 'Hapus Task'}</span>
          </button>
        </div>

        {/* Form Container (Sama persis dengan halaman New Task) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <form onSubmit={handleUpdateTask} className="space-y-5">
            
            {/* Judul Task */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Judul Task <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Perbarui halaman pembayaran"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#006c4b]"
                required
              />
            </div>

            {/* Kategori & Warna */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#006c4b]"
                >
                  <option value="delivery-app">Delivery App</option>
                  <option value="marketing">Marketing</option>
                  <option value="internal">Internal Tools</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Warna Indikator
                </label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-600 uppercase">{color}</span>
                </div>
              </div>
            </div>

            {/* Status Progres & Prioritas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#006c4b] mb-2">
                  Status Progres Task <span className="text-rose-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#006c4b] font-semibold"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Prioritas
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#006c4b]"
                >
                  <option value="low">Low (Rendah)</option>
                  <option value="medium">Medium (Sedang)</option>
                  <option value="high">High (Tinggi)</option>
                </select>
              </div>
            </div>

            {/* Tanggal Jatuh Tempo */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Jatuh Tempo (Due Date)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#006c4b]"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Deskripsi / Catatan Progres
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tambahkan detail atau perbarui catatan progres tugas..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#006c4b]"
                rows={4}
              />
            </div>

            {/* Tombol Aksi Bawah */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Link
                href="/tasks"
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold transition-all"
              >
                Kembali
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#006c4b] hover:bg-[#005137] text-white rounded-full text-xs font-semibold transition-all active:scale-95 shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

          </form>
        </div>

      </main>

      {/* UNIVERSAL BOTTOM NAVIGATION */}
      <Navbar activePage="tasks" />
    </div>
  );
}