import React from 'react';
import {
  CheckCircle2,
  QrCode,
  Share2,
  Printer,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Building,
  Calendar,
  Clock,
  User,
  Phone,
  Tag
} from 'lucide-react';
import { PaymentMethod } from './bookingTypes';

interface BookingETicketStepProps {
  bookingCode: string;
  selectedFacility: string;
  bookingDate: string;
  selectedSlot: string | null;
  durationHours: number;
  customerName: string;
  whatsapp: string;
  participantCount: number;
  purpose: string;
  selectedPaymentMethod: PaymentMethod;
  totalAmount: number;
  formatRupiah: (val: number) => string;
  onResetBooking: () => void;
  onViewSchedule: () => void;
}

export default function BookingETicketStep({
  bookingCode,
  selectedFacility,
  bookingDate,
  selectedSlot,
  durationHours,
  customerName,
  whatsapp,
  participantCount,
  purpose,
  selectedPaymentMethod,
  totalAmount,
  formatRupiah,
  onResetBooking,
  onViewSchedule,
}: BookingETicketStepProps) {
  const startHourNum = selectedSlot ? parseInt(selectedSlot.split(':')[0], 10) : 19;
  const endHour = `${String(startHourNum + durationHours).padStart(2, '0')}:00`;

  const cleanPhone = whatsapp.replace(/\D/g, '').replace(/^0/, '');
  const waShareText = `Halo ${customerName}, berikut bukti reservasi resmi fasilitas BUMDES Waskita Wijaya:\n\nKode Booking: ${bookingCode}\nFasilitas: ${selectedFacility}\nTanggal: ${bookingDate}\nJam: ${selectedSlot} - ${endHour} WIB (${durationHours} Jam)\nTotal: ${formatRupiah(totalAmount)}\nStatus: ${
    selectedPaymentMethod === 'cash' ? 'Menunggu Pembayaran Loket' : 'Lunas Terverifikasi'
  }\n\nTerima kasih atas partisipasi Anda!`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[12px] border border-[#E5EAF0] dark:border-slate-800 shadow-sm p-5 sm:p-10 space-y-8 max-w-2xl mx-auto transition-colors duration-200">
      {/* Success Banner */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#172B4D] dark:text-slate-100 tracking-tight">
          Reservasi Berhasil Diterbitkan!
        </h3>
        <p className="text-xs sm:text-sm text-[#718096] dark:text-slate-400">
          Fasilitas BUMDES telah diamankan untuk jadwal Anda. Silakan simpan dan bawa e-tiket ini.
        </p>
      </div>

      {/* E-TICKET CARD DIGITAL */}
      <div className="border border-[#E5EAF0] dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm bg-gradient-to-b from-white to-slate-50 dark:from-slate-850 dark:to-slate-900 relative">
        {/* Header Ticket */}
        <div className="bg-[#1677B8] dark:bg-sky-700 text-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">
              BUMDESA WASKITA WIJAYA
            </span>
            <h4 className="text-lg font-black tracking-tight">{selectedFacility}</h4>
            <p className="text-xs text-blue-100">Desa Waru, Kec. Baki, Kab. Sukoharjo</p>
          </div>
          <div className="sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              {selectedPaymentMethod === 'cash' ? 'MENUNGGU DI LOKET' : 'LUNAS TERVERIFIKASI'}
            </span>
            <p className="text-[11px] font-mono text-blue-100 font-bold mt-1 tracking-wider">
              {bookingCode}
            </p>
          </div>
        </div>

        {/* Middle Ticket Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="block text-slate-400 dark:text-slate-500 font-medium">Nama Pemesan</span>
              <span className="font-bold text-[#172B4D] dark:text-slate-100 text-sm">{customerName}</span>
            </div>
            <div>
              <span className="block text-slate-400 dark:text-slate-500 font-medium">Nomor WhatsApp</span>
              <span className="font-bold text-[#172B4D] dark:text-slate-100 text-sm">{whatsapp}</span>
            </div>
            <div>
              <span className="block text-slate-400 dark:text-slate-500 font-medium">Peserta</span>
              <span className="font-bold text-[#172B4D] dark:text-slate-100 text-sm">
                {participantCount} Orang
              </span>
            </div>
            <div>
              <span className="block text-slate-400 dark:text-slate-500 font-medium">Hari / Tanggal</span>
              <span className="font-bold text-[#172B4D] dark:text-slate-100 text-sm">{bookingDate}</span>
            </div>
            <div>
              <span className="block text-slate-400 dark:text-slate-500 font-medium">Jam Booking</span>
              <span className="font-bold text-[#172B4D] dark:text-slate-100 text-sm">
                {selectedSlot} – {endHour} WIB
              </span>
            </div>
            <div>
              <span className="block text-slate-400 dark:text-slate-500 font-medium">Keperluan</span>
              <span className="font-bold text-[#172B4D] dark:text-slate-100 text-sm">{purpose}</span>
            </div>
          </div>

          {/* Cutout Divider */}
          <div className="relative py-2">
            <div className="border-t-2 border-dashed border-[#E5EAF0] dark:border-slate-700"></div>
            <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F5F8FA] dark:bg-slate-950 border border-[#E5EAF0] dark:border-slate-700"></div>
            <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F5F8FA] dark:bg-slate-950 border border-[#E5EAF0] dark:border-slate-700"></div>
          </div>

          {/* QR & Barcode Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-[#E5EAF0] shadow-xs">
                <QrCode className="w-16 h-16 text-slate-900" />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span className="block font-bold text-[#172B4D] dark:text-slate-100">
                  Tunjukkan Tiket Ini
                </span>
                <span className="block text-[11px]">
                  Scan QR di gerbang arena atau tunjukkan pada petugas loket BUMDES.
                </span>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Total Biaya</span>
              <span className="text-xl font-black text-[#1677B8] dark:text-sky-400">
                {formatRupiah(totalAmount)}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                Metode: {selectedPaymentMethod.toUpperCase().replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: WhatsApp Share, Print, New Booking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <a
          href={`https://wa.me/62${cleanPhone}?text=${encodeURIComponent(waShareText)}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Kirim Tiket ke WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-[#E2E7EC] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      <div className="pt-4 border-t border-[#E5EAF0] dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onResetBooking}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Buat Booking Baru</span>
        </button>

        <button
          type="button"
          onClick={onViewSchedule}
          className="w-full sm:w-auto px-4 py-2.5 bg-[#1677B8] hover:bg-[#125f94] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Lihat Jadwal Fasilitas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
