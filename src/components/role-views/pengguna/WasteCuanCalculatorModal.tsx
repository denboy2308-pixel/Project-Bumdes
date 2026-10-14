import React, { useState } from 'react';
import { 
  Calculator, X, Plus, Minus, Check, Sparkles, 
  Coins, ArrowRight, RefreshCw, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { CURRENT_WASTE_PRICES, WastePriceItem } from '../../../services/freeApiService';
import { showToast } from '../../ToastNotification';

interface WasteCuanCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToPickup: (summaryText: string, estimatedTotal: number) => void;
}

export default function WasteCuanCalculatorModal({
  isOpen,
  onClose,
  onApplyToPickup
}: WasteCuanCalculatorModalProps) {
  // Quantities per waste price item ID
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'w-pet': 5,
    'w-kardus': 10,
    'w-cup': 0,
    'w-besi': 0,
    'w-kaleng': 0,
    'w-jelantah': 0
  });

  if (!isOpen) return null;

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities(prev => {
      const curr = prev[id] || 0;
      const next = Math.max(0, curr + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleSetDirectQty = (id: string, val: string) => {
    const num = parseFloat(val) || 0;
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, num)
    }));
  };

  // Calculate totals
  let totalEstimasiRupiah = 0;
  let totalEstimasiPoin = 0;
  let totalBerat = 0;
  const selectedItemsSummary: string[] = [];

  CURRENT_WASTE_PRICES.forEach(item => {
    const qty = quantities[item.id] || 0;
    if (qty > 0) {
      totalEstimasiRupiah += qty * item.pricePerKg;
      totalEstimasiPoin += qty * item.pointsPerKg;
      totalBerat += qty;
      selectedItemsSummary.push(`${item.name.split(' ')[0]} (${qty} ${item.unit})`);
    }
  });

  const handleApply = () => {
    if (totalBerat <= 0) {
      showToast('Harap masukkan perkiraan berat sampah minimal 1 jenis!', 'warning');
      return;
    }

    const summary = selectedItemsSummary.join(' + ');
    onApplyToPickup(summary, totalEstimasiRupiah);
    onClose();
    showToast(`Estimasi Rp ${totalEstimasiRupiah.toLocaleString('id-ID')} berhasil disalin ke formulir jemput!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white">Kalkulator Estimasi Cuan Sampah</h3>
              <p className="text-[10px] text-slate-400">
                Patokan Harga Daur Ulang Resmi BUMDes Waskita Wijaya
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: List of Waste Items */}
        <div className="p-4 space-y-3 overflow-y-auto flex-grow text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs leading-relaxed">
              Masukkan perkiraan berat sampah daur ulang di rumah Anda untuk mengetahui estimasi uang tabungan yang akan masuk ke saldo E-Wallet Anda.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            {CURRENT_WASTE_PRICES.map(item => {
              const qty = quantities[item.id] || 0;
              const subtotal = qty * item.pricePerKg;

              return (
                <div key={item.id} className="p-3 flex items-center justify-between gap-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Rp {item.pricePerKg.toLocaleString('id-ID')} / {item.unit} · +{item.pointsPerKg} Poin
                      </div>
                    </div>
                  </div>

                  {/* Qty Stepper */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={qty}
                        onChange={(e) => handleSetDirectQty(item.id, e.target.value)}
                        className="w-10 text-center text-xs font-semibold font-mono bg-transparent text-slate-900 dark:text-white focus:outline-hidden"
                      />

                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="w-20 text-right font-mono font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                      Rp {subtotal.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer: Summary & Apply Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-slate-500 font-mono">
              Total Estimasi ({totalBerat} Kg/Lt):
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                Rp {totalEstimasiRupiah.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-semibold font-mono text-amber-500">
                (+{totalEstimasiPoin} Poin)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Gunakan di Form Jemput</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
