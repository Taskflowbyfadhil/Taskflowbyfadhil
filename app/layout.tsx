import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'Sync your life, master your flow.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Stylesheet Material Symbols untuk Ikon */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
        />
      </head>
      <body className="bg-[#f9f9fb] dark:bg-[#121417] text-[#1a1c1d] dark:text-slate-100 transition-colors duration-300">
        {/* AuthProvider membungkus children untuk sesi NextAuth */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}