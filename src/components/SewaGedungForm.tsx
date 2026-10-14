import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  FileText, 
  CheckCircle2, 
  Receipt, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Check, 
  DollarSign,
  Send,
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';
import { showToast } from './ToastNotification';
import { getTodayJakartaISO, isPastDateJakarta } from '../utils/dateUtils';

interface SewaGedungFormProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

export default function SewaGedungForm({ selectedDate, onDateChange }: SewaGedungFormProps = {}) {
  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    tanggal: selectedDate || getTodayJakartaISO(),
    durasi: '1',
    jenisAcara: 'Pernikahan',
    catatan: '',
    extraChairs: false,
    soundSystemPro: false,
    standingAc: false
  });

  React.useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, tanggal: selectedDate }));
    }
  }, [selectedDate]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const hargaPokokPerHari = 2500000;
  const durasiHari = parseInt(formData.durasi || '1', 10);
  const subtotalPokok = hargaPokokPerHari * durasiHari;

  // Additional options pricing
  const extraChairsPrice = formData.extraChairs ? 150000 : 0;
  const soundSystemProPrice = formData.soundSystemPro ? 350000 : 0;
  const standingAcPrice = formData.standingAc ? 200000 : 0;
  const totalBiaya = subtotalPokok + extraChairsPrice + soundSystemProPrice + standingAcPrice;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama pemohon wajib diisi sesuai KTP';
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.whatsapp.trim())) {
      newErrors.whatsapp = 'Format nomor WhatsApp tidak valid (contoh: 08123456789)';
    }
    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal mulai sewa wajib dipilih';
    } else if (isPastDateJakarta(formData.tanggal)) {
      newErrors.tanggal = 'Tanggal sewa gedung tidak boleh lampau. Silakan pilih hari ini atau tanggal mendatang.';
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
      const newTicket = `WARU-AULA-${Date.now().toString().slice(-6)}`;
      setTicketId(newTicket);
      setIsSubmitted(true);
      showToast(
        'Reservasi Berhasil Diajukan!',
        'Jadwal aula Anda telah dicatat sementara. Silakan hubungi admin WhatsApp untuk verifikasi.',
        'success'
      );
    }, 800);
  };

  const handleSendToWhatsApp = () => {
    const formattedTotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalBiaya);
    
    const extrasList = [];
    if (formData.extraChairs) extrasList.push('Tambahan 100 Kursi Lipat (+Rp 150rb)');
    if (formData.soundSystemPro) extrasList.push('Sound System Pro & Mic Wireless (+Rp 350rb)');
    if (formData.standingAc) extrasList.push('Pendingin Ruang Standing AC (+Rp 200rb)');

    const text = `*PENGAJUAN SEWA GEDUNG PERTEMUAN WASKITA WIJAYA*\n\n` +
      `🎟️ *Kode Draft:* ${ticketId || 'WARU-AULA-NEW'}\n` +
      `👤 *Nama Pemohon:* ${formData.nama}\n` +
      `📞 *No. WhatsApp:* ${formData.whatsapp}\n` +
      `📅 *Mulai Tanggal:* ${formData.tanggal}\n` +
      `⏱️ *Durasi Sewa:* ${formData.durasi} Hari\n` +
      `🎉 *Jenis Acara:* ${formData.jenisAcara}\n` +
      (extrasList.length > 0 ? `📦 *Tambahan Fasilitas:* ${extrasList.join(', ')}\n` : '') +
      `💰 *Estimasi Total:* ${formattedTotal}\n` +
      `📝 *Catatan Khusus:* ${formData.catatan || '-'}\n\n` +
      `Halo Pengurus BUMDES Waskita Wijaya Desa Waru, mohon konfirmasi ketersediaan tanggal gedung di atas dan nomor rekening pembayaran DP 30%. Terima kasih!`;
    
    const whatsappUrl = `https://wa.me/6282134567890?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleReset = () => {
    setFormData({
      nama: '',
      whatsapp: '',
      tanggal: '',
      durasi: '1',
      jenisAcara: 'Pernikahan',
      catatan: '',
      extraChairs: false,
      soundSystemPro: false,
      standingAc: false
    });
    setIsSubmitted(false);
    setErrors({});
  };

  return (
    <div className="bg-slate-900/95 dark:bg-slate-950 border border-slate-700/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl text-white transition-all">
      
      {/* Header Form */}
      <div className="space-y-1.5 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-7 h-7 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-xs font-black">
            📋
          </span>
          <h4 className="font-black text-white text-base sm:text-lg">
            Formulir Reservasi Gedung
          </h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Isi data pemesanan di bawah untuk menghitung estimasi biaya dan mengajukan tanggal ke BUMDES.
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Nama Lengkap Pemohon (Sesuai KTP) <span className="text-red-400">*</span></span>
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Bp. Bambang Suryono"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 text-white placeholder:text-slate-500 transition-all outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.nama 
                  ? 'border-red-500/80' 
                  : 'border-slate-800 focus:border-blue-500'
              }`}
            />
            {errors.nama && (
              <p className="text-[11px] text-red-400 font-semibold">{errors.nama}</p>
            )}
          </div>

          {/* WhatsApp & Jenis Acara Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* No WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Nomor WhatsApp <span className="text-red-400">*</span></span>
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="Contoh: 08123456789"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 text-white placeholder:text-slate-500 transition-all outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.whatsapp 
                    ? 'border-red-500/80' 
                    : 'border-slate-800 focus:border-blue-500'
                }`}
              />
              {errors.whatsapp && (
                <p className="text-[11px] text-red-400 font-semibold">{errors.whatsapp}</p>
              )}
            </div>

            {/* Jenis Acara */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Jenis Acara / Agenda</span>
              </label>
              <select
                value={formData.jenisAcara}
                onChange={(e) => setFormData({ ...formData, jenisAcara: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 text-xs bg-slate-950 text-white transition-all outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Pernikahan">Resepsi Pernikahan / Hajatan</option>
                <option value="Seminar">Seminar / Rapat Umum</option>
                <option value="Pameran">Pameran / Bazar Pasar Desa</option>
                <option value="Keagamaan">Pengajian / Kegiatan Keagamaan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Tanggal & Durasi Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Tanggal Sewa */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Mulai Tanggal <span className="text-red-400">*</span></span>
                </span>
                {formData.tanggal && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800/60">
                    ✓ Terpilih
                  </span>
                )}
              </label>
              <input
                type="date"
                min={getTodayJakartaISO()}
                value={formData.tanggal}
                onChange={(e) => {
                  setFormData({ ...formData, tanggal: e.target.value });
                  if (onDateChange) onDateChange(e.target.value);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 text-white transition-all outline-none focus:border-blue-500 cursor-pointer ${
                  errors.tanggal 
                    ? 'border-red-500/80' 
                    : 'border-slate-800 focus:border-blue-500'
                }`}
              />
              {errors.tanggal && (
                <p className="text-[11px] text-red-400 font-semibold">{errors.tanggal}</p>
              )}
            </div>

            {/* Durasi Sewa */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Durasi Penyewaan</span>
              </label>
              <select
                value={formData.durasi}
                onChange={(e) => setFormData({ ...formData, durasi: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 text-xs bg-slate-950 text-white transition-all outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="1">1 Hari (07.00 - 23.00 WIB)</option>
                <option value="2">2 Hari (Hajatan & Resepsi)</option>
                <option value="3">3 Hari (Pameran / Bazar)</option>
                <option value="4">4 Hari</option>
                <option value="5">5 Hari</option>
              </select>
            </div>
          </div>

          {/* Optional Add-on Packages */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold text-slate-300 block">
              Tambahan Fasilitas Ekstra (Opsional):
            </label>
            
            <div className="space-y-2 text-xs">
              <label className="flex items-center space-x-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.extraChairs}
                  onChange={(e) => setFormData({ ...formData, extraChairs: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0 cursor-pointer"
                />
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-slate-300">Tambahan 100 Kursi Lipat Tamu</span>
                  <span className="text-emerald-400 font-bold">+Rp 150.000</span>
                </div>
              </label>

              <label className="flex items-center space-x-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.soundSystemPro}
                  onChange={(e) => setFormData({ ...formData, soundSystemPro: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0 cursor-pointer"
                />
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-slate-300">Sound System Pro + 4 Mic Wireless</span>
                  <span className="text-emerald-400 font-bold">+Rp 350.000</span>
                </div>
              </label>

              <label className="flex items-center space-x-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.standingAc}
                  onChange={(e) => setFormData({ ...formData, standingAc: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0 cursor-pointer"
                />
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-slate-300">Pendingin Ruang Standing AC Ekstra</span>
                  <span className="text-emerald-400 font-bold">+Rp 200.000</span>
                </div>
              </label>
            </div>
          </div>

          {/* Catatan Tambahan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Catatan Tambahan / Permintaan Khusus:</span>
            </label>
            <textarea
              rows={2}
              value={formData.catatan}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              placeholder="Contoh: Butuh penambahan daya listrik cadangan, tambahan meja katering, dsb..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 text-xs bg-slate-950 text-white placeholder:text-slate-500 transition-all outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Transparent Cost Calculation View */}
          <div className="bg-slate-950 rounded-2xl border border-blue-500/30 p-4 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Sewa Aula ({formData.durasi} Hari):</span>
              <span className="font-bold text-white">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(subtotalPokok)}
              </span>
            </div>

            {(formData.extraChairs || formData.soundSystemPro || formData.standingAc) && (
              <div className="flex justify-between items-center text-slate-400 border-t border-slate-800 pt-1">
                <span>Total Fasilitas Ekstra:</span>
                <span className="font-bold text-emerald-400">
                  +{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(extraChairsPrice + soundSystemProPrice + standingAcPrice)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm font-black">
              <span className="text-white">Estimasi Total Biaya:</span>
              <span className="text-blue-400 text-base">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalBiaya)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-blue-950/50 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            {loading ? (
              <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Periksa Jadwal & Ajukan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Success Receipt View */
        <div className="space-y-5 text-center py-2 animate-in fade-in">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h5 className="font-black text-white text-base">Reservasi Berhasil Diajukan!</h5>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Draf jadwal Anda telah dicatat di sistem BUMDES. Silakan kirim detail ini ke WhatsApp admin untuk verifikasi kalender desa dan pembayaran DP.
            </p>
          </div>

          {/* Receipt Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-2.5 text-xs shadow-inner">
            <div className="flex justify-between items-center text-[10px] text-slate-400 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1 font-bold text-blue-400"><Receipt className="w-3.5 h-3.5" /> STRUK ESTIMASI</span>
              <span className="font-mono text-emerald-400 font-bold">{ticketId}</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Nama Pemohon:</span>
                <span className="font-bold text-white">{formData.nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor WhatsApp:</span>
                <span className="font-bold text-white">{formData.whatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tanggal Acara:</span>
                <span className="font-bold text-white">{formData.tanggal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Agenda & Durasi:</span>
                <span className="font-bold text-white">{formData.jenisAcara} ({formData.durasi} Hari)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-black">
                <span className="text-white">Estimasi Total:</span>
                <span className="text-blue-400">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalBiaya)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={handleReset}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Ulangi Form
            </button>
            <button
              onClick={handleSendToWhatsApp}
              className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs rounded-xl transition-all shadow-lg shadow-green-950/50 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Send className="w-4 h-4" />
              <span>Kirim ke WhatsApp Admin</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
