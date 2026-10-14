import React from 'react';
import {
  User,
  Users,
  Phone,
  Mail,
  FileText,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
  PackagePlus,
  Clock,
  Calendar,
  Sparkles
} from 'lucide-react';
import { ADDON_OPTIONS, PURPOSE_OPTIONS } from './bookingTypes';
import { getTodayJakartaISO } from '../../utils/dateUtils';

interface BookingFormDataStepProps {
  customerName: string;
  setCustomerName: (val: string) => void;
  participantCount: number;
  setParticipantCount: (val: number | ((prev: number) => number)) => void;
  purpose: string;
  setPurpose: (val: string) => void;
  whatsapp: string;
  setWhatsapp: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  selectedAddons: string[];
  onToggleAddon: (id: string) => void;
  durationHours: number;
  setDurationHours: (hours: number) => void;
  bookingDate: string;
  setBookingDate: (date: string) => void;
  selectedFacility: string;
  selectedSlot: string | null;
  basePrice: number;
  memberDiscount: number;
  voucherDiscount: number;
  addonsTotal: number;
  totalAmount: number;
  appliedPromoCode?: string;
  formErrors: Record<string, string | undefined>;
  onClearFieldError: (field: string) => void;
  onBack: () => void;
  onNext: () => void;
  formatRupiah: (val: number) => string;
}

