'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal terhubung dengan Google OAuth.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f9f9fb] text-[#1a1c1d] min-h-screen flex items-center justify-center p-5 font-sans antialiased selection:bg-[#00b37e] selection:text-[#003d28]">
      <main className="w-full max-w-md rounded-[28px] p-6 md:p-8 relative overflow-hidden bg-[#f9f9fb]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 50"
              fill="none"
              className="h-12 w-auto"
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
          <h1 className="text-[24px] leading-[32px] md:text-[30px] md:leading-[36px] font-bold text-[#1a1c1d] mb-1">
            Welcome Back
          </h1>
          <p className="text-[14px] leading-[21px] text-[#6E717C]">
            Sign in to continue to TaskFlow.
          </p>
        </div>

        {/* Pesan Error Login */}
        {error && (
          <div className="mb-4 p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form Login Email & Password */}
        <form onSubmit={handleEmailLogin} className="space-y-4" id="login-form">
          <div className="space-y-1">
            <label
              className="block text-[13px] leading-[18px] font-semibold text-[#3c4a42] ml-1"
              htmlFor="email"
            >
              Email or Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6E717C]">
                <span className="material-symbols-outlined text-xl">mail</span>
              </div>
              <input
                className="w-full pl-[44px] pr-4 py-2 bg-white border border-[#bbcac0] rounded-[12px] text-[#1a1c1d] text-[14px] leading-[21px] placeholder-[#6E717C] focus:outline-none focus:ring-2 focus:ring-[#00b37e] focus:border-transparent transition-all duration-200 h-[48px]"
                id="email"
                name="email"
                placeholder="name@example.com"
                required
                type="email"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between ml-1">
              <label
                className="block text-[13px] leading-[18px] font-semibold text-[#3c4a42]"
                htmlFor="password"
              >
                Password
              </label>
              <a
                href="#"
                className="text-[12px] font-semibold text-[#006c4b] hover:text-[#00b37e] transition-colors"
              >
                Forgot?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6E717C]">
                <span className="material-symbols-outlined text-xl">lock</span>
              </div>
              <input
                className="w-full pl-[44px] pr-[44px] py-2 bg-white border border-[#bbcac0] rounded-[12px] text-[#1a1c1d] text-[14px] leading-[21px] placeholder-[#6E717C] focus:outline-none focus:ring-2 focus:ring-[#00b37e] focus:border-transparent transition-all duration-200 h-[48px]"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                type={showPassword ? 'text' : 'password'}
              />
              <button
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6E717C] hover:text-[#1a1c1d] focus:outline-none transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span
                  className={`material-symbols-outlined text-xl ${
                    showPassword ? 'text-[#00b37e]' : ''
                  }`}
                >
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          <button
            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-sm font-semibold text-[13px] leading-[18px] text-white bg-[#00b37e] hover:opacity-90 active:scale-[0.98] transition-all duration-200 h-[48px] disabled:opacity-80 disabled:cursor-not-allowed mt-2"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin mr-2">
                  progress_activity
                </span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#bbcac0] opacity-50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-[12px] text-[#6E717C] bg-[#f9f9fb]">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login Supabase Google OAuth */}
        <div className="mt-6">
          <button
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-[#bbcac0] rounded-full bg-white text-[13px] font-semibold text-[#1a1c1d] hover:bg-[#f3f3f5] focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] transition-all duration-200 h-[44px]"
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              ></path>
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              ></path>
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              ></path>
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              ></path>
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[14px] leading-[21px] text-[#6E717C]">
            Don't have an account?{' '}
            <Link
              className="font-semibold text-[#006c4b] hover:text-[#00b37e] transition-colors ml-1"
              href="/register"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}