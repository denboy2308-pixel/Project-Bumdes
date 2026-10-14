import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Plus, CheckCircle2, QrCode, Download, 
  MapPin, AlertCircle, ChevronRight, X, Sparkles, Building2, 
  Radio, Check, RefreshCw, Copy, Share2
} from 'lucide-react';
import { showToast } from '../../ToastNotification';
import { getTodayJakartaISO, isPastDateJakarta } from '../../../utils/dateUtils';
import { getQrCodeImageUrl } from '../../../services/freeApiService';
import CustomerWeatherWidget from './CustomerWeatherWidget';

export interface BookingTicket {
  id: string;
  facility: string;
  date: string;
  timeSlot: string;
  teamName: string;
  totalCost: number;
  paymentStatus: 'Lunas' | 'DP Terbayar' | 'Belum Bayar';
  checkedIn: boolean;
  qrCodeData: string;
  addons?: string[];
}

export default function CustomerScheduleAndBooking() {
  const [subTab, setSubTab] = useState<'lihat-jadwal' | 'buat-reservasi' | 'tiket-saya'>('lihat-jadwal');
  
  // Selected date for viewing schedule
  const [selectedDate, setSelectedDate] = useState(() => getTodayJakartaISO());
  const [selectedFacilityFilter, setSelectedFacilityFilter] = useState<'all' | 'lapangan-1' | 'lapangan-2' | 'gedung'>('all');

  // Bookings list state
  const [myTickets, setMyTickets] = useState<BookingTicket[]>([
    {
      id: 'TKT-GOR-9021',
      facility: 'GOR Badminton Waru - Lapangan 1 (Karpet Vinyl)',
      date: '2026-09-07',
      timeSlot: '19:00 - 21:00 WIB (2 Jam)',
      teamName: 'PB Rajawali Waru',
      totalCost: 70000,
      paymentStatus: 'Lunas',
      checkedIn: false,
      qrCodeData: 'BUMDES-GOR-9021-LP1',
      addons: ['Penerangan Lampu LED Malam']
    },
    {
      id: 'TKT-GDG-4412',
      facility: 'Gedung Serbaguna Desa Waru',
      date: '2026-09-20',
      timeSlot: '08:00 - 14:00 WIB (Siang)',
      teamName: 'Bpk. Suwarto (Resepsi Khitanan)',
      totalCost: 1500000,
      paymentStatus: 'DP Terbayar',
      checkedIn: false,
      qrCodeData: 'BUMDES-GDG-4412-SERBAGUNA',
      addons: ['Paket Kursi 200 Unit', 'Sound System 5000W']
    }
  ]);

  // Form Booking State
  const [formFacility, setFormFacility] = useState('lapangan-1');
  const [formDate, setFormDate] = useState(() => getTodayJakartaISO());
  const [formTimeSlot, setFormTimeSlot] = useState('19:00 - 21:00');
  const [formTeamName, setFormTeamName] = useState('');
  const [formPhone, setFormPhone] = useState('081234567890');
  const [includeLighting, setIncludeLighting] = useState(true);
  const [includeShuttlecock, setIncludeShuttlecock] = useState(false);
  const [includeSoundSystem, setIncludeSoundSystem] = useState(false);
  const [paymentOption, setPaymentOption] = useState<'full' | 'dp'>('full');

  // Interactive modal for QR Ticket View
  const [activeQrModal, setActiveQrModal] = useState<BookingTicket | null>(null);

  // Schedules schedule matrix
  const schedulesMatrix = [
    {
      time: '08:00 - 10:00',
      lapangan1: { status: 'Tersedia', bookedBy: '-' },
      lapangan2: { status: 'Tersedia', bookedBy: '-' },
      gedung: { status: 'Tersedia', bookedBy: '-' }
    },
    {
      time: '10:00 - 12:00',
      lapangan1: { status: 'Tersedia', bookedBy: '-' },
      lapangan2: { status: 'Terisi', bookedBy: 'Terisi' },
      gedung: { status: 'Tersedia', bookedBy: '-' }
    },
    {
      time: '14:00 - 16:00',
      lapangan1: { status: 'Tersedia', bookedBy: '-' },
      lapangan2: { status: 'Tersedia', bookedBy: '-' },
      gedung: { status: 'Perawatan/Steril', bookedBy: 'Pemeliharaan' }
    },
    {
      time: '16:00 - 18:00',
      lapangan1: { status: 'Terisi', bookedBy: 'Terisi' },
      lapangan2: { status: 'Tersedia', bookedBy: '-' },
      gedung: { status: 'Tersedia', bookedBy: '-' }
    },
    {
      time: '19:00 - 21:00',
      lapangan1: { status: 'Terisi', bookedBy: 'Terisi' },
      lapangan2: { status: 'Terisi', bookedBy: 'Terisi' },
      gedung: { status: 'Tersedia', bookedBy: '-' }
    },
    {
      time: '21:00 - 23:00',
      lapangan1: { status: 'Tersedia', bookedBy: '-' },
      lapangan2: { status: 'Tersedia', bookedBy: '-' },
      gedung: { status: 'Tutup', bookedBy: '-' }
    }
  ];

  // Load real reservations from server on mount
  useEffect(() => {
    const loadServerBookings = async () => {
      try {
        const res = await fetch('/api/reservations');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: BookingTicket[] = data.map((r: any) => ({
              id: r.id,
              facility: r.facility,
              date: r.date,
              timeSlot: `${r.timeSlot} (${r.durationHours || 1} Jam)`,
              teamName: r.customerName,
              totalCost: r.totalAmount || 50000,
              paymentStatus: r.paymentStatus === 'confirmed' ? 'Lunas' : 'Belum Bayar',
              checkedIn: r.checkInStatus === 'checked_in',
              qrCodeData: r.id,
              addons: r.addons || []
            }));
            setMyTickets(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to load server bookings:', err);
      }
    };
    loadServerBookings();
  }, []);

  // Price calculation
  const calculateTotal = () => {
    let base = 35000 * 2; // Default 2 hours badminton @35rb
    if (formFacility === 'gedung') {
      base = 1500000;
    }
    if (includeLighting && formFacility.startsWith('lapangan')) base += 15000;
    if (includeShuttlecock) base += 45000;
    if (includeSoundSystem && formFacility === 'gedung') base += 250000;
    return base;
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPastDateJakarta(formDate)) {
      showToast('Tanggal booking tidak boleh merupakan tanggal yang sudah lampau!', 'warning');
      return;
    }
    if (!formTeamName.trim()) {
      showToast('Harap masukkan nama pemesan atau klub!', 'warning');
      return;
    }

    const facilityName = formFacility === 'lapangan-1' 
      ? 'Lapangan 1 (Karpet Vinyl)' 
      : formFacility === 'lapangan-2'
      ? 'Lapangan 2 (Kayu Parquet)'
      : 'Gedung Serbaguna';

    const addons: string[] = [];
    if (includeLighting && formFacility.startsWith('lapangan')) addons.push('Penerangan Lampu LED');
    if (includeShuttlecock) addons.push('1 Slop Shuttlecock Kok');
    if (includeSoundSystem && formFacility === 'gedung') addons.push('Sound System BUMDes');

    const total = calculateTotal();
    const startTime = formTimeSlot.split(' - ')[0] || '19:00';

    try {
      const res = await fetch('/api/reservations/quick-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facility: facilityName,
          date: formDate,
          timeSlot: startTime,
          durationHours: 2,
          customerName: formTeamName,
          whatsapp: formPhone,
          paymentMethod: 'qris',
          notes: 'Reservasi dari Portal Nasabah / Warga'
        })
      });

      if (res.status === 201) {
        const data = await res.json();
        const newTicket: BookingTicket = {
          id: data.reservation.id,
          facility: data.reservation.facility,
          date: data.reservation.date,
          timeSlot: `${data.reservation.timeSlot} (${data.reservation.durationHours} Jam)`,
          teamName: data.reservation.customerName,
          totalCost: data.reservation.totalAmount,
          paymentStatus: data.reservation.paymentStatus === 'confirmed' ? 'Lunas' : 'Belum Bayar',
          checkedIn: false,
          qrCodeData: data.reservation.id,
          addons
        };
        setMyTickets([newTicket, ...myTickets]);
        setSubTab('tiket-saya');
        showToast('Jadwal & Reservasi berhasil dikunci di server! E-Tiket siap digunakan.', 'success');
      } else if (res.status === 409) {
        const err = await res.json();
        showToast(err.error || 'Slot waktu ini sudah terisi. Silakan pilih waktu lain.', 'error');
      } else {
        const err = await res.json();
        showToast(err.error || 'Gagal memproses reservasi.', 'error');
      }
    } catch (err) {
      showToast('Gagal terhubung ke server reservasi.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSubTab('lihat-jadwal')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              subTab === 'lihat-jadwal'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Melihat Jadwal Fasilitas</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('buat-reservasi')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              subTab === 'buat-reservasi'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Buat Jadwal & Reservasi</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('tiket-saya')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              subTab === 'tiket-saya'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Tiket Reservasi Saya ({myTickets.length})</span>
          </button>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Slot Update
        </span>
      </div>

      {/* VIEW 1: MELIHAT JADWAL */}
      {subTab === 'lihat-jadwal' && (
        <div className="space-y-6">
          
          {/* Real-time Weather Radar Open-Meteo Widget */}
          <CustomerWeatherWidget compact={true} />

          {/* Filter & Date Selection Bar */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Papan Jadwal Penggunaan Fasilitas</h3>
                <p className="text-xs text-slate-500">Cek ketersediaan jam kosong GOR dan Gedung sebelum membuat jadwal.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                min={getTodayJakartaISO()}
                value={selectedDate}
                onChange={(e) => {
                  if (isPastDateJakarta(e.target.value)) {
                    showToast('Tidak dapat memilih tanggal yang sudah lampau.', 'warning');
                    return;
                  }
                  setSelectedDate(e.target.value);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
              />
              <select
                value={selectedFacilityFilter}
                onChange={(e) => setSelectedFacilityFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <option value="all">Semua Fasilitas</option>
                <option value="lapangan-1">Lapangan 1 (Vinyl)</option>
                <option value="lapangan-2">Lapangan 2 (Parquet)</option>
                <option value="gedung">Gedung Serbaguna</option>
              </select>
            </div>
          </div>

          {/* Schedule Matrix Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Jadwal Hari Ini / Tanggal Terpilih: <strong className="text-emerald-600">{selectedDate}</strong>
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Kosong (Bisa Dipesan)
                </span>
                <span className="flex items-center gap-1 text-rose-500">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Terisi
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3.5">Waktu / Sesi</th>
                    {(selectedFacilityFilter === 'all' || selectedFacilityFilter === 'lapangan-1') && (
                      <th className="p-3.5">Lapangan 1 (Vinyl)</th>
                    )}
                    {(selectedFacilityFilter === 'all' || selectedFacilityFilter === 'lapangan-2') && (
                      <th className="p-3.5">Lapangan 2 (Parquet)</th>
                    )}
                    {(selectedFacilityFilter === 'all' || selectedFacilityFilter === 'gedung') && (
                      <th className="p-3.5">Gedung Serbaguna</th>
                    )}
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {schedulesMatrix.map((slot, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{slot.time} WIB</span>
                      </td>

                      {(selectedFacilityFilter === 'all' || selectedFacilityFilter === 'lapangan-1') && (
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] inline-block ${
                            slot.lapangan1.status === 'Tersedia'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          }`}>
                            {slot.lapangan1.status === 'Tersedia' ? 'Tersedia' : slot.lapangan1.bookedBy}
                          </span>
                        </td>
                      )}

                      {(selectedFacilityFilter === 'all' || selectedFacilityFilter === 'lapangan-2') && (
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] inline-block ${
                            slot.lapangan2.status === 'Tersedia'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          }`}>
                            {slot.lapangan2.status === 'Tersedia' ? 'Tersedia' : slot.lapangan2.bookedBy}
                          </span>
                        </td>
                      )}

                      {(selectedFacilityFilter === 'all' || selectedFacilityFilter === 'gedung') && (
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] inline-block ${
                            slot.gedung.status === 'Tersedia'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}>
                            {slot.gedung.status === 'Tersedia' ? 'Tersedia' : slot.gedung.bookedBy}
                          </span>
                        </td>
                      )}

                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setFormTimeSlot(slot.time);
                            setFormDate(selectedDate);
                            setSubTab('buat-reservasi');
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          Booking Jam Ini
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: BUAT JADWAL & RESERVASI */}
      {subTab === 'buat-reservasi' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Formulir Mandiri Pelanggan</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">Buat Jadwal & Reservasi Baru</h3>
              <p className="text-xs text-slate-500">
                Pilih fasilitas, tanggal, dan opsi tambahan. Biaya dihitung transparan secara otomatis.
              </p>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-6">
              
              {/* Facility Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilih Fasilitas BUMDes</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormFacility('lapangan-1')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      formFacility === 'lapangan-1'
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                    }`}
                  >
                    <Radio className="w-4 h-4 text-emerald-600 mb-1" />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Lapangan 1 (Vinyl)</h5>
                    <p className="text-[10px] text-slate-500">Rp 35.000 / Jam</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormFacility('lapangan-2')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      formFacility === 'lapangan-2'
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                    }`}
                  >
                    <Radio className="w-4 h-4 text-teal-600 mb-1" />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Lapangan 2 (Parquet)</h5>
                    <p className="text-[10px] text-slate-500">Rp 35.000 / Jam</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormFacility('gedung')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      formFacility === 'gedung'
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600 mb-1" />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Gedung Serbaguna</h5>
                    <p className="text-[10px] text-slate-500">Mulai Rp 1.500.000 / Acara</p>
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tanggal Booking</label>
                  <input
                    type="date"
                    min={getTodayJakartaISO()}
                    required
                    value={formDate}
                    onChange={(e) => {
                      if (isPastDateJakarta(e.target.value)) {
                        showToast('Tidak dapat memilih tanggal yang sudah lampau.', 'warning');
                        return;
                      }
                      setFormDate(e.target.value);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilihan Slot Waktu</label>
                  <select
                    value={formTimeSlot}
                    onChange={(e) => setFormTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  >
                    <option value="08:00 - 10:00">Pagi: 08:00 - 10:00 WIB</option>
                    <option value="10:00 - 12:00">Siang: 10:00 - 12:00 WIB</option>
                    <option value="14:00 - 16:00">Sore 1: 14:00 - 16:00 WIB</option>
                    <option value="16:00 - 18:00">Sore 2: 16:00 - 18:00 WIB</option>
                    <option value="19:00 - 21:00">Malam 1: 19:00 - 21:00 WIB (Favorit)</option>
                    <option value="21:00 - 23:00">Malam 2: 21:00 - 23:00 WIB</option>
                  </select>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nama Pemesan / Komunitas / Klub</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PB Rajawali Waru"
                    value={formTeamName}
                    onChange={(e) => setFormTeamName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nomor WhatsApp Aktif</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Addons Checkbox */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Layanan Tambahan (Opsional)</label>
                <div className="space-y-2">
                  {formFacility.startsWith('lapangan') && (
                    <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeLighting}
                        onChange={(e) => setIncludeLighting(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <div className="flex-1 text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">Penerangan Lampu Malam LED</span>
                        <span className="text-slate-500 block">Daya lampu stadion fokus standar PBSI (+Rp 15.000)</span>
                      </div>
                    </label>
                  )}

                  <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeShuttlecock}
                      onChange={(e) => setIncludeShuttlecock(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <div className="flex-1 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">1 Slop Shuttlecock Kok BUMDes</span>
                      <span className="text-slate-500 block">Kualitas bulu lancip tahan banting (+Rp 45.000)</span>
                    </div>
                  </label>

                  {formFacility === 'gedung' && (
                    <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeSoundSystem}
                        onChange={(e) => setIncludeSoundSystem(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <div className="flex-1 text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">Sound System & Mic Wireless BUMDes</span>
                        <span className="text-slate-500 block">Paket audio jernih untuk pidato / hajatan (+Rp 250.000)</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Total Summary & Submit */}
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-mono font-bold">
                    Total Estimasi Biaya
                  </span>
                  <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                    Rp {calculateTotal().toLocaleString('id-ID')}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Pembayaran: {paymentOption === 'full' ? 'Lunas Sekarang' : 'DP Minimal 30%'}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={paymentOption}
                    onChange={(e) => setPaymentOption(e.target.value as any)}
                    className="px-3 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-xs font-bold"
                  >
                    <option value="full">Bayar Lunas (QRIS)</option>
                    <option value="dp">Bayar DP Dulu</option>
                  </select>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    Konfirmasi & Pesan Tiket
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* VIEW 3: TIKET RESERVASI SAYA */}
      {subTab === 'tiket-saya' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Tiket Reservasi Aktif & Riwayat Penggunaan</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Tunjukkan QR code ke petugas loket saat datang</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTickets.map((t) => (
              <div 
                key={t.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <span className="font-mono text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                      #{t.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      t.paymentStatus === 'Lunas' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300' 
                        : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                    }`}>
                      {t.paymentStatus}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.facility}</h4>
                    <p className="text-xs text-slate-500">Pemesan: <strong>{t.teamName}</strong></p>
                    <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
                      📅 {t.date} · ⏰ {t.timeSlot}
                    </p>
                    {t.addons && t.addons.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-1">
                        {t.addons.map((add, i) => (
                          <span key={i} className="text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                            +{add}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                  <div className="text-left font-mono">
                    <span className="text-[10px] text-slate-400 block">Total Biaya</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Rp {t.totalCost.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveQrModal(t)}
                      className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-100"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QR Masuk</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => showToast(`Mengunduh E-Tiket PDF #${t.id}`, 'info')}
                      className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-xl hover:bg-slate-200 cursor-pointer"
                      title="Unduh E-Tiket PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Ticket Modal Dialog */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white">E-Tiket Masuk Fasilitas</span>
              <button
                type="button"
                onClick={() => setActiveQrModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
              <div className="bg-white p-2 rounded-lg shadow-xs border border-slate-200">
                <img
                  src={getQrCodeImageUrl(activeQrModal.qrCodeData, 240)}
                  alt="QR Tiket Masuk"
                  className="w-44 h-44 object-contain"
                  crossOrigin="anonymous"
                />
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-semibold mt-2">
                ID: {activeQrModal.id} · {activeQrModal.qrCodeData}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{activeQrModal.teamName}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{activeQrModal.facility}</p>
              <p className="text-xs font-mono text-emerald-600 font-bold mt-1">
                {activeQrModal.date} · {activeQrModal.timeSlot}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(activeQrModal.qrCodeData);
                  showToast('Kode E-Tiket disalin!', 'success');
                }}
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Salin Kode</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = getQrCodeImageUrl(activeQrModal.qrCodeData, 350);
                  link.download = `Tiket-${activeQrModal.id}.png`;
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  showToast('QR Tiket berhasil diunduh ke galeri!', 'success');
                }}
                className="py-2 px-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh QR</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveQrModal(null);
                showToast('Check-in gerbang berhasil diverifikasi!', 'success');
              }}
              className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-xs cursor-pointer shadow-sm transition-colors"
            >
              Konfirmasi Selesai
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
