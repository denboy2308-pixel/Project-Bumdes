import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  Sliders, 
  Search, 
  Zap, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Info, 
  Award,
  Calendar,
  DollarSign,
  Trophy,
  FileSpreadsheet,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  Ticket,
  HelpCircle,
  Newspaper,
  Award as CertificateIcon,
  Languages,
  QrCode,
  Wind,
  Briefcase,
  BarChart3,
  Truck,
  Volume2,
  UserCheck,
  Sun,
  X,
  Palette,
  FileText,
  CreditCard,
  MapPin,
  GraduationCap,
  Bot,
  Radio,
  Video,
  Coins,
  HeartHandshake,
  Vote,
  Leaf,
  Users,
  Utensils,
  Calculator,
  Tv,
  Check,
  ShieldAlert,
  Gift
} from 'lucide-react';

export interface FeatureItem {
  id: string;
  number: number;
  title: string;
  category: 'Layanan Digital' | 'Operasional & Keuangan' | 'Pemasaran & UMKM' | 'Komunikasi Warga' | 'Transparansi & Smart';
  badge: string;
  impactScore: string;
  icon: React.ElementType;
  description: string;
  benefit: string;
}

export const FEATURE_RECOMMENDATIONS: FeatureItem[] = [
  {
    id: 'feat-1',
    number: 1,
    title: 'Sistem Antrean & Slot Reservasi Lapangan Live',
    category: 'Layanan Digital',
    badge: 'Paling Populer',
    impactScore: '⚡ Efisiensi 95%',
    icon: Calendar,
    description: 'Menampilkan kalender slot jam lapangan badminton, futsal, dan aula secara real-time dengan status booking otomatis.',
    benefit: 'Mencegah bentrok jadwal sewa GOR dan memudahkan warga booking slot dari HP tanpa perlu datang ke lokasi.'
  },
  {
    id: 'feat-2',
    number: 2,
    title: 'Kalkulator Zakat, Infaq & Donasi Sosial Desa',
    category: 'Operasional & Keuangan',
    badge: 'Sosial & Keagamaan',
    impactScore: '💰 Transaksi +40%',
    icon: DollarSign,
    description: 'Perhitungan otomatis zakat maal/fitrah dan donasi program sosial terintegrasi ke kas BUMDESA.',
    benefit: 'Memudahkan penyaluran bantuan warga secara transparan dan akuntabel lewat kas desa.'
  },
  {
    id: 'feat-3',
    number: 3,
    title: 'Papan Skor Digital & Live Leaderboard Turnamen',
    category: 'Layanan Digital',
    badge: 'Olahraga & Event',
    impactScore: '🏆 Engagement Tinggi',
    icon: Trophy,
    description: 'Pengaturan skor pertandingan real-time yang dapat ditampilkan di layar monitor GOR Desa.',
    benefit: 'Meningkatkan gengsi turnamen bulutangkis antar-RT dan kenyamanan penonton di arena.'
  },
  {
    id: 'feat-4',
    number: 4,
    title: 'Export Laporan Kas Otomatis Ke PDF & Excel',
    category: 'Transparansi & Smart',
    badge: 'Sistem Audit BPD',
    impactScore: '📄 Akuntabilitas 100%',
    icon: FileSpreadsheet,
    description: 'Cetak dan unduh rekap Laba-Rugi, Neraca Kas, dan Audit BPD resmi BUMDESA dalam format PDF/Excel sekali klik.',
    benefit: 'Pengurus tidak perlu rekap manual untuk Laporan Keterangan Pertanggungjawaban (LKPJ) Musdes.'
  },
  {
    id: 'feat-5',
    number: 5,
    title: 'Katalog Produk UMKM Desa Waru (Marketplace Lokal)',
    category: 'Pemasaran & UMKM',
    badge: 'Ekonomi Warga',
    impactScore: '🛍️ Omzet UMKM +60%',
    icon: ShoppingBag,
    description: 'Galeri promosi produk kerajinan, kuliner khas, dan usaha mikro milik warga Desa Waru.',
    benefit: 'Membantu pengrajin dan UMKM warga mendapat pembeli dari luar daerah secara online.'
  },
  {
    id: 'feat-6',
    number: 6,
    title: 'Notifikasi WhatsApp Otomatis Pengingat Setor Sampah',
    category: 'Komunikasi Warga',
    badge: 'Otomatisasi WA',
    impactScore: '📲 Retensi +80%',
    icon: MessageSquare,
    description: 'Kirim pesan pengingat otomatis ke WhatsApp nasabah H-1 sebelum jadwal penimbangan Bank Sampah.',
    benefit: 'Meningkatkan tingkat kehadiran nasabah dan pengumpulan sampah daur ulang secara konsisten.'
  },
  {
    id: 'feat-7',
    number: 7,
    title: 'Simulator Proyeksi Bagi Hasil SHU Anggota',
    category: 'Operasional & Keuangan',
    badge: 'Estimasi Deviden',
    impactScore: '📈 Motivasi Nasabah',
    icon: TrendingUp,
    description: 'Hitung estimasi deviden Sisa Hasil Usaha (SHU) tahunan secara personal berdasarkan volume daur ulang.',
    benefit: 'Mendorong warga makin giat memilah sampah demi mendapatkan pembagian SHU lebih besar.'
  },
  {
    id: 'feat-8',
    number: 8,
    title: 'E-Kupon Discount & Voucher Sewa Gedung Warga',
    category: 'Pemasaran & UMKM',
    badge: 'Loyalitas Warga',
    impactScore: '🎟️ Diskon Khusus',
    icon: Ticket,
    description: 'Sistem penerbitan voucher diskon khusus bagi warga ber-KTP Desa Waru untuk penyewaan gedung.',
    benefit: 'Memberikan insentif istimewa bagi warga lokal dibandingkan penyewa luar desa.'
  },
  {
    id: 'feat-9',
    number: 9,
    title: 'Formulir Pengaduan & Aspirasi Warga Anonym',
    category: 'Komunikasi Warga',
    badge: 'Kanal Bebas',
    impactScore: '🔒 Privasi Aman',
    icon: HelpCircle,
    description: 'Kanal aspirasi terenkripsi untuk kritik, masukan, dan laporan kendala fasilitas desa.',
    benefit: 'Meningkatkan kepuasan warga dan deteksi dini masalah operasional sebelum membesar.'
  },
  {
    id: 'feat-10',
    number: 10,
    title: 'Portal Berita & Buletin Edukasi Lingkungan',
    category: 'Komunikasi Warga',
    badge: 'Artikel Edukasi',
    impactScore: '📰 Edukasi Publik',
    icon: Newspaper,
    description: 'Artikel tips daur ulang mandiri, pengolahan kompos rumah tangga, dan kabar kegiatan desa.',
    benefit: 'Membangun kesadaran ramah lingkungan dan transparansi program kerja BUMDESA.'
  },
  {
    id: 'feat-11',
    number: 11,
    title: 'Sertifikat Digital Apresiasi Nasabah Teladan',
    category: 'Pemasaran & UMKM',
    badge: 'E-Sertifikat',
    impactScore: '🏅 Kebanggaan Warga',
    icon: CertificateIcon,
    description: 'Cetak e-sertifikat apresiasi otomatis bagi warga penyetor sampah terbanyak setiap bulan.',
    benefit: 'Apresiasi moral yang bisa dibagikan warga ke media sosial untuk inspirasi lingkungan.'
  },
  {
    id: 'feat-12',
    number: 12,
    title: 'Dukungan Basa Jawa Halus / Krama Inggil (Multi-Language)',
    category: 'Layanan Digital',
    badge: 'Kearifan Lokal',
    impactScore: '👵 Ramah Lansia',
    icon: Languages,
    description: 'Sakelar pilihan bahasa Indonesia dan Basa Jawa Krama untuk memudahkan sesepuh desa.',
    benefit: 'Membuat website sangat inklusif dan dihormati oleh para pini sepuh tokoh masyarakat.'
  },
  {
    id: 'feat-13',
    number: 13,
    title: 'QRIS Dynamic Pembayaran Tagihan Instant',
    category: 'Operasional & Keuangan',
    badge: 'Cashless',
    impactScore: '💳 Bebas Kembalian',
    icon: QrCode,
    description: 'Penjanaan QRIS otomatis sesuai nominal tepat tagihan sewa gedung atau iuran retribusi.',
    benefit: 'Mencegah penyimpangan dana dan mempermudah pembayaran via GoPay, OVO, ShopeePay & M-Banking.'
  },
  {
    id: 'feat-14',
    number: 14,
    title: 'Monitoring Kualitas Udara & Depo Sampah Real-time',
    category: 'Transparansi & Smart',
    badge: 'IoT & Sensor',
    impactScore: '🌿 Bebas Bau',
    icon: Wind,
    description: 'Widget indikator kebersihan dan persentase kapasitas tampung depo daur ulang terkini.',
    benefit: 'Memastikan depo sampah selalu dibersihkan secara higienis sebelum menumpuk berlebih.'
  },
  {
    id: 'feat-15',
    number: 15,
    title: 'Portal Pengumuman Lelang & Peluang Kemitraan',
    category: 'Pemasaran & UMKM',
    badge: 'Investasi Desa',
    impactScore: '🤝 Kerjasama Swasta',
    icon: Briefcase,
    description: 'Papan pengadaan barang/jasa BUMDESA dan penawaran kerjasama bisnis untuk investor.',
    benefit: 'Membuka peluang masuknya modal investasi usaha dari pihak swasta profesional.'
  },
  {
    id: 'feat-16',
    number: 16,
    title: 'Grafik Analytics Retensi & Pertumbuhan Nasabah',
    category: 'Operasional & Keuangan',
    badge: 'Visualisasi Data',
    impactScore: '📊 Statistik Jelas',
    icon: BarChart3,
    description: 'Visualisasi diagram kurva pertumbuhan nasabah aktif dan grafik volume sampah per-bulan.',
    benefit: 'Memudahkan Direksi mengambil keputusan strategis ekspansi wilayah operasional.'
  },
  {
    id: 'feat-17',
    number: 17,
    title: 'Jadwal Pengangkutan Sampah Interaktif Per-RT/RW',
    category: 'Layanan Digital',
    badge: 'Peta Armada',
    impactScore: '🚛 Tepat Waktu',
    icon: Truck,
    description: 'Peta dan tabel waktu kedatangan armada truk penjemputan sampah di masing-masing RT.',
    benefit: 'Warga dapat menyiapkan tong sampah di depan rumah tepat waktu sebelum armada lewat.'
  },
  {
    id: 'feat-18',
    number: 18,
    title: 'Fitur Pembaca Suara Teks (Text-to-Speech Accessibility)',
    category: 'Layanan Digital',
    badge: 'Aksesibilitas',
    impactScore: '🔊 Suara Jernih',
    icon: Volume2,
    description: 'Fitur narasi suara otomatis pembaca artikel dan layanan untuk warga berkebutuhan khusus.',
    benefit: 'Memudahkan warga lansia atau tunanetra menyimak informasi resmi desa.'
  },
  {
    id: 'feat-19',
    number: 19,
    title: 'Absensi Digital & Tracking Kinerja Staf Operasional',
    category: 'Transparansi & Smart',
    badge: 'GPS Tracking',
    impactScore: '⏱️ Disiplin Staf',
    icon: UserCheck,
    description: 'Log presensi GPS dan laporan tugas harian petugas pemilah sampah dan pengelola GOR.',
    benefit: 'Meningkatkan produktivitas kerja pegawai BUMDESA secara profesional.'
  },
  {
    id: 'feat-20',
    number: 20,
    title: 'Widget Cuaca Lokal Baki-Sukoharjo & Kalender Desa',
    category: 'Layanan Digital',
    badge: 'Info Harian',
    impactScore: '☀️ Tepat Guna',
    icon: Sun,
    description: 'Prakiraan cuaca akurat wilayah Baki Sukoharjo & agenda acara kemasyarakatan Desa Waru.',
    benefit: 'Warga dapat merencanakan kegiatan lapangan dan acara hajatan desa dengan aman.'
  },
  {
    id: 'feat-21',
    number: 21,
    title: 'Sistem E-Surat Keterangan Anggota BUMDESA Online',
    category: 'Layanan Digital',
    badge: 'E-Surat Desa',
    impactScore: '📝 Bebas Kertas',
    icon: FileText,
    description: 'Pengajuan surat Keterangan Nasabah Aktif dan Bebas Tunggakan Sampah langsung cetak dari HP.',
    benefit: 'Mempercepat pengurusan berkas administrasi warga 10x lebih hemat waktu.'
  },
  {
    id: 'feat-22',
    number: 22,
    title: 'Kasir POS Digital Pembayaran Sewa & Warung Desa',
    category: 'Operasional & Keuangan',
    badge: 'POS Kasir',
    impactScore: '🧾 Struk WA Instant',
    icon: CreditCard,
    description: 'Pencatatan kasir penjualan kantin GOR dan sewa lapangan dengan cetak struk nota terkirim ke WhatsApp.',
    benefit: 'Menjamin 100% penerimaan kas tercatat rapi tanpa resiko piutang tak berizin.'
  },
  {
    id: 'feat-23',
    number: 23,
    title: 'Peta GIS Titik Drop-Off Sampah Organik Per-RT',
    category: 'Transparansi & Smart',
    badge: 'GIS Desa Waru',
    impactScore: '🗺️ Peta Presisi',
    icon: MapPin,
    description: 'Pemetaan lokasi tong pilah sampah daur ulang dan komposter kelompok tani di seluruh dukuh.',
    benefit: 'Memudahkan warga dan relawan menemukan depo pembuangan sampah terdekat.'
  },
  {
    id: 'feat-24',
    number: 24,
    title: 'Portal Pelatihan & Workshop UMKM Gratis Warga',
    category: 'Pemasaran & UMKM',
    badge: 'Akademi Desa',
    impactScore: '🎓 Skill UMKM',
    icon: GraduationCap,
    description: 'Jadwal dan pendaftaran pelatihan kewirausahaan, teknik kemasan, dan foto produk usaha warga.',
    benefit: 'Menciptakan wirausaha baru dan menaikkan omzet produk lokal Desa Waru.'
  },
  {
    id: 'feat-25',
    number: 25,
    title: 'Asisten Virtual AI BUMDESA (AI Chatbot 24/7)',
    category: 'Komunikasi Warga',
    badge: 'Kecerdasan AI',
    impactScore: '🤖 Respon 1 Detik',
    icon: Bot,
    description: 'Robot pembalas otomatis pertanyaan harga sewa GOR, saldo tabungan, dan jam operasional.',
    benefit: 'Warga mendapat jawaban instan tanpa perlu menunggu jam kantor operasional.'
  },
  {
    id: 'feat-26',
    number: 26,
    title: 'Kalkulator Jejak Karbon & Penyerapan CO2 Desa',
    category: 'Transparansi & Smart',
    badge: 'Eco Green ESG',
    impactScore: '🌱 Bebas Emisi',
    icon: Leaf,
    description: 'Perhitungan tonase emisi gas rumah kaca yang berhasil dikurangi berkat daur ulang plastik warga.',
    benefit: 'Memperkuat reputasi BUMDESA Waskita sebagai pengelola lingkungan hijau berprestasi.'
  },
  {
    id: 'feat-27',
    number: 27,
    title: 'Konversi Saldo Sampah Ke Emas Batangan Antam',
    category: 'Operasional & Keuangan',
    badge: 'Tabungan Emas',
    impactScore: '✨ Investasi Aman',
    icon: Coins,
    description: 'Fitur pembelian emas mikron/graman menggunakan akumulasi saldo daur ulang nasabah.',
    benefit: 'Memberikan nilai tambah finansial dan dorongan kuat warga untuk terus menabung sampah.'
  },
  {
    id: 'feat-28',
    number: 28,
    title: 'Sistem Tiketing & E-Pass QR Code Pintu Masuk GOR',
    category: 'Layanan Digital',
    badge: 'E-Ticket QR',
    impactScore: '🎟️ Pintu Otomatis',
    icon: Ticket,
    description: 'Pembelian tiket penonton turnamen bulutangkis secara online dengan scan barcode di gate masuk.',
    benefit: 'Mencegah pemalsuan tiket dan mempercepat antrean penonton di arena GOR Waru.'
  },
  {
    id: 'feat-29',
    number: 29,
    title: 'Papan Lowongan Kerja & Tenaga Kerja Desa (Loker)',
    category: 'Pemasaran & UMKM',
    badge: 'Loker Lokal',
    impactScore: '💼 Serap Tenaga Kerja',
    icon: Briefcase,
    description: 'Direktori lowongan pekerjaan di unit BUMDESA maupun industri pabrik mitra wilayah Baki.',
    benefit: 'Membantu pemuda-pemudi desa memperoleh pekerjaan produktif secara akuntabel.'
  },
  {
    id: 'feat-30',
    number: 30,
    title: 'Sistem Booking Alat Tenda & Sound System Hajatan',
    category: 'Layanan Digital',
    badge: 'Sewa Aset Desa',
    impactScore: '⛺ Perlengkapan Acara',
    icon: Radio,
    description: 'Katalog dan pemesanan perlengkapan pesta seperti panggung, sound system, dan tenda milik desa.',
    benefit: 'Solusi terjangkau bagi warga yang menyelenggarakan pesta perkawinan atau syukuran.'
  },
  {
    id: 'feat-31',
    number: 31,
    title: 'Streaming CCTV Keamanan Arena & Depo Sampah',
    category: 'Transparansi & Smart',
    badge: 'CCTV Live Feed',
    impactScore: '📹 Pantauan 24/7',
    icon: Video,
    description: 'Akses pantauan kamera pengawas di lapangan olahraga dan parkiran untuk rasa aman.',
    benefit: 'Mencegah tindakan kriminalitas dan memantau kebersihan lingkungan secara terukur.'
  },
  {
    id: 'feat-32',
    number: 32,
    title: 'Portal Kemitraan CSR & Proposal Sponsor Swasta',
    category: 'Pemasaran & UMKM',
    badge: 'Sponsor CSR',
    impactScore: '🤝 Dana Swasta',
    icon: HeartHandshake,
    description: 'Formulir pengajuan kemitraan dan laporan penyaluran dana tanggung jawab sosial perusahaan.',
    benefit: 'Menarik dukungan hibah alat berat pencacah dari perusahaan manufaktur sekitar Sukoharjo.'
  },
  {
    id: 'feat-33',
    number: 33,
    title: 'Program Poin Hadiah & Diskon Merchant Tetangga',
    category: 'Pemasaran & UMKM',
    badge: 'Poin Belanja',
    impactScore: '🎁 Tukar Voucher',
    icon: Gift,
    description: 'Setiap penimbangan sampah menghasilkan poin loyalty yang dapat ditukar kupon sembako warung desa.',
    benefit: 'Menghidupkan perputaran ekonomi lokal di antara sesama pedagang Desa Waru.'
  },
  {
    id: 'feat-34',
    number: 34,
    title: 'Papan Peringatan Dini Bencana & Cuaca Ekstrem',
    category: 'Komunikasi Warga',
    badge: 'Siaga Bencana',
    impactScore: '⚠️ Alert Otomatis',
    icon: ShieldAlert,
    description: 'Integrasi data BMKG Sukoharjo untuk peringatan dini angin kencang, banjir, atau badai.',
    benefit: 'Meningkatkan kesiapsiagaan warga dan mengamankan aset fasilitas publik desa.'
  },
  {
    id: 'feat-35',
    number: 35,
    title: 'Portal Relawan Lingkungan & Komunitas Pemuda',
    category: 'Komunikasi Warga',
    badge: 'Pemuda Karang Taruna',
    impactScore: '👥 Gotong Royong',
    icon: Users,
    description: 'Pendaftaran kegiatan kerja bakti pembersihan sungai, penanaman pohon, dan acara kepemudaan.',
    benefit: 'Memupuk kepedulian generasi muda terhadap kelestarian desa warisan leluhur.'
  },
  {
    id: 'feat-36',
    number: 36,
    title: 'Pengingat Otomatis Penagihan Iuran Retribusi WA',
    category: 'Operasional & Keuangan',
    badge: 'PPOB Tagihan',
    impactScore: '📱 Tagihan Tepat',
    icon: MessageSquare,
    description: 'Kirim pesan tagihan iuran sampah bulanan pelanggan perumahan dengan tautan bayar online.',
    benefit: 'Menurunkan jumlah tunggakan pembayaran dan menjaga arus kas stabil BUMDESA.'
  },
  {
    id: 'feat-37',
    number: 37,
    title: 'Virtual Tour 360 Derajat Fasilitas GOR & Hall',
    category: 'Layanan Digital',
    badge: 'Virtual 360°',
    impactScore: '🌐 Tampilan Nyata',
    icon: Tv,
    description: 'Simulasi tur panorama 360 derajat kondisi lapangan, toilet, VIP room, dan ruang ganti.',
    benefit: 'Penyewa dari luar kota dapat melihat kualitas venue secara mendalam sebelum mentransfer DP.'
  },
  {
    id: 'feat-38',
    number: 38,
    title: 'Permohonan Modal Pinjaman Usaha Mikro (Kredit Desa)',
    category: 'Operasional & Keuangan',
    badge: 'Bantuan Modal',
    impactScore: '💵 Tanpa Rentenir',
    icon: DollarSign,
    description: 'Pengajuan bantuan peralatan kerja atau bahan baku murah bagi pelaku UMKM berdedikasi.',
    benefit: 'Melindungi pedagang kecil dari jeratan pinjaman online dan jerat bunga tinggi.'
  },
  {
    id: 'feat-39',
    number: 39,
    title: 'E-Voting Musdes Digital Pemilihan Program Prioritas',
    category: 'Transparansi & Smart',
    badge: 'Demokrasi Desa',
    impactScore: '🗳️ Suara Warga',
    icon: Vote,
    description: 'Voting online resmi warga untuk menentukan pembukaan unit bisnis baru yang paling dibutuhkan.',
    benefit: 'Keputusan investasi BUMDESA didasarkan pada aspirasi nyata mayoritas masyarakat.'
  },
  {
    id: 'feat-40',
    number: 40,
    title: 'Katalog Pupuk Organik & Kompos Olahan Sampah',
    category: 'Pemasaran & UMKM',
    badge: 'Hasil Daur Ulang',
    impactScore: '🌾 Subur Tani',
    icon: Utensils,
    description: 'Pemesanan pupuk kompos padat dan pupuk organik cair buatan BUMDESA untuk petani lokal.',
    benefit: 'Menyediakan suplai pupuk murah berkualitas untuk mendukung ketahanan pangan desa.'
  },
  {
    id: 'feat-41',
    number: 41,
    title: 'Absensi Scan ID Card QR Code Staf Petugas',
    category: 'Transparansi & Smart',
    badge: 'Disiplin Staf',
    impactScore: '🎴 Jam Kerja Pas',
    icon: UserCheck,
    description: 'Pencatatan jam masuk dan pulang kerja petugas sampah dan pengelola lapangan via scan QR.',
    benefit: 'Perhitungan insentif dan transparansi produktivitas karyawan BUMDESA.'
  },
  {
    id: 'feat-42',
    number: 42,
    title: 'Jadwal Posyandu & Layanan Kesehatan Terpadu',
    category: 'Komunikasi Warga',
    badge: 'Kesehatan Warga',
    impactScore: '🏥 Bebas Stunting',
    icon: HeartHandshake,
    description: 'Kalender imunisasi bayi, pemeriksaan lansia, dan pembagian makanan tambahan gizi.',
    benefit: 'Sinergi program kesehatan masyarakat dengan alokasi dana sosial BUMDESA.'
  },
  {
    id: 'feat-43',
    number: 43,
    title: 'Portal Wisata Kuliner & Kampung Tematik Waru',
    category: 'Pemasaran & UMKM',
    badge: 'Wisata Kuliner',
    impactScore: '🍲 Nasi Liwet Baki',
    icon: Utensils,
    description: 'Peta rute destinasi wisata jajanan khas Baki Sukoharjo bagi wisatawan luar daerah.',
    benefit: 'Meningkatkan kunjungan wisata dan pendapatan pedagang makanan di Desa Waru.'
  },
  {
    id: 'feat-44',
    number: 44,
    title: 'Loket Pembayaran PPOB Pulsa, PLN & BPJS Desa',
    category: 'Layanan Digital',
    badge: 'PPOB Lengkap',
    impactScore: '⚡ Transaksi Cepat',
    icon: CreditCard,
    description: 'Layanan bayar tagihan listrik, pulsa, token air, dan BPJS langsung lewat loket BUMDESA.',
    benefit: 'Menambah margin laba usaha fee-based income BUMDESA secara berkelanjutan.'
  },
  {
    id: 'feat-45',
    number: 45,
    title: 'Simulator Estimasi Biaya Sewa Gedung Custom',
    category: 'Operasional & Keuangan',
    badge: 'Hitung Paket',
    impactScore: '🧮 Harga Pasti',
    icon: Calculator,
    description: 'Kalkulator hitung harga sewa berdasarkan durasi jam, fasilitas AC, katering, dan lighting.',
    benefit: 'Calon penyewa mendapat kejelasan kepastian harga tanpa perlu tawar-menawar manual.'
  },
  {
    id: 'feat-46',
    number: 46,
    title: 'Kanal Dokumenter Youtube & Video Liputan Desa',
    category: 'Komunikasi Warga',
    badge: 'Media Kreatif',
    impactScore: '🎬 Video HD',
    icon: Tv,
    description: 'Tayangan video liputan acara desa, panduan daur ulang, dan profil prestasi BUMDESA.',
    benefit: 'Membangun citra positif BUMDESA Waskita Wijaya di tingkat nasional dan mancanegara.'
  },
  {
    id: 'feat-47',
    number: 47,
    title: 'Manajemen Inventaris & Pemeliharaan Aset Gedung',
    category: 'Transparansi & Smart',
    badge: 'Aset Desa',
    impactScore: '📦 Rawat Rutin',
    icon: ShieldCheck,
    description: 'Catatan jadwal servis rutin AC GOR, pengecatan ulang garis lapangan, dan perawatan penerangan.',
    benefit: 'Melindungi nilai aset fisik desa agar selalu dalam kondisi prima dan tahan lama.'
  },
  {
    id: 'feat-48',
    number: 48,
    title: 'Beasiswa Pendidikan Anak Nasabah Bank Sampah',
    category: 'Operasional & Keuangan',
    badge: 'Pendidikan Anak',
    impactScore: '🎓 Bantuan Sekolah',
    icon: GraduationCap,
    description: 'Pemberian perlengkapan sekolah gratis bagi putra-putri dari nasabah rajin memilah sampah.',
    benefit: 'Memotivasi anak-anak berprestasi sekaligus meningkatkan kepedulian lingkungan keluarga.'
  },
  {
    id: 'feat-49',
    number: 49,
    title: 'Fitur Tampilan Mode Hemat Baterai (Eco Dark UI)',
    category: 'Layanan Digital',
    badge: 'Hemat Baterai',
    impactScore: '🔋 Ramah HP',
    icon: Zap,
    description: 'Pilihan tema kontras tinggi dan mode hemat daya baterai bagi layar smartphone warga.',
    benefit: 'Aplikasi nyaman digunakan seharian tanpa khawatir menghabiskan kuota atau daya baterai.'
  },
  {
    id: 'feat-50',
    number: 50,
    title: 'Dashboard Eksekutif Kades & BPD (Executive Summary)',
    category: 'Transparansi & Smart',
    badge: 'Dashboard Kades',
    impactScore: '📊 Monitor Kades',
    icon: BarChart3,
    description: 'Tampilan khusus Kepala Desa & BPD untuk memantau omzet harian, saldo kas, dan kepuasan warga.',
    benefit: 'Memudahkan kepemimpinan desa mengambil kebijakan tepat berbasis data akurat (data-driven).'
  }
];

