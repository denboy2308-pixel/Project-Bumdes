import React, { useState } from 'react';
import { Tag, CheckCircle, Ticket, X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { AVAILABLE_PROMOS, PromoVoucher } from './bookingTypes';

interface BookingPromoFeatureProps {
  appliedPromo: PromoVoucher | null;
  onApplyPromo: (voucher: PromoVoucher) => void;
  onRemovePromo: () => void;
  subtotal: number;
  durationHours: number;
  triggerToast: (title: string, msg: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function BookingPromoFeature({
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  subtotal,
  durationHours,
  triggerToast,
}: BookingPromoFeatureProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [showVoucherList, setShowVoucherList] = useState(false);

  const handleApplyByInput = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPromoError(null);
    const cleaned = promoInput.trim().toUpperCase();

    if (!cleaned) {
      setPromoError('Masukkan kode promo');
      return;
    }

    const found = AVAILABLE_PROMOS.find((p) => p.code === cleaned);
    if (!found) {
      setPromoError('Kode voucher tidak ditemukan atau tidak aktif.');
      triggerToast('Kode Tidak Valid', 'Gunakan voucher resmi BUMDES10, WARUHEMAT, atau KUMPOL50', 'error');
      return;
    }

    if (found.minHours && durationHours < found.minHours) {
      setPromoError(`Kode ${found.code} membutuhkan durasi minimal ${found.minHours} jam.`);
      triggerToast('Syarat Belum Terpenuhi', `Voucher berlaku untuk sewa minimal ${found.minHours} jam.`, 'warning');
      return;
    }

    onApplyPromo(found);
    setPromoInput('');
    triggerToast('Voucher Berhasil Dipakai!', `${found.title} berhasil diterapkan.`, 'success');
  };

  const handleSelectVoucher = (voucher: PromoVoucher) => {
    if (voucher.minHours && durationHours < voucher.minHours) {
      triggerToast('Syarat Belum Terpenuhi', `Voucher ${voucher.code} membutuhkan sewa minimal ${voucher.minHours} jam.`, 'warning');
      return;
    }

    onApplyPromo(voucher);
    setPromoError(null);
    setShowVoucherList(false);
    triggerToast('Voucher Diterapkan', `${voucher.title} aktif pada pesanan Anda.`, 'success');
  };

  return (
    <div className="pt-3 border-t border-[#E5EAF0] dark:border-slate-800 space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[#172B4D] dark:text-slate-200 flex items-center gap-1.5">
          <Ticket className="w-3.5 h-3.5 text-[#1677B8] dark:text-sky-400" />
          <span>Voucher Promo</span>
        </span>

        <button
          type="button"
          onClick={() => setShowVoucherList(!showVoucherList)}
          className="text-[11px] text-[#1677B8] dark:text-sky-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>{showVoucherList ? 'Tutup Daftar' : 'Lihat Promo'}</span>
          {showVoucherList ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Applied Promo Banner */}
      {appliedPromo ? (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="block font-extrabold">{appliedPromo.code}</span>
              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                {appliedPromo.title}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemovePromo}
            className="p-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 transition-colors cursor-pointer"
            title="Hapus Voucher"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          <form onSubmit={handleApplyByInput} className="flex gap-1.5">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Contoh: BUMDES10"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value.toUpperCase());
                  setPromoError(null);
                }}
                className="w-full h-9 px-3 text-xs uppercase font-semibold tracking-wider bg-[#F5F8FA] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-lg text-[#172B4D] dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#1677B8] dark:focus:border-sky-500"
              />
              <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="h-9 px-3.5 bg-[#1677B8] hover:bg-[#125f94] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              Gunakan
            </button>
          </form>

          {promoError && (
            <p className="text-[11px] text-[#E05A5A] dark:text-rose-400 font-medium">{promoError}</p>
          )}
        </div>
      )}

      {/* Available Vouchers Drawer / Quick Select */}
      {showVoucherList && (
        <div className="p-3 bg-[#F8FAFC] dark:bg-slate-800/80 rounded-xl border border-[#E5EAF0] dark:border-slate-700 space-y-2 mt-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilih Promo Tersedia:</span>
          </div>

          <div className="space-y-1.5">
            {AVAILABLE_PROMOS.map((voucher) => {
              const isSelected = appliedPromo?.code === voucher.code;
              const isLocked = Boolean(voucher.minHours && durationHours < voucher.minHours);

              return (
                <div
                  key={voucher.code}
                  onClick={() => !isLocked && handleSelectVoucher(voucher)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
                      : isLocked
                      ? 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-[#1677B8] dark:hover:border-sky-500 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#1677B8] dark:text-sky-400 font-mono tracking-wider">
                      {voucher.code}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-sky-950/60 text-[#1677B8] dark:text-sky-300 border border-blue-200 dark:border-sky-800">
                      {voucher.discountType === 'percentage'
                        ? `Diskon ${voucher.discountValue}%`
                        : `Hemat Rp${voucher.discountValue.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#718096] dark:text-slate-400 mt-1 leading-snug">
                    {voucher.description}
                  </p>
                  {voucher.minHours && (
                    <span className="inline-block mt-1 text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                      *Min. durasi sewa {voucher.minHours} jam
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
