import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  X, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  BellRing
} from 'lucide-react';

export interface PublicBroadcast {
  id: string;
  title: string;
  message: string;
  category: 'info' | 'gangguan' | 'promo';
  displayMode: 'once' | 'timer';
  timerHours: number;
  active: boolean;
  createdAt: string;
}

const DEFAULT_BROADCASTS: PublicBroadcast[] = [
  {
    id: 'BC-2026-01',
    title: 'Pemadaman Listrik & Perawatan Rutin Lapangan GOR',
    message: 'Diberitahukan kepada seluruh pengguna lapangan bulutangkis bahwa malam ini pukul 22.00 - 05.00 WIB akan dilakukan perawatan instalasi kabel lampu penerangan utama.',
    category: 'gangguan',
    displayMode: 'timer',
    timerHours: 3,
    active: true,
    createdAt: '06 Sep 2026, 09:00'
  },
  {
    id: 'BC-2026-02',
    title: 'Diskon 25% Sewa Aula Serbaguna Khusus Warga Desa Waru',
    message: 'BUMDes Waskita Wijaya memberikan potongan tarif spesial untuk sewa aula pernikahan dan khitanan selama bulan September ini bagi warga ber-KTP Desa Waru.',
    category: 'promo',
    displayMode: 'once',
    timerHours: 0,
    active: true,
    createdAt: '04 Sep 2026, 14:15'
  }
];

export default function BroadcastPopupModal() {
  const [activeBroadcast, setActiveBroadcast] = useState<PublicBroadcast | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const checkBroadcasts = () => {
    try {
      const stored = localStorage.getItem('bumdes_broadcast_items');
      const list: PublicBroadcast[] = stored ? JSON.parse(stored) : DEFAULT_BROADCASTS;
      
      const activeList = list.filter(b => b.active);
      if (activeList.length === 0) {
        setIsOpen(false);
        setActiveBroadcast(null);
        return;
      }

      // Prioritize 'gangguan' then first active
      const candidate = activeList.find(b => b.category === 'gangguan') || activeList[0];
      if (!candidate) return;

      const now = Date.now();
      if (candidate.displayMode === 'once') {
        const dismissed = localStorage.getItem(`bumdes_bc_dismissed_${candidate.id}`);
        if (!dismissed) {
          setActiveBroadcast(candidate);
          setIsOpen(true);
        }
      } else if (candidate.displayMode === 'timer') {
        const lastDismissedStr = localStorage.getItem(`bumdes_bc_timer_${candidate.id}`);
        if (!lastDismissedStr) {
          setActiveBroadcast(candidate);
          setIsOpen(true);
        } else {
          const lastDismissed = parseInt(lastDismissedStr, 10);
          const intervalMs = (candidate.timerHours || 2) * 60 * 60 * 1000;
          if (now - lastDismissed >= intervalMs) {
            setActiveBroadcast(candidate);
            setIsOpen(true);
          }
        }
      }
    } catch (e) {
      console.error('Error checking broadcasts:', e);
    }
  };

  useEffect(() => {
    // Check on mount
    const timer = setTimeout(() => {
      checkBroadcasts();
    }, 1000);

    const handleUpdate = () => {
      checkBroadcasts();
    };

    window.addEventListener('bumdes-broadcasts-updated', handleUpdate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('bumdes-broadcasts-updated', handleUpdate);
    };
  }, []);

  const handleDismiss = () => {
    if (!activeBroadcast) return;
    const now = Date.now();
    if (activeBroadcast.displayMode === 'once') {
      localStorage.setItem(`bumdes_bc_dismissed_${activeBroadcast.id}`, 'true');
    } else {
      localStorage.setItem(`bumdes_bc_timer_${activeBroadcast.id}`, now.toString());
    }
    setIsOpen(false);
  };

  if (!isOpen || !activeBroadcast) return null;

  let badgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  let badgeIcon = <Info className="w-4 h-4" />;
  let badgeText = 'PENGUMUMAN RESMI';
  let headerBg = 'from-blue-600/20 to-slate-900';

  if (activeBroadcast.category === 'gangguan') {
    badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    badgeIcon = <AlertTriangle className="w-4 h-4" />;
    badgeText = 'PEMBERITAHUAN GANGGUAN MASAL';
    headerBg = 'from-rose-600/25 to-slate-900';
  } else if (activeBroadcast.category === 'promo') {
    badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    badgeIcon = <Sparkles className="w-4 h-4" />;
    badgeText = 'PROGRAM PROMO WARGA DESA';
    headerBg = 'from-emerald-600/25 to-slate-900';
  }

  return (
    <div 
      id="broadcast-popup-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div 
        id="broadcast-popup-modal-container"
        className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative text-slate-100"
      >
        {/* Modal Glow Accent */}
        <div className={`p-6 bg-gradient-to-b ${headerBg} border-b border-slate-800 relative`}>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Tutup Notifikasi Siaran"
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2.5 mb-2.5">
            <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
              <BellRing className="w-5 h-5 text-amber-400 animate-bounce" />
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider border flex items-center gap-1.5 ${badgeColor}`}>
              {badgeIcon}
              <span>{badgeText}</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-white leading-snug">
            {activeBroadcast.title}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Diterbitkan: {activeBroadcast.createdAt} · BUMDes Waskita Wijaya</span>
          </p>
        </div>

        {/* Modal Message Body */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
            {activeBroadcast.message}
          </div>

          {activeBroadcast.displayMode === 'timer' && (
            <div className="flex items-center gap-2 text-[11px] text-amber-300/90 bg-amber-950/30 p-3 rounded-xl border border-amber-800/40">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>
                Notifikasi ini dalam mode interval otomatis (muncul kembali setiap {activeBroadcast.timerHours} jam jika belum selesai).
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Saya Mengerti / Tutup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