interface FeatureRecommendationsSectionProps {
  onShowToast?: (message: string, type?: 'success' | 'info' | 'warning') => void;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export default function FeatureRecommendationsSection({ onShowToast, isOpenModal, onCloseModal }: FeatureRecommendationsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected feature IDs state
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bumdes_activated_features');
      return saved ? JSON.parse(saved) : ['feat-1', 'feat-4', 'feat-6', 'feat-13', 'feat-21', 'feat-25', 'feat-27', 'feat-50']; // Default active features
    } catch {
      return ['feat-1', 'feat-4', 'feat-6', 'feat-13', 'feat-21', 'feat-25', 'feat-27', 'feat-50'];
    }
  });

  const categories = ['Semua', 'Layanan Digital', 'Operasional & Keuangan', 'Pemasaran & UMKM', 'Komunikasi Warga', 'Transparansi & Smart'];

  const filteredFeatures = FEATURE_RECOMMENDATIONS.filter(item => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleSelectFeature = (id: string) => {
    setSelectedFeatureIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedFeatureIds.length === FEATURE_RECOMMENDATIONS.length) {
      setSelectedFeatureIds([]);
    } else {
      setSelectedFeatureIds(FEATURE_RECOMMENDATIONS.map(f => f.id));
    }
  };

  const handleApplyFeatures = () => {
    localStorage.setItem('bumdes_activated_features', JSON.stringify(selectedFeatureIds));
    if (onShowToast) {
      onShowToast(`Berhasil mengaktifkan ${selectedFeatureIds.length} fitur pilihan! Sistem siap digunakan.`, 'success');
    }
    if (onCloseModal) {
      onCloseModal();
    }
  };

  const content = (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-700/60 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>50 Referensi Modul Masa Depan BUMDESA</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Katalog 50 Fitur Profesional & Efisien
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Pilih dan tandai beberapa fitur sekaligus yang ingin Anda aktifkan untuk meningkatkan kelas tata kelola digital Desa Waru.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {selectedFeatureIds.length === FEATURE_RECOMMENDATIONS.length ? (
                <>
                  <Square className="w-4 h-4 text-emerald-400" />
                  <span>Hapus Semua Pilihan</span>
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  <span>Pilih Semua (50 Fitur)</span>
                </>
              )}
            </button>

            <button
              onClick={handleApplyFeatures}
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Aktifkan ({selectedFeatureIds.length}) Fitur Terpilih</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari dari 50 nama fitur atau kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Cards Grid (Interactive Checkboxes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredFeatures.map((item) => {
          const isSelected = selectedFeatureIds.includes(item.id);
          const IconComp = item.icon;

          return (
            <div
              key={item.id}
              onClick={() => toggleSelectFeature(item.id)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                isSelected
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 shadow-xs'
              }`}
            >
              <div>
                {/* Top Bar: Number, Badge, and Checkbox */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                      #{item.number}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md hidden sm:inline-block">
                      {item.impactScore}
                    </span>
                  </div>

                  {/* Custom Checkbox Toggle */}
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-transparent'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Title & Icon */}
                <div className="flex items-start gap-3 my-2">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isSelected 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950 group-hover:text-emerald-600'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Benefit Box */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-[11px] text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">Keunggulan: </span>
                  {item.benefit}
                </div>
              </div>

              {/* Action Indicator */}
              <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Kategori: {item.category}</span>
                <span className={`font-bold flex items-center gap-1 ${
                  isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
                }`}>
                  {isSelected ? '✓ Terpilih Ditambahkan' : '+ Klik Untuk Memilih'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Footer */}
      <div className="sticky bottom-4 z-20 bg-slate-900/95 text-white p-4 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wide block">
              STATUS PERENCANAAN MODUL
            </span>
            <p className="text-xs text-slate-300">
              <strong className="text-white">{selectedFeatureIds.length} dari 50 fitur</strong> disetujui untuk diintegrasikan ke website.
            </p>
          </div>
        </div>

        <button
          onClick={handleApplyFeatures}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>Simpan & Terapkan ({selectedFeatureIds.length}) Modul Terpilih</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
          {onCloseModal && (
            <button
              onClick={onCloseModal}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="fitur-referensi-section" className="py-16 bg-slate-100/70 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
}

