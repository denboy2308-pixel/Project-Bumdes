import React, { useState } from 'react';
import { 
  Radio, 
  Send, 
  Mail, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Users,
  Eye,
  RefreshCw
} from 'lucide-react';

interface BroadcastItem {
  id: string;
  title: string;
  message: string;
  category: 'info' | 'gangguan' | 'promo';
  displayMode: 'once' | 'timer';
  timerHours: number;
  sendEmail: boolean;
  emailProgress: {
    sent: number;
    total: number;
    completed: boolean;
  };
  readCount: number;
  totalRecipients: number;
  createdAt: string;
  active: boolean;
}

const INITIAL_BROADCASTS: BroadcastItem[] = [
  {
    id: 'BC-2026-01',
    title: 'Pemadaman Listrik & Perawatan Rutin Lapangan GOR',
    message: 'Diberitahukan kepada seluruh pengguna lapangan bulutangkis bahwa malam ini pukul 22.00 - 05.00 WIB akan dilakukan perawatan instalasi kabel lampu penerangan utama.',
    category: 'gangguan',
    displayMode: 'timer',
    timerHours: 3,
    sendEmail: true,
    emailProgress: { sent: 240, total: 240, completed: true },
    readCount: 228,
    totalRecipients: 240,
    createdAt: '06 Sep 2026, 09:00',
    active: true
  },
  {
    id: 'BC-2026-02',
    title: 'Diskon 25% Sewa Aula Serbaguna Khusus Warga Desa Waru',
    message: 'BUMDes Waskita Wijaya memberikan potongan tarif spesial untuk sewa aula pernikahan dan khitanan selama bulan September ini bagi warga ber-KTP Desa Waru.',
    category: 'promo',
    displayMode: 'once',
    timerHours: 0,
    sendEmail: true,
    emailProgress: { sent: 180, total: 240, completed: false },
    readCount: 165,
    totalRecipients: 240,
    createdAt: '04 Sep 2026, 14:15',
    active: true
  }
];

