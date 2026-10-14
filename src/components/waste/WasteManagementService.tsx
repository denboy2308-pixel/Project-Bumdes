import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, 
  Truck, 
  DollarSign, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  MessageSquare, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  ShieldCheck, 
  Users, 
  Download, 
  Printer, 
  TrendingUp, 
  Store, 
  Send, 
  HelpCircle, 
  Star, 
  Phone, 
  Check, 
  Copy, 
  ChevronRight, 
  Plus, 
  Filter, 
  Building2, 
  Search, 
  Sparkles,
  ArrowUpRight,
  Calculator,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  WASTE_PACKAGES, 
  INITIAL_PIC_WILAYAH, 
  INITIAL_DIGITAL_ASSETS, 
  INITIAL_CITIZEN_FEEDBACK, 
  UMKM_PERFORMANCE_METRICS, 
  UMKM_DIRECTORY, 
  CURRENT_MONTHLY_REPORT 
} from './wasteData';
import { 
  WastePackage, 
  PicWilayah, 
  DigitalAsset, 
  CitizenFeedback, 
  UmkmDirectoryItem, 
  MonthlyReportData 
} from './wasteTypes';
import { generateWasteMonthlyReportPdf } from './wastePdfExport';

interface WasteManagementServiceProps {
  onShowToast?: (title: string, message: string, type?: 'success' | 'warning' | 'info') => void;
}

