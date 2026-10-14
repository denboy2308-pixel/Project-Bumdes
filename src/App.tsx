import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import BottomNavigation from './components/BottomNavigation';
import CustomCursor from './components/CustomCursor';
import WhatsAppFAB from './components/WhatsAppFAB';
import ToastNotification from './components/ToastNotification';
import { LOGO_OPTIONS } from './components/logoData';
import { PageType, User } from './types';
import { AdminUser } from './types/admin';
import { 
  getCurrentAdminSession, 
  applyMetaSEOSettingsToDOM 
} from './services/adminSession';

// Lazy-loaded route and heavy section components for bundle optimization
const ServicesSection = lazy(() => import('./components/ServicesSection'));
const LocationMapSection = lazy(() => import('./components/LocationMapSection'));
const SponsorPartnerSection = lazy(() => import('./components/SponsorPartnerSection'));
const ActivitiesSection = lazy(() => import('./components/ActivitiesSection'));
const AnnouncementsSection = lazy(() => import('./components/AnnouncementsSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));
const FeatureRecommendationsSection = lazy(() => import('./components/FeatureRecommendationsSection'));
const ActiveModulesSuite = lazy(() => import('./components/ActiveModulesSuite'));
const VillageMarketplace = lazy(() => import('./components/VillageMarketplace'));
const WasteManagementService = lazy(() => import('./components/waste/WasteManagementService'));
const VillageJobBoard = lazy(() => import('./components/VillageJobBoard'));
const EventEquipmentRental = lazy(() => import('./components/EventEquipmentRental'));
const VolunteerYouthPortal = lazy(() => import('./components/VolunteerYouthPortal'));
const MusdesEVoting = lazy(() => import('./components/MusdesEVoting'));
const PosyanduHealthSchedule = lazy(() => import('./components/PosyanduHealthSchedule'));
const CulinaryTourismPortal = lazy(() => import('./components/CulinaryTourismPortal'));
const EventHallCostSimulator = lazy(() => import('./components/EventHallCostSimulator'));
const FacilityScheduleAndBooking = lazy(() => import('./components/FacilityScheduleAndBooking'));
const PrivacyPolicyView = lazy(() => import('./components/legal/PrivacyPolicyView'));
const TermsOfServiceView = lazy(() => import('./components/legal/TermsOfServiceView'));
const HelpCenterSupportView = lazy(() => import('./components/legal/HelpCenterSupportView'));
const AuthPage = lazy(() => import('./components/AuthPage'));
const RegisterNasabah = lazy(() => import('./components/RegisterNasabah'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const LogoSelectorModal = lazy(() => import('./components/LogoSelectorModal'));
const BroadcastPopupModal = lazy(() => import('./components/BroadcastPopupModal'));
const AdminLoginPage = lazy(() => import('./components/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AiControlDirectiveStudio = lazy(() => import('./components/AiControlDirectiveStudio'));

// Lightweight loading fallbacks
const PageLoadingFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-2.5 text-slate-500 dark:text-slate-400">
      <div className="w-7 h-7 border-2 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
      <span className="text-xs font-semibold">Memuat data halaman...</span>
    </div>
  </div>
);

const AdminLoadingFallback = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-3 text-cyan-400">
      <div className="w-8 h-8 border-3 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      <span className="text-xs font-mono font-bold tracking-wider uppercase">Memuat Panel Pengelola...</span>
    </div>
  </div>
);

export default function App() {
  const [activePage, setActivePage] = useState<PageType>('beranda');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => getCurrentAdminSession());
  const [token, setToken] = useState<string>('');
  const [authLoading, setAuthLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('bumdes_theme') === 'dark';
  });

  // Logo selection state (default option-b: 3D Metallic Ribbon emblem or option-a)
  const [selectedLogoId, setSelectedLogoId] = useState<string>(() => {
    return localStorage.getItem('bumdes_selected_logo') || 'option-b';
  });
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);

  const currentLogoObj = LOGO_OPTIONS.find(l => l.id === selectedLogoId) || LOGO_OPTIONS[0];
  const currentLogoSrc = currentLogoObj.src;

  const handleSelectLogo = (logoId: string) => {
    setSelectedLogoId(logoId);
    localStorage.setItem('bumdes_selected_logo', logoId);
    window.dispatchEvent(new Event('bumdes-logo-updated'));
  };

  useEffect(() => {
    const handleLogoUpdate = () => {
      const saved = localStorage.getItem('bumdes_selected_logo');
      if (saved) setSelectedLogoId(saved);
    };
    window.addEventListener('bumdes-logo-updated', handleLogoUpdate);
    return () => window.removeEventListener('bumdes-logo-updated', handleLogoUpdate);
  }, []);

  // Sync dark mode class on document root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('bumdes_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('bumdes_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: {
          title: 'Fitur BUMDESA Waskita',
          message,
          type,
          duration: 5000,
        },
      })
    );
  };

  // Initialize and check local storage session on mount
  useEffect(() => {
    // Load and apply Meta SEO settings from Firestore in background
    import('./services/adminService')
      .then(({ getMetaSEOSettings }) => {
        getMetaSEOSettings()
          .then((seo) => {
            applyMetaSEOSettingsToDOM(seo);
          })
          .catch((err) => {
            console.warn('Gagal memuat konfigurasi Meta SEO:', err);
          });
      })
      .catch(() => {});

    // Check URL routing for /admin and /admin/dashboard
    const path = window.location.pathname;
    const adminSession = getCurrentAdminSession();
    if (path.startsWith('/admin/dashboard')) {
      if (adminSession) {
        setCurrentAdminUser(adminSession);
        setActivePage('admin-dashboard');
      } else {
        window.history.replaceState({}, '', '/admin');
        setActivePage('admin-login');
      }
    } else if (path === '/admin' || path.startsWith('/admin')) {
      if (adminSession) {
        window.history.replaceState({}, '', '/admin/dashboard');
        setCurrentAdminUser(adminSession);
        setActivePage('admin-dashboard');
      } else {
        setActivePage('admin-login');
      }
    }

    const handlePopState = () => {
      const p = window.location.pathname;
      const s = getCurrentAdminSession();
      if (p.startsWith('/admin/dashboard')) {
        if (s) {
          setActivePage('admin-dashboard');
        } else {
          setActivePage('admin-login');
        }
      } else if (p === '/admin' || p.startsWith('/admin')) {
        if (s) {
          setActivePage('admin-dashboard');
        } else {
          setActivePage('admin-login');
        }
      } else {
        setActivePage('beranda');
      }
    };

    window.addEventListener('popstate', handlePopState);

    const handleAdminSessionUpdated = (e: any) => {
      if (e.detail) {
        setCurrentAdminUser(e.detail);
      }
    };
    window.addEventListener('bumdes-admin-session-updated', handleAdminSessionUpdated);

    const checkSession = async (retryCount = 0) => {
      const storedToken = localStorage.getItem('bumdes_token');
      if (storedToken) {
        // Optimistically restore cached user if available to prevent UI flashing
        const cachedUserJson = localStorage.getItem('bumdes_user_cached');
        if (cachedUserJson) {
          try {
            const parsedCachedUser = JSON.parse(cachedUserJson);
            setCurrentUser(parsedCachedUser);
            setToken(storedToken);
          } catch {
            // Ignore parse errors
          }
        }

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);

          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            },
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            setCurrentUser(data.user);
            setToken(storedToken);
            localStorage.setItem('bumdes_user_cached', JSON.stringify(data.user));
            // If checking on startup, don't force page redirection unless we were on auth
            setActivePage((prev) => (prev === 'auth' ? 'dashboard' : prev));
          } else if (response.status === 401 || response.status === 403) {
            // Token expired/invalid
            localStorage.removeItem('bumdes_token');
            localStorage.removeItem('bumdes_user_cached');
            setCurrentUser(null);
            setToken('');
          }
        } catch (error) {
          // If server is still starting up or offline, retry gracefully after short delay
          if (retryCount < 2) {
            setTimeout(() => {
              checkSession(retryCount + 1);
            }, 2000);
          } else {
            console.warn('Verifikasi sesi login ke backend offline/tertunda, menggunakan status cache lokal');
          }
        }
      }
      setAuthLoading(false);
    };

    checkSession();

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('bumdes-admin-session-updated', handleAdminSessionUpdated);
    };
  }, []);

  const handleAuthSuccess = (user: User, userToken: string) => {
    setCurrentUser(user);
    setToken(userToken);
    localStorage.setItem('bumdes_token', userToken);
    localStorage.setItem('bumdes_user_cached', JSON.stringify(user));
    setActivePage('dashboard');
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        console.warn('Gagal mengirim sinyal logout ke server:', err);
      }
    }
    
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('bumdes_token');
    localStorage.removeItem('bumdes_user_cached');
    setActivePage('beranda');
  };

  // Safe navigation helper that checks auth guard for dashboard
  const handlePageChange = (page: PageType) => {
    if (page === 'admin-login') {
      if (currentAdminUser) {
        window.history.pushState({}, '', '/admin/dashboard');
        setActivePage('admin-dashboard');
      } else {
        window.history.pushState({}, '', '/admin');
        setActivePage('admin-login');
      }
    } else if (page === 'admin-dashboard') {
      if (!currentAdminUser) {
        window.history.pushState({}, '', '/admin');
        setActivePage('admin-login');
      } else {
        window.history.pushState({}, '', '/admin/dashboard');
        setActivePage('admin-dashboard');
      }
    } else {
      if (window.location.pathname.startsWith('/admin')) {
        window.history.pushState({}, '', '/');
      }
      if (page === 'dashboard' && !currentUser) {
        setActivePage('auth');
      } else {
        setActivePage(page);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic Page Title & SEO synchronization for Accessibility & Screen Readers
  useEffect(() => {
    const titles: Record<string, string> = {
      'beranda': 'BUMDES Waskita Wijaya - Desa Waru, Sukoharjo',
      'cek-jadwal-booking': 'Jadwal & Reservasi GOR Waru | BUMDES Waskita Wijaya',
      'marketplace-umkm': 'Marketplace UMKM Desa Waru | BUMDES Waskita Wijaya',
      'tentang-kami': 'Tentang Kami & Profil Organisasi | BUMDES Waskita Wijaya',
      'layanan': 'Unit Usaha & Tarif Layanan | BUMDES Waskita Wijaya',
      'kegiatan': 'Dokumentasi Kegiatan Desa | BUMDES Waskita Wijaya',
      'pengumuman': 'Pengumuman & Transparansi Keuangan | BUMDES Waskita Wijaya',
      'kontak': 'Kontak Resmi & Lokasi Kantor | BUMDES Waskita Wijaya',
      'register-nasabah': 'Pendaftaran Nasabah Bank Sampah | BUMDES Waskita Wijaya',
      'kebijakan-privasi': 'Kebijakan Privasi (UU PDP) | BUMDES Waskita Wijaya',
      'syarat-ketentuan': 'Syarat & Ketentuan Layanan | BUMDES Waskita Wijaya',
      'pusat-bantuan': 'Pusat Bantuan & Pengaduan Warga | BUMDES Waskita Wijaya',
      'dashboard': 'Papan Kas Digital Warga | BUMDES Waskita Wijaya',
      'admin-login': 'Portal Pengelola & Staf | BUMDES Waskita Wijaya',
      'admin-dashboard': 'Dashboard Eksekutif Manajemen | BUMDES Waskita Wijaya',
      'kontrol-agent-ai': 'Studio Kontrol Sistem Agent AI Profesional | BUMDES Waskita Wijaya',
    };
    if (titles[activePage]) {
      document.title = titles[activePage];
    }
  }, [activePage]);

  // Client-side Error Monitoring Telemetry
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      try {
        fetch('/api/system/telemetry-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: event.message,
            context: 'unhandled_window_error',
            url: window.location.href
          })
        }).catch(() => {});
      } catch {}
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  // Dedicated Full-Screen Professional Admin Portal Routes
  if (activePage === 'admin-login') {
    return (
      <div id="bumdes-admin-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Suspense fallback={<AdminLoadingFallback />}>
          <AdminLoginPage
            onLoginSuccess={(user) => {
              setCurrentAdminUser(user);
              window.history.pushState({}, '', '/admin/dashboard');
              setActivePage('admin-dashboard');
              showToast(`Selamat datang, ${user.name}!`, 'success');
            }}
            onBackToPublic={() => {
              window.history.pushState({}, '', '/');
              setActivePage('beranda');
            }}
          />
        </Suspense>
        <ToastNotification />
      </div>
    );
  }

  if (activePage === 'admin-dashboard') {
    if (!currentAdminUser) {
      window.history.replaceState({}, '', '/admin');
      setActivePage('admin-login');
      return null;
    }

    return (
      <div id="bumdes-admin-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Suspense fallback={<AdminLoadingFallback />}>
          <AdminDashboard
            currentUser={currentAdminUser}
            onLogout={async () => {
              const { logoutAdmin } = await import('./services/adminService');
              await logoutAdmin();
              setCurrentAdminUser(null);
              window.history.pushState({}, '', '/admin');
              setActivePage('admin-login');
              showToast('Anda telah keluar dari sistem admin.', 'info');
            }}
            onNavigatePublic={() => {
              window.history.pushState({}, '', '/');
              setActivePage('beranda');
            }}
            onShowToast={(msg, type) => showToast(msg, type)}
            onSwitchUser={(newUser) => {
              setCurrentAdminUser(newUser);
            }}
            onOpenLogoSelector={() => setIsLogoModalOpen(true)}
          />
          {isLogoModalOpen && (
            <LogoSelectorModal
              isOpen={isLogoModalOpen}
              onClose={() => setIsLogoModalOpen(false)}
              selectedLogoId={selectedLogoId}
              onSelectLogo={handleSelectLogo}
            />
          )}
        </Suspense>
        <ToastNotification />
      </div>
    );
  }

  return (
    <div id="bumdes-app-root" className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-300">
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.1 AA) */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-emerald-700 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition-all"
      >
        Lompat ke Konten Utama (Skip to main content)
      </a>

      {/* Navigation Header */}
      <Header
        activePage={activePage}
        setActivePage={handlePageChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        currentLogoSrc={currentLogoSrc}
        isAdmin={Boolean(currentAdminUser || (currentUser && currentUser.role === 'superadmin'))}
        onOpenLogoSelector={() => setIsLogoModalOpen(true)}
        onOpenFeaturesModal={() => setIsFeaturesModalOpen(true)}
      />

      {/* Main View Container */}
      <main id="main-content" tabIndex={-1} className="flex-grow pb-16 md:pb-0 focus:outline-none">
        <Suspense fallback={<PageLoadingFallback />}>
          {activePage === 'beranda' && (
          <div id="view-beranda" className="animate-in fade-in duration-300">
            {/* Top Identity Ribbon */}
            <div className="bg-emerald-950 text-emerald-200 border-b border-emerald-800/40 py-2.5 px-4 text-center">
              <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Badan Usaha Milik Desa · Waru, Baki, Sukoharjo</span>
              </div>
            </div>

            {/* 1. Full-screen Carousel Hero Slider */}
            <HeroSlider onCallToAction={handlePageChange} />

            {/* Brief introductory summary badge */}
            <div className="bg-white dark:bg-slate-900 py-12 border-b border-slate-100 dark:border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 shadow-xs">
                    Badan Usaha Milik Desa · Waru, Baki, Sukoharjo
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                  <div className="space-y-1">
                    <p className="text-3xl font-extrabold text-emerald-600">300+</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nasabah Sampah Desa</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-extrabold text-emerald-600">10+ Ton</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sampah Terkelola</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-extrabold text-emerald-600">Rp 42jt+</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kas BUMDES Transparan</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-extrabold text-emerald-600">3 Line</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lapangan Badminton</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Embedded Brief Sections to give the Beranda a full informative portal feel */}
            <AboutSection currentLogoSrc={currentLogoSrc} />
            <Suspense fallback={
              <div className="py-20 flex items-center justify-center text-slate-400">
                <div className="w-7 h-7 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mr-3" />
                <span className="text-xs font-semibold">Memuat layanan unggulan desa...</span>
              </div>
            }>
              <ServicesSection />
            </Suspense>
            <Suspense fallback={
              <div className="py-16 flex items-center justify-center text-slate-400">
                <div className="w-7 h-7 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mr-3" />
                <span className="text-xs font-semibold">Memuat lokasi & peta...</span>
              </div>
            }>
              <LocationMapSection />
            </Suspense>
            
            {/* 3. Sponsor & Mitra Strategis BUMDES Showcase */}
            <Suspense fallback={
              <div className="py-16 flex items-center justify-center text-slate-400">
                <div className="w-7 h-7 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mr-3" />
                <span className="text-xs font-semibold">Memuat mitra & kerjasama...</span>
              </div>
            }>
              <SponsorPartnerSection onNavigate={handlePageChange} onShowToast={showToast} />
            </Suspense>
            
            {/* CTA block right before footer */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 py-16 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
              <div className="max-w-4xl mx-auto px-4 space-y-6 relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-3.5 py-1.5 rounded-full border border-emerald-400/30">
                  Ayo Bergabung Bersama Kami
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Mulai Setor Sampah & Nikmati Fasilitas Desa Sekarang!
                </h3>
                <p className="text-sm sm:text-base text-emerald-200 max-w-2xl mx-auto leading-relaxed">
                  Daftarkan diri Anda hari ini untuk mendapatkan akun Papan Kas digital BUMDES. Pantau saldo tabungan sampah Anda, kelola arsip nota, dan jadilah pahlawan kebersihan di Desa Waru.
                </p>
                <div className="flex justify-center gap-4 pt-2">
                  <button
                    onClick={() => handlePageChange('register-nasabah')}
                    className="px-6 py-3 bg-white text-emerald-900 hover:bg-emerald-50 font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
                  >
                    Daftar Nasabah Sampah
                  </button>
                  <button
                    onClick={() => handlePageChange('kontak')}
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-xl border border-emerald-500/30 transition-colors cursor-pointer"
                  >
                    Hubungi Pengelola
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === 'cek-jadwal-booking' && (
          <div id="view-cek-jadwal-booking" className="animate-in fade-in duration-300">
            <FacilityScheduleAndBooking onNavigate={handlePageChange} onShowToast={showToast} />
          </div>
        )}

        {activePage === 'modul-fitur' && (
          <div id="view-modul-fitur" className="animate-in fade-in duration-300">
            <ActiveModulesSuite onShowToast={showToast} />
          </div>
        )}

        {activePage === 'marketplace-umkm' && (
          <div id="view-marketplace-umkm" className="animate-in fade-in duration-300">
            <VillageMarketplace />
          </div>
        )}

        {activePage === 'jadwal-sampah' && (
          <div id="view-jadwal-sampah" className="animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <WasteManagementService onShowToast={(t, m, type) => showToast(`${t}: ${m}`, type)} />
          </div>
        )}

        {activePage === 'papan-loker' && (
          <div id="view-papan-loker" className="animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <VillageJobBoard />
          </div>
        )}

        {activePage === 'booking-hajatan' && (
          <div id="view-booking-hajatan" className="animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EventEquipmentRental />
          </div>
        )}

        {activePage === 'portal-relawan' && (
          <div id="view-portal-relawan" className="animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <VolunteerYouthPortal />
          </div>
        )}

        {activePage === 'evoting-musdes' && (
          <div id="view-evoting-musdes" className="animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MusdesEVoting />
          </div>
        )}

        {activePage === 'posyandu-kesehatan' && (
          <div id="view-posyandu-kesehatan" className="animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PosyanduHealthSchedule />
          </div>
        )}

        {activePage === 'wisata-kuliner' && (
          <div id="view-wisata-kuliner" className="animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CulinaryTourismPortal />
          </div>
        )}

        {activePage === 'simulator-sewa-gedung' && (
          <div id="view-simulator-sewa-gedung" className="animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EventHallCostSimulator />
          </div>
        )}

        {activePage === 'tentang-kami' && (
          <div id="view-tentang-kami" className="animate-in fade-in duration-300">
            <AboutSection currentLogoSrc={currentLogoSrc} />
          </div>
        )}

        {activePage === 'layanan' && (
          <div id="view-layanan" className="animate-in fade-in duration-300">
            <ServicesSection />
          </div>
        )}

        {activePage === 'kegiatan' && (
          <div id="view-kegiatan" className="animate-in fade-in duration-300">
            <ActivitiesSection />
          </div>
        )}

        {activePage === 'pengumuman' && (
          <div id="view-pengumuman" className="animate-in fade-in duration-300">
            <AnnouncementsSection />
          </div>
        )}

        {activePage === 'kontak' && (
          <div id="view-kontak" className="animate-in fade-in duration-300">
            <ContactSection />
          </div>
        )}

        {activePage === 'kebijakan-privasi' && (
          <div id="view-kebijakan-privasi" className="animate-in fade-in duration-300">
            <PrivacyPolicyView onNavigate={handlePageChange} />
          </div>
        )}

        {activePage === 'syarat-ketentuan' && (
          <div id="view-syarat-ketentuan" className="animate-in fade-in duration-300">
            <TermsOfServiceView onNavigate={handlePageChange} />
          </div>
        )}

        {activePage === 'pusat-bantuan' && (
          <div id="view-pusat-bantuan" className="animate-in fade-in duration-300">
            <HelpCenterSupportView 
              onNavigate={handlePageChange} 
              onShowToast={showToast} 
            />
          </div>
        )}

        {activePage === 'kontrol-agent-ai' && (
          <div id="view-kontrol-agent-ai" className="animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<PageLoadingFallback />}>
              <AiControlDirectiveStudio onShowToast={showToast} />
            </Suspense>
          </div>
        )}

        {activePage === 'auth' && (
          <div id="view-auth" className="animate-in fade-in duration-300">
            {currentUser ? (
              <div className="py-20 text-center">
                <p className="text-sm text-slate-500">Anda sudah masuk portal.</p>
                <button
                  onClick={() => handlePageChange('dashboard')}
                  className="mt-4 px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg"
                >
                  Ke Papan Kas
                </button>
              </div>
            ) : (
              <AuthPage onAuthSuccess={handleAuthSuccess} />
            )}
          </div>
        )}

        {activePage === 'register-nasabah' && (
          <div id="view-register-nasabah" className="animate-in fade-in duration-300">
            <RegisterNasabah
              onBackToHome={() => handlePageChange('beranda')}
              onAuthSuccess={handleAuthSuccess}
            />
          </div>
        )}

        {activePage === 'dashboard' && (
          <div id="view-dashboard" className="animate-in fade-in duration-300">
            {currentUser ? (
              <Dashboard
                currentUser={currentUser}
                onLogout={handleLogout}
                token={token}
              />
            ) : (
              <div className="py-24 text-center space-y-4">
                <p className="text-slate-500 text-sm">Sesi Anda telah kedaluwarsa atau belum masuk portal.</p>
                <button
                  onClick={() => handlePageChange('auth')}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-sm"
                >
                  Masuk Sekarang
                </button>
              </div>
            )}
          </div>
        )}
        </Suspense>
      </main>

      {/* Footer component */}
      <Footer setActivePage={handlePageChange} currentLogoSrc={currentLogoSrc} />

      {/* Mobile-first Bottom Navigation Bar */}
      <BottomNavigation
        activePage={activePage}
        setActivePage={handlePageChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Modern 3D Claymation Style Custom Hand Cursor */}
      <CustomCursor />

      {/* Floating Action Button for WhatsApp Admin Chat */}
      <WhatsAppFAB />

      {/* Global Toast Notification System */}
      <ToastNotification />

      {/* Interactive Logo Selector Modal */}
      {isLogoModalOpen && (
        <Suspense fallback={null}>
          <LogoSelectorModal
            isOpen={isLogoModalOpen}
            onClose={() => setIsLogoModalOpen(false)}
            selectedLogoId={selectedLogoId}
            onSelectLogo={handleSelectLogo}
          />
        </Suspense>
      )}

      {/* Interactive 20 Feature Recommendations Modal */}
      {isFeaturesModalOpen && (
        <Suspense fallback={null}>
          <FeatureRecommendationsSection
            onShowToast={showToast}
            isOpenModal={true}
            onCloseModal={() => setIsFeaturesModalOpen(false)}
          />
        </Suspense>
      )}

      {/* Pop-up Notifikasi Siaran Masal Warga & Pelanggan */}
      <Suspense fallback={null}>
        <BroadcastPopupModal />
      </Suspense>

    </div>
  );
}
