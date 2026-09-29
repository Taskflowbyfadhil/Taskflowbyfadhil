'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

interface OvertimeSlot {
  start: string;
  end: string;
}

interface AttendanceRecord {
  id: string;
  name: string;
  checkIn: string;
  checkOut: string;
  status: string;
  categoryReason: string;
  notes: string;
  overtimeSlots: OvertimeSlot[];
  date: string;
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'attendance' | 'masalah' | 'payment'>('attendance');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const tasksData = [
    { id: 'TSK-001', title: 'Redesign Landing Page UI', status: 'Done', date: '2026-06-01', assignee: 'Alex Johnson' },
    { id: 'TSK-002', title: 'Setup Payment Gateway API', status: 'In Progress', date: '2026-06-03', assignee: 'Sarah Connor' },
    { id: 'TSK-003', title: 'Database Migration to Cloud', status: 'Pending', date: '2026-06-05', assignee: 'Michael Scofield' },
  ];

  // Data Absensi awal dengan contoh lembur fleksibel (>2 waktu)
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([
    { 
      id: 'ATT-101', 
      name: 'Alex Johnson', 
      checkIn: '08:00 AM', 
      checkOut: '05:00 PM', 
      status: 'Hadir', 
      categoryReason: '-', 
      notes: 'Masuk tepat waktu', 
      overtimeSlots: [], 
      date: '2026-06-06' 
    },
    { 
      id: 'ATT-102', 
      name: 'Sarah Connor', 
      checkIn: '04:00 AM', 
      checkOut: '11:00 PM', 
      status: 'Lembur', 
      categoryReason: 'Project Deadline Q3', 
      notes: 'Lembur pagi dan malam hari', 
      overtimeSlots: [
        { start: '04:00', end: '07:30' },
        { start: '18:00', end: '23:00' }
      ], 
      date: '2026-06-06' 
    },
    { 
      id: 'ATT-103', 
      name: 'Michael Scofield', 
      checkIn: '-', 
      checkOut: '-', 
      status: 'Sakit', 
      categoryReason: 'Demam & Flu', 
      notes: 'Surat dokter dilampirkan', 
      overtimeSlots: [], 
      date: '2026-06-06' 
    },
  ]);

  const masalahData = [
    { id: 'ISS-001', title: 'Payment Gateway Timeout Error', category: 'Backend', severity: 'Critical', status: 'Open', date: '2026-06-06' },
    { id: 'ISS-002', title: 'Mobile Responsive Header Broken on iOS', category: 'Frontend', severity: 'Medium', status: 'In Progress', date: '2026-06-05' },
    { id: 'ISS-003', title: 'Database Connection Pool Leak', category: 'Database', severity: 'High', status: 'Resolved', date: '2026-06-02' },
  ];

  const paymentData = [
    { id: 'PAY-901', plan: 'Enterprise Annual', amount: '$1,200', status: 'Success', date: '2026-06-04', customer: 'Acme Corp' },
    { id: 'PAY-902', plan: 'Pro Monthly', amount: '$49', status: 'Pending', date: '2026-06-06', customer: 'Startup Inc' },
  ];

