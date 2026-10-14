import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Palette, Check, Sparkles, PhoneCall, ShieldCheck, UserCheck } from 'lucide-react';
import logoImage from '../assets/images/waskita_wijaya_logo_1784569660194.jpg';

export type WAStyleType = 'pill' | 'classic' | 'card' | 'glass';

interface WAStyleOption {
  id: WAStyleType;
  name: string;
  badge: string;
  description: string;
}

export const WA_STYLE_OPTIONS: WAStyleOption[] = [
  {
    id: 'pill',
    name: 'Pill Bar & Admin Avatar',
    badge: 'Modern & Paling Interaktif',
    description: 'Tombol kapsul horizontal lengkap dengan foto profil admin, indikator online hijau, dan teks WhatsApp.',
  },
  {
    id: 'classic',
    name: 'FAB Lingkaran & Badge Ring',
    badge: 'Klasik & Ringkas',
    description: 'Tombol lingkaran WhatsApp standar dengan efek animasi gelombang radar dan badge notifikasi.',
  },
  {
    id: 'card',
    name: 'Interactive Chat Popup',
    badge: 'Respon Cepat',
    description: 'Menampilkan dialog chat mini interaktif saat diklik sebelum langsung diarahkan ke aplikasi WhatsApp.',
  },
  {
    id: 'glass',
    name: 'Glassmorphism Emerald Neon',
    badge: 'Futuristik & Premium',
    description: 'Efek kaca berkilau dengan border emerald bercahaya dan indikator status waktu respon.',
  }
];

