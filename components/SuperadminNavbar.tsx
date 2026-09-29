'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function SuperadminNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', route: '/dashboardsuperadmin', icon: 'dashboard' },
    { label: 'User & Hak', route: '/dashboardsuperadmin/users', icon: 'admin_panel_settings' },
    { label: 'Paket Plan', route: '/dashboardsuperadmin/plans', icon: 'card_membership' },
    { label: 'Pop-up', route: '/dashboardsuperadmin/popup', icon: 'campaign' },
    { label: 'Money', route: '/dashboardsuperadmin/money', icon: 'payments' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 py-2.5 px-4 z-50 shadow-2xl">
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.route;
          return (
            <button
              key={item.route}
              onClick={() => router.push(item.route)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'text-emerald-400 font-bold scale-105' 
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'filled' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}