interface BroadcastModuleProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function BroadcastModule({ onShowToast }: BroadcastModuleProps) {
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>(() => {
    try {
      const stored = localStorage.getItem('bumdes_broadcast_items');
      return stored ? JSON.parse(stored) : INITIAL_BROADCASTS;
    } catch {
      return INITIAL_BROADCASTS;
    }
  });
  
  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'info' | 'gangguan' | 'promo'>('info');
  const [displayMode, setDisplayMode] = useState<'once' | 'timer'>('once');
  const [timerHours, setTimerHours] = useState<number>(2);
  const [sendEmail, setSendEmail] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveAndNotify = (newList: BroadcastItem[]) => {
    setBroadcasts(newList);
    localStorage.setItem('bumdes_broadcast_items', JSON.stringify(newList));
    window.dispatchEvent(new Event('bumdes-broadcasts-updated'));
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      onShowToast('Judul dan pesan siaran wajib diisi', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newBroadcast: BroadcastItem = {
        id: `BC-2026-${String(broadcasts.length + 1).padStart(2, '0')}`,
        title: title.trim(),
        message: message.trim(),
        category,
        displayMode,
        timerHours: displayMode === 'timer' ? timerHours : 0,
        sendEmail,
        emailProgress: {
          sent: sendEmail ? 20 : 0,
          total: sendEmail ? 240 : 0,
          completed: !sendEmail
        },
        readCount: 1,
        totalRecipients: 240,
        createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
        active: true
      };

      // Remove dismissal record so it pops up cleanly
      localStorage.removeItem(`bumdes_bc_dismissed_${newBroadcast.id}`);
      localStorage.removeItem(`bumdes_bc_timer_${newBroadcast.id}`);

      const updated = [newBroadcast, ...broadcasts];
      saveAndNotify(updated);
      setTitle('');
      setMessage('');
      setIsSubmitting(false);
      onShowToast('Notifikasi siaran berhasil diterbitkan ke portal warga & email throttler!', 'success');
    }, 400);
  };

  const handleToggleActive = (id: string) => {
    const updated = broadcasts.map(b => b.id === id ? { ...b, active: !b.active } : b);
    saveAndNotify(updated);
    onShowToast('Status penayangan siaran diperbarui', 'info');
  };

  const handleDeleteBroadcast = (id: string) => {
    const updated = broadcasts.filter(b => b.id !== id);
    saveAndNotify(updated);
    onShowToast('Siaran berhasil dihapus dari histori', 'info');
  };

  const handleAdvanceEmailBatch = (id: string) => {
    const updated = broadcasts.map(b => {
      if (b.id !== id || !b.sendEmail) return b;
      const nextSent = Math.min(b.emailProgress.total, b.emailProgress.sent + 20);
      return {
        ...b,
        emailProgress: {
          ...b.emailProgress,
          sent: nextSent,
          completed: nextSent >= b.emailProgress.total
        }
      };
    });
    saveAndNotify(updated);
    onShowToast('Batch AI Throttler berikutnya (+20 email) berhasil dikirim!', 'success');
  };

  const handlePreviewPopup = (bc: BroadcastItem) => {
    // Reset dismiss so user can preview it
    localStorage.removeItem(`bumdes_bc_dismissed_${bc.id}`);
    localStorage.removeItem(`bumdes_bc_timer_${bc.id}`);
    window.dispatchEvent(new Event('bumdes-broadcasts-updated'));
    onShowToast(`Simulasi pop-up "${bc.title}" diaktifkan di portal warga!`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
              <span>Menu Broadcast (Notifikasi Siaran Massal & Email AI Throttler)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                MULTI-CHANNEL
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Terbitkan pengumuman otomatis sebagai modal pop-up beranimasi di portal pelanggan dan kirim salinan email bertahap.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-800 rounded-xl font-mono font-bold">
            👥 240 Warga Aktif
          </span>
        </div>
      </div>

      {/* Formulir Penerbitan Siaran */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
          <span>Tulis & Konfigurasi Siaran Baru</span>
        </h4>

        <form onSubmit={handleCreateBroadcast} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Judul Notifikasi Siaran *
              </label>
              <input 
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: Pemberitahuan Pemadaman Listrik Area GOR Lapangan"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Kategori Pesan
              </label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="info">ℹ️ Info Layanan Resmi</option>
                <option value="gangguan">🚨 Gangguan Massal / Darurat</option>
                <option value="promo">🎉 Promo & Acara Desa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Isi Pesan Siaran Lengkap *
            </label>
            <textarea 
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tulis pesan lengkap yang akan tampil di modal pop-up warga..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Konfigurasi Tayang & Email Throttler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <label className="text-xs font-bold text-white block mb-2">
                Aturan Tampil Pop-Up di Dashboard Pelanggan:
              </label>
              <div className="space-y-2.5 text-xs text-slate-300">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input 
                    type="radio" 
                    name="displayMode" 
                    checked={displayMode === 'once'} 
                    onChange={() => setDisplayMode('once')}
                    className="text-rose-500 focus:ring-0" 
                  />
                  <span><strong>1× Tampil:</strong> Tiap pelanggan melihat sekali sampai ditutup.</span>
                </label>
                
                <div className="space-y-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="displayMode" 
                      checked={displayMode === 'timer'} 
                      onChange={() => setDisplayMode('timer')}
                      className="text-rose-500 focus:ring-0" 
                    />
                    <span><strong>Timer Interval:</strong> Terus tampil kembali selama X jam (Cocok utk Gangguan Massal).</span>
                  </label>
                  {displayMode === 'timer' && (
                    <div className="pl-6 flex items-center space-x-2">
                      <span className="text-[11px] text-slate-400">Ulangi setiap:</span>
                      <select 
                        value={timerHours}
                        onChange={e => setTimerHours(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-bold"
                      >
                        <option value={1}>1 Jam</option>
                        <option value={2}>2 Jam</option>
                        <option value={4}>4 Jam</option>
                        <option value={8}>8 Jam</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={sendEmail}
                  onChange={e => setSendEmail(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-500 focus:ring-0" 
                />
                <div>
                  <span className="text-xs font-black text-white block">
                    📧 Kirim juga ke EMAIL semua pelanggan aktif
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    (dikirim bertahap oleh AI Brain, ±20 email/4 mnt — progres tampil di daftar).
                  </span>
                </div>
              </label>

              {sendEmail && (
                <div className="mt-3 p-2.5 bg-emerald-950/50 border border-emerald-800/80 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>AI Brain Throttler aktif: Menjaga reputasi IP domain desa agar tidak diblokir spam.</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-900/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Menerbitkan Siaran...' : '🚀 Terbitkan Notifikasi Siaran Masal'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Riwayat Notifikasi Siaran */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Tabel Riwayat Notifikasi Siaran
            </h4>
            <span className="text-[11px] text-slate-400">Pantau status penayangan dan progres pengiriman email AI</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Total: {broadcasts.length} Siaran</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Judul & Isi Siaran</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Mode Tampil</th>
                <th className="px-4 py-3.5">Progres Email AI Brain</th>
                <th className="px-4 py-3.5">Keterbacaan</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {broadcasts.map((bc) => (
                <tr key={bc.id} className="hover:bg-slate-850 transition-colors">
                  <td className="px-5 py-4 max-w-xs">
                    <span className="font-bold text-white block">{bc.title}</span>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{bc.message}</p>
                    <span className="text-[10px] text-slate-500 font-mono block mt-1">ID: {bc.id} · {bc.createdAt}</span>
                  </td>

                  <td className="px-4 py-4">
                    {bc.category === 'gangguan' && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                        🚨 Gangguan
                      </span>
                    )}
                    {bc.category === 'info' && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                        ℹ️ Info
                      </span>
                    )}
                    {bc.category === 'promo' && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                        🎉 Promo
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-slate-300">
                    {bc.displayMode === 'once' ? (
                      <span className="text-xs">1× Tampil (Modal)</span>
                    ) : (
                      <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Timer ({bc.timerHours} Jam)</span>
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    {bc.sendEmail ? (
                      <div className="space-y-1">
                        <div className="w-28 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-1.5 rounded-full transition-all" 
                            style={{ width: `${Math.round((bc.emailProgress.sent / bc.emailProgress.total) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {bc.emailProgress.sent} / {bc.emailProgress.total} Email
                          {bc.emailProgress.completed ? ' (Selesai)' : ' (Berjalan...)'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Tanpa Email</span>
                    )}
                  </td>

                  <td className="px-4 py-4 font-mono">
                    <span className="text-emerald-400 font-bold block">
                      {Math.round((bc.readCount / bc.totalRecipients) * 100)}%
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {bc.readCount} dari {bc.totalRecipients} Warga
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(bc.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        bc.active 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {bc.active ? '● Aktif Tayang' : '⚪ Dijeda'}
                    </button>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handlePreviewPopup(bc)}
                        title="Simulasikan kemunculan modal pop-up ini di layar warga"
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Simulasi</span>
                      </button>

                      {bc.sendEmail && !bc.emailProgress.completed && (
                        <button
                          type="button"
                          onClick={() => handleAdvanceEmailBatch(bc.id)}
                          title="Percepat pengiriman batch throttler AI (+20 email)"
                          className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[10px] font-bold rounded-lg border border-emerald-800 transition-colors cursor-pointer"
                        >
                          +20 Email
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteBroadcast(bc.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-bold hover:underline cursor-pointer pl-1"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
