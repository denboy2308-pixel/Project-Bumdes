import React, { useState } from 'react';
import { 
  Building, 
  Calculator, 
  Users, 
  Clock, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  FileText,
  QrCode
} from 'lucide-react';
import { showToast } from './ToastNotification';

export default function EventHallCostSimulator() {
  const [eventType, setEventType] = useState<'Pernikahan' | 'Resepsi' | 'Rapat / Musyawarah' | 'Pentas Seni / Wisuda'>('Pernikahan');
  const [guestCount, setGuestCount] = useState(300);
  const [durationHours, setDurationHours] = useState(8);
  const [includeAc, setIncludeAc] = useState(true);
  const [includeSound, setIncludeSound] = useState(true);
  const [includeCatering, setIncludeCatering] = useState(false);
  const [includeCleaning, setIncludeCleaning] = useState(true);

  // Calculation Math
  const baseHallRate = 1200000; // base 6 hours
  const extraHourRate = 150000;
  const acRate = includeAc ? 400000 : 0;
  const soundRate = includeSound ? 500000 : 0;
  const cleaningRate = includeCleaning ? 150000 : 0;
  const cateringPerGuest = includeCatering ? 35000 : 0;

  const extraHours = Math.max(0, durationHours - 6);
  const hallRentalTotal = baseHallRate + (extraHours * extraHourRate);
  const cateringTotal = guestCount * cateringPerGuest;
  const grandTotal = hallRentalTotal + acRate + soundRate + cleaningRate + cateringTotal;

  const handleSendEstimateWA = () => {
    const msg = `*SIMULASI ESTIMASI BIAYA SEWA GEDUNG BUMDESA WARU*\n\n` +
      `🎪 *Jenis Acara:* ${eventType}\n` +
      `👥 *Estimasi Tamu:* ${guestCount} Orang\n` +
      `⏱️ *Durasi Sewa:* ${durationHours} Jam\n\n` +
      `📋 *RINCIAN BIAYA:* \n` +
      `- Sewa Gedung Utama (Base + ${extraHours} Jam Extra): Rp ${hallRentalTotal.toLocaleString('id-ID')}\n` +
      (includeAc ? `- AC Central & Blower: Rp ${acRate.toLocaleString('id-ID')}\n` : '') +
      (includeSound ? `- Sound System + Operator: Rp ${soundRate.toLocaleString('id-ID')}\n` : '') +
      (includeCleaning ? `- Keamanan & Kebersihan: Rp ${cleaningRate.toLocaleString('id-ID')}\n` : '') +
      (includeCatering ? `- Prasmanan Catering (${guestCount} Porsi): Rp ${cateringTotal.toLocaleString('id-ID')}\n` : '') +
      `\n💰 *ESTIMASI TOTAL TAGIHAN:* Rp ${grandTotal.toLocaleString('id-ID')}\n\n` +
      `Mohon dibantu verifikasi ketersediaan jadwal tanggal sewa gedung. Terima kasih Pengelola Gedung Waru!`;

    window.open(`https://wa.me/6282134567890?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Simulasi Biaya Dikirim', 'Rincian estimasi biaya telah diteruskan ke Pengelola Gedung.', 'success');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>Kalkulator Transparan Gedung Serbaguna Waru</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Simulator Estimasi Biaya Sewa Gedung Custom
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hitung perkiraan biaya sewa gedung, AC, catering BUMDES, dan sound system secara rinci dan fleksibel.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Jenis Acara:</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Pernikahan', 'Resepsi', 'Rapat / Musyawarah', 'Pentas Seni / Wisuda'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEventType(type)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    eventType === type 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Estimasi Jumlah Tamu: <span className="text-emerald-600 font-black">{guestCount} Orang</span>
              </label>
              <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={guestCount}
                onChange={e => setGuestCount(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Durasi Sewa: <span className="text-emerald-600 font-black">{durationHours} Jam</span>
              </label>
              <input
                type="range"
                min={4}
                max={16}
                step={1}
                value={durationHours}
                onChange={e => setDurationHours(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Addons Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Fasilitas Tambahan & Catering:</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">AC Central & Blower (+Rp 400rb)</span>
                <input type="checkbox" checked={includeAc} onChange={e => setIncludeAc(e.target.checked)} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
              </label>

              <label className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Sound System & Op (+Rp 500rb)</span>
                <input type="checkbox" checked={includeSound} onChange={e => setIncludeSound(e.target.checked)} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
              </label>

              <label className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Kebersihan & Keamanan (+Rp 150rb)</span>
                <input type="checkbox" checked={includeCleaning} onChange={e => setIncludeCleaning(e.target.checked)} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
              </label>

              <label className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Catering BUMDES (+Rp 35rb/org)</span>
                <input type="checkbox" checked={includeCatering} onChange={e => setIncludeCatering(e.target.checked)} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
              </label>
            </div>
          </div>
        </div>

        {/* Receipt & Quotation Column */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Rincian Estimasi Biaya</span>
              <h3 className="text-base font-black text-white">{eventType} ({guestCount} Tamu)</h3>
            </div>
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Sewa Gedung ({durationHours} Jam):</span>
              <span className="font-mono font-bold">Rp {hallRentalTotal.toLocaleString('id-ID')}</span>
            </div>
            {includeAc && (
              <div className="flex justify-between text-slate-300">
                <span>AC Central:</span>
                <span className="font-mono font-bold">Rp {acRate.toLocaleString('id-ID')}</span>
              </div>
            )}
            {includeSound && (
              <div className="flex justify-between text-slate-300">
                <span>Sound System Pro:</span>
                <span className="font-mono font-bold">Rp {soundRate.toLocaleString('id-ID')}</span>
              </div>
            )}
            {includeCleaning && (
              <div className="flex justify-between text-slate-300">
                <span>Kebersihan & Keamanan:</span>
                <span className="font-mono font-bold">Rp {cleaningRate.toLocaleString('id-ID')}</span>
              </div>
            )}
            {includeCatering && (
              <div className="flex justify-between text-slate-300">
                <span>Catering ({guestCount} porsi):</span>
                <span className="font-mono font-bold">Rp {cateringTotal.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm">
              <span className="font-black text-white">ESTIMASI TOTAL:</span>
              <span className="font-mono font-black text-emerald-400 text-lg">Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            onClick={handleSendEstimateWA}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Penawaran Ke WhatsApp Pengelola</span>
          </button>
        </div>

      </div>

    </div>
  );
}
