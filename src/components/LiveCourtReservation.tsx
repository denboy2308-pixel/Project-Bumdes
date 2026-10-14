import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  QrCode, 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Tv, 
  Zap, 
  Flame, 
  MapPin, 
  ChevronRight, 
  Sparkles, 
  RefreshCw,
  Send,
  Ticket,
  DollarSign,
  Award,
  Check,
  Trophy,
  AlertCircle,
  HelpCircle,
  Info,
  X
} from 'lucide-react';
import { showToast } from './ToastNotification';
import { getTodayJakartaISO, isPastDateJakarta } from '../utils/dateUtils';
import InteractiveDateNavigator from './InteractiveDateNavigator';

interface Court {
  id: string;
  name: string;
  type: string;
  floorSpec: string;
  pricePerHour: number;
  image: string;
  currentMatch?: {
    playerA: string;
    playerB: string;
    startTime: string;
    endTime: string;
    minutesLeft: number;
  };
}

const COURTS_DATA: Court[] = [
  {
    id: 'lapangan-1',
    name: 'Lapangan 1 (Lantai Kayu Pro)',
    type: 'Badminton Indoor',
    floorSpec: 'Solid Wood Parket PBSI Grade A',
    pricePerHour: 35000,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    currentMatch: {
      playerA: 'PB Waru Sukoharjo',
      playerB: 'PB Rajawali Baki',
      startTime: '18:00',
      endTime: '20:00',
      minutesLeft: 35
    }
  },
  {
    id: 'lapangan-2',
    name: 'Lapangan 2 (Lantai Karpet Vinyl)',
    type: 'Badminton Indoor',
    floorSpec: 'Karpet Vinyl Hijau BWF Standar',
    pricePerHour: 30000,
    image: 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'lapangan-3',
    name: 'Lapangan 3 (Lantai Parket)',
    type: 'Badminton Indoor',
    floorSpec: 'Lantai Parket Kayu Jati Halus',
    pricePerHour: 25000,
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=800&q=80',
    currentMatch: {
      playerA: 'Klub Pemuda RT 03',
      playerB: 'Klub Pemuda RT 01',
      startTime: '19:00',
      endTime: '21:00',
      minutesLeft: 75
    }
  },
  {
    id: 'hall-futsal',
    name: 'Hall Indoor Futsal & Volleyball',
    type: 'Multifungsi Arena',
    floorSpec: 'Interlocking Polimer & Jaring Pengaman',
    pricePerHour: 100000,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'
  }
];

const ALL_TIME_SLOTS = [
  { id: '07:00 - 08:00', period: 'pagi' },
  { id: '08:00 - 09:00', period: 'pagi' },
  { id: '09:00 - 10:00', period: 'pagi' },
  { id: '10:00 - 11:00', period: 'pagi' },
  { id: '11:00 - 12:00', period: 'pagi' },
  { id: '13:00 - 14:00', period: 'siang' },
  { id: '14:00 - 15:00', period: 'siang' },
  { id: '15:00 - 16:00', period: 'siang' },
  { id: '16:00 - 17:00', period: 'sore' },
  { id: '17:00 - 18:00', period: 'sore' },
  { id: '18:00 - 19:00', period: 'sore' },
  { id: '19:00 - 20:00', period: 'malam' },
  { id: '20:00 - 21:00', period: 'malam' },
  { id: '21:00 - 22:00', period: 'malam' },
  { id: '22:00 - 23:00', period: 'malam' }
];

