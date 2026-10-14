import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle2, Receipt, ArrowRight, Activity } from 'lucide-react';
import { showToast } from './ToastNotification';
import { getTodayJakartaISO, isPastDateJakarta } from '../utils/dateUtils';

export default function SewaLapanganForm() {
  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    tanggal: '',
    lapangan: 'Lapangan 1 (Kayu)',
    durasiJam: '2',
    tipeSewa: 'harian', // harian | member
    catatan: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const hargaPerJam = 25000;
  const hargaMemberBulanan = 80000;
  
  const totalBiaya = formData.tipeSewa === 'harian' 
    ? hargaPerJam * parseInt(formData.durasiJam || '2')
    : hargaMemberBulanan;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama lengkap wajib diisi';
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.whatsapp.trim())) {
      newErrors.whatsapp = 'Format nomor tidak valid';
    }
    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal bermain wajib dipilih';
    } else if (isPastDateJakarta(formData.tanggal)) {
      newErrors.tanggal = 'Tanggal bermain tidak boleh lampau. Silakan pilih hari ini atau tanggal mendatang.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      showToast(
        'Reservasi Berhasil Diajukan',
        'Jadwal bermain Anda berhasil dikunci sementara. Silakan kirim detail ke WhatsApp untuk konfirmasi slot.',
        'success'
      );
    }, 1000);
  };

  const handleSendToWhatsApp = () => {
    const formattedTotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalBiaya);
    const detailSewa = formData.tipeSewa === 'harian' ? `${formData.durasiJam} Jam` : 'Member Bulanan';
    const text = `Halo Admin BUMDES Waskita Wijaya, saya ingin konfirmasi reservasi Sewa Lapangan:\n\n` +
      `👤 *Nama:* ${formData.nama}\n` +
      `📞 *WhatsApp:* ${formData.whatsapp}\n` +
      `🏸 *Pilihan:* ${formData.lapangan}\n` +
      `📅 *Tanggal:* ${formData.tanggal}\n` +
      `⏱️ *Jenis/Durasi:* ${detailSewa}\n` +
      `💰 *Total:* ${formattedTotal}\n` +
      `📝 *Catatan:* ${formData.catatan || '-'}\n\n` +
      `Mohon dibantu konfirmasi slot. Terima kasih!`;
    
    const whatsappUrl = `https://wa.me/6282134567890?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/35 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-6 transition-all duration-300 shadow-sm">
      
      <div className="space-y-1 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
        <h4 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-500 animate-bounce" />
          <span>Formulir Sewa Lapangan</span>
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Reservasi slot bermain harian atau daftarkan paket member bulanan badminton Anda secara instan.
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Tipe Sewa (Tabs) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/50 dark:bg-slate-900/60 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipeSewa: 'harian' })}
              className={`text-center text-xs font-bold py-2 rounded-lg transition-all cursor-pointer ${
                formData.tipeSewa === 'harian' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Non-Member / Harian
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipeSewa: 'member' })}
              className={`text-center text-xs font-bold py-2 rounded-lg transition-all cursor-pointer ${
                formData.tipeSewa === 'member' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Paket Member Bulanan
            </button>
          </div>

          {/* Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>Nama Lengkap</span>
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Masukkan nama lengkap Anda"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20 ${
                errors.nama ? 'border-red-500/80' : 'border-slate-200 dark:border-slate-800 focus:border-amber-500'
              }`}
            />
            {errors.nama && <p className="text-[11px] text-red-500 font-bold">{errors.nama}</p>}
          </div>

          {/* WhatsApp & Pilihan Lapangan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>Nomor WhatsApp</span>
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20 ${
                  errors.whatsapp ? 'border-red-500/80' : 'border-slate-200 dark:border-slate-800 focus:border-amber-500'
                }`}
              />
              {errors.whatsapp && <p className="text-[11px] text-red-500 font-bold">{errors.whatsapp}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-slate-400" />
                <span>Pilih Lapangan</span>
              </label>
              <select
                value={formData.lapangan}
                onChange={(e) => setFormData({ ...formData, lapangan: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-all outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
              >
                <option value="Lapangan 1 (Kayu)">Lapangan 1 (Lantai Kayu)</option>
                <option value="Lapangan 2 (Kayu)">Lapangan 2 (Lantai Kayu)</option>
                <option value="Lapangan 3 (Kayu)">Lapangan 3 (Lantai Kayu)</option>
              </select>
            </div>
          </div>

          {/* Tanggal & Jam */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Tanggal Bermain / Mulai</span>
              </label>
              <input
                type="date"
                min={getTodayJakartaISO()}
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-all outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer ${
                  errors.tanggal ? 'border-red-500/80' : 'border-slate-200 dark:border-slate-800 focus:border-amber-500'
                }`}
              />
              {errors.tanggal && <p className="text-[11px] text-red-500 font-bold">{errors.tanggal}</p>}
            </div>

            {formData.tipeSewa === 'harian' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Durasi Bermain</span>
                </label>
                <select
                  value={formData.durasiJam}
                  onChange={(e) => setFormData({ ...formData, durasiJam: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-all outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
                >
                  <option value="1">1 Jam</option>
                  <option value="2">2 Jam (Direkomendasikan)</option>
                  <option value="3">3 Jam</option>
                  <option value="4">4 Jam</option>
                </select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Jadwal Rutin Member</span>
                </label>
                <div className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium">
                  Rutin 2 Jam / Minggu (Kunci Jadwal Tetap)
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Pricing Banner */}
          <div className="bg-amber-500/10 dark:bg-amber-500/5 rounded-xl border border-amber-500/20 p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                {formData.tipeSewa === 'harian' ? 'Estimasi Biaya' : 'Sewa Paket Member'}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formData.tipeSewa === 'harian' ? `Rp 25.000 × ${formData.durasiJam} Jam` : 'Rutin 1 Bulan Tetap'}
              </p>
            </div>
            <p className="text-lg font-black text-amber-600 dark:text-amber-400">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalBiaya)}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] disabled:opacity-50 text-white font-extrabold text-xs py-3 rounded-xl transition-all duration-200 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            {loading ? (
              <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Booking Lapangan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Success View */
        <div className="space-y-6 text-center py-4">
          <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h5 className="font-extrabold text-slate-900 dark:text-white text-base">Reservasi Lapangan Disimpan!</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Jadwal Anda sudah dikunci sementara. Silakan kirim detail rincian ke WhatsApp Admin untuk validasi dan pembayaran tunai/transfer.
            </p>
          </div>

          {/* Struk */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 text-left max-w-sm mx-auto space-y-3 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
            <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-extrabold tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <span className="flex items-center gap-1"><Receipt className="w-3.5 h-3.5" /> STRUK RESERVASI</span>
              <span>LAPANGAN - WARU</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Penyewa:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formData.nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pilihan:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formData.lapangan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tanggal:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formData.tanggal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Durasi:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formData.tipeSewa === 'harian' ? `${formData.durasiJam} Jam` : 'Member Bulanan'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 text-sm font-black">
                <span className="text-slate-900 dark:text-white">Estimasi Total:</span>
                <span className="text-amber-600 dark:text-amber-500">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalBiaya)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <button
              onClick={() => setIsSubmitted(false)}
              className="flex-1 bg-slate-200/60 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer"
            >
              Ulangi Form
            </button>
            <button
              onClick={handleSendToWhatsApp}
              className="flex-[2] bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.003 2C6.47 2 2 6.48 2 12.01c0 1.84.5 3.56 1.36 5.05L2 22l5.12-1.34c1.42.77 3.03 1.18 4.71 1.18 5.53 0 10.01-4.48 10.01-10.01C21.84 6.48 17.53 2 12.003 2zm5.79 13.9c-.24.69-1.22 1.26-1.68 1.34-.43.08-.99.14-2.85-.63-2.38-.98-3.91-3.39-4.03-3.55-.12-.17-.99-1.32-.99-2.52 0-1.2.63-1.79.85-2.03.22-.24.49-.3.65-.3s.33.01.47.01c.15 0 .34-.06.53.39.2.49.68 1.66.74 1.78.06.12.1.26.02.43-.08.17-.12.28-.24.42-.12.14-.26.31-.37.42-.12.12-.25.25-.1.5.3.5 1.33 2.19 2.85 3.53 1.96 1.73 3.61 2.27 4.12 2.48.51.21.81.18 1.11-.15.3-.33 1.3-1.51 1.64-2.02.34-.51.68-.42 1.14-.25.46.17 2.92 1.37 3.42 1.62.5.25.83.37.95.57.12.2.12 1.18-.12 1.87z"/>
              </svg>
              <span>Kirim ke WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
