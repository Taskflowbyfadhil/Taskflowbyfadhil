'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

export default function SettingsPage() {
  const router = useRouter();

  // State Interaktif untuk Fitur Pengaturan (dimuat dari localStorage jika ada)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [desktopSound, setDesktopSound] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSaveReport, setAutoSaveReport] = useState(true);

  // State untuk Input Form dalam Modal
  const [profileName, setProfileName] = useState('Alex Johnson');
  const [profileRole, setProfileRole] = useState('Project Manager');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // State untuk Notifikasi & Modal Interaktif
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // 1. Load preferensi tersimpan saat pertama kali dimuat
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    const savedNotif = localStorage.getItem('notificationsEnabled');
    if (savedNotif !== null) setNotificationsEnabled(savedNotif === 'true');

    const savedEmail = localStorage.getItem('emailAlerts');
    if (savedEmail !== null) setEmailAlerts(savedEmail === 'true');

    const savedSound = localStorage.getItem('desktopSound');
    if (savedSound !== null) setDesktopSound(savedSound === 'true');

    const saved2FA = localStorage.getItem('twoFactorAuth');
    if (saved2FA !== null) setTwoFactorAuth(saved2FA === 'true');

    const savedAutoSave = localStorage.getItem('autoSaveReport');
    if (savedAutoSave !== null) setAutoSaveReport(savedAutoSave === 'true');

    const savedName = localStorage.getItem('profileName');
    if (savedName) setProfileName(savedName);

    const savedRole = localStorage.getItem('profileRole');
    if (savedRole) setProfileRole(savedRole);
  }, []);

  // 2. Fungsi Trigger Auto-Save Otomatis ke localStorage / Backend
  const triggerAutoSave = (key: string, value: any) => {
    setIsSaving(true);
    localStorage.setItem(key, String(value));

    // Simulasi jeda jaringan/penyimpanan cloud tipis untuk efek real-time
    setTimeout(() => {
      setIsSaving(false);
      setSuccessMessage('Perubahan otomatis disimpan (Auto-saved)');
      setTimeout(() => setSuccessMessage(''), 2500);
    }, 500);
  };

  // Handler khusus Toggle agar langsung auto-save saat diklik
  const handleToggleNotifications = () => {
    const nextVal = !notificationsEnabled;
    setNotificationsEnabled(nextVal);
    triggerAutoSave('notificationsEnabled', nextVal);
  };

  const handleToggleEmailAlerts = () => {
    const nextVal = !emailAlerts;
    setEmailAlerts(nextVal);
    triggerAutoSave('emailAlerts', nextVal);
  };

  const handleToggleDesktopSound = () => {
    const nextVal = !desktopSound;
    setDesktopSound(nextVal);
    triggerAutoSave('desktopSound', nextVal);
  };

  const handleToggle2FA = () => {
    const nextVal = !twoFactorAuth;
    setTwoFactorAuth(nextVal);
    triggerAutoSave('twoFactorAuth', nextVal);
  };

  const handleToggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    triggerAutoSave('theme', nextMode ? 'dark' : 'light');
  };

  const handleToggleAutoSave = () => {
    const nextVal = !autoSaveReport;
    setAutoSaveReport(nextVal);
    triggerAutoSave('autoSaveReport', nextVal);
  };

  // Handler Simpan di dalam Modal (Profil / Password / Logout)
  const handleModalSubmit = () => {
    if (activeModal === 'profile') {
      localStorage.setItem('profileName', profileName);
      localStorage.setItem('profileRole', profileRole);
      setSuccessMessage('Profil pengguna berhasil diperbarui!');
    } else if (activeModal === 'password') {
      if (!oldPassword || !newPassword) {
        alert('Mohon isi sandi lama dan sandi baru.');
        return;
      }
      setSuccessMessage('Kata sandi perusahaan berhasil diubah!');
      setOldPassword('');
      setNewPassword('');
    } else if (activeModal === 'logout') {
      router.push('/login');
      return;
    }

    setActiveModal(null);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className={`min-h-screen font-sans pb-32 transition-colors duration-300 ${darkMode ? 'bg-[#121417] text-slate-100' : 'bg-[#f9f9fb] text-[#1a1c1d]'}`}>
      {/* Header Universal */}
      <Header />

      {/* Main Content */}
      <main className="pt-4 md:pt-8 px-5 md:px-8 max-w-4xl mx-auto space-y-6">
        
        {/* Page Title & Status Auto-Save / Sukses */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Pengaturan Sistem</h2>
            <p className={`text-xs md:text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Semua perubahan preferensi terintegrasi dan tersimpan otomatis secara real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isSaving && (
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse">
                <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                Menyimpan...
              </span>
            )}
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-[#006c4b] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                {successMessage}
              </div>
            )}
          </div>
        </div>

        {/* Section: Profil Pengguna */}
        <div className={`rounded-[28px] md:rounded-[32px] p-6 md:p-8 shadow-sm border space-y-5 transition-colors ${darkMode ? 'bg-[#1a1d21] border-slate-800' : 'bg-white border-slate-200/80'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#006c4b] border border-emerald-100 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Profil & Keanggotaan Tim</h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Informasi identitas akun Taskflow Anda</p>
            </div>
          </div>
          
          <div className={`flex flex-col sm:flex-row items-center gap-5 p-4 md:p-5 rounded-2xl border ${darkMode ? 'bg-[#121417] border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#006c4b] to-emerald-400 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
              {profileName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h4 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>{profileName}</h4>
              <p className="text-xs text-slate-500 font-mono">alex.johnson@taskflow.id</p>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
                <span className="bg-emerald-100 text-[#006c4b] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  {profileRole}
                </span>
                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  Engineering Division
                </span>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setActiveModal('profile')}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer shadow-2xs ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Ubah Profil
            </button>
          </div>
        </div>

        {/* Section: Preferensi Notifikasi & Suara */}
        <div className={`rounded-[28px] md:rounded-[32px] p-6 md:p-8 shadow-sm border space-y-6 transition-colors ${darkMode ? 'bg-[#1a1d21] border-slate-800' : 'bg-white border-slate-200/80'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">notifications_active</span>
            </div>
            <div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Notifikasi & Peringatan</h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Atur bagaimana Taskflow mengingatkan jadwal task & laporan</p>
            </div>
          </div>

          <div className={`space-y-4 pt-1 divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
            <div className="flex items-center justify-between pt-3 first:pt-0">
              <div>
                <h4 className={`text-xs md:text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Notifikasi Push Real-time</h4>
                <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Terima pop-up pemberitahuan langsung saat task diperbarui.</p>
              </div>
              <button
                type="button"
                onClick={handleToggleNotifications}
                className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  notificationsEnabled ? 'bg-[#006c4b]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                    notificationsEnabled ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h4 className={`text-xs md:text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Rekap Laporan via Email</h4>
                <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Kirim rekap harian progres task dan laporan masalah setiap pukul 17:00.</p>
              </div>
              <button
                type="button"
                onClick={handleToggleEmailAlerts}
                className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  emailAlerts ? 'bg-[#006c4b]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                    emailAlerts ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h4 className={`text-xs md:text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Efek Suara Tugas Selesai</h4>
                <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Putar audio pendek saat Anda menekan tombol selesai pada task.</p>
              </div>
              <button
                type="button"
                onClick={handleToggleDesktopSound}
                className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  desktopSound ? 'bg-[#006c4b]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                    desktopSound ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Section: Keamanan & Sesi */}
        <div className={`rounded-[28px] md:rounded-[32px] p-6 md:p-8 shadow-sm border space-y-6 transition-colors ${darkMode ? 'bg-[#1a1d21] border-slate-800' : 'bg-white border-slate-200/80'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">security</span>
            </div>
            <div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Keamanan & Akses Akun</h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Perlindungan data enterprise dan verifikasi login</p>
            </div>
          </div>

          <div className={`space-y-4 pt-1 divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
            <div className="flex items-center justify-between pt-3 first:pt-0">
              <div>
                <h4 className={`text-xs md:text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Autentikasi Dua Faktor (2FA)</h4>
                <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Wajibkan kode verifikasi OTP saat masuk dari perangkat baru.</p>
              </div>
              <button
                type="button"
                onClick={handleToggle2FA}
                className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  twoFactorAuth ? 'bg-[#006c4b]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                    twoFactorAuth ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h4 className={`text-xs md:text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Ubah Kata Sandi Perusahaan</h4>
                <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Terakhir diubah 3 bulan lalu.</p>
              </div>
              <button 
                type="button"
                onClick={() => setActiveModal('password')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Perbarui Sandi
              </button>
            </div>
          </div>
        </div>

        {/* Section: Tampilan & Sistem */}
        <div className={`rounded-[28px] md:rounded-[32px] p-6 md:p-8 shadow-sm border space-y-6 transition-colors ${darkMode ? 'bg-[#1a1d21] border-slate-800' : 'bg-white border-slate-200/80'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">palette</span>
            </div>
            <div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Tampilan & Sistem Kerja</h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Personalisasi tema dan fitur otomatisasi</p>
            </div>
          </div>

          <div className={`space-y-4 pt-1 divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
            <div className="flex items-center justify-between pt-3 first:pt-0">
              <div>
                <h4 className={`text-xs md:text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Mode Gelap (Dark Mode)</h4>
                <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Sesuaikan tema antarmuka aplikasi menjadi warna gelap ramah mata.</p>
              </div>
              <button
                type="button"
                onClick={handleToggleDarkMode}
                className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  darkMode ? 'bg-[#006c4b]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                    darkMode ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h4 className={`text-xs md:text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Auto-Save Task & Report</h4>
                <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Simpan otomatis perubahan task setiap 10 detik secara cloud.</p>
              </div>
              <button
                type="button"
                onClick={handleToggleAutoSave}
                className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  autoSaveReport ? 'bg-[#006c4b]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                    autoSaveReport ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Tombol Keluar Akun Di Bawah */}
        <div className="flex items-center justify-start pt-2">
          <button 
            type="button"
            onClick={() => setActiveModal('logout')}
            className="px-5 py-3 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition-colors cursor-pointer shadow-xs"
          >
            Keluar Akun
          </button>
        </div>

      </main>

      {/* Modal Dialog Interaktif */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className={`w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-4 ${darkMode ? 'bg-[#1a1d21] text-white border border-slate-800' : 'bg-white text-slate-900'}`}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold">
                {activeModal === 'profile' && 'Edit Profil Pengguna'}
                {activeModal === 'password' && 'Perbarui Kata Sandi'}
                {activeModal === 'logout' && 'Konfirmasi Keluar'}
              </h3>
              <button 
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeModal === 'profile' && 'Ubah nama lengkap atau nama tampilan tim Anda di Taskflow.'}
              {activeModal === 'password' && 'Masukkan sandi lama dan sandi baru perusahaan Anda untuk memperbarui keamanan.'}
              {activeModal === 'logout' && 'Apakah Anda yakin ingin mengakhiri sesi aktif Taskflow saat ini?'}
            </p>

            {activeModal === 'profile' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={profileName} 
                    onChange={(e) => setProfileName(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs" 
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Jabatan / Peran</label>
                  <input 
                    type="text" 
                    value={profileRole} 
                    onChange={(e) => setProfileRole(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs" 
                  />
                </div>
              </div>
            )}

            {activeModal === 'password' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Kata Sandi Saat Ini</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs" 
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Kata Sandi Baru</label>
                  <input 
                    type="password" 
                    placeholder="Minimal 8 karakter" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs" 
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <button 
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={handleModalSubmit}
                className="px-5 py-2 rounded-xl bg-[#006c4b] hover:bg-[#005137] text-white text-xs font-bold cursor-pointer shadow-md"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar Universal */}
      <Navbar activePage="settings" />
    </div>
  );
}