export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f9f9fb] text-[#1a1c1d] py-12 px-5 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-[#e2e2e4] rounded-[28px] p-8 md:p-12 shadow-sm space-y-6">
        <h1 className="text-[28px] font-bold text-[#1a1c1d]">Kebijakan Privasi</h1>
        <p className="text-[13px] text-[#6E717C]">Terakhir diperbarui: 2026</p>

        <section className="space-y-3 text-[14px] text-[#3c4a42] leading-relaxed">
          <h2 className="text-[18px] font-bold text-[#1a1c1d] pt-4">1. Informasi yang Kami Kumpulkan</h2>
          <p>
            Kami mengumpulkan informasi yang Anda berikan secara sukarela saat mendaftar akun di TaskFlow, seperti alamat email (Gmail) dan nama pengguna, guna keperluan autentikasi dan pengelolaan layanan.
          </p>

          <h2 className="text-[18px] font-bold text-[#1a1c1d] pt-4">2. Penggunaan Data</h2>
          <p>
            Informasi Anda digunakan untuk menyediakan, memelihara, dan meningkatkan kualitas layanan TaskFlow, mengelola status langganan paket Anda, serta mengirimkan informasi penting terkait pembaruan sistem.
          </p>

          <h2 className="text-[18px] font-bold text-[#1a1c1d] pt-4">3. Keamanan Pembayaran</h2>
          <p>
            Seluruh transaksi pembayaran diproses melalui gerbang pembayaran resmi yang aman (Midtrans). Kami tidak menyimpan data sensitif kartu kredit atau detail perbankan Anda di server kami.
          </p>

          <h2 className="text-[18px] font-bold text-[#1a1c1d] pt-4">4. Hubungi Kami</h2>
          <p>
            Jika ada pertanyaan mengenai Kebijakan Privasi ini, Anda dapat menghubungi kami melalui dukungan pelanggan di dalam aplikasi.
          </p>
        </section>
      </div>
    </div>
  );
}