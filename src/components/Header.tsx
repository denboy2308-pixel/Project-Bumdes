import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard, Sun, Moon, Palette, Sparkles, Shield, Bot } from 'lucide-react';
import { PageType, User as UserType } from '../types';
import logoImage from '../assets/images/waskita_wijaya_logo_1784569660194.jpg';

interface HeaderProps {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  currentUser: UserType | null;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentLogoSrc?: string;
  onOpenLogoSelector?: () => void;
  onOpenFeaturesModal?: () => void;
  isAdmin?: boolean;
}

export default function Header({ 
  activePage, 
  setActivePage, 
  currentUser, 
  onLogout,
  isDarkMode,
  onToggleDarkMode,
  currentLogoSrc,
  onOpenLogoSelector,
  onOpenFeaturesModal,
  isAdmin = false
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Dynamic Theme Config
  const [themeConfig, setThemeConfig] = useState({
    badge: 'BUMDESA',
    title: 'WASKITA WIJAYA',
    subtitle: 'DESA WARU • KAB. SUKOHARJO',
  });

  // Dynamic Nav Items
  const [navItems, setNavItems] = useState<Array<{ label: string; value: PageType; visible?: boolean }>>([
    { label: 'Beranda', value: 'beranda' as PageType, visible: true },
    { label: 'Cek jadwal & booking', value: 'cek-jadwal-booking' as PageType, visible: true },
    { label: 'Marketplace UMKM', value: 'marketplace-umkm' as PageType, visible: true },
    { label: 'Tentang Kami', value: 'tentang-kami' as PageType, visible: true },
    { label: 'Layanan', value: 'layanan' as PageType, visible: true },
    { label: 'Kegiatan', value: 'kegiatan' as PageType, visible: true },
    { label: 'Pengumuman', value: 'pengumuman' as PageType, visible: true },
    { label: 'Kontak', value: 'kontak' as PageType, visible: true },
  ]);

  // Load custom header configuration from localStorage and subscribe to real-time events
  useEffect(() => {
    const loadSavedConfigs = () => {
      try {
        const savedTheme = localStorage.getItem('app_theme_config');
        if (savedTheme) {
          const parsed = JSON.parse(savedTheme);
          setThemeConfig(prev => ({ ...prev, ...parsed }));
        }

        const savedNav = localStorage.getItem('app_nav_items');
        if (savedNav) {
          const parsed = JSON.parse(savedNav);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mapped = parsed.map((item: any) => {
              if (item.label?.toLowerCase().includes('turnamen') || item.value === 'daftar-turnamen') {
                return { ...item, label: 'Cek jadwal & booking', value: 'cek-jadwal-booking' as PageType };
              }
              if (item.label?.toLowerCase().includes('daftar bank sampah') || item.value === 'register-nasabah') {
                return { ...item, label: 'Daftar Nasabah Sampah', value: 'register-nasabah' as PageType };
              }
              return item;
            });
            if (!mapped.some((item: any) => item.value === 'cek-jadwal-booking')) {
              mapped.splice(1, 0, { label: 'Cek jadwal & booking', value: 'cek-jadwal-booking' as PageType, visible: true });
            }
            setNavItems(mapped);
          }
        }
      } catch (e) {
        console.warn('Failed to load real-time customizer config');
      }
    };

    loadSavedConfigs();

    const handleThemeUpdate = () => loadSavedConfigs();
    const handleNavUpdate = () => loadSavedConfigs();

    window.addEventListener('app-theme-updated', handleThemeUpdate);
    window.addEventListener('app-nav-updated', handleNavUpdate);

    return () => {
      window.removeEventListener('app-theme-updated', handleThemeUpdate);
      window.removeEventListener('app-nav-updated', handleNavUpdate);
    };
  }, []);

  const activeLogo = currentLogoSrc || logoImage;

  const handleNavClick = (page: PageType) => {
    setActivePage(page);
    setIsOpen(false);
  };

  const visibleNavItems = navItems.filter(item => item.visible !== false);

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavClick('beranda')}>
            <div className="flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-xl overflow-hidden bg-white border border-slate-200/80 dark:border-slate-700 shadow-md shrink-0 group-hover:scale-105 transition-transform duration-200">
              <img 
                src={activeLogo} 
                alt="Logo BUMDESA Waskita Wijaya" 
                className="w-full h-full object-contain p-0.5"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left flex flex-col justify-center">
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 tracking-widest uppercase leading-none">
                {themeConfig.badge}
              </span>
              <span className="text-sm md:text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight mt-0.5">
                {themeConfig.title}
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-none mt-0.5 hidden xs:block">
                {themeConfig.subtitle}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {visibleNavItems.map((item) => (
              <button
                key={item.value}
                id={`nav-${item.value}`}
                onClick={() => handleNavClick(item.value)}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
                  activePage === item.value
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-emerald-600 dark:hover:text-emerald-400 nav-item'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Auth Controls (Desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Logo Choice Selector Button (Pengelola/Admin Saja) */}
            {isAdmin && onOpenLogoSelector && (
              <button
                onClick={onOpenLogoSelector}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 transition-all cursor-pointer shadow-xs"
                title="Pilih Desain Logo BUMDESA (Menu Pengelola)"
              >
                <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Pilih Logo</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              id="theme-mode-toggle"
              aria-label={isDarkMode ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isDarkMode ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-3">
                <button
                  id="header-btn-dashboard"
                  onClick={() => handleNavClick('dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activePage === 'dashboard'
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Papan Kas</span>
                </button>
                <button
                  id="header-btn-logout"
                  onClick={onLogout}
                  className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Keluar"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  id="header-btn-kontrol-ai"
                  onClick={() => handleNavClick('kontrol-agent-ai')}
                  className={`hidden sm:flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                    activePage === 'kontrol-agent-ai'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-sm'
                      : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 hover:text-white border-emerald-700/60'
                  }`}
                  title="Studio Generator Perintah Kontrol Sistem Agent AI"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kontrol AI</span>
                </button>

                <button
                  id="header-btn-admin"
                  onClick={() => {
                    window.history.pushState({}, '', '/admin');
                    setActivePage('admin-login' as any);
                  }}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-slate-900 to-slate-950 hover:from-slate-800 hover:to-slate-900 text-slate-200 hover:text-white text-xs font-bold rounded-full border border-emerald-500/40 shadow-sm transition-all cursor-pointer"
                  title="Portal Super Admin & Pengelola BUMDes"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Super Admin</span>
                </button>

                <button
                  id="header-btn-login"
                  onClick={() => handleNavClick('auth')}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-xs font-bold rounded-full shadow-sm transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk Portal</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              id="mobile-menu-toggle"
              aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi utama"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div id="mobile-drawer" className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {visibleNavItems.map((item) => (
              <button
                key={item.value}
                id={`mobile-nav-${item.value}`}
                onClick={() => handleNavClick(item.value)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  activePage === item.value
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold border-l-4 border-emerald-500 pl-3'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="pt-4 pb-2 border-t border-slate-100 dark:border-slate-800 px-4 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Mode Tampilan</span>
                <button
                  onClick={onToggleDarkMode}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
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

              {currentUser ? (
                <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-1 truncate">
                    Login sebagai: <span className="font-semibold text-slate-600 dark:text-slate-300">{currentUser.email}</span>
                  </div>
                  <button
                    id="mobile-btn-dashboard"
                    onClick={() => handleNavClick('dashboard')}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-emerald-600 dark:bg-emerald-500 text-white text-sm font-medium rounded-lg"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Papan Kas</span>
                  </button>
                  <button
                    id="mobile-btn-logout"
                    onClick={onLogout}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm font-medium rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleNavClick('kontrol-agent-ai');
                    }}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-emerald-950 text-emerald-300 text-sm font-bold rounded-lg border border-emerald-800 shadow-sm"
                  >
                    <Bot className="w-4 h-4 text-emerald-400" />
                    <span>Kontrol Agent AI (To-The-Point)</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      window.history.pushState({}, '', '/admin');
                      setActivePage('admin-login' as any);
                    }}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-slate-900 text-slate-200 text-sm font-bold rounded-lg border border-emerald-500/30 shadow-sm"
                  >
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Portal Super Admin</span>
                  </button>
                  <button
                    id="mobile-btn-login"
                    onClick={() => handleNavClick('auth')}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-emerald-600 dark:bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-sm"
                  >
                    <User className="w-4 h-4" />
                    <span>Masuk Portal</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
