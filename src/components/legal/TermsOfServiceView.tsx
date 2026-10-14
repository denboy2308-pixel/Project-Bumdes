import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Scale, 
  HelpCircle, 
  ArrowLeft, 
  Printer, 
  Calendar, 
  CreditCard,
  Trash2,
  Store,
  ShieldCheck
} from 'lucide-react';
import { PageType } from '../../types';

interface TermsOfServiceViewProps {
  onNavigate?: (page: PageType) => void;
}

export default function TermsOfServiceView({ onNavigate }: TermsOfServiceViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-left transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb / Back Button */}
        <div className="flex items-center justify-between">
          {onNavigate && (
            <button
              onClick={() => onNavigate('beranda')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda Utama</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>Cetak Dokumen</span>
          </button>
        </div>

        {/* Document Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
                <span>Dokumen Regulasi Operasional Desa</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Syarat & Ketentuan Layanan (Terms of Service)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Tata Tertib Penggunaan Fasilitas Publik, Bank Sampah & Ekosistem Digital BUMDES Waskita Wijaya
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Nomor Regulasi</span>
              <strong className="text-slate-900 dark:text-slate-200">PERDES-WR/BUMDES-TOS/2026/04</strong>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Status Keberlakuan</span>
              <strong className="text-emerald-600 dark:text-emerald-400">Mengikat Seluruh Pengguna</strong>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Wilayah Yuridiksi</span>
              <strong className="text-slate-900 dark:text-slate-200">Desa Waru, Baki, Sukoharjo</strong>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">

          {/* Pasal 1: Definisi & Kedudukan Hukum */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center text-xs">
                1
              </span>
              <span>Ketentuan Umum dan Kedudukan Hukum</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              <p>
                Badan Usaha Milik Desa (BUMDES) Waskita Wijaya adalah badan hukum yang didirikan berdasarkan Peraturan Desa Waru Nomor 04 Tahun 2021 sesuai amanat Undang-Undang Nomor 6 Tahun 2014 tentang Desa.
              </p>
              <p>
                Dengan mengakses website, mendaftarkan akun nasabah, memesan fasilitas sewa, atau melakukan pembayaran di loket dan online, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan yang tercantum dalam dokumen ini.
              </p>
            </div>
          </section>

          {/* Pasal 2: Layanan Bank Sampah & Retribusi */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center text-xs">
                2
              </span>
              <span>Tata Tertib Layanan Bank Sampah & Retribusi Lingkungan</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Pemilahan Sampah</strong>: Warga nasabah diwajibkan memilah sampah anorganik (plastik, kertas, kaleng) dan sampah residu sesuai instruksi pengelola.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Timbangan Digital Transparan</strong>: Penimbangan sampah dilakukan menggunakan timbangan digital resmi di hanggar atau titik kumpul RT, dan dicatat langsung ke saldo buku tabungan nasabah.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Iuran Retribusi Bulanan</strong>: Pembayaran iuran sampah rumah tangga (Rp 25.000/bulan) jatuh tempo setiap tanggal 10 bulan berjalan. Dari nominal tersebut, dialokasikan cashback kas RT sebesar Rp 5.000.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Penarikan Tabungan Sampah</strong>: Saldo tabungan dapat ditarik sewaktu-waktu di loket teller kantor BUMDes pada jam kerja operasional atau menjelang Hari Raya.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Pasal 3: Reservasi Lapangan Bulutangkis & Gedung */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center text-xs">
                3
              </span>
              <span>Tata Tertib & Ketentuan Reservasi Fasilitas (GOR & Gedung Serbaguna)</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              <p>Penggunaan fasilitas olahraga dan gedung pertemuan diatur sebagai berikut:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <strong className="text-xs text-slate-900 dark:text-white block font-bold">
                    🏸 Lapangan Bulutangkis GOR Waru
                  </strong>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                    <li>Wajib mengenakan sepatu olahraga khusus (non-marking sole) untuk menjaga karpet vinyl dan lantai parket.</li>
                    <li>Dilarang merokok, membawa senjata tajam, atau minuman beralkohol di area indoor.</li>
                    <li>Sesi sewa dihitung per jam penuh sesuai tiket booking yang sah. Keterlambatan kehadiran pemain tidak memperpanjang jam main.</li>
                    <li>Konfirmasi kedatangan dilakukan dengan memindai QR Code E-Tiket ke petugas kasir loket.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <strong className="text-xs text-slate-900 dark:text-white block font-bold">
                    🏛️ Gedung Serbaguna Pertemuan
                  </strong>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                    <li>Pemesanan gedung mewajibkan Uang Muka (DP) sebesar 30% (Rp 750.000) saat pemesanan slot dikunci.</li>
                    <li>Pelunasan biaya sewa (70% sisa) wajib diselesaikan selambat-lambatnya 3 (tiga) hari sebelum hari pelaksanaan acara (H-3).</li>
                    <li>Penyewa bertanggung jawab penuh atas keutuhan aset gedung (kursi, AC, panggung, perlengkapan sound system).</li>
                    <li>Pemasangan dekorasi wajib mematuhi standar keselamatan dan tidak merusak dinding atau plafon gedung.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Pasal 4: Pembatalan, Penjadwalan Ulang & Pengembalian Dana */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center text-xs">
                4
              </span>
              <span>Kebijakan Pembatalan, Reschedule & Refund (Pengembalian Dana)</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <strong className="text-slate-900 dark:text-white block font-bold">Aturan Penjadwalan Ulang (Reschedule)</strong>
                  <span className="text-slate-600 dark:text-slate-300">
                    Penjadwalan ulang sewa lapangan dapat diajukan gratis maksimal 6 jam sebelum sesi bermain dimulai, selama slot waktu pengganti masih tersedia. Penjadwalan ulang gedung hajatan dapat diajukan maksimal 14 hari sebelum acara.
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <p><strong>Pengembalian Dana (Refund):</strong></p>
                <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-300">
                  <li>Pembatalan sewa lapangan &gt; 24 jam sebelum jadwal: Pengembalian dana 100% dipotong biaya administrasi perbankan.</li>
                  <li>Pembatalan sewa gedung &gt; 30 hari sebelum acara: Pengembalian DP 75%; pembatalan H-14 s.d H-7: Pengembalian DP 50%.</li>
                  <li>Keadaan Kahar (*Force Majeure*) seperti bencana alam atau instruksi darurat kedinasan: Pengembalian dana 100% atau penjadwalan ulang penuh tanpa penalti.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Pasal 5: Hak Kekayaan Intelektual & Mitra UMKM */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center text-xs">
                5
              </span>
              <span>Marketplace Produk UMKM & Transaksi Halal Desa</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <p>
                Setiap produk kuliner, kriya, dan pertanian yang terdaftar di etalase Marketplace BUMDes adalah produk asli karya warga dan pelaku UMKM Desa Waru yang telah terverifikasi.
              </p>
              <p>
                Pelaku usaha bertanggung jawab penuh atas higienitas, kehalalan, tanggal kedaluwarsa, dan perizinan edar pangan (P-IRT/BPOM). BUMDes bertindak sebagai agregator promosi, pencatat transaksi digital, dan penyedia etalase bersama.
              </p>
            </div>
          </section>

          {/* Pasal 6: Penyelesaian Sengketa */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center text-xs">
                6
              </span>
              <span>Penyelesaian Perselisihan & Mediasi Desa</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <p>
                Segala perselisihan yang timbul dari penafsiran atau pelaksanaan syarat dan ketentuan ini diselesaikan terlebih dahulu melalui <strong>Musyawarah untuk Mufakat</strong> secara kekeluargaan di Kantor Desa Waru dengan difasilitasi oleh Pemerintah Desa Waru dan Badan Permusyawaratan Desa (BPD).
              </p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
