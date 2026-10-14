import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Eye, 
  Database, 
  UserCheck, 
  AlertCircle, 
  HelpCircle, 
  Building2, 
  Mail, 
  Phone, 
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { PageType } from '../../types';

interface PrivacyPolicyViewProps {
  onNavigate?: (page: PageType) => void;
}

export default function PrivacyPolicyView({ onNavigate }: PrivacyPolicyViewProps) {
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
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
                <span>Dokumen Kebijakan Resmi Desa</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Kebijakan Privasi & Perlindungan Data Pribadi
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Badan Usaha Milik Desa (BUMDES) Waskita Wijaya • Desa Waru, Kecamatan Baki, Kabupaten Sukoharjo
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Nomor Dokumen</span>
              <strong className="text-slate-900 dark:text-slate-200">BUMDES-WR/POL-PRIV/2026/V1</strong>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Berlaku Efektif</span>
              <strong className="text-slate-900 dark:text-slate-200">01 September 2026</strong>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Rujukan Hukum</span>
              <strong className="text-emerald-600 dark:text-emerald-400">UU No. 27 Tahun 2022 (PDP)</strong>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          
          {/* Pasal 1: Pendahuluan & Komitmen */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center text-xs">
                1
              </span>
              <span>Pendahuluan dan Landasan Perlindungan</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              <p>
                Badan Usaha Milik Desa (BUMDES) Waskita Wijaya Desa Waru berkomitmen penuh untuk menjunjung tinggi integritas, kerahasiaan, dan keamanan setiap data pribadi yang dipercayakan oleh warga masyarakat, nasabah bank sampah, penyewa fasilitas GOR & gedung, serta mitra pelaku UMKM desa.
              </p>
              <p>
                Kebijakan Privasi ini disusun berdasarkan ketentuan <strong>Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong> serta Peraturan Menteri Desa, Pembangunan Daerah Tertinggal, dan Transmigrasi mengenai Tata Kelola Kelembagaan BUMDes.
              </p>
            </div>
          </section>

          {/* Pasal 2: Data yang Dikumpulkan */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center text-xs">
                2
              </span>
              <span>Kategori Data Pribadi yang Kami Kumpulkan</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Untuk menyelenggarakan layanan secara tepat sasaran, sistem BUMDes mengumpulkan data yang relevan dengan prinsip minimisasi data (*data minimization*):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Data Identitas Kependudukan Desa</span>
                </div>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Nama Lengkap sesuai e-KTP.</li>
                  <li>Nomor Induk Kependudukan (NIK) terenkripsi.</li>
                  <li>Alamat domisili (Dusun, RT, dan RW di Desa Waru).</li>
                  <li>Nomor Telepon aktif & WhatsApp untuk notifikasi tagihan/jadwal.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>Data Transaksi & Finansial Layanan</span>
                </div>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Riwayat timbangan dan saldo tabungan nasabah bank sampah.</li>
                  <li>Faktur invoice tagihan retribusi sampah & nomor E-Kuitansi.</li>
                  <li>Log reservasi pemakaian lapangan GOR badminton & gedung.</li>
                  <li>Riwayat pembayaran digital melalui scan QRIS resmi desa.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Pasal 3: Tujuan Pemrosesan Data */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center text-xs">
                3
              </span>
              <span>Tujuan Penggunaan & Pemrosesan Data</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <p>Data pribadi yang dikumpulkan semata-mata dimanfaatkan untuk tujuan operasional sah:</p>
              <div className="space-y-2 pt-1">
                {[
                  'Penyelenggaraan jadwal penjemputan sampah rutin oleh armada truk desa per rukun tetangga.',
                  'Penguncian ketersediaan slot sewa lapangan dan aula secara akurat guna mencegah booking ganda.',
                  'Penerbitan bukti setor sah dan e-kuitansi pembayaran yang dapat dipertanggungjawabkan dalam laporan PADes.',
                  'Penyaluran dana bagi hasil cashback kas RT sebesar Rp 5.000 per nasabah aktif per bulan.',
                  'Penyampaian informasi darurat, pengumuman jadwal musdes, dan pengingat tanggal jatuh tempo via WhatsApp resmi.'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pasal 4: Keamanan & Larangan Penjualan Data */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center text-xs">
                4
              </span>
              <span>Keamanan Basis Data & Tidak Ada Penjualan Data</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Jaminan Mutlak: Data Tidak Pernah Dijual</strong>
                  <span className="text-slate-600 dark:text-slate-300 text-xs">
                    BUMDES Waskita Wijaya tidak pernah dan tidak akan pernah menjual, menyewakan, memperdagangkan, atau membagikan data identitas warga kepada pihak ketiga untuk kepentingan komersial, periklanan, atau telemarketing.
                  </span>
                </div>
              </div>
              <p>
                Seluruh data disimpan secara aman dengan enkripsi password satu arah (*scrypt one-way hashing*), isolasi sesi autentikasi berbasis token acak, serta pembatasan akses berbasis peran (*Role-Based Access Control*) yang memisahkan ranah Super Admin, Karyawan Teller, dan Pengguna Warga.
              </p>
            </div>
          </section>

          {/* Pasal 5: Hak Pemilik Data */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center text-xs">
                5
              </span>
              <span>Hak-Hak Warga Sebagai Pemilik Data Pribadi</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <p>Sesuai dengan Pasal 5 hingga Pasal 13 UU No. 27 Tahun 2022, setiap warga berhak:</p>
              <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-300">
                <li><strong>Hak Akses</strong>: Mengetahui dan meninjau seluruh data diri yang tersimpan di portal BUMDes.</li>
                <li><strong>Hak Pembaruan/Koreksi</strong>: Memperbarui nomor telepon, alamat dusun, atau kata sandi melalui menu profil.</li>
                <li><strong>Hak Transparansi</strong>: Memperoleh riwayat mutasi tabungan dan faktur pembayaran secara utuh.</li>
                <li><strong>Hak Penarikan Saldo & Penutupan Akun</strong>: Menarik seluruh saldo tabungan bank sampah dan memohon penutupan akun secara sukarela melalui loket kantor.</li>
              </ul>
            </div>
          </section>

          {/* Pasal 6: Kontak Petugas Perlindungan Data */}
          <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Kontak Petugas Perlindungan Data (Data Protection Officer)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Apabila Anda memiliki pertanyaan, permohonan koreksi data, atau laporan dugaan pelanggaran privasi, silakan menghubungi Tim Pengelola Data BUMDes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span className="text-slate-400 block text-[11px]">Email Resmi Privasi & Data:</span>
                <span className="text-emerald-400 font-bold">bumdes.waskitawijaya@waru.desa.id</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span className="text-slate-400 block text-[11px]">Hotline WhatsApp Layanan Data:</span>
                <span className="text-emerald-400 font-bold">+62 821-3456-7890</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              Alamat Surat Fisik: Kantor Sekretariat BUMDES Waskita Wijaya, Jl. Raya Waru-Baki No. 12, Desa Waru, Kec. Baki, Kab. Sukoharjo, Jawa Tengah 57556.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
