import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Building2, 
  Users, 
  Globe, 
  LogOut, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Activity, 
  FileText, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sliders, 
  Share2, 
  Download, 
  Sparkles, 
  Check, 
  X, 
  AlertCircle,
  Menu,
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
  QrCode,
  Lightbulb,
  Radio,
  FileCheck,
  RefreshCw,
  Palette,
  Database,
  Printer,
  ChevronDown,
  Layers,
  Search,
  ExternalLink,
  Shield,
  Server,
  MessageSquare,
  Mail,
  Compass,
  Package,
  Receipt,
  LayoutGrid,
  Ticket,
  Wallet,
  Palmtree,
  Hexagon,
  Plus,
  Brain
} from 'lucide-react';
import { AdminUser, AdminRole } from '../../types/admin';
import { 
  logoutAdmin, 
  getAuditLogs 
} from '../../services/adminService';
const MetaSEOManager = lazy(() => import('./MetaSEOManager'));
const UserManagementModule = lazy(() => import('./UserManagementModule'));
const LiveSiteCustomizer = lazy(() => import('./LiveSiteCustomizer'));
const CmsModule = lazy(() => import('./CmsModule'));
const DatabaseBackupModule = lazy(() => import('./DatabaseBackupModule'));
const LiveChatModule = lazy(() => import('./LiveChatModule'));
const StaffDmModule = lazy(() => import('./StaffDmModule'));
const BroadcastModule = lazy(() => import('./BroadcastModule'));
const EmailCenterModule = lazy(() => import('./EmailCenterModule'));
const BillingModule = lazy(() => import('./BillingModule'));
const GeographicMapModule = lazy(() => import('./GeographicMapModule'));
const InventoryModule = lazy(() => import('./InventoryModule'));
const BusinessFinanceModule = lazy(() => import('./BusinessFinanceModule'));
const SystemMonitoringModule = lazy(() => import('./SystemMonitoringModule'));
const AiBrainModule = lazy(() => import('./AiBrainModule'));

interface AdminDashboardProps {
  currentUser: AdminUser;
  onLogout: () => void;
  onNavigatePublic: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  onSwitchUser: (newUser: AdminUser) => void;
  onOpenLogoSelector?: () => void;
}

const ROLE_BADGES: Record<AdminRole, { title: string; color: string; bg: string }> = {
  superadmin: { title: 'Super Administrator', color: 'text-purple-300', bg: 'bg-purple-950/80 border-purple-800' },
  direktur: { title: 'Direktur Utama BUMDes', color: 'text-blue-300', bg: 'bg-blue-950/80 border-blue-800' },
  bendahara: { title: 'Bendahara Keuangan', color: 'text-emerald-300', bg: 'bg-emerald-950/80 border-emerald-800' },
  karyawan: { title: 'Staf Pelayanan / Kasir', color: 'text-cyan-300', bg: 'bg-cyan-950/80 border-cyan-800' },
  operator: { title: 'Operator Lapangan', color: 'text-amber-300', bg: 'bg-amber-950/80 border-amber-800' },
  manajer_fasilitas: { title: 'Pengelola Fasilitas & Aula', color: 'text-indigo-300', bg: 'bg-indigo-950/80 border-indigo-800' },
  editor: { title: 'Editor & Humas Desa', color: 'text-pink-300', bg: 'bg-pink-950/80 border-pink-800' },
  auditor: { title: 'Auditor / Pengawas BPD', color: 'text-rose-300', bg: 'bg-rose-950/80 border-rose-800' },
  pic_wilayah: { title: 'PIC Wilayah (Dusun/RW)', color: 'text-teal-300', bg: 'bg-teal-950/80 border-teal-800' },
  pelanggan: { title: 'Portal Warga / Pelanggan', color: 'text-slate-300', bg: 'bg-slate-900 border-slate-700' }
};

