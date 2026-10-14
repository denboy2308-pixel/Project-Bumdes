import React, { useState, useEffect, Suspense, lazy } from 'react';
const LiveCourtReservation = lazy(() => import('./LiveCourtReservation'));
const TrashPickupSchedule = lazy(() => import('./TrashPickupSchedule'));
const WasteManagementService = lazy(() => import('./waste/WasteManagementService'));
const VillageJobBoard = lazy(() => import('./VillageJobBoard'));
const EventEquipmentRental = lazy(() => import('./EventEquipmentRental'));
const VolunteerYouthPortal = lazy(() => import('./VolunteerYouthPortal'));
const MusdesEVoting = lazy(() => import('./MusdesEVoting'));
const PosyanduHealthSchedule = lazy(() => import('./PosyanduHealthSchedule'));
const CulinaryTourismPortal = lazy(() => import('./CulinaryTourismPortal'));
const EventHallCostSimulator = lazy(() => import('./EventHallCostSimulator'));
const VillageMarketplace = lazy(() => import('./VillageMarketplace'));
const AiControlDirectiveStudio = lazy(() => import('./AiControlDirectiveStudio'));
import { 
  Sparkles, 
  CheckCircle2, 
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
  Award, 
  Languages, 
  QrCode, 
  Wind, 
  Briefcase, 
  BarChart3, 
  Truck, 
  Volume2, 
  UserCheck, 
  Sun, 
  FileText, 
  CreditCard, 
  MapPin, 
  GraduationCap, 
  Bot, 
  Leaf, 
  Coins, 
  Radio, 
  Video, 
  HeartHandshake, 
  Gift, 
  ShieldAlert, 
  Users, 
  Vote, 
  Utensils, 
  Calculator, 
  Tv, 
  ShieldCheck, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Send, 
  Plus, 
  Minus, 
  Check, 
  Search, 
  SlidersHorizontal,
  ExternalLink,
  Copy,
  Printer,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface ActiveModulesSuiteProps {
  onShowToast?: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function ActiveModulesSuite({ onShowToast }: ActiveModulesSuiteProps) {
  // Active Module Selection State (All 32 initial modules selected)
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bumdes_activated_features');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) return parsed;
      }
    } catch {
      // fallback
    }
    // Default 32 selected modules
    return Array.from({ length: 32 }, (_, i) => `feat-${i + 1}`);
  });

  const [activeModuleTab, setActiveModuleTab] = useState<string>('feat-1');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Save selected modules
  useEffect(() => {
    localStorage.setItem('bumdes_activated_features', JSON.stringify(selectedModuleIds));
  }, [selectedModuleIds]);

  // Interactive State for Module 1: GOR Reservation
  const [gorDate, setGorDate] = useState('2026-07-22');
  const [gorSlot, setGorSlot] = useState('18:00 - 20:00 WIB');
  const [gorCourt, setGorCourt] = useState('Lapangan 1 (Vinyl Top)');

  // Interactive State for Module 2: Zakat Calculator
  const [hartaNominal, setHartaNominal] = useState<number>(100000000);
  const zakatMaal = hartaNominal >= 85000000 ? Math.round(hartaNominal * 0.025) : 0;

  // Interactive State for Module 3: Digital Scoreboard
  const [scoreA, setScoreA] = useState<number>(18);
  const [scoreB, setScoreB] = useState<number>(16);
  const [setA, setSetA] = useState<number>(1);
  const [setB, setSetB] = useState<number>(0);

  // Interactive State for Module 6: WhatsApp Reminders
  const [waPhone, setWaPhone] = useState('082134567890');
  const [waMessage, setWaMessage] = useState('Halo Bp/Ibu Nasabah, pengingat penimbangan Bank Sampah BUMDESA Waru esok hari pukul 08:00 WIB.');

  // Interactive State for Module 7: SHU Calculator
  const [trashKgPerYear, setTrashKgPerYear] = useState<number>(350);
  const estimatedShu = Math.round(trashKgPerYear * 420);

  // Interactive State for Module 8: Voucher Generator
  const [voucherCode, setVoucherCode] = useState<string>('WARUWASKITA30');
  const [voucherCopied, setVoucherCopied] = useState<boolean>(false);

  // Interactive State for Module 9: Aspirasi Warga
  const [complaintText, setComplaintText] = useState('');
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  // Interactive State for Module 11: E-Sertifikat
  const [nasabahName, setNasabahName] = useState('Sri Rahayu (RT 02)');

  // Interactive State for Module 12: Javanese Language Mode
  const [isJavanese, setIsJavanese] = useState(false);

  // Interactive State for Module 13: QRIS Generator
  const [qrisAmount, setQrisAmount] = useState<number>(50000);

  // Interactive State for Module 18: TTS
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Interactive State for Module 19: GPS Clock In
  const [clockedIn, setClockedIn] = useState(false);

  // Interactive State for Module 22: POS Kasir
  const [posCart, setPosCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([
    { id: 'p1', name: 'Sewa Lapangan Badminton (1 Jam)', price: 35000, qty: 2 },
    { id: 'p2', name: 'Air Mineral Botol 600ml', price: 4000, qty: 3 }
  ]);

  // Interactive State for Module 25: AI Chatbot
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Sugeng rawuh! Ada yang bisa saya bantu terkait jadwal sewa GOR, saldo bank sampah, atau layanan BUMDESA Waskita?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Interactive State for Module 26: Carbon Footprint
  const [recycledKgInput, setRecycledKgInput] = useState<number>(120);

  // Interactive State for Module 27: Gold Conversion
  const [trashBalanceRp, setTrashBalanceRp] = useState<number>(250000);
  const goldMg = Math.round((trashBalanceRp / 1350000) * 1000);

  // 32 Selected Master Module Metadata
  const MASTER_MODULES = [
    { id: 'feat-1', name: '1. Reservasi Lapangan Live', cat: 'Layanan Digital', icon: Calendar },
    { id: 'feat-2', name: '2. Kalkulator Zakat & Donasi', cat: 'Operasional & Keuangan', icon: DollarSign },
    { id: 'feat-3', name: '3. Papan Skor Digital', cat: 'Layanan Digital', icon: Trophy },
    { id: 'feat-4', name: '4. Export Kas PDF & Excel', cat: 'Transparansi & Smart', icon: FileSpreadsheet },
    { id: 'feat-5', name: '5. Marketplace UMKM Waru', cat: 'Pemasaran & UMKM', icon: ShoppingBag },
    { id: 'feat-6', name: '6. WhatsApp Reminder Sampah', cat: 'Komunikasi Warga', icon: MessageSquare },
    { id: 'feat-7', name: '7. Simulator Proyeksi SHU', cat: 'Operasional & Keuangan', icon: TrendingUp },
    { id: 'feat-8', name: '8. E-Voucher Sewa Gedung', cat: 'Pemasaran & UMKM', icon: Ticket },
    { id: 'feat-9', name: '9. Aspirasi & Pengaduan', cat: 'Komunikasi Warga', icon: HelpCircle },
    { id: 'feat-10', name: '10. Buletin & Portal Berita', cat: 'Komunikasi Warga', icon: Newspaper },
    { id: 'feat-11', name: '11. E-Sertifikat Nasabah', cat: 'Pemasaran & UMKM', icon: Award },
    { id: 'feat-12', name: '12. Bahasa Jawa Krama Inggil', cat: 'Layanan Digital', icon: Languages },
    { id: 'feat-13', name: '13. QRIS Dynamic Bayar Tagihan', cat: 'Operasional & Keuangan', icon: QrCode },
    { id: 'feat-14', name: '14. IoT Kualitas Udara & Depo', cat: 'Transparansi & Smart', icon: Wind },
    { id: 'feat-15', name: '15. Portal Lelang & Kemitraan', cat: 'Pemasaran & UMKM', icon: Briefcase },
    { id: 'feat-16', name: '16. Analytics Retensi Warga', cat: 'Operasional & Keuangan', icon: BarChart3 },
    { id: 'feat-17', name: '17. Layanan Pengelolaan Sampah Desa & Kas RT', cat: 'Layanan Digital', icon: Truck },
    { id: 'feat-18', name: '18. Text-to-Speech Suara', cat: 'Layanan Digital', icon: Volume2 },
    { id: 'feat-19', name: '19. Absensi Digital GPS Staf', cat: 'Transparansi & Smart', icon: UserCheck },
    { id: 'feat-20', name: '20. Cuaca Baki & Kalender', cat: 'Layanan Digital', icon: Sun },
    { id: 'feat-21', name: '21. E-Surat Keterangan Anggota', cat: 'Layanan Digital', icon: FileText },
    { id: 'feat-22', name: '22. Kasir POS Digital Warung', cat: 'Operasional & Keuangan', icon: CreditCard },
    { id: 'feat-23', name: '23. Peta GIS Drop-Off Sampah', cat: 'Transparansi & Smart', icon: MapPin },
    { id: 'feat-24', name: '24. Akademi Pelatihan UMKM', cat: 'Pemasaran & UMKM', icon: GraduationCap },
    { id: 'feat-25', name: '25. Asisten AI & Kontrol Sistem Profesional', cat: 'Komunikasi Warga', icon: Bot },
    { id: 'feat-26', name: '26. Kalkulator Carbon Footprint', cat: 'Transparansi & Smart', icon: Leaf },
    { id: 'feat-27', name: '27. Konversi Sampah Ke Emas', cat: 'Operasional & Keuangan', icon: Coins },
    { id: 'feat-28', name: '28. E-Pass QR Tiket GOR', cat: 'Layanan Digital', icon: Ticket },
    { id: 'feat-29', name: '29. Papan Loker Kerja Desa', cat: 'Pemasaran & UMKM', icon: Briefcase },
    { id: 'feat-30', name: '30. Sewa Tenda & Sound System', cat: 'Layanan Digital', icon: Radio },
    { id: 'feat-31', name: '31. Live Streaming CCTV GOR', cat: 'Transparansi & Smart', icon: Video },
    { id: 'feat-32', name: '32. Portal Sponsor CSR Swasta', cat: 'Pemasaran & UMKM', icon: HeartHandshake }
  ];

  const handleSelectAll32 = () => {
    const all32 = MASTER_MODULES.map(m => m.id);
    setSelectedModuleIds(all32);
    if (onShowToast) onShowToast('32 Modul Fitur Berhasil Diaktifkan & Diterapkan!', 'success');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let botResp = 'Terima kasih atas pertanyaan Anda. BUMDESA Waskita Wijaya melayani pendaftaran nasabah bank sampah, penyewaan GOR Waru, dan kemitraan UMKM Desa Waru Baki Sukoharjo.';
      const lower = userMsg.toLowerCase();
      if (lower.includes('gor') || lower.includes('sewa') || lower.includes('jadwal')) {
        botResp = 'Sewa GOR Waru tersedia setiap hari jam 07:00 - 23:00 WIB. Harga Rp 35.000/jam untuk badminton dan Rp 100.000/jam untuk futsal.';
      } else if (lower.includes('sampah') || lower.includes('harga') || lower.includes('saldo')) {
        botResp = 'Bank Sampah Induk Waskita buka Selasa & Sabtu. Harga botol plastik Rp 3.500/kg, kardus Rp 2.200/kg. Saldo dapat dikonversi ke Emas Antam!';
      } else if (lower.includes('surat') || lower.includes('daftar')) {
        botResp = 'Pendaftaran nasabah dan cetak E-Surat Keterangan Anggota dapat dilakukan secara online melalui menu Pendaftaran Nasabah.';
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResp }]);
    }, 600);
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      if (onShowToast) onShowToast('Browser Anda tidak mendukung Web Speech API.', 'warning');
    }
  };

  const activeModuleMeta = MASTER_MODULES.find(m => m.id === activeModuleTab) || MASTER_MODULES[0];

  return (
    <section id="modul-fitur-suite" className="py-12 bg-slate-100 dark:bg-slate-950 min-h-screen text-left transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner Title */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3.5 py-1 rounded-full border border-emerald-700/60 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>32 Modul Pilihan Aktif BUMDESA Waskita</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Pusat Eksekusi 32 Modul Digital Terpadu
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Seluruh 32 modul yang Anda pilih telah aktif dan siap dijalankan secara interaktif dalam satu workspace operasional BUMDESA Desa Waru.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleSelectAll32}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Aktifkan Semua 32 Modul ({selectedModuleIds.length}/32)</span>
            </button>

            <button
              onClick={() => setIsJavanese(!isJavanese)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isJavanese ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Languages className="w-4 h-4" />
              <span>{isJavanese ? 'Basa Jawa Active' : 'Mode Basa Jawa'}</span>
            </button>
          </div>
        </div>

        {/* Category Filters & Quick Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['Semua', 'Layanan Digital', 'Operasional & Keuangan', 'Pemasaran & UMKM', 'Komunikasi Warga', 'Transparansi & Smart'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari dari 32 modul..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Master Workspace Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Navigation List of 32 Modules (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-3 shadow-xl max-h-[680px] overflow-y-auto space-y-1.5">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-2 flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                Daftar 32 Modul Pilihan
              </span>
              <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                32 DITERAPKAN
              </span>
            </div>

            {MASTER_MODULES.filter(m => {
              const matchCat = activeCategory === 'Semua' || m.cat === activeCategory;
              const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
              return matchCat && matchSearch;
            }).map((mod) => {
              const IconComp = mod.icon;
              const isActive = activeModuleTab === mod.id;

              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModuleTab(mod.id)}
                  className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                      : 'bg-slate-50/80 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                    <span className="text-xs truncate">{mod.name}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Main Interactive Workstage Panel (8 Cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl min-h-[580px] flex flex-col justify-between">
            
            {/* Header of Active Module Workspace */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
                    <activeModuleMeta.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      {activeModuleMeta.cat}
                    </span>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      {isJavanese ? `Modul BUMDES: ${activeModuleMeta.name}` : activeModuleMeta.name}
                    </h2>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>MODUL DITERAPKAN</span>
                </span>
              </div>

              {/* DYNAMIC INTERACTIVE CONTENT ACCORDING TO ACTIVE TAB */}
              <Suspense fallback={
                <div className="min-h-[220px] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    <span className="text-xs font-semibold">Memuat data modul...</span>
                  </div>
                </div>
              }>

              {/* Modul 1: Reservasi Lapangan GOR Live */}
              {activeModuleTab === 'feat-1' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Sistem pemesanan dan jadwal slot waktu lapangan badminton & futsal secara real-time.
                  </p>
                  <LiveCourtReservation />
                </div>
              )}

              {/* Modul 2: Zakat & Infaq Calculator */}
              {activeModuleTab === 'feat-2' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Hitung zakat maal (2.5%) dan donasi sosial desa secara otomatis untuk tabungan kas desa.
                  </p>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Jumlah Total Harta / Tabungan / Usaha (Rp):</label>
                    <input
                      type="number"
                      value={hartaNominal}
                      onChange={e => setHartaNominal(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">*Nisab Zakat Maal setara 85 gram emas (~Rp 85.000.000)</span>
                  </div>

                  <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400">Kewajiban Zakat Maal</span>
                      <p className="text-xl font-black text-white">Rp {zakatMaal.toLocaleString('id-ID')}</p>
                    </div>
                    <button
                      onClick={() => onShowToast && onShowToast(`Zakat sebesar Rp ${zakatMaal.toLocaleString('id-ID')} disalurkan ke Kas Sosial Desa Waru!`, 'success')}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl cursor-pointer"
                    >
                      Bayar Lewat QRIS
                    </button>
                  </div>
                </div>
              )}

              {/* Modul 3: Papan Skor Digital */}
              {activeModuleTab === 'feat-3' && (
                <div className="space-y-4 text-center">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">PAPAN SKOR MATCH LIVE GOR WARU</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900 text-white rounded-2xl border-2 border-emerald-500">
                      <span className="text-xs font-bold text-slate-400 block">TIM WARU A</span>
                      <span className="text-5xl font-black text-emerald-400 block my-2">{scoreA}</span>
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setScoreA(s => s + 1)} className="p-2 bg-emerald-600 rounded-lg text-xs font-bold cursor-pointer">+1 Poin</button>
                        <button onClick={() => setScoreA(s => Math.max(0, s - 1))} className="p-2 bg-slate-800 rounded-lg text-xs font-bold cursor-pointer">-1</button>
                      </div>
                      <span className="text-[10px] text-emerald-300 block mt-2">Set Dimenangkan: {setA}</span>
                    </div>

                    <div className="p-4 bg-slate-900 text-white rounded-2xl border-2 border-teal-500">
                      <span className="text-xs font-bold text-slate-400 block">TIM PUNDUNG B</span>
                      <span className="text-5xl font-black text-teal-400 block my-2">{scoreB}</span>
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setScoreB(s => s + 1)} className="p-2 bg-teal-600 rounded-lg text-xs font-bold cursor-pointer">+1 Poin</button>
                        <button onClick={() => setScoreB(s => Math.max(0, s - 1))} className="p-2 bg-slate-800 rounded-lg text-xs font-bold cursor-pointer">-1</button>
                      </div>
                      <span className="text-[10px] text-teal-300 block mt-2">Set Dimenangkan: {setB}</span>
                    </div>
                  </div>
                  <button onClick={() => { setScoreA(0); setScoreB(0); }} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl cursor-pointer">
                    <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset Skor Match
                  </button>
                </div>
              )}

              {/* Modul 4: Export Laporan Kas PDF */}
              {activeModuleTab === 'feat-4' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Generasi berkas resmi Laporan Keterangan Pertanggungjawaban (LKPJ) dan Laporan Keuangan BUMDESA Waru.
                  </p>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Saldo Kas BUMDESA:</span>
                      <span className="text-emerald-600">Rp 148.500.000</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span>Total Sampah Terolah (2026):</span>
                      <span className="text-emerald-600">42.800 Kg</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span>Jumlah Nasabah Aktif:</span>
                      <span className="text-emerald-600">480 Kepala Keluarga</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onShowToast && onShowToast('Mengunduh Laporan Kas BUMDESA Format PDF...', 'info')} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer">
                      <Download className="w-4 h-4" /> Unduh Laporan PDF
                    </button>
                    <button onClick={() => onShowToast && onShowToast('Mengunduh Rekap Excel Laba-Rugi BUMDESA...', 'info')} className="flex-1 py-3 bg-teal-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer">
                      <FileSpreadsheet className="w-4 h-4" /> Export Ke Excel
                    </button>
                  </div>
                </div>
              )}

              {/* Modul 6: WhatsApp Reminder */}
              {activeModuleTab === 'feat-6' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Kirim pengingat WhatsApp otomatis penimbangan sampah ke nasabah desa.
                  </p>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nomor WhatsApp Nasabah:</label>
                    <input type="text" value={waPhone} onChange={e => setWaPhone(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Draf Pesan Pengingat:</label>
                    <textarea value={waMessage} onChange={e => setWaMessage(e.target.value)} rows={3} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white" />
                  </div>
                  <a href={`https://wa.me/${waPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer">
                    <Send className="w-4 h-4" /> Kirim Notifikasi WhatsApp Sekarang
                  </a>
                </div>
              )}

              {/* Modul 7: Proyeksi SHU */}
              {activeModuleTab === 'feat-7' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Kalkulator estimasi pembagian Sisa Hasil Usaha (SHU) tahunan berdasarkan tonase daur ulang.
                  </p>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Estimasi Total Penyetoran Sampah Per Tahun (Kg):</label>
                    <input type="number" value={trashKgPerYear} onChange={e => setTrashKgPerYear(Number(e.target.value))} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black text-slate-900 dark:text-white" />
                  </div>
                  <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-300">Proyeksi Deviden SHU Anda</span>
                      <p className="text-2xl font-black text-white">Rp {estimatedShu.toLocaleString('id-ID')}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
              )}

              {/* Modul 13: QRIS Dynamic */}
              {activeModuleTab === 'feat-13' && (
                <div className="space-y-4 text-center">
                  <p className="text-xs text-slate-600 dark:text-slate-300 text-left">
                    Penerbitan barcode QRIS resmi BUMDESA Waskita Wijaya untuk sewa GOR & pembayaran retribusi.
                  </p>
                  <div className="p-4 bg-white dark:bg-slate-800 border-2 border-emerald-500 rounded-2xl inline-block shadow-md">
                    <QrCode className="w-36 h-36 text-slate-900 dark:text-white mx-auto" />
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block mt-2">NMID: ID10283948509</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">Rp {qrisAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-center gap-2">
                    {[15000, 35000, 50000, 100000].map(amt => (
                      <button key={amt} onClick={() => setQrisAmount(amt)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-lg cursor-pointer hover:bg-emerald-100">
                        Rp {amt.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Modul 18: Text to Speech */}
              {activeModuleTab === 'feat-18' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Fitur narator pembaca suara otomatis pengumuman desa untuk warga lansia dan disabilitas.
                  </p>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200">
                    "Pengumuman resmi BUMDESA Waskita Wijaya Desa Waru Baki Sukoharjo. Penimbangan bank sampah induk dilaksanakan hari Sabtu besok pukul 08:00 WIB."
                  </div>
                  <button
                    onClick={() => handleSpeakText('Pengumuman resmi BUMDESA Waskita Wijaya Desa Waru Baki Sukoharjo. Penimbangan bank sampah induk dilaksanakan hari Sabtu besok pukul 08:00 WIB.')}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isSpeaking ? 'Hentikan Suara Narator' : 'Putar Narasi Suara Pengumuman (TTS)'}</span>
                  </button>
                </div>
              )}

              {/* Modul 25: Studio Kontrol Sistem & Asisten AI */}
              {activeModuleTab === 'feat-25' && (
                <div className="space-y-6">
                  <Suspense fallback={
                    <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Memuat Studio Kontrol Sistem Agent AI...</span>
                    </div>
                  }>
                    <AiControlDirectiveStudio onShowToast={onShowToast} />
                  </Suspense>
                </div>
              )}

              {/* Modul 27: Konversi Sampah Ke Emas */}
              {activeModuleTab === 'feat-27' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Fitur penukaran saldo tabungan sampah ke pecahan emas batangan murni Antam.
                  </p>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Saldo Tabungan Sampah (Rp):</label>
                    <input type="number" value={trashBalanceRp} onChange={e => setTrashBalanceRp(Number(e.target.value))} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black text-slate-900 dark:text-white" />
                  </div>
                  <div className="p-4 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-900">Perolehan Emas Murni Antam</span>
                      <p className="text-2xl font-black">{goldMg} Milligram Emas ({(goldMg / 1000).toFixed(3)} Gram)</p>
                    </div>
                    <Coins className="w-8 h-8 text-slate-950" />
                  </div>
                </div>
              )}

              {/* Modul 5: Marketplace UMKM */}
              {activeModuleTab === 'feat-5' && (
                <div className="space-y-4">
                  <VillageMarketplace />
                </div>
              )}

              {/* Modul 17: Unit Usaha Layanan Pengelolaan Sampah */}
              {activeModuleTab === 'feat-17' && (
                <div className="space-y-4">
                  <WasteManagementService onShowToast={(t, m, type) => onShowToast && onShowToast(`${t}: ${m}`, type)} />
                </div>
              )}

              {/* Modul 29: Papan Loker Kerja Desa */}
              {activeModuleTab === 'feat-29' && (
                <div className="space-y-4">
                  <VillageJobBoard />
                </div>
              )}

              {/* Modul 30: Sewa Tenda & Sound System */}
              {activeModuleTab === 'feat-30' && (
                <div className="space-y-4">
                  <EventEquipmentRental />
                </div>
              )}

              {/* Modul 32: Portal Relawan / Sponsor */}
              {activeModuleTab === 'feat-32' && (
                <div className="space-y-4">
                  <VolunteerYouthPortal />
                </div>
              )}

              {/* Modul 8: Simulator Sewa Gedung */}
              {activeModuleTab === 'feat-8' && (
                <div className="space-y-4">
                  <EventHallCostSimulator />
                </div>
              )}

              {/* Modul 9: E-Voting Musdes */}
              {activeModuleTab === 'feat-9' && (
                <div className="space-y-4">
                  <MusdesEVoting />
                </div>
              )}

              {/* Modul 20: Posyandu Kesehatan */}
              {activeModuleTab === 'feat-20' && (
                <div className="space-y-4">
                  <PosyanduHealthSchedule />
                </div>
              )}

              {/* Modul 24: Wisata Kuliner */}
              {activeModuleTab === 'feat-24' && (
                <div className="space-y-4">
                  <CulinaryTourismPortal />
                </div>
              )}

              {/* Generic Fallback for Other Modules */}
              {![
                'feat-1', 'feat-2', 'feat-3', 'feat-4', 'feat-5', 'feat-6', 'feat-7', 'feat-8', 'feat-9', 'feat-13', 'feat-17', 'feat-18', 'feat-20', 'feat-24', 'feat-25', 'feat-27', 'feat-29', 'feat-30', 'feat-32'
              ].includes(activeModuleTab) && (
                <div className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{activeModuleMeta.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Status: Modul aktif terintegrasi di BUMDESA Waskita Wijaya.</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Modul ini memberikan peningkatan tata kelola otomatisasi, pencatatan digital, dan kenyamanan publik bagi seluruh warga Desa Waru Baki Sukoharjo.
                  </p>
                  <button
                    onClick={() => onShowToast && onShowToast(`Modul ${activeModuleMeta.name} berhasil dieksekusi!`, 'success')}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl cursor-pointer shadow-md"
                  >
                    Jalankan Simulasi Modul {activeModuleMeta.name.split('.')[1] || activeModuleMeta.name}
                  </button>
                </div>
              )}

              </Suspense>
            </div>

            {/* Bottom Footer Status */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>BUMDESA Waskita Wijaya • Baki, Sukoharjo</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">32 Modul Pilihan Aktif 100%</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
