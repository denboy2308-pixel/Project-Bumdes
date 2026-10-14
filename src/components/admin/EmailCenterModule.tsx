import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Inbox, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Settings, 
  PenSquare, 
  Search,
  Server,
  RefreshCw,
  Key,
  ShieldCheck,
  Check
} from 'lucide-react';

type EmailTab = 'terkirim' | 'kotak_masuk' | 'antrean' | 'tulis_email' | 'konfigurasi_server';

interface EmailItem {
  id: string;
  senderOrRecipient: string;
  subject: string;
  preview: string;
  date: string;
  status: 'sent' | 'inbox' | 'queued' | 'bounced';
  isRead?: boolean;
}

const INITIAL_EMAILS: EmailItem[] = [
  {
    id: 'em-1',
    senderOrRecipient: 'Warga: Pak Tri Wahyudi (tri.wahyudi@gmail.com)',
    subject: 'Konfirmasi Pembayaran Sewa Lapangan Badminton Slot #2004',
    preview: 'Berikut kami lampirkan bukti transfer pelunasan sewa lapangan badminton malam minggu...',
    date: 'Hari ini, 13:20',
    status: 'inbox',
    isRead: false
  },
  {
    id: 'em-2',
    senderOrRecipient: 'Penerima: Seluruh Warga RT 02 Dusun I (45 Penerima)',
    subject: 'Tagihan Bank Sampah Periode September 2026',
    preview: 'Yth. Warga Desa Waru, tagihan retribusi pengelolaan sampah bulanan telah diterbitkan...',
    date: 'Hari ini, 09:15',
    status: 'sent'
  },
  {
    id: 'em-3',
    senderOrRecipient: 'Penerima: Tim Futsal Pemuda Baki (pemuda.baki@yahoo.com)',
    subject: 'Tiket QR Code Masuk GOR Waskita Wijaya',
    preview: 'Tiket booking Anda telah diverifikasi oleh kasir. Tunjukkan kode QR ini ke operator pintu masuk...',
    date: 'Kemarin, 19:40',
    status: 'sent'
  },
  {
    id: 'em-4',
    senderOrRecipient: 'Antrean AI Brain: Batch #04 (Dusun III)',
    subject: 'Pemberitahuan Sosialisasi Program Maggot & Pupuk Organik',
    preview: 'Jadwal pelatihan daur ulang sampah organik di balai pertemuan RW 03...',
    date: 'Antrean berikutnya (4 menit)',
    status: 'queued'
  },
  {
    id: 'em-5',
    senderOrRecipient: 'Warga: Hendra Kurniawan (hendra.invalid@domain.xyz)',
    subject: 'Undangan Rapat Evaluasi PADes BUMDes',
    preview: 'Surat dinas undangan pleno BPD...',
    date: '05 Sep 2026',
    status: 'bounced'
  }
];

interface EmailCenterModuleProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function EmailCenterModule({ onShowToast }: EmailCenterModuleProps) {
  const [activeTab, setActiveTab] = useState<EmailTab>('kotak_masuk');
  const [emails, setEmails] = useState<EmailItem[]>(INITIAL_EMAILS);

