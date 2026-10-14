import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronRight, 
  ArrowLeft, 
  Building2, 
  FileText, 
  RefreshCw, 
  Sparkles,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { PageType } from '../../types';

interface HelpCenterSupportViewProps {
  onNavigate?: (page: PageType) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

interface SupportTicket {
  id: string;
  title: string;
  category: string;
  description: string;
  location?: string;
  name: string;
  contact: string;
  status: 'Menunggu Verifikasi' | 'Ditugaskan ke Tim Lapangan' | 'Sedang Dikerjakan' | 'Selesai';
  assignedOfficer?: string;
  resolutionNote?: string;
  createdAt: string;
  updatedAt?: string;
}

const FAQS = [
  {
    category: 'Bank Sampah & Retribusi',
    question: 'Bagaimana cara mendaftar sebagai nasabah bank sampah Desa Waru?',
    answer: 'Anda dapat mendaftar mandiri melalui menu "Daftar Nasabah Sampah" di portal web ini, atau langsung datang ke kantor BUMDes/titik timbang RT membawa e-KTP. Petugas akan membuatkan buku tabungan dan nomor ID Nasabah resmi.'
  },
  {
    category: 'Bank Sampah & Retribusi',
    question: 'Kapan jadwal armada truk mengangkut sampah di rukun tetangga saya?',
    answer: 'Armada truk sampah beroperasi setiap hari Senin hingga Sabtu dengan pembagian rute dusun: Dusun I & II pada pagi hari (07:30 - 11:00 WIB), serta Dusun III & IV pada siang hari (11:30 - 15:00 WIB). Jadwal live dapat dipantau di menu Jadwal Sampah.'
  },
  {
    category: 'Reservasi GOR & Gedung',
    question: 'Bagaimana cara memesan Lapangan Bulutangkis atau Gedung Serbaguna?',
    answer: 'Buka menu "Cek Jadwal & Booking" di portal. Pilih tanggal dan jam yang berstatus "Tersedia", lalu gunakan fitur Booking Kilat. Anda akan menerima E-Tiket instan dengan QR Code yang dapat langsung ditunjukkan ke petugas loket.'
  },
  {
    category: 'Reservasi GOR & Gedung',
    question: 'Apakah pembayaran sewa dapat dilakukan secara tunai di lapangan?',
    answer: 'Ya, Anda dapat memilih metode "Bayar di Loket Kasir GOR (Tunai)" saat memesan, atau melakukan scan QRIS resmi secara online langsung dari ponsel Anda.'
  },
  {
    category: 'Keuangan & E-Kuitansi',
    question: 'Bagaimana cara melihat dan mengunduh E-Kuitansi resmi pembayaran saya?',
    answer: 'Setiap kali tagihan atau reservasi berstatus lunas, sistem menerbitkan nomor E-Kuitansi resmi (format KWT-BW-XXXX). Anda dapat meninjau dan mencetaknya di portal riwayat pembayaran akun Anda atau meminta cetak fisik di loket kasir.'
  },
  {
    category: 'Marketplace UMKM Desa',
    question: 'Bagaimana cara pelaku UMKM Desa Waru memasarkan produknya di website ini?',
    answer: 'Warga desa yang memiliki usaha kuliner, kerajinan, atau produk pertanian dapat mendaftar via menu Marketplace UMKM dengan mengisi formulir kurasi produk atau melapor ke Seksi Usaha BUMDes Waru.'
  }
];

export default function HelpCenterSupportView({ onNavigate, onShowToast }: HelpCenterSupportViewProps) {
  const [activeTab, setActiveTab] = useState<'pusat-bantuan' | 'buat-tiket' | 'lacak-tiket'>('pusat-bantuan');
  const [searchFaqQuery, setSearchFaqQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Form State for Ticket Submission
  const [ticketCategory, setTicketCategory] = useState<'Armada Sampah' | 'Fasilitas GOR & Gedung' | 'Tagihan & Kas' | 'Lingkungan Desa' | 'Pertanyaan Layanan'>('Pertanyaan Layanan');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketLocation, setTicketLocation] = useState('');
  const [ticketName, setTicketName] = useState('');
  const [ticketContact, setTicketContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);

  // Tracking State
  const [trackingQuery, setTrackingQuery] = useState('');
  const [isSearchingTrack, setIsSearchingTrack] = useState(false);
  const [trackedTickets, setTrackedTickets] = useState<SupportTicket[]>([]);
  const [trackSearched, setTrackSearched] = useState(false);

  const notify = (msg: string, type: 'success' | 'info' | 'warning' = 'info') => {
    if (onShowToast) {
      onShowToast(msg, type);
    }
  };

  const handleOpenWhatsAppHotline = (customTopic?: string) => {
    const text = customTopic
      ? `Halo Pengelola BUMDES Waskita Wijaya Desa Waru, saya ingin berkonsultasi mengenai: ${customTopic}`
      : 'Halo Pengelola BUMDES Waskita Wijaya Desa Waru, saya memerlukan bantuan informasi layanan desa.';
    window.open(`https://wa.me/6282134567890?text=${encodeURIComponent(text)}`, '_blank');
    notify('Membuka tautan WhatsApp Customer Support BUMDes Waru', 'info');
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketDescription.trim() || !ticketName.trim() || !ticketContact.trim()) {
      notify('Harap lengkapi semua kolom wajib bertanda bintang (*)', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ticketTitle.trim(),
          category: ticketCategory,
          description: ticketDescription.trim(),
          location: ticketLocation.trim(),
          name: ticketName.trim(),
          contact: ticketContact.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.ticket) {
        setSubmittedTicket(data.ticket);
        notify(`Tiket pengaduan #${data.ticket.id} berhasil dikirim!`, 'success');
        // Reset form
        setTicketTitle('');
        setTicketDescription('');
        setTicketLocation('');
      } else {
        throw new Error(data.error || 'Gagal mengirim tiket.');
      }
    } catch (err: any) {
      notify(err.message || 'Koneksi ke server bantuan gagal.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchTracking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trackingQuery.trim()) {
      notify('Masukkan nomor tiket (misal: TKT-ADU-...) atau nomor WhatsApp', 'warning');
      return;
    }

    setIsSearchingTrack(true);
    setTrackSearched(true);
    try {
      const res = await fetch(`/api/support/tickets?lookup=${encodeURIComponent(trackingQuery.trim())}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.tickets)) {
        setTrackedTickets(data.tickets);
        if (data.tickets.length > 0) {
          notify(`Ditemukan ${data.tickets.length} tiket terkait "${trackingQuery}".`, 'success');
        } else {
          notify('Tidak ada tiket yang cocok dengan pencarian Anda.', 'info');
        }
      } else {
        setTrackedTickets([]);
      }
    } catch (err) {
      notify('Gagal memuat status tiket dari server.', 'warning');
      setTrackedTickets([]);
    } finally {
      setIsSearchingTrack(false);
    }
  };

  const filteredFaqs = FAQS.filter(f => 
    f.question.toLowerCase().includes(searchFaqQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchFaqQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchFaqQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-left transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb / Back Button */}
        <div className="flex items-center justify-between">
          {onNavigate && (
            <button
              onClick={() => onNavigate('beranda')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda Utama</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hotline Support Online 08:00 - 15:30 WIB</span>
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Kanal Dukungan & Pusat Pengaduan Warga</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Pusat Bantuan & Pengaduan BUMDes Waskita Wijaya
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Kami siap melayani kebutuhan informasi, pertanyaan seputar layanan bank sampah, reservasi sarana publik, kendala pembayaran, serta tindak lanjut pengaduan Anda secara profesional dan transparan.
            </p>
          </div>

          {/* Quick Support Channels Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8 relative z-10">
            <button
              onClick={() => handleOpenWhatsAppHotline()}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-left transition-all cursor-pointer group flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-200 uppercase tracking-wider block font-semibold">Hotline WhatsApp</span>
                <strong className="text-sm font-bold text-white block">+62 821-3456-7890</strong>
                <span className="text-[11px] text-emerald-200">Respon cepat staf loket &bull; Chat Langsung</span>
              </div>
            </button>

            <a
              href="mailto:bumdes.waskitawijaya@waru.desa.id"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-left transition-all cursor-pointer group flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-200 uppercase tracking-wider block font-semibold">Surat Elektronik</span>
                <strong className="text-xs sm:text-sm font-bold text-white block truncate">bumdes.waskitawijaya@waru.desa.id</strong>
                <span className="text-[11px] text-emerald-200">Kemitraan, legalitas & surat dinas</span>
              </div>
            </a>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-left flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-200 uppercase tracking-wider block font-semibold">Kantor Sekretariat</span>
                <strong className="text-xs sm:text-sm font-bold text-white block">Jl. Raya Waru-Baki No. 12</strong>
                <span className="text-[11px] text-emerald-200">Buka Senin–Jumat 08:00–15:30 WIB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pusat-bantuan')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'pusat-bantuan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Pusat Tanya Jawab (FAQ)</span>
          </button>

          <button
            onClick={() => setActiveTab('buat-tiket')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'buat-tiket'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Kirim Pengaduan / Pertanyaan Baru</span>
          </button>

          <button
            onClick={() => setActiveTab('lacak-tiket')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'lacak-tiket'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Lacak Status Tiket Pengaduan</span>
          </button>
        </div>

        {/* TAB 1: FAQ INTERAKTIF */}
        {activeTab === 'pusat-bantuan' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search FAQ Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchFaqQuery}
                onChange={e => setSearchFaqQuery(e.target.value)}
                placeholder="Cari pertanyaan seputar pendaftaran sampah, sewa gedung, pembayaran QRIS, dll..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              {searchFaqQuery && (
                <button
                  onClick={() => setSearchFaqQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Hapus
                </button>
              )}
            </div>

            {/* Accordion FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                          {faq.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500">
                        {isOpen ? <ChevronDown className="w-4 h-4 text-emerald-600" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/30">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Tidak ditemukan jawaban untuk kata kunci "{searchFaqQuery}"
                  </p>
                  <p className="text-xs text-slate-500">
                    Silakan gunakan formulir buat tiket pengaduan atau hubungi hotline WhatsApp resmi.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BUAT TIKET PENGADUAN / PERTANYAAN */}
        {activeTab === 'buat-tiket' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Formulir Pengaduan & Layanan Bantuan Terpadu</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Sampaikan kendala armada sampah, fasilitas GOR, faktur penagihan, atau permohonan informasi. Setiap tiket diberi nomor registrasi resmi yang dapat dilacak secara real-time.
              </p>
            </div>

            {submittedTicket && (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Pengaduan Berhasil Terdaftar di Server!</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <p>Nomor Tiket Anda: <strong className="font-mono text-emerald-700 dark:text-emerald-400 text-sm font-extrabold">{submittedTicket.id}</strong></p>
                  <p>Judul: <strong>{submittedTicket.title}</strong> ({submittedTicket.category})</p>
                  <p>Status: <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">{submittedTicket.status}</span></p>
                </div>
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setTrackingQuery(submittedTicket.id);
                      setActiveTab('lacak-tiket');
                      handleSearchTracking();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 cursor-pointer"
                  >
                    Lacak Tiket Sekarang
                  </button>
                  <button
                    onClick={() => setSubmittedTicket(null)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300 cursor-pointer"
                  >
                    Tutup Notifikasi Ini
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                    Nama Lengkap Anda *
                  </label>
                  <input
                    type="text"
                    value={ticketName}
                    onChange={e => setTicketName(e.target.value)}
                    placeholder="Contoh: Bpk. Joko Susanto"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                    Nomor WhatsApp / HP Aktif *
                  </label>
                  <input
                    type="text"
                    value={ticketContact}
                    onChange={e => setTicketContact(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                    Kategori Pengaduan / Topik *
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={e => setTicketCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Armada Sampah">Armada Sampah & Jadwal Truk</option>
                    <option value="Fasilitas GOR & Gedung">Fasilitas Lapangan GOR & Gedung</option>
                    <option value="Tagihan & Kas">Tagihan, E-Kuitansi & Kas Teller</option>
                    <option value="Lingkungan Desa">Kebersihan Lingkungan & TPS Desa</option>
                    <option value="Pertanyaan Layanan">Pertanyaan Umum & Informasi Layanan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                    Lokasi Wilayah / Dusun (Opsional)
                  </label>
                  <input
                    type="text"
                    value={ticketLocation}
                    onChange={e => setTicketLocation(e.target.value)}
                    placeholder="Contoh: Dusun II, RT 03 / RW 01 Desa Waru"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  Subjek / Judul Pengaduan *
                </label>
                <input
                  type="text"
                  value={ticketTitle}
                  onChange={e => setTicketTitle(e.target.value)}
                  placeholder="Contoh: Permintaan penjemputan tambahan sampah botol plastik di RT 03"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  Uraian Lengkap Pengaduan / Pesan *
                </label>
                <textarea
                  rows={4}
                  value={ticketDescription}
                  onChange={e => setTicketDescription(e.target.value)}
                  placeholder="Jelaskan secara rinci kronologi, kendala yang dihadapi, atau permohonan yang diajukan..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Mengirimkan Tiket...' : 'Kirim Tiket Pengaduan Resmi'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: LACAK STATUS TIKET */}
        {activeTab === 'lacak-tiket' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-600" />
                <span>Pelacakan Status Penanganan Tiket Pengaduan</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Masukkan Nomor Tiket (misal: <code>TKT-ADU-108</code>) atau nomor WhatsApp yang Anda gunakan saat mendaftarkan laporan.
              </p>
            </div>

            <form onSubmit={handleSearchTracking} className="flex gap-2">
              <input
                type="text"
                value={trackingQuery}
                onChange={e => setTrackingQuery(e.target.value)}
                placeholder="Contoh: TKT-ADU-108 atau 081234567890"
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isSearchingTrack}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{isSearchingTrack ? 'Mencari...' : 'Cari Tiket'}</span>
              </button>
            </form>

            {/* Results List */}
            {trackedTickets.length > 0 && (
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Hasil Penemuan ({trackedTickets.length} Tiket)
                </h3>
                {trackedTickets.map(t => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                            #{t.id}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                            {t.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                          {t.title}
                        </h4>
                      </div>

                      <div>
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                          t.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                            : t.status === 'Sedang Dikerjakan'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>{t.status}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {t.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div>Pelapor: <strong className="text-slate-800 dark:text-slate-200">{t.name}</strong></div>
                      <div>Tanggal: <strong className="text-slate-800 dark:text-slate-200">{new Date(t.createdAt).toLocaleDateString('id-ID')}</strong></div>
                      <div>Petugas: <strong className="text-slate-800 dark:text-slate-200">{t.assignedOfficer || 'Menunggu Penugasan'}</strong></div>
                    </div>

                    {t.resolutionNote && (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                        <strong className="block font-bold">Catatan Penanganan Petugas:</strong>
                        <span>{t.resolutionNote}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {trackSearched && trackedTickets.length === 0 && !isSearchingTrack && (
              <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Tidak ditemukan tiket yang sesuai dengan pencarian Anda.
                </p>
                <p className="text-[11px] text-slate-500">
                  Pastikan format nomor tiket benar (contoh: <code>TKT-ADU-108</code>) atau nomor WhatsApp tanpa spasi.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
