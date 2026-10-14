import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  ExternalLink,
  Star,
  Award,
  MessageSquare,
  CheckCircle2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Send,
  Handshake,
  X,
  ShieldCheck,
  TrendingUp,
  Clock,
  Phone,
  ArrowRight,
  Share2,
  Check
} from 'lucide-react';
import { PageType } from '../types';

export interface SponsorPartner {
  id: string;
  name: string;
  shortName: string;
  tier: 'Platinum CSR' | 'Official Banking' | 'Offtaker Utama' | 'Riset & Akademisi' | 'Teknologi & IoT' | 'Mitra Lingkungan';
  category: string;
  tagGroup: 'bumn' | 'industri' | 'akademisi' | 'all';
  logo: string;
  sinceYear: string;
  websiteUrl: string;
  contactPerson: string;
  roleTitle: string;
  avatarUrl: string;
  collaborationScope: string;
  impactMetrics: {
    label: string;
    value: string;
    sub: string;
  }[];
  testimonial: string;
  badgeColor: string;
  accentBorder: string;
}

const INITIAL_SPONSORS: SponsorPartner[] = [
  {
    id: 'sponsor-bri',
    name: 'PT Bank Rakyat Indonesia (Persero) Tbk',
    shortName: 'Bank BRI',
    tier: 'Official Banking',
    category: 'Perbankan & Digitalisasi Transaksi',
    tagGroup: 'bumn',
    logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=400&q=80',
    sinceYear: '2023',
    websiteUrl: 'https://bri.co.id',
    contactPerson: 'Bambang Kusuma, S.E.',
    roleTitle: 'Pimpinan Cabang Pembantu Sukoharjo',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    collaborationScope: 'Fasilitasi rekening digital nasabah unit layanan sampah desa, penyediaan EDC & QRIS kas warga terintegrasi, serta hibah program CSR bibit penghijauan dan ketahanan pangan.',
    impactMetrics: [
      { label: 'Nasabah QRIS', value: '380+ Warga', sub: 'Terdaftar Aktif' },
      { label: 'Bantuan CSR', value: 'Rp 45.000.000', sub: 'Bibit & Mesin Cacah' },
      { label: 'Cashback Kas', value: '100% Otomatis', sub: 'Masuk Kas RT' },
    ],
    testimonial: 'BUMDES Waskita Wijaya Desa Waru membuktikan bahwa digitalisasi keuangan mikro desa mampu berjalan transparan, akuntabel, dan berdampak nyata bagi kemandirian warga.',
    badgeColor: 'bg-blue-600 text-white',
    accentBorder: 'border-blue-500',
  },
  {
    id: 'sponsor-waste-corp',
    name: 'PT Daur Lestari Nusantara & Mitra Plastik',
    shortName: 'Daur Lestari Nusantara',
    tier: 'Offtaker Utama',
    category: 'Industri Sirkular & Daur Ulang',
    tagGroup: 'industri',
    logo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80',
    sinceYear: '2024',
    websiteUrl: 'https://daurlestari.co.id',
    contactPerson: 'Ir. Hendra Gunawan',
    roleTitle: 'Direktur Kemitraan Sirkular',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    collaborationScope: 'Penyerapan rutin hasil pilahan botol plastik PET, kardus tebal, dan kaleng logam dengan harga beli kontrak stabil serta pendampingan standarisasi baling daur ulang industri.',
    impactMetrics: [
      { label: 'Serapan Sampah', value: '12.4 Ton/Bln', sub: 'Terserap Pabrik' },
      { label: 'Harga Kontrak', value: 'Fixed Price', sub: 'Melindungi Petugas' },
      { label: 'Sirkular Ekonomi', value: '94% Terolah', sub: 'Nol Terbuang' },
    ],
    testimonial: 'Kualitas hasil pemilahan anorganik dari warga Desa Waru sangat bersih dan terorganisir rapi. Manajemen BUMDES memudahkan kami mengamankan suplai bahan baku ramah lingkungan.',
    badgeColor: 'bg-emerald-600 text-white',
    accentBorder: 'border-emerald-500',
  },
  {
    id: 'sponsor-pln-csr',
    name: 'PT PLN (Persero) UID Jawa Tengah & D.I. Yogyakarta',
    shortName: 'PLN UID Jateng & DIY',
    tier: 'Platinum CSR',
    category: 'Energi Hijau & Program TJSL BUMN',
    tagGroup: 'bumn',
    logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=400&q=80',
    sinceYear: '2023',
    websiteUrl: 'https://web.pln.co.id',
    contactPerson: 'Sri Wahyuni, M.T.',
    roleTitle: 'Senior Manager TJSL & CSR Wilayah',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    collaborationScope: 'Hibah 1 unit motor listrik roda tiga pengangkut sampah lingkungan, instalasi panel solar cell untuk penerangan hanggar pemilahan, dan pembinaan keselamatan kerja K3.',
    impactMetrics: [
      { label: 'Armada Bersih', value: '1 Unit Listrik', sub: 'Bebas Emisi Gas' },
      { label: 'Solar Energy', value: '3.200 Watt', sub: 'Penerangan Hanggar' },
      { label: 'Efisiensi BBM', value: 'Hemat 40%', sub: 'Operasional Rutin' },
    ],
    testimonial: 'Inovasi BUMDES Waskita Wijaya dalam mengawinkan kebersihan lingkungan dengan energi ramah lingkungan adalah teladan implementasi ESG di tingkat pedesaan.',
    badgeColor: 'bg-amber-600 text-white',
    accentBorder: 'border-amber-500',
  },
  {
    id: 'sponsor-uns',
    name: 'Universitas Sebelas Maret (UNS) Surakarta',
    shortName: 'LPPM Universitas Sebelas Maret',
    tier: 'Riset & Akademisi',
    category: 'Edukasi, Inovasi & Inkubasi Bisnis Desa',
    tagGroup: 'akademisi',
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80',
    sinceYear: '2024',
    websiteUrl: 'https://uns.ac.id',
    contactPerson: 'Dr. Agus Purnomo, M.Si.',
    roleTitle: 'Koordinator Riset Pengabdian Masyarakat',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    collaborationScope: 'Pendampingan digital marketing untuk 42 pelaku UMKM Desa Waru, pelatihan sertifikasi halal, pendampingan izin edar P-IRT, serta formulasi riset pupuk organik kompos.',
    impactMetrics: [
      { label: 'UMKM Binaan', value: '42 Pelaku', sub: 'Naik Kelas Digital' },
      { label: 'Mahasiswa Magang', value: '18 Mahasiswa', sub: 'Program KKN Tematik' },
      { label: 'Legalitas Terbit', value: '15 Produk', sub: 'Sertifikat P-IRT' },
    ],
    testimonial: 'Kerjasama dengan BUMDES Waskita Wijaya sangat dinamis dan aplikatif. Mahasiswa dan dosen riset kami memperoleh laboratorium sosial nyata yang langsung memberdayakan masyarakat.',
    badgeColor: 'bg-indigo-600 text-white',
    accentBorder: 'border-indigo-500',
  },
  {
    id: 'sponsor-telkom',
    name: 'PT Telkom Indonesia (Persero) Tbk Witel Solo',
    shortName: 'Telkom Indonesia Witel Solo',
    tier: 'Teknologi & IoT',
    category: 'Infrastruktur Serat Optik & Desa Digital',
    tagGroup: 'bumn',
    logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
    sinceYear: '2024',
    websiteUrl: 'https://telkom.co.id',
    contactPerson: 'Rizki Aditya, S.Kom.',
    roleTitle: 'Account Manager Enterprise & Rural',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    collaborationScope: 'Penyediaan jaringan internet serat optik dedicated untuk kantor BUMDES, WiFi publik gratis di aula serbaguna, dan server cloud pendukung portal kas desa.',
    impactMetrics: [
      { label: 'Bandwidth', value: '150 Mbps', sub: 'Akses Stabil 24 Jam' },
      { label: 'Titik WiFi', value: '4 Hotspot', sub: 'Balai & Gedung BUMDES' },
      { label: 'Uptime Cloud', value: '99.9%', sub: 'Papan Kas Realtime' },
    ],
    testimonial: 'Dukungan infrastruktur digital Telkom selaras dengan visi BUMDES Waskita Wijaya menuju desa mandiri berdaya saing tinggi di era modern.',
    badgeColor: 'bg-rose-600 text-white',
    accentBorder: 'border-rose-500',
  },
  {
    id: 'sponsor-pupuk',
    name: 'CV Agro Makmur Sejahtera Sukoharjo',
    shortName: 'Agro Makmur Sejahtera',
    tier: 'Mitra Lingkungan',
    category: 'Pengolahan Kompos & Pupuk Organik',
    tagGroup: 'industri',
    logo: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80',
    sinceYear: '2025',
    websiteUrl: 'https://agromakmur.id',
    contactPerson: 'Supardi Hartono',
    roleTitle: 'Manajer Produksi Pupuk Hayati',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    collaborationScope: 'Kerjasama pengolahan limbah organik rumah tangga dan daun ranting menjadi pupuk kascing serta kompos berkualitas tinggi untuk kelompok tani Desa Waru.',
    impactMetrics: [
      { label: 'Kompos Dihasilkan', value: '4.5 Ton/Bln', sub: 'Disalurkan ke Petani' },
      { label: 'Kelompok Tani', value: '5 Kelompok', sub: 'Penerima Pupuk Murah' },
      { label: 'Kandungan Hara', value: 'Grade A', sub: 'Uji Laboratorium' },
    ],
    testimonial: 'Sinergi pengolahan sampah organik ini menutup rantai siklus hara pertanian lokal. Sampah tidak lagi bau dan menumpuk, melainkan menjadi pupuk penyubur tanaman.',
    badgeColor: 'bg-teal-600 text-white',
    accentBorder: 'border-teal-500',
  }
];

