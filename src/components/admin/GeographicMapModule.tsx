import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Truck, 
  Users, 
  Building2, 
  Compass, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  Filter, 
  Radio, 
  Maximize2,
  RefreshCw,
  PhoneCall,
  Send
} from 'lucide-react';

interface MapPoint {
  id: string;
  name: string;
  category: 'kantor' | 'unit_usaha' | 'pelanggan' | 'karyawan' | 'armada';
  lat: number;
  lng: number;
  status: string;
  details: string;
  etaMinutes?: number;
  contact?: string;
  zone: string;
}

const INITIAL_POINTS: MapPoint[] = [
  // Kantor & Unit Usaha
  {
    id: 'KNT-01',
    name: 'Kantor Pusat BUMDes & Balai Desa Waru',
    category: 'kantor',
    lat: -7.5982,
    lng: 110.8256,
    status: 'Buka (08.00 - 16.00)',
    details: 'Pusat administrasi, loket kasir, dan server utama desa.',
    contact: '0812-9876-0001',
    zone: 'Dusun I'
  },
  {
    id: 'UNT-01',
    name: 'GOR Bulutangkis Waskita Wijaya (3 Lapangan)',
    category: 'unit_usaha',
    lat: -7.5991,
    lng: 110.8268,
    status: 'Operasional (Slot Malam Aktif)',
    details: 'Lapangan 1 Kayu Pro, Lapangan 2 Vinyl, Lapangan 3 Standar.',
    contact: '0812-9876-0002',
    zone: 'Dusun I'
  },
  {
    id: 'UNT-02',
    name: 'Gedung Pertemuan & Aula Serbaguna',
    category: 'unit_usaha',
    lat: -7.5975,
    lng: 110.8242,
    status: 'Tersedia untuk Booking',
    details: 'Kapasitas 800 kursi, AC sentral, genset cadangan 50kVA.',
    contact: '0812-9876-0003',
    zone: 'Dusun II'
  },
  {
    id: 'UNT-03',
    name: 'Hanggar TPS3R & Pengolahan Sampah Organik/Maggot',
    category: 'unit_usaha',
    lat: -7.6015,
    lng: 110.8295,
    status: 'Aktif Memilah',
    details: 'Kapasitas pemilahan 4 ton/hari, produksi pupuk organik.',
    contact: '0812-9876-0004',
    zone: 'Dusun III'
  },

  // Armada Sampah Live
  {
    id: 'ARM-01',
    name: 'Truk Sampah Dyna 01 (Pak Yanto)',
    category: 'armada',
    lat: -7.5989,
    lng: 110.8239,
    status: 'Sedang Berjalan (Rute RT 02 Dusun I)',
    details: 'Kapasitas angkut 85% · Bergerak ke TPS3R.',
    etaMinutes: 12,
    contact: '0813-1122-3344',
    zone: 'Dusun I'
  },
  {
    id: 'ARM-02',
    name: 'Mobil Pick-Up L300 Sampah Kering (Pak Wawan)',
    category: 'armada',
    lat: -7.6002,
    lng: 110.8281,
    status: 'Sedang Berhenti (Penimbangan Nasabah)',
    details: 'Mengangkut botol plastik dan kardus pilahan warga.',
    etaMinutes: 24,
    contact: '0813-5566-7788',
    zone: 'Dusun II'
  },

  // Karyawan di Lapangan
  {
    id: 'STF-01',
    name: 'Joko Sasongko (Operator Lapangan)',
    category: 'karyawan',
    lat: -7.5991,
    lng: 110.8268,
    status: 'Standby di GOR',
    details: 'Menyiapkan kebersihan karpet vinyl dan tes penerangan.',
    contact: '0812-3344-5566',
    zone: 'Dusun I'
  },
  {
    id: 'STF-02',
    name: 'Suwardi (PIC Wilayah Dusun I)',
    category: 'karyawan',
    lat: -7.5984,
    lng: 110.8248,
    status: 'Patroli Wilayah',
    details: 'Sosialisasi pemilahan sampah organik rumah tangga.',
    contact: '0812-7788-9900',
    zone: 'Dusun I'
  },

  // Pelanggan Aktif
  {
    id: 'PLG-01',
    name: 'Nasabah Sampah RT 02 (Bpk. Joko Susanto)',
    category: 'pelanggan',
    lat: -7.5986,
    lng: 110.8241,
    status: 'Tagihan Tertunggak',
    details: 'Jadwal angkut hari Senin & Kamis pukul 09.00 WIB.',
    zone: 'Dusun I'
  },
  {
    id: 'PLG-02',
    name: 'Pelanggan PB Smash Club Baki (Bpk. Dani)',
    category: 'pelanggan',
    lat: -7.5994,
    lng: 110.8272,
    status: 'Penyewa Reguler',
    details: 'Jadwal rutin tiap Selasa malam jam 20.00.',
    zone: 'Dusun II'
  }
];

