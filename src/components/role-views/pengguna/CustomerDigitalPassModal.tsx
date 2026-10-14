import React from 'react';
import { 
  X, QrCode, Download, Copy, Shield, Sparkles, 
  CheckCircle2, Coins, Phone, MapPin, User as UserIcon 
} from 'lucide-react';
import { getQrCodeImageUrl } from '../../../services/freeApiService';
import { showToast } from '../../ToastNotification';
import { User } from '../../../types';

interface CustomerDigitalPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  saldo: number;
  poin: number;
}

export default function CustomerDigitalPassModal({
  isOpen,
  onClose,
  currentUser,
  saldo,
  poin
}: CustomerDigitalPassModalProps) {
  if (!isOpen) return null;

  const customerId = currentUser.nasabahId || 'NSB-38290';
  const qrContent = `BUMDES-WARU-PAS:${customerId}:${currentUser.name || currentUser.email}`;
  const qrImageUrl = getQrCodeImageUrl(qrContent, 300);

  const handleCopyId = () => {
    navigator.clipboard.writeText(customerId);
    showToast(`ID Pelanggan "${customerId}" berhasil disalin ke clipboard!`, 'success');
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `Pas-Digital-${customerId}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Gambar QR Pas Digital berhasil diunduh!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-left relative flex flex-col">
        
        {/* Header Ribbon */}
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white">Pas Digital Warga Desa</h3>
              <p className="text-[10px] text-slate-400">BUMDes Waskita Wijaya · Waru, Baki</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4 text-center">
          
          {/* User Badge */}
          <div className="space-y-1">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                <span>Warga Aktif Terverifikasi</span>
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {currentUser.name || currentUser.email}
            </h4>
            <div className="text-xs text-slate-500 font-mono">
              ID Pelanggan: <strong className="text-emerald-600 font-semibold">{customerId}</strong>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-2">
            <div className="p-2.5 bg-white rounded-lg shadow-xs border border-slate-200">
              <img
                src={qrImageUrl}
                alt="QR Pas Digital"
                className="w-44 h-44 object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Scan di gerbang GOR, armada truk sampah, atau loket BUMDes Waru.
            </p>
          </div>

          {/* Balance & Points summary */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-left">
            <div>
              <span className="text-[11px] text-slate-500 block">Saldo Tabungan</span>
              <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                Rp {saldo.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Poin BUMDes</span>
              <span className="text-sm font-bold font-mono text-amber-500 flex items-center justify-end gap-1">
                <Coins className="w-3.5 h-3.5" />
                {poin}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyId}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Salin ID Pelanggan</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadQr}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Gambar QR</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
