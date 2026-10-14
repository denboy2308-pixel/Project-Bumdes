import React, { useState } from 'react';
import { 
  AlertCircle, CheckCircle2, Clock, Send, Plus, 
  MessageSquare, ChevronRight, FileText, Image, MapPin,
  RefreshCw, Navigation
} from 'lucide-react';
import { showToast } from '../../ToastNotification';
import { reverseGeocodeGPS } from '../../../services/freeApiService';

export interface ComplaintTicket {
  id: string;
  category: 'Armada Sampah' | 'Fasilitas GOR & Gedung' | 'Tagihan & Kas' | 'Lingkungan Desa';
  title: string;
  description: string;
  location: string;
  status: 'Menunggu Verifikasi' | 'Ditugaskan ke Tim Lapangan' | 'Sedang Dikerjakan' | 'Selesai';
  dateSubmitted: string;
  assignedOfficer?: string;
  resolutionNote?: string;
}

export default function CustomerComplaints() {
  const [activeSubTab, setActiveSubTab] = useState<'daftar-aduan' | 'buat-aduan'>('daftar-aduan');

  // Complaints state
  const [complaints, setComplaints] = useState<ComplaintTicket[]>([
    {
      id: 'TKT-ADU-108',
      category: 'Armada Sampah',
      title: 'Tong Sampah Terpilah Depan Gang Belum Terangkut',
      description: 'Armada truk sampah rute RT 03 belum lewat sejak kemarin lusa, sampah botol daur ulang sudah penuh di depan gang.',
      location: 'Dukuh Waru, RT 03 / RW 01',
      status: 'Sedang Dikerjakan',
      dateSubmitted: '2026-09-05',
      assignedOfficer: 'Slamet Rahardjo (Truk Armada 02)',
      resolutionNote: 'Armada truk 02 dijadwalkan menjemput hari ini pukul 11:00 WIB.'
    },
    {
      id: 'TKT-ADU-094',
      category: 'Fasilitas GOR & Gedung',
      title: 'Lampu LED Lapangan 1 Bagian Pojok Timur Berkedip',
      description: 'Saat sesi main malam kemarin, salah satu lampu sorot LED berkedip sehingga agak silau saat servis.',
      location: 'GOR Badminton Desa Waru',
      status: 'Selesai',
      dateSubmitted: '2026-08-28',
      assignedOfficer: 'Hartini (Teknisi GOR)',
      resolutionNote: 'Driver LED sudah diganti baru oleh teknisi BUMDes pada 29 Agustus 2026.'
    }
  ]);

  // Form State
  const [formCategory, setFormCategory] = useState<'Armada Sampah' | 'Fasilitas GOR & Gedung' | 'Tagihan & Kas' | 'Lingkungan Desa'>('Armada Sampah');
  const [formTitle, setFormTitle] = useState('');
  const [formLocation, setFormLocation] = useState('RT 03 Dukuh Waru');
  const [formDescription, setFormDescription] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const handleDetectGPS = async () => {
    if (!navigator.geolocation) {
      showToast('Browser Anda tidak mendukung geolokasi GPS.', 'warning');
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await reverseGeocodeGPS(pos.coords.latitude, pos.coords.longitude);
          setFormLocation(res.formattedAddress || `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
          showToast('Lokasi kejadian berhasil dideteksi via GPS!', 'success');
        } catch {
          showToast('Gagal memuat alamat dari GPS, gunakan input manual.', 'warning');
        } finally {
          setIsDetectingGps(false);
        }
      },
      () => {
        setIsDetectingGps(false);
        showToast('Izin akses lokasi GPS ditolak atau tidak tersedia.', 'warning');
      },
      { timeout: 8000 }
    );
  };

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      showToast('Harap isi judul dan penjelasan keluhan Anda!', 'warning');
      return;
    }

    const newTicket: ComplaintTicket = {
      id: 'TKT-ADU-' + Math.floor(100 + Math.random() * 900),
      category: formCategory,
      title: formTitle,
      description: formDescription,
      location: formLocation,
      status: 'Menunggu Verifikasi',
      dateSubmitted: '2026-09-06'
    };

    setComplaints([newTicket, ...complaints]);
    setFormTitle('');
    setFormDescription('');
    setActiveSubTab('daftar-aduan');
    showToast('Tiket aduan Anda telah dikirim! Tim piket BUMDes akan segera menindaklanjuti.', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Sub Tabs */}
      <div className="flex items-center justify-between p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveSubTab('daftar-aduan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'daftar-aduan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Tiket Aduan Saya ({complaints.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('buat-aduan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'buat-aduan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Buat Tiket Aduan Baru</span>
          </button>
        </div>

        <span className="hidden sm:inline-block text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold px-3">
          Respon Maks. 1x24 Jam Kerja
        </span>
      </div>

      {/* VIEW 1: DAFTAR ADUAN */}
      {activeSubTab === 'daftar-aduan' && (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
                    #{c.id}
                  </span>
                  <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                    {c.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">📅 {c.dateSubmitted}</span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold self-start sm:self-auto ${
                  c.status === 'Selesai'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                    : c.status === 'Sedang Dikerjakan'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                }`}>
                  {c.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{c.description}</p>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lokasi: {c.location}</span>
                </div>
              </div>

              {/* Resolution Note if any */}
              {c.resolutionNote && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tanggapan Petugas: {c.assignedOfficer}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{c.resolutionNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: BUAT ADUAN BARU */}
      {activeSubTab === 'buat-aduan' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-6">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Layanan Pengaduan Warga</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">Sampaikan Keluhan atau Masukan</h3>
            <p className="text-xs text-slate-500">
              Laporan Anda akan langsung dipantau oleh pengurus BUMDes untuk segera diteruskan kepada petugas terkait.
            </p>
          </div>

          <form onSubmit={handleCreateComplaint} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Kategori Keluhan</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              >
                <option value="Armada Sampah">Armada & Penjemputan Sampah Daur Ulang</option>
                <option value="Fasilitas GOR & Gedung">Fasilitas GOR Bulutangkis & Gedung Pertemuan</option>
                <option value="Tagihan & Kas">Masalah Tagihan, Kuitansi, atau Saldo</option>
                <option value="Lingkungan Desa">Penerangan Jalan & Kebersihan Lingkungan</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Judul Pengaduan</label>
              <input
                type="text"
                required
                placeholder="Contoh: Saldo penimbangan sampah tanggal 4 belum masuk"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lokasi / Alamat Kejadian</label>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isDetectingGps}
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isDetectingGps ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Mendeteksi GPS...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3 h-3 text-emerald-600" />
                      <span>Deteksi GPS Saya</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="RT 03 Dukuh Waru"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Penjelasan Lengkap Masalah</label>
              <textarea
                rows={4}
                required
                placeholder="Tuliskan detail keluhan Anda secara jelas agar petugas dapat langsung memahami dan memperbaikinya..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Tiket Aduan ke BUMDes</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
