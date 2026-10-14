import React, { Suspense, lazy } from 'react';
import { Trash2, Building2, MapPin, Calendar, Award, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
const StrukturOrganisasi = lazy(() => import('./StrukturOrganisasi'));

interface AboutSectionProps {
  currentLogoSrc?: string;
}

export default function AboutSection({ currentLogoSrc }: AboutSectionProps = {}) {
  return (
    <>
      <section id="tentang-kami-section" className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Profil BUMDES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Mengenal BUMDES Waskita Wijaya
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="text-slate-600 text-lg leading-relaxed">
            Badan Usaha Milik Desa (BUMDES) Waskita Wijaya Desa Waru, Kecamatan Baki, Kabupaten Sukoharjo adalah roda penggerak ekonomi desa yang berfokus pada kemandirian sosial, pemberdayaan lingkungan hidup, serta pelayanan fasilitas umum berkualitas bagi masyarakat Waru dan sekitarnya.
          </p>
        </motion.div>

        {/* Main Grid: Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Vision & Identity */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-4 flex flex-col justify-between bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-8 rounded-2xl shadow-xl border border-emerald-700/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
            <div className="space-y-6 relative z-10">
              <h3 className="text-2xl font-bold tracking-tight">Visi & Misi Kami</h3>
              <div className="space-y-4 text-emerald-100 text-sm leading-relaxed">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-emerald-700/50 p-1 rounded-md text-emerald-300">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <p>Menciptakan tata kelola lingkungan desa Waru yang bersih bebas dari penumpukan sampah liar melaui Unit Usaha Sampah.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-emerald-700/50 p-1 rounded-md text-emerald-300">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <p>Menyediakan prasarana sewa gedung serbaguna dan lapangan olahraga berkualitas tinggi untuk pemberdayaan jasmani dan kreativitas warga.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-emerald-700/50 p-1 rounded-md text-emerald-300">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <p>Meningkatkan Pendapatan Asli Desa (PAD) secara transparan, akuntabel, dan mengutamakan kesejahteraan sosial.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-emerald-700/50 mt-8 relative z-10 text-emerald-200 text-xs font-mono space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Desa Waru, Kec. Baki, Sukoharjo</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Buka: Senin - Sabtu (08:00 - 16:00)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-3.5 h-3.5" />
                <span>BUMDES Terakreditasi Mandiri</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Unit Usaha Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Unit 1: Waste Management */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="dashboard-card p-6 md:p-8 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="w-14 h-14 bg-slate-50 text-emerald-600 rounded-xl flex items-center justify-center border border-slate-200">
                  <Trash2 className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">1. Unit Usaha Layanan Pengelolaan Sampah</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Pengangkutan Rutin Rumah Tangga & Pelaku Usaha</p>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Pengangkutan sampah rumah tangga dan pelaku usaha secara rutin sesuai jadwal wilayah, dikelola langsung oleh BUMDES Waskita Wijaya.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Dilengkapi skema transparan iuran Rp 25.000/bulan dengan <strong>cashback Rp 5.000 langsung ke kas warga/RT</strong>, pengelolaan limbah komersial UMKM, manajemen armada digital, dan laporan keuangan berkala.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 font-mono">
                Layanan Utama: Pengangkutan Terjadwal • Retribusi UMKM • Cashback Kas RT • Manajemen Aset
              </div>
            </motion.div>

            {/* Unit 2: Building Rental & Badminton */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="dashboard-card p-6 md:p-8 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="w-14 h-14 bg-slate-50 text-blue-600 rounded-xl flex items-center justify-center border border-slate-200">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">2. Unit Usaha Gedung</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Sewa Aula & Lapangan Badminton</p>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Mengelola sarana fisik strategis milik Desa Waru yang disewakan untuk kepentingan komersial maupun sosial dengan tarif terjangkau bagi warga desa.
                </p>
                <div className="space-y-2.5 text-slate-600 text-sm pt-1">
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>Sewa Gedung Pertemuan Serbaguna</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-3.5">
                    Gedung luas berkapasitas besar, cocok untuk resepsi pernikahan, rapat paripurna, khitanan, reuni, dan pameran niaga.
                  </p>
                  <div className="flex items-center space-x-2 text-slate-700 font-medium mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>Sewa Lapangan Badminton Indoor</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-3.5">
                    Tiga line lapangan bulutangkis tertutup standar turnamen, dilengkapi pencahayaan LED sorot anti-silau serta fasilitas toilet nyaman.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 font-mono">
                Layanan Utama: Aula Serbaguna • 3 Line Lapangan • Toilet & Parkiran
              </div>
            </motion.div>

          </div>

        </div>

      </div>
      </section>
      <Suspense fallback={
        <div className="py-16 bg-slate-900 text-center text-slate-500">
          <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs">Memuat struktur organisasi desa...</span>
        </div>
      }>
        <StrukturOrganisasi currentLogoSrc={currentLogoSrc} />
      </Suspense>
    </>
  );
}
