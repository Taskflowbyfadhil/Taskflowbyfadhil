'use client';

import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F4F6]">
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}