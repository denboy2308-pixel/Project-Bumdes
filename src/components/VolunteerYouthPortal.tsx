import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Users, 
  Calendar, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Trees, 
  Waves, 
  BookOpen, 
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { showToast } from './ToastNotification';

interface Campaign {
  id: string;
  title: string;
  category: 'Aksi Lingkungan' | 'Pendidikan Pemuda' | 'Kesehatan' | 'Sosial';
  date: string;
  location: string;
  targetVolunteers: number;
  joinedVolunteers: number;
  pointsReward: number;
  image: string;
  description: string;
}

const CAMPAIGNS_DATA: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Aksi Tanam 1.000 Pohon & Penghijauan Bantaran Sungai Baki',
    category: 'Aksi Lingkungan',
    date: 'Sabtu, 28 Juli 2026 (07:00 WIB)',
    location: 'Sempadan Sungai Waru RT 03',
    targetVolunteers: 50,
    joinedVolunteers: 38,
    pointsReward: 150,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    description: 'Penanaman bibit pohon sengon & buah-buahan lokal untuk memperkuat struktur tanah dan mengurangi potensi erosi musim hujan.'
  },
  {
    id: 'camp-2',
    title: 'Gotong Royong Bersih Sungai & Pemilahan Sampah TPS3R',
    category: 'Aksi Lingkungan',
    date: 'Minggu, 5 Agustus 2026 (06:30 WIB)',
    location: 'Saluran Irigasi Baki Waru',
    targetVolunteers: 40,
    joinedVolunteers: 29,
    pointsReward: 120,
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    description: 'Pembersihan eceng gondok & sampah plastik bersama pemuda Karang Taruna dan tim unit layanan pengelolaan sampah desa.'
  },
  {
    id: 'camp-3',
    title: 'Bimbingan Belajar & Mengajar Gratis Anak-Anak Desa',
    category: 'Pendidikan Pemuda',
    date: 'Setiap Sabtu Sore (15:30 WIB)',
    location: 'Gedung Perpustakaan Desa Waru',
    targetVolunteers: 15,
    joinedVolunteers: 12,
    pointsReward: 200,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    description: 'Membantu anak-anak SD/SMP dalam PR matematika, bahasa Inggris, dan literasi digital.'
  }
];

export default function VolunteerYouthPortal() {
  const [volunteersName, setVolunteersName] = useState('');
  const [volunteersPhone, setVolunteersPhone] = useState('');
  const [volunteersRt, setVolunteersRt] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('camp-1');

  const selectedCampaign = CAMPAIGNS_DATA.find(c => c.id === selectedCampaignId) || CAMPAIGNS_DATA[0];

  const handleJoinVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteersName.trim() || !volunteersPhone.trim()) {
      showToast('Lengkapi Form Relawan', 'Nama dan No. WhatsApp wajib diisi.', 'warning');
      return;
    }

    const msg = `*PENDAFTARAN RELAWAN PEMUDA & LINGKUNGAN DESA WARU*\n\n` +
      `👤 *Nama:* ${volunteersName}\n` +
      `📍 *Wilayah:* ${volunteersRt || 'Desa Waru'}\n` +
      `📱 *No. WA:* ${volunteersPhone}\n` +
      `🌱 *Kegiatan:* ${selectedCampaign.title}\n` +
      `🎁 *Perolehan Poin:* ${selectedCampaign.pointsReward} Poin Pemuda\n\n` +
      `Mohon masukkan saya ke dalam grup WhatsApp koordinasi relawan. Terima kasih Karang Taruna Waskita!`;

    window.open(`https://wa.me/6282134567890?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Berhasil Mendaftar Relawan!', 'Pendaftaran Anda telah diteruskan ke pengurus Karang Taruna Desa Waru.', 'success');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Gerakan Relawan & Karang Taruna Waskita</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Portal Relawan Lingkungan & Komunitas Pemuda
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bergabunglah dalam aksi sosial gotong royong, penghijauan, dan bimbel pemuda untuk memajukan Desa Waru.
          </p>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CAMPAIGNS_DATA.map(camp => {
          const isSelected = selectedCampaignId === camp.id;

          return (
            <div
              key={camp.id}
              onClick={() => setSelectedCampaignId(camp.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-400'
              }`}
            >
              <div>
                <div className="h-36 rounded-xl overflow-hidden relative mb-3">
                  <img src={camp.image} alt={camp.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                    +{camp.pointsReward} Poin
                  </span>
                </div>

                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">{camp.category}</span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug mt-0.5">{camp.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{camp.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Jadwal:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{camp.date}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Relawan Terkumpul:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{camp.joinedVolunteers} / {camp.targetVolunteers} Orang</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full" 
                    style={{ width: `${Math.min(100, (camp.joinedVolunteers / camp.targetVolunteers) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Pendaftaran Relawan */}
      <form onSubmit={handleJoinVolunteer} className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Form Pendaftaran</span>
            <h3 className="text-base font-black text-white">Gabung Aksi: {selectedCampaign.title}</h3>
          </div>
          <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full">
            +{selectedCampaign.pointsReward} Poin
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nama Relawan:</label>
            <input
              type="text"
              placeholder="Contoh: Aditya Nugroho"
              value={volunteersName}
              onChange={e => setVolunteersName(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nomor WhatsApp:</label>
            <input
              type="text"
              placeholder="0821xxxxxxxx"
              value={volunteersPhone}
              onChange={e => setVolunteersPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Asal RT / Dukuh:</label>
            <input
              type="text"
              placeholder="RT 02 Dukuh Waru"
              value={volunteersRt}
              onChange={e => setVolunteersRt(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Konfirmasi Pendaftaran & Masuk Grup WA Relawan</span>
        </button>
      </form>

    </div>
  );
}
