'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  price: string;
  billingText: string;
  description: string;
  popular?: boolean;
  isFree?: boolean;
  isPermanent?: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Paket Gratis',
    price: 'Rp 0',
    billingText: '/ 1 bulan',
    description: 'Uji coba gratis selama 1 bulan untuk 1 akun Gmail (1x kesempatan seumur hidup).',
    isFree: true,
    features: [
      'Akses Fitur AI Dasar (Durasi 1 Bulan)',
      'Maksimal 3 Proyek Aktif',
      'Dukungan Komunitas Standar',
      'Khusus 1x Klaim per Akun Gmail',
    ],
  },
  {
    id: 'monthly',
    name: 'Paket Bulanan',
    price: 'Rp 15.000',
    billingText: '/bulan',
    description: 'Pilihan fleksibel bagi profesional untuk produktivitas bulanan.',
    features: [
      'Unlimited Proyek & Tugas (Tanpa Batas)',
      'Akses Penuh Fitur AI & Presentasi',
      'Priority Support 24/7',
      'Integrasi Google Drive & Slack',
    ],
  },
  {
    id: 'permanent',
    name: 'Paket Permanent',
    price: 'Rp 50.000',
    billingText: 'sekali bayar',
    description: 'Solusi hemat seumur hidup untuk akses penuh tanpa biaya langganan.',
    popular: true,
    isPermanent: true,
    features: [
      'Akses Selamanya (Lifetime Access)',
      'Semua Fitur Pro Tanpa Batas',
      'Pembaruan Fitur AI Otomatis',
      'VIP Priority Support 24/7',
      'Kapasitas Cloud Terbesar',
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('permanent');

  const selectedPlan = PLANS.find((plan) => plan.id === selectedPlanId) || PLANS[2];

  const handleCheckout = () => {
    // Jika memilih paket Free, langsung arahkan ke Dashboard
    if (selectedPlan.id === 'free') {
      alert('Selamat! Paket Free 1 Bulan Anda berhasil diaktifkan untuk akun ini.');
      router.push('/dashboard');
      return;
    }

    // Mengarahkan ke halaman pembayaran dengan membawa parameter paket yang dipilih
    router.push(
      `/payment?plan=${encodeURIComponent(
        selectedPlan.name
      )}&price=${encodeURIComponent(
        selectedPlan.price
      )}&cycle=${selectedPlan.id}&billingText=${encodeURIComponent(selectedPlan.billingText)}`
    );
  };

  return (
    <div className="bg-[#f9f9fb] text-[#1a1c1d] min-h-screen flex flex-col items-center justify-start p-5 font-sans antialiased selection:bg-[#00b37e] selection:text-[#003d28]">
      <div className="w-full max-w-5xl py-8 pb-36">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="flex justify-center items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 50"
              fill="none"
              className="h-10 w-auto"
            >
              <g transform="translate(10, 5)">
                <path
                  d="M4 22L12 30L28 10"
                  stroke="#00B37E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22L20 30L36 10"
                  stroke="#00B37E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.6"
                />
              </g>
              <text
                x="60"
                y="32"
                fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
                fontSize="24"
                fontWeight="800"
                fill="#0F0F0F"
                letterSpacing="-0.5px"
              >
                Task<tspan fill="#00B37E">Flow</tspan>
              </text>
            </svg>
          </div>
          <h1 className="text-[28px] md:text-[36px] font-bold text-[#1a1c1d] mb-3">
            Pilih Paket Pro yang Sesuai
          </h1>
          <p className="text-[15px] text-[#6E717C]">
            Nikmati akses uji coba gratis 1 bulan, berlangganan bulanan yang fleksibel, atau miliki akses permanen selamanya.
          </p>
        </div>

        {/* Pricing Cards Grid (3 Pilihan: Free, Bulanan, Permanent) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto mb-10">
          {PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`cursor-pointer rounded-[28px] p-6 md:p-8 flex flex-col justify-between transition-all relative ${
                  isSelected
                    ? plan.isPermanent
                      ? 'bg-white border-2 border-[#00b37e] shadow-xl scale-[1.02]'
                      : 'bg-white border-2 border-[#1a1c1d] shadow-xl scale-[1.02]'
                    : 'bg-white border border-[#e2e2e4] hover:border-[#bbcac0] shadow-sm'
                }`}
              >
                {/* Badge Populer / Permanent */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00b37e] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Paling Hemat & Rekomended
                  </div>
                )}

                {/* Badge Khusus Free */}
                {plan.isFree && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    1x Seumur Hidup / Akun
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-[20px] font-bold text-[#1a1c1d]">
                      {plan.name}
                    </h3>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-[#00b37e] bg-[#00b37e]'
                          : 'border-[#bbcac0]'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>

                  <p className="text-[13px] text-[#6E717C] mt-1">
                    {plan.description}
                  </p>

                  {/* Bagian Display Harga */}
                  <div className="my-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[32px] font-bold text-[#1a1c1d]">
                        {plan.price}
                      </span>
                      <span className="text-[13px] text-[#6E717C]">
                        {plan.billingText}
                      </span>
                    </div>

                    <div className="mt-1 h-6">
                      {plan.isFree && (
                        <span className="text-[12px] text-amber-600 font-medium">
                          Berlaku selama 30 hari pertama
                        </span>
                      )}
                      {plan.id === 'monthly' && (
                        <span className="text-[12px] text-[#6E717C]">
                          Tagihan rutin tiap bulan, batalkan kapan saja
                        </span>
                      )}
                      {plan.isPermanent && (
                        <span className="text-[12px] text-[#006c4b] font-semibold">
                          Bayar sekali untuk selamanya
                        </span>
                      )}
                    </div>
                  </div>

                  <hr className="border-[#e2e2e4] mb-6" />

                  <ul className="space-y-3 text-[14px] text-[#3c4a42]">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#00b37e]">
                          check_circle
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlanId(plan.id);
                  }}
                  className={`mt-8 w-full py-3 px-4 rounded-full text-[13px] font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#1a1c1d] text-white shadow-sm'
                      : 'border border-[#bbcac0] text-[#1a1c1d] hover:bg-[#f3f3f5]'
                  }`}
                >
                  {isSelected ? 'Paket Dipilih' : 'Pilih Paket Ini'}
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* Floating Action Bar untuk Konfirmasi / Aktivasi */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e2e4] p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30 flex justify-center">
        <div className="w-full max-w-5xl flex items-center justify-between gap-4">
          <div>
            <span className="text-[12px] text-[#6E717C] block">
              Paket Terpilih:
            </span>
            <span className="text-[16px] font-bold text-[#1a1c1d]">
              {selectedPlan.name}{' '}
              <span className="text-[#006c4b]">
                ({selectedPlan.price} {selectedPlan.billingText})
              </span>
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="px-8 py-3 rounded-full text-[14px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm text-white bg-[#1a1c1d]"
          >
            <span>
              {selectedPlan.id === 'free'
                ? 'Aktifkan Free 1 Bulan'
                : 'Lanjut Pembayaran'}
            </span>
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}