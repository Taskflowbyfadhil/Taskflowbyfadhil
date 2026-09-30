import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.taskflow.app.fadhil123',
  appName: 'TaskFlow',
  webDir: 'public',
  server: {
    url: 'https://taskflowbyfadhil.vercel.app', // Ganti dengan URL Vercel Anda yang aktif
    cleartext: true
  }
};

export default config;