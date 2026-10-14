import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Phone, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Compass, 
  Building2, 
  Recycle, 
  Trophy, 
  Car, 
  Wifi, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Info
} from 'lucide-react';

export interface LocationPoint {
  id: string;
  name: string;
  category: string;
  tagline: string;
  address: string;
  googleMapsQuery: string;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
  status: 'Open' | 'Closed Soon' | 'Open 24h';
  icon: React.ElementType;
  amenities: string[];
  distances: { label: string; time: string }[];
  description: string;
}

export const BUMDES_LOCATIONS: LocationPoint[] = [
  {
    id: 'kantor-pusat',
    name: 'Kantor Sekretariat BUMDES Waskita Wijaya',
    category: 'Pusat Administrasi & Layanan',
    tagline: 'Pusat konsultasi, legalitas, pendaftaran nasabah & pembayaran',
    address: 'Jl. Kyai Waru No. 12, Desa Waru, Kec. Baki, Kab. Sukoharjo, Jawa Tengah 57556',
    googleMapsQuery: 'Desa+Waru+Kec+Baki+Kab+Sukoharjo',
    lat: -7.598,
    lng: 110.785,
    phone: '+62 821-3456-7890',
    hours: 'Senin - Sabtu: 08:00 - 16:00 WIB',
    status: 'Open',
    icon: Building2,
    amenities: ['Ruang AC', 'Wi-Fi Gratis', 'Parkir Mobil & Motor', 'Musholla', 'Toilet Bersih'],
    distances: [
      { label: 'Dari Kantor Kec. Baki', time: '5 Menit (2.1 km)' },
      { label: 'Dari Solobaru', time: '10 Menit (4.5 km)' },
      { label: 'Dari Stasiun Purwosari', time: '12 Menit (6.0 km)' }
    ],
    description: 'Kantor pusat tempat pengurusan administrasi iuran sampah, konsultasi sewa gedung, legalitas kemitraan, dan layanan informasi publik Desa Waru.'
  },
  {
    id: 'gor-waru',
    name: 'GOR & Hall Serbaguna Waskita',
    category: 'Fasilitas Gedung & Olahraga',
    tagline: 'Sewa lapangan badminton, futsal, dan venue resepsi pernikahan',
    address: 'Jl. Pemuda No. 05, RT 01/RW 02, Desa Waru, Kec. Baki, Sukoharjo 57556',
    googleMapsQuery: 'GOR+Desa+Waru+Baki+Sukoharjo',
    lat: -7.599,
    lng: 110.787,
    phone: '+62 821-3456-7890',
    hours: 'Setiap Hari: 07:00 - 23:00 WIB',
    status: 'Open',
    icon: Trophy,
    amenities: ['2 Lapangan Badminton Vinyl', 'Penerangan LED Standar Match', 'Tribun Penonton', 'Kantin', 'Area Parkir Luas'],
    distances: [
      { label: 'Dari Kantor BUMDES', time: '2 Menit (500 meter)' },
      { label: 'Dari Jalan Raya Baki', time: '3 Menit (1.2 km)' }
    ],
    description: 'Gedung serbaguna modern dengan lantai vinyl standar turnamen, cocok untuk olahraga harian maupun persewaan resepsi pernikahan dan acara kemasyarakatan.'
  },
  {
    id: 'bank-sampah',
    name: 'Bank Sampah Induk Waskita Wijaya',
    category: 'Pengolahan & Tabungan Daur Ulang',
    tagline: 'Penimbangan sampah anorganik, pencatatan saldo digital & tabungan',
    address: 'RT 02/RW 03, Dukuh Pundung, Desa Waru, Kec. Baki, Sukoharjo 57556',
    googleMapsQuery: 'Bank+Sampah+Desa+Waru+Sukoharjo',
    lat: -7.597,
    lng: 110.783,
    phone: '+62 821-3456-7890',
    hours: 'Selasa & Sabtu: 08:00 - 14:00 WIB',
    status: 'Open',
    icon: Recycle,
    amenities: ['Timbangan Digital Akurat', 'Sistem Papan Kas Online', 'Depo Pemilahan Steril', 'Akses Truk Sampah'],
    distances: [
      { label: 'Dari Papan Informasi Desa', time: '3 Menit (800 meter)' },
      { label: 'Dari Balai Desa Waru', time: '4 Menit (1.1 km)' }
    ],
    description: 'Pusat penimbangan dan pencairan saldo tabungan daur ulang warga. Dilengkapi timbangan digital terkoneksi otomatis ke aplikasi Papan Kas.'
  }
];

