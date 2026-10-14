import React, { useState } from 'react';
import { Palette, Check, Sparkles, X, Shield, Eye, Layers } from 'lucide-react';
import { LogoOption, LOGO_OPTIONS } from './logoData';
export type { LogoOption };
export { LOGO_OPTIONS };

interface LogoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLogoId: string;
  onSelectLogo: (logoId: string) => void;
}

export default function LogoSelectorModal({
  isOpen,
  onClose,
  selectedLogoId,
  onSelectLogo
}: LogoSelectorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto text-left">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            <Palette className="w-3.5 h-3.5" />
            <span>Pilihan Desain Logo Resmi BUMDESA</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Pilih Konsep Logo BUMDESA Waskita Wijaya
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pilih variasi logo yang paling cocok. Pilihan Anda akan langsung diterapkan pada Navbar Header, Footer, dan Dokumen Portal Website.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LOGO_OPTIONS.map((option) => {
            const isSelected = selectedLogoId === option.id;
            return (
              <div
                key={option.id}
                onClick={() => onSelectLogo(option.id)}
                className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-xl ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:shadow-md'
                }`}
              >
                {/* Badge top right */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-white bg-gradient-to-r ${option.colorTheme}`}>
                    {option.badge}
                  </span>
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {/* Logo Image Preview */}
                <div className="w-full aspect-square rounded-xl bg-white p-2 border border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center overflow-hidden mb-3 group-hover:scale-102 transition-transform">
                  <img
                    src={option.src}
                    alt={option.name}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                    {option.name}
                  </h4>
                  <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {option.tagline}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-200/60 dark:border-slate-700/60 mt-2">
                    {option.description}
                  </p>
                </div>

                {/* Select button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLogo(option.id);
                  }}
                  className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Terpilih Saat Ini' : 'Gunakan Logo Ini'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Warna & tipografi teks header otomatis menyesuaikan tema logo.</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-xl text-xs hover:bg-slate-800 cursor-pointer"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
}
