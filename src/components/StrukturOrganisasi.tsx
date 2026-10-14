import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Award, 
  Users, 
  Briefcase, 
  CheckCircle, 
  ChevronRight, 
  Info,
  Layers,
  Contact,
  X,
  Search,
  Filter,
  Network,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';

import avatarAgus from '../assets/images/avatar_agus_1784569945374.jpg';
import avatarBendahara from '../assets/images/avatar_bendahara_1784569883757.jpg';
import avatarBudi from '../assets/images/avatar_budi_1784569928011.jpg';
import avatarDirektur from '../assets/images/avatar_direktur_1784569851260.jpg';
import avatarKades from '../assets/images/avatar_kades_1784569831125.jpg';
import avatarPengawas from '../assets/images/avatar_pengawas_1784569910792.jpg';
import avatarSekretaris from '../assets/images/avatar_sekretaris_1784569867012.jpg';
import logoImage from '../assets/images/waskita_wijaya_logo_1784569660194.jpg';

export interface Member {
  id: string;
  name: string;
  title: string;
  subTitle?: string;
  image: string;
  role: 'Pelindung' | 'Pengawas' | 'Direksi' | 'Manajemen Inti' | 'Unit Usaha';
  badgeColor: string;
  skNumber: string;
  responsibilities: string[];
  motto: string;
  education: string;
  phone?: string;
}