  // Handler Ubah Status Absensi / Keterangan Tidak Hadir
  const handleAttendanceStatusChange = (id: string, newStatus: string) => {
    setAttendanceData(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: newStatus,
            overtimeSlots: newStatus === 'Lembur' && item.overtimeSlots.length === 0 ? [{ start: '04:00', end: '23:00' }] : item.overtimeSlots
          };
        }
        return item;
      })
    );
  };

  // Handler Alasan Keterangan Khusus
  const handleAttendanceReasonChange = (id: string, value: string) => {
    setAttendanceData(prev =>
      prev.map(item => (item.id === id ? { ...item, categoryReason: value } : item))
    );
  };

  // Handler Catatan User
  const handleAttendanceNotesChange = (id: string, value: string) => {
    setAttendanceData(prev =>
      prev.map(item => (item.id === id ? { ...item, notes: value } : item))
    );
  };

  // Tambah Rentang Jam Lembur Fleksibel
  const handleAddOvertimeSlot = (id: string) => {
    setAttendanceData(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            overtimeSlots: [...item.overtimeSlots, { start: '18:00', end: '21:00' }]
          };
        }
        return item;
      })
    );
  };

  // Hapus Rentang Jam Lembur
  const handleRemoveOvertimeSlot = (id: string, slotIndex: number) => {
    setAttendanceData(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updatedSlots = item.overtimeSlots.filter((_, idx) => idx !== slotIndex);
          return { ...item, overtimeSlots: updatedSlots };
        }
        return item;
      })
    );
  };

  // Update Waktu Spesifik Slot Lembur
  const handleSlotTimeChange = (id: string, slotIndex: number, field: 'start' | 'end', value: string) => {
    setAttendanceData(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updatedSlots = [...item.overtimeSlots];
          updatedSlots[slotIndex][field] = value;
          return { ...item, overtimeSlots: updatedSlots };
        }
        return item;
      })
    );
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'tasks': return tasksData;
      case 'attendance': return attendanceData;
      case 'masalah': return masalahData;
      case 'payment': return paymentData;
      default: return [];
    }
  };

  const filteredData = getCurrentData().filter((item: any) => {
    const matchesSearch = Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    
    const itemDate = item.date ? new Date(item.date) : null;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    let matchesDate = true;
    if (itemDate && start && itemDate < start) matchesDate = false;
    if (itemDate && end && itemDate > end) matchesDate = false;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const downloadActiveCSV = () => {
    if (!filteredData.length) return;
    const keys = Object.keys(filteredData[0]);
    const csvContent = [
      keys.join(','),
      ...filteredData.map((row: any) => keys.map(k => `"${row[k]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `report-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#f4f4f6] text-slate-900 min-h-screen flex flex-col pb-28 font-sans">
      <Header />

      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
        
        {/* Judul & Export */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">Reports Management</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">Kelola laporan absensi, keterangan khusus, dan catatan user secara real-time</p>
          </div>
          <button
            onClick={downloadActiveCSV}
            className="bg-[#006c4b] hover:bg-[#005238] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 w-fit"
          >
            <span className="material-symbols-outlined text-sm">download</span> 
            <span>Export CSV</span>
          </button>
        </div>

        {/* Tab Navigasi */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('tasks'); setStatusFilter('All'); }}
            className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tasks' ? 'bg-[#006c4b] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Data Task
          </button>
          <button
            onClick={() => { setActiveTab('attendance'); setStatusFilter('All'); }}
            className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'attendance' ? 'bg-[#006c4b] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Data Absensi
          </button>
          <button
            onClick={() => { setActiveTab('masalah'); setStatusFilter('All'); }}
            className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'masalah' ? 'bg-[#006c4b] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Data Masalah
          </button>
          <button
            onClick={() => { setActiveTab('payment'); setStatusFilter('All'); }}
            className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'payment' ? 'bg-[#006c4b] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Data Pembayaran
          </button>
        </div>

        {/* Panel Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
              <input
                type="text"
                placeholder={`Cari teks di ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:border-[#006c4b]"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm bg-white focus:outline-none focus:border-[#006c4b]"
              >
                <option value="All">Semua Status</option>
                <option value="Hadir">Hadir</option>
                <option value="Cuti">Cuti</option>
                <option value="Sakit">Sakit</option>
                <option value="Lupa Absen">Lupa Absen</option>
                <option value="Event">Event</option>
                <option value="Lembur">Lembur</option>
                <option value="Absent">Absent / Tidak Hadir</option>
              </select>
            </div>

            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('All'); setStartDate(''); setEndDate(''); }}
              className="border border-slate-200 text-slate-600 rounded-xl px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-all"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wider">
              Hasil Kategori: <span className="text-[#006c4b]">{activeTab.toUpperCase()}</span> ({filteredData.length} Data Ditemukan)
            </h2>
          </div>

          <div className="overflow-x-auto">
            {filteredData.length > 0 ? (
              <table className="w-full text-left text-sm text-slate-700 min-w-[900px]">
                <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Nama / Karyawan</th>
                    <th className="px-4 py-3">Check-In / Out</th>
                    <th className="px-4 py-3">Status / Keterangan Kehadiran</th>
                    {activeTab === 'attendance' && (
                      <>
                        <th className="px-4 py-3">Detail Alasan / Jam Lembur Fleksibel</th>
                        <th className="px-4 py-3">Catatan Tambahan User</th>
                      </>
                    )}
                    {activeTab !== 'attendance' && Object.keys(filteredData[0]).slice(3).map((key) => (
                      <th key={key} className="px-4 py-3">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-all align-top">
                      <td className="px-4 py-3.5 text-xs font-mono font-bold text-slate-600">{row.id}</td>
                      <td className="px-4 py-3.5 text-xs md:text-sm font-medium text-slate-800">
                        {row.name || row.title || row.plan}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono text-slate-600">
                        {row.checkIn ? `${row.checkIn} - ${row.checkOut || '-'}` : (row.date || '-')}
                      </td>

                      {/* Khusus Tab Attendance */}
                      {activeTab === 'attendance' ? (
                        <>
                          {/* Kolom Keterangan Utama (Cuti, Sakit, Lupa Absen, Event, Lembur, Hadir) */}
                          <td className="px-4 py-3.5">
                            <select
                              value={row.status}
                              onChange={(e) => handleAttendanceStatusChange(row.id, e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs text-slate-800 focus:outline-none focus:border-[#006c4b] w-full"
                            >
                              <option value="Hadir">Hadir</option>
                              <option value="Cuti">Cuti</option>
                              <option value="Sakit">Sakit</option>
                              <option value="Lupa Absen">Lupa Absen</option>
                              <option value="Event">Event</option>
                              <option value="Lembur">Lembur</option>
                              <option value="Absent">Absent / Tidak Hadir</option>
                            </select>
                          </td>

                          {/* Kolom Keterangan Detail & Jam Lembur Fleksibel */}
                          <td className="px-4 py-3.5 space-y-3">
                            <input
                              type="text"
                              placeholder="Keterangan (Cth: Sakit Demam, Cuti Keluarga...)"
                              value={row.categoryReason}
                              onChange={(e) => handleAttendanceReasonChange(row.id, e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#006c4b]"
                            />

                            {/* Kotak Jam Lembur Fleksibel (> 2 Waktu) */}
                            {row.status === 'Lembur' && (
                              <div className="bg-amber-50/90 border border-amber-200 p-3 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span> Rentang Jam Lembur
                                  </span>
                                  <button
                                    onClick={() => handleAddOvertimeSlot(row.id)}
                                    className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-md hover:bg-amber-700"
                                  >
                                    + Tambah Jam
                                  </button>
                                </div>
                                {row.overtimeSlots.map((slot: OvertimeSlot, sIdx: number) => (
                                  <div key={sIdx} className="flex items-center gap-2">
                                    <input
                                      type="time"
                                      value={slot.start}
                                      onChange={(e) => handleSlotTimeChange(row.id, sIdx, 'start', e.target.value)}
                                      className="bg-white border border-amber-300 rounded px-2 py-1 text-xs font-mono font-bold text-slate-700"
                                    />
                                    <span className="text-xs text-slate-500">s/d</span>
                                    <input
                                      type="time"
                                      value={slot.end}
                                      onChange={(e) => handleSlotTimeChange(row.id, sIdx, 'end', e.target.value)}
                                      className="bg-white border border-amber-300 rounded px-2 py-1 text-xs font-mono font-bold text-slate-700"
                                    />
                                    {row.overtimeSlots.length > 1 && (
                                      <button
                                        onClick={() => handleRemoveOvertimeSlot(row.id, sIdx)}
                                        className="text-rose-600 hover:text-rose-800 p-1"
                                      >
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Kolom Catatan Tambahan User */}
                          <td className="px-4 py-3.5">
                            <textarea
                              rows={2}
                              placeholder="Catatan tambahan user..."
                              value={row.notes}
                              onChange={(e) => handleAttendanceNotesChange(row.id, e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#006c4b] resize-none"
                            />
                          </td>
                        </>
                      ) : (
                        Object.entries(row).slice(3).map(([k, val]: [string, any], vIdx: number) => (
                          <td key={vIdx} className="px-4 py-3.5 text-xs md:text-sm font-medium text-slate-800">
                            {String(val)}
                          </td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-400 text-sm">
                Tidak ada data yang cocok dengan rentang tanggal atau kata kunci pencarian Anda.
              </div>
            )}
          </div>
        </div>

      </main>

      <Navbar activePage="reports" />
    </div>
  );
}