export default function LiveCourtReservation() {
  const [activeReservationMode, setActiveReservationMode] = useState<'harian' | 'member'>('harian');
  const [selectedCourtId, setSelectedCourtId] = useState<string>('lapangan-1');
  
  // Date state
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayJakartaISO());

  // Time filter state
  const [timeFilter, setTimeFilter] = useState<'all' | 'pagi' | 'siang' | 'sore' | 'malam'>('all');

  // Selected slots (multi-select)
  const [selectedSlots, setSelectedSlots] = useState<string[]>(['20:00 - 21:00']);

  // Booking customer state
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingCommunity, setBookingCommunity] = useState('');
  
  // Member registration state
  const [memberCourt, setMemberCourt] = useState('lapangan-1');
  const [memberDay, setMemberDay] = useState('Sabtu');
  const [memberTimeSlot, setMemberTimeSlot] = useState('19:00 - 21:00');
  const [memberName, setMemberName] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberNotes, setMemberNotes] = useState('');

  // Modals & confirmation
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  const todayISO = useMemo(() => getTodayJakartaISO(), []);
  const isPastDate = useMemo(() => selectedDate < todayISO, [selectedDate, todayISO]);

  // Dynamic occupied slots based on selectedDate & court
  const occupiedSlots = useMemo<Record<string, string[]>>(() => {
    if (selectedDate < todayISO) {
      // Past dates: matches have finished
      return {
        'lapangan-1': ['08:00 - 09:00', '10:00 - 11:00', '16:00 - 17:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'],
        'lapangan-2': ['09:00 - 10:00', '14:00 - 15:00', '17:00 - 18:00', '19:00 - 20:00', '21:00 - 22:00'],
        'lapangan-3': ['18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'],
        'hall-futsal': ['16:00 - 17:00', '19:00 - 20:00', '20:00 - 21:00']
      };
    }

    const [y, m, d] = selectedDate.split('-').map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend: more morning & evening bookings
      return {
        'lapangan-1': ['08:00 - 09:00', '09:00 - 10:00', '16:00 - 17:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'],
        'lapangan-2': ['09:00 - 10:00', '15:00 - 16:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'],
        'lapangan-3': ['19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00'],
        'hall-futsal': ['16:00 - 18:00', '19:00 - 21:00']
      };
    } else {
      // Weekdays: busy after work hours
      return {
        'lapangan-1': ['18:00 - 19:00', '19:00 - 20:00'],
        'lapangan-2': ['19:00 - 20:00', '20:00 - 21:00'],
        'lapangan-3': ['20:00 - 21:00'],
        'hall-futsal': ['19:00 - 20:00']
      };
    }
  }, [selectedDate, todayISO]);

  const selectedCourt = COURTS_DATA.find(c => c.id === selectedCourtId) || COURTS_DATA[0];
  const totalPrice = selectedSlots.length * selectedCourt.pricePerHour;

  // Filtered time slots
  const displayedSlots = useMemo(() => {
    if (timeFilter === 'all') return ALL_TIME_SLOTS;
    return ALL_TIME_SLOTS.filter(s => s.period === timeFilter);
  }, [timeFilter]);

  const handleToggleSlot = (slot: string) => {
    if (isPastDate) {
      showToast('Jadwal Riwayat / Lampau', 'Jadwal pada tanggal ini telah selesai dimainkan. Silakan pilih Hari Ini, Besok, Lusa, atau tanggal mendatang untuk memesan.', 'info');
      return;
    }

    const isOccupied = occupiedSlots[selectedCourtId]?.includes(slot);
    if (isOccupied) {
      showToast('Slot Waktu Terisi', 'Slot ini sedang digunakan oleh pemain lain. Silakan pilih slot jam yang masih hijau.', 'info');
      return;
    }

    if (selectedSlots.includes(slot)) {
      if (selectedSlots.length === 1) {
        showToast('Minimal 1 Slot', 'Anda harus memilih minimal satu slot jam bermain.', 'warning');
        return;
      }
      setSelectedSlots(prev => prev.filter(s => s !== slot));
    } else {
      setSelectedSlots(prev => [...prev, slot].sort());
    }
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim()) {
      showToast('Nama Pemain Wajib Diisi', 'Silakan masukkan nama penanggung jawab sewa.', 'warning');
      return;
    }
    if (!bookingPhone.trim()) {
      showToast('Nomor WhatsApp Wajib Diisi', 'Diperlukan untuk pengiriman invoice tiket QRIS.', 'warning');
      return;
    }
    if (selectedSlots.length === 0) {
      showToast('Pilih Slot Jam', 'Silakan pilih minimal 1 slot jam bermain.', 'warning');
      return;
    }

    setShowQrisModal(true);
  };

  const handlePayQris = () => {
    const newTicketId = `WARU-GOR-${Date.now().toString().slice(-6)}`;
    setGeneratedTicketId(newTicketId);
    setBookingConfirmed(true);
    setShowQrisModal(false);
    showToast('Reservasi Lapangan Berhasil!', 'Slot jam bermain telah dikunci resmi di BUMDESA Waskita Wijaya.', 'success');
  };

  const handleSendWAInvoice = () => {
    const slotsStr = selectedSlots.join(', ');
    const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPrice);
    const msg = `*KONFIRMASI RESERVASI LAPANGAN LIVE BUMDESA WARU*\n\n` +
      `🎟️ *Kode Tiket:* ${generatedTicketId || 'WARU-GOR-LIVE'}\n` +
      `👤 *Penyewa:* ${bookingName}\n` +
      `📱 *No. WA:* ${bookingPhone}\n` +
      `🏸 *Arena:* ${selectedCourt.name}\n` +
      `📅 *Tanggal:* ${selectedDate}\n` +
      `⏱️ *Slot Jam:* ${slotsStr} (${selectedSlots.length} Jam)\n` +
      `💰 *Total Biaya:* ${formattedPrice}\n` +
      `🏷️ *Status:* Lunas / QRIS Terverifikasi\n\n` +
      `Mohon dibantu koordinasi pintu masuk dan pencahayaan lampu GOR. Terima kasih BUMDESA Waskita!`;

    window.open(`https://wa.me/6282134567890?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSendDirectWA = () => {
    if (!bookingName.trim() || !bookingPhone.trim()) {
      showToast('Data Belum Lengkap', 'Silakan lengkapi nama dan no WhatsApp terlebih dahulu.', 'warning');
      return;
    }
    const slotsStr = selectedSlots.join(', ');
    const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPrice);
    const msg = `*PENGAJUAN BOOKING LAPANGAN GOR WARU*\n\n` +
      `👤 *Penyewa:* ${bookingName}\n` +
      `📱 *No. WA:* ${bookingPhone}\n` +
      `🏸 *Arena:* ${selectedCourt.name}\n` +
      `📅 *Tanggal:* ${selectedDate}\n` +
      `⏱️ *Slot Jam:* ${slotsStr}\n` +
      `💰 *Estimasi Total:* ${formattedPrice}\n\n` +
      `Halo admin BUMDES, mohon konfirmasi ketersediaan slot lapangan di atas. Terima kasih!`;
    window.open(`https://wa.me/6282134567890?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSubmitMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberPhone.trim()) {
      showToast('Data Member Belum Lengkap', 'Silakan isi nama dan nomor WhatsApp Anda.', 'warning');
      return;
    }
    const courtObj = COURTS_DATA.find(c => c.id === memberCourt) || COURTS_DATA[0];
    const msg = `*PENDAFTARAN PAKET MEMBER BULANAN GOR WARU*\n\n` +
      `👤 *Nama / Tim:* ${memberName}\n` +
      `📱 *No. WA:* ${memberPhone}\n` +
      `🏸 *Pilihan Arena:* ${courtObj.name}\n` +
      `🗓️ *Hari Rutin:* Setiap hari ${memberDay}\n` +
      `⏰ *Jam Bermain:* ${memberTimeSlot} (2 Jam/minggu)\n` +
      `💳 *Tarif:* Rp 80.000 / Bulan (Hemat 35%)\n` +
      `📝 *Catatan:* ${memberNotes || '-'}\n\n` +
      `Halo Admin BUMDESA Waskita Wijaya, saya ingin mendaftar paket member bulanan bulutangkis di atas. Mohon arahan nomor rekening / QRIS pembayaran member. Terima kasih!`;
    
    window.open(`https://wa.me/6282134567890?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Formulir Terkirim ke WhatsApp', 'Pengurus BUMDES akan segera mengunci slot jadwal member Anda.', 'success');
  };

  return (
    <section id="sistem-reservasi-live" className="w-full bg-slate-900/95 dark:bg-slate-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-2xl space-y-8 my-4 transition-all">
      
      {/* 1. Header Banner & Mode Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/90 px-3.5 py-1 rounded-full border border-emerald-700/60 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Sistem Reservasi Lapangan Live 24/7</span>
            </span>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              GOR Desa Waru • Baki, Sukoharjo
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Denah & Jadwal Live Lapangan GOR Waru
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Pantau ketersediaan lapangan secara real-time, pilih slot jam bermain bulutangkis atau futsal Anda, dan lakukan reservasi instan tanpa ribet antre.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => showToast('Data Jadwal Diperbarui', 'Papan ketersediaan slot jam terbaru telah dimuat ulang.', 'info')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span>Refresh Jadwal Live</span>
          </button>
        </div>
      </div>

      {/* 2. Top Interactive Navigation Tabs (Harian vs Member Bulanan) */}
      <div className="flex flex-col sm:flex-row p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800 gap-2">
        <button
          onClick={() => setActiveReservationMode('harian')}
          className={`flex-1 py-3 px-5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center space-x-2.5 cursor-pointer ${
            activeReservationMode === 'harian'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>🏸 Reservasi Slot Jam Live / Harian</span>
        </button>

        <button
          onClick={() => setActiveReservationMode('member')}
          className={`flex-1 py-3 px-5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center space-x-2.5 cursor-pointer ${
            activeReservationMode === 'member'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-300" />
          <span>🏆 Pendaftaran Paket Member Bulanan (Hemat 35%)</span>
        </button>
      </div>

      {/* ================= MODE A: RESERVASI HARIAN / JAM LIVE ================= */}
      {activeReservationMode === 'harian' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* A.1 Step Header: Pilih Arena Lapangan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs font-black">
                  1
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Pilih Arena Olahraga yang Ingin Digunakan
                </h3>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Klik kartu arena untuk mengganti pilihan
              </span>
            </div>

            {/* A.2 Wide 4-Column Court Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {COURTS_DATA.map((court) => {
                const isSelected = selectedCourtId === court.id;
                const hasMatch = !!court.currentMatch;

                return (
                  <div
                    key={court.id}
                    onClick={() => {
                      setSelectedCourtId(court.id);
                      showToast('Arena Terpilih', `Anda memilih ${court.name}`, 'info');
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500 ring-2 ring-emerald-500/60 shadow-xl shadow-emerald-950/40 scale-[1.01]'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Selected Badge Ribbon */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-md z-20 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Arena Aktif</span>
                      </div>
                    )}

                    {/* Image & Overlay */}
                    <div className="h-36 sm:h-40 rounded-xl overflow-hidden relative mb-3.5 bg-slate-900 border border-slate-800">
                      <img 
                        src={court.image} 
                        alt={court.name} 
                        referrerPolicy="no-referrer" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      
                      {/* Live Badge */}
                      <div className="absolute top-2 left-2 z-10">
                        {hasMatch ? (
                          <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-lg shadow-red-950/80">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                            <span>LIVE MATCH ({court.currentMatch?.minutesLeft} Mnt)</span>
                          </span>
                        ) : (
                          <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md shadow-emerald-950/60">
                            <span>🟢 SIAP DIGUNAKAN</span>
                          </span>
                        )}
                      </div>

                      {/* Floor Spec Overlay Tag */}
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="text-[10px] text-slate-300 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-700 block truncate">
                          {court.floorSpec}
                        </span>
                      </div>
                    </div>

                    {/* Title & Info */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                        {court.type}
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                        {court.name}
                      </h4>
                      
                      {hasMatch && (
                        <div className="p-2.5 bg-red-950/40 border border-red-900/40 rounded-xl text-[10px] space-y-0.5 mt-2">
                          <span className="text-red-300 font-semibold block">Laga Berlangsung:</span>
                          <span className="font-bold text-white block truncate">{court.currentMatch?.playerA} vs {court.currentMatch?.playerB}</span>
                          <span className="text-slate-400 text-[9px] block">Slot: {court.currentMatch?.startTime} - {court.currentMatch?.endTime} WIB</span>
                        </div>
                      )}
                    </div>

                    {/* Price & Select Button */}
                    <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-normal">Tarif Sewa:</span>
                        <span className="font-black text-emerald-400 text-sm sm:text-base">
                          Rp {court.pricePerHour.toLocaleString('id-ID')}
                          <span className="text-[10px] text-slate-400 font-normal"> / Jam</span>
                        </span>
                      </div>
                      <span className={`text-[11px] font-black px-3 py-1 rounded-xl transition-colors ${
                        isSelected 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                      }`}>
                        {isSelected ? 'Terpilih' : 'Pilih Arena'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* A.3 Main Booking Stage: Calendar + Slot Matrix & Sticky Form */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start pt-2">
            
            {/* Left Column: Compact Wide Date Bar, Filter/Legend Strip & 5-Column Slot Grid (7-8 cols) */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-950/80 p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-4 shadow-lg">
              
              {/* Interactive Date Navigator (Compact, Wide, Single-tier) */}
              <InteractiveDateNavigator
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                accentColor="emerald"
                title={`Jadwal ${selectedCourt.name}`}
                getAvailability={(dateStr) => {
                  if (dateStr < todayISO) {
                    return { status: 'past', label: 'Arsip Selesai', badge: 'Selesai' };
                  }
                  const [y, m, d] = dateStr.split('-').map(Number);
                  const day = new Date(y, m - 1, d).getDay();
                  if (day === 0 || day === 6) {
                    return { status: 'limited', label: 'Weekend Ramai', badge: 'Sisa 3' };
                  }
                  return { status: 'available', label: 'Tersedia', badge: 'Tersedia' };
                }}
              />

              {isPastDate && (
                <div className="bg-amber-950/40 border border-amber-900/60 px-3.5 py-2.5 rounded-xl text-xs text-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-[11px] text-amber-200">
                      <strong>Jadwal Riwayat / Lampau:</strong> Pertandingan telah selesai dimainkan.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(todayISO)}
                    className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] transition-colors cursor-pointer shrink-0"
                  >
                    Pesan Hari Ini →
                  </button>
                </div>
              )}

              {/* Filter Jam + Compact Visual Legend (Combined Single Horizontal Row) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[11px] text-slate-400 font-bold mr-1">Filter Jam:</span>
                  {[
                    { id: 'all', label: 'Semua (15)' },
                    { id: 'pagi', label: '🌅 Pagi' },
                    { id: 'siang', label: '☀️ Siang' },
                    { id: 'sore', label: '🌇 Sore' },
                    { id: 'malam', label: '🌙 Malam' }
                  ].map(tf => (
                    <button
                      key={tf.id}
                      type="button"
                      onClick={() => setTimeFilter(tf.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        timeFilter === tf.id
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>

                {/* Inline Compact Legend */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium shrink-0 self-end sm:self-auto">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>Tersedia</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-300 font-bold">Dipilih ({selectedSlots.length})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Terisi</span>
                  </span>
                </div>
              </div>

              {/* Time Slots Matrix Grid (5-Column Wide Grid: Exactly 3 neat rows) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {displayedSlots.map((slotObj) => {
                  const slot = slotObj.id;
                  const isOccupied = occupiedSlots[selectedCourtId]?.includes(slot);
                  const isSelected = selectedSlots.includes(slot);

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleToggleSlot(slot)}
                      disabled={isOccupied}
                      className={`p-2 sm:p-2.5 rounded-xl text-xs font-extrabold transition-all duration-150 text-center flex flex-col items-center justify-between min-h-[56px] cursor-pointer relative ${
                        isOccupied
                          ? 'bg-red-950/30 border border-red-900/40 text-red-400/50 cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-emerald-500 text-slate-950 border border-emerald-400 shadow-md shadow-emerald-500/25 ring-2 ring-emerald-300/40 font-black'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-200 hover:border-emerald-500/60 hover:bg-slate-800'
                      }`}
                    >
                      <span className="font-mono text-xs font-black tracking-tight">
                        {slot}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span className={`text-[9px] uppercase font-bold tracking-wider ${
                          isOccupied ? 'text-red-400' : isSelected ? 'text-slate-950' : 'text-slate-400'
                        }`}>
                          {isOccupied ? 'Terisi' : isSelected ? 'Dipilih' : 'Tersedia'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Compact Information Note Footer */}
              <div className="bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800/80 flex items-center space-x-2 text-[11px] text-slate-300">
                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <p className="truncate">
                  <strong>Tips:</strong> Jam malam (19.00 - 22.00 WIB) paling ramai. Kunci slot lebih awal agar tidak kehabisan.
                </p>
              </div>

            </div>

            {/* Right Column: Checkout Summary & Direct Order Form (4-5 cols) */}
            <div className="xl:col-span-5 2xl:col-span-4 bg-slate-950/90 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              
              <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
                <span className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs font-black">
                  3
                </span>
                <div>
                  <h3 className="text-base font-black text-white">
                    Data Pemesan & Rincian Pembayaran
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Konfirmasi slot jam bermain Anda
                  </p>
                </div>
              </div>

              {!bookingConfirmed ? (
                <form onSubmit={handleConfirmReservation} className="space-y-4">
                  
                  {/* Order Summary Card */}
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Arena:</span>
                      <span className="font-black text-white">{selectedCourt.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Tanggal:</span>
                      <span className="font-bold text-white">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between items-start text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>Slot Terpilih:</span>
                      <div className="text-right space-y-1">
                        {selectedSlots.map(s => (
                          <span key={s} className="inline-block bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-md text-[10px] font-bold ml-1">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Total Durasi:</span>
                      <span className="font-bold text-white">{selectedSlots.length} Jam</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Tarif per Jam:</span>
                      <span className="font-bold text-white">Rp {selectedCourt.pricePerHour.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-100 font-extrabold pt-2.5 border-t border-slate-800 text-sm">
                      <span>Total Biaya:</span>
                      <span className="text-emerald-400 text-base font-black">
                        Rp {totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Customer Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Nama Lengkap / Tim Penanggung Jawab: <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Bp. Hendro / PB Waru"
                          value={bookingName}
                          onChange={e => setBookingName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Nomor WhatsApp Aktif: <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          placeholder="08xxxxxxxxxx"
                          value={bookingPhone}
                          onChange={e => setBookingPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Asal Dukuh / Klub (Opsional):
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: RT 02 RW 01 Dukuh Waru"
                        value={bookingCommunity}
                        onChange={e => setBookingCommunity(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Booking Action Buttons */}
                  <div className="space-y-2.5 pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Bayar via QRIS Instan</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSendDirectWA}
                      className="w-full py-3 px-4 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kirim Booking Langsung ke WhatsApp Admin</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                    🔒 Data terlindungi aman. Konfirmasi resmi akan dikirimkan langsung ke nomor WhatsApp Anda.
                  </p>
                </form>
              ) : (
                /* Ticket Confirmation Card */
                <div className="space-y-4 text-center py-2 animate-in fade-in">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Reservasi Berhasil Dikunci!</h4>
                    <p className="text-xs text-slate-400 mt-1">E-Tiket resmi GOR Desa Waru telah diterbitkan.</p>
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-left space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-slate-400">Kode Tiket:</span> <span className="font-mono font-black text-emerald-400">{generatedTicketId}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Penyewa:</span> <span className="font-bold text-white">{bookingName}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Arena:</span> <span className="font-bold text-white">{selectedCourt.name}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Tanggal:</span> <span className="font-bold text-white">{selectedDate}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Slot Jam:</span> <span className="font-bold text-emerald-400">{selectedSlots.join(', ')}</span></div>
                    <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Status Bayar:</span> <span className="font-black text-emerald-400">LUNAS QRIS</span></div>
                  </div>

                  <button
                    onClick={handleSendWAInvoice}
                    className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-green-950/40"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim E-Tiket ke WhatsApp Admin</span>
                  </button>

                  <button
                    onClick={() => {
                      setBookingConfirmed(false);
                      setSelectedSlots(['20:00 - 21:00']);
                    }}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Buat Reservasi Baru
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* ================= MODE B: PENDAFTARAN MEMBER BULANAN ================= */}
      {activeReservationMode === 'member' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Member Benefits Highlight */}
          <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-600/40 inline-flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Paket Langganan Komunitas & Rutinan</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Keuntungan Menjadi Member Bulanan GOR Waru
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Nikmati kepastian jadwal bermain tetap setiap pekan tanpa khawatir bentrok atau kehabisan slot lapangan dengan tarif hemat bersubsidi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-black">
                  1
                </div>
                <h4 className="text-xs font-bold text-white">Slot Jam Terkunci</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Hari dan jam bermain Anda otomatis dikunci setiap minggu, tidak bisa diserobot penyewa harian.
                </p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-black">
                  2
                </div>
                <h4 className="text-xs font-bold text-white">Hemat Biaya 35%</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Hanya Rp 80.000 / Bulan untuk 4 kali sesi bermain @ 2 jam penuh (normal Rp 120.000+).
                </p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-black">
                  3
                </div>
                <h4 className="text-xs font-bold text-white">Bonus Fasilitas</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Gratis isi ulang air mineral galon dingin setiap sesi latihan dan 1 slop shuttlecock perdana.
                </p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 font-black">
                  4
                </div>
                <h4 className="text-xs font-bold text-white">Kartu Member Digital</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Akses prioritas turnamen tahunan Desa Waru Cup dan diskon sewa aula gedung serbaguna.
                </p>
              </div>
            </div>
          </div>

          {/* Member Registration Form */}
          <div className="bg-slate-950/80 p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-2xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white">
                Formulir Pendaftaran Member Bulanan
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Isi data di bawah untuk penguncian jadwal rutin mingguan tim Anda.
              </p>
            </div>

            <form onSubmit={handleSubmitMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Pilih Lapangan:
                  </label>
                  <select
                    value={memberCourt}
                    onChange={e => setMemberCourt(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                  >
                    {COURTS_DATA.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Hari Bermain Rutin:
                  </label>
                  <select
                    value={memberDay}
                    onChange={e => setMemberDay(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                  >
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(d => (
                      <option key={d} value={d}>Setiap Hari {d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Pilihan Slot Jam Mingguan (2 Jam):
                </label>
                <select
                  value={memberTimeSlot}
                  onChange={e => setMemberTimeSlot(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                >
                  <option value="16:00 - 18:00">16:00 - 18:00 WIB (Sore)</option>
                  <option value="18:00 - 20:00">18:00 - 20:00 WIB (Malam Awal)</option>
                  <option value="19:00 - 21:00">19:00 - 21:00 WIB (Malam Prima)</option>
                  <option value="20:00 - 22:00">20:00 - 22:00 WIB (Malam Lanjut)</option>
                  <option value="21:00 - 23:00">21:00 - 23:00 WIB (Malam Akhir)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Nama Penanggung Jawab / Tim: <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PB Garuda Waru"
                    value={memberName}
                    onChange={e => setMemberName(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Nomor WhatsApp: <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08xxxxxxxxxx"
                    value={memberPhone}
                    onChange={e => setMemberPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Catatan Tambahan (Opsional):
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Ingin mulai aktif per 1 Oktober, butuh raket sewa tambahan"
                  value={memberNotes}
                  onChange={e => setMemberNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                />
              </div>

              {/* Total Card */}
              <div className="p-4 bg-amber-950/30 rounded-2xl border border-amber-600/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-300 font-bold block">Biaya Paket Member:</span>
                  <span className="text-[10px] text-slate-400">4 sesi x 2 jam = 8 jam/bulan</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-amber-400">Rp 80.000</span>
                  <span className="text-[10px] text-slate-400 block font-normal">/ Bulan</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>Kirim Pendaftaran Member ke Pengurus BUMDES</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* 3. QRIS Payment Modal Dialog */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-7 rounded-3xl max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Pembayaran QRIS</span>
              <button 
                onClick={() => setShowQrisModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-white">Scan Barcode QRIS Resmi</h3>
              <p className="text-[11px] text-slate-400">
                Mendukung BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay & LinkAja.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
              <QrCode className="w-44 h-44 text-slate-950 mx-auto" />
              <span className="text-[10px] font-black text-slate-900 block mt-2">NMID: ID1029384756201</span>
              <span className="text-base font-black text-slate-900">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              Atas Nama: <strong className="text-white">BUMDESA WASKITA WIJAYA</strong>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowQrisModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handlePayQris}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl cursor-pointer transition-colors shadow-md shadow-emerald-950/50"
              >
                Saya Sudah Bayar
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