export const TEAM_MEMBERS: Member[] = [
  {
    id: 'pelindung-1',
    name: 'H. Sriyanto, S.E.',
    title: 'Pelindung & Penasihat',
    subTitle: 'Kepala Desa Waru',
    image: avatarKades,
    role: 'Pelindung',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
    skNumber: 'SK Kades Waru No. 188.4/01/2024',
    education: 'S1 Ekonomi, Universitas Sebelas Maret',
    motto: '"Membangun Desa dengan Keterbukaan, Keadilan, dan Kemandirian Ekonomi"',
    responsibilities: [
      'Melakukan pengawasan umum terhadap seluruh kebijakan operasional BUMDES.',
      'Memberikan nasihat strategis demi keselarasan program kerja dengan pembangunan desa.',
      'Menyetujui rancangan rencana kerja anggaran dan kerja sama kemitraan strategis desa.'
    ]
  },
  {
    id: 'pengawas-1',
    name: 'Drs. Joko Wahyono, M.Si.',
    title: 'Ketua Dewan Pengawas',
    subTitle: 'Ketua BPD Desa Waru',
    image: avatarPengawas,
    role: 'Pengawas',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800',
    skNumber: 'SK BPD Waru No. 02/BPD/I/2024',
    education: 'S2 Magister Administrasi Publik, Universitas Diponegoro',
    motto: '"Akuntabilitas dan Integritas adalah Fondasi Kepercayaan Masyarakat"',
    responsibilities: [
      'Memeriksa laporan keuangan bulanan & tahunan BUMDES secara berkala.',
      'Mengevaluasi kinerja operasional pengurus direksi secara periodik.',
      'Menyusun rekomendasi perbaikan dan masukan strategis demi meminimalkan risiko bisnis.'
    ]
  },
  {
    id: 'direktur-1',
    name: 'Ir. Heri Prasetyo, M.T.',
    title: 'Direktur Utama BUMDES',
    subTitle: 'Penanggung Jawab Operasional',
    image: avatarDirektur,
    role: 'Direksi',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
    skNumber: 'SK Kades Waru No. 188.4/04/2024',
    education: 'S2 Teknik Industri, Institut Teknologi Bandung',
    motto: '"Inovasi Bisnis Berkelanjutan untuk Kesejahteraan Warga Desa Waru"',
    responsibilities: [
      'Memimpin dan mengendalikan jalannya seluruh kegiatan bisnis harian BUMDES.',
      'Menetapkan kebijakan, program kerja, dan Standar Operasional Prosedur (SOP).',
      'Mengembangkan jaringan kemitraan komersial dengan sektor swasta maupun pemerintah.'
    ]
  },
  {
    id: 'sekretaris-1',
    name: 'Rina Ambarwati, S.Pd.',
    title: 'Sekretaris Umum',
    subTitle: 'Administrasi & Legalitas',
    image: avatarSekretaris,
    role: 'Manajemen Inti',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800',
    skNumber: 'SK Kades Waru No. 188.4/05/2024',
    education: 'S1 Kependidikan, Universitas Negeri Yogyakarta',
    motto: '"Ketelitian Administrasi demi Kelancaran Sistem Tata Kelola Organisasi"',
    responsibilities: [
      'Mengelola administrasi surat-menyurat, kearsipan berkas, dan dokumen legal hukum BUMDES.',
      'Menyelenggarakan rapat berkala, mencatat notulensi, dan menyusun risalah keputusan.',
      'Membantu Direktur Utama dalam merancang laporan berkala untuk diserahkan ke desa.'
    ]
  },
  {
    id: 'bendahara-1',
    name: 'Eko Wijayanto, S.Ak.',
    title: 'Bendahara Keuangan',
    subTitle: 'Manajer Kas & Transparansi',
    image: avatarBendahara,
    role: 'Manajemen Inti',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800',
    skNumber: 'SK Kades Waru No. 188.4/06/2024',
    education: 'S1 Akuntansi, Universitas Muhammadiyah Surakarta',
    motto: '"Setiap Rupiah Kas Desa Harus Terkelola dengan Transparan dan Akuntabel"',
    responsibilities: [
      'Mengelola arus kas masuk dan keluar serta pembukuan keuangan BUMDES.',
      'Menyusun neraca keuangan bulanan, laporan laba-rugi, dan pembayaran pajak.',
      'Mengoperasikan dan mengawasi portal Papan Kas digital BUMDES.'
    ]
  },
  {
    id: 'unit-sampah',
    name: 'Budi Santoso, S.T.',
    title: 'Kepala Unit Usaha Layanan Pengelolaan Sampah',
    subTitle: 'Manajer Operasional Armada & Layanan Kebersihan',
    image: avatarBudi,
    role: 'Unit Usaha',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
    skNumber: 'SK Direktur BUMDES No. 08/BUMDES/2024',
    education: 'S1 Teknik Lingkungan, Universitas Diponegoro',
    motto: '"Mewujudkan Desa Waru Bersih, Mandiri, dan Memberi Nilai Tambah bagi Warga"',
    responsibilities: [
      'Mengoordinasikan rute armada pengangkutan sampah rumah tangga dan pelaku usaha (UMKM).',
      'Mengawasi skema iuran Rp 25.000 dengan penyaluran cashback Rp 5.000 ke kas RT/RW via PIC wilayah.',
      'Memelihara manajemen aset armada (motor roda tiga, truk TPA) dan menyusun laporan bulanan berkala.'
    ]
  },
  {
    id: 'unit-gedung',
    name: 'Agus Setiawan, S.Sos.',
    title: 'Kepala Unit Usaha Gedung & GOR',
    subTitle: 'Manajer Operasional Aula & Lapangan',
    image: avatarAgus,
    role: 'Unit Usaha',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800',
    skNumber: 'SK Direktur BUMDES No. 09/BUMDES/2024',
    education: 'S1 Sosiologi, Universitas Sebelas Maret Surakarta',
    motto: '"Memberikan Pelayanan Penyewaan Terbaik bagi Kenyamanan Olahraga Warga"',
    responsibilities: [
      'Mengatur manajemen jadwal penyewaan Aula Pertemuan dan Lapangan Bulutangkis.',
      'Memelihara kebersihan, pencahayaan, keamanan, serta perawatan aset fisik gedung desa.',
      'Mengoordinasikan staf kebersihan lapangan dan parkir demi keamanan kegiatan masyarakat.'
    ]
  }
];

interface StrukturOrganisasiProps {
  currentLogoSrc?: string;
}