interface Props {
  onNavigate?: (page: PageType) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function SponsorPartnerSection({ onNavigate, onShowToast }: Props) {
  const [sponsors, setSponsors] = useState<SponsorPartner[]>(() => {
    try {
      const saved = localStorage.getItem('bumdes_sponsors_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load local sponsors data', e);
    }
    return INITIAL_SPONSORS;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'bumn' | 'industri' | 'akademisi'>('all');

  // Modals
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Form states
  const [feedbackInput, setFeedbackInput] = useState({
    senderName: '',
    company: '',
    role: '',
    rating: 5,
    message: '',
  });

  const [joinInput, setJoinInput] = useState({
    companyName: '',
    category: 'CSR Perusahaan',
    contactPerson: '',
    phone: '',
    email: '',
    proposedScope: '',
  });

  const intervalTime = 6000;
  const progressStepTime = 100;
  const activeSponsor = sponsors[activeIndex] || sponsors[0];

  // Auto-rotation timer logic
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current + 1) % sponsors.length);
          return 0;
        }
        return prev + (100 / (intervalTime / progressStepTime));
      });
    }, progressStepTime);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, sponsors.length]);

  const handleSelectSponsor = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? sponsors.length - 1 : prev - 1));
    setProgress(0);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % sponsors.length);
    setProgress(0);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Submit Feedback from Sponsor
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInput.senderName || !feedbackInput.message) {
      if (onShowToast) onShowToast('Mohon isi nama dan testimoni feedback Anda.', 'warning');
      return;
    }

    const updatedSponsors = sponsors.map((sp) => {
      if (sp.id === activeSponsor.id) {
        return {
          ...sp,
          testimonial: feedbackInput.message,
          contactPerson: feedbackInput.senderName || sp.contactPerson,
          roleTitle: feedbackInput.role || sp.roleTitle,
        };
      }
      return sp;
    });

    setSponsors(updatedSponsors);
    try {
      localStorage.setItem('bumdes_sponsors_data', JSON.stringify(updatedSponsors));
    } catch (err) {
      console.warn('Failed saving sponsor feedback', err);
    }

    if (onShowToast) {
      onShowToast(`Terima kasih atas apresiasi & feedback dari ${feedbackInput.company || activeSponsor.name}!`, 'success');
    }

    setIsFeedbackModalOpen(false);
    setFeedbackInput({
      senderName: '',
      company: '',
      role: '',
      rating: 5,
      message: '',
    });
  };

  // Submit New Partnership Proposal
  const handleSubmitJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinInput.companyName || !joinInput.phone) {
      if (onShowToast) onShowToast('Mohon lengkapi nama perusahaan dan nomor kontak.', 'warning');
      return;
    }

    const message = encodeURIComponent(
      `Halo Pengelola BUMDES Waskita Wijaya Desa Waru,\n` +
      `Kami dari *${joinInput.companyName}* (${joinInput.category}) berminat mengajukan kemitraan / sponsor BUMDES.\n\n` +
      `👤 PIC: ${joinInput.contactPerson}\n` +
      `📞 Kontak: ${joinInput.phone}\n` +
      `✉️ Email: ${joinInput.email || '-'}\n` +
      `📝 Rencana Kolaborasi: ${joinInput.proposedScope || 'Kerjasama Program Lingkungan & UMKM'}\n\n` +
      `Mohon kirimkan proposal profil dan petunjuk teknis kemitraan. Terima kasih!`
    );

    window.open(`https://wa.me/6282134567890?text=${message}`, '_blank');

    if (onShowToast) {
      onShowToast('Pengajuan kemitraan siap dikirimkan via WhatsApp BUMDES!', 'success');
    }

    setIsJoinModalOpen(false);
    setJoinInput({
      companyName: '',
      category: 'CSR Perusahaan',
      contactPerson: '',
      phone: '',
      email: '',
      proposedScope: '',
    });
  };

  return (
    <section
      id="section-sponsor-partner"
      className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ================= HEADER SECTION ================= */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-3.5 shadow-xs">
            <Handshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Kemitraan & Sponsor Strategis Desa Waru</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Sinergi Mitra & Sponsor BUMDES Waskita Wijaya
          </h2>
          
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            Apresiasi dan penghormatan setinggi-tingginya kepada para institusi BUMN, perbankan, offtaker industri sirkular, dan perguruan tinggi yang berkomitmen mendukung kesejahteraan warga dan kelestarian Desa Waru.
          </p>
        </div>

        {/* ================= 1. TAMPILAN KOLOM MEMANJANG: LOGO SPONSOR BESAR & JELAS ================= */}
        <div
          className="mb-8 space-y-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Top Control Bar & Filter Tabs */}
          <div className="bg-white dark:bg-slate-800/95 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left label & timer indicator */}
            <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-300 w-full md:w-auto justify-between md:justify-start">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-slate-900 dark:text-white">
                  Mitra Aktif: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{activeIndex + 1}</span> / {sponsors.length}
                </span>
              </div>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                Klik logo mana saja untuk melihat data lengkap
              </span>
            </div>

            {/* Right Controls (Prev, Pause/Play, Next, Join) */}
            <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
              <button
                id="btn-partner-prev"
                onClick={handlePrev}
                title="Sponsor Sebelumnya"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center space-x-1 transition-all cursor-pointer font-bold text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>

              <button
                id="btn-partner-toggle-play"
                onClick={handleTogglePlay}
                title={isPlaying ? 'Jeda Rotasi Otomatis' : 'Mulai Rotasi Otomatis'}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer font-bold text-xs ${
                  isPlaying
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isPlaying ? 'Jeda' : 'Putar'}</span>
              </button>

              <button
                id="btn-partner-next"
                onClick={handleNext}
                title="Sponsor Berikutnya"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center space-x-1 transition-all cursor-pointer font-bold text-xs"
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rotator Progress Bar */}
          <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-100 ease-linear rounded-full shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* ELONGATED LOGOS ROW (Horizontal Grid with Large Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {sponsors.map((sp, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={sp.id}
                  id={`btn-select-sponsor-${sp.id}`}
                  onClick={() => handleSelectSponsor(idx)}
                  className={`group relative w-full p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-between cursor-pointer overflow-hidden ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 border-emerald-500 ring-4 ring-emerald-500/20 shadow-xl shadow-emerald-950/10 scale-[1.03] z-10'
                      : 'bg-white/90 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md'
                  }`}
                  style={{ minHeight: '160px' }}
                >
                  {/* Top status indicator when active */}
                  {isActive && (
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                  )}

                  {/* Large Crisp Logo Image Container */}
                  <div className="w-full h-24 rounded-xl bg-white dark:bg-slate-900 p-2.5 flex items-center justify-center border border-slate-200/90 dark:border-slate-700/80 overflow-hidden relative shadow-xs">
                    <img
                      src={sp.logo}
                      alt={sp.name}
                      className={`w-full h-full object-contain transition-transform duration-300 ${
                        isActive ? 'scale-110' : 'group-hover:scale-105 opacity-85 group-hover:opacity-100'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    {isActive && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Brand Short Name & Tier Badge */}
                  <div className="w-full mt-3 space-y-1">
                    <p className={`text-xs font-black truncate leading-tight ${
                      isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {sp.shortName}
                    </p>
                    <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${sp.badgeColor}`}>
                      {sp.tier}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= 2. TAMPILAN MEMANJANG: DESKRIPSI SPONSOR DETAIL & PRESTISIUS ================= */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSponsor.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full bg-white dark:bg-slate-800/95 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden relative"
            >
              {/* Wide Header Ribbon Accent */}
              <div className="h-3.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 w-full" />

              {/* Showcase Container */}
              <div className="p-6 sm:p-8 lg:p-10 space-y-8">

                {/* ================= 1. TAMPILAN LOGO BESAR & IDENTITAS RESMI ================= */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 pb-8 border-b border-slate-200/80 dark:border-slate-700/80">
                  
                  {/* LOGO BESAR (High-Impact Crisp Showcase) */}
                  <div className="relative group shrink-0">
                    <div className="w-72 sm:w-80 md:w-96 h-44 sm:h-52 md:h-56 rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-6 border-2 border-emerald-500/40 shadow-xl shadow-slate-900/5 dark:shadow-black/50 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-emerald-500 group-hover:shadow-emerald-500/10">
                      <img
                        src={activeSponsor.logo}
                        alt={activeSponsor.name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Tier badge floating underneath logo */}
                    <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg border border-white/20 ${activeSponsor.badgeColor}`}>
                        <ShieldCheck className="w-4 h-4 mr-0.5" />
                        <span>{activeSponsor.tier}</span>
                      </span>
                    </div>
                  </div>

                  {/* IDENTITAS, NAMA LENGKAP & LEGALITAS */}
                  <div className="flex-1 text-center lg:text-left space-y-4 pt-1">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-3.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        Mitra Resmi BUMDES • Sejak {activeSponsor.sinceYear}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/80 px-3.5 py-1 rounded-full">
                        Sektor: {activeSponsor.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                        {activeSponsor.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Kerjasama strategis resmi terikat MoU (Memorandum of Understanding) & Surat Keputusan Desa Waru untuk percepatan ekonomi warga dan kelestarian lingkungan.
                      </p>
                    </div>

                    {/* Quick action buttons next to identity */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                      <a
                        href={activeSponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-5 bg-slate-100 dark:bg-slate-700/90 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
                      >
                        <span>Kunjungi Website Resmi</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => {
                          setFeedbackInput((prev) => ({
                            ...prev,
                            company: activeSponsor.name,
                            senderName: activeSponsor.contactPerson,
                          }));
                          setIsFeedbackModalOpen(true);
                        }}
                        className="py-2.5 px-5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-700 transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Beri Feedback / Ulasan Mitra</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* ================= 2. DESKRIPSI SPONSOR TEPAT DI BAWAH LOGO ================= */}
                <div className="space-y-3.5">
                  <div className="flex items-center space-x-2 text-slate-900 dark:text-white">
                    <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="text-sm sm:text-base font-black uppercase tracking-wider">
                      Deskripsi Bentuk Dukungan & Sinergi Program Nyata
                    </h4>
                  </div>

                  {/* Elongated full-width description container */}
                  <div className="bg-slate-50 dark:bg-slate-900/70 p-5 sm:p-6 lg:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs">
                    <p className="text-sm sm:text-base md:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                      {activeSponsor.collaborationScope}
                    </p>
                  </div>
                </div>

                {/* ================= 3. DAMPAK NYATA KEMITRAAN (METRICS ROW) ================= */}
                <div className="space-y-3.5">
                  <div className="flex items-center space-x-2 text-slate-900 dark:text-white">
                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="text-sm sm:text-base font-black uppercase tracking-wider">
                      Dampak Nyata Kemitraan di Desa Waru
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activeSponsor.impactMetrics.map((met, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1.5 shadow-xs hover:border-emerald-400 transition-colors"
                      >
                        <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
                          {met.label}
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
                          {met.value}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-400 block font-medium">
                          {met.sub}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ================= 4. TESTIMONI MITRA & AJUKAN KEMITRAAN ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
                  
                  {/* Testimonial card (8 cols) */}
                  <div className="lg:col-span-8 relative bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-emerald-500/30 overflow-hidden shadow-lg flex flex-col justify-between space-y-4">
                    <div className="absolute top-2 right-4 text-emerald-500/15 text-8xl font-serif select-none pointer-events-none">
                      “
                    </div>

                    <div className="relative z-10 space-y-3">
                      <div className="flex items-center space-x-1.5 text-amber-400">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="w-4 h-4 fill-current" />
                        ))}
                        <span className="text-xs text-emerald-300 font-extrabold ml-2 uppercase tracking-wider">
                          Apresiasi & Kepuasan Mitra
                        </span>
                      </div>

                      <p className="text-sm sm:text-base text-emerald-50/95 italic leading-relaxed font-normal">
                        "{activeSponsor.testimonial}"
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center space-x-3.5 pt-4 border-t border-emerald-800/60">
                      <img
                        src={activeSponsor.avatarUrl}
                        alt={activeSponsor.contactPerson}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400/80 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-black text-white truncate">
                          {activeSponsor.contactPerson}
                        </p>
                        <p className="text-xs text-emerald-300/90 truncate">
                          {activeSponsor.roleTitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Kemitraan Card (4 cols) */}
                  <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-7 border border-slate-700/80 flex flex-col justify-between text-white space-y-4 shadow-lg">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-black leading-snug">
                        Ingin Menjadi Mitra Strategis Desa Waru?
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Dapatkan eksposur CSR positif, sertifikat penghargaan resmi dari Kepala Desa, dan laporan dampak berkala.
                      </p>
                    </div>

                    <button
                      id="btn-join-sponsor-direct"
                      onClick={() => setIsJoinModalOpen(true)}
                      className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center space-x-2 cursor-pointer group"
                    >
                      <span>Ajukan Kemitraan / CSR Baru</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* ================= 3. BOTTOM CALL-TO-ACTION FOR PROSPECTIVE SPONSORS ================= */}
        <div className="mt-10 bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 border border-emerald-300 dark:border-emerald-700">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Buka Peluang Kerjasama Strategis Bersama BUMDES Desa Waru
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Kami siap menjadi mitra terpercaya untuk penyaluran dana CSR, program riset perguruan tinggi, perbankan mikro, dan kemitraan industri daur ulang.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto shrink-0">
            <button
              id="btn-bottom-join-partner"
              onClick={() => setIsJoinModalOpen(true)}
              className="w-full md:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Handshake className="w-4 h-4" />
              <span>Gabung Menjadi Sponsor</span>
            </button>
          </div>
        </div>

      </div>

      {/* ================= MODAL 1: FORM FEEDBACK & ULASAN SPONSOR ================= */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsFeedbackModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Formulir Feedback & Apresiasi Sponsor
                </h3>
                <p className="text-xs text-slate-500">
                  Untuk: <strong>{activeSponsor.name}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Perwakilan / PIC *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Bambang Kusuma"
                  value={feedbackInput.senderName}
                  onChange={(e) => setFeedbackInput({ ...feedbackInput, senderName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jabatan / Unit Kerja
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pimpinan Cabang / Manajer CSR"
                  value={feedbackInput.role}
                  onChange={(e) => setFeedbackInput({ ...feedbackInput, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rating Kepuasan Kerjasama
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackInput({ ...feedbackInput, rating: star })}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= feedbackInput.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-500 ml-2">
                    {feedbackInput.rating} / 5 Bintang
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pesan Testimoni / Masukan Mitra *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tuliskan apresiasi kerjasama, dampak yang dirasakan, atau saran program pengembangan..."
                  value={feedbackInput.message}
                  onChange={(e) => setFeedbackInput({ ...feedbackInput, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Feedback</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: AJUKAN KEMITRAAN / SPONSOR BARU ================= */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Handshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Ajukan Kemitraan & Sponsor CSR
                </h3>
                <p className="text-xs text-slate-500">
                  BUMDES Waskita Wijaya • Desa Waru
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Perusahaan / Institusi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Sumber Berkah Lestari"
                  value={joinInput.companyName}
                  onChange={(e) => setJoinInput({ ...joinInput, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Kemitraan
                  </label>
                  <select
                    value={joinInput.category}
                    onChange={(e) => setJoinInput({ ...joinInput, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CSR Perusahaan">CSR Perusahaan</option>
                    <option value="Perbankan & Fintech">Perbankan & Fintech</option>
                    <option value="Offtaker Daur Ulang">Offtaker Daur Ulang</option>
                    <option value="Akademisi & Riset">Akademisi & Riset</option>
                    <option value="Pemberdayaan UMKM">Pemberdayaan UMKM</option>
                    <option value="Sponsor Turnamen Olahraga">Sponsor Turnamen Olahraga</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama PIC Penghubung *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap PIC"
                    value={joinInput.contactPerson}
                    onChange={(e) => setJoinInput({ ...joinInput, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp PIC *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08xxxxxxxxxx"
                    value={joinInput.phone}
                    onChange={(e) => setJoinInput({ ...joinInput, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Perusahaan
                  </label>
                  <input
                    type="email"
                    placeholder="csr@perusahaan.com"
                    value={joinInput.email}
                    onChange={(e) => setJoinInput({ ...joinInput, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rencana Bentuk Kerjasama / Bantuan
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Pemberian alat pres kardus, dukungan turnamen bulutangkis, beasiswa anak desa..."
                  value={joinInput.proposedScope}
                  onChange={(e) => setJoinInput({ ...joinInput, proposedScope: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Kirim via WhatsApp BUMDES</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