export default function AdminDashboard({
  currentUser,
  onLogout,
  onNavigatePublic,
  onShowToast,
  onSwitchUser,
  onOpenLogoSelector
}: AdminDashboardProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Interactive mock state for field operator
  const [lightsActive, setLightsActive] = useState<Record<string, boolean>>({
    'lapangan-1': true,
    'lapangan-2': false,
    'lapangan-3': true
  });

  // Mock reservations list
  const [reservations, setReservations] = useState([
    { id: 'RES-001', court: 'Lapangan 1 (Kayu Pro)', time: '19:00 - 21:00', team: 'PB Jaya Mandiri (Dusun I)', status: 'Lunas', checkedIn: true },
    { id: 'RES-002', court: 'Lapangan 2 (Karpet Vinyl)', time: '20:00 - 22:00', team: 'Smash Club Baki', status: 'Lunas', checkedIn: false },
    { id: 'RES-003', court: 'Lapangan 3 (Standar)', time: '21:00 - 23:00', team: 'Karang Taruna RW 02', status: 'Menunggu Bayar', checkedIn: false }
  ]);

  // Mock hall bookings for facility manager & director
  const [hallBookings, setHallBookings] = useState([
    { id: 'HAL-101', event: 'Resepsi Pernikahan Warga', date: '12 Oktober 2026', pemesan: 'Bpk. Subagyo (Dusun I)', status: 'Disetujui', fee: 'Rp 4.500.000' },
    { id: 'HAL-102', event: 'Rapat Pleno BPD Desa', date: '20 Oktober 2026', pemesan: 'Sekretariat Desa', status: 'Pengajuan', fee: 'Rp 1.500.000' }
  ]);

  // Real-time report category filter
  const [reportCategory, setReportCategory] = useState<string>('keuangan');

  // Sidebar Group Collapse State (5 Rekomendasi Grup Super Admin)
  const [openGroupIkhtisar, setOpenGroupIkhtisar] = useState(true);
  const [openGroupPengguna, setOpenGroupPengguna] = useState(true);
  const [openGroupWeb, setOpenGroupWeb] = useState(true);
  const [openGroupAiBrain, setOpenGroupAiBrain] = useState(true);
  const [openGroupSistem, setOpenGroupSistem] = useState(true);

  // Live Attendance (Absensi) State
  const [attendanceList, setAttendanceList] = useState([
    { id: 'ATT-01', name: 'Super Admin (den.boy2308)', role: 'Super Administrator', time: '07:42:15 WIB', status: 'Hadir Tepat Waktu', location: 'Kantor BUMDes Waru', verified: true, avatar: 'SA' },
    { id: 'ATT-02', name: 'Ir. H. Waskita Utama', role: 'Direktur Utama', time: '07:48:30 WIB', status: 'Hadir Tepat Waktu', location: 'Ruang Direksi', verified: true, avatar: 'WU' },
    { id: 'ATT-03', name: 'Siti Rahayu, S.E.', role: 'Bendahara', time: '07:55:10 WIB', status: 'Hadir Tepat Waktu', location: 'Loket Kasir BUMDes', verified: true, avatar: 'SR' },
    { id: 'ATT-04', name: 'Budi Santoso', role: 'Operator Lapangan', time: '07:30:00 WIB', status: 'Hadir Tepat Waktu', location: 'GOR Badminton Waru', verified: true, avatar: 'BS' },
    { id: 'ATT-05', name: 'Joko Prasetyo', role: 'Kasir Pelayanan', time: '08:02:18 WIB', status: 'Hadir', location: 'Loket Sampah & Billing', verified: true, avatar: 'JP' },
    { id: 'ATT-06', name: 'Maya Anggraini', role: 'Editor Humas', time: '08:05:44 WIB', status: 'Hadir', location: 'Studio Kreatif Desa', verified: true, avatar: 'MA' },
    { id: 'ATT-07', name: 'Agus Setiawan', role: 'Manajer Fasilitas', time: '08:00:00 WIB', status: 'Izin Dinas Luar', location: 'Kantor Kecamatan Baki', verified: true, avatar: 'AS' },
  ]);

  // Leave & Vacation (Cuti) State
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LV-01', name: 'Agus Setiawan', role: 'Manajer Fasilitas', type: 'Cuti Tahunan', date: '12 - 14 Okt 2026 (3 Hari)', reason: 'Urusan Keluarga di Luar Kota', status: 'Menunggu Persetujuan' },
    { id: 'LV-02', name: 'Maya Anggraini', role: 'Editor Humas', type: 'Cuti Pelatihan', date: '25 Okt 2026 (1 Hari)', reason: 'Workshop Jurnalistik Desa', status: 'Disetujui' },
    { id: 'LV-03', name: 'Budi Santoso', role: 'Operator Lapangan', type: 'Izin Sakit', date: '04 Sep 2026 (1 Hari)', reason: 'Pemeriksaan Kesehatan', status: 'Selesai' }
  ]);

  const [currentTimeStr, setCurrentTimeStr] = useState('08:25:00 WIB');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const logs = await getAuditLogs();
    setAuditLogs(logs);
  };

  const toggleLight = (lapanganId: string) => {
    setLightsActive(prev => ({ ...prev, [lapanganId]: !prev[lapanganId] }));
    onShowToast(`Status lampu ${lapanganId} diperbarui`, 'info');
  };

  const toggleCheckIn = (resId: string) => {
    setReservations(prev => prev.map(r => r.id === resId ? { ...r, checkedIn: !r.checkedIn } : r));
    onShowToast(`Status kehadiran tiket #${resId} diperbarui`, 'success');
  };

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);
    // Auto-close sidebar on mobile
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen(false);
    }
  };

  const roleMeta = ROLE_BADGES[currentUser.role] || { title: currentUser.role, color: 'text-white', bg: 'bg-slate-800' };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. TOP FIXED APP BAR */}
      <header className="h-16 shrink-0 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 z-40 backdrop-blur-md select-none">
        
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            title="Menu Samping"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-white tracking-wide">BUMDES WASKITA WIJAYA</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline">
                  PORTAL PENGELOLA
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">
                Desa Waru · Baki · Sukoharjo
              </span>
            </div>
          </div>
        </div>

        {/* Center: Current Role Badge */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-xl border text-xs font-black flex items-center gap-1.5 ${roleMeta.bg} ${roleMeta.color}`}>
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">{roleMeta.title}</span>
            <span className="sm:hidden">{currentUser.role}</span>
          </div>
        </div>

        {/* Right Actions: Logo Selector, Public Web & Logout */}
        <div className="flex items-center space-x-2">
          {onOpenLogoSelector && (
            <button
              type="button"
              onClick={onOpenLogoSelector}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-800/80 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Pilih Desain Logo Resmi BUMDESA"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Pilih Logo</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNavigatePublic}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            title="Buka Website Publik"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Website Publik</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-white border border-red-800/80 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            title="Keluar dari Panel Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>

      </header>

      {/* 2. MAIN WORKSPACE WITH ERGONOMIC FIXED SIDEBAR */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Mobile Backdrop Overlay */}
        {mobileSidebarOpen && (
          <div 
            onClick={() => setMobileSidebarOpen(false)} 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-30 lg:hidden"
          />
        )}

        {/* ERGONOMIC LEFT SIDEBAR (STICKY/FIXED IN PLACE) */}
        <aside className={`
          fixed lg:static inset-y-16 lg:inset-auto left-0 z-30 w-72 lg:w-72 shrink-0 h-full bg-[#060c18] border-r border-slate-800/80 flex flex-col justify-between select-none transition-transform duration-200 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}>
          
          {/* Scrollable Navigation Groups inside Sidebar */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 custom-scrollbar">
            
            {/* User Mini Profile Card with Super Admin Badge */}
            <div className="p-3 bg-[#0a1424] rounded-2xl border border-slate-800/90 flex items-center space-x-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-black text-xs shrink-0 shadow-inner">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate flex-1">
                <div className="flex items-center gap-1.5">
                  <h5 className="text-xs font-black text-white truncate leading-tight">{currentUser.name}</h5>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-cyan-400 font-mono font-bold truncate">
                    {currentUser.role === 'superadmin' ? 'Super Admin Utama' : roleMeta.title}
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* GRUP 1: IKHTISAR (4 MENU)                                    */}
            {/* ============================================================ */}
            <div className="space-y-1">
              <div 
                onClick={() => setOpenGroupIkhtisar(!openGroupIkhtisar)}
                className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer select-none group hover:bg-slate-900/40 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-xs">
                    <Hexagon className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                  </div>
                  <span className="text-xs font-black tracking-widest text-[#00f2fe] uppercase">
                    1. IKHTISAR
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#102a43] text-cyan-400 text-[11px] font-mono font-bold">
                    4
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openGroupIkhtisar ? 'rotate-0' : '-rotate-90'}`} />
              </div>

              {openGroupIkhtisar && (
                <div className="border-l border-cyan-800/60 pl-3 ml-2.5 my-1 space-y-1">
                  {/* Dashboard Overview */}
                  <button
                    type="button"
                    onClick={() => handleTabClick('overview')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'overview'
                        ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <LayoutGrid className={`w-5 h-5 shrink-0 ${activeTab === 'overview' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={activeTab === 'overview' ? 'text-cyan-200' : 'text-slate-300 group-hover:text-white'}>
                        Dashboard
                      </span>
                    </div>
                  </button>

                  {/* Peta GIS */}
                  <button
                    type="button"
                    onClick={() => handleTabClick('peta-geografis')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'peta-geografis'
                        ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className={`w-5 h-5 shrink-0 ${activeTab === 'peta-geografis' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={activeTab === 'peta-geografis' ? 'text-cyan-200' : 'text-slate-300 group-hover:text-white'}>
                        Peta Wilayah GIS
                      </span>
                    </div>
                  </button>

                  {/* Tiket Reservasi */}
                  <button
                    type="button"
                    onClick={() => handleTabClick('tiket')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'tiket'
                        ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Ticket className={`w-5 h-5 shrink-0 ${activeTab === 'tiket' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={activeTab === 'tiket' ? 'text-cyan-200' : 'text-slate-300 group-hover:text-white'}>
                        Tiket Reservasi
                      </span>
                    </div>
                    <span className="w-5 h-5 rounded-full bg-[#3d1228] text-rose-300 border border-rose-900/50 flex items-center justify-center text-[11px] font-bold shadow-xs">
                      3
                    </span>
                  </button>

                  {/* Dompet Keuangan */}
                  <button
                    type="button"
                    onClick={() => handleTabClick('dompet')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'dompet'
                        ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Wallet className={`w-5 h-5 shrink-0 ${activeTab === 'dompet' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={activeTab === 'dompet' ? 'text-cyan-200' : 'text-slate-300 group-hover:text-white'}>
                        Dompet Keuangan
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* GRUP 2: MANAJEMEN PENGGUNA (4 MENU)                          */}
            {/* ============================================================ */}
            <div className="space-y-1">
              <div 
                onClick={() => setOpenGroupPengguna(!openGroupPengguna)}
                className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer select-none group hover:bg-slate-900/40 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-xs">
                    <Hexagon className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                  </div>
                  <span className="text-xs font-black tracking-widest text-[#d8b4fe] uppercase">
                    2. MANAJEMEN PENGGUNA
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#25103a] text-purple-300 text-[11px] font-mono font-bold">
                    4
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openGroupPengguna ? 'rotate-0' : '-rotate-90'}`} />
              </div>

              {openGroupPengguna && (
                <div className="border-l border-purple-800/60 pl-3 ml-2.5 my-1 space-y-1">
                  {/* Database Pengguna Lengkap */}
                  <button
                    type="button"
                    onClick={() => handleTabClick('users')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'users'
                        ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Users className={`w-5 h-5 shrink-0 ${activeTab === 'users' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={activeTab === 'users' ? 'text-cyan-200' : 'text-slate-300 group-hover:text-white'}>
                        Database Pengguna
                      </span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-black font-mono">
                      FULL
                    </span>
                  </button>

                  {/* Absensi */}
                  <button
                    type="button"
                    onClick={() => handleTabClick('absensi')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'absensi'
                        ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className={`w-5 h-5 shrink-0 ${activeTab === 'absensi' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={activeTab === 'absensi' ? 'text-cyan-200' : 'text-slate-300 group-hover:text-white'}>
                        Presensi & Absensi
                      </span>
                    </div>
                  </button>

                  {/* Cuti */}
                  <button
                    type="button"
                    onClick={() => handleTabClick('cuti')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'cuti'
                        ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Palmtree className={`w-5 h-5 shrink-0 ${activeTab === 'cuti' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={activeTab === 'cuti' ? 'text-cyan-200' : 'text-slate-300 group-hover:text-white'}>
                        Cuti & Perizinan
                      </span>
                    </div>
                  </button>

                  {/* DM Karyawan */}
                  <button
                    type="button"
                    onClick={() => handleTabClick('staff-dm')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'staff-dm'
                        ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Users className={`w-5 h-5 shrink-0 ${activeTab === 'staff-dm' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={activeTab === 'staff-dm' ? 'text-cyan-200' : 'text-slate-300 group-hover:text-white'}>
                        DM Tim & Karyawan
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* GRUP 3: PENGELOLAAN WEB & KONTEN (5 MENU)                   */}
            {/* ============================================================ */}
            <div className="space-y-1">
              <div 
                onClick={() => setOpenGroupWeb(!openGroupWeb)}
                className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer select-none group hover:bg-slate-900/40 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-xs">
                    <Hexagon className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  </div>
                  <span className="text-xs font-black tracking-widest text-[#34d399] uppercase">
                    3. KELOLA WEB
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#0a2e1f] text-emerald-300 text-[11px] font-mono font-bold">
                    5
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openGroupWeb ? 'rotate-0' : '-rotate-90'}`} />
              </div>

              {openGroupWeb && (
                <div className="border-l border-emerald-800/60 pl-3 ml-2.5 my-1 space-y-1">
                  {/* Editor Menu & Tampilan */}
                  <button
                    type="button"
                    onClick={() => handleTabClick('customizer')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'customizer'
                        ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Palette className={`w-5 h-5 shrink-0 ${activeTab === 'customizer' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span>Editor Menu & Tampilan</span>
                    </div>
                  </button>

                  {/* CMS Berita Desa */}
                  <button
                    type="button"
                    onClick={() => handleTabClick('cms')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'cms'
                        ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className={`w-5 h-5 shrink-0 ${activeTab === 'cms' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span>CMS Berita Desa</span>
                    </div>
                  </button>

                  {/* Meta SEO Google */}
                  <button
                    type="button"
                    onClick={() => handleTabClick('meta-seo')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'meta-seo'
                        ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className={`w-5 h-5 shrink-0 ${activeTab === 'meta-seo' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span>Meta SEO Google</span>
                    </div>
                  </button>

                  {/* Broadcast Notifikasi */}
                  <button
                    type="button"
                    onClick={() => handleTabClick('broadcast')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'broadcast'
                        ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Radio className={`w-5 h-5 shrink-0 ${activeTab === 'broadcast' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span>Broadcast Publik</span>
                    </div>
                  </button>

                  {/* Live Chat Support */}
                  <button
                    type="button"
                    onClick={() => handleTabClick('live-chat')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'live-chat'
                        ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className={`w-5 h-5 shrink-0 ${activeTab === 'live-chat' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span>Live Chat Support</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* GRUP 4: AI BRAIN OTONOM (1 POWER MENU)                       */}
            {/* ============================================================ */}
            <div className="space-y-1">
              <div 
                onClick={() => setOpenGroupAiBrain(!openGroupAiBrain)}
                className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer select-none group hover:bg-slate-900/40 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-md bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shadow-xs">
                    <Hexagon className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                  </div>
                  <span className="text-xs font-black tracking-widest text-[#38bdf8] uppercase">
                    4. AI BRAIN
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#082f49] text-cyan-300 text-[11px] font-mono font-bold animate-pulse">
                    AI
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openGroupAiBrain ? 'rotate-0' : '-rotate-90'}`} />
              </div>

              {openGroupAiBrain && (
                <div className="border-l border-cyan-500/60 pl-3 ml-2.5 my-1 space-y-1">
                  <button
                    type="button"
                    onClick={() => handleTabClick('ai-brain')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                      activeTab === 'ai-brain'
                        ? 'bg-gradient-to-r from-[#09253d] to-[#1e133d] border border-cyan-400 text-cyan-200 shadow-[0_0_18px_rgba(6,182,212,0.35)] font-extrabold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Brain className={`w-5 h-5 shrink-0 ${activeTab === 'ai-brain' ? 'text-cyan-400 animate-pulse' : 'text-slate-400 group-hover:text-cyan-300'}`} />
                      <span className={activeTab === 'ai-brain' ? 'text-cyan-200' : 'text-slate-300 group-hover:text-white'}>
                        AI Brain & Self-Healing
                      </span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-black uppercase">
                      Sentinel
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* GRUP 5: SISTEM & INFRASTRUKTUR (5 MENU)                     */}
            {/* ============================================================ */}
            {currentUser.role === 'superadmin' && (
              <div className="space-y-1">
                <div 
                  onClick={() => setOpenGroupSistem(!openGroupSistem)}
                  className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer select-none group hover:bg-slate-900/40 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-xs">
                      <Hexagon className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <span className="text-xs font-black tracking-widest text-[#fbbf24] uppercase">
                      5. SISTEM
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#2d1b04] text-amber-300 text-[11px] font-mono font-bold">
                      5
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openGroupSistem ? 'rotate-0' : '-rotate-90'}`} />
                </div>

                {openGroupSistem && (
                  <div className="border-l border-amber-800/60 pl-3 ml-2.5 my-1 space-y-1">
                    {/* Database & Backup */}
                    <button
                      type="button"
                      onClick={() => handleTabClick('database')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                        activeTab === 'database'
                          ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Database className={`w-5 h-5 shrink-0 ${activeTab === 'database' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span>Database & Cadangan</span>
                      </div>
                    </button>

                    {/* Monitoring */}
                    <button
                      type="button"
                      onClick={() => handleTabClick('monitoring')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                        activeTab === 'monitoring'
                          ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Activity className={`w-5 h-5 shrink-0 ${activeTab === 'monitoring' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span>Pemantauan & Server</span>
                      </div>
                    </button>

                    {/* Audit Logs */}
                    <button
                      type="button"
                      onClick={() => handleTabClick('audit-logs')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                        activeTab === 'audit-logs'
                          ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <ShieldCheck className={`w-5 h-5 shrink-0 ${activeTab === 'audit-logs' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span>Log Rekam Jejak Audit</span>
                      </div>
                    </button>

                    {/* Tagihan Sampah */}
                    <button
                      type="button"
                      onClick={() => handleTabClick('tagihan-sampah')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                        activeTab === 'tagihan-sampah'
                          ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Receipt className={`w-5 h-5 shrink-0 ${activeTab === 'tagihan-sampah' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span>Tagihan Retribusi Sampah</span>
                      </div>
                    </button>

                    {/* Inventaris & Barcode */}
                    <button
                      type="button"
                      onClick={() => handleTabClick('inventaris')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                        activeTab === 'inventaris'
                          ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Package className={`w-5 h-5 shrink-0 ${activeTab === 'inventaris' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span>Inventaris & Barcode</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Special Roles View if non-superadmin */}
            {currentUser.role === 'pic_wilayah' && (
              <button
                type="button"
                onClick={() => handleTabClick('wilayah')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer ${
                  activeTab === 'wilayah'
                    ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-teal-400" />
                  <span>Wilayah ({currentUser.assignedZone || 'Dusun'})</span>
                </div>
              </button>
            )}

            {currentUser.role === 'pelanggan' && (
              <button
                type="button"
                onClick={() => handleTabClick('tiket-saya')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer ${
                  activeTab === 'tiket-saya'
                    ? 'bg-[#09253d] border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <QrCode className="w-5 h-5 text-cyan-400" />
                  <span>E-Tiket Saya</span>
                </div>
              </button>
            )}

          </div>

          {/* Bottom Sidebar Status */}
          <div className="p-3.5 border-t border-slate-800/80 bg-[#050a14] shrink-0">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-semibold text-cyan-300">Firestore Sinkron</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">v2.6 Enterprise</span>
            </div>
          </div>

        </aside>

        {/* 3. RIGHT MAIN VIEWPORT (ONLY THIS PART SCROLLS) */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/95 custom-scrollbar">
          
          <div className="max-w-6xl mx-auto space-y-6 pb-12">

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Greeting Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      Pusat Kendali Portal BUMDes Waru
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                      Selamat Datang, {currentUser.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-xl">
                      Anda masuk dengan wewenang <strong>{roleMeta.title}</strong>. Menu di bilah kiri telah disesuaikan secara ergonomis untuk mempermudah tata kelola operasional desa.
                    </p>
                  </div>

                  <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-center shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Database Status</span>
                    <span className="text-xs text-emerald-400 font-extrabold flex items-center gap-1.5 justify-center mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Cloud Firestore Online</span>
                    </span>
                  </div>
                </div>

                {/* Quick KPI Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Jadwal Hari Ini</span>
                    <p className="text-2xl font-black text-emerald-400">12 Slot</p>
                    <span className="text-[10px] text-slate-500 font-medium">3 Line Lapangan Badminton</span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Okupansi Pekan Ini</span>
                    <p className="text-2xl font-black text-blue-400">88%</p>
                    <span className="text-[10px] text-slate-500 font-medium">Dominan Slot Malam</span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Kas Bulan Ini</span>
                    <p className="text-2xl font-black text-purple-400">Rp 42.8M</p>
                    <span className="text-[10px] text-slate-500 font-medium">Bersih PADes</span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Sewa Aula Gedung</span>
                    <p className="text-2xl font-black text-amber-400">4 Acara</p>
                    <span className="text-[10px] text-slate-500 font-medium">Bulan Oktober 2026</span>
                  </div>
                </div>

                {/* Super Admin Quick Actions */}
                {currentUser.role === 'superadmin' && (
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>Akses Pintas Kendali Super Admin</span>
                      </h4>
                      <span className="text-[11px] text-slate-500">1-Klik Eksekusi</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleTabClick('users')}
                        className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-left transition-colors cursor-pointer group"
                      >
                        <Users className="w-4 h-4 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block">Kelola Pengguna</span>
                        <span className="text-[10px] text-slate-400 block">10 Peran Pengguna</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTabClick('customizer')}
                        className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-left transition-colors cursor-pointer group"
                      >
                        <Palette className="w-4 h-4 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block">Editor Tampilan</span>
                        <span className="text-[10px] text-slate-400 block">Menu, Warna, Banner</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTabClick('meta-seo')}
                        className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-left transition-colors cursor-pointer group"
                      >
                        <Globe className="w-4 h-4 text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block">Meta SEO Google</span>
                        <span className="text-[10px] text-slate-400 block">SERP & WhatsApp Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTabClick('database')}
                        className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-left transition-colors cursor-pointer group"
                      >
                        <Database className="w-4 h-4 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block">Backup Database</span>
                        <span className="text-[10px] text-slate-400 block">JSON / CSV Firestore</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Operator Lapangan Panel */}
                {(currentUser.role === 'operator' || currentUser.role === 'superadmin') && (
                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
                        <h4 className="text-sm font-black text-white">
                          Kontrol Lampu & Check-In Lapangan Real-time
                        </h4>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Sakelar Interaktif</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['lapangan-1', 'lapangan-2', 'lapangan-3'].map((id, idx) => (
                        <div key={id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div>
                            <h5 className="text-xs font-bold text-white">Lapangan {idx + 1}</h5>
                            <span className={`text-[10px] font-semibold ${lightsActive[id] ? 'text-amber-400' : 'text-slate-500'}`}>
                              {lightsActive[id] ? '💡 Lampu Menyala' : '⚪ Lampu Mati'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleLight(id)}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                              lightsActive[id]
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {lightsActive[id] ? 'Matikan' : 'Nyalakan'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PIC Wilayah Specific Panel */}
                {(currentUser.role === 'pic_wilayah') && (
                  <div className="bg-teal-950/40 border border-teal-800/80 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-teal-300 font-black text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>Panel Khusus: PIC {currentUser.assignedZone || 'Wilayah Teritorial'}</span>
                    </div>
                    <p className="text-xs text-teal-200/80">
                      Anda bertugas memvalidasi warga yang tinggal di kawasan {currentUser.assignedZone || 'Dusun I'} untuk mendapatkan tarif subsidi warga desa (diskon 25%), serta mengawasi ketertiban parkir fasilitas.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-950 p-3 rounded-xl border border-teal-900/60">
                        <span className="text-[10px] text-slate-400 font-bold block">Permohonan Subsidi Warga Hari Ini:</span>
                        <span className="text-sm font-black text-white block mt-1">2 Tim Menunggu Rekomendasi</span>
                        <button
                          type="button"
                          onClick={() => onShowToast('Rekomendasi subsidi warga disetujui', 'success')}
                          className="mt-2 text-xs font-bold text-teal-400 hover:underline cursor-pointer"
                        >
                          ✓ Setujui Rekomendasi →
                        </button>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-teal-900/60">
                        <span className="text-[10px] text-slate-400 font-bold block">Laporan Parkir & Ketertiban:</span>
                        <span className="text-sm font-black text-white block mt-1">Area Parkir Utara: Tertib</span>
                        <button
                          type="button"
                          onClick={() => onShowToast('Laporan lingkungan dicatat ke log', 'info')}
                          className="mt-2 text-xs font-bold text-teal-400 hover:underline cursor-pointer"
                        >
                          + Catat Masalah Lingkungan →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reservations List */}
                <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span>Jadwal Reservasi Pertandingan Hari Ini</span>
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">Live Monitoring</span>
                  </div>

                  <div className="divide-y divide-slate-800/80">
                    {reservations.map((res) => (
                      <div key={res.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-400">{res.id}</span>
                            <span className="text-xs font-black text-white">{res.team}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                              {res.court}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                            ⏰ Waktu: {res.time} · Status: <strong className="text-emerald-400">{res.status}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => toggleCheckIn(res.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                              res.checkedIn
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{res.checkedIn ? 'Sudah Hadir' : 'Verifikasi Check-In'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: LAPORAN REAL-TIME (PDF / JPG) */}
            {activeTab === 'laporan-realtime' && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                        <Activity className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-black text-white tracking-tight">Laporan Real-Time & Ekspor Kas BUMDes</h2>
                    </div>
                    <p className="text-xs text-slate-400">
                      Pantau laporan analitik kas desa secara real-time dengan tombol cetak dokumen PDF resmi atau gambar JPG.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        window.print();
                        onShowToast('Membuka dialog cetak PDF...', 'info');
                      }}
                      className="flex items-center space-x-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Laporan (PDF)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onShowToast('Laporan kas dikonversi ke gambar JPG siap simpan', 'success')}
                      className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Simpan Laporan (JPG)</span>
                    </button>
                  </div>
                </div>

                {/* Category buttons as in user's mockup */}
                <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">Pilih Kategori Laporan Real-Time:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[
                      { key: 'keuangan', label: '1. Keuangan & Kas', desc: 'Rincian Kas BUMDes' },
                      { key: 'sampah', label: '2. Layanan Sampah', desc: 'Nasabah & Truk RT' },
                      { key: 'operasional', label: '3. Armada & Truk BT', desc: 'Alokasi BBM & Jadwal' },
                      { key: 'sdm', label: '4. Absensi SDM', desc: 'Petugas & Staf' },
                      { key: 'sewa', label: '5. Sewa Gedung', desc: 'Pendapatan Aset Desa' }
                    ].map(item => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setReportCategory(item.key)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          reportCategory === item.key
                            ? 'bg-slate-800 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="text-xs font-bold block">{item.label}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Printable Financial Sheet Preview */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                        DOKUMEN NO: BUMDES-LP-WARU/2026/09-A
                      </span>
                      <h3 className="text-lg font-black text-white">Laporan Real-Time Keuangan & Kas BUMDes</h3>
                      <span className="text-xs text-slate-400">Unit Pengelola Keuangan Desa Waru · BUMDES WASKITA WIJAYA</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-300 font-bold block">Periode: September 2026</span>
                      <span className="text-[11px] text-emerald-400 font-mono font-semibold block">Status Saldo: REAL-TIME SYNCED</span>
                      <span className="text-[10px] text-slate-500 font-mono block">Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Total Saldo Kas</span>
                      <p className="text-lg font-black text-white mt-0.5">Rp 184.250.000</p>
                      <span className="text-[10px] text-emerald-400">Kas Bank + Tunai Kasir</span>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Omset Bulan Ini</span>
                      <p className="text-lg font-black text-emerald-400 mt-0.5">Rp 42.800.000</p>
                      <span className="text-[10px] text-slate-500">+18.5% dari bulan lalu</span>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Beban Operasional</span>
                      <p className="text-lg font-black text-rose-400 mt-0.5">Rp 14.200.000</p>
                      <span className="text-[10px] text-slate-500">Gaji, BBM, Listrik</span>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Profit Bersih (PADes)</span>
                      <p className="text-lg font-black text-purple-400 mt-0.5">Rp 28.600.000</p>
                      <span className="text-[10px] text-slate-500">Alokasi Kas Desa</span>
                    </div>
                  </div>

                  {/* Sample Transaction Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-2.5">Tanggal</th>
                          <th className="px-4 py-2.5">Keterangan Transaksi</th>
                          <th className="px-4 py-2.5">Jenis</th>
                          <th className="px-4 py-2.5">Jumlah (Rp)</th>
                          <th className="px-4 py-2.5 text-right">Status Verifikasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-slate-400">05/09/2026</td>
                          <td className="px-4 py-2.5 font-bold text-white">Retribusi Bank Sampah Unit 1-3 (RT 01 - 03 RW 01)</td>
                          <td className="px-4 py-2.5 text-emerald-400 font-semibold">Pemasukan</td>
                          <td className="px-4 py-2.5 font-mono font-bold text-white">Rp 3.450.000</td>
                          <td className="px-4 py-2.5 text-right text-emerald-400 font-bold">Lunas (Kasir)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-slate-400">04/09/2026</td>
                          <td className="px-4 py-2.5 font-bold text-white">Sewa Gedung Serbaguna (Resepsi Pernikahan Warga)</td>
                          <td className="px-4 py-2.5 text-emerald-400 font-semibold">Pemasukan</td>
                          <td className="px-4 py-2.5 font-mono font-bold text-white">Rp 12.000.000</td>
                          <td className="px-4 py-2.5 text-right text-emerald-400 font-bold">Lunas (Online Transfer)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-slate-400">03/09/2026</td>
                          <td className="px-4 py-2.5 font-bold text-white">Pembelian BBM Solar Truk Armada 02</td>
                          <td className="px-4 py-2.5 text-rose-400 font-semibold">Pengeluaran</td>
                          <td className="px-4 py-2.5 font-mono font-bold text-rose-300">Rp 1.250.000</td>
                          <td className="px-4 py-2.5 text-right text-slate-400">Nota Resmi SPBU</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-slate-400">02/09/2026</td>
                          <td className="px-4 py-2.5 font-bold text-white">Honor Sopir & Helper Armada Truk Sampah</td>
                          <td className="px-4 py-2.5 text-rose-400 font-semibold">Pengeluaran</td>
                          <td className="px-4 py-2.5 font-mono font-bold text-rose-300">Rp 4.200.000</td>
                          <td className="px-4 py-2.5 text-right text-slate-400">Transfer Mandiri</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-slate-400">01/09/2026</td>
                          <td className="px-4 py-2.5 font-bold text-white">Hasil Penjualan Daur Ulang Plastik ke Pabrik</td>
                          <td className="px-4 py-2.5 text-emerald-400 font-semibold">Pemasukan</td>
                          <td className="px-4 py-2.5 font-mono font-bold text-white">Rp 15.700.000</td>
                          <td className="px-4 py-2.5 text-right text-emerald-400 font-bold">Lunas (Bank BCA)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span>* Laporan keuangan ini digenerate secara otomatis oleh sistem ledger real-time BUMDes Waskita Wijaya.</span>
                    <span className="font-mono text-emerald-400">WEBSITE BY BUMDES DIGITAL 2026</span>
                  </div>
                </div>
              </div>
            )}

            <Suspense fallback={
              <div className="p-12 text-center text-slate-500">
                <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2" />
                <span className="text-xs">Memuat modul pengelola...</span>
              </div>
            }>
              {/* TAB: LIVE CUSTOMIZER (Super Admin) */}
              {activeTab === 'customizer' && (
                <LiveSiteCustomizer actorName={currentUser.name} onShowToast={onShowToast} />
              )}

              {/* TAB: CMS MODULE (Super Admin) */}
              {activeTab === 'cms' && (
                <CmsModule actorName={currentUser.name} onShowToast={onShowToast} />
              )}

              {/* TAB: META SEO MANAGER (Super Admin) */}
              {activeTab === 'meta-seo' && (
                <MetaSEOManager currentUser={currentUser} onShowToast={onShowToast} />
              )}

              {/* TAB: USER MANAGEMENT MODULE (Super Admin) */}
              {activeTab === 'users' && (
                <UserManagementModule currentUser={currentUser} onShowToast={onShowToast} />
              )}

              {/* TAB: DATABASE BACKUP MODULE (Super Admin) */}
              {activeTab === 'database' && (
                <DatabaseBackupModule actorName={currentUser.name} onShowToast={onShowToast} />
              )}

              {/* TAB: AI BRAIN OTONOM & SELF-HEALING (Super Admin & All) */}
              {activeTab === 'ai-brain' && (
                <AiBrainModule onShowToast={onShowToast} />
              )}
            </Suspense>

            {/* TAB: JADWAL & LAPANGAN */}
            {activeTab === 'jadwal-lapangan' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white">Pengelolaan Jadwal 3 Line Lapangan</h3>
                    <p className="text-xs text-slate-400">Sinkronisasi otomatis dengan formulir pemesanan publik.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onShowToast('Slot jam terkunci untuk turnamen desa', 'info')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer"
                  >
                    + Kunci Slot Khusus / Turnamen
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-bold">Tarif Dasar Lapangan:</span>
                    <span className="text-emerald-400 font-black">Rp 35.000 / Jam (Reguler) · Rp 45.000 / Jam (Malam)</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Semua reservasi publik yang masuk melalui website otomatis tersimpan ke Cloud Firestore koleksi <code>reservations</code> dan dapat diverifikasi secara real-time.
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SEWA AULA GEDUNG */}
            {activeTab === 'sewa-gedung' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white">Daftar Pengajuan Sewa Gedung Serbaguna</h3>
                    <p className="text-xs text-slate-400">Persetujuan acara resepsi pernikahan, rapat dinas, dan hajatan warga.</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-800">
                  {hallBookings.map((b) => (
                    <div key={b.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-black text-white block">{b.event}</span>
                        <span className="text-[11px] text-slate-400 block">
                          📅 {b.date} · Oleh: <strong>{b.pemesan}</strong> · Biaya: <span className="text-emerald-400 font-bold">{b.fee}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          b.status === 'Disetujui' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {b.status}
                        </span>
                        {b.status !== 'Disetujui' && (
                          <button
                            type="button"
                            onClick={() => {
                              setHallBookings(prev => prev.map(item => item.id === b.id ? { ...item, status: 'Disetujui' } : item));
                              onShowToast(`Pengajuan #${b.id} telah disetujui`, 'success');
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer"
                          >
                            Setujui
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: KEUANGAN KAS */}
            {activeTab === 'keuangan' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white">Buku Kas & Transparansi Keuangan BUMDes</h3>
                    <p className="text-xs text-slate-400">Rekapitulasi penerimaan sewa lapangan, aula gedung, dan operasional.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onShowToast('Laporan Keuangan diekspor ke Excel', 'success')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ekspor Excel/CSV</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Kas Masuk</span>
                    <p className="text-xl font-black text-emerald-400 mt-1">Rp 48.250.000</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Biaya Perawatan & Listrik</span>
                    <p className="text-xl font-black text-rose-400 mt-1">Rp 5.450.000</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Saldo Bersih Terkunci</span>
                    <p className="text-xl font-black text-blue-400 mt-1">Rp 42.800.000</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AUDIT LOGS */}
            {activeTab === 'audit-logs' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white">Log Rekam Jejak Sistem (Audit Trail)</h3>
                    <p className="text-xs text-slate-400">Mencatat seluruh aksi kritikal untuk kepatuhan & transparansi BPD.</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto">
                  {auditLogs.map((log, i) => (
                    <div key={i} className="py-2.5 flex items-start justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{log.actorName}</span>
                        <span className="text-slate-400"> ({log.actorRole})</span>: {log.action}
                        <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{log.target}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Suspense fallback={
              <div className="p-12 text-center text-slate-500">
                <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2" />
                <span className="text-xs">Memuat modul pengelola...</span>
              </div>
            }>
              {/* TAB: SYSTEM TELEMETRY & HEALTH MONITORING */}
              {activeTab === 'monitoring' && (
                <SystemMonitoringModule onShowToast={onShowToast} />
              )}

              {/* TAB: LIVE CHAT SUPPORT */}
              {activeTab === 'live-chat' && (
                <LiveChatModule 
                  onShowToast={onShowToast} 
                  currentUser={currentUser} 
                />
              )}

              {/* TAB: STAFF DM & CHANNELS */}
              {activeTab === 'staff-dm' && (
                <StaffDmModule 
                  onShowToast={onShowToast} 
                  currentUser={currentUser} 
                />
              )}

              {/* TAB: BROADCAST NOTIFIKASI MASAL */}
              {activeTab === 'broadcast' && (
                <BroadcastModule 
                  onShowToast={onShowToast} 
                />
              )}

              {/* TAB: PUSAT DATA EMAIL */}
              {activeTab === 'pusat-email' && (
                <EmailCenterModule 
                  onShowToast={onShowToast} 
                />
              )}

              {/* TAB: SUB MENU TAGIHAN */}
              {activeTab === 'tagihan-sampah' && (
                <BillingModule 
                  onShowToast={onShowToast} 
                />
              )}

              {/* TAB: PETA GEOGRAFIS (GIS) */}
              {activeTab === 'peta-geografis' && (
                <GeographicMapModule 
                  onShowToast={onShowToast} 
                />
              )}

              {/* TAB: INVENTARIS & CETAK STIKER */}
              {activeTab === 'inventaris' && (
                <InventoryModule 
                  onShowToast={onShowToast} 
                />
              )}

              {/* TAB: MENU BISNIS & KEUANGAN */}
              {(activeTab === 'bisnis-keuangan' || activeTab === 'dompet') && (
                <BusinessFinanceModule 
                  onShowToast={onShowToast} 
                  onNavigateToBilling={() => setActiveTab('tagihan-sampah')}
                />
              )}
            </Suspense>

            {/* TAB: TIKET RESERVASI GOR & GEDUNG */}
            {activeTab === 'tiket' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">Pusat Tiket & Reservasi Lapangan BUMDes</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                        3 Tiket Aktif
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Kelola pemesanan, verifikasi check-in barcode/QR di pintu masuk, dan cetak bukti booking.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onShowToast('Memindai scanner barcode QR kamera...', 'info')}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-cyan-500/20"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Scan Barcode QR</span>
                    </button>
                  </div>
                </div>

                {/* Tickets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reservations.map((res) => (
                    <div 
                      key={res.id} 
                      className={`p-5 rounded-2xl border transition-all ${
                        res.checkedIn 
                          ? 'bg-slate-900/90 border-emerald-500/40 shadow-sm' 
                          : 'bg-[#091526] border-cyan-500/30 shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-black text-cyan-400 px-2 py-0.5 rounded-md bg-[#102a43]">
                          #{res.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          res.checkedIn 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : res.status === 'Lunas' 
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' 
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {res.checkedIn ? '✓ Sudah Check-In' : res.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">{res.team}</h4>
                      <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-amber-400" />
                        <span>{res.court}</span>
                      </p>
                      <p className="text-xs text-slate-300 font-mono mb-4 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{res.time}</span>
                      </p>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        {!res.checkedIn ? (
                          <button
                            type="button"
                            onClick={() => {
                              setReservations(prev => prev.map(r => r.id === res.id ? { ...r, checkedIn: true } : r));
                              onShowToast(`Check-in berhasil untuk tiket #${res.id} (${res.team})`, 'success');
                            }}
                            className="flex-1 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer text-center"
                          >
                            Verifikasi Masuk
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Pintu Terbuka</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => onShowToast(`Mencetak struk thermal tiket #${res.id}`, 'info')}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                          title="Cetak E-Tiket"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ABSENSI KARYAWAN */}
            {activeTab === 'absensi' && (
              <div className="space-y-6">
                {/* Header Banner with Real-time Clock */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                      Sistem Presensi Digital BUMDes Waskita Wijaya
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">Presensi & Kehadiran Karyawan</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Terverifikasi radius geofence GPS Kantor Desa & Unit Usaha secara real-time.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-2xl bg-[#091829] border border-cyan-500/30 text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Waktu Server</span>
                      <span className="text-sm font-mono font-black text-cyan-400">{currentTimeStr}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onShowToast('Kehadiran Super Admin berhasil direkam pada ' + currentTimeStr, 'success')}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Presensi Masuk</span>
                    </button>
                  </div>
                </div>

                {/* Attendance Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Karyawan</span>
                    <p className="text-2xl font-black text-white mt-1">{attendanceList.length} Orang</p>
                    <span className="text-[10px] text-emerald-400 font-medium">100% Terdaftar</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Hadir Tepat Waktu</span>
                    <p className="text-2xl font-black text-emerald-400 mt-1">
                      {attendanceList.filter(a => a.status.includes('Tepat Waktu')).length} Orang
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">Sebelum 08:00 WIB</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Dinas Luar</span>
                    <p className="text-2xl font-black text-amber-400 mt-1">1 Orang</p>
                    <span className="text-[10px] text-slate-400 font-medium">Kecamatan Baki</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">GPS Geofence</span>
                    <p className="text-2xl font-black text-cyan-400 mt-1">Terkunci</p>
                    <span className="text-[10px] text-cyan-400 font-medium">Radius &lt; 50 Meter</span>
                  </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Log Kehadiran Hari Ini</h4>
                    <button
                      type="button"
                      onClick={() => onShowToast('Rekap absensi diekspor ke Excel', 'success')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Unduh Laporan Absensi</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800 overflow-x-auto">
                    {attendanceList.map((item) => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-3 min-w-[500px]">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center font-bold text-xs">
                            {item.avatar}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{item.name}</span>
                            <span className="text-[11px] text-slate-400 block">{item.role} · 📍 {item.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="text-xs font-mono text-cyan-300">{item.time}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            item.status.includes('Tepat Waktu') 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                              : item.status.includes('Dinas') 
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CUTI & PERIZINAN */}
            {activeTab === 'cuti' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                      Tata Kelola SDM Desa Waru
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">Manajemen Cuti & Perizinan Karyawan</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Persetujuan langsung oleh Super Administrator / Direktur Utama.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onShowToast('Formulir pengajuan cuti dibuka', 'info')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-cyan-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajukan Cuti / Izin</span>
                  </button>
                </div>

                {/* Leave Requests Cards */}
                <div className="space-y-3">
                  {leaveRequests.map((req) => (
                    <div key={req.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">{req.name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-[#102a43] text-cyan-400 text-[10px] font-mono font-bold">
                            {req.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          <strong>Periode:</strong> {req.date} · <strong>Alasan:</strong> {req.reason}
                        </p>
                        <span className="text-[11px] text-slate-500 block">Jabatan: {req.role}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {req.status === 'Menunggu Persetujuan' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setLeaveRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Disetujui' } : r));
                                onShowToast(`Cuti #${req.id} (${req.name}) telah disetujui`, 'success');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-xs"
                            >
                              Setujui Permohonan
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLeaveRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Ditolak' } : r));
                                onShowToast(`Cuti #${req.id} (${req.name}) ditolak`, 'info');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold cursor-pointer"
                            >
                              Tolak
                            </button>
                          </>
                        ) : (
                          <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                            req.status === 'Disetujui' 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                              : req.status === 'Ditolak'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {req.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </main>
      </div>

    </div>
  );
}
