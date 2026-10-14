import React, { useState } from 'react';
import { 
  Utensils, 
  MapPin, 
  Clock, 
  Star, 
  Navigation, 
  Sparkles, 
  Compass, 
  ExternalLink,
  ChevronRight,
  Phone
} from 'lucide-react';
import { showToast } from './ToastNotification';

interface TourismSpot {
  id: string;
  name: string;
  category: 'Kuliner Khas' | 'Kampung Tematik' | 'Edukasi Lingkungan' | 'Oleh-Oleh';
  location: string;
  openHours: string;
  rating: number;
  image: string;
  specialty: string;
  description: string;
}

const TOURISM_SPOTS: TourismSpot[] = [
  {
    id: 'spot-1',
    name: 'Sentra Kuliner Keripik Tempe Sanjai Dukuh Waru',
    category: 'Kuliner Khas',
    location: 'RT 02 Dukuh Waru, Baki',
    openHours: '08:00 - 20:00 WIB',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    specialty: 'Keripik Tempe Kedelai Renyah Gurih Resep Leluhur',
    description: 'Pusat pembuatan danicipi langsung keripik tempe kedelai hangat baru matang dari wajan penggorengan.'
  },
  {
    id: 'spot-2',
    name: 'Kampung Batik Tulis & Cap Waru Lestari',
    category: 'Kampung Tematik',
    location: 'RT 04 Dukuh Baki Waru',
    openHours: '09:00 - 17:00 WIB',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    specialty: 'Wisata Edukasi Membatik & Galeri Kain Tradisional',
    description: 'Wisatawan dapat belajar canting membatik kain secara manual dipandu oleh maestro pengrajin batik desa.'
  },
  {
    id: 'spot-3',
    name: 'Taman Edukasi Lingkungan TPS3R BUMDESA Waskita',
    category: 'Edukasi Lingkungan',
    location: 'Area TPS3R Desa Waru',
    openHours: '08:00 - 15:00 WIB',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    specialty: 'Wisata Pengolahan Daur Ulang & Budidaya Maggot BSF',
    description: 'Kunjungan studi banding pengelolaan sampah modern terintegrasi, komposting, dan pembuatan pakan ternak.'
  },
  {
    id: 'spot-4',
    name: 'Angkringan & Kedai Kopi BUMDES Waru',
    category: 'Kuliner Khas',
    location: 'Halaman Gedung BUMDESA Waru',
    openHours: '16:00 - 23:00 WIB',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    specialty: 'Nasi Kucing, Wedang Jahe Rempah & Kopi Robusta',
    description: 'Tempat cangkrukan santai pemuda dan keluarga menikmati malam berkonsep outdoor dengan Live Akustik.'
  }
];

export default function CulinaryTourismPortal() {
  const [selectedSpot, setSelectedSpot] = useState<TourismSpot | null>(null);

  const handleOpenGoogleMaps = (spot: TourismSpot) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${spot.name} ${spot.location}`)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Destinasi Unggulan Desa Waru Baki</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Portal Wisata Kuliner & Kampung Tematik Waru
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Jelajahi keunikan wisata desa, kuliner tradisional khas tempe sanjai, batik tulis, dan edukasi lingkungan.
          </p>
        </div>
      </div>

      {/* Grid Spot Wisata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOURISM_SPOTS.map(spot => (
          <div
            key={spot.id}
            className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-44 overflow-hidden relative">
                <img src={spot.image} alt={spot.name} referrerPolicy="no-referrer" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                  {spot.category}
                </span>
                <span className="absolute top-3 right-3 bg-slate-950/80 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 backdrop-blur-md">
                  ★ {spot.rating}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">{spot.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{spot.description}</p>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Keunggulan:</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">{spot.specialty}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Jam Buka:</span> <span className="font-bold text-slate-800 dark:text-slate-200">{spot.openHours}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Lokasi:</span> <span className="font-bold text-slate-800 dark:text-slate-200">{spot.location}</span></div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => handleOpenGoogleMaps(spot)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Petunjuk Rute Google Maps</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