export default function WasteManagementService({ onShowToast }: WasteManagementServiceProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'paket-iuran' | 'aset-digital' | 'laporan-pdf' | 'feedback-warga' | 'kinerja-umkm' | 'whatsapp-notif' | 'jadwal-rute'
  >('paket-iuran');

  // State Management
  const [picList, setPicList] = useState<PicWilayah[]>(INITIAL_PIC_WILAYAH);
  const [assetsList, setAssetsList] = useState<DigitalAsset[]>(INITIAL_DIGITAL_ASSETS);
  const [feedbackList, setFeedbackList] = useState<CitizenFeedback[]>(INITIAL_CITIZEN_FEEDBACK);
  const [umkmList, setUmkmList] = useState<UmkmDirectoryItem[]>(UMKM_DIRECTORY);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReportData>(CURRENT_MONTHLY_REPORT);

  // Cashback Simulator State
  const [simSelectedRw, setSimSelectedRw] = useState<string>('RW 01');
  const [simSelectedRt, setSimSelectedRt] = useState<string>('RT 01');
  const [simKkCount, setSimKkCount] = useState<number>(48);

  // Asset Filter
  const [assetCategoryFilter, setAssetCategoryFilter] = useState<string>('all');
  const [assetSearchQuery, setAssetSearchQuery] = useState<string>('');

  // Citizen Feedback Form State
  const [fbName, setFbName] = useState('');
  const [fbPhone, setFbPhone] = useState('');
  const [fbWilayah, setFbWilayah] = useState('RT 01 / RW 01 (Dukuh Waru Utama)');
  const [fbCategory, setFbCategory] = useState<CitizenFeedback['category']>('sampah_terlewat');
  const [fbDescription, setFbDescription] = useState('');
  const [fbPhotoPreview, setFbPhotoPreview] = useState<string | null>(null);
  const [isSubmittingFb, setIsSubmittingFb] = useState(false);

  // UMKM Register Form State
  const [showUmkmModal, setShowUmkmModal] = useState(false);
  const [newUmkmName, setNewUmkmName] = useState('');
  const [newUmkmOwner, setNewUmkmOwner] = useState('');
  const [newUmkmCategory, setNewUmkmCategory] = useState<UmkmDirectoryItem['category']>('Kuliner / Rumah Makan');
  const [newUmkmPackage, setNewUmkmPackage] = useState('pkg-umkm-mikro');

  // Add Asset Maintenance Modal
  const [showAssetServiceModal, setShowAssetServiceModal] = useState(false);
  const [selectedAssetForService, setSelectedAssetForService] = useState<DigitalAsset | null>(null);
  const [serviceNotes, setServiceNotes] = useState('');

  // Print Preview Modal
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Copy helper
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (onShowToast) {
      onShowToast('Tersalin!', 'Pesan notifikasi berhasil disalin ke clipboard.', 'success');
    }
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Calculations for Simulator
  const simTotalIuran = simKkCount * 25000;
  const simCashbackKasRt = simKkCount * 5000;
  const simOperasionalBumdes = simKkCount * 20000;

  // Total summary calculations
  const totalAssetsValue = useMemo(() => {
    return assetsList.reduce((acc, curr) => acc + curr.estimatedValue, 0);
  }, [assetsList]);

  const activeArmadaCount = useMemo(() => {
    return assetsList.filter(a => a.category.includes('armada') || a.category === 'truk_tpa').length;
  }, [assetsList]);

  const filteredAssets = useMemo(() => {
    return assetsList.filter(asset => {
      const matchesCategory = assetCategoryFilter === 'all' || asset.category === assetCategoryFilter;
      const matchesSearch = asset.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
        asset.operator.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
        (asset.plateNumber && asset.plateNumber.toLowerCase().includes(assetSearchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [assetsList, assetCategoryFilter, assetSearchQuery]);

  // Handle Submit Feedback
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbName.trim() || !fbPhone.trim() || !fbDescription.trim()) {
      if (onShowToast) onShowToast('Data Belum Lengkap', 'Mohon isi nama, nomor WhatsApp, dan uraian aduan Anda.', 'warning');
      return;
    }

    setIsSubmittingFb(true);
    setTimeout(() => {
      const ticketNum = `TIKET-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newFeedback: CitizenFeedback = {
        id: `tkt-${Date.now()}`,
        ticketNo: ticketNum,
        citizenName: fbName,
        citizenPhone: fbPhone,
        wilayahRtRw: fbWilayah,
        category: fbCategory,
        description: fbDescription,
        photoUrl: fbPhotoPreview || undefined,
        submittedAt: 'Baru saja',
        status: 'Menunggu',
        ratingStars: 5,
        officerResponse: 'Aduan telah masuk ke sistem BUMDES dan segera didisposisikan ke kru armada wilayah Anda.'
      };

      setFeedbackList([newFeedback, ...feedbackList]);
      setIsSubmittingFb(false);
      setFbName('');
      setFbPhone('');
      setFbDescription('');
      setFbPhotoPreview(null);

      if (onShowToast) {
        onShowToast('Aduan Terkirim!', `Nomor tiket Anda: ${ticketNum}. Petugas kebersihan telah menerima notifikasi.`, 'success');
      }
    }, 600);
  };

  // Handle Add UMKM
  const handleAddUmkm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUmkmName.trim() || !newUmkmOwner.trim()) {
      if (onShowToast) onShowToast('Form Tidak Lengkap', 'Mohon lengkapi nama tempat usaha dan nama pemilik.', 'warning');
      return;
    }

    const pkg = WASTE_PACKAGES.find(p => p.id === newUmkmPackage);
    const newUmkmItem: UmkmDirectoryItem = {
      id: `umkm-${Date.now()}`,
      businessName: newUmkmName,
      ownerName: newUmkmOwner,
      category: newUmkmCategory,
      packageId: newUmkmPackage,
      packageName: pkg ? pkg.name : 'Paket Pelaku Usaha',
      monthlyFee: pkg ? pkg.price : 50000,
      averageWeeklyVolumeKg: newUmkmPackage === 'pkg-umkm-komersial' ? 180 : 60,
      status: 'Aktif',
      joinedDate: 'September 2026'
    };

    setUmkmList([newUmkmItem, ...umkmList]);
    setShowUmkmModal(false);
    setNewUmkmName('');
    setNewUmkmOwner('');

    if (onShowToast) {
      onShowToast('UMKM Terdaftar!', `${newUmkmItem.businessName} resmi menjadi mitra kebersihan BUMDES Waskita Wijaya.`, 'success');
    }
  };

  // Handle Asset Maintenance Submit
  const handleSaveAssetService = () => {
    if (!selectedAssetForService) return;

    setAssetsList(prev => prev.map(a => {
      if (a.id === selectedAssetForService.id) {
        return {
          ...a,
          condition: 'Sangat Baik',
          lastServiceDate: 'Hari Ini (05 September 2026)',
          notes: `${a.notes} | Catatan Servis Terakhir: ${serviceNotes || 'Servis berkala ganti oli dan inspeksi umum tuntas.'}`
        };
      }
      return a;
    }));

    setShowAssetServiceModal(false);
    setSelectedAssetForService(null);
    setServiceNotes('');

    if (onShowToast) {
      onShowToast('Servis Tercatat', 'Status armada telah diperbarui menjadi kondisi prima.', 'success');
    }
  };

  return (
    <div id="unit-pengelolaan-sampah-portal" className="space-y-8 pb-12">
      
      {/* 1. Header Banner & Identitas Resmi */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 shadow-2xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              BUMDES Waskita Wijaya • Desa Waru
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-slate-200 border border-white/10">
              Operasional Wilayah Sukoharjo
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Unit Usaha "Layanan Pengelolaan Sampah Desa"
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-3xl font-normal">
            Pengangkutan sampah rumah tangga dan pelaku usaha secara rutin sesuai jadwal wilayah, dikelola langsung oleh BUMDES Waskita Wijaya.
          </p>

          {/* Value Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-emerald-300 font-semibold">Iuran Rumah Tangga</p>
              <p className="text-lg sm:text-xl font-extrabold text-white mt-0.5">Rp 25.000<span className="text-xs font-normal text-slate-300">/bln</span></p>
              <p className="text-[10px] text-emerald-400 mt-1 font-medium">Auto-Cashback 5K ke RT</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-emerald-300 font-semibold">Pelaku Usaha (UMKM)</p>
              <p className="text-lg sm:text-xl font-extrabold text-white mt-0.5">Mulai Rp 50.000</p>
              <p className="text-[10px] text-slate-300 mt-1">45+ Mitra Aktif</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-emerald-300 font-semibold">Aset Armada Desa</p>
              <p className="text-lg sm:text-xl font-extrabold text-white mt-0.5">{assetsList.length} Unit</p>
              <p className="text-[10px] text-slate-300 mt-1">Motor R3 & Truk TPA</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-emerald-300 font-semibold">Respons Aduan Warga</p>
              <p className="text-lg sm:text-xl font-extrabold text-white mt-0.5">&lt; 2 Jam</p>
              <p className="text-[10px] text-emerald-400 mt-1">Integrasi WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto scrollbar-none flex items-center gap-2">
        {[
          { id: 'paket-iuran', label: 'Paket & Iuran Warga (Cashback 5K)', icon: DollarSign },
          { id: 'aset-digital', label: 'Manajemen Aset Digital', icon: Truck },
          { id: 'laporan-pdf', label: 'Laporan Bulanan PDF', icon: FileText },
          { id: 'feedback-warga', label: 'Feedback & Aduan Warga', icon: MessageSquare },
          { id: 'kinerja-umkm', label: 'Grafik Kinerja UMKM', icon: TrendingUp },
          { id: 'whatsapp-notif', label: 'Notifikasi WhatsApp', icon: Phone },
          { id: 'jadwal-rute', label: 'Jadwal & Rute Wilayah', icon: Calendar },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* ========================================================================= */}
      {/* TAB 1: PAKET LAYANAN, IURAN & CASHBACK RP 5.000 KE KAS RT/PIC */}
      {/* ========================================================================= */}
      {activeTab === 'paket-iuran' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Highlight Box: Skema Cashback Rp 5.000 */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-900/30 p-6 sm:p-8 rounded-3xl border border-emerald-200 dark:border-emerald-800/60 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full inline-block">
                  Sistem Bagi Hasil Kemakmuran Wilayah
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Iuran Rp 25.000 / Bulan = Rp 5.000 Otomatis Masuk ke Kas RT / PIC Warga
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  Setiap iuran warga yang dibayarkan tidak hanya membiayai pengangkutan sampah ke TPA, tetapi langsung memberikan insentif nyata untuk kas lingkungan RT/RW Anda.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-200 dark:border-slate-800 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xl">
                  5K
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Porsi Kas RT</p>
                  <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">Rp 5.000 / KK / Bln</p>
                  <p className="text-[10px] text-slate-400">Transparan via PIC Lingkungan</p>
                </div>
              </div>
            </div>

            {/* Visual Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-emerald-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Porsi 1: Operasional BUMDES</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">Rp 20.000 (80%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Digunakan untuk biaya bahan bakar armada motor roda tiga & truk, servis berkala, pengadaan APD petugas, gaji kru kebersihan, dan biaya pembuangan akhir TPA Mojorejo Sukoharjo.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-emerald-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Porsi 2: Cashback Kas Warga RT/RW</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">Rp 5.000 (20%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: '20%' }}></div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Masuk langsung ke rekening/dompet kas RT melalui PIC wilayah setiap awal bulan. Dana dapat digunakan untuk perbaikan lampu jalan gang, gotong royong, atau kas sosial warga.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Calculator: Simulasi Kas Lingkungan RT/RW */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  <span>Kalkulator & Simulator Cashback Kas Lingkungan</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Hitung proyeksi dana kas warga yang diterima pengurus RT/RW Anda setiap bulan berdasarkan jumlah KK nasabah terdaftar.
                </p>
              </div>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 font-semibold self-start sm:self-auto">
                Model: 25K/KK (Cashback 5K/KK)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Controls */}
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Pilih Wilayah RW & RT:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={simSelectedRw}
                      onChange={(e) => setSimSelectedRw(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="RW 01">RW 01 (Waru Krajan)</option>
                      <option value="RW 02">RW 02 (Waru Timur)</option>
                      <option value="RW 03">RW 03 (Tegalrejo)</option>
                      <option value="RW 04">RW 04 (Sawahan)</option>
                    </select>

                    <select
                      value={simSelectedRt}
                      onChange={(e) => setSimSelectedRt(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="RT 01">RT 01</option>
                      <option value="RT 02">RT 02</option>
                      <option value="RT 03">RT 03</option>
                      <option value="RT 04">RT 04</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Jumlah Kepala Keluarga (KK) Terdaftar:
                    </label>
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm rounded-lg">
                      {simKkCount} KK
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={120}
                    value={simKkCount}
                    onChange={(e) => setSimKkCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>10 KK (RT Kecil)</span>
                    <span>60 KK (RT Rata-rata)</span>
                    <span>120 KK (RT Padat / Perumahan)</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Catatan PIC RT:</p>
                  <p>Dana cashback ditransfer setiap tanggal 1–3 setiap bulan setelah rekonsiliasi iuran bersama BUMDES.</p>
                </div>
              </div>

              {/* Result Preview Box */}
              <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-3xl text-white shadow-lg space-y-5 border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">Hasil Proyeksi Bulanan</p>
                    <p className="text-base font-extrabold text-white">{simSelectedRt} / {simSelectedRw}</p>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                    {simKkCount} KK Terdaftar
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total Iuran Terkumpul (25.000 x {simKkCount}):</span>
                    <span className="font-bold text-white">Rp {simTotalIuran.toLocaleString('id-ID')}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Operasional Armada BUMDES (20.000 x {simKkCount}):</span>
                    <span className="font-bold text-slate-300">Rp {simOperasionalBumdes.toLocaleString('id-ID')}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Cashback Masuk ke Kas RT:</p>
                      <p className="text-[10px] text-slate-400">Dana segar operasional RT tiap bulan</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                        Rp {simCashbackKasRt.toLocaleString('id-ID')}
                      </p>
                      <p className="text-[10px] text-slate-400">/ bulan (Rp {(simCashbackKasRt * 12).toLocaleString('id-ID')} / tahun)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Penyaluran Cashback ke PIC Wilayah RT/RW */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Daftar PIC Wilayah & Penyaluran Kas Lingkungan Bulan Ini</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Data rekonsiliasi realtime penyerahan cashback Rp 5.000 per nasabah kepada pengurus RT/RW Desa Waru.
                </p>
              </div>

              <span className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl font-bold self-start sm:self-auto border border-emerald-200 dark:border-emerald-800">
                Total Tersalurkan: Rp {picList.reduce((acc, p) => acc + p.accumulatedCashbackThisMonth, 0).toLocaleString('id-ID')}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5 font-bold">Wilayah & Dukuh</th>
                    <th className="p-3.5 font-bold">Nama PIC Wilayah</th>
                    <th className="p-3.5 font-bold">Kontak / Rek Kas RT</th>
                    <th className="p-3.5 font-bold text-center">KK Bayar</th>
                    <th className="p-3.5 font-bold">Cashback Kas RT</th>
                    <th className="p-3.5 font-bold">Status Penyaluran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {picList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {item.rt} / {item.rw}
                        <span className="block text-[11px] font-normal text-slate-500 dark:text-slate-400">{item.dukuh}</span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                        {item.picName}
                      </td>
                      <td className="p-3.5 text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">{item.picPhone}</span>
                        <span className="block text-[10px] text-slate-400">{item.bankKasInfo}</span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                        {item.totalKkAktifBayar} <span className="text-[10px] text-slate-400">/ {item.totalKkTerdaftar} KK</span>
                      </td>
                      <td className="p-3.5 font-black text-emerald-600 dark:text-emerald-400">
                        Rp {item.accumulatedCashbackThisMonth.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1 ${
                          item.statusPenyaluran === 'Sudah Ditransfer'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : item.statusPenyaluran === 'Siap Dicairkan'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          {item.statusPenyaluran}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{item.tanggalPenyaluranTerakhir}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Katalog Lengkap Paket Layanan (Rumah Tangga & Pelaku Usaha UMKM) */}
          <div className="space-y-4">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                Pilihan Paket Berlangganan
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Tarif Transparan Sesuai Kebutuhan Anda
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Layanan pengangkutan terjadwal untuk warga rumah tangga maupun pelaku usaha desa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {WASTE_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 ${
                    pkg.popular 
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl' 
                      : 'border-slate-200 dark:border-slate-800 hover:shadow-lg'
                  }`}
                >
                  <div className="space-y-4">
                    {pkg.popular && (
                      <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full inline-block">
                        Paling Banyak Digunakan
                      </span>
                    )}

                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                        {pkg.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        Rp {pkg.price.toLocaleString('id-ID')}
                        <span className="text-xs font-normal text-slate-400"> / {pkg.period}</span>
                      </p>
                      {pkg.cashbackRt && (
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          ✓ Termasuk Cashback Rp 5.000 ke Kas RT
                        </p>
                      )}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs space-y-1">
                      <span className="font-semibold text-slate-500 dark:text-slate-400 block text-[10px] uppercase tracking-wider">
                        Frekuensi Pengangkutan:
                      </span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {pkg.pickupFrequency}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Fitur & Fasilitas:
                      </p>
                      <ul className="space-y-2">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        const targetWa = '6282134567890';
                        const text = `Halo Admin BUMDES Waskita Wijaya, saya ingin mendaftar ${pkg.name}. Mohon informasi formulir pendaftaran.`;
                        window.open(`https://wa.me/${targetWa}?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        pkg.popular
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span>Daftar Paket Ini</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MANAJEMEN ASET DIGITAL */}
      {/* ========================================================================= */}
      {activeTab === 'aset-digital' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Nilai Aset</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                Rp {totalAssetsValue.toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-slate-400">Inventaris milik BUMDES Desa Waru</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Armada Aktif</span>
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {activeArmadaCount} Unit
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">3 Motor R3 + 1 Truk TPA Siap Jalan</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Kondisi Prima</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {assetsList.filter(a => a.condition === 'Sangat Baik').length} / {assetsList.length}
              </p>
              <p className="text-[11px] text-slate-400">Tersertifikasi layak operasional</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Jadwal Servis Terdekat</span>
                <Wrench className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400">
                08 September 2026
              </p>
              <p className="text-[11px] text-slate-400">Mesin Pencacah Kompos (AST-MSN-02)</p>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Kategori:
              </span>
              {[
                { id: 'all', label: 'Semua Aset' },
                { id: 'armada_roda3', label: 'Motor R3' },
                { id: 'truk_tpa', label: 'Truk Dump TPA' },
                { id: 'kontainer', label: 'Kontainer & Depo' },
                { id: 'mesin', label: 'Mesin Pres & Kompos' },
                { id: 'apd', label: 'APD Petugas' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setAssetCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    assetCategoryFilter === cat.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={assetSearchQuery}
                onChange={(e) => setAssetSearchQuery(e.target.value)}
                placeholder="Cari aset / plat no / driver..."
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
              />
            </div>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map(asset => (
              <div
                key={asset.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md">
                      {asset.code}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      asset.condition === 'Sangat Baik' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {asset.condition}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                      {asset.name}
                    </h4>
                    {asset.plateNumber && (
                      <p className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        Plat: {asset.plateNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Operator:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{asset.operator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tahun Perolehan:</span>
                      <span>{asset.yearAcquired}</span>
                    </div>
                    {asset.fuelConsumptionPerDay && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Konsumsi BBM:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">{asset.fuelConsumptionPerDay}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nilai Buku / Aset:</span>
                      <span className="font-bold text-slate-900 dark:text-white">Rp {asset.estimatedValue.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <p><strong>Servis Terakhir:</strong> {asset.lastServiceDate}</p>
                    <p><strong>Jadwal Servis Berikutnya:</strong> {asset.nextServiceDate}</p>
                    <p className="italic text-[10px] text-slate-400 mt-1">"{asset.notes}"</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedAssetForService(asset);
                      setShowAssetServiceModal(true);
                    }}
                    className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Catat Perawatan / Servis</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LAPORAN BULANAN PDF */}
      {/* ========================================================================= */}
      {activeTab === 'laporan-pdf' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Actions */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Akuntabilitas Keuangan Publik
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Laporan Keuangan & Operasional Bulanan
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Periode: {monthlyReport.month} {monthlyReport.year} • Disahkan oleh Direktur BUMDES dan Kepala Unit Pengelolaan Sampah.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => generateWasteMonthlyReportPdf(monthlyReport, picList)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Laporan PDF Resmi</span>
              </button>

              <button
                onClick={() => setShowPrintModal(true)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Print Preview</span>
              </button>
            </div>
          </div>

          {/* Report Paper Preview in UI */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 max-w-4xl mx-auto">
            
            {/* Kop Surat */}
            <div className="text-center pb-6 border-b-2 border-emerald-600 space-y-1">
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Badan Usaha Milik Desa "Waskita Wijaya"
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-emerald-600 uppercase tracking-wide">
                Unit Usaha Layanan Pengelolaan Sampah
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Kantor: Jl. Raya Waru-Baki No. 12, Desa Waru, Kec. Baki, Kab. Sukoharjo • Hotline: 0821-3456-7890
              </p>
            </div>

            {/* Document Title */}
            <div className="text-center space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white uppercase">
                Rekapitulasi Penerimaan Retribusi & Penyaluran Cashback Kas Warga
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Bulan: {monthlyReport.month} {monthlyReport.year} | Kode: RPT-SAMP-{monthlyReport.year}-{monthlyReport.month.toUpperCase()}
              </p>
            </div>

            {/* Matrix Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b pb-1.5 border-slate-200 dark:border-slate-700">
                  Data Operasional Volume
                </p>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Total Warga Rumah Tangga Terdaftar:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{monthlyReport.totalRumahTangga} KK</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Total Pelaku Usaha (UMKM):</span>
                  <span className="font-bold text-slate-800 dark:text-white">{monthlyReport.totalUmkm} Usaha</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Total Tonase Sampah Terangkut:</span>
                  <span className="font-bold text-emerald-600">{monthlyReport.totalTonase} Ton</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b pb-1.5 border-slate-200 dark:border-slate-700">
                  Penerimaan Keuangan
                </p>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Iuran Rumah Tangga (Rp 25.000):</span>
                  <span className="font-bold text-slate-800 dark:text-white">Rp {monthlyReport.penerimaanIuranRt.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Retribusi Pelaku Usaha (UMKM):</span>
                  <span className="font-bold text-slate-800 dark:text-white">Rp {monthlyReport.penerimaanIuranUmkm.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-dashed pt-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Total Penerimaan Kas:</span>
                  <span className="font-black text-emerald-600">Rp {monthlyReport.totalPenerimaan.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Penyaluran Cashback & Biaya */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 space-y-3 text-xs">
              <p className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                Alokasi Pengeluaran & Pembagian Hasil:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-100 dark:border-slate-800">
                  <span className="text-slate-500 block text-[11px]">1. Cashback Kas RT (5K/KK):</span>
                  <span className="text-base font-extrabold text-emerald-600">
                    Rp {monthlyReport.totalCashbackKasRt.toLocaleString('id-ID')}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Tersalurkan ke kas lingkungan</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-100 dark:border-slate-800">
                  <span className="text-slate-500 block text-[11px]">2. BBM & Servis Armada:</span>
                  <span className="text-base font-extrabold text-slate-800 dark:text-white">
                    Rp {monthlyReport.biayaOperasionalBbmDanServis.toLocaleString('id-ID')}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Bensin R3, solar truk TPA & servis</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-100 dark:border-slate-800">
                  <span className="text-slate-500 block text-[11px]">3. Gaji Petugas Kebersihan:</span>
                  <span className="text-base font-extrabold text-slate-800 dark:text-white">
                    Rp {monthlyReport.gajiPetugasKebersihan.toLocaleString('id-ID')}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Kru driver & pemilah TPS3R</p>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800 flex justify-between items-center text-sm">
                <span className="font-extrabold text-emerald-900 dark:text-emerald-300">
                  Sisa Hasil Usaha (PADes Bersih Desa Waru):
                </span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                  Rp {monthlyReport.padesBersih.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Signature Block */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200">
              <div className="space-y-12">
                <div>
                  <p className="text-slate-500">Mengetahui / Menyusun,</p>
                  <p className="font-bold">Kepala Unit Layanan Pengelolaan Sampah</p>
                </div>
                <div>
                  <p className="font-extrabold text-sm underline">Budi Santoso, S.T.</p>
                  <p className="text-[11px] text-slate-500 font-mono">NIP. BUMDES-2024-008</p>
                </div>
              </div>

              <div className="space-y-12 text-right">
                <div>
                  <p className="text-slate-500">Waru, 31 {monthlyReport.month} {monthlyReport.year}</p>
                  <p className="font-bold">Direktur BUMDES Waskita Wijaya</p>
                </div>
                <div>
                  <p className="font-extrabold text-sm underline">Drs. Joko Susilo, M.Si.</p>
                  <p className="text-[11px] text-slate-500 font-mono">NIP. BUMDES-2022-001</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FEEDBACK & ADUAN WARGA */}
      {/* ========================================================================= */}
      {activeTab === 'feedback-warga' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Formulir Input Aduan & Feedback */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
                  Layanan Cepat Tanggap
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Kirim Feedback & Aduan Kebersihan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Laporkan sampah yang terlewat, tong rusak, atau berikan apresiasi kepada petugas kebersihan wilayah Anda.
                </p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap Warga:
                  </label>
                  <input
                    type="text"
                    required
                    value={fbName}
                    onChange={(e) => setFbName(e.target.value)}
                    placeholder="Contoh: Ibu Ratna Dewi"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      No. WhatsApp Aktif:
                    </label>
                    <input
                      type="tel"
                      required
                      value={fbPhone}
                      onChange={(e) => setFbPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kategori Aduan:
                    </label>
                    <select
                      value={fbCategory}
                      onChange={(e) => setFbCategory(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="sampah_terlewat">Sampah Terlewat Belum Diambil</option>
                      <option value="sampah_liar">Tumpukan Sampah Liar di Jalan</option>
                      <option value="tong_rusak">Tong Sampah Rusak / Pecah</option>
                      <option value="jadwal_terlambat">Jadwal Armada Terlambat</option>
                      <option value="apresiasi">Apresiasi & Pujian Kru</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Wilayah Alamat & RT/RW:
                  </label>
                  <input
                    type="text"
                    required
                    value={fbWilayah}
                    onChange={(e) => setFbWilayah(e.target.value)}
                    placeholder="Contoh: RT 02 / RW 01 (Dukuh Waru Timur No. 14)"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Uraian Masalah / Feedback:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={fbDescription}
                    onChange={(e) => setFbDescription(e.target.value)}
                    placeholder="Tuliskan keterangan detail agar petugas mudah menemukan lokasi..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Upload Foto Bukti */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Lampiran Foto Bukti (Opsional):
                  </label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      id="fb-photo-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFbPhotoPreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label htmlFor="fb-photo-upload" className="cursor-pointer space-y-1 block">
                      <ImageIcon className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Klik untuk unggah foto kondisi sampah
                      </p>
                      <p className="text-[10px] text-slate-400">Mendukung format JPG, PNG (Maks 5MB)</p>
                    </label>
                  </div>

                  {fbPhotoPreview && (
                    <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 w-24 h-24">
                      <img src={fbPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFbPhotoPreview(null)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingFb}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingFb ? 'Mengirim Aduan...' : 'Kirim Tiket Aduan Sekarang'}</span>
                </button>
              </form>
            </div>

            {/* Right: Live Ticket Stream & Ratings */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Status Aduan Lapangan Real-time
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Transparansi penanganan keluhan dan feedback kebersihan warga.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-black text-sm">4.9</span>
                  <span className="text-[10px] text-slate-400">/ 5.0</span>
                </div>
              </div>

              <div className="space-y-3">
                {feedbackList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-md">
                          {item.ticketNo}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                          {item.citizenName}
                        </span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        item.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.status === 'Petugas Meluncur'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 animate-pulse'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      "{item.description}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>{item.wilayahRtRw}</span>
                      <span>{item.submittedAt}</span>
                    </div>

                    {item.officerResponse && (
                      <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-xs space-y-1">
                        <p className="font-bold text-emerald-900 dark:text-emerald-300 text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tanggapan Tim Operasional:</span>
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                          {item.officerResponse}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: GRAFIK KINERJA UMKM & PELAKU USAHA */}
      {/* ========================================================================= */}
      {activeTab === 'kinerja-umkm' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mitra UMKM Terdaftar</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">45 Tempat Usaha</p>
              <p className="text-[11px] text-emerald-600 font-semibold">+6 Tempat Usaha baru bulan ini</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kepatuhan Retribusi</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">98% On-Time</p>
              <p className="text-[11px] text-slate-400">Tertib bayar sebelum tanggal 10</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Limbah Komersial Terkelola</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">4.6 Ton / Bln</p>
              <p className="text-[11px] text-slate-400">Kardus & minyak dipilah terpisah</p>
            </div>
          </div>

          {/* Charts: Tren Volume Sampah & Retribusi UMKM */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>Grafik Pertumbuhan Volume Sampah & Retribusi Pelaku Usaha (UMKM)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Data 6 bulan terakhir menunjukkan peningkatan kesadaran higienitas pelaku usaha Desa Waru.
                </p>
              </div>

              <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300">
                Satuan: Tonase (Ton)
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={UMKM_PERFORMANCE_METRICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" T" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: '#fff', 
                      fontSize: '12px' 
                    }}
                    formatter={(val: any) => [`${val} Ton Sampah`, 'Volume Komersial']}
                  />
                  <Bar dataKey="volumeTon" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Direktori Mitra UMKM Desa Waru */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-emerald-600" />
                  <span>Direktori Mitra Usaha Peduli Kebersihan Desa Waru</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daftar pelaku usaha yang telah berlangganan resmi dan menjaga lingkungan sekitar tempat usaha.
                </p>
              </div>

              <button
                onClick={() => setShowUmkmModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Daftarkan Usaha Baru</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5 font-bold">Nama Tempat Usaha</th>
                    <th className="p-3.5 font-bold">Pemilik / Penanggung Jawab</th>
                    <th className="p-3.5 font-bold">Kategori</th>
                    <th className="p-3.5 font-bold">Paket Retribusi</th>
                    <th className="p-3.5 font-bold text-center">Volume Mingguan</th>
                    <th className="p-3.5 font-bold">Status Mitra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {umkmList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {item.businessName}
                      </td>
                      <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                        {item.ownerName}
                      </td>
                      <td className="p-3.5 text-xs text-slate-600 dark:text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          Rp {item.monthlyFee.toLocaleString('id-ID')}/bln
                        </span>
                        <span className="block text-[10px] text-slate-400">{item.packageName}</span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                        {item.averageWeeklyVolumeKg} Kg
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: NOTIFIKASI WHATSAPP */}
      {/* ========================================================================= */}
      {activeTab === 'whatsapp-notif' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
              Pusat Komunikasi Cepat
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Integrasi Notifikasi Pesan WhatsApp Resmi
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Kirim pengingat jadwal armada, bukti pembayaran iuran bulanan dengan rincian cashback kas RT, serta tagihan retribusi langsung ke nomor WhatsApp warga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Template 1: Pengingat Jadwal Armada H-1 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Template 01: Pengingat Armada H-1
                  </span>
                  <span className="text-[11px] text-slate-400">Otomatis Malam Hari</span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Pengingat Menaruh Tong Sampah di Depan Rumah
                </h4>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200/60 dark:border-slate-700">
                  "Halo Bapak/Ibu Warga Desa Waru (RW 01 / RW 02), armada kebersihan BUMDES Waskita Wijaya akan melintas besok pagi pukul 07.00 WIB. Mohon letakkan wadah sampah Anda di depan pagar rumah malam ini atau sebelum pukul 06.30 WIB. Terima kasih telah menjaga kebersihan lingkungan!"
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleCopy('tpl-1', 'Halo Bapak/Ibu Warga Desa Waru (RW 01 / RW 02), armada kebersihan BUMDES Waskita Wijaya akan melintas besok pagi pukul 07.00 WIB. Mohon letakkan wadah sampah Anda di depan pagar rumah malam ini atau sebelum pukul 06.30 WIB. Terima kasih telah menjaga kebersihan lingkungan!')}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === 'tpl-1' ? 'Tersalin!' : 'Salin Pesan'}</span>
                </button>
                <button
                  onClick={() => {
                    const text = 'Halo Bapak/Ibu Warga Desa Waru (RW 01 / RW 02), armada kebersihan BUMDES Waskita Wijaya akan melintas besok pagi pukul 07.00 WIB. Mohon letakkan wadah sampah Anda di depan pagar rumah malam ini atau sebelum pukul 06.30 WIB. Terima kasih telah menjaga kebersihan lingkungan!';
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Template 2: Kuitansi Iuran Lunas & Cashback Kas RT */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Template 02: Kuitansi Iuran Lunas
                  </span>
                  <span className="text-[11px] text-slate-400">Disertai Cashback 5K</span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Bukti Pembayaran Iuran & Alokasi Kas RT
                </h4>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200/60 dark:border-slate-700">
                  "KUITANSI DIGITAL BUMDES WASKITA WIJAYA: Terima kasih! Iuran sampah periode September 2026 sebesar Rp 25.000 telah LUNAS. Porsi Rp 5.000 otomatis diteruskan ke Kas RT setempat melalui PIC wilayah untuk kemakmuran lingkungan. Bersama kita wujudkan Desa Waru asri dan mandiri!"
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleCopy('tpl-2', 'KUITANSI DIGITAL BUMDES WASKITA WIJAYA: Terima kasih! Iuran sampah periode September 2026 sebesar Rp 25.000 telah LUNAS. Porsi Rp 5.000 otomatis diteruskan ke Kas RT setempat melalui PIC wilayah untuk kemakmuran lingkungan. Bersama kita wujudkan Desa Waru asri dan mandiri!')}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === 'tpl-2' ? 'Tersalin!' : 'Salin Pesan'}</span>
                </button>
                <button
                  onClick={() => {
                    const text = 'KUITANSI DIGITAL BUMDES WASKITA WIJAYA: Terima kasih! Iuran sampah periode September 2026 sebesar Rp 25.000 telah LUNAS. Porsi Rp 5.000 otomatis diteruskan ke Kas RT setempat melalui PIC wilayah untuk kemakmuran lingkungan. Bersama kita wujudkan Desa Waru asri dan mandiri!';
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim via WhatsApp</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: JADWAL & RUTE WILAYAH */}
      {/* ========================================================================= */}
      {activeTab === 'jadwal-rute' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
              Cakupan Wilayah Desa Waru
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Jadwal Operasional Armada Pengangkutan Rutin
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Seluruh wilayah RT/RW di Desa Waru dilayani secara terjadwal oleh armada kebersihan BUMDES Waskita Wijaya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">ZONA 1 (RW 01 & RW 02)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Aktif</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Dukuh:</strong> Waru Utama, Waru Krajan & Waru Timur</p>
              <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Hari Operasional:</strong> Senin, Rabu, Sabtu</p>
              <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Jam:</strong> 06.30 - 10.30 WIB</p>
              <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Armada:</strong> Motor R3 Viar (AD 8291 SK) - Pak Joko</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">ZONA 2 (RW 03 & RW 04)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Aktif</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Dukuh:</strong> Tegalrejo & Kragilan</p>
              <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Hari Operasional:</strong> Selasa, Kamis, Minggu</p>
              <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Jam:</strong> 06.30 - 10.30 WIB</p>
              <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Armada:</strong> Motor R3 Tossa (AD 9012 FK) - Pak Slamet</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">ZONA NIAGA & RUKO</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Harian</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Cakupan:</strong> Toko, Warung, Kafe & Pusat Kuliner</p>
              <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Hari Operasional:</strong> Setiap Hari (Senin - Minggu)</p>
              <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Jam:</strong> 06.00 - 08.00 WIB (Sebelum Buka Toko)</p>
              <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Armada:</strong> Viar Niaga (AD 7721 SK) - Pak Wahyu</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Daftarkan Pelaku Usaha Baru */}
      <AnimatePresence>
        {showUmkmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Daftarkan Tempat Usaha / UMKM
                </h4>
                <button
                  onClick={() => setShowUmkmModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddUmkm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Usaha / Toko:</label>
                  <input
                    type="text"
                    required
                    value={newUmkmName}
                    onChange={(e) => setNewUmkmName(e.target.value)}
                    placeholder="Contoh: Kafe Kopi Seduh Waru"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Pemilik:</label>
                  <input
                    type="text"
                    required
                    value={newUmkmOwner}
                    onChange={(e) => setNewUmkmOwner(e.target.value)}
                    placeholder="Contoh: Mas Bagus"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori Usaha:</label>
                  <select
                    value={newUmkmCategory}
                    onChange={(e) => setNewUmkmCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="Kuliner / Rumah Makan">Kuliner / Rumah Makan</option>
                    <option value="Kafe / Kedai">Kafe / Kedai Kopi</option>
                    <option value="Toko Kelontong / Swalayan">Toko Kelontong / Swalayan</option>
                    <option value="Bengkel / Usaha Jasa">Bengkel / Usaha Jasa</option>
                    <option value="Pusat Ruko">Pusat Ruko</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Paket:</label>
                  <select
                    value={newUmkmPackage}
                    onChange={(e) => setNewUmkmPackage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="pkg-umkm-mikro">Paket Pelaku Usaha Mikro (Rp 50.000 / bln - 4x seminggu)</option>
                    <option value="pkg-umkm-komersial">Paket Komersial Menengah (Rp 100.000 / bln - Setiap Hari)</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUmkmModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Simpan Data Mitra
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Catat Perawatan Aset */}
      <AnimatePresence>
        {showAssetServiceModal && selectedAssetForService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Catat Servis Berkala Aset
                  </h4>
                  <p className="text-xs text-slate-500">{selectedAssetForService.name}</p>
                </div>
                <button
                  onClick={() => setShowAssetServiceModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Uraian Pekerjaan / Komponen yang Diservis:
                  </label>
                  <textarea
                    rows={3}
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                    placeholder="Contoh: Ganti oli mesin Shell Advance, cek kampas rem depan, pengencangan rantai roda."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAssetServiceModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAssetService}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Simpan Log Servis
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Print Preview */}
      <AnimatePresence>
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Pratinjau Cetak Laporan Resmi BUMDES
                </h4>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="border p-6 rounded-2xl bg-white text-slate-900 space-y-4 text-xs font-sans">
                <div className="text-center pb-3 border-b-2 border-slate-800 space-y-1">
                  <p className="font-black text-base">BUMDES WASKITA WIJAYA DESA WARU</p>
                  <p className="font-bold text-emerald-700">UNIT USAHA LAYANAN PENGELOLAAN SAMPAH</p>
                  <p className="text-[10px] text-slate-600">Laporan Keuangan Periode: {monthlyReport.month} {monthlyReport.year}</p>
                </div>

                <div className="space-y-1">
                  <p><strong>Total Rumah Tangga Terlayani:</strong> {monthlyReport.totalRumahTangga} KK</p>
                  <p><strong>Total Pelaku Usaha (UMKM):</strong> {monthlyReport.totalUmkm} Usaha</p>
                  <p><strong>Total Penerimaan Iuran:</strong> Rp {monthlyReport.totalPenerimaan.toLocaleString('id-ID')}</p>
                  <p><strong>Total Cashback Disalurkan ke Kas RT (Rp 5.000/KK):</strong> Rp {monthlyReport.totalCashbackKasRt.toLocaleString('id-ID')}</p>
                  <p><strong>Biaya Armada, BBM & Servis:</strong> Rp {monthlyReport.biayaOperasionalBbmDanServis.toLocaleString('id-ID')}</p>
                  <p><strong>Gaji Tim Kebersihan:</strong> Rp {monthlyReport.gajiPetugasKebersihan.toLocaleString('id-ID')}</p>
                  <p className="pt-2 border-t font-bold text-sm text-emerald-800">PADes Bersih Desa: Rp {monthlyReport.padesBersih.toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Sekarang (Print)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
