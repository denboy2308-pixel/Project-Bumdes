import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Search,
  Plus, RefreshCw, User, Phone, DollarSign, Filter, Building,
  Printer, ArrowRight, QrCode, MessageSquare, Check, X, ShieldAlert, Sparkles
} from 'lucide-react';
import { showToast } from '../ToastNotification';
import { getTodayJakartaISO, isPastDateJakarta } from '../../utils/dateUtils';

export interface ReservationItem {
  id: string;
  facility: string;
  facilityKey: 'lapangan1' | 'lapangan2' | 'lapangan3' | 'gedung';
  date: string;
  timeSlot: string;
  durationHours: number;
  slots: string[];
  customerName: string;
  whatsapp: string;
  email?: string;
  participantCount: number;
  purpose: string;
  totalAmount: number;
  paymentMethod: 'qris' | 'bank_transfer' | 'cash';
  paymentStatus: 'pending' | 'confirmed' | 'cancelled';
  checkInStatus?: 'pending' | 'checked_in' | 'completed';
  addons?: string[];
  notes?: string;
  createdAt: string;
}

interface ReservationManagerProps {
  token?: string;
  currentUserRole?: string;
  currentUserName?: string;
}

export default function ReservationManager({
  token,
  currentUserRole = 'karyawan',
  currentUserName = 'Petugas GOR Waru'
}: ReservationManagerProps) {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFacility, setFilterFacility] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayJakartaISO());

  // Quick Walk-In Booking modal
  const [isQuickBookOpen, setIsQuickBookOpen] = useState(false);
  const [quickFacility, setQuickFacility] = useState<string>('Lapangan 1 (Karpet Vinyl)');
  const [quickDate, setQuickDate] = useState<string>(() => getTodayJakartaISO());
  const [quickTime, setQuickTime] = useState<string>('19:00');
  const [quickDuration, setQuickDuration] = useState<number>(1);
  const [quickCustomer, setQuickCustomer] = useState<string>('');
  const [quickPhone, setQuickPhone] = useState<string>('');
  const [quickPaymentMethod, setQuickPaymentMethod] = useState<'cash' | 'qris'>('cash');
  const [quickSubmitting, setQuickSubmitting] = useState(false);

  // Active reservation detail modal / slip
  const [activeSlip, setActiveSlip] = useState<ReservationItem | null>(null);

  // Load reservations from server
  const loadReservations = async () => {
    setLoading(true);
    try {
      const activeToken = token || localStorage.getItem('bumdes_token') || '';
      const headers: Record<string, string> = {};
      if (activeToken) {
        headers['Authorization'] = `Bearer ${activeToken}`;
      }
      const res = await fetch('/api/reservations', { headers });
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      } else {
        console.error('Gagal mengambil data reservasi');
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  // Update Status
  const handleUpdateStatus = async (
    id: string,
    newPaymentStatus?: 'pending' | 'confirmed' | 'cancelled',
    newCheckInStatus?: 'pending' | 'checked_in' | 'completed'
  ) => {
    try {
      const res = await fetch(`/api/reservations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          paymentStatus: newPaymentStatus,
          checkInStatus: newCheckInStatus
        })
      });

      if (res.ok) {
        const data = await res.json();
        setReservations(prev => prev.map(r => r.id === id ? data.reservation : r));
        showToast('Status Berhasil Diperbarui', `Reservasi ${id} kini berstatus ${newPaymentStatus || newCheckInStatus}.`, 'success');
      } else {
        const errData = await res.json();
        showToast('Gagal Memperbarui', errData.error || 'Terjadi kesalahan server.', 'warning');
      }
    } catch (err) {
      showToast('Gagal Terhubung', 'Tidak dapat menghubungi server reservasi.', 'warning');
    }
  };

  // Submit Fast Walk-in Booking
  const handleQuickBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPastDateJakarta(quickDate)) {
      showToast('Tanggal Tidak Valid', 'Tanggal booking tidak boleh lampau. Silakan pilih hari ini atau mendatang.', 'warning');
      return;
    }
    if (!quickCustomer.trim() || !quickPhone.trim()) {
      showToast('Data Belum Lengkap', 'Nama pemesan dan No WhatsApp wajib diisi.', 'warning');
      return;
    }

    setQuickSubmitting(true);
    try {
      const activeToken = token || localStorage.getItem('bumdes_token') || '';
      const res = await fetch('/api/reservations/quick-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({
          facility: quickFacility,
          date: quickDate,
          timeSlot: quickTime,
          durationHours: quickDuration,
          customerName: quickCustomer,
          whatsapp: quickPhone,
          paymentMethod: quickPaymentMethod,
          isWalkIn: true,
          notes: `Didaftarkan langsung oleh petugas kasir: ${currentUserName}`
        })
      });

      if (res.status === 201) {
        const data = await res.json();
        setReservations(prev => [data.reservation, ...prev]);
        setIsQuickBookOpen(false);
        setQuickCustomer('');
        setQuickPhone('');
        showToast('Booking Kilat Berhasil', `Slot terkunci dengan kode ${data.reservation.id}`, 'success');
        setActiveSlip(data.reservation);
      } else if (res.status === 409) {
        const err = await res.json();
        showToast('Slot Bentrok', err.error || 'Slot waktu ini sudah dipesan!', 'warning');
      } else {
        const err = await res.json();
        showToast('Gagal Booking', err.error || 'Terjadi kesalahan sistem.', 'warning');
      }
    } catch (err) {
      showToast('Koneksi Gagal', 'Gagal memproses pemesanan kilat.', 'warning');
    } finally {
      setQuickSubmitting(false);
    }
  };

  // Filtered reservations
  const filteredReservations = reservations.filter(r => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.whatsapp.includes(searchQuery);

    const matchesFacility = filterFacility === 'all' || r.facilityKey === filterFacility;
    const matchesStatus = filterStatus === 'all' || r.paymentStatus === filterStatus;
    const matchesDate = !selectedDate || r.date === selectedDate;

    return matchesSearch && matchesFacility && matchesStatus && matchesDate;
  });

  // Calculate quick metrics for selected date
  const dateReservations = reservations.filter(r => !selectedDate || r.date === selectedDate);
  const totalBookings = dateReservations.length;
  const confirmedBookings = dateReservations.filter(r => r.paymentStatus === 'confirmed').length;
  const pendingBookings = dateReservations.filter(r => r.paymentStatus === 'pending').length;
  const totalIncome = dateReservations
    .filter(r => r.paymentStatus === 'confirmed')
    .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  return (
    <div className="space-y-6">
      {/* HEADER & QUICK ACTIONS */}
      <div className="bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase bg-sky-50 dark:bg-sky-950/60 text-[#1677B8] dark:text-sky-300 border border-sky-200 dark:border-sky-800 mb-2">
              <Building className="w-3.5 h-3.5" />
              Sistem Operasional GOR & Gedung BUMDES
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172B4D] dark:text-slate-100">
              Kelola Jadwal & Reservasi Fasilitas
            </h2>
            <p className="text-xs sm:text-sm text-[#718096] dark:text-slate-400 mt-1">
              Pantau jadwal sewa, validasi pembayaran kasir/QRIS, serta buat booking kilat bagi pengunjung langsung.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsQuickBookOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#20B486] hover:bg-[#19946e] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ Booking Kilat Kasir</span>
            </button>
            <button
              onClick={loadReservations}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#F5F8FA] hover:bg-[#E5EAF0] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#172B4D] dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-[#E5EAF0] dark:border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#1677B8]' : ''}`} />
              <span className="hidden sm:inline">Segarkan</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#E5EAF0] dark:border-slate-800">
          <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-3.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700/60">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#718096] dark:text-slate-400">Total Booking</p>
            <p className="text-xl sm:text-2xl font-black text-[#172B4D] dark:text-slate-100 mt-0.5">{totalBookings}</p>
            <p className="text-[10px] text-[#718096] dark:text-slate-400 mt-1">Pada tanggal dipilih</p>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-3.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700/60">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#20B486] dark:text-emerald-400">Lunas / Terkunci</p>
            <p className="text-xl sm:text-2xl font-black text-[#20B486] dark:text-emerald-400 mt-0.5">{confirmedBookings}</p>
            <p className="text-[10px] text-[#718096] dark:text-slate-400 mt-1">Slot resmi aktif</p>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-3.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700/60">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Menunggu Bayar</p>
            <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{pendingBookings}</p>
            <p className="text-[10px] text-[#718096] dark:text-slate-400 mt-1">Perlu verifikasi loket</p>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-3.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700/60">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#1677B8] dark:text-sky-400">Pendapatan Sewa</p>
            <p className="text-base sm:text-lg font-black text-[#1677B8] dark:text-sky-300 mt-1 truncate">{formatRupiah(totalIncome)}</p>
            <p className="text-[10px] text-[#718096] dark:text-slate-400 mt-0.5">Kas masuk terverifikasi</p>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#718096] dark:text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode booking, nama pemesan, nomor WA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F5F8FA] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1677B8] dark:text-slate-100"
            />
          </div>

          {/* Date Picker Filter */}
          <div className="flex items-center gap-1.5 bg-[#F5F8FA] dark:bg-slate-800 border border-[#E5EAF0] dark:border-slate-700 rounded-xl px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#1677B8] dark:text-sky-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold bg-transparent text-[#172B4D] dark:text-slate-200 outline-none cursor-pointer"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-[10px] text-[#718096] hover:text-red-500 font-bold ml-1"
                title="Tampilkan Semua Tanggal"
              >
                Semua
              </button>
            )}
          </div>
        </div>

        {/* Status & Facility Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterFacility}
            onChange={(e) => setFilterFacility(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F5F8FA] dark:bg-slate-800 text-[#172B4D] dark:text-slate-200 outline-none"
          >
            <option value="all">Semua Fasilitas</option>
            <option value="lapangan1">Lapangan 1 (Vinyl)</option>
            <option value="lapangan2">Lapangan 2 (Parquet)</option>
            <option value="lapangan3">Lapangan 3 (Vinyl)</option>
            <option value="gedung">Gedung Serbaguna</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F5F8FA] dark:bg-slate-800 text-[#172B4D] dark:text-slate-200 outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="confirmed">Lunas / Terkonfirmasi</option>
            <option value="pending">Menunggu Pembayaran</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* RESERVATIONS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F8FAFC] dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-[#718096] dark:text-slate-400 border-b border-[#E5EAF0] dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Kode & Waktu</th>
                <th className="py-3.5 px-4">Fasilitas</th>
                <th className="py-3.5 px-4">Pemesan & Kontak</th>
                <th className="py-3.5 px-4">Biaya & Metode</th>
                <th className="py-3.5 px-4">Status Pembayaran</th>
                <th className="py-3.5 px-4">Check-in</th>
                <th className="py-3.5 px-4 text-right">Tindakan Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF0] dark:divide-slate-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#718096] dark:text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#1677B8]" />
                    Memuat data reservasi...
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#718096] dark:text-slate-400">
                    <p className="font-semibold">Tidak ada data reservasi yang sesuai filter.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterFacility('all');
                        setFilterStatus('all');
                        setSelectedDate('');
                      }}
                      className="mt-2 text-xs text-[#1677B8] dark:text-sky-400 underline font-bold cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </td>
                </tr>
              ) : (
                filteredReservations.map((resv) => {
                  const isConfirmed = resv.paymentStatus === 'confirmed';
                  const isPending = resv.paymentStatus === 'pending';
                  const isCancelled = resv.paymentStatus === 'cancelled';
                  const isCheckedIn = resv.checkInStatus === 'checked_in';

                  const cleanPhone = resv.whatsapp.replace(/\D/g, '').replace(/^0/, '62');
                  const waLink = `https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(resv.customerName)},%20kami%20dari%20Pengelola%20BUMDES%20Waskita%20Wijaya%20terkait%20booking%20${resv.id}%20di%20${encodeURIComponent(resv.facility)}.`;

                  return (
                    <tr
                      key={resv.id}
                      className="hover:bg-[#F5F8FA] dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Kode & Waktu */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-[#1677B8] dark:text-sky-400">
                          <span>{resv.id}</span>
                        </div>
                        <div className="text-xs text-[#718096] dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{resv.date}</span>
                        </div>
                        <div className="text-xs font-semibold text-[#172B4D] dark:text-slate-300 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-[#1677B8]" />
                          <span>{resv.timeSlot} ({resv.durationHours} Jam)</span>
                        </div>
                      </td>

                      {/* Fasilitas */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#172B4D] dark:text-slate-200 block">
                          {resv.facility}
                        </span>
                        <span className="text-[11px] text-[#718096] dark:text-slate-400">
                          {resv.purpose || 'Kegiatan Warga'}
                        </span>
                        {resv.addons && resv.addons.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {resv.addons.map((a, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300"
                              >
                                + {a}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Pemesan & Kontak */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#172B4D] dark:text-slate-100">{resv.customerName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[#718096] dark:text-slate-400 font-mono">
                            {resv.whatsapp}
                          </span>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded"
                          >
                            <MessageSquare className="w-2.5 h-2.5" />
                            WA
                          </a>
                        </div>
                      </td>

                      {/* Biaya & Metode */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#172B4D] dark:text-slate-100">
                          {formatRupiah(resv.totalAmount)}
                        </p>
                        <span className="inline-block text-[11px] uppercase tracking-wider text-[#718096] dark:text-slate-400 mt-0.5">
                          {resv.paymentMethod === 'cash' ? '💵 Tunai Loket' : resv.paymentMethod === 'bank_transfer' ? '🏦 Transfer Bank' : '📱 QRIS BUMDES'}
                        </span>
                      </td>

                      {/* Status Pembayaran */}
                      <td className="py-3.5 px-4">
                        {isConfirmed && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#20B486] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Lunas
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Menunggu Bayar
                          </span>
                        )}
                        {isCancelled && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                            <XCircle className="w-3.5 h-3.5" />
                            Dibatalkan
                          </span>
                        )}
                      </td>

                      {/* Check-in */}
                      <td className="py-3.5 px-4">
                        {isCheckedIn ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400">
                            <Check className="w-3.5 h-3.5" />
                            Hadir
                          </span>
                        ) : isCancelled ? (
                          <span className="text-xs text-slate-400">-</span>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(resv.id, undefined, 'checked_in')}
                            className="text-xs font-bold text-[#1677B8] dark:text-sky-400 hover:underline cursor-pointer"
                          >
                            Check-in
                          </button>
                        )}
                      </td>

                      {/* Tindakan Cepat */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <button
                              onClick={() => handleUpdateStatus(resv.id, 'confirmed')}
                              title="Tandai Pembayaran Lunas"
                              className="px-2.5 py-1.5 bg-[#20B486] hover:bg-[#18966f] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Lunas</span>
                            </button>
                          )}

                          <button
                            onClick={() => setActiveSlip(resv)}
                            title="Lihat Slip & E-Tiket"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {!isCancelled && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Yakin batalkan booking ${resv.id} dan bebaskan slot?`)) {
                                  handleUpdateStatus(resv.id, 'cancelled');
                                }
                              }}
                              title="Batalkan & Lepas Slot"
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: FAST WALK-IN BOOKING (KASIR / WALK-IN GOR) */}
      {isQuickBookOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-[#E5EAF0] dark:border-slate-800 shadow-2xl relative my-8">
            <button
              onClick={() => setIsQuickBookOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-[#20B486] mb-1">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-bold text-[#172B4D] dark:text-slate-100">
                Pemesanan Kilat Kasir / Walk-In
              </h3>
            </div>
            <p className="text-xs text-[#718096] dark:text-slate-400 mb-5">
              Input cepat untuk warga/tamu yang datang langsung ke loket GOR. Slot otomatis terkunci dan status lunas terbit seketika.
            </p>

            <form onSubmit={handleQuickBookSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1">
                  Pilih Fasilitas
                </label>
                <select
                  value={quickFacility}
                  onChange={(e) => setQuickFacility(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#172B4D] dark:text-slate-100 outline-none"
                >
                  <option value="Lapangan 1 (Karpet Vinyl)">Lapangan Badminton 1 (Karpet Vinyl - Rp50.000/jam)</option>
                  <option value="Lapangan 2 (Kayu Parquet)">Lapangan Badminton 2 (Kayu Parquet - Rp50.000/jam)</option>
                  <option value="Lapangan 3 (Karpet Vinyl)">Lapangan Badminton 3 (Karpet Vinyl - Rp50.000/jam)</option>
                  <option value="Gedung Serbaguna">Gedung Serbaguna (Rp100.000/jam)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1">
                    Tanggal Main
                  </label>
                  <input
                    type="date"
                    value={quickDate}
                    onChange={(e) => setQuickDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#172B4D] dark:text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1">
                    Jam Mulai
                  </label>
                  <select
                    value={quickTime}
                    onChange={(e) => setQuickTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#172B4D] dark:text-slate-100 outline-none"
                  >
                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map(t => (
                      <option key={t} value={t}>{t} WIB</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1">
                  Durasi Sewa
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(dur => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setQuickDuration(dur)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        quickDuration === dur
                          ? 'bg-[#1677B8] text-white border-[#1677B8]'
                          : 'bg-[#F8FAFC] dark:bg-slate-800 text-[#718096] border-[#E5EAF0] dark:border-slate-700'
                      }`}
                    >
                      {dur} Jam
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1">
                    Nama Pemesan / Klub *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PB Garuda"
                    value={quickCustomer}
                    onChange={(e) => setQuickCustomer(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#172B4D] dark:text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1">
                    No. WhatsApp *
                  </label>
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#172B4D] dark:text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1">
                  Metode Pembayaran Kasir
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold ${
                    quickPaymentMethod === 'cash'
                      ? 'border-[#20B486] bg-emerald-50 dark:bg-emerald-950/40 text-[#20B486]'
                      : 'border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#718096]'
                  }`}>
                    <input
                      type="radio"
                      name="quickPayment"
                      value="cash"
                      checked={quickPaymentMethod === 'cash'}
                      onChange={() => setQuickPaymentMethod('cash')}
                      className="hidden"
                    />
                    <span>💵 Tunai Loket (Lunas)</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold ${
                    quickPaymentMethod === 'qris'
                      ? 'border-[#1677B8] bg-sky-50 dark:bg-sky-950/40 text-[#1677B8]'
                      : 'border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#718096]'
                  }`}>
                    <input
                      type="radio"
                      name="quickPayment"
                      value="qris"
                      checked={quickPaymentMethod === 'qris'}
                      onChange={() => setQuickPaymentMethod('qris')}
                      className="hidden"
                    />
                    <span>📱 QRIS Kasir (Lunas)</span>
                  </label>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-[#F5F8FA] dark:bg-slate-800/80 p-3 rounded-xl border border-[#E5EAF0] dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-[#718096] dark:text-slate-400">Total Biaya Sewa:</span>
                <span className="text-base font-black text-[#1677B8] dark:text-sky-300">
                  {formatRupiah((quickFacility.includes('Gedung') ? 100000 : 50000) * quickDuration)}
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickBookOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-[#E5EAF0] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#718096] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={quickSubmitting}
                  className="flex-1 py-2.5 bg-[#20B486] hover:bg-[#18966f] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  {quickSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Konfirmasi & Cetak Tiket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL SLIP / E-TIKET */}
      {activeSlip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-[#E5EAF0] dark:border-slate-800 shadow-2xl relative my-8 text-center">
            <button
              onClick={() => setActiveSlip(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#20B486] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-[#172B4D] dark:text-slate-100">
              Slip Reservasi Resmi BUMDES
            </h3>
            <p className="text-xs font-mono text-[#1677B8] dark:text-sky-400 font-bold mt-0.5">
              {activeSlip.id}
            </p>

            {/* Ticket Card Details */}
            <div className="bg-[#F8FAFC] dark:bg-slate-800/80 p-4 rounded-xl border border-[#E5EAF0] dark:border-slate-700 text-left space-y-2 mt-4 text-xs">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-[#718096] dark:text-slate-400">Fasilitas:</span>
                <span className="font-bold text-[#172B4D] dark:text-slate-100">{activeSlip.facility}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-[#718096] dark:text-slate-400">Tanggal & Jam:</span>
                <span className="font-bold text-[#172B4D] dark:text-slate-100">{activeSlip.date} • {activeSlip.timeSlot}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-[#718096] dark:text-slate-400">Pemesan:</span>
                <span className="font-bold text-[#172B4D] dark:text-slate-100">{activeSlip.customerName} ({activeSlip.whatsapp})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-[#718096] dark:text-slate-400">Total Tarif:</span>
                <span className="font-bold text-[#20B486]">{formatRupiah(activeSlip.totalAmount)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#718096] dark:text-slate-400">Status Pembayaran:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  {activeSlip.paymentStatus === 'confirmed' ? 'LUNAS TERVERIFIKASI' : 'MENUNGGU BAYAR'}
                </span>
              </div>
            </div>

            <div className="mt-5 flex gap-2.5">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-[#1677B8] hover:bg-[#125f94] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Bukti</span>
              </button>
              <button
                onClick={() => {
                  const cleanPhone = activeSlip.whatsapp.replace(/\D/g, '').replace(/^0/, '62');
                  const text = `Halo ${activeSlip.customerName}, ini bukti reservasi fasilitas BUMDES Waskita Wijaya:\n\nKode: ${activeSlip.id}\nFasilitas: ${activeSlip.facility}\nJadwal: ${activeSlip.date} pukul ${activeSlip.timeSlot}\nStatus: ${activeSlip.paymentStatus === 'confirmed' ? 'LUNAS' : 'MENUNGGU BAYAR'}\nTotal: ${formatRupiah(activeSlip.totalAmount)}`;
                  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Kirim WA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