export default function StrukturOrganisasi({ currentLogoSrc }: StrukturOrganisasiProps = {}) {
  const [activeTab, setActiveTab] = useState<'chart' | 'directory' | 'governance'>('chart');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(TEAM_MEMBERS[2]); // Default Direktur Utama
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeLogo = currentLogoSrc || logoImage;

  // Filter logic for Directory view
  const filteredMembers = TEAM_MEMBERS.filter(member => {
    const matchesRole = selectedRoleFilter === 'Semua' || member.role === selectedRoleFilter;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (member.subTitle && member.subTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const handleCardClick = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <section id="struktur-organisasi-section" className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 dark:bg-emerald-950/60 dark:text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-800 inline-flex items-center gap-2 shadow-xs">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Tata Kelola Professional Desa Waru</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Struktur Organisasi BUMDES
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full"></div>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Jajaran pengurus berpengalaman, transparan, dan berdedikasi tinggi yang menjalankan kemajuan unit usaha BUMDES Waskita Wijaya Desa Waru.
          </p>
        </div>

        {/* Stats Bar Highlight */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">7 Orang</span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pengurus Inti</span>
          </div>
          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400 block">2 Unit</span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unit Usaha Aktif</span>
          </div>
          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block">100%</span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transparansi Kas</span>
          </div>
          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400 block">2024 - 2029</span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Masa Bakti SK</span>
          </div>
        </div>

        {/* Tab Switcher Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-10">
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center shrink-0 p-1">
              <img 
                src={activeLogo} 
                alt="Logo BUMDESA Waskita Wijaya" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tracking-widest uppercase block leading-none">BUMDESA</span>
              <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mt-0.5">Waskita Wijaya</h4>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-none mt-0.5">DESA WARU • KAB SUKOHARJO</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex bg-slate-200/80 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-300/80 dark:border-slate-800 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === 'chart' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Bagan Hirarki</span>
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === 'directory' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Contact className="w-4 h-4" />
              <span>Direktori Pengurus</span>
            </button>
            <button
              onClick={() => setActiveTab('governance')}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === 'governance' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Garis Komando & Koordinasi</span>
            </button>
          </div>
        </div>

        {/* ------------------- TAB 1: BAGAN HIRARKI (TREE CHART) ------------------- */}
        <AnimatePresence mode="wait">
          {activeTab === 'chart' && (
            <motion.div
              key="chart-tab"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              variants={containerVariants}
              className="max-w-[1080px] mx-auto py-2 space-y-4 sm:space-y-5 text-center"
            >
              {/* Info hint */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl px-3.5 py-2 text-center text-xs font-medium text-emerald-800 dark:text-emerald-300 max-w-md mx-auto flex items-center justify-center gap-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Klik kartu pengurus untuk melihat rincian SK, tupoksi, & biodata lengkap.</span>
              </div>

              {/* TINGKAT 1: Pelindung & Pengawas */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-300/60 dark:border-slate-700/60">
                    Tingkat I • Penasihat & Pengawas Kebijakan
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-3.5 md:gap-8 w-full">
                  
                  {/* Card 1: Pelindung */}
                  <motion.div 
                    variants={itemVariants}
                    onClick={() => handleCardClick(TEAM_MEMBERS[0])}
                    className="w-full max-w-[270px] sm:max-w-[280px] bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900/60 p-3.5 sm:p-4 shadow-xs hover:shadow-lg hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer relative group text-center flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>Penasihat</span>
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                        SK No. 188.4/01
                      </span>
                    </div>

                    <div>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-amber-400 p-0.5 mx-auto overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs group-hover:scale-105 transition-transform">
                        <img 
                          src={TEAM_MEMBERS[0].image} 
                          alt={TEAM_MEMBERS[0].name} 
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="inline-block mt-2 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        {TEAM_MEMBERS[0].title}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 tracking-tight leading-snug">
                        {TEAM_MEMBERS[0].name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {TEAM_MEMBERS[0].subTitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono text-[9px] truncate max-w-[130px]">{TEAM_MEMBERS[0].skNumber}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs flex items-center gap-0.5 shrink-0 group-hover:underline">
                        Detail <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 2: Pengawas */}
                  <motion.div 
                    variants={itemVariants}
                    onClick={() => handleCardClick(TEAM_MEMBERS[1])}
                    className="w-full max-w-[270px] sm:max-w-[280px] bg-white dark:bg-slate-900 rounded-2xl border border-sky-200 dark:border-sky-900/60 p-3.5 sm:p-4 shadow-xs hover:shadow-lg hover:border-sky-400 dark:hover:border-sky-600 transition-all cursor-pointer relative group text-center flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800 flex items-center gap-1">
                        <FileCheck2 className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                        <span>Audit BPD</span>
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                        SK No. 02/BPD
                      </span>
                    </div>

                    <div>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-sky-400 p-0.5 mx-auto overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs group-hover:scale-105 transition-transform">
                        <img 
                          src={TEAM_MEMBERS[1].image} 
                          alt={TEAM_MEMBERS[1].name} 
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="inline-block mt-2 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                        {TEAM_MEMBERS[1].title}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 tracking-tight leading-snug">
                        {TEAM_MEMBERS[1].name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {TEAM_MEMBERS[1].subTitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono text-[9px] truncate max-w-[130px]">{TEAM_MEMBERS[1].skNumber}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs flex items-center gap-0.5 shrink-0 group-hover:underline">
                        Detail <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>

                </div>
              </div>

              {/* CONNECTOR: Tingkat 1 ke Tingkat 2 */}
              <div className="hidden md:flex flex-col items-center pointer-events-none my-0.5">
                <div className="w-[312px] h-3 border-b-2 border-x-2 border-slate-300 dark:border-slate-700 rounded-b-md"></div>
                <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700"></div>
              </div>
              <div className="md:hidden flex flex-col items-center my-1 pointer-events-none">
                <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700"></div>
              </div>

              {/* TINGKAT 2: Direktur Utama */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    Tingkat II • Pimpinan Eksekutif Tertinggi
                  </span>
                </div>

                <div className="flex justify-center w-full">
                  <motion.div 
                    variants={itemVariants}
                    onClick={() => handleCardClick(TEAM_MEMBERS[2])}
                    className="w-full max-w-[330px] sm:max-w-[360px] bg-gradient-to-b from-emerald-900 via-teal-950 to-slate-900 text-white rounded-2xl border-2 border-emerald-400/80 p-4 sm:p-5 shadow-lg shadow-emerald-950/20 hover:scale-[1.02] transition-all cursor-pointer relative group text-center"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase flex items-center gap-1">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        <span>Direksi Utama</span>
                      </span>
                      <span className="text-[9px] font-mono text-emerald-300/70">
                        SK No. 188.4/04
                      </span>
                    </div>

                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-emerald-400 p-0.5 mx-auto overflow-hidden bg-slate-800 shadow-md group-hover:rotate-2 transition-transform">
                      <img 
                        src={TEAM_MEMBERS[2].image} 
                        alt={TEAM_MEMBERS[2].name} 
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <span className="inline-block mt-2.5 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500 text-white shadow-xs">
                      {TEAM_MEMBERS[2].title}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 tracking-tight">
                      {TEAM_MEMBERS[2].name}
                    </h3>
                    <p className="text-[11px] text-emerald-200/90 font-medium">
                      {TEAM_MEMBERS[2].education}
                    </p>

                    <div className="mt-2.5 p-2 bg-emerald-950/70 rounded-xl border border-emerald-800/60 text-[11px] text-emerald-100 italic leading-snug line-clamp-2">
                      {TEAM_MEMBERS[2].motto}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-emerald-800/80 flex items-center justify-between text-xs">
                      <span className="text-emerald-300/80 font-mono text-[9px] truncate max-w-[150px]">{TEAM_MEMBERS[2].skNumber}</span>
                      <span className="text-emerald-300 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-xs">
                        Detail Tugas <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* CONNECTOR: Tingkat 2 ke Tingkat 3 */}
              <div className="hidden md:flex flex-col items-center pointer-events-none my-0.5">
                <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700"></div>
                <div className="w-[312px] h-3 border-t-2 border-x-2 border-slate-300 dark:border-slate-700 rounded-t-md"></div>
              </div>
              <div className="md:hidden flex flex-col items-center my-1 pointer-events-none">
                <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700"></div>
              </div>

              {/* TINGKAT 3: Sekretaris & Bendahara */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-300/60 dark:border-slate-700/60">
                    Tingkat III • Manajemen Operasional Inti
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-3.5 md:gap-8 w-full">
                  
                  {/* Sekretaris */}
                  <motion.div 
                    variants={itemVariants}
                    onClick={() => handleCardClick(TEAM_MEMBERS[3])}
                    className="w-full max-w-[270px] sm:max-w-[280px] bg-white dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-purple-900/60 p-3.5 sm:p-4 shadow-xs hover:shadow-lg hover:border-purple-400 transition-all cursor-pointer relative group text-center flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                        Administrasi
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                        SK No. 188.4/05
                      </span>
                    </div>

                    <div>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-purple-400 p-0.5 mx-auto overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs group-hover:scale-105 transition-transform">
                        <img 
                          src={TEAM_MEMBERS[3].image} 
                          alt={TEAM_MEMBERS[3].name} 
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="inline-block mt-2 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                        {TEAM_MEMBERS[3].title}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 tracking-tight leading-snug">
                        {TEAM_MEMBERS[3].name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {TEAM_MEMBERS[3].subTitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono text-[9px] truncate max-w-[130px]">{TEAM_MEMBERS[3].skNumber}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs flex items-center gap-0.5 shrink-0 group-hover:underline">
                        Detail <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>

                  {/* Bendahara */}
                  <motion.div 
                    variants={itemVariants}
                    onClick={() => handleCardClick(TEAM_MEMBERS[4])}
                    className="w-full max-w-[270px] sm:max-w-[280px] bg-white dark:bg-slate-900 rounded-2xl border border-teal-200 dark:border-teal-900/60 p-3.5 sm:p-4 shadow-xs hover:shadow-lg hover:border-teal-400 transition-all cursor-pointer relative group text-center flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                        Keuangan
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                        SK No. 188.4/06
                      </span>
                    </div>

                    <div>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-teal-400 p-0.5 mx-auto overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs group-hover:scale-105 transition-transform">
                        <img 
                          src={TEAM_MEMBERS[4].image} 
                          alt={TEAM_MEMBERS[4].name} 
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="inline-block mt-2 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                        {TEAM_MEMBERS[4].title}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 tracking-tight leading-snug">
                        {TEAM_MEMBERS[4].name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {TEAM_MEMBERS[4].subTitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono text-[9px] truncate max-w-[130px]">{TEAM_MEMBERS[4].skNumber}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs flex items-center gap-0.5 shrink-0 group-hover:underline">
                        Detail <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>

                </div>
              </div>

              {/* CONNECTOR: Tingkat 3 ke Tingkat 4 */}
              <div className="hidden md:flex flex-col items-center pointer-events-none my-0.5">
                <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700"></div>
                <div className="w-[312px] h-3 border-t-2 border-x-2 border-slate-300 dark:border-slate-700 rounded-t-md"></div>
              </div>
              <div className="md:hidden flex flex-col items-center my-1 pointer-events-none">
                <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700"></div>
              </div>

              {/* TINGKAT 4: Kepala Unit Usaha Komersial */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-300/60 dark:border-slate-700/60">
                    Tingkat IV • Kepala Unit Usaha Komersial
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-3.5 md:gap-8 w-full">
                  
                  {/* Unit Usaha Sampah */}
                  <motion.div 
                    variants={itemVariants}
                    onClick={() => handleCardClick(TEAM_MEMBERS[5])}
                    className="w-full max-w-[270px] sm:max-w-[280px] bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 p-3.5 sm:p-4 shadow-xs hover:shadow-lg hover:border-indigo-400 transition-all cursor-pointer relative group text-center flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                        Armada Sampah
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                        SK No. 08/BUMDES
                      </span>
                    </div>

                    <div>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-indigo-400 p-0.5 mx-auto overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs group-hover:scale-105 transition-transform">
                        <img 
                          src={TEAM_MEMBERS[5].image} 
                          alt={TEAM_MEMBERS[5].name} 
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="inline-block mt-2 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                        {TEAM_MEMBERS[5].title}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 tracking-tight leading-snug">
                        {TEAM_MEMBERS[5].name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {TEAM_MEMBERS[5].subTitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono text-[9px] truncate max-w-[130px]">{TEAM_MEMBERS[5].skNumber}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs flex items-center gap-0.5 shrink-0 group-hover:underline">
                        Detail <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>

                  {/* Unit Usaha Gedung */}
                  <motion.div 
                    variants={itemVariants}
                    onClick={() => handleCardClick(TEAM_MEMBERS[6])}
                    className="w-full max-w-[270px] sm:max-w-[280px] bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/60 p-3.5 sm:p-4 shadow-xs hover:shadow-lg hover:border-rose-400 transition-all cursor-pointer relative group text-center flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                        Gedung & GOR
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                        SK No. 09/BUMDES
                      </span>
                    </div>

                    <div>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-rose-400 p-0.5 mx-auto overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs group-hover:scale-105 transition-transform">
                        <img 
                          src={TEAM_MEMBERS[6].image} 
                          alt={TEAM_MEMBERS[6].name} 
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="inline-block mt-2 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        {TEAM_MEMBERS[6].title}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 tracking-tight leading-snug">
                        {TEAM_MEMBERS[6].name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {TEAM_MEMBERS[6].subTitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono text-[9px] truncate max-w-[130px]">{TEAM_MEMBERS[6].skNumber}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs flex items-center gap-0.5 shrink-0 group-hover:underline">
                        Detail <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>

                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------- TAB 2: DIREKTORI PENGURUS & CARDS ------------------- */}
          {activeTab === 'directory' && (
            <motion.div
              key="directory-tab"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              variants={containerVariants}
              className="space-y-6"
            >
              {/* Search & Filter controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                
                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari nama atau jabatan..."
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

                {/* Role Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {['Semua', 'Pelindung', 'Pengawas', 'Direksi', 'Manajemen Inti', 'Unit Usaha'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedRoleFilter === role
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    variants={itemVariants}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={() => handleCardClick(member)}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:shadow-xl hover:border-emerald-500/50 transition-all cursor-pointer"
                  >
                    <div>
                      <div className="flex gap-4 items-start mb-4">
                        <div className="w-16 h-16 rounded-2xl border-2 border-emerald-500/40 p-0.5 overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 shadow-sm group-hover:scale-105 transition-transform">
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-full h-full object-cover rounded-xl"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0 flex-grow">
                          <span className={`inline-block px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md border ${member.badgeColor}`}>
                            {member.role}
                          </span>
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 truncate">{member.name}</h4>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold truncate leading-tight">{member.title}</p>
                        </div>
                      </div>

                      <div className="space-y-3 border-t border-slate-100 dark:border-slate-800/80 pt-3 text-left">
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Pendidikan</span>
                          </p>
                          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">{member.education}</p>
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Tupoksi Utama</span>
                          </p>
                          <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                            {member.responsibilities.slice(0, 2).map((resp, i) => (
                              <li key={i} className="flex items-start gap-1.5 leading-snug">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <p className="text-[10px] text-slate-400 italic truncate max-w-[200px]">{member.motto}</p>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5 shrink-0 group-hover:translate-x-1 transition-transform">
                        Detail <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
                  <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-200">Pengurus tidak ditemukan</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Coba gunakan kata kunci lain atau pilih kategori Semua.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ------------------- TAB 3: GARIS KOMANDO & TATA KELOLA ------------------- */}
          {activeTab === 'governance' && (
            <motion.div
              key="governance-tab"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              variants={containerVariants}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-sm space-y-8 text-left"
            >
              <div className="max-w-2xl">
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  ALUR PERTANGGUNGJAWABAN & SUPERVISI
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
                  Prinsip Tata Kelola BUMDES (Good Corporate Governance)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  BUMDES Waskita Wijaya menerapkan struktur pertanggungjawaban terstruktur secara independen demi menjaga transparansi modal desa dan kepercayaan warga Desa Waru.
                </p>
              </div>

              {/* Workflow Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Step 1 */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-3 relative overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center">
                    1
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Garis Penasihat & Musdes
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Kepala Desa (Pelindung) menyetujui RKAT (Rencana Kerja & Anggaran) tahunan yang telah disepakati melalui Musyawarah Desa (Musdes).
                  </p>
                  <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider pt-2 border-t border-slate-200 dark:border-slate-700">
                    Otoritas Tertinggi Desa
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-3 relative overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-sky-500 text-white font-black text-sm flex items-center justify-center">
                    2
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Garis Pengawasan & Audit
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Dewan Pengawas (BPD) memeriksa pembukuan keuangan, portal Papan Kas digital, serta kepatuhan SOP usaha BUMDES secara berkala setiap bulan.
                  </p>
                  <div className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider pt-2 border-t border-slate-200 dark:border-slate-700">
                    Sistem Pengawas Independen
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-3 relative overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                    3
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Garis Eksekusi Operasional
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Direktur Utama memimpin Sekretaris, Bendahara, dan Kepala Unit Usaha dalam melayani warga, mencatat transaksi, dan mengoptimalkan omzet desa.
                  </p>
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider pt-2 border-t border-slate-200 dark:border-slate-700">
                    Pelayanan & Profitabilitas
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------- MEMBER DETAIL MODAL DIALOG ------------------- */}
        <AnimatePresence>
          {isModalOpen && selectedMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative text-left"
              >
                {/* Modal Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center cursor-pointer transition-colors border border-white/20"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Banner Hero */}
                <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950 text-white p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 text-center sm:text-left">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-emerald-400 p-0.5 overflow-hidden bg-slate-800 shrink-0 shadow-xl">
                      <img 
                        src={selectedMember.image} 
                        alt={selectedMember.name} 
                        className="w-full h-full object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-1.5 flex-grow">
                      <span className={`inline-block px-3 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-emerald-500 text-white`}>
                        {selectedMember.role}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{selectedMember.name}</h3>
                      <p className="text-sm font-bold text-emerald-300">{selectedMember.title}</p>
                      {selectedMember.subTitle && (
                        <p className="text-xs text-slate-300 font-medium">{selectedMember.subTitle}</p>
                      )}
                      <p className="text-[10px] font-mono text-emerald-200/80 pt-1 flex items-center justify-center sm:justify-start gap-1">
                        <FileCheck2 className="w-3 h-3 text-emerald-400" />
                        <span>{selectedMember.skNumber}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
                  
                  {/* Motto Quote */}
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border-l-4 border-emerald-500 rounded-r-2xl text-xs sm:text-sm italic font-medium text-slate-800 dark:text-emerald-200">
                    {selectedMember.motto}
                  </div>

                  {/* Education */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Latar Belakang Pendidikan</span>
                    </h4>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 pl-6">
                      {selectedMember.education}
                    </p>
                  </div>

                  {/* Responsibilities */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Rincian Tugas Pokok & Fungsi (Tupoksi)</span>
                    </h4>
                    <ul className="space-y-2.5 pl-2">
                      {selectedMember.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                          <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
