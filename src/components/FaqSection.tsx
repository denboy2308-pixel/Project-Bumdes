import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, Sparkles, MessageCircle, FileText, Calendar, Recycle, ShieldCheck } from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'Bank Sampah' | 'Sewa Gedung' | 'Sewa Lapangan' | 'Pendaftaran';
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: '1',
    category: 'Bank Sampah',
    question: 'Bagaimana cara menjadi nasabah Bank Sampah BUMDES Waskita Wijaya?',
    answer: 'Anda dapat mendaftar secara gratis melalui tombol "Daftar Nasabah Baru" di portal ini dengan mengisi NIK, nama lengkap, serta alamat RT/RW di Desa Waru. Setelah terdaftar, Anda akan mendapatkan Buku Tabungan Digital & Kartu Nasabah.'
  },
  {
    id: '2',
    category: 'Bank Sampah',
    question: 'Kapan jadwal penimbangan dan penjemputan sampah kering?',
    answer: 'Penimbangan langsung di Posko BUMDES dilaksanakan setiap hari Sabtu pukul 08.00 - 14.00 WIB. Untuk layanan pilah jemput di rumah nasabah, armada BUMDES beroperasi pada hari Senin, Rabu, dan Jumat (07.00 - 11.00 WIB).'
  },
  {
    id: '3',
    category: 'Bank Sampah',
    question: 'Bagaimana cara menarik saldo hasil tabungan sampah saya?',
    answer: 'Saldo tabungan dapat ditarik tunai kapan saja di Sekretariat BUMDES pada jam kerja, atau ditarik secara digital melalui fitur "Tarik Tunai" di Papan Kas dashboard akun Anda.'
  },
  {
    id: '4',
    category: 'Sewa Gedung',
    question: 'Berapa kapasitas Aula Gedung Serbaguna Desa Waru?',
    answer: 'Aula Utama berkapasitas hingga 500 tamu berdiri atau 300 tamu dengan susunan kursi. Gedung dilengkapi dengan panggung utama, ruang rias ber-AC, toilet bersih, sound system standar, serta lapangan parkir luas.'
  },
  {
    id: '5',
    category: 'Sewa Gedung',
    question: 'Bagaimana prosedur booking dan pembayaran sewa aula?',
    answer: 'Anda dapat mengecek tanggal ketersediaan pada formulir sewa gedung di website ini, kemudian mengirimkan pengajuan reservasi. Petugas kami akan mengonfirmasi DP 30% via WhatsApp resmi BUMDES.'
  },
  {
    id: '6',
    category: 'Sewa Lapangan',
    question: 'Fasilitas apa saja yang tersedia di Gedung Bulutangkis BUMDES?',
    answer: 'Tersedia 3 line lapangan bulutangkis lantai kayu halus berlapis karpet khusus, penerangan lampu LED bebas silau, tribun penonton, kantin minuman dingin, serta fasilitas ruang ganti.'
  },
  {
    id: '7',
    category: 'Pendaftaran',
    question: 'Apakah warga luar Desa Waru bisa menyewa fasilitas BUMDES?',
    answer: 'Tentu bisa! Sewa aula gedung serbaguna dan lapangan badminton terbuka umum untuk warga luar desa dengan tarif transparan yang sama.'
  }
];

export default function FaqSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'Bank Sampah' | 'Sewa Gedung' | 'Sewa Lapangan' | 'Pendaftaran'>('Semua');
  const [openId, setOpenId] = useState<string | null>('1');

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCat = selectedCategory === 'Semua' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 mt-12 text-left">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/60 pb-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
            Pusat Informasi & Bantuan
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            Pertanyaan Sering Diajukan (FAQ)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Temukan jawaban cepat seputar layanan BUMDES Waskita Wijaya Desa Waru.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari pertanyaan..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {(['Semua', 'Bank Sampah', 'Sewa Gedung', 'Sewa Lapangan', 'Pendaftaran'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map(faq => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen 
                    ? 'bg-white dark:bg-slate-900 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/20' 
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    <span className="text-sm font-extrabold text-slate-800 dark:text-white">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1">
                    <p className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            Tidak ada pertanyaan yang sesuai kata kunci "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
}
