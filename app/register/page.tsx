'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username,
          },
        },
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
      } else {
        setIsSuccess(true);
        setIsLoading(false);

        // Setelah pendaftaran sukses, arahkan ke halaman pricing
        setTimeout(() => {
          router.push('/pricing');
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat pendaftaran.');
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
            Create Account
          </h1>
          <p className="text-[14px] leading-[21px] text-[#6E717C]">
            Join us to start your productive journey.
          </p>
        </div>

        {/* Pesan Error */}
        {error && (
          <div className="mb-4 p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form Register */}
        <form onSubmit={handleSubmit} className="space-y-4" id="signup-form">
          <div className="space-y-1">
            <label
              className="block text-[13px] leading-[18px] font-semibold text-[#3c4a42] ml-1"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6E717C]">
                <span className="material-symbols-outlined text-xl">person</span>
              </div>
              <input
                className="w-full pl-[44px] pr-4 py-2 bg-white border border-[#bbcac0] rounded-[12px] text-[#1a1c1d] text-[14px] leading-[21px] placeholder-[#6E717C] focus:outline-none focus:ring-2 focus:ring-[#00b37e] focus:border-transparent transition-all duration-200 h-[48px]"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                required
                type="text"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              className="block text-[13px] leading-[18px] font-semibold text-[#3c4a42] ml-1"
              htmlFor="username"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6E717C]">
                <span className="material-symbols-outlined text-xl">alternate_email</span>
              </div>
              <input
                className="w-full pl-[44px] pr-4 py-2 bg-white border border-[#bbcac0] rounded-[12px] text-[#1a1c1d] text-[14px] leading-[21px] placeholder-[#6E717C] focus:outline-none focus:ring-2 focus:ring-[#00b37e] focus:border-transparent transition-all duration-200 h-[48px]"
                id="username"
                name="username"
                placeholder="johndoe"
                required
                type="text"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              className="block text-[13px] leading-[18px] font-semibold text-[#3c4a42] ml-1"
              htmlFor="email"
            >
              Email Address
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
            <label
              className="block text-[13px] leading-[18px] font-semibold text-[#3c4a42] ml-1"
              htmlFor="password"
            >
              Password
            </label>
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
                id="togglePassword"
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

          <div className="flex items-start mt-5 mb-6">
            <div className="flex items-center h-5">
              <input
                className="w-5 h-5 text-[#00b37e] bg-white border-[#bbcac0] rounded focus:ring-[#00b37e] focus:ring-2 focus:ring-offset-2 cursor-pointer"
                id="terms"
                name="terms"
                required
                type="checkbox"
              />
            </div>
            <div className="ml-2 text-sm">
              <label className="text-[14px] leading-[21px] text-[#6E717C] cursor-pointer" htmlFor="terms">
                I agree to the{' '}
                <a href="#" className="font-semibold text-[#00b37e] hover:underline decoration-2 underline-offset-2">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-semibold text-[#00b37e] hover:underline decoration-2 underline-offset-2">
                  Privacy Policy
                </a>
                .
              </label>
            </div>
          </div>

          <button
            className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-sm font-semibold text-[13px] leading-[18px] text-white transition-all duration-200 ${
              isSuccess
                ? 'bg-[#006c4b]'
                : isLoading
                ? 'bg-[#00b37e] opacity-80 cursor-not-allowed'
                : 'bg-[#00b37e] hover:opacity-90 active:scale-[0.98]'
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin mr-2">
                  progress_activity
                </span>
                Creating...
              </>
            ) : isSuccess ? (
              <>
                <span className="material-symbols-outlined mr-2">check_circle</span>
                Success
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[14px] leading-[21px] text-[#6E717C]">
            Already have an account?{' '}
            <Link
              className="font-semibold text-[#006c4b] hover:text-[#00b37e] transition-colors ml-1"
              href="/login"
            >
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}