export default function WhatsAppFAB() {
  const [styleType, setStyleType] = useState<WAStyleType>(() => {
    return (localStorage.getItem('bumdes_wa_style') as WAStyleType) || 'pill';
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const whatsappNumber = "6282134567890";
  const defaultMsg = encodeURIComponent("Halo Admin BUMDESA Waskita Wijaya, saya ingin berkonsultasi mengenai layanan BUMDESA...");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMsg}`;

  const changeStyle = (newStyle: WAStyleType) => {
    setStyleType(newStyle);
    localStorage.setItem('bumdes_wa_style', newStyle);
  };

  return (
    <>
      {/* Floating Container Bottom Right */}
      <div
        id="whatsapp-fab-container"
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-none"
      >
        {/* Style Selector Toggle Trigger Button (Mini Palette Icon) */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md backdrop-blur-md hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 transition-all cursor-pointer"
            title="Ganti Pilihan Desain WhatsApp"
          >
            <Palette className="w-3 h-3 text-emerald-500 animate-spin-slow" />
            <span>Desain WA ({WA_STYLE_OPTIONS.find(s => s.id === styleType)?.name.split(' ')[0]})</span>
          </button>
        </div>

        {/* ------------------- STYLE 1: PILL BAR & AVATAR ------------------- */}
        {styleType === 'pill' && (
          <div className="pointer-events-auto relative group">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex items-center space-x-2.5 bg-slate-900/90 dark:bg-slate-900/95 border border-emerald-500/40 text-white pl-2 pr-4 py-2 rounded-full shadow-xl shadow-emerald-950/20 backdrop-blur-md hover:border-emerald-400 hover:scale-102 active:scale-98 transition-all duration-200 cursor-pointer"
            >
              <div className="relative shrink-0">
                <img
                  src={logoImage}
                  alt="Admin CS BUMDESA"
                  className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/80 bg-white"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" />
              </div>

              <div className="text-left leading-tight">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-black text-white tracking-tight">CS BUMDESA</span>
                  <span className="text-[8px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium">Tanya Layanan via WA</p>
              </div>

              {/* WhatsApp Icon Circle */}
              <div className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:rotate-12 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.003 2C6.47 2 2 6.48 2 12.01c0 1.84.5 3.56 1.36 5.05L2 22l5.12-1.34c1.42.77 3.03 1.18 4.71 1.18 5.53 0 10.01-4.48 10.01-10.01C21.84 6.48 17.53 2 12.003 2zm5.79 13.9c-.24.69-1.22 1.26-1.68 1.34-.43.08-.99.14-2.85-.63-2.38-.98-3.91-3.39-4.03-3.55-.12-.17-.99-1.32-.99-2.52 0-1.2.63-1.79.85-2.03.22-.24.49-.3.65-.3s.33.01.47.01c.15 0 .34-.06.53.39.2.49.68 1.66.74 1.78.06.12.1.26.02.43-.08.17-.12.28-.24.42-.12.14-.26.31-.37.42-.12.12-.25.25-.1.5.3.5 1.33 2.19 2.85 3.53 1.96 1.73 3.61 2.27 4.12 2.48.51.21.81.18 1.11-.15.3-.33 1.3-1.51 1.64-2.02.34-.51.68-.42 1.14-.25.46.17 2.92 1.37 3.42 1.62.5.25.83.37.95.57.12.2.12 1.18-.12 1.87z" />
                </svg>
              </div>
            </a>
          </div>
        )}

        {/* ------------------- STYLE 2: CLASSIC CIRCULAR FAB ------------------- */}
        {styleType === 'classic' && (
          <div className="pointer-events-auto flex items-center gap-3">
            {/* Tooltip Bubble */}
            <div
              style={{
                opacity: isHovered ? 1 : 0,
                transform: `translateX(${isHovered ? '0px' : '10px'})`,
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="hidden md:flex bg-slate-900/90 dark:bg-slate-800/95 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg border border-slate-800 dark:border-slate-700 items-center justify-center shrink-0 tracking-wide"
            >
              Hubungi Admin BUMDESA
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 rotate-45 bg-slate-900/90 dark:bg-slate-800/95" />
            </div>

            <div className="relative">
              {/* Red notification badge */}
              <span className="absolute -top-1 -right-1 z-10 w-5 h-5 bg-red-500 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
                1
              </span>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white rounded-full shadow-xl shadow-emerald-500/25 border border-emerald-400/30 transition-all duration-200 cursor-pointer group relative"
                aria-label="Hubungi Admin via WhatsApp"
              >
                <span className="absolute -inset-1.5 rounded-full bg-[#25D366] opacity-25 animate-ping duration-1000 -z-10" />
                <span className="absolute -inset-3.5 rounded-full bg-[#25D366] opacity-10 animate-pulse -z-10" />

                <svg className="w-7 h-7 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.003 2C6.47 2 2 6.48 2 12.01c0 1.84.5 3.56 1.36 5.05L2 22l5.12-1.34c1.42.77 3.03 1.18 4.71 1.18 5.53 0 10.01-4.48 10.01-10.01C21.84 6.48 17.53 2 12.003 2zm5.79 13.9c-.24.69-1.22 1.26-1.68 1.34-.43.08-.99.14-2.85-.63-2.38-.98-3.91-3.39-4.03-3.55-.12-.17-.99-1.32-.99-2.52 0-1.2.63-1.79.85-2.03.22-.24.49-.3.65-.3s.33.01.47.01c.15 0 .34-.06.53.39.2.49.68 1.66.74 1.78.06.12.1.26.02.43-.08.17-.12.28-.24.42-.12.14-.26.31-.37.42-.12.12-.25.25-.1.5.3.5 1.33 2.19 2.85 3.53 1.96 1.73 3.61 2.27 4.12 2.48.51.21.81.18 1.11-.15.3-.33 1.3-1.51 1.64-2.02.34-.51.68-.42 1.14-.25.46.17 2.92 1.37 3.42 1.62.5.25.83.37.95.57.12.2.12 1.18-.12 1.87z" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* ------------------- STYLE 3: INTERACTIVE CHAT POPUP ------------------- */}
        {styleType === 'card' && (
          <div className="pointer-events-auto flex flex-col items-end">
            {/* Popover Card */}
            {isChatOpen && (
              <div className="mb-3 w-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={logoImage}
                      alt="Admin Logo"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white/80 bg-white"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider">CS BUMDESA Waru</h4>
                      <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        Aktif • Buka jam 08.00 - 16.00
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body message */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 space-y-3">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-xs border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    👋 Selamat Datang! Ada yang bisa kami bantu terkait layanan Sewa Gedung, Lapangan, atau Unit Usaha "Layanan Pengelolaan Sampah Desa"?
                  </div>
                  <span className="text-[9px] text-slate-400 block text-right font-mono">Respon rata-rata: &lt; 5 menit</span>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Mulai Chat di WhatsApp</span>
                  </a>
                </div>
              </div>
            )}

            {/* Toggle Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="flex items-center space-x-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all duration-200 cursor-pointer font-black text-xs uppercase tracking-wider"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{isChatOpen ? 'Tutup Chat' : 'Tanya CS Admin'}</span>
            </button>
          </div>
        )}

        {/* ------------------- STYLE 4: GLASSMORPHISM NEON ------------------- */}
        {styleType === 'glass' && (
          <div className="pointer-events-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 bg-slate-950/90 text-white p-2.5 pr-5 rounded-2xl border border-emerald-500/50 shadow-2xl shadow-emerald-950/50 backdrop-blur-xl hover:border-emerald-400 hover:shadow-emerald-500/20 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#25D366] to-teal-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block">
                  WHATSAPP RESMI
                </span>
                <span className="text-xs font-extrabold text-white tracking-tight block">
                  BUMDESA Waskita
                </span>
              </div>
            </a>
          </div>
        )}
      </div>

      {/* ------------------- MODAL CHOOSER DIALOG ------------------- */}
      {isSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-left relative">
            <button
              onClick={() => setIsSelectorOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Palette className="w-3 h-3" />
                <span>Pilihan Tampilan Floating WhatsApp</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Pilih Gaya Tombol WhatsApp
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih gaya tampilan tombol melayang yang paling ideal sesuai keinginan Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WA_STYLE_OPTIONS.map((option) => {
                const isSelected = styleType === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => changeStyle(option.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                          {option.badge}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white mt-1">
                        {option.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                        {option.description}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        changeStyle(option.id);
                      }}
                      className={`mt-3 w-full py-1.5 px-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {isSelected ? 'Gaya Aktif' : 'Pilih Gaya Ini'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsSelectorOpen(false)}
                className="px-5 py-2 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-xl text-xs hover:bg-slate-800 cursor-pointer"
              >
                Terapkan & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
