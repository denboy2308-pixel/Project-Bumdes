import React, { useState } from 'react';
import { 
  Calendar, QrCode, CreditCard, MessageSquare, AlertCircle, 
  User as UserIcon, Store, Coins, Shield, Sparkles, Plus, 
  Trash2, Building2, CheckCircle2, ChevronRight, Phone, Gift,
  Send, TrendingUp, Award, Clock, MapPin, Calculator, Navigation,
  RefreshCw, ExternalLink, Smartphone
} from 'lucide-react';
import { User, Transaction } from '../../types';
import { showToast } from '../ToastNotification';
import { reverseGeocodeGPS } from '../../services/freeApiService';

// Free API & Interactive Modal Components
import CustomerWeatherWidget from './pengguna/CustomerWeatherWidget';
import CustomerDigitalPassModal from './pengguna/CustomerDigitalPassModal';
import WasteCuanCalculatorModal from './pengguna/WasteCuanCalculatorModal';

// Subcomponents for Customer Portal
import CustomerScheduleAndBooking from './pengguna/CustomerScheduleAndBooking';
import CustomerMarketplace from './pengguna/CustomerMarketplace';
import CustomerPaymentHistory from './pengguna/CustomerPaymentHistory';
import CustomerComplaints from './pengguna/CustomerComplaints';
import CustomerMessages from './pengguna/CustomerMessages';
import CustomerProfileEdit from './pengguna/CustomerProfileEdit';

interface PenggunaViewProps {
  currentUser: User;
  token: string;
}

export type CustomerPortalTab = 
  | 'ringkasan'
  | 'jadwal-reservasi'
  | 'marketplace-umkm'
  | 'riwayat-pembayaran'
  | 'tiket-aduan'
  | 'pesan'
  | 'profil-akun';