export default function BookingFormDataStep({
  customerName,
  setCustomerName,
  participantCount,
  setParticipantCount,
  purpose,
  setPurpose,
  whatsapp,
  setWhatsapp,
  email,
  setEmail,
  selectedAddons,
  onToggleAddon,
  durationHours,
  setDurationHours,
  bookingDate,
  setBookingDate,
  selectedFacility,
  selectedSlot,
  basePrice,
  memberDiscount,
  voucherDiscount,
  addonsTotal,
  totalAmount,
  appliedPromoCode,
  formErrors,
  onClearFieldError,
  onBack,
  onNext,
  formatRupiah,
}: BookingFormDataStepProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[12px] border border-[#E5EAF0] dark:border-slate-800 shadow-sm p-5 sm:p-8 space-y-8 max-w-3xl mx-auto transition-colors duration-200">
      {/* HEADER SECTION */}
      <div className="border-b border-[#E5EAF0] dark:border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-sky-950/60 text-[#1677B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 mb-2">
          <User className="w-3.5 h-3.5" />
          Tahap 2: Formulir Identitas Pemesan
        </div>
        <h3 className="text-xl sm:text-[24px] font-bold text-[#172B4D] dark:text-slate-100 tracking-tight">
          Masukkan Data Booking
        </h3>
        <p className="text-xs sm:text-sm text-[#718096] dark:text-slate-400 font-normal mt-1">
          Lengkapi data pemesan untuk konfirmasi reservasi fasilitas BUMDES dan penerbitan tiket resmi.
        </p>
      </div>

      {/* FORM INPUTS */}
      <div className="space-y-6">
        {/* ROW 1: Nama Customer & Jumlah Peserta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* FIELD 1: Nama Customer */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-[#172B4D] dark:text-slate-200">
              Nama Customer / Penanggung Jawab <span className="text-[#E05A5A]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  onClearFieldError('customerName');
                }}
                placeholder="Contoh: Dimas Pratama"
                className={`w-full h-11 px-3.5 text-xs sm:text-sm bg-white dark:bg-slate-800 rounded-lg border text-[#172B4D] dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none ${
                  formErrors.customerName
                    ? 'border-[#E05A5A] ring-1 ring-rose-200 dark:ring-rose-900'
                    : 'border-[#E2E8F0] dark:border-slate-700 focus:border-[#1677B8] dark:focus:border-sky-500'
                }`}
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
            {formErrors.customerName && (
              <p className="text-xs text-[#E05A5A] dark:text-rose-400 font-medium mt-1">
                {formErrors.customerName}
              </p>
            )}
          </div>

          {/* FIELD 2: Jumlah Peserta */}
          <div className="sm:col-span-1 space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-[#172B4D] dark:text-slate-200">
              Peserta <span className="text-[#E05A5A]">*</span>
            </label>
            <div className="flex items-center h-11 border border-[#E2E8F0] dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => setParticipantCount((prev) => Math.max(1, prev - 1))}
                className="px-3.5 h-full bg-slate-50 dark:bg-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 transition-colors border-r border-[#E2E8F0] dark:border-slate-700 flex items-center justify-center cursor-pointer"
                title="Kurangi"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min="1"
                value={participantCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 1;
                  setParticipantCount(Math.max(1, val));
                  onClearFieldError('participantCount');
                }}
                className="w-full text-center text-xs sm:text-sm font-bold text-[#172B4D] dark:text-slate-100 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setParticipantCount((prev) => prev + 1)}
                className="px-3.5 h-full bg-slate-50 dark:bg-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 transition-colors border-l border-[#E2E8F0] dark:border-slate-700 flex items-center justify-center cursor-pointer"
                title="Tambah"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {formErrors.participantCount ? (
              <p className="text-xs text-[#E05A5A] dark:text-rose-400 font-medium mt-1">
                {formErrors.participantCount}
              </p>
            ) : (
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                {participantCount} Orang Pemain / Hadir
              </p>
            )}
          </div>
        </div>

        {/* ROW 2: Keperluan Reservasi (Quick Dropdown + Custom) */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-semibold text-[#172B4D] dark:text-slate-200">
            Keperluan Reservasi <span className="text-[#E05A5A]">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <select
              value={PURPOSE_OPTIONS.includes(purpose) ? purpose : 'Lainnya (Tulis Sendiri)'}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== 'Lainnya (Tulis Sendiri)') {
                  setPurpose(val);
                }
                onClearFieldError('purpose');
              }}
              className="h-11 px-3 text-xs sm:text-sm bg-white dark:bg-slate-800 rounded-lg border border-[#E2E8F0] dark:border-slate-700 text-[#172B4D] dark:text-slate-100 focus:outline-none focus:border-[#1677B8] dark:focus:border-sky-500"
            >
              {PURPOSE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <div className="relative">
              <input
                type="text"
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  onClearFieldError('purpose');
                }}
                placeholder="Detail Keperluan..."
                className={`w-full h-11 px-3.5 text-xs sm:text-sm bg-white dark:bg-slate-800 rounded-lg border text-[#172B4D] dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none ${
                  formErrors.purpose
                    ? 'border-[#E05A5A] ring-1 ring-rose-200 dark:ring-rose-900'
                    : 'border-[#E2E8F0] dark:border-slate-700 focus:border-[#1677B8] dark:focus:border-sky-500'
                }`}
              />
              <FileText className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>
          {formErrors.purpose && (
            <p className="text-xs text-[#E05A5A] dark:text-rose-400 font-medium">
              {formErrors.purpose}
            </p>
          )}
        </div>

        {/* ROW 3: Nomor WhatsApp & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* WhatsApp */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-[#172B4D] dark:text-slate-200">
              Nomor WhatsApp Aktif <span className="text-[#E05A5A]">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value);
                  onClearFieldError('whatsapp');
                }}
                placeholder="081234567890"
                className={`w-full h-11 px-3.5 text-xs sm:text-sm bg-white dark:bg-slate-800 rounded-lg border text-[#172B4D] dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none ${
                  formErrors.whatsapp
                    ? 'border-[#E05A5A] ring-1 ring-rose-200 dark:ring-rose-900'
                    : 'border-[#E2E8F0] dark:border-slate-700 focus:border-[#1677B8] dark:focus:border-sky-500'
                }`}
              />
              <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
            {formErrors.whatsapp ? (
              <p className="text-xs text-[#E05A5A] dark:text-rose-400 font-medium">
                {formErrors.whatsapp}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                E-tiket digital dan kode gerbang akan dikirim langsung ke WhatsApp ini.
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-[#172B4D] dark:text-slate-200">
              Email Konfirmasi <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  onClearFieldError('email');
                }}
                placeholder="nama@gmail.com"
                className={`w-full h-11 px-3.5 text-xs sm:text-sm bg-white dark:bg-slate-800 rounded-lg border text-[#172B4D] dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none ${
                  formErrors.email
                    ? 'border-[#E05A5A] ring-1 ring-rose-200 dark:ring-rose-900'
                    : 'border-[#E2E8F0] dark:border-slate-700 focus:border-[#1677B8] dark:focus:border-sky-500'
                }`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
            {formErrors.email && (
              <p className="text-xs text-[#E05A5A] dark:text-rose-400 font-medium">
                {formErrors.email}
              </p>
            )}
          </div>
        </div>

        {/* ROW 4: Durasi Sewa & Tanggal Booking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-[#E5EAF0] dark:border-slate-700/80">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1677B8] dark:text-sky-400" />
              <span>Durasi Sewa:</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3].map((hr) => (
                <button
                  key={hr}
                  type="button"
                  onClick={() => setDurationHours(hr)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    durationHours === hr
                      ? 'bg-[#1677B8] dark:bg-sky-600 text-white border-[#1677B8] shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#1677B8]'
                  }`}
                >
                  {hr} Jam
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1677B8] dark:text-sky-400" />
              <span>Tanggal Penggunaan:</span>
            </label>
            <input
              type="date"
              min={getTodayJakartaISO()}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#1677B8]"
            />
          </div>
        </div>

        {/* ROW 5: Fasilitas Tambahan / Add-ons (Opsional) */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs sm:text-sm font-semibold text-[#172B4D] dark:text-slate-200 flex items-center gap-2">
            <PackagePlus className="w-4 h-4 text-[#20B486]" />
            <span>Fasilitas Tambahan & Perlengkapan (Opsional)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ADDON_OPTIONS.map((addon) => {
              const isChecked = selectedAddons.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => onToggleAddon(addon.id)}
                  className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isChecked
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 shadow-xs'
                      : 'bg-[#F8FAFC] dark:bg-slate-800/60 border-[#E5EAF0] dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="font-bold text-[#172B4D] dark:text-slate-200 block">
                      {addon.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      {addon.description}
                    </span>
                    <span className="inline-block mt-1 font-extrabold text-[#1677B8] dark:text-sky-400">
                      +{formatRupiah(addon.price)}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION KECIL: RINGKASAN REKAP DATA BOOKING */}
      <div className="bg-[#F8FAFC] dark:bg-slate-800/80 border border-[#E5EAF0] dark:border-slate-700 rounded-[10px] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#E5EAF0] dark:border-slate-700 pb-2">
          <h4 className="text-xs sm:text-sm font-bold text-[#172B4D] dark:text-slate-200 uppercase tracking-wider">
            Ringkasan Pesanan Anda
          </h4>
          <span className="text-[11px] text-[#1677B8] dark:text-sky-400 font-bold">
            Live Kalkulasi
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="block text-slate-400 dark:text-slate-500">Fasilitas</span>
            <span className="font-bold text-[#172B4D] dark:text-slate-200">{selectedFacility}</span>
          </div>
          <div>
            <span className="block text-slate-400 dark:text-slate-500">Tanggal</span>
            <span className="font-bold text-[#172B4D] dark:text-slate-200">{bookingDate}</span>
          </div>
          <div>
            <span className="block text-slate-400 dark:text-slate-500">Jam Mulai</span>
            <span className="font-bold text-[#172B4D] dark:text-slate-200">
              {selectedSlot || '19:00'} WIB ({durationHours} Jam)
            </span>
          </div>
          <div>
            <span className="block text-slate-400 dark:text-slate-500">Pemesan</span>
            <span className="font-bold text-[#172B4D] dark:text-slate-200">
              {customerName || 'Belum diisi'}
            </span>
          </div>
        </div>

        <div className="border-t border-dashed border-[#E5EAF0] dark:border-slate-700 pt-2.5 space-y-1.5 text-xs">
          <div className="flex justify-between text-[#718096] dark:text-slate-400">
            <span>Biaya Sewa Pokok ({durationHours} jam):</span>
            <span className="font-semibold text-[#172B4D] dark:text-slate-200">
              {formatRupiah(basePrice * durationHours)}
            </span>
          </div>
          {addonsTotal > 0 && (
            <div className="flex justify-between text-[#718096] dark:text-slate-400">
              <span>Fasilitas Tambahan:</span>
              <span className="font-semibold text-[#172B4D] dark:text-slate-200">
                +{formatRupiah(addonsTotal)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-[#20B486] dark:text-emerald-400">
            <span>Diskon Member BUMDES:</span>
            <span className="font-semibold">-{formatRupiah(memberDiscount)}</span>
          </div>
          {voucherDiscount > 0 && (
            <div className="flex justify-between text-[#20B486] dark:text-emerald-400">
              <span>Voucher Promo ({appliedPromoCode}):</span>
              <span className="font-semibold">-{formatRupiah(voucherDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#E5EAF0] dark:border-slate-700">
            <span className="text-[#172B4D] dark:text-slate-100">TOTAL ESTIMASI:</span>
            <span className="text-[#1677B8] dark:text-sky-400 text-base">
              {formatRupiah(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* TOMBOL NAVIGASI */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-[#DDE3EA] dark:border-slate-700 text-[#4B5563] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium rounded-[7px] text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-[#1677B8] hover:bg-[#125f94] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold rounded-[7px] text-xs sm:text-sm shadow-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          <span>LANJUTKAN PEMBAYARAN</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
