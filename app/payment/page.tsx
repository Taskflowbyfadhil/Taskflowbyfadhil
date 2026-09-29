'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Mengambil data dari Query Parameter (dikirim dari Pricing Page)
  const planName = searchParams.get('plan') || 'Paket Permanent';
  const priceRaw = searchParams.get('price') || 'Rp 50.000';
  const cycle = searchParams.get('cycle') || 'permanent';
  const billingText = searchParams.get('billingText') || 'sekali bayar';

  // Parser sederhana untuk mengubah string harga (misal "Rp 50.000" atau "Rp 15.000") menjadi number untuk API Midtrans
  const priceAmount = React.useMemo(() => {
    const numericStr = priceRaw.replace(/[^0-9]/g, '');
    return numericStr ? parseInt(numericStr, 10) : 50000;
  }, [priceRaw]);

  // State Utama
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<{
    orderId: string;
    qrImageUrl: string;
    grossAmount: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // State Modal Sukses & Countdown
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Data pengguna (Dapat disesuaikan dari session/auth state)
  const userEmail = 'user@example.com';
  const userName = 'Alex';

  // 2. Fungsi memanggil API Checkout QRIS Midtrans
  const handleGenerateQris = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/checkout-qris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planName: `${planName} (${billingText})`, 
          priceAmount, 
          userEmail, 
          userName 
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQrData({
          orderId: data.orderId,
          qrImageUrl: data.qrImageUrl,
          grossAmount: data.grossAmount,
        });
      } else {
        setErrorMsg(data.message || 'Gagal membuat transaksi QRIS');
      }
    } catch (err: any) {
      setErrorMsg('Terjadi kesalahan jaringan/koneksi.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Polling Status Pembayaran secara Realtime saat QRIS aktif
  useEffect(() => {
    if (!qrData?.orderId || showSuccessModal) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`/api/check-status?orderId=${qrData.orderId}`);
        const data = await res.json();

        // Status sukses dari Midtrans: 'settlement' atau 'capture'
        if (data.transactionStatus === 'settlement' || data.transactionStatus === 'capture') {
          clearInterval(intervalId);
          triggerSuccessFlow();
        }
      } catch (error) {
        console.error('Gagal memeriksa status pembayaran:', error);
      }
    }, 3000); // Cek status setiap 3 detik

    return () => clearInterval(intervalId);
  }, [qrData, showSuccessModal]);

  // 4. Trigger Modal Sukses & Countdown Redirect
  const triggerSuccessFlow = () => {
    setShowSuccessModal(true);
    let timer = 3;
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer === 0) {
        clearInterval(interval);
        router.push('/dashboard');
      }
    }, 1000);
  };

  // Fungsi Unduh Gambar QRIS
  const handleDownloadQr = async () => {
    if (!qrData?.qrImageUrl) return;
    try {
      const response = await fetch(qrData.qrImageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `QRIS-${qrData.orderId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(qrData.qrImageUrl, '_blank');
    }
  };

  // Fungsi Menyalin Link Gambar QRIS
  const handleCopyLink = () => {
    if (qrData?.qrImageUrl) {
      navigator.clipboard.writeText(qrData.qrImageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-md space-y-4">
        
        {/* KARTU 1: AREA PEMBAYARAN QRIS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          
          {/* Header Tombol Kembali & Judul */}
          <div className="flex items-center gap-3 mb-5">
            <button 
              type="button" 
              onClick={() => router.push('/pricing')}
              className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-700">arrow_back</span>
            </button>
            <h2 className="text-xl font-bold text-slate-800">Pembayaran QRIS</h2>
          </div>

          {/* Container Tampilan QR Code */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center">
            
            {/* Keadaan Awal: Tombol Generate QRIS */}
            {!qrData && !loading && (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500 mb-4">
                  Klik tombol di bawah untuk membuat kode pembayaran QRIS.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateQris}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  Tampilkan QRIS Pembayaran
                </button>
              </div>
            )}

            {/* Indicator Loading */}
            {loading && (
              <div className="py-10 flex flex-col items-center gap-2">
                <div className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 font-medium mt-1">Membuat QRIS...</p>
              </div>
            )}

            {/* Pesan Error */}
            {errorMsg && (
              <p className="text-xs text-red-500 font-semibold my-2 text-center">{errorMsg}</p>
            )}

            {/* Keadaan Setelah QRIS Berhasil Dibuat */}
            {qrData && (
              <>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Menunggu Pembayaran...
                </span>

                {/* Frame Gambar QR Code */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                  <img
                    src={qrData.qrImageUrl}
                    alt="QRIS Payment Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>

                {/* Order ID */}
                <p className="text-[12px] text-slate-500 font-mono mt-3 text-center">
                  Order ID: <span className="text-slate-800 font-medium">{qrData.orderId}</span>
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">download</span>
                    Unduh QR
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                    {copied ? 'Tersalin!' : 'Salin Link QR'}
                  </button>
                </div>

                {/* Tombol Simulasi Bayar Berhasil (Berguna untuk Testing Sandbox) */}
                <button
                  type="button"
                  onClick={triggerSuccessFlow}
                  className="mt-4 text-[11px] text-slate-400 underline hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  [Simulasi Pembayaran Berhasil]
                </button>
              </>
            )}

          </div>
        </div>

        {/* KARTU 2: RINGKASAN PESANAN (DINAMIS) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-800">Ringkasan Pesanan</h3>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded uppercase">
              {cycle === 'permanent' ? 'LIFETIME' : cycle === 'monthly' ? 'BULANAN' : 'GRATIS'}
            </span>
            <h4 className="text-sm font-bold text-slate-800 mt-2">{planName}</h4>
            <p className="text-xs text-slate-500">Langganan Akses SaaS TaskFlow</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Harga Paket</span>
              <span>{priceRaw}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-800 text-sm pt-1">
              <span>Total Tagihan</span>
              <span className="text-emerald-600">
                {priceRaw} <span className="text-xs font-normal text-slate-400">({billingText})</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
            <span>Proses Aman via Midtrans Core API</span>
          </div>
        </div>

      </div>

      {/* POP-UP / MODAL PEMBAYARAN BERHASIL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[28px] p-6 text-center shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <h2 className="text-[22px] font-bold text-slate-800 mb-1">Pembayaran Berhasil!</h2>
            <p className="text-[13px] text-slate-500 mb-4">
              Selamat, akun kamu sekarang telah aktif menggunakan <strong>{planName}</strong>.
            </p>

            <div className="bg-slate-50 p-3 rounded-[16px] text-[12px] text-slate-500 mb-6 border border-slate-200">
              Mengarahkan ke Dashboard dalam <span className="font-bold text-emerald-600 text-[14px]">{countdown}</span> detik...
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-slate-900 text-white py-3 rounded-full text-[13px] font-semibold hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
            >
              Buka Dashboard Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-500">Memuat Halaman Pembayaran...</div>}>
      <PaymentContent />
    </Suspense>
  );
}