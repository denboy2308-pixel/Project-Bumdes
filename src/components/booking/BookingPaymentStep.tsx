import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  FileCheck,
  Clock,
  Calendar,
  Building,
  User,
  Phone,
  X,
  FileText
} from 'lucide-react';
import { PaymentMethod } from './bookingTypes';

interface BookingPaymentStepProps {
  selectedFacility: string;
  bookingDate: string;
  selectedSlot: string | null;
  durationHours: number;
  customerName: string;
  whatsapp: string;
  participantCount: number;
  purpose: string;
  selectedAddonNames: string[];
  basePrice: number;
  memberDiscount: number;
  voucherDiscount: number;
  addonsTotal: number;
  totalAmount: number;
  appliedPromoCode?: string;
  selectedPaymentMethod: PaymentMethod;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  bookingCode: string;
  onBack: () => void;
  onConfirmPayment: () => void;
  formatRupiah: (val: number) => string;
  triggerToast: (title: string, msg: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function BookingPaymentStep({
  selectedFacility,
  bookingDate,
  selectedSlot,
  durationHours,
  customerName,
  whatsapp,
  participantCount,
  purpose,
  selectedAddonNames,
  basePrice,
  memberDiscount,
  voucherDiscount,
  addonsTotal,
  totalAmount,
  appliedPromoCode,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  bookingCode,
  onBack,
  onConfirmPayment,
  formatRupiah,
  triggerToast,
}: BookingPaymentStepProps) {
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(900); // 15 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(countdownSeconds / 60);
  const seconds = countdownSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleCopyAccount = (bank: string, number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedBank(bank);
    triggerToast('Tersalin!', `Nomor Rekening ${bank} (${number}) berhasil disalin.`, 'success');
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const handleProceed = () => {
    if (!agreedTerms) {
      triggerToast('Persetujuan Wajib', 'Mohon centang persetujuan tata tertib fasilitas sebelum melanjutkan.', 'warning');
      return;
    }
    onConfirmPayment();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[12px] border border-[#E5EAF0] dark:border-slate-800 shadow-sm p-5 sm:p-8 space-y-8 max-w-3xl mx-auto transition-colors duration-200">
      {/* HEADER SECTION */}
      <div className="border-b border-[#E5EAF0] dark:border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-sky-950/60 text-[#1677B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800 mb-2">
          <CreditCard className="w-3.5 h-3.5" />
          Tahap 3: Halaman Konfirmasi & Pembayaran
        </div>
        <h3 className="text-xl sm:text-[24px] font-bold text-[#172B4D] dark:text-slate-100 tracking-tight">
          Konfirmasi & Bayar Reservasi
        </h3>
        <p className="text-xs sm:text-sm text-[#718096] dark:text-slate-400 font-normal mt-1">
          Periksa kembali rincian pemesanan Anda dan pilih metode konfirmasi pembayaran resmi BUMDES.
        </p>
      </div>

      {/* TOTAL TAGIHAN & COUNTDOWN BANNER */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-slate-800/80 dark:to-slate-800/50 border border-blue-100 dark:border-slate-700 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase tracking-wider">
            Total Tagihan Reservasi
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#1677B8] dark:text-sky-400">
            {formatRupiah(totalAmount)}
          </span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Kode Booking: <strong className="text-slate-800 dark:text-slate-200">{bookingCode}</strong>
          </span>
        </div>

        <div className="text-left sm:text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 text-xs font-bold text-amber-600 dark:text-amber-400 shadow-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>Selesaikan dalam: {timeFormatted}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Slot dikunci sementara selama proses pembayaran
          </p>
        </div>
      </div>

      {/* REKAP DETAIL RESERVASI LENGKAP */}
      <div className="bg-[#F8FAFC] dark:bg-slate-800/70 border border-[#E5EAF0] dark:border-slate-700 rounded-xl p-5 space-y-4">
        <h4 className="text-xs sm:text-sm font-bold text-[#172B4D] dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#1677B8] dark:text-sky-400" />
          <span>Rekap Informasi Booking</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Building className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Fasilitas: <strong className="text-slate-800 dark:text-slate-100">{selectedFacility}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Tanggal: <strong className="text-slate-800 dark:text-slate-100">{bookingDate}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Waktu: <strong className="text-slate-800 dark:text-slate-100">{selectedSlot} WIB ({durationHours} Jam)</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Nama: <strong className="text-slate-800 dark:text-slate-100">{customerName}</strong> ({participantCount} orang)
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 sm:col-span-2">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              WhatsApp: <strong className="text-slate-800 dark:text-slate-100">{whatsapp}</strong> • Keperluan: <strong className="text-slate-800 dark:text-slate-100">{purpose}</strong>
            </span>
          </div>
          {selectedAddonNames.length > 0 && (
            <div className="sm:col-span-2 text-slate-600 dark:text-slate-300 text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Fasilitas Tambahan: </span>
              {selectedAddonNames.join(', ')}
            </div>
          )}
        </div>

        {/* Breakdown Biaya Terperinci */}
        <div className="border-t border-dashed border-[#E5EAF0] dark:border-slate-700 pt-3 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Sewa Pokok ({durationHours} Jam):</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatRupiah(basePrice * durationHours)}
            </span>
          </div>
          {addonsTotal > 0 && (
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Biaya Perlengkapan Tambahan:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
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
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Biaya Layanan & Administrasi:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">GRATIS</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-[#E5EAF0] dark:border-slate-700">
            <span className="text-[#172B4D] dark:text-slate-100 uppercase">TOTAL DIBAYAR:</span>
            <span className="text-[#1677B8] dark:text-sky-400 text-lg">
              {formatRupiah(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* 3 METODE PEMBAYARAN */}
      <div className="space-y-4">
        <label className="block text-xs sm:text-sm font-semibold text-[#172B4D] dark:text-slate-200">
          Pilih Metode Pembayaran
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Option 1: QRIS */}
          <div
            onClick={() => setSelectedPaymentMethod('qris')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPaymentMethod === 'qris'
                ? 'border-[#1677B8] dark:border-sky-500 bg-blue-50/40 dark:bg-sky-950/40 shadow-xs'
                : 'border-[#E5EAF0] dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-blue-100 dark:bg-sky-900/60 text-[#1677B8] dark:text-sky-300">
                <QrCode className="w-5 h-5" />
              </span>
              {selectedPaymentMethod === 'qris' && (
                <CheckCircle2 className="w-5 h-5 text-[#1677B8] dark:text-sky-400" />
              )}
            </div>
            <div>
              <h5 className="font-bold text-sm text-[#172B4D] dark:text-slate-100">QRIS Realtime</h5>
              <p className="text-[11px] text-[#718096] dark:text-slate-400 mt-0.5">
                Scan via BCA, Mandiri, BRImo, GoPay, OVO, ShopeePay
              </p>
              <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Verifikasi Otomatis
              </span>
            </div>
          </div>

          {/* Option 2: Transfer Bank */}
          <div
            onClick={() => setSelectedPaymentMethod('bank_transfer')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPaymentMethod === 'bank_transfer'
                ? 'border-[#1677B8] dark:border-sky-500 bg-blue-50/40 dark:bg-sky-950/40 shadow-xs'
                : 'border-[#E5EAF0] dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                <CreditCard className="w-5 h-5" />
              </span>
              {selectedPaymentMethod === 'bank_transfer' && (
                <CheckCircle2 className="w-5 h-5 text-[#1677B8] dark:text-sky-400" />
              )}
            </div>
            <div>
              <h5 className="font-bold text-sm text-[#172B4D] dark:text-slate-100">Transfer Bank</h5>
              <p className="text-[11px] text-[#718096] dark:text-slate-400 mt-0.5">
                Rekening Resmi Kas BUMDES Desa Waru
              </p>
              <span className="inline-block mt-2 text-[10px] font-bold text-blue-700 dark:text-sky-300 bg-blue-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-sky-800">
                BCA, Mandiri, BRI
              </span>
            </div>
          </div>

          {/* Option 3: Cash */}
          <div
            onClick={() => setSelectedPaymentMethod('cash')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPaymentMethod === 'cash'
                ? 'border-[#1677B8] dark:border-sky-500 bg-blue-50/40 dark:bg-sky-950/40 shadow-xs'
                : 'border-[#E5EAF0] dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                <Banknote className="w-5 h-5" />
              </span>
              {selectedPaymentMethod === 'cash' && (
                <CheckCircle2 className="w-5 h-5 text-[#1677B8] dark:text-sky-400" />
              )}
            </div>
            <div>
              <h5 className="font-bold text-sm text-[#172B4D] dark:text-slate-100">Cash / Tunai di Loket</h5>
              <p className="text-[11px] text-[#718096] dark:text-slate-400 mt-0.5">
                Bayar tunai di loket sebelum sesi berlangsung
              </p>
              <span className="inline-block mt-2 text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                Kantor BUMDES Waru
              </span>
            </div>
          </div>
        </div>

        {/* PAYMENT DETAILS PANEL */}
        <div className="p-5 rounded-xl border border-[#E5EAF0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800/80">
          {/* DETAIL QRIS */}
          {selectedPaymentMethod === 'qris' && (
            <div className="space-y-4 text-center">
              <div className="max-w-xs mx-auto bg-white dark:bg-slate-900 p-5 rounded-xl border border-[#E5EAF0] dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b dark:border-slate-700 pb-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  <span>QRIS STANDAR BI</span>
                  <span className="text-[#1677B8] dark:text-sky-400">BUMDES WARU</span>
                </div>

                {/* QR Display */}
                <div className="w-48 h-48 mx-auto bg-white border-2 border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center p-2 relative shadow-inner">
                  <QrCode className="w-36 h-36 text-slate-900" />
                  <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
                </div>

                <div className="text-xs font-bold text-[#172B4D] dark:text-slate-200">
                  NMID: ID1029384756201
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  BUMDESA WASKITA WIJAYA
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto space-y-1">
                <p>
                  Buka aplikasi mobile banking atau dompet digital Anda, scan QR di atas, lalu transfer nominal tepat{' '}
                  <strong className="text-[#1677B8] dark:text-sky-400">{formatRupiah(totalAmount)}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerToast('QRIS Terverifikasi', 'Simulasi pembayaran QRIS berhasil diverifikasi sistem.', 'success');
                  onConfirmPayment();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simulasikan Pembayaran QRIS Berhasil</span>
              </button>
            </div>
          )}

          {/* DETAIL TRANSFER BANK */}
          {selectedPaymentMethod === 'bank_transfer' && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#172B4D] dark:text-slate-200">
                Silakan transfer tepat <strong className="text-[#1677B8] dark:text-sky-400">{formatRupiah(totalAmount)}</strong> ke rekening resmi BUMDES:
              </p>

              {[
                { bank: 'BCA', no: '015-8912-334', an: 'BUMDES Waskita Wijaya' },
                { bank: 'Mandiri', no: '138-00-19283-4', an: 'BUMDES Waskita Wijaya' },
                { bank: 'BRI', no: '0092-01-023812-50-8', an: 'BUMDES Waskita Wijaya' },
                { bank: 'Bank Jateng', no: '3-021-00912-1', an: 'BUMDES Waskita Wijaya' },
              ].map((item) => (
                <div
                  key={item.bank}
                  className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-[#E5EAF0] dark:border-slate-700 text-xs"
                >
                  <div>
                    <span className="font-extrabold text-sm text-[#172B4D] dark:text-slate-100 block">{item.bank}</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm tracking-wide">{item.no}</span>
                    <span className="block text-[11px] text-slate-400 dark:text-slate-500">a.n. {item.an}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyAccount(item.bank, item.no)}
                    className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedBank === item.bank ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Salin No. Rek</span>
                      </>
                    )}
                  </button>
                </div>
              ))}

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                *Simpan bukti struk transfer Anda untuk ditunjukkan saat konfirmasi tiba di lokasi arena.
              </p>
            </div>
          )}

          {/* DETAIL CASH */}
          {selectedPaymentMethod === 'cash' && (
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Pembayaran Tunai di Loket Pelayanan BUMDES</span>
              </div>
              <p className="leading-relaxed">
                Anda dapat membayar langsung di loket kasir BUMDES Waskita Wijaya paling lambat{' '}
                <strong>30 menit sebelum jadwal {selectedSlot} WIB</strong> dimulai.
              </p>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-[#E5EAF0] dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                <p>
                  <strong>Lokasi Loket:</strong> Jl. Raya Waru No. 12, Baki, Sukoharjo (Samping Kantor Desa)
                </p>
                <p>
                  <strong>Jam Operasional Loket:</strong> 07:30 – 21:30 WIB
                </p>
                <p>
                  <strong>Sebutkan:</strong> Kode Booking <strong>{bookingCode}</strong> atau nama{' '}
                  <strong>{customerName}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SYARAT & KETENTUAN CHECKBOX */}
      <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-[#E5EAF0] dark:border-slate-700 space-y-2">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-[#1677B8] rounded focus:ring-[#1677B8] cursor-pointer"
          />
          <div className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              Saya menyetujui syarat & tata tertib penggunaan fasilitas BUMDES Waru:
            </span>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              Menggunakan sepatu olahraga standar (non-marking), menjaga kebersihan arena, dan hadir tepat waktu sesuai slot yang dipilih.
            </p>
          </div>
        </label>
        
        <div className="pt-1 pl-7">
          <button
            type="button"
            onClick={() => setIsTermsModalOpen(true)}
            className="text-[11px] text-[#1677B8] dark:text-sky-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Baca Rincian Syarat, Tata Tertib & Kebijakan Reschedule / Refund Lengkap</span>
          </button>
        </div>
      </div>

      {/* MODAL SYARAT & TATA TERTIB LENGKAP */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tata Tertib & Kebijakan Fasilitas BUMDes
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                <strong className="text-slate-900 dark:text-white block font-bold">1. Aturan Penggunaan Lapangan & Gedung:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-500 dark:text-slate-400">
                  <li>Wajib bersepatu olahraga non-marking di lapangan vinyl/parket.</li>
                  <li>Dilarang merokok, membawa senjata tajam, atau minuman keras.</li>
                  <li>Waktu sewa dihitung tepat sesuai jam pemesanan yang tertera di tiket.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                <strong className="text-slate-900 dark:text-white block font-bold">2. Penjadwalan Ulang (Reschedule):</strong>
                <p className="text-slate-500 dark:text-slate-400">
                  Pengajuan reschedule dapat dilakukan maksimal 6 jam sebelum jam sesi sewa dimulai melalui hotline pengelola selama slot pengganti masih tersedia.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                <strong className="text-slate-900 dark:text-white block font-bold">3. Kebijakan Pembatalan & Refund:</strong>
                <p className="text-slate-500 dark:text-slate-400">
                  Pembatalan lebih dari 24 jam sebelum jadwal berhak mendapatkan pengembalian dana 100% dipotong biaya administrasi perbankan. Pembatalan sepihak kurang dari 6 jam tidak dapat di-refund.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                <strong className="text-slate-900 dark:text-white block font-bold">4. Perlindungan Data & Privasi (UU PDP):</strong>
                <p className="text-slate-500 dark:text-slate-400">
                  Nomor WhatsApp dan identitas pemesan hanya digunakan untuk verifikasi reservasi dan tidak pernah dibagikan ke pihak ketiga.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setAgreedTerms(true);
                  setIsTermsModalOpen(false);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Saya Mengerti & Setuju
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOMBOL NAVIGASI & KONFIRMASI */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-slate-800 border border-[#DDE3EA] dark:border-slate-700 text-[#4B5563] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium rounded-[7px] text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI KE FORM</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#1677B8] hover:bg-[#125f94] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold rounded-[7px] text-xs sm:text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>KONFIRMASI & AMBIL E-TIKET</span>
        </button>
      </div>
    </div>
  );
}
