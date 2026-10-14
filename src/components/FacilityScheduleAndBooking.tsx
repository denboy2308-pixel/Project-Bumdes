import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Building,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Phone,
  HelpCircle,
  Award,
  Sparkles,
  Search,
  X,
  Printer,
  QrCode,
  MessageSquare,
  Check,
  RefreshCw
} from 'lucide-react';
import { PageType } from '../types';
import {
  BookingStep,
  PaymentMethod,
  PromoVoucher,
  ALL_HOURS,
  AVAILABLE_PROMOS,
  ADDON_OPTIONS,
  MASTER_SCHEDULE_DATA
} from './booking/bookingTypes';
import BookingScheduleTable from './booking/BookingScheduleTable';
import BookingPromoFeature from './booking/BookingPromoFeature';
import BookingFormDataStep from './booking/BookingFormDataStep';
import BookingPaymentStep from './booking/BookingPaymentStep';
import BookingETicketStep from './booking/BookingETicketStep';
import { getTodayJakartaISO, isPastDateJakarta } from '../utils/dateUtils';

interface FacilityScheduleAndBookingProps {
  onNavigate?: (page: PageType) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function FacilityScheduleAndBooking({
  onNavigate,
  onShowToast,
}: FacilityScheduleAndBookingProps) {
  // Facility and Date Selection
  const [selectedFacility, setSelectedFacility] = useState<string>('Gedung Serbaguna');
  const [bookingDate, setBookingDate] = useState<string>(() => getTodayJakartaISO());

  // Step state: 'select-time' -> 'input-data' -> 'payment' -> 'ticket'
  const [activeStep, setActiveStep] = useState<BookingStep>('select-time');

  // Time slot state
  const [selectedSlot, setSelectedSlot] = useState<string | null>('19:00');
  const [durationHours, setDurationHours] = useState<number>(1);

  // Live schedule data from server
  const [scheduleData, setScheduleData] = useState(MASTER_SCHEDULE_DATA);
  const [loadingSchedule, setLoadingSchedule] = useState<boolean>(false);

  // Customer Form Data (Step 2)
  const [customerName, setCustomerName] = useState<string>('Dimas Pratama');
  const [participantCount, setParticipantCount] = useState<number>(4);
  const [purpose, setPurpose] = useState<string>('Latihan komunitas');
  const [whatsapp, setWhatsapp] = useState<string>('081234567890');
  const [email, setEmail] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Form Validation Errors
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});

  // Promo Code State
  const [appliedPromo, setAppliedPromo] = useState<PromoVoucher | null>(() => {
    // Default voucher applied: BUMDES10
    return AVAILABLE_PROMOS.find((p) => p.code === 'BUMDES10') || null;
  });

  // Payment Method Selection (Step 3)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('qris');

  // Dynamic Booking Code from Server
  const [bookingCode, setBookingCode] = useState<string>(() => `BW-${getTodayJakartaISO().replace(/-/g, '')}-8921`);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState<boolean>(false);

  // Fast Express Booking Modal state (Pemesanan Kilat 1-Menit)
  const [isExpressBookingOpen, setIsExpressBookingOpen] = useState<boolean>(false);
  const [expressFacility, setExpressFacility] = useState<string>('Lapangan Badminton 1');
  const [expressTime, setExpressTime] = useState<string>('19:00');
  const [expressCustomer, setExpressCustomer] = useState<string>('');
  const [expressPhone, setExpressPhone] = useState<string>('');
  const [expressSubmitting, setExpressSubmitting] = useState<boolean>(false);

  // Fast Check Ticket / Status Modal state
  const [isCheckTicketOpen, setIsCheckTicketOpen] = useState<boolean>(false);
  const [lookupQuery, setLookupQuery] = useState<string>('');
  const [lookupResults, setLookupResults] = useState<any[] | null>(null);
  const [isLookingUp, setIsLookingUp] = useState<boolean>(false);

  // Fetch Live Schedule for Selected Date
  const fetchLiveSchedule = async (date: string) => {
    setLoadingSchedule(true);
    try {
      const adminToken = localStorage.getItem('bumdes_token') || '';
      const headers: Record<string, string> = {};
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
      const res = await fetch(`/api/reservations/schedule?date=${encodeURIComponent(date)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.schedule)) {
          setScheduleData(data.schedule);
        }
      }
    } catch (err) {
      console.error('Failed to fetch schedule from server:', err);
    } finally {
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    fetchLiveSchedule(bookingDate);
  }, [bookingDate]);

  // Base price per hour: Rp50.000 for Lapangan, Rp100.000 for Gedung Serbaguna
  const basePricePerHour = useMemo(() => {
    if (selectedFacility.toLowerCase().includes('gedung')) {
      return 100000;
    }
    return 50000;
  }, [selectedFacility]);

  const subtotalBase = basePricePerHour * durationHours;

  // Add-ons total
  const addonsTotal = useMemo(() => {
    return selectedAddons.reduce((acc, addonId) => {
      const found = ADDON_OPTIONS.find((a) => a.id === addonId);
      return acc + (found ? found.price : 0);
    }, 0);
  }, [selectedAddons]);

  // Member discount (-Rp5.000 per hour)
  const memberDiscount = selectedSlot ? 5000 * durationHours : 0;

  // Voucher discount calculation
  const voucherDiscount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discountType === 'percentage') {
      return Math.round((subtotalBase + addonsTotal) * (appliedPromo.discountValue / 100));
    }
    return appliedPromo.discountValue;
  }, [appliedPromo, subtotalBase, addonsTotal]);

  // Total amount
  const totalAmount = Math.max(0, subtotalBase + addonsTotal - memberDiscount - voucherDiscount);

  // Selected addon names
  const selectedAddonNames = useMemo(() => {
    return selectedAddons
      .map((id) => ADDON_OPTIONS.find((a) => a.id === id)?.name)
      .filter(Boolean) as string[];
  }, [selectedAddons]);

  // Format currency helper
  const formatRupiah = (val: number) => {
    return `Rp${val.toLocaleString('id-ID')}`;
  };

  // Toast notification trigger
  const triggerToast = (title: string, msg: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    if (onShowToast) {
      onShowToast(title, msg, type);
    }
  };

  // Toggle addon selection
  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons((prev) => {
      if (prev.includes(addonId)) {
        return prev.filter((id) => id !== addonId);
      }
      return [...prev, addonId];
    });
  };

  // Clear single form field error
  const handleClearFieldError = (field: string) => {
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Quick select from Schedule Table
  const handleTableSlotSelect = (facilityName: string, time: string, status: string) => {
    if (status === 'Booked') {
      triggerToast('Slot Terisi', `Slot ${time} pada ${facilityName} sudah terisi.`, 'warning');
      return;
    }
    setSelectedFacility(facilityName);
    setSelectedSlot(time);
    setActiveStep('select-time');
    triggerToast('Slot Dipilih', `Memilih ${facilityName} jam ${time}. Silakan lanjutkan di bawah.`, 'info');

    const el = document.getElementById('section-booking-baru');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Change selected date and sync schedule
  const handleDateChange = (newDate: string) => {
    if (isPastDateJakarta(newDate)) {
      triggerToast('Tanggal Tidak Valid', 'Tidak dapat memilih tanggal yang sudah lampau. Silakan pilih hari ini atau tanggal mendatang.', 'warning');
      return;
    }
    setBookingDate(newDate);
    fetchLiveSchedule(newDate);
    triggerToast('Tanggal Diubah', `Menampilkan ketersediaan fasilitas untuk tanggal ${newDate}.`, 'info');
  };

  // Proceed from Step 1 to Step 2
  const handleProceedFromTimeSelection = () => {
    if (!selectedSlot) {
      triggerToast('Pilih Jam Booking', 'Silakan pilih jam terlebih dahulu.', 'warning');
      return;
    }
    setActiveStep('input-data');
    const el = document.getElementById('section-booking-baru');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Step 2 Form Validation
  const handleValidateCustomerData = () => {
    const errors: Record<string, string | undefined> = {};

    if (!customerName.trim()) {
      errors.customerName = 'Nama Customer wajib diisi.';
    }

    if (isPastDateJakarta(bookingDate)) {
      errors.bookingDate = 'Tanggal booking tidak boleh merupakan tanggal yang sudah lampau. Silakan pilih tanggal hari ini atau mendatang.';
    }

    if (!participantCount || participantCount < 1) {
      errors.participantCount = 'Jumlah Peserta wajib minimal 1 orang.';
    }

    if (!purpose.trim()) {
      errors.purpose = 'Keperluan booking wajib diisi.';
    }

    const cleanPhone = whatsapp.replace(/\D/g, '');
    if (!cleanPhone) {
      errors.whatsapp = 'Nomor WhatsApp wajib diisi.';
    } else if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      errors.whatsapp = 'Nomor WhatsApp harus 10–15 digit angka (misal: 081234567890).';
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Format email tidak valid (contoh: nama@domain.com).';
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      triggerToast('Form Belum Lengkap', 'Mohon lengkapi kolom yang bertanda merah.', 'error');
      return;
    }

    setActiveStep('payment');
    const el = document.getElementById('section-booking-baru');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Confirm Reservation and Lock Slot in Server Database
  const handleConfirmReservation = async () => {
    setIsSubmittingBooking(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          facility: selectedFacility,
          date: bookingDate,
          timeSlot: selectedSlot,
          durationHours,
          customerName,
          whatsapp,
          email,
          participantCount,
          purpose,
          paymentMethod: selectedPaymentMethod,
          totalAmount,
          addons: selectedAddonNames
        })
      });

      if (res.status === 201) {
        const data = await res.json();
        setBookingCode(data.reservation.id);
        setActiveStep('ticket');
        triggerToast('Reservasi Berhasil!', `Booking ${data.reservation.id} berhasil dikunci dan dicatat di server.`, 'success');
        fetchLiveSchedule(bookingDate);
        const el = document.getElementById('section-booking-baru');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (res.status === 409) {
        const errData = await res.json();
        triggerToast('Slot Tidak Tersedia', errData.error || 'Slot waktu ini baru saja dipesan pengguna lain.', 'error');
        fetchLiveSchedule(bookingDate);
      } else {
        const errData = await res.json();
        triggerToast('Gagal Memproses', errData.error || 'Terjadi kesalahan sistem.', 'error');
      }
    } catch (err) {
      triggerToast('Koneksi Gagal', 'Gagal menghubungi server reservasi.', 'error');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Handle Express Fast Booking (1-Click)
  const handleExpressBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPastDateJakarta(bookingDate)) {
      triggerToast('Tanggal Tidak Valid', 'Tanggal booking tidak boleh lampau. Silakan pilih tanggal hari ini atau mendatang.', 'warning');
      return;
    }
    if (!expressCustomer.trim() || !expressPhone.trim()) {
      triggerToast('Data Belum Lengkap', 'Nama dan No. WhatsApp wajib diisi.', 'warning');
      return;
    }

    setExpressSubmitting(true);
    try {
      const res = await fetch('/api/reservations/quick-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facility: expressFacility,
          date: bookingDate,
          timeSlot: expressTime,
          durationHours: 1,
          customerName: expressCustomer,
          whatsapp: expressPhone,
          paymentMethod: 'qris',
          notes: 'Booking Kilat Online Cepat'
        })
      });

      if (res.status === 201) {
        const data = await res.json();
        setBookingCode(data.reservation.id);
        setSelectedFacility(data.reservation.facility);
        setSelectedSlot(data.reservation.timeSlot);
        setCustomerName(data.reservation.customerName);
        setWhatsapp(data.reservation.whatsapp);
        setSelectedPaymentMethod('qris');
        setIsExpressBookingOpen(false);
        setActiveStep('ticket');
        triggerToast('Booking Kilat Berhasil!', `Slot terkunci resmi dengan kode ${data.reservation.id}`, 'success');
        fetchLiveSchedule(bookingDate);
        const el = document.getElementById('section-booking-baru');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (res.status === 409) {
        const err = await res.json();
        triggerToast('Slot Bentrok', err.error || 'Slot jam ini sudah terisi.', 'error');
        fetchLiveSchedule(bookingDate);
      } else {
        const err = await res.json();
        triggerToast('Gagal Booking', err.error || 'Gagal memproses pemesanan.', 'error');
      }
    } catch (err) {
      triggerToast('Koneksi Gagal', 'Tidak dapat terhubung ke server.', 'error');
    } finally {
      setExpressSubmitting(false);
    }
  };

  // Handle Fast Ticket Lookup
  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) {
      triggerToast('Masukkan Pencarian', 'Ketik kode booking (mis. BW-20260906-8921) atau no. WhatsApp.', 'warning');
      return;
    }

    setIsLookingUp(true);
    try {
      const query = lookupQuery.trim();
      const isCode = query.toUpperCase().startsWith('BW-');
      const endpoint = isCode
        ? `/api/reservations?lookupCode=${encodeURIComponent(query)}`
        : `/api/reservations?whatsapp=${encodeURIComponent(query)}`;

      const res = await fetch(endpoint);
      if (res.ok) {
        const results = await res.json();
        setLookupResults(results);
        if (results.length === 0) {
          triggerToast('Tidak Ditemukan', 'Tidak ada data reservasi dengan kata kunci tersebut.', 'info');
        }
      } else {
        triggerToast('Gagal Mencari', 'Terjadi kesalahan pencarian.', 'error');
      }
    } catch (err) {
      triggerToast('Gagal Terhubung', 'Tidak dapat menghubungi server.', 'error');
    } finally {
      setIsLookingUp(false);
    }
  };

  // Reset Booking flow
  const handleResetBooking = () => {
    setActiveStep('select-time');
    setSelectedSlot('19:00');
    setDurationHours(1);
    setSelectedAddons([]);
    const el = document.getElementById('section-booking-baru');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F5F8FA] dark:bg-slate-950 min-h-screen pb-24 text-[#172B4D] dark:text-slate-100 transition-colors duration-200">
      {/* ========================================================================= */}
      {/* SECTION 1: JADWAL FASILITAS (08:00 - 21:00)                               */}
      {/* ========================================================================= */}
      <BookingScheduleTable
        selectedSlot={selectedSlot}
        onSelectSlot={handleTableSlotSelect}
        scheduleData={scheduleData}
        selectedDate={bookingDate}
        onDateChange={handleDateChange}
        onOpenQuickBooking={() => setIsExpressBookingOpen(true)}
        onOpenCheckTicket={() => setIsCheckTicketOpen(true)}
      />

      {/* ========================================================================= */}
      {/* SECTION 2: BOOKING BARU (Dashboard Reservasi Modern)                      */}
      {/* ========================================================================= */}
      <section id="section-booking-baru" className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E5EAF0] dark:border-slate-800">
            <div>
              <h2 className="text-[26px] sm:text-[32px] font-bold text-[#172B4D] dark:text-slate-100 tracking-tight leading-tight">
                Booking Baru
              </h2>
              <p className="text-xs sm:text-base text-[#718096] dark:text-slate-400 font-normal mt-1">
                Reservasi fasilitas BUMDES secara cepat, transparan, dan terverifikasi digital.
              </p>
            </div>

            {/* BADGE NOMOR BOOKING */}
            <div className="self-start sm:self-auto">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#EBF5FB] dark:bg-sky-950/70 text-[#1677B8] dark:text-sky-300 border border-[#BFDBFE] dark:border-sky-800 shadow-xs">
                <Tag className="w-3.5 h-3.5" />
                <span className="font-mono">{bookingCode}</span>
              </span>
            </div>
          </div>

          {/* FACILITY SELECTOR BAR */}
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-[#E5EAF0] dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#718096] dark:text-slate-400">
              <Building className="w-4 h-4 text-[#1677B8] dark:text-sky-400" />
              <span>Pilih Fasilitas:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Gedung Serbaguna', price: 'Rp100.000/jam' },
                { name: 'Lapangan Badminton 1', price: 'Rp50.000/jam' },
                { name: 'Lapangan Badminton 2', price: 'Rp50.000/jam' },
                { name: 'Lapangan Badminton 3', price: 'Rp50.000/jam' },
              ].map((fac) => {
                const isActive = selectedFacility === fac.name;
                return (
                  <button
                    key={fac.name}
                    type="button"
                    onClick={() => {
                      setSelectedFacility(fac.name);
                      triggerToast('Fasilitas Dipilih', `Memilih ${fac.name}`, 'info');
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#1677B8] dark:bg-sky-600 text-white shadow-xs font-bold'
                        : 'bg-[#F5F8FA] dark:bg-slate-800 text-[#4B5563] dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 border border-[#E2E7EC] dark:border-slate-700'
                    }`}
                  >
                    <span>{fac.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/60 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {fac.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP PROGRESS INDICATOR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveStep('select-time')}
              className={`p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all ${
                activeStep === 'select-time'
                  ? 'bg-white dark:bg-slate-900 border-[#1677B8] dark:border-sky-500 text-[#1677B8] dark:text-sky-400 shadow-xs ring-1 ring-blue-100 dark:ring-sky-900'
                  : 'bg-white/70 dark:bg-slate-900/60 border-[#E5EAF0] dark:border-slate-800 text-[#718096] dark:text-slate-400'
              }`}
            >
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase">Tahap 1</span>
              <span>1. Pilih Jam</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (selectedSlot) setActiveStep('input-data');
              }}
              className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                activeStep === 'input-data'
                  ? 'bg-white dark:bg-slate-900 border-[#1677B8] dark:border-sky-500 text-[#1677B8] dark:text-sky-400 shadow-xs ring-1 ring-blue-100 dark:ring-sky-900'
                  : 'bg-white/70 dark:bg-slate-900/60 border-[#E5EAF0] dark:border-slate-800 text-[#718096] dark:text-slate-400'
              } ${selectedSlot ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
            >
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase">Tahap 2</span>
              <span>2. Form Data Booking</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (selectedSlot && customerName) setActiveStep('payment');
              }}
              className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                activeStep === 'payment'
                  ? 'bg-white dark:bg-slate-900 border-[#1677B8] dark:border-sky-500 text-[#1677B8] dark:text-sky-400 shadow-xs ring-1 ring-blue-100 dark:ring-sky-900'
                  : 'bg-white/70 dark:bg-slate-900/60 border-[#E5EAF0] dark:border-slate-800 text-[#718096] dark:text-slate-400'
              } ${customerName ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
            >
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase">Tahap 3</span>
              <span>3. Konfirmasi & Bayar</span>
            </button>

            <div
              className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                activeStep === 'ticket'
                  ? 'bg-white dark:bg-slate-900 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'bg-white/70 dark:bg-slate-900/60 border-[#E5EAF0] dark:border-slate-800 text-[#718096] dark:text-slate-400 opacity-60'
              }`}
            >
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase">Tahap 4</span>
              <span>4. E-Tiket Resmi</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 1: PEMILIHAN JAM + RINGKASAN HARGA + PROMO                           */}
          {/* ========================================================================= */}
          {activeStep === 'select-time' && (
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
              {/* KOLOM KIRI (70% width) */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[12px] border border-[#E5EAF0] dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6 transition-colors duration-200">
                {/* Header Card */}
                <div>
                  <h3 className="text-xl font-bold text-[#172B4D] dark:text-slate-100">
                    Pilih Jam Reservasi
                  </h3>
                  <p className="text-xs text-[#718096] dark:text-slate-400 font-medium mt-0.5">
                    Pilih jam mulai. Slot bertanda merah BOOKED tidak dapat dipilih.
                  </p>
                </div>

                {/* Selected Date & Facility Info */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#F5F8FA] dark:bg-slate-800/70 p-3.5 rounded-xl border border-[#E5EAF0] dark:border-slate-700">
                  <div className="flex items-center gap-2 font-semibold text-[#172B4D] dark:text-slate-200">
                    <Calendar className="w-4 h-4 text-[#1677B8] dark:text-sky-400" />
                    <span>Tanggal: {bookingDate}</span>
                  </div>
                  <div className="text-[#1677B8] dark:text-sky-400 font-bold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>{selectedFacility}</span>
                  </div>
                </div>

                {/* Grid Pilihan Jam (08:00 to 21:00) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {ALL_HOURS.map((hour) => {
                    const normalizedKey = selectedFacility.toLowerCase().includes('lapangan 1') || selectedFacility.toLowerCase().includes('lapangan-1')
                      ? 'lapangan1'
                      : selectedFacility.toLowerCase().includes('lapangan 2') || selectedFacility.toLowerCase().includes('lapangan-2')
                      ? 'lapangan2'
                      : selectedFacility.toLowerCase().includes('lapangan 3') || selectedFacility.toLowerCase().includes('lapangan-3')
                      ? 'lapangan3'
                      : 'gedung';
                    const scheduleRow = scheduleData.find((r) => r.time === hour);
                    const isBooked = scheduleRow ? (scheduleRow as any)[normalizedKey]?.status === 'Booked' : false;
                    const isSelected = selectedSlot === hour;

                    if (isBooked) {
                      return (
                        <div
                          key={hour}
                          className="h-[58px] rounded-xl bg-[#FEF2F2] dark:bg-rose-950/40 border border-[#FECACA] dark:border-rose-900/70 flex flex-col items-center justify-center cursor-not-allowed select-none opacity-85"
                          title="Slot ini sudah terisi"
                        >
                          <span className="text-sm font-bold text-[#E05A5A] dark:text-rose-400">{hour}</span>
                          <span className="text-[9px] sm:text-[10px] font-semibold text-[#E05A5A] dark:text-rose-400 tracking-wider uppercase">
                            BOOKED
                          </span>
                        </div>
                      );
                    }

                    if (isSelected) {
                      return (
                        <button
                          key={hour}
                          type="button"
                          onClick={() => setSelectedSlot(hour)}
                          className="h-[58px] rounded-xl bg-[#EBF5FB] dark:bg-sky-950/60 border-2 border-[#2196F3] dark:border-sky-500 shadow-sm flex flex-col items-center justify-center cursor-pointer ring-2 ring-blue-200/50 dark:ring-sky-900/50 transition-all"
                        >
                          <span className="text-sm font-bold text-[#1677B8] dark:text-sky-300">{hour}</span>
                          <span className="text-[9px] sm:text-[10px] font-bold text-[#1677B8] dark:text-sky-300 tracking-wider uppercase">
                            DIPILIH
                          </span>
                        </button>
                      );
                    }

                    return (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => {
                          setSelectedSlot(hour);
                          triggerToast('Jam Dipilih', `Slot ${hour} berhasil dipilih.`, 'info');
                        }}
                        className="h-[58px] rounded-xl bg-white dark:bg-slate-800 border border-[#E1E7ED] dark:border-slate-700 hover:border-[#2196F3] dark:hover:border-sky-400 hover:bg-slate-50 dark:hover:bg-slate-750 flex flex-col items-center justify-center transition-all cursor-pointer"
                      >
                        <span className="text-sm font-bold text-[#172B4D] dark:text-slate-100">{hour}</span>
                        <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                          TERSEDIA
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Durasi Pilihan Cepat */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-blue-50/60 dark:bg-slate-800/70 rounded-xl border border-blue-100 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-[#1677B8] dark:text-sky-400" />
                    <span>Pilihan Durasi Main:</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((hr) => (
                      <button
                        key={hr}
                        type="button"
                        onClick={() => setDurationHours(hr)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          durationHours === hr
                            ? 'bg-[#1677B8] dark:bg-sky-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {hr} Jam
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-[#20B486] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Fasilitas dilengkapi jaring standar BWF, lampu sorot berkualitas, serta ruang ganti & musala bersih.
                  </span>
                </div>

                {/* Footer Card / Navigasi */}
                <div className="pt-4 border-t border-[#E5EAF0] dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('section-jadwal-fasilitas');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-[#E2E7EC] dark:border-slate-700 text-[#4B5563] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 font-medium rounded-[7px] text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>KEMBALI KE JADWAL</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedFromTimeSelection}
                    className="px-5 py-2.5 bg-[#1677B8] hover:bg-[#125f94] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold rounded-[7px] text-xs sm:text-sm shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>LANJUTKAN</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* KOLOM KANAN (30% width, sticky) */}
              <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-4">
                {/* Ringkasan Harga Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[12px] border border-[#E5EAF0] dark:border-slate-800 shadow-sm p-5 space-y-4 transition-colors duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0] dark:border-slate-800">
                    <h4 className="text-base font-bold text-[#172B4D] dark:text-slate-100">
                      Ringkasan Harga
                    </h4>
                    <span className="text-[11px] font-bold text-[#1677B8] dark:text-sky-400 bg-blue-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-sky-800">
                      {selectedSlot ? `${selectedSlot} WIB` : 'Belum Dipilih'}
                    </span>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between items-center text-[#718096] dark:text-slate-400">
                      <span>Harga dasar</span>
                      <span className="font-semibold text-[#172B4D] dark:text-slate-200">
                        {formatRupiah(basePricePerHour)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[#718096] dark:text-slate-400">
                      <span>Durasi sewa</span>
                      <span className="font-semibold text-[#172B4D] dark:text-slate-200">
                        {durationHours} jam
                      </span>
                    </div>

                    <div className="border-t border-dashed border-[#E5EAF0] dark:border-slate-800 my-2"></div>

                    <div className="flex justify-between items-center text-[#172B4D] dark:text-slate-200 font-medium">
                      <span>Subtotal</span>
                      <span className="font-bold">{formatRupiah(subtotalBase)}</span>
                    </div>

                    <div className="flex justify-between items-center text-[#20B486] dark:text-emerald-400">
                      <span>Diskon member</span>
                      <span className="font-semibold">-{formatRupiah(memberDiscount)}</span>
                    </div>

                    <div className="flex justify-between items-center text-[#20B486] dark:text-emerald-400">
                      <span>Voucher</span>
                      <span className="font-semibold">
                        {voucherDiscount > 0 ? `-${formatRupiah(voucherDiscount)}` : '-Rp0'}
                      </span>
                    </div>

                    <div className="border-t border-[#E5EAF0] dark:border-slate-800 pt-3 mt-3"></div>

                    {/* TOTAL (Menonjol 20px, font-bold biru) */}
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-[#172B4D] dark:text-slate-100 uppercase tracking-wider">
                        TOTAL
                      </span>
                      <span className="text-lg sm:text-[20px] font-bold text-[#1677B8] dark:text-sky-400">
                        {formatRupiah(totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* PROMO CODE FEATURE */}
                  <BookingPromoFeature
                    appliedPromo={appliedPromo}
                    onApplyPromo={(voucher) => setAppliedPromo(voucher)}
                    onRemovePromo={() => setAppliedPromo(null)}
                    subtotal={subtotalBase}
                    durationHours={durationHours}
                    triggerToast={triggerToast}
                  />
                </div>

                {/* Mobile Floating Bottom Bar for Fast Action */}
                <div className="block lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-[#E5EAF0] dark:border-slate-800 p-3 px-4 shadow-lg">
                  <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Total Biaya</span>
                      <span className="text-base font-bold text-[#1677B8] dark:text-sky-400">
                        {formatRupiah(totalAmount)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleProceedFromTimeSelection}
                      className="px-5 py-2.5 bg-[#1677B8] dark:bg-sky-600 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>Lanjutkan</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Help Card */}
                <div className="bg-[#F8FAFC] dark:bg-slate-800/60 border border-[#E5EAF0] dark:border-slate-800 rounded-xl p-4 text-xs text-[#718096] dark:text-slate-400 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#172B4D] dark:text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-[#20B486] dark:text-emerald-400" />
                    <span>Garansi Fasilitas BUMDES</span>
                  </div>
                  <p className="leading-relaxed">
                    Setiap reservasi tercatat otomatis di sistem BUMDES Waskita Wijaya. Lampu sorot, kebersihan lapangan, dan kelengkapan jaring diperiksa rutin sebelum sesi dimulai.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: MASUKKAN DATA BOOKING                                             */}
          {/* ========================================================================= */}
          {activeStep === 'input-data' && (
            <BookingFormDataStep
              customerName={customerName}
              setCustomerName={setCustomerName}
              participantCount={participantCount}
              setParticipantCount={setParticipantCount}
              purpose={purpose}
              setPurpose={setPurpose}
              whatsapp={whatsapp}
              setWhatsapp={setWhatsapp}
              email={email}
              setEmail={setEmail}
              selectedAddons={selectedAddons}
              onToggleAddon={handleToggleAddon}
              durationHours={durationHours}
              setDurationHours={setDurationHours}
              bookingDate={bookingDate}
              setBookingDate={setBookingDate}
              selectedFacility={selectedFacility}
              selectedSlot={selectedSlot}
              basePrice={basePricePerHour}
              memberDiscount={memberDiscount}
              voucherDiscount={voucherDiscount}
              addonsTotal={addonsTotal}
              totalAmount={totalAmount}
              appliedPromoCode={appliedPromo?.code}
              formErrors={formErrors}
              onClearFieldError={handleClearFieldError}
              onBack={() => setActiveStep('select-time')}
              onNext={handleValidateCustomerData}
              formatRupiah={formatRupiah}
            />
          )}

          {/* ========================================================================= */}
          {/* STEP 3: KONFIRMASI & BAYAR                                                */}
          {/* ========================================================================= */}
          {activeStep === 'payment' && (
            <BookingPaymentStep
              selectedFacility={selectedFacility}
              bookingDate={bookingDate}
              selectedSlot={selectedSlot}
              durationHours={durationHours}
              customerName={customerName}
              whatsapp={whatsapp}
              participantCount={participantCount}
              purpose={purpose}
              selectedAddonNames={selectedAddonNames}
              basePrice={basePricePerHour}
              memberDiscount={memberDiscount}
              voucherDiscount={voucherDiscount}
              addonsTotal={addonsTotal}
              totalAmount={totalAmount}
              appliedPromoCode={appliedPromo?.code}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              bookingCode={bookingCode}
              onBack={() => setActiveStep('input-data')}
              onConfirmPayment={handleConfirmReservation}
              formatRupiah={formatRupiah}
              triggerToast={triggerToast}
            />
          )}

          {/* ========================================================================= */}
          {/* STEP 4: E-TIKET DIGITAL RESMI                                             */}
          {/* ========================================================================= */}
          {activeStep === 'ticket' && (
            <BookingETicketStep
              bookingCode={bookingCode}
              selectedFacility={selectedFacility}
              bookingDate={bookingDate}
              selectedSlot={selectedSlot}
              durationHours={durationHours}
              customerName={customerName}
              whatsapp={whatsapp}
              participantCount={participantCount}
              purpose={purpose}
              selectedPaymentMethod={selectedPaymentMethod}
              totalAmount={totalAmount}
              formatRupiah={formatRupiah}
              onResetBooking={handleResetBooking}
              onViewSchedule={() => {
                const el = document.getElementById('section-jadwal-fasilitas');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL: EXPRESS FAST BOOKING (1-MENIT)                                     */}
      {/* ========================================================================= */}
      {isExpressBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-[#E5EAF0] dark:border-slate-800 shadow-2xl relative my-8">
            <button
              onClick={() => setIsExpressBookingOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#20B486] mb-1">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-bold text-[#172B4D] dark:text-slate-100">
                Pemesanan Kilat (1-Menit)
              </h3>
            </div>
            <p className="text-xs text-[#718096] dark:text-slate-400 mb-4">
              Booking instan tanpa melewati formulir panjang. Slot Anda langsung terkunci di server.
            </p>

            <form onSubmit={handleExpressBookingSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1">
                  Pilih Fasilitas
                </label>
                <select
                  value={expressFacility}
                  onChange={(e) => setExpressFacility(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#172B4D] dark:text-slate-100 outline-none"
                >
                  <option value="Lapangan Badminton 1">Lapangan Badminton 1 (Rp50.000/jam)</option>
                  <option value="Lapangan Badminton 2">Lapangan Badminton 2 (Rp50.000/jam)</option>
                  <option value="Lapangan Badminton 3">Lapangan Badminton 3 (Rp50.000/jam)</option>
                  <option value="Gedung Serbaguna">Gedung Serbaguna (Rp100.000/jam)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    min={getTodayJakartaISO()}
                    value={bookingDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#172B4D] dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1">
                    Jam Main
                  </label>
                  <select
                    value={expressTime}
                    onChange={(e) => setExpressTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#172B4D] dark:text-slate-100 outline-none"
                  >
                    {ALL_HOURS.map(h => (
                      <option key={h} value={h}>{h} WIB</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1">
                  Nama Anda / Klub *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dimas Pratama"
                  value={expressCustomer}
                  onChange={(e) => setExpressCustomer(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#172B4D] dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1">
                  No. WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={expressPhone}
                  onChange={(e) => setExpressPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#172B4D] dark:text-slate-100 outline-none"
                />
              </div>

              <div className="bg-[#F5F8FA] dark:bg-slate-800 p-3 rounded-xl border border-[#E5EAF0] dark:border-slate-700 flex justify-between items-center text-xs">
                <span className="font-bold text-[#718096] dark:text-slate-400">Total Tarif (1 Jam):</span>
                <span className="text-sm font-black text-[#1677B8] dark:text-sky-300">
                  {formatRupiah(expressFacility.includes('Gedung') ? 100000 : 50000)}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpressBookingOpen(false)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl border border-[#E5EAF0] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#718096] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={expressSubmitting}
                  className="flex-1 py-2 bg-[#20B486] hover:bg-[#18966f] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  {expressSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Kunci Slot & Ambil Tiket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CEK STATUS & E-TIKET SAYA                                          */}
      {/* ========================================================================= */}
      {isCheckTicketOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-[#E5EAF0] dark:border-slate-800 shadow-2xl relative my-8">
            <button
              onClick={() => {
                setIsCheckTicketOpen(false);
                setLookupResults(null);
                setLookupQuery('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#1677B8] dark:text-sky-400 mb-1">
              <Search className="w-5 h-5" />
              <h3 className="text-lg font-bold text-[#172B4D] dark:text-slate-100">
                Cek Status & E-Tiket Reservasi
              </h3>
            </div>
            <p className="text-xs text-[#718096] dark:text-slate-400 mb-4">
              Ketik Kode Booking (contoh: <span className="font-mono font-bold text-[#1677B8]">BW-20260906-8921</span>) atau nomor WhatsApp Anda untuk menampilkan tiket digital.
            </p>

            <form onSubmit={handleLookupSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Kode booking atau No. WhatsApp..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#172B4D] dark:text-slate-100 outline-none"
              />
              <button
                type="submit"
                disabled={isLookingUp}
                className="px-4 py-2 bg-[#1677B8] hover:bg-[#125f94] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                {isLookingUp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Cari</span>}
              </button>
            </form>

            {/* Results Display */}
            {lookupResults && (
              <div className="space-y-3 max-h-72 overflow-y-auto pt-2 border-t border-[#E5EAF0] dark:border-slate-800">
                {lookupResults.length === 0 ? (
                  <p className="text-center text-xs text-[#718096] dark:text-slate-400 py-6">
                    Data reservasi tidak ditemukan. Pastikan kode atau nomor WhatsApp sesuai.
                  </p>
                ) : (
                  lookupResults.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800/80 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#1677B8] dark:text-sky-400">
                          {item.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.paymentStatus === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : item.paymentStatus === 'pending'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                        }`}>
                          {item.paymentStatus === 'confirmed' ? 'Lunas' : item.paymentStatus === 'pending' ? 'Menunggu Bayar' : 'Batal'}
                        </span>
                      </div>

                      <div className="text-slate-700 dark:text-slate-200 font-semibold">
                        {item.facility} • {item.date} ({item.timeSlot})
                      </div>

                      <div className="flex items-center justify-between text-[#718096] dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                        <span>Pemesan: <strong className="text-slate-800 dark:text-slate-200">{item.customerName}</strong></span>
                        <span className="font-bold text-[#20B486]">{formatRupiah(item.totalAmount)}</span>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setBookingCode(item.id);
                            setSelectedFacility(item.facility);
                            setSelectedSlot(item.timeSlot);
                            setBookingDate(item.date);
                            setDurationHours(item.durationHours || 1);
                            setCustomerName(item.customerName);
                            setWhatsapp(item.whatsapp);
                            setSelectedPaymentMethod(item.paymentMethod || 'qris');
                            setIsCheckTicketOpen(false);
                            setActiveStep('ticket');
                            const el = document.getElementById('section-booking-baru');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="w-full py-1.5 bg-[#1677B8] hover:bg-[#125f94] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
                        >
                          Lihat E-Tiket Lengkap
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