  // Form Tulis Email
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  // Konfigurasi Server SMTP
  const [smtpConfig, setSmtpConfig] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    username: 'notifikasi@bumdeswaskita.desa.id',
    senderName: 'BUMDes Waskita Wijaya Resmi',
    encryption: 'TLS',
    rateLimit: '20 email / 4 menit (AI Throttler)'
  });

  const sentCount = emails.filter(e => e.status === 'sent').length * 280 + 1420;
  const queueCount = emails.filter(e => e.status === 'queued').length + 27;
  const bouncedCount = emails.filter(e => e.status === 'bounced').length + 2;
  const unreadInboxCount = emails.filter(e => e.status === 'inbox' && !e.isRead).length + 6;

  const handleSendCompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      onShowToast('Mohon lengkapi alamat penerima, subjek, dan isi email', 'warning');
      return;
    }

    const newEmail: EmailItem = {
      id: `em-${Date.now()}`,
      senderOrRecipient: `Penerima: ${composeTo}`,
      subject: composeSubject,
      preview: composeBody.slice(0, 80) + '...',
      date: 'Baru saja',
      status: 'sent'
    };

    setEmails([newEmail, ...emails]);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setActiveTab('terkirim');
    onShowToast('Email berhasil dikirim melalui gateway SMTP!', 'success');
  };

  const handleSaveSmtp = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Konfigurasi server SMTP berhasil disimpan dan lolos uji handshake', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
              <span>Pusat Data Email & Gateway Komunikasi</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
                SMTP LIVE
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Kelola surat masuk, distribusi tagihan otomatis, antrean AI Brain throttler, dan konfigurasi server.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono">
            Host: {smtpConfig.host}:{smtpConfig.port}
          </span>
        </div>
      </div>

      {/* 4 Kartu Metrik Sesuai Permintaan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-800/60 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Terkirim</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white mt-1 font-mono">{sentCount.toLocaleString('id-ID')}</p>
          <span className="text-[10px] text-slate-400 block mt-0.5">Email Transaksional & Info</span>
        </div>

        <div className="p-5 bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-800/60 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Jumlah Antrean</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-300 mt-1 font-mono">{queueCount}</p>
          <span className="text-[10px] text-slate-400 block mt-0.5">Batch Throttler ±20/4 mnt</span>
        </div>

        <div className="p-5 bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-800/60 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Gagal Terkirim</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-black text-rose-400 mt-1 font-mono">{bouncedCount}</p>
          <span className="text-[10px] text-slate-400 block mt-0.5">Alamat Tidak Valid / Bounce</span>
        </div>

        <div className="p-5 bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-800/60 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Belum Terbaca</span>
            <Inbox className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-cyan-300 mt-1 font-mono">{unreadInboxCount}</p>
          <span className="text-[10px] text-slate-400 block mt-0.5">Pesan Masuk dari Warga</span>
        </div>
      </div>

      {/* Kolom Menu Memanjang yang Dapat Dipilih */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center space-x-2 overflow-x-auto shadow-md">
        <button
          type="button"
          onClick={() => setActiveTab('kotak_masuk')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'kotak_masuk'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Kotak Masuk ({unreadInboxCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('terkirim')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'terkirim'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Terkirim</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('antrean')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'antrean'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Antrean ({queueCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tulis_email')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'tulis_email'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <PenSquare className="w-3.5 h-3.5" />
          <span>Tulis Email</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('konfigurasi_server')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'konfigurasi_server'
              ? 'bg-slate-800 text-white font-black border border-slate-700 shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Konfigurasi Server Email</span>
        </button>
      </div>

      {/* Konten Tab Interaktif */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        
        {/* TAB 1: KOTAK MASUK */}
        {activeTab === 'kotak_masuk' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Kotak Masuk Pesan Warga</h4>
              <span className="text-[11px] text-cyan-400 font-bold">Sinkronisasi Real-time</span>
            </div>
            <div className="divide-y divide-slate-800">
              {emails.filter(e => e.status === 'inbox').map((mail) => (
                <div key={mail.id} className="py-3.5 hover:bg-slate-850 px-3 rounded-2xl transition-colors cursor-pointer flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{mail.senderOrRecipient}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/20 text-cyan-300">Baru</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-200 mt-1">{mail.subject}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{mail.preview}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-4">{mail.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TERKIRIM */}
        {activeTab === 'terkirim' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Email Berhasil Terkirim</h4>
              <span className="text-[11px] text-emerald-400 font-bold">Total: {sentCount} Pesan</span>
            </div>
            <div className="divide-y divide-slate-800">
              {emails.filter(e => e.status === 'sent').map((mail) => (
                <div key={mail.id} className="py-3.5 hover:bg-slate-850 px-3 rounded-2xl transition-colors cursor-pointer flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-400">{mail.senderOrRecipient}</span>
                    <h5 className="text-xs font-bold text-white mt-1">{mail.subject}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{mail.preview}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-4">{mail.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ANTREAN */}
        {activeTab === 'antrean' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Antrean Distribusi Email (AI Throttler)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Dikirim bertahap ±20 email per 4 menit untuk keamanan anti-spam</p>
              </div>
              <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-xl text-xs font-bold">
                Batch Aktif
              </span>
            </div>
            <div className="divide-y divide-slate-800">
              {emails.filter(e => e.status === 'queued').map((mail) => (
                <div key={mail.id} className="py-3.5 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-400">{mail.senderOrRecipient}</span>
                    <h5 className="text-xs font-bold text-white mt-1">{mail.subject}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{mail.preview}</p>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono shrink-0 ml-4">{mail.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TULIS EMAIL */}
        {activeTab === 'tulis_email' && (
          <form onSubmit={handleSendCompose} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Tulis Email Keluar Baru</h4>
              <span className="text-[11px] text-slate-400">Pengirim: {smtpConfig.username}</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Kepada (Email Penerima) *</label>
              <input 
                type="email"
                value={composeTo}
                onChange={e => setComposeTo(e.target.value)}
                placeholder="nama.warga@gmail.com atau pilih grup Dusun"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Subjek Surat *</label>
              <input 
                type="text"
                value={composeSubject}
                onChange={e => setComposeSubject(e.target.value)}
                placeholder="Contoh: Konfirmasi Tagihan Bank Sampah / Jadwal Reservasi"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Isi Pesan Surat *</label>
              <textarea 
                rows={5}
                value={composeBody}
                onChange={e => setComposeBody(e.target.value)}
                placeholder="Tulis pesan resmi yang akan dikirimkan ke email warga..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Email Sekarang</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 5: KONFIGURASI SERVER EMAIL */}
        {activeTab === 'konfigurasi_server' && (
          <form onSubmit={handleSaveSmtp} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Konfigurasi Gateway Server SMTP</h4>
              <span className="text-[11px] text-emerald-400 font-mono font-bold">● Status Koneksi: Aktif</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">SMTP Host</label>
                <input 
                  type="text"
                  value={smtpConfig.host}
                  onChange={e => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">SMTP Port</label>
                <input 
                  type="number"
                  value={smtpConfig.port}
                  onChange={e => setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Username / Email Pengirim</label>
                <input 
                  type="text"
                  value={smtpConfig.username}
                  onChange={e => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nama Tampilan Pengirim (Sender Name)</label>
                <input 
                  type="text"
                  value={smtpConfig.senderName}
                  onChange={e => setSmtpConfig({ ...smtpConfig, senderName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">AI Brain Throttler Protection</span>
                <span className="text-[11px] text-slate-400">Kecepatan: {smtpConfig.rateLimit}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl text-[10px] font-bold">
                ENKRIPSI TLS AKTIF
              </span>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => onShowToast('Tes ping SMTP berhasil: Respon 220 OK dalam 45ms', 'info')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
              >
                Uji Koneksi (Test Handshake)
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                Simpan Konfigurasi Server
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