export default function LocationMapSection() {
  const [selectedLoc, setSelectedLoc] = useState<LocationPoint>(BUMDES_LOCATIONS[0]);
  const [mapType, setMapType] = useState<'m' | 'k'>('m'); // 'm' = roadmap, 'k' = satellite/hybrid
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedLoc.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDirectionsUrl = (loc: LocationPoint) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc.name + ', ' + loc.address)}`;
  };

  const getDirectMapUrl = (loc: LocationPoint) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ', ' + loc.address)}`;
  };

  const iframeSrc = `https://maps.google.com/maps?q=${encodeURIComponent(selectedLoc.name + ' ' + selectedLoc.googleMapsQuery)}&t=${mapType}&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="peta-lokasi-terintegrasi" className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-800 inline-flex items-center gap-2 shadow-xs">
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Integrasi Peta Digital Google Maps</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Peta Lokasi Unit Kerja BUMDESA
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full"></div>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Temukan lokasi kantor pusat, fasilitas GOR serbaguna, dan depo bank sampah BUMDESA Waskita Wijaya dengan penunjuk arah Google Maps yang presisi.
          </p>
        </div>

        {/* Location Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {BUMDES_LOCATIONS.map((loc) => {
            const IconComp = loc.icon;
            const isSelected = selectedLoc.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLoc(loc)}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-950/10 dark:shadow-emerald-950/40 ring-1 ring-emerald-500/20'
                    : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/10 rounded-bl-3xl flex items-top justify-end p-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                )}
                <div className={`p-3 rounded-xl shrink-0 transition-colors ${
                  isSelected 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                }`}>
                  <IconComp className="w-6 h-6" />
                </div>

                <div className="min-w-0 flex-grow pr-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                    {loc.category}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                    {loc.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                    {loc.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Map Box & Info Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Interactive Google Map Box (8 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between relative min-h-[420px] lg:min-h-[520px]">
            
            {/* Top Overlay Controls Bar */}
            <div className="p-3 bg-slate-900/90 text-white backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold tracking-wide text-emerald-300">
                  {selectedLoc.name}
                </span>
              </div>

              {/* View Switcher (Roadmap vs Satellite) */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setMapType('m')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    mapType === 'm'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>Peta Jalan</span>
                </button>
                <button
                  onClick={() => setMapType('k')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    mapType === 'k'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>Satelit</span>
                </button>
              </div>
            </div>

            {/* Google Map Embedded iframe */}
            <div className="w-full h-full min-h-[360px] lg:min-h-[440px] relative bg-slate-200 dark:bg-slate-800 flex-grow">
              <iframe
                title={`Peta Google Maps - ${selectedLoc.name}`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '100%' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer"
                src={iframeSrc}
                className="w-full h-full object-cover"
              />

              {/* Direct Open Floating Button */}
              <a
                href={getDirectMapUrl(selectedLoc)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 bg-slate-900/90 dark:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg border border-slate-700 backdrop-blur-md hover:bg-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer z-10"
              >
                <span>Buka di Aplikasi Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Bottom Nav Route Action Strip */}
            <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 z-10">
              <div className="flex items-center gap-2 text-xs text-slate-300 text-left">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate max-w-sm">{selectedLoc.address}</span>
              </div>

              <a
                href={getDirectionsUrl(selectedLoc)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <Navigation className="w-4 h-4" />
                <span>Petunjuk Arah (Navigasi GPS)</span>
              </a>
            </div>

          </div>

          {/* Location Info & Details Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl flex flex-col justify-between text-left space-y-6">
            
            <div className="space-y-4">
              
              {/* Header Status Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>BEROPERASI RESMI</span>
                </span>

                <button
                  onClick={handleCopyAddress}
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl transition-colors cursor-pointer"
                  title="Salin Alamat Lengkap"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Alamat</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {selectedLoc.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {selectedLoc.description}
                </p>
              </div>

              {/* Address Box */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  <span>Alamat Lengkap</span>
                </span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  {selectedLoc.address}
                </p>
              </div>

              {/* Hours & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    <span>Jam Operasional</span>
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {selectedLoc.hours}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-500" />
                    <span>Telepon / WA</span>
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 font-mono">
                    {selectedLoc.phone}
                  </p>
                </div>
              </div>

              {/* Landmark Distance Guide */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Perkiraan Waktu Tempuh</span>
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {selectedLoc.distances.map((dist, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-slate-100/70 dark:bg-slate-800/40 px-3 py-1.5 rounded-xl">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{dist.label}</span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{dist.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities Badges */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Fasilitas Penunjang Lokasi</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLoc.amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Action Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <a
                href={`https://wa.me/${selectedLoc.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo Admin BUMDESA Waskita, saya ingin bertanya mengenai lokasi ${selectedLoc.name}...`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Hubungi Petugas Lokasi</span>
              </a>

              <a
                href={getDirectionsUrl(selectedLoc)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 hover:text-emerald-600 rounded-xl transition-colors cursor-pointer"
                title="Buka Navigasi Rute"
              >
                <Navigation className="w-5 h-5" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