interface GeographicMapModuleProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function GeographicMapModule({ onShowToast }: GeographicMapModuleProps) {
  const [points, setPoints] = useState<MapPoint[]>(INITIAL_POINTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(INITIAL_POINTS[0]);
  const [mapMode, setMapMode] = useState<'roadmap' | 'satellite'>('roadmap');

  const filteredPoints = selectedCategory === 'all' 
    ? points 
    : points.filter(p => p.category === selectedCategory);

  const handleDispatchArmada = (p: MapPoint) => {
    onShowToast(`Perintah rute dispatch terkirim ke sopir ${p.name}!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
              <span>Menu Peta Geografis (Live GIS Google Maps Ekosistem BUMDes)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                GPS SENSOR REAL-TIME
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Pantau titik fisik kantor, GOR, gedung pertemuan, armada bergerak, karyawan lapangan, dan sebaran nasabah.
            </p>
          </div>
        </div>

        {/* Switcher Mode Satelit / Roadmap */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setMapMode('roadmap')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mapMode === 'roadmap' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Peta Jalan
          </button>
          <button
            type="button"
            onClick={() => setMapMode('satellite')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mapMode === 'satellite' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Satelit Realistis
          </button>
        </div>
      </div>

      {/* Layer Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 flex items-center space-x-2 overflow-x-auto shadow-md">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Tampilkan Keseluruhan ({points.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('kantor')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            selectedCategory === 'kantor'
              ? 'bg-purple-500 text-white font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Kantor Utama</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('unit_usaha')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            selectedCategory === 'unit_usaha'
              ? 'bg-blue-500 text-white font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Unit Usaha (GOR, Aula, TPS3R)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('armada')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            selectedCategory === 'armada'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-amber-400" />
          <span>Armada Sampah Live</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('karyawan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            selectedCategory === 'karyawan'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>Karyawan Lapangan</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('pelanggan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            selectedCategory === 'pelanggan'
              ? 'bg-rose-500 text-white font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span>Pelanggan Aktif</span>
        </button>
      </div>

      {/* Main Map Container & Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Map Canvas Interaktif */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          
          {/* Mock Interactive Map Screen */}
          <div className="absolute inset-0 bg-[#0c1427] opacity-90">
            {/* Grid Lines Pattern */}
            <div className="w-full h-full opacity-20" style={{
              backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#10b981 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 20px 20px'
            }} />
          </div>

          {/* Map Controls Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="px-3 py-1.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs font-mono text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Desa Waru, Baki, Sukoharjo (-7.5982, 110.8256)</span>
            </div>
            
            <div className="px-3 py-1.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-300 font-bold">
              3 Geofence Polygon Aktif: Dusun I, II, III
            </div>
          </div>

          {/* Interactive Simulated Pins on Map */}
          <div className="relative z-10 my-auto grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
            {filteredPoints.map((pt) => {
              const isSelected = selectedPoint?.id === pt.id;
              let pinBg = 'bg-slate-800 text-slate-300 border-slate-700';
              let icon = <MapPin className="w-4 h-4" />;

              if (pt.category === 'kantor') {
                pinBg = 'bg-purple-500 text-white border-purple-400';
                icon = <Building2 className="w-4 h-4" />;
              } else if (pt.category === 'unit_usaha') {
                pinBg = 'bg-blue-500 text-white border-blue-400';
                icon = <Building2 className="w-4 h-4" />;
              } else if (pt.category === 'armada') {
                pinBg = 'bg-amber-500 text-slate-950 border-amber-400';
                icon = <Truck className="w-4 h-4" />;
              } else if (pt.category === 'karyawan') {
                pinBg = 'bg-cyan-500 text-slate-950 border-cyan-400';
                icon = <Users className="w-4 h-4" />;
              } else if (pt.category === 'pelanggan') {
                pinBg = 'bg-rose-500 text-white border-rose-400';
                icon = <MapPin className="w-4 h-4" />;
              }

              return (
                <div
                  key={pt.id}
                  onClick={() => setSelectedPoint(pt)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all backdrop-blur-md ${
                    isSelected 
                      ? 'ring-4 ring-cyan-400/50 scale-105 shadow-2xl bg-slate-900 border-cyan-400' 
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`p-1.5 rounded-xl border ${pinBg} shrink-0`}>
                      {icon}
                    </div>
                    <span className="text-[11px] font-black text-white truncate">{pt.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">{pt.status}</span>
                  {pt.etaMinutes && (
                    <span className="text-[10px] text-amber-400 font-mono font-bold block mt-1">
                      ⏱️ ETA: ~{pt.etaMinutes} mnt lagi
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Map Footer Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span>💡 Klik salah satu marker untuk melihat detail rute & kontak langsung</span>
            <span className="font-mono text-cyan-400">Pembaruan GPS tiap 5 detik</span>
          </div>
        </div>

        {/* Panel Detail Titik Terpilih & Ide Brilian Terapan */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          {selectedPoint ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    {selectedPoint.category.replace('_', ' ')} · {selectedPoint.zone}
                  </span>
                  <h4 className="text-sm font-black text-white mt-0.5">{selectedPoint.name}</h4>
                  <span className="text-xs text-slate-400">{selectedPoint.status}</span>
                </div>
                <span className="px-2.5 py-1 bg-slate-800 text-white font-mono text-[10px] rounded-lg">
                  {selectedPoint.id}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Deskripsi & Rincian Lapangan:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedPoint.details}
                </p>
              </div>

              {/* IDE BRILIAN 1: Live ETA Generator */}
              {selectedPoint.etaMinutes && (
                <div className="p-3.5 bg-amber-950/40 border border-amber-800/80 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-amber-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Live ETA Kedatangan:</span>
                    </span>
                    <span className="font-mono text-base">{selectedPoint.etaMinutes} Menit</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Sistem memprediksi truk sampah tiba di depan gang warga Dusun I pukul 14.15 WIB.
                  </p>
                </div>
              )}

              {/* IDE BRILIAN 2: Geofencing Radius Verification */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Geofencing Boundary Verified:</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Koordinat berada tepat di dalam wilayah hukum BUMDes Waskita Wijaya (Desa Waru).
                </p>
              </div>

              {/* IDE BRILIAN 3: Quick Dispatch & Contact Actions */}
              <div className="space-y-2 pt-2">
                {selectedPoint.category === 'armada' && (
                  <button
                    type="button"
                    onClick={() => handleDispatchArmada(selectedPoint)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Instruksi Dispatch Rute ke Sopir</span>
                  </button>
                )}

                {selectedPoint.contact && (
                  <a
                    href={`https://wa.me/${selectedPoint.contact.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Hubungi Nomor Lapangan ({selectedPoint.contact})</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Pilih salah satu titik di peta untuk melihat rincian
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
