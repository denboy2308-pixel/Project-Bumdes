import React from 'react';
import { Landmark, TrendingUp, ShieldCheck, ArrowRight, FileText, Calendar, AlertCircle } from 'lucide-react';
import { Announcement } from '../types';

export default function AnnouncementsSection() {
  const announcements: Announcement[] = [
    {
      id: 'ann-saldo',
      title: 'Laporan Transparansi Saldo Kas BUMDES Semester I - 2026',
      date: '10 Juli 2026',
      content: 'Laporan pertanggungjawaban berkala BUMDES Waskita Wijaya Desa Waru telah rampung diverifikasi Dewan Pengawas. Laporan menyeluruh mencakup operasional Unit Pengelolaan Sampah dan Unit Gedung & Olahraga.',
      type: 'keuangan'
    },
    {
      id: 'ann-maint',
      title: 'Pemberitahuan Perawatan Berkala Lantai Arena Bulutangkis',
      date: '15 Juli 2026',
      content: 'Diberitahukan kepada seluruh member dan pengguna umum lapangan badminton, bahwa akan diadakan perawatan (coating) parket kayu lapangan secara rutin demi keselamatan dan kenyamanan berolahraga.',
      type: 'umum'
    },
    {
      id: 'ann-deviden',
      title: 'Penyetoran Pendapatan Asli Desa (PAD) Waru Tahun Buku 2025',
      date: '02 April 2026',
      content: 'Sebagai bentuk akuntabilitas publik, bagi hasil usaha bersih BUMDES Waskita Wijaya telah disetorkan ke rekening Kas Desa Waru sebagai kontribusi resmi pembangunan infrastruktur dan kesejahteraan desa.',
      type: 'keuangan'
    }
  ];

  return (
    <section id="pengumuman-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Transparansi Publik
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pengumuman & Saldo Kas BUMDES
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="text-slate-500 text-base leading-relaxed">
            Menjaga integritas dan kepercayaan warga Desa Waru dengan menyajikan rincian keuangan kas BUMDES serta pemberitahuan resmi pengelola secara berkala.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Financial Position (Saldo Kas Dashboard) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
              <div className="flex items-center space-x-2.5">
                <Landmark className="w-6 h-6 text-emerald-400" />
                <h3 className="font-bold text-slate-100 text-base tracking-tight">Status Kas Buku BUMDES</h3>
              </div>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                Maju & Terpercaya
              </span>
            </div>

            {/* Main balance indicator */}
            <div className="space-y-1 relative z-10">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Status Akuntabilitas Kas</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
                Transparan & Akuntabel
              </p>
              <p className="text-[11px] text-slate-400 font-mono">Buku Kas diperiksa berkala oleh Pengawas BPD Desa Waru</p>
            </div>

            {/* Ledger breakdowns */}
            <div className="space-y-4 pt-2 relative z-10">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 pb-2">
                Alokasi Unit Usaha Resmi:
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>1. Unit Layanan Pengelolaan Sampah</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">Operasional Aktif</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>2. Unit Persewaan Gedung Serbaguna</span>
                  </div>
                  <span className="text-xs font-semibold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">Operasional Aktif</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span>3. Unit Olahraga & Arena Bulutangkis</span>
                  </div>
                  <span className="text-xs font-semibold text-yellow-400 bg-yellow-950/60 px-2 py-0.5 rounded border border-yellow-800">Operasional Aktif</span>
                </div>
              </div>
            </div>

            {/* Security stamp */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start space-x-3 text-emerald-200 relative z-10">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-emerald-200/90">
                Laporan keuangan kas BUMDes diaudit secara periodik. Rincian mutasi tabungan dan saldo pribadi warga hanya dapat diakses melalui akun resmi nasabah yang terautentikasi.
              </p>
            </div>
          </div>

          {/* Right: Announcements Lists */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 text-left border-b border-slate-100 pb-3 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-emerald-600" />
              <span>Pengumuman Resmi Pengelola</span>
            </h3>

            <div className="space-y-5">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left space-y-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{ann.date}</span>
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                      ann.type === 'keuangan' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {ann.type === 'keuangan' ? 'Keuangan Desa' : 'Informasi Umum'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-800 text-base leading-snug">
                    {ann.title}
                  </h4>
                  
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {ann.content}
                  </p>

                  {ann.amount && (
                    <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 inline-flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-slate-500 font-semibold">Total Anggaran Kas:</span>
                      <span className="text-xs font-bold text-emerald-600">Rp {ann.amount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
