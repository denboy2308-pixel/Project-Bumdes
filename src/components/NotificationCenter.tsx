import React, { useState, useEffect } from 'react';
import { 
  Bell, Check, Trash2, Megaphone, Coins, Info, 
  X, CheckCheck, Sparkles, Volume2, VolumeX, Radio, ArrowRight
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onDeleteNotification: (id: string) => void;
  onSimulateNotification: (type: 'saldo' | 'pengumuman') => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onDeleteNotification,
  onSimulateNotification
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'semua' | 'saldo' | 'pengumuman'>('semua');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'saldo') return n.type === 'saldo';
    if (activeTab === 'pengumuman') return n.type === 'pengumuman';
    return true;
  });

  return (
    <div className="relative inline-block text-left">
      {/* Bell Button with Unread Badge & Pulse */}
      <button
        id="btn-notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-emerald-300 transition-all shadow-sm flex items-center justify-center cursor-pointer"
        title="Pusat Notifikasi Real-time"
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-emerald-600 animate-bounce' : 'text-slate-600'}`} />
        
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-600 text-white text-[10px] font-extrabold items-center justify-center border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </span>
          </>
        )}
      </button>

      {/* Dropdown Notification Drawer Panel */}
      {isOpen && (
        <>
          {/* Backdrop overlay for mobile touch dismissal */}
          <div 
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs md:bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-4 sm:p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm leading-tight">Notifikasi Real-time</h4>
                  <p className="text-[10px] text-emerald-200">Update Saldo & Pengumuman BUMDES</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer text-[10px]"
                  title={soundEnabled ? "Audio Notifikasi Aktif" : "Audio Notifikasi Dibisukan"}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-300" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulation Actions bar */}
            <div className="bg-emerald-50/80 p-3 border-b border-emerald-100 flex items-center justify-between gap-2 text-xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Simulasi Real-time:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSimulateNotification('saldo')}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <Coins className="w-3 h-3" />
                  <span>+ Saldo</span>
                </button>
                <button
                  onClick={() => onSimulateNotification('pengumuman')}
                  className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <Megaphone className="w-3 h-3" />
                  <span>+ Pengumuman</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs & Quick Action */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab('semua')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'semua'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-500 hover:bg-slate-200/60'
                  }`}
                >
                  Semua ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab('saldo')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'saldo'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-500 hover:bg-slate-200/60'
                  }`}
                >
                  Saldo
                </button>
                <button
                  onClick={() => setActiveTab('pengumuman')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'pengumuman'
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-500 hover:bg-slate-200/60'
                  }`}
                >
                  Pengumuman
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Baca Semua</span>
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {filteredNotifications.length === 0 ? (
                <div className="py-10 text-center space-y-2 px-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-600">Tidak Ada Notifikasi</p>
                  <p className="text-[11px] text-slate-400">Belum ada pembaruan saldo atau pengumuman dalam kategori ini.</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const isSaldo = notif.type === 'saldo';
                  const isPengumuman = notif.type === 'pengumuman';

                  return (
                    <div
                      key={notif.id}
                      className={`p-4 transition-colors flex items-start space-x-3 text-left relative group ${
                        !notif.read ? 'bg-emerald-50/40 font-medium' : 'hover:bg-slate-50/80 bg-white'
                      }`}
                    >
                      {/* Left Icon Badge */}
                      <div className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center border ${
                        isSaldo
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : isPengumuman
                          ? 'bg-teal-100 text-teal-700 border-teal-200'
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {isSaldo && <Coins className="w-4 h-4" />}
                        {isPengumuman && <Megaphone className="w-4 h-4" />}
                        {!isSaldo && !isPengumuman && <Info className="w-4 h-4" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-6 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className={`text-xs font-bold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                            {notif.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {notif.timestamp}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed break-words">
                          {notif.message}
                        </p>

                        {/* Amount or Author Tag */}
                        {notif.amount !== undefined && (
                          <div className="pt-0.5">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                              notif.amount > 0 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {notif.amount > 0 ? '+' : ''} Rp {notif.amount.toLocaleString('id-ID')}
                            </span>
                          </div>
                        )}

                        {notif.author && (
                          <p className="text-[10px] text-slate-400 font-semibold italic">
                            Oleh: {notif.author}
                          </p>
                        )}
                      </div>

                      {/* Right Action buttons */}
                      <div className="absolute right-3 top-3 flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {!notif.read && (
                          <button
                            onClick={() => onMarkAsRead(notif.id)}
                            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="Tandai telah dibaca"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteNotification(notif.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus notifikasi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-semibold">
                  {unreadCount} belum dibaca
                </span>
                <button
                  onClick={onClearAll}
                  className="text-slate-500 hover:text-rose-600 font-bold transition-colors cursor-pointer"
                >
                  Bersihkan Semua
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
