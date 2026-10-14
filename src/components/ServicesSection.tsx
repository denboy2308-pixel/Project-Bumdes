import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
const WasteManagementService = lazy(() => import('./waste/WasteManagementService'));
const SewaGedungForm = lazy(() => import('./SewaGedungForm'));
const LiveCourtReservation = lazy(() => import('./LiveCourtReservation'));
import { 
  Trash2, 
  Building, 
  Calendar, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight, 
  Recycle,
  CheckCircle2,
  MapPin,
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import InteractiveDateNavigator from './InteractiveDateNavigator';
import { showToast } from './ToastNotification';

type TabType = 'sampah' | 'gedung' | 'lapangan';

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState<TabType>('sampah');
  
  // Date state for Gedung interactive calendar
  const [gedungDate, setGedungDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const unitUsahaList = [
    {
      id: 'sampah' as TabType,
      title: 'Unit Usaha "Layanan Pengelolaan Sampah Desa"',
      tagline: 'Pengangkutan Rutin Rumah Tangga & Pelaku Usaha',
      description: 'Pengangkutan sampah rumah tangga dan pelaku usaha secara rutin sesuai jadwal wilayah, dikelola langsung oleh BUMDES Waskita Wijaya.',
      icon: Trash2,
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'bg-emerald-500/90 text-white',
      accentBorder: 'border-emerald-500',
      shadowColor: 'shadow-emerald-500/10 dark:shadow-emerald-500/5',
      glowRing: 'ring-4 ring-emerald-500/40'
    },
    {
      id: 'gedung' as TabType,
      title: 'Sewa Gedung',
      tagline: 'Aula Pertemuan & Hajatan Serbaguna',
      description: 'Aula serbaguna berkapasitas besar untuk hajatan, seminar, dan rapat warga.',
      icon: Building,
      imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'bg-blue-500/90 text-white',
      accentBorder: 'border-blue-500',
      shadowColor: 'shadow-blue-500/10 dark:shadow-blue-500/5',
      glowRing: 'ring-4 ring-blue-500/40'
    },
    {
      id: 'lapangan' as TabType,
      title: 'Sewa Lapangan Olahraga',
      tagline: 'Gedung Bulutangkis Indoor',
      description: '3 line lapangan badminton lantai kayu berkualitas dengan pencahayaan LED.',
      icon: Calendar,
      imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'bg-amber-500/90 text-white',
      accentBorder: 'border-amber-500',
      shadowColor: 'shadow-amber-500/10 dark:shadow-amber-500/5',
      glowRing: 'ring-4 ring-amber-500/40'
    }
  ];

  return (
    <section id="layanan-section" className="py-20 bg-slate-50/50 dark:bg-slate-900/40 transition-colors duration-300">
      <div className="max-w-7xl 2xl:max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Description */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
            Unit Usaha Desa
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Unit Usaha & Tarif Layanan BUMDES
          </h2>
          <div className="w-12 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            Kami berkomitmen memberikan pelayanan transparan dan terjangkau untuk seluruh warga Desa Waru. Pilih salah satu unit usaha di bawah untuk melihat rincian biaya, fasilitas, dan prosedur pelayanan.
          </p>
        </div>

        {/* 3 Clickable 3D-styled Business Unit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {unitUsahaList.map((unit) => {
            const IconComponent = unit.icon;
            const isSelected = activeTab === unit.id;

            return (
              <button
                key={unit.id}
                id={`unit-card-${unit.id}`}
                onClick={() => setActiveTab(unit.id)}
                className={`relative h-72 sm:h-80 w-full text-left rounded-3xl overflow-hidden group cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? `${unit.glowRing} scale-[1.02] shadow-xl ${unit.shadowColor}` 
                    : 'hover:scale-[1.01] hover:shadow-lg shadow-md'
                } focus:outline-none`}
              >
                {/* Background Image with Ken Burns / Zoom Effect on Hover */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={unit.imageUrl}
                    alt={unit.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Color Overlays based on state */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/70 to-slate-900/10 transition-opacity duration-300 ${
                    isSelected ? 'opacity-90' : 'opacity-85 group-hover:opacity-90'
                  }`} />
                </div>

                {/* Card Content (Always light text for high contrast on dark overlay) */}
                <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
                  {/* Top Row: Icon Circle & Selection Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 ${
                      isSelected ? 'bg-white text-slate-900 scale-110' : 'bg-white/15 text-white group-hover:scale-105'
                    }`}>
                      <IconComponent className="w-5.5 h-5.5" />
                    </div>

                    {/* Active/Select Status Indicator */}
                    <AnimatePresence>
                      {isSelected ? (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5 ${unit.badgeColor}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terpilih</span>
                        </motion.span>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-bold bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 group-hover:bg-white/20 transition-colors">
                          Lihat Detail
                        </span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom Column: Titles & Short Description */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-emerald-400 tracking-wide uppercase">
                      {unit.tagline}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight">
                      {unit.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-2">
                      {unit.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Active Color Bar Indicator */}
                {isSelected && (
                  <motion.div 
                    layoutId="activeBarIndicator"
                    className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Section Container with Framer Motion tab transitions */}
        <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10 transition-colors duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full"
            >
              <Suspense fallback={
                <div className="min-h-[300px] flex items-center justify-center p-8 bg-slate-900/50 rounded-3xl border border-slate-800">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <div className="w-7 h-7 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    <span className="text-xs font-semibold">Memuat modul layanan...</span>
                  </div>
                </div>
              }>
                {/* Tab 1: UNIT USAHA LAYANAN PENGELOLAAN SAMPAH */}
              {activeTab === 'sampah' && (
                <div id="unit-detail-sampah">
                  <WasteManagementService />
                </div>
              )}

              {/* Tab 2: SEWA GEDUNG DETAILS - FULL WIDTH & INTEGRATED */}
              {activeTab === 'gedung' && (
                <div id="unit-detail-gedung" className="w-full space-y-8 animate-in fade-in duration-300">
                  
                  {/* Top Header & Highlights Banner (Full Width) */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-700/80 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-700/60">
                      <div className="space-y-3 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-[11px] font-black uppercase tracking-wider text-blue-400 bg-blue-950/80 px-3.5 py-1 rounded-full border border-blue-600/40 inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            <span>Unit Komersial Gedung Pertemuan BUMDES</span>
                          </span>
                          <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-3.5 py-1 rounded-full border border-slate-700">
                            Kapasitas 800 - 1.000 Undangan • Area Parkir 1.500 m²
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                          Gedung Pertemuan Waskita Wijaya Desa Waru
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                          Aula megah serbaguna yang didesain modern untuk menampung hajatan resepsi pernikahan, rapat umum warga, seminar kedinasan, wisuda, hingga pameran produk UMKM dengan sarana lengkap all-in terjangkau bagi seluruh masyarakat.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
                        <a
                          href="#formulir-sewa-gedung"
                          className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-950/50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Periksa Jadwal & Booking Gedung</span>
                        </a>
                      </div>
                    </div>

                    {/* 3 Overview Highlight Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8">
                      {/* Card 1: Tarif Sewa All-in */}
                      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 space-y-3 shadow-sm">
                        <div className="flex items-center space-x-2 text-blue-400">
                          <DollarSign className="w-5 h-5" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Tarif Sewa All-in One</h4>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-baseline space-x-1">
                            <span className="text-2xl sm:text-3xl font-black text-white">Rp 2.500.000</span>
                            <span className="text-xs text-slate-400 font-normal">/ Hari</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50 inline-block">
                            Paket Hemat Komprehensif
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Sudah termasuk aula utama, 300 kursi lipat tamu, panggung pelaminan, ruang rias AC, dan kebersihan paska acara.
                        </p>
                      </div>

                      {/* Card 2: Jam Operasional & Gladi H-1 */}
                      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 space-y-3 shadow-sm">
                        <div className="flex items-center space-x-2 text-emerald-400">
                          <Clock className="w-5 h-5" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Jadwal Operasional Aula</h4>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Hari Pelaksanaan:</span>
                            <span className="font-bold text-white">07.00 - 23.00 WIB</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Gladi / Loading Barang:</span>
                            <span className="font-medium text-emerald-400">H-1 Sebelum Acara (Gratis)</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Uji Coba Genset:</span>
                            <span className="font-medium text-blue-400">Didampingi Teknisi BUMDES</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Tim panitia dapat melakukan penataan dekorasi mulai sore hari H-1 tanpa biaya tambahan.
                        </p>
                      </div>

                      {/* Card 3: Fasilitas Pendukung */}
                      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 space-y-3 shadow-sm">
                        <div className="flex items-center space-x-2 text-amber-400">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Fasilitas Lengkap Gedung</h4>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1.5 list-none">
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span>Area parkir 1.500 m² dengan tim Linmas</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span>Dapur katering luas & toilet bersih terpisah</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span>Sound system akustik + Genset darurat</span>
                          </li>
                        </ul>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Akses jalan utama lebar memudahkan bus rombongan dan kendaraan besar tamu undangan.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Main 2-Column Wide Section: Facility Showcase & Interactive Booking Form */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Visual Showcase, Step-by-Step Procedure & Calendar Agenda (7 cols) */}
                    <div className="xl:col-span-7 space-y-6">
                      
                      {/* Visual Photo Cards Showcase */}
                      <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                          <h4 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-500" />
                            <span>Galeri Fasilitas Gedung Pertemuan</span>
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Foto Asli Lokasi GOR & Aula Waru
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          {/* Photo 1: Aula Utama & Panggung */}
                          <div className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 relative">
                            <div className="h-36 overflow-hidden">
                              <img 
                                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80" 
                                alt="Aula Utama Gedung" 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                            </div>
                            <div className="p-2.5 bg-slate-900/95 text-white">
                              <span className="text-[10px] font-bold text-blue-400 block uppercase">Panggung & Aula</span>
                              <p className="text-xs font-black truncate">Panggung Pelaminan / Seminar</p>
                            </div>
                          </div>

                          {/* Photo 2: Ruang Rias AC */}
                          <div className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 relative">
                            <div className="h-36 overflow-hidden">
                              <img 
                                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80" 
                                alt="Ruang Rias AC" 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                            </div>
                            <div className="p-2.5 bg-slate-900/95 text-white">
                              <span className="text-[10px] font-bold text-emerald-400 block uppercase">Ruang Rias VIP</span>
                              <p className="text-xs font-black truncate">Full AC & Cermin Rias Lebar</p>
                            </div>
                          </div>

                          {/* Photo 3: Parkir & Dapur Katering */}
                          <div className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 relative">
                            <div className="h-36 overflow-hidden">
                              <img 
                                src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=700&q=80" 
                                alt="Area Parkir Lapang" 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                            </div>
                            <div className="p-2.5 bg-slate-900/95 text-white">
                              <span className="text-[10px] font-bold text-amber-400 block uppercase">Parkir & Logistik</span>
                              <p className="text-xs font-black truncate">Area Lapang + Tim Linmas</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Date Navigation for Hall Rental */}
                      <div className="bg-slate-950/80 p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-4 shadow-lg">
                        <InteractiveDateNavigator
                          selectedDate={gedungDate}
                          onSelectDate={(newDate) => {
                            setGedungDate(newDate);
                          }}
                          accentColor="blue"
                          title="Kalender Agenda & Ketersediaan Aula Gedung"
                          subtitle="Cek jadwal kemarin (arsip acara), lusa, minggu lalu/depan, atau bulan lalu/depan secara interaktif"
                          getAvailability={(dateStr) => {
                            const today = new Date().toISOString().split('T')[0];
                            if (dateStr < today) {
                              return { status: 'past', label: 'Acara Selesai', badge: 'Terlaksana' };
                            }
                            const [y, m, d] = dateStr.split('-').map(Number);
                            const day = new Date(y, m - 1, d).getDay();
                            if (day === 0) {
                              return { status: 'full', label: 'Resepsi Pernikahan (Terkunci)', badge: 'Penuh' };
                            }
                            if (day === 6) {
                              return { status: 'limited', label: 'Gladi Resik / Hajatan', badge: 'Terjadwal' };
                            }
                            return { status: 'available', label: 'Aula Kosong & Siap Disewa', badge: 'Tersedia' };
                          }}
                        />

                        {/* Selected Date Summary & 1-Click Action */}
                        <div className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-400 font-bold">
                              {(() => {
                                const today = new Date().toISOString().split('T')[0];
                                if (gedungDate < today) return '📜 Arsip: Selesai';
                                const [y, m, d] = gedungDate.split('-').map(Number);
                                const day = new Date(y, m - 1, d).getDay();
                                if (day === 0) return '🔒 Terkunci: Resepsi Pernikahan';
                                if (day === 6) return '⚠️ Terjadwal: Rangkaian Hajatan';
                                return '🟢 Tersedia: Aula Siap Disewa';
                              })()}
                            </span>
                          </div>

                          {gedungDate >= new Date().toISOString().split('T')[0] && (
                            <a
                              href="#formulir-sewa-gedung"
                              onClick={() => {
                                showToast('Tanggal Terpilih', `Tanggal ${gedungDate} telah disinkronkan ke formulir sewa.`, 'success');
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                            >
                              <span>Terapkan di Formulir</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* 4 Steps Booking Procedure */}
                      <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 space-y-4">
                        <div className="flex items-center space-x-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                          <CheckCircle2 className="w-5 h-5 text-blue-500" />
                          <h4 className="font-black text-slate-900 dark:text-white text-base">
                            Prosedur & Alur Booking Gedung Pertemuan
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="p-3.5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                            <div className="flex items-center space-x-2">
                              <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-black">1</span>
                              <h5 className="text-xs font-bold text-slate-800 dark:text-white">Pilih Tanggal Acara</h5>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              Tentukan tanggal hajatan minimal 1 bulan sebelum pelaksanaan agar tidak bentrok dengan warga lain.
                            </p>
                          </div>

                          <div className="p-3.5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                            <div className="flex items-center space-x-2">
                              <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-black">2</span>
                              <h5 className="text-xs font-bold text-slate-800 dark:text-white">Kirim Formulir Pengajuan</h5>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              Isi formulir reservasi online di samping untuk menghitung estimasi biaya dan mengirim draft ke WhatsApp admin.
                            </p>
                          </div>

                          <div className="p-3.5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                            <div className="flex items-center space-x-2">
                              <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-black">3</span>
                              <h5 className="text-xs font-bold text-slate-800 dark:text-white">Konfirmasi DP 30%</h5>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              Penguncian jadwal resmi di kalender desa dilakukan setelah pembayaran uang muka / DP terverifikasi.
                            </p>
                          </div>

                          <div className="p-3.5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                            <div className="flex items-center space-x-2">
                              <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-black">4</span>
                              <h5 className="text-xs font-bold text-slate-800 dark:text-white">Gladi Bersih & Pelaksanaan</h5>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              Akses loading dekorasi H-1, uji sound system dan genset didampingi tim teknisi dan Linmas Desa Waru.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Upcoming Booked Schedule Transparency */}
                      <div className="bg-amber-50/60 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 space-y-2">
                        <div className="flex items-center space-x-2 font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                          <span>Pemberitahuan Transparansi Jadwal Gedung:</span>
                        </div>
                        <p className="leading-relaxed text-[11px] text-amber-800 dark:text-amber-300/90">
                          BUMDES menerapkan sistem jadwal terbuka. Jadwal terisi akan dikonfirmasi secara transparan pada Papan Informasi Kas Desa agar tidak terjadi tumpang tindih antar warga. Untuk tanggal-tanggal libur nasional & akhir pekan, sangat disarankan mengajukan seawal mungkin.
                        </p>
                      </div>

                    </div>

                    {/* Right Column: Sticky Interactive Booking Form (5 cols) */}
                    <div id="formulir-sewa-gedung" className="xl:col-span-5 sticky top-24">
                      <SewaGedungForm 
                        selectedDate={gedungDate} 
                        onDateChange={(d) => setGedungDate(d)} 
                      />
                    </div>

                  </div>

                </div>
              )}

              {/* Tab 3: SEWA LAPANGAN OLAHRAGA DETAILS - FULL WIDTH & INTEGRATED */}
              {activeTab === 'lapangan' && (
                <div id="unit-detail-lapangan" className="w-full space-y-8 animate-in fade-in duration-300">
                  
                  {/* Top Header & Highlights Banner (Full Width) */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-700/80 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-700/60">
                      <div className="space-y-3 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3.5 py-1 rounded-full border border-amber-600/40 inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span>Unit Olahraga Komersial BUMDES</span>
                          </span>
                          <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-3.5 py-1 rounded-full border border-slate-700">
                            3 Line Badminton Parket • 1 Hall Serbaguna
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                          Gedung Olahraga Bulutangkis Waskita Wijaya
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                          Fasilitas olahraga bulutangkis indoor berkualitas tinggi dengan lantai kayu solid parket berstandar turnamen, pencahayaan LED merata anti-silau, serta sistem reservasi jadwal real-time untuk kenyamanan seluruh warga Desa Waru dan komunitas pecinta olahraga.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
                        <a
                          href="#sistem-reservasi-live"
                          className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Pilih Slot Jam & Booking</span>
                        </a>
                      </div>
                    </div>

                    {/* 3 Overview Highlight Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8">
                      {/* Card 1: Tarif */}
                      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 space-y-3 shadow-sm">
                        <div className="flex items-center space-x-2 text-amber-400">
                          <DollarSign className="w-5 h-5" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Tarif Sewa Terjangkau</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-baseline border-b border-slate-800 pb-2">
                            <span className="text-xs text-slate-400">Kasual / Non-Member:</span>
                            <span className="text-sm font-black text-white">Rp 25rb - 35rb <span className="text-[10px] text-slate-400 font-normal">/ Jam</span></span>
                          </div>
                          <div className="flex justify-between items-baseline pt-1">
                            <span className="text-xs text-slate-400">Paket Member Bulanan:</span>
                            <span className="text-sm font-black text-amber-400">Rp 80.000 <span className="text-[10px] text-slate-400 font-normal">/ Bulan</span></span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          *Paket member mencakup slot tetap 2 jam per minggu (total 4 pertemuan rutin).
                        </p>
                      </div>

                      {/* Card 2: Jam Buka */}
                      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 space-y-3 shadow-sm">
                        <div className="flex items-center space-x-2 text-emerald-400">
                          <Clock className="w-5 h-5" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Jadwal Operasional GOR</h4>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Senin - Minggu:</span>
                            <span className="font-bold text-white">06.00 - 23.00 WIB</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Sesi Pagi & Siang:</span>
                            <span className="font-medium text-emerald-400">Slot Banyak Tersedia</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Jam Ramai (Malam):</span>
                            <span className="font-medium text-amber-400">19.00 - 22.00 WIB</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Petugas jaga GOR selalu standby untuk menyalakan lampu arena dan koordinasi pintu masuk.
                        </p>
                      </div>

                      {/* Card 3: Fasilitas */}
                      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 space-y-3 shadow-sm">
                        <div className="flex items-center space-x-2 text-blue-400">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Fasilitas Standar Turnamen</h4>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1.5 list-none">
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span>Lantai kayu parket empuk & anti-licin</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span>Lampu LED turnamen tanpa silau smash</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span>Kantin minuman dingin, toilet & ruang bilas</span>
                          </li>
                        </ul>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Tribun mini di sisi lapangan nyaman untuk istirahat pemain dan penonton.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Unified Full-Width Live Reservation & Member System */}
                  <div className="w-full">
                    <LiveCourtReservation />
                  </div>

                </div>
              )}

              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
