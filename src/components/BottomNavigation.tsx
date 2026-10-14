import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Layers, 
  Megaphone, 
  LayoutDashboard, 
  User, 
  MoreHorizontal, 
  Info, 
  Phone, 
  Calendar,
  UserPlus,
  Sparkles,
  ShoppingBag,
  Moon,
  Sun,
  X,
  LogOut,
  Bot
} from 'lucide-react';
import { PageType, User as UserType } from '../types';

interface BottomNavigationProps {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  currentUser: UserType | null;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function BottomNavigation({
  activePage,
  setActivePage,
  currentUser,
  onLogout,
  isDarkMode,
  onToggleDarkMode
}: BottomNavigationProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainNavItems = [
    { label: 'Beranda', value: 'beranda' as PageType, icon: Home },
    { label: 'Layanan', value: 'layanan' as PageType, icon: Layers },
    { 
      label: currentUser ? 'Papan Kas' : 'Portal', 
      value: currentUser ? 'dashboard' as PageType : 'auth' as PageType, 
      icon: currentUser ? LayoutDashboard : User,
      isSpecial: true 
    },
    { label: 'Pengumuman', value: 'pengumuman' as PageType, icon: Megaphone },
  ];

  const moreItems = [
    { label: 'Cek Jadwal & Booking', value: 'cek-jadwal-booking' as PageType, icon: Calendar },
    { label: 'Marketplace UMKM', value: 'marketplace-umkm' as PageType, icon: ShoppingBag },
    { label: 'Pusat Bantuan & Aduan', value: 'pusat-bantuan' as PageType, icon: Phone },
    { label: 'Kebijakan Privasi', value: 'kebijakan-privasi' as PageType, icon: Info },
    { label: 'Syarat & Ketentuan', value: 'syarat-ketentuan' as PageType, icon: Info },
    { label: 'Tentang Kami', value: 'tentang-kami' as PageType, icon: Info },
    { label: 'Kegiatan BUMDES', value: 'kegiatan' as PageType, icon: Calendar },
    { label: 'Hubungi Kami', value: 'kontak' as PageType, icon: Phone },
    { label: 'Kontrol Agent AI', value: 'kontrol-agent-ai' as PageType, icon: Bot },
    { label: 'Daftar Nasabah Sampah', value: 'register-nasabah' as PageType, icon: UserPlus },
  ];

  const handleItemClick = (value: PageType) => {
    setActivePage(value);
    setShowMoreMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMoreActive = moreItems.some(item => item.value === activePage);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div 
        id="mobile-bottom-nav" 
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/90 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/60 dark:border-slate-800/80 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] pb-safe-bottom transition-colors duration-300"
      >
        <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.value;

            if (item.isSpecial) {
              return (
                <button
                  key={item.value}
                  aria-label={item.label}
                  onClick={() => handleItemClick(item.value)}
                  className="relative -top-3 flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/35 scale-110' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 shadow-md border border-slate-200/50 dark:border-slate-700/50'
                  }`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <span className={`text-[9px] font-bold mt-1 transition-colors ${
                    isActive ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.value}
                aria-label={item.label}
                onClick={() => handleItemClick(item.value)}
                className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer relative"
              >
                <div className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[9px] font-bold tracking-tight mt-0.5 ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {item.label}
                </span>
                
                {/* Active Indicator bar */}
                {isActive && (
                  <motion.div 
                    layoutId="bottomNavIndicator"
                    className="absolute bottom-0 w-5 h-0.5 bg-emerald-500 rounded-full" 
                  />
                )}
              </button>
            );
          })}

          {/* More Items Trigger */}
          <button
            aria-label="Menu Layanan Lainnya"
            aria-expanded={showMoreMenu}
            onClick={() => setShowMoreMenu(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer relative"
          >
            <div className={`p-1 rounded-xl transition-colors ${
              isMoreActive || showMoreMenu ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
            }`}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className={`text-[9px] font-bold tracking-tight mt-0.5 ${
              isMoreActive || showMoreMenu ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-500 dark:text-slate-400'
            }`}>
              Lainnya
            </span>
            
            {isMoreActive && (
              <div className="absolute bottom-0 w-5 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Slide-Up Drawer for 'More' Menu */}
      <AnimatePresence>
        {showMoreMenu && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoreMenu(false)}
              className="fixed inset-0 bg-slate-950/60 z-45 md:hidden"
            />

            {/* Bottom Drawer Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] px-6 pt-6 pb-8 text-left transition-colors duration-300"
            >
              {/* Drag Handle Decoration */}
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 mx-auto rounded-full mb-6"></div>

              {/* Title Section */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">Menu Navigasi Lainnya</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Akses fitur & halaman BUMDES lainnya</p>
                </div>
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid List of More Items */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.value;

                  return (
                    <button
                      key={item.value}
                      onClick={() => handleItemClick(item.value)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${
                        isActive ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600' : 'bg-white dark:bg-slate-800 text-slate-500'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Preferences & Session Action Footer */}
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
                {/* Theme Switcher inside Drawer */}
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pilih Mode Tampilan</span>
                  <button
                    onClick={onToggleDarkMode}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span>Mode Terang</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 text-slate-500" />
                        <span>Mode Gelap</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Log Out option if user is logged in */}
                {currentUser && (
                  <button
                    onClick={() => {
                      onLogout();
                      setShowMoreMenu(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/35 text-xs font-bold tracking-wide transition-colors cursor-pointer border border-rose-100/50 dark:border-rose-950/40"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar dari Papan Kas</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
