/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Wajib agar Next.js menghasilkan folder 'out' untuk Capacitor
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Wajib untuk static export agar komponen Image Next.js tidak error di iOS
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;