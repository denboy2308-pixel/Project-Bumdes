import React from 'react';
import { Facebook, Instagram, Youtube, Heart, ExternalLink, ShieldCheck, FileText, HelpCircle, Bot } from 'lucide-react';
import { PageType } from '../types';
import logoImage from '../assets/images/waskita_wijaya_logo_1784569660194.jpg';

interface FooterProps {
  setActivePage: (page: PageType) => void;
  currentLogoSrc?: string;
}

export default function Footer({ setActivePage, currentLogoSrc }: FooterProps) {
  const activeLogo = currentLogoSrc || logoImage;

  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: BUMDES Branding */}
          <div className="space-y-4 md:col-span-1.5 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-700 shadow-md flex items-center justify-center shrink-0 p-1">
                <img 
                  src={activeLogo} 
                  alt="Logo BUMDESA Waskita Wijaya" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">BUMDESA</p>
                <h3 className="text-base font-black text-white uppercase tracking-tight leading-tight mt-0.5">WASKITA WIJAYA</h3>
                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider leading-none mt-0.5">DESA WARU • KEC BAKI • KAB SUKOHARJO</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Badan Usaha Milik Desa Waru, Kec. Baki, Kab. Sukoharjo. Berdaya guna secara mandiri demi ketahanan sosial dan ekonomi warga.
            </p>
            <div className="text-[11px] text-emerald-400/90 font-mono font-semibold flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Terakreditasi Kementerian Desa PDTT • RI</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4 text-left">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigasi Cepat</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActivePage('beranda')} className="hover:text-emerald-400 hover:underline transition-all">
                  Beranda Utama
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('tentang-kami')} className="hover:text-emerald-400 hover:underline transition-all">
                  Tentang Kami
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('layanan')} className="hover:text-emerald-400 hover:underline transition-all">
                  Unit Layanan & Tarif
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('kegiatan')} className="hover:text-emerald-400 hover:underline transition-all">
                  Dokumentasi Kegiatan
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('pengumuman')} className="hover:text-emerald-400 hover:underline transition-all">
                  Saldo & Pengumuman
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActivePage('beranda');
                    setTimeout(() => {
                      document.getElementById('section-sponsor-partner')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }} 
                  className="hover:text-emerald-400 hover:underline transition-all text-emerald-400/90 font-medium"
                >
                  Mitra & Sponsor BUMDES
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Integrasi Media Sosial (FB & IG) */}
          <div className="space-y-4 text-left">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Integrasi Media Sosial</h4>
            <p className="text-xs text-slate-400">
              Kunjungi profil kami di media sosial resmi untuk melihat update harian dan pengumuman terbaru:
            </p>
            
            <div className="space-y-2.5 text-xs">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors"
              >
                <Facebook className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">Facebook BUMDES Waru</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 text-slate-300 hover:text-rose-400 transition-colors"
              >
                <Instagram className="w-4 h-4 text-rose-500" />
                <span className="font-semibold">Instagram @bumdes_waru</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 text-slate-300 hover:text-red-400 transition-colors"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span className="font-semibold">YouTube Waskita Wijaya TV</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>
            </div>
          </div>

          {/* Col 4: Location Contact Info */}
          <div className="space-y-4 text-left">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Jam Layanan Kantor</h4>
            <div className="text-xs text-slate-400 space-y-1.5 leading-relaxed">
              <p>Senin - Jumat: 08:00 - 15:30 WIB</p>
              <p>Sabtu (Khusus Bank Sampah): 08:00 - 14:00 WIB</p>
              <p>Minggu & Hari Libur Nasional: Tutup</p>
              <div className="pt-2 border-t border-slate-800 text-slate-500">
                Pendaftaran & login portal digital online 24 jam nonstop.
              </div>
            </div>

            {/* Regulasi & Bantuan Links */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Regulasi & Bantuan</h5>
              <div className="flex flex-col space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    setActivePage('kebijakan-privasi');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Kebijakan Privasi (UU PDP)</span>
                </button>
                <button
                  onClick={() => {
                    setActivePage('syarat-ketentuan');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Syarat & Ketentuan Layanan</span>
                </button>
                <button
                  onClick={() => {
                    setActivePage('pusat-bantuan');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Pusat Bantuan & Pengaduan</span>
                </button>
                <button
                  onClick={() => {
                    setActivePage('kontrol-agent-ai');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors text-left cursor-pointer flex items-center gap-1.5 pt-1"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kontrol Agent AI (To-The-Point)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-slate-400">
            <span>&copy; 2026 BUMDES Waskita Wijaya Desa Waru.</span>
            <span className="hidden sm:inline">&bull;</span>
            <button
              onClick={() => {
                setActivePage('kebijakan-privasi');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
            >
              Kebijakan Privasi
            </button>
            <span>&bull;</span>
            <button
              onClick={() => {
                setActivePage('syarat-ketentuan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
            >
              Syarat Layanan
            </button>
            <span>&bull;</span>
            <button
              onClick={() => {
                setActivePage('pusat-bantuan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
            >
              Kanal Dukungan
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/admin');
                setActivePage('admin-login');
              }}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] font-semibold flex items-center gap-1 border border-slate-700"
            >
              <span>🔒 Portal Admin & Staf (10 Peran)</span>
            </button>
            <div className="flex items-center space-x-1">
              <span>Dibuat dengan</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span>untuk kemajuan Desa Waru, Baki, Sukoharjo</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
