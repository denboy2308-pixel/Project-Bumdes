import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  User, 
  Plus, 
  Search, 
  CheckCircle2, 
  Send, 
  Building2, 
  Sparkles, 
  Award, 
  ChevronRight, 
  X,
  FileText
} from 'lucide-react';
import { showToast } from './ToastNotification';

interface JobPosting {
  id: string;
  title: string;
  company: string;
  category: 'Penuh Waktu' | 'Paruh Waktu' | 'Harian' | 'Pelatihan';
  salary: string;
  location: string;
  requirements: string[];
  contactPhone: string;
  postedDate: string;
  isBumdesEnterprise: boolean;
}

const JOBS_DATA: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Operator Mesin Pemilah & Pencacah Plastik TPS3R',
    company: 'Unit Usaha TPS3R BUMDESA Waskita',
    category: 'Penuh Waktu',
    salary: 'Rp 2.100.000 - Rp 2.500.000 / Bulan',
    location: 'Dukuh Waru RT 01',
    requirements: ['Pria/Wanita min 18 tahun', 'Disiplin & bertanggung jawab', 'Disediakan BPJS Ketenagakerjaan'],
    contactPhone: '6282134567890',
    postedDate: '2 hari lalu',
    isBumdesEnterprise: true
  },
  {
    id: 'job-2',
    title: 'Kasir & Staf Layanan Warung Toko Swalayan BUMDES',
    company: 'Swalayan Desa BUMDESA',
    category: 'Penuh Waktu',
    salary: 'Rp 1.900.000 / Bulan',
    location: 'Gedung BUMDESA Waru',
    requirements: ['Menguasai komputer kasir dasar', 'Ramah & teliti dalam menghitung saldo', 'Diutamakan warga Baki/Waru'],
    contactPhone: '6282134567891',
    postedDate: 'Kemarin',
    isBumdesEnterprise: true
  },
  {
    id: 'job-3',
    title: 'Pengrajin Motif Batik Tulis / Cap Baki Waru',
    company: 'UMKM Sanggar Batik Handayani',
    category: 'Harian',
    salary: 'Rp 80.000 - Rp 120.000 / Hari',
    location: 'Dukuh Baki RT 04',
    requirements: ['Memiliki ketelitian seni batik', 'Diberikan pelatihan tingkat lanjut gratis'],
    contactPhone: '6282134567892',
    postedDate: '3 hari lalu',
    isBumdesEnterprise: false
  },
  {
    id: 'job-4',
    title: 'Driver Armada Pick-Up Penjemput Sampah & Barang',
    company: 'Unit Usaha Logistik BUMDESA',
    category: 'Penuh Waktu',
    salary: 'Rp 2.200.000 / Bulan + Bonus',
    location: 'Desa Waru',
    requirements: ['Memiliki SIM A / B1 Aktif', 'Hafal rute wilayah Baki Sukoharjo'],
    contactPhone: '6282134567890',
    postedDate: 'Baru saja',
    isBumdesEnterprise: true
  }
];

export default function VillageJobBoard() {
  const [jobs, setJobs] = useState<JobPosting[]>(JOBS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [showTalentRegisterModal, setShowTalentRegisterModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  // Talent Registration State
  const [applicantName, setApplicantName] = useState('');
  const [applicantSkill, setApplicantSkill] = useState('');
  const [applicantRt, setApplicantRt] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantNote, setApplicantNote] = useState('');

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          j.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Semua' || j.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleApplyWA = (job: JobPosting) => {
    const msg = `*LAMARAN PEKERJAAN BUMDESA WARU*\n\n` +
      `Posisi: *${job.title}*\n` +
      `Perusahaan: ${job.company}\n\n` +
      `Halo Admin BUMDESA, saya warga Desa Waru bermaksud melamar posisi tersebut. Mohon petunjuk mengenai jadwal wawancara/persyaratan berkas. Terima kasih!`;

    window.open(`https://wa.me/${job.contactPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleRegisterTalent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantSkill.trim() || !applicantPhone.trim()) {
      showToast('Lengkapi Data Pencari Kerja', 'Nama, keahlian, dan no. WhatsApp wajib diisi.', 'warning');
      return;
    }

    const msg = `*PENDAFTARAN TALENTA / PENCARI KERJA DESA WARU*\n\n` +
      `👤 *Nama:* ${applicantName}\n` +
      `📍 *Wilayah:* ${applicantRt || 'Desa Waru'}\n` +
      `📱 *No. WA:* ${applicantPhone}\n` +
      `🛠️ *Keahlian / Pengalaman:* ${applicantSkill}\n` +
      `📝 *Keterangan Tambahan:* ${applicantNote || '-'}\n\n` +
      `Mohon dicatat dalam Papan Talenta Tenaga Kerja BUMDESA Waskita. Terima kasih!`;

    window.open(`https://wa.me/6282134567890?text=${encodeURIComponent(msg)}`, '_blank');
    setShowTalentRegisterModal(false);
    showToast('Data Talenta Berhasil Terdaftar!', 'Profil Anda telah disalurkan ke Papan Tenaga Kerja BUMDESA.', 'success');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Pemberdayaan Tenaga Kerja Desa</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Papan Lowongan Kerja & Talenta Desa Waru
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Portal resmi informasi karir unit usaha BUMDESA dan tempat pendaftaran tenaga kerja terampil warga desa.
          </p>
        </div>

        <button
          onClick={() => setShowTalentRegisterModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Daftar Sebagai Pencari Kerja (Talenta)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari lowongan operator, kasir, driver, atau pengrajin..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['Semua', 'Penuh Waktu', 'Paruh Waktu', 'Harian'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Job Postings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between gap-4 hover:border-emerald-500/60 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-md">
                  {job.category}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{job.postedDate}</span>
              </div>

              <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">{job.title}</h3>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-500" /> {job.company}
              </p>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Gaji/Insentif:</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">{job.salary}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Lokasi Kerja:</span> <span className="font-bold text-slate-800 dark:text-slate-200">{job.location}</span></div>
              </div>

              <ul className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {req}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleApplyWA(job)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Lamar Pekerjaan via WhatsApp</span>
            </button>
          </div>
        ))}
      </div>

      {/* Talent Register Modal */}
      {showTalentRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Form Pendataan Talenta Desa</h3>
              <button onClick={() => setShowTalentRegisterModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterTalent} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  placeholder="Contoh: Rahmat Hidayat"
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Keahlian / Keterampilan Utama:</label>
                <input
                  type="text"
                  placeholder="Contoh: Mengemudi Truk, Menjahit, Las Listrik, Pertanian"
                  value={applicantSkill}
                  onChange={e => setApplicantSkill(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">RT/Dukuh Domisili:</label>
                  <input
                    type="text"
                    placeholder="RT 02 Dukuh Waru"
                    value={applicantRt}
                    onChange={e => setApplicantRt(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">No. WhatsApp:</label>
                  <input
                    type="text"
                    placeholder="0821xxxxxxxx"
                    value={applicantPhone}
                    onChange={e => setApplicantPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Pengalaman / Catatan singkat:</label>
                <textarea
                  rows={3}
                  placeholder="Sebutkan riwayat pekerjaan atau ijazah terakhir Anda..."
                  value={applicantNote}
                  onChange={e => setApplicantNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer"
              >
                Kirim Pendaftaran Ke Database Talenta
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