export default function PenggunaView({ currentUser, token }: PenggunaViewProps) {
  const [activeTab, setActiveTab] = useState<CustomerPortalTab>('ringkasan');
  const [userState, setUserState] = useState<User>(currentUser);

  // E-Wallet Balance & Points State
  const [saldo, setSaldo] = useState(245000);
  const [poin, setPoin] = useState(1450);

  // Modals state
  const [isDigitalPassModalOpen, setIsDigitalPassModalOpen] = useState(false);
  const [isCuanCalculatorOpen, setIsCuanCalculatorOpen] = useState(false);

  // User's trash transaction history
  const [userTxHistory, setUserTxHistory] = useState<Transaction[]>([
    {
      id: 'TX-NSB-901',
      tanggal: '2026-07-20',
      jenis: 'Masuk',
      kategori: 'Botol Plastik PET (12 Kg)',
      berat: 12,
      hargaPerKg: 5000,
      total: 60000,
      petugas: 'Slamet Rahardjo'
    },
    {
      id: 'TX-NSB-892',
      tanggal: '2026-07-10',
      jenis: 'Masuk',
      kategori: 'Koran & Karton Dus (20 Kg)',
      berat: 20,
      hargaPerKg: 3500,
      total: 70000,
      petugas: 'Hartini'
    },
    {
      id: 'TX-NSB-755',
      tanggal: '2026-07-01',
      jenis: 'Keluar',
      kategori: 'Penarikan Tunai Kas Mandiri',
      berat: 0,
      hargaPerKg: 0,
      total: -50000,
      petugas: 'Slamet Rahardjo'
    }
  ]);

  // Request Pickup Form State
  const [pickupDate, setPickupDate] = useState('2026-09-08');
  const [pickupAddress, setPickupAddress] = useState('Jl. Dahlia No. 14, RT 03 / RW 01, Desa Waru');
  const [pickupEstimasi, setPickupEstimasi] = useState('Botol Plastik (10 Kg) + Kardus Dus (15 Kg)');
  const [estimatedRupiah, setEstimatedRupiah] = useState(87500);
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  // GPS Auto-Detect using OpenStreetMap Nominatim Free API
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      showToast('Perangkat tidak mendukung deteksi GPS!', 'warning');
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const result = await reverseGeocodeGPS(latitude, longitude);
          setPickupAddress(result.formattedAddress);
          showToast(`Lokasi GPS berhasil dideteksi via OpenStreetMap: ${result.road}, ${result.village}`, 'success');
        } catch {
          showToast('Gagal memproses alamat GPS, silakan ketik manual', 'warning');
        } finally {
          setIsGpsLoading(false);
        }
      },
      (err) => {
        setIsGpsLoading(false);
        showToast('Izin akses lokasi perangkat ditolak atau tidak tersedia.', 'info');
      },
      { timeout: 8000 }
    );
  };

  const handleApplyCuanEstimate = (summaryText: string, estimatedTotal: number) => {
    setPickupEstimasi(summaryText);
    setEstimatedRupiah(estimatedTotal);
  };

  const handleRequestPickup = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Permintaan penjemputan sampah berhasil dikirim ke Armada Truk RT! Petugas akan tiba sesuai tanggal.', 'success');
  };

  const handleUpdateProfile = (updated: Partial<User>) => {
    setUserState(prev => ({ ...prev, ...updated }));
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 pb-16 md:pb-6">
      
      {/* HEADER: KARTU IDENTITAS PELANGGAN & SALDO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Digital Membership Pass Card */}
        <div className="lg:col-span-1 bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  Pas Digital Warga Desa
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDigitalPassModalOpen(true)}
                className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Lihat QR</span>
              </button>
            </div>

            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-white tracking-tight">
                {userState.name || currentUser.name || currentUser.email}
              </h2>
              <div className="text-xs text-slate-300 font-mono">
                ID Pelanggan: <strong className="text-white">{currentUser.nasabahId || 'NSB-38290'}</strong>
              </div>
              <div className="text-xs text-slate-400">
                NIK: {currentUser.nik ? `${currentUser.nik.substring(0, 4)}••••••••${currentUser.nik.substring(currentUser.nik.length - 2)}` : '3302••••••••02'} · RT 03 / RW 01 Waru
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Saldo Tabungan</span>
              <span className="text-base font-bold font-mono text-emerald-400">
                Rp {saldo.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Poin BUMDes</span>
              <span className="text-xs font-semibold font-mono text-amber-300 flex items-center justify-end gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                {poin} Poin
              </span>
            </div>
          </div>
        </div>

        {/* Quick Greeting & Action Banner */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Portal Warga BUMDes Waskita Wijaya</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Halo, {userState.name?.split(' ')[0] || currentUser.name?.split(' ')[0] || 'Warga'}! Mau beraktivitas apa hari ini?
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Akses cepat jadwal lapangan GOR, reservasi tempat, belanja produk UMKM lokal desa, bayar tagihan sampah, dan sampaikan aduan secara langsung.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('jadwal-reservasi')}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-left hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer transition-colors"
            >
              <Calendar className="w-4 h-4 text-emerald-600 mb-1" />
              <div className="text-xs font-semibold text-slate-900 dark:text-white">Jadwal & Booking</div>
              <div className="text-[11px] text-slate-500">GOR & Gedung</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('marketplace-umkm')}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-left hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer transition-colors"
            >
              <Store className="w-4 h-4 text-amber-600 mb-1" />
              <div className="text-xs font-semibold text-slate-900 dark:text-white">Marketplace UMKM</div>
              <div className="text-[11px] text-slate-500">Beli & Daftarkan</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('riwayat-pembayaran')}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-left hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer transition-colors"
            >
              <CreditCard className="w-4 h-4 text-blue-600 mb-1" />
              <div className="text-xs font-semibold text-slate-900 dark:text-white">Bayar & Tagihan</div>
              <div className="text-[11px] text-slate-500">Kuitansi QRIS</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tiket-aduan')}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-left hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer transition-colors"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 mb-1" />
              <div className="text-xs font-semibold text-slate-900 dark:text-white">Tiket Aduan</div>
              <div className="text-[11px] text-slate-500">Lapor Keluhan</div>
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL MENU NAVIGATION FOR CUSTOMER PORTAL */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('ringkasan')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
            activeTab === 'ringkasan'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Beranda Pelanggan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('jadwal-reservasi')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
            activeTab === 'jadwal-reservasi'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Jadwal & Reservasi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('marketplace-umkm')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
            activeTab === 'marketplace-umkm'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Marketplace UMKM</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('riwayat-pembayaran')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
            activeTab === 'riwayat-pembayaran'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Riwayat Pembayaran</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tiket-aduan')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
            activeTab === 'tiket-aduan'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Tiket Aduan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pesan')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
            activeTab === 'pesan'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Pesan & Bantuan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profil-akun')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
            activeTab === 'profil-akun'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>Profil & Akun</span>
        </button>
      </div>

      {/* TAB 1: RINGKASAN / BERANDA PELANGGAN */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-6">
          
          {/* Live Open-Meteo Satellite Weather Widget (Free API) */}
          <CustomerWeatherWidget 
            onSelectBooking={() => setActiveTab('jadwal-reservasi')} 
          />

          {/* Active Schedule & Next Agenda Card */}
          <div className="p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Jadwal Terdekat Anda</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Sewa Lapangan 1 GOR Badminton Waru (PB Rajawali Waru)
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Besok, 07 September 2026 · Pukul 19:00 - 21:00 WIB (2 Jam)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('jadwal-reservasi')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Lihat Pas Tiket QR</span>
            </button>
          </div>

          {/* Bank Sampah & Mutasi Cepat */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Quick Action: Request Pickup with Free Nominatim GPS & Calculator */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-emerald-600" />
                  <span>Request Jemput Sampah</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCuanCalculatorOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 font-medium text-xs flex items-center gap-1 hover:bg-amber-100 dark:hover:bg-amber-900/60 cursor-pointer transition-colors"
                >
                  <Calculator className="w-3 h-3" />
                  <span>Hitung Cuan</span>
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ajukan penjemputan armada truk BUMDes langsung ke rumah untuk botol, kardus, atau minyak jelantah.
              </p>

              <form onSubmit={handleRequestPickup} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Tanggal Jemput</label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Alamat Penjemputan</label>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      disabled={isGpsLoading}
                      className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {isGpsLoading ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Navigation className="w-3 h-3" />
                      )}
                      <span>Gunakan GPS Saya</span>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      placeholder="Masukkan alamat RT/RW..."
                    />
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Rincian Perkiraan Sampah</label>
                    <button
                      type="button"
                      onClick={() => setIsCuanCalculatorOpen(true)}
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer"
                    >
                      Pilih dari Daftar
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={pickupEstimasi}
                    onChange={(e) => setPickupEstimasi(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                  {estimatedRupiah > 0 && (
                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium pt-0.5">
                      Estimasi Nilai Cuan: Rp {estimatedRupiah.toLocaleString('id-ID')}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Permohonan Armada</span>
                </button>
              </form>
            </div>

            {/* Mutasi Setoran Tabungan */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Mutasi Tabungan Sampah Saya</span>
                </h3>
                <span className="text-xs font-mono text-emerald-600 font-semibold">
                  Saldo: Rp {saldo.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-mono text-xs">
                    <tr>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Rincian</th>
                      <th className="p-3">Berat</th>
                      <th className="p-3 text-right">Perubahan Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {userTxHistory.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="p-3 font-mono">
                          <div className="font-semibold text-slate-900 dark:text-white">{tx.tanggal}</div>
                          <div className="text-[11px] text-slate-400">{tx.id}</div>
                        </td>
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{tx.kategori}</td>
                        <td className="p-3 font-mono">{tx.berat > 0 ? `${tx.berat} Kg` : '-'}</td>
                        <td className={`p-3 font-mono font-semibold text-right ${tx.total >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {tx.total >= 0 ? `+Rp ${tx.total.toLocaleString('id-ID')}` : `-Rp ${Math.abs(tx.total).toLocaleString('id-ID')}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: JADWAL & RESERVASI */}
      {activeTab === 'jadwal-reservasi' && (
        <CustomerScheduleAndBooking />
      )}

      {/* TAB 3: MARKETPLACE UMKM (DAFTAR PRODUK, BELI/PESAN, DAFTARKAN PRODUK SAYA) */}
      {activeTab === 'marketplace-umkm' && (
        <CustomerMarketplace />
      )}

      {/* TAB 4: RIWAYAT PEMBAYARAN */}
      {activeTab === 'riwayat-pembayaran' && (
        <CustomerPaymentHistory />
      )}

      {/* TAB 5: TIKET ADUAN */}
      {activeTab === 'tiket-aduan' && (
        <CustomerComplaints />
      )}

      {/* TAB 6: PESAN & BANTUAN */}
      {activeTab === 'pesan' && (
        <CustomerMessages />
      )}

      {/* TAB 7: PROFILE & EDIT AKUN */}
      {activeTab === 'profil-akun' && (
        <CustomerProfileEdit 
          currentUser={userState}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* MODAL 1: PAS DIGITAL WARGA DESA (QR CODE DOWNLOAD & COPY) */}
      <CustomerDigitalPassModal
        isOpen={isDigitalPassModalOpen}
        onClose={() => setIsDigitalPassModalOpen(false)}
        currentUser={userState}
        saldo={saldo}
        poin={poin}
      />

      {/* MODAL 2: KALKULATOR CUAN SAMPAH */}
      <WasteCuanCalculatorModal
        isOpen={isCuanCalculatorOpen}
        onClose={() => setIsCuanCalculatorOpen(false)}
        onApplyToPickup={handleApplyCuanEstimate}
      />

      {/* STICKY MOBILE BOTTOM BAR FOR PELANGGAN */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around md:hidden shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('ringkasan')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'ringkasan' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Beranda</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('jadwal-reservasi')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'jadwal-reservasi' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Booking</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('marketplace-umkm')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'marketplace-umkm' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>UMKM</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('riwayat-pembayaran')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'riwayat-pembayaran' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Tagihan</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDigitalPassModalOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400"
        >
          <QrCode className="w-4 h-4" />
          <span>Pas QR</span>
        </button>
      </div>

    </div>
  );
}
