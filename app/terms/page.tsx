export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f9f9fb] text-[#1a1c1d] py-12 px-5 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-[#e2e2e4] rounded-[28px] p-8 md:p-12 shadow-sm space-y-6">
        <h1 className="text-[28px] font-bold text-[#1a1c1d]">Syarat & Ketentuan</h1>
        <p className="text-[13px] text-[#6E717C]">Terakhir diperbarui: 2026</p>

        <section className="space-y-3 text-[14px] text-[#3c4a42] leading-relaxed">
          <h2 className="text-[18px] font-bold text-[#1a1c1d] pt-4">1. Ketentuan Umum</h2>
          <p>
            Dengan mengakses dan menggunakan aplikasi TaskFlow, Anda menyetujui untuk terikat dengan Syarat dan Ketentuan penggunaan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.
          </p>

          <h2 className="text-[18px] font-bold text-[#1a1c1d] pt-4">2. Akun & Paket Gratis (Free Plan)</h2>
          <p>
            Paket uji coba gratis (Free Plan) berdurasi 1 bulan dan hanya dapat diklaim sebanyak 1 kali seumur hidup untuk setiap 1 akun Gmail. Penyalahgunaan sistem multi-akun akan ditindak sesuai kebijakan platform.
          </p>

          <h2 className="text-[18px] font-bold text-[#1a1c1d] pt-4">3. Pembayaran & Langganan</h2>
          <p>
            Pembelian paket berbayar (Bulanan atau Permanent/Lifetime) bersifat final setelah transaksi berhasil dikonfirmasi. Paket Permanent memberikan akses selamanya sesuai dengan ketentuan fitur yang berlaku pada paket tersebut.
          </p>

          <h2 className="text-[18px] font-bold text-[#1a1c1d] pt-4">4. Perubahan Layanan</h2>
          <p>
            TaskFlow berhak sewaktu-waktu mengubah, menangguhkan, atau menghentikan fitur maupun layanan dengan atau tanpa pemberitahuan sebelumnya.
          </p>
        </section>
      </div>
    </div>
  );
}