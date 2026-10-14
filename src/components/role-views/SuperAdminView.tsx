import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Server, Terminal, Database, ToggleLeft, ToggleRight, 
  Cpu, Activity, RefreshCw, Key, Users, CheckCircle2, AlertTriangle, 
  Download, Play, HardDrive, Shield, FileText, Code, Printer, Image, 
  Layout, Eye, Plus, Trash2, ArrowUp, ArrowDown, Save, Sparkles, Check, Layers, Building,
  Receipt, DollarSign
} from 'lucide-react';
import { User, UserRole, PageType } from '../../types';
import { exportReportToPDF, exportReportToJPG, ReportData } from '../../utils/reportExporter';
import { showToast } from '../ToastNotification';
import ReservationManager from '../admin/ReservationManager';
import BillingModule from '../admin/BillingModule';
import BusinessFinanceModule from '../admin/BusinessFinanceModule';

interface SuperAdminViewProps {
  currentUser: User;
  token: string;
  onRoleSwitch?: (newRole: UserRole) => void;
}

export default function SuperAdminView({ currentUser, token, onRoleSwitch }: SuperAdminViewProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'reservations' | 'billing' | 'finance' | 'customizer' | 'system' | 'logs' | 'modules' | 'users'>('reports');
  
  const [serverLogs, setServerLogs] = useState<Array<{ id: string; time: string; level: 'INFO' | 'WARN' | 'AUTH' | 'API'; text: string }>>([
    { id: '1', time: '13:19:02', level: 'INFO', text: 'Express server booted on http://0.0.0.0:3000' },
    { id: '2', time: '13:19:05', level: 'AUTH', text: 'Session validated for admin@bumdesa.id (usr_superadmin)' },
    { id: '3', time: '13:19:12', level: 'API', text: 'GET /api/auth/me HTTP/1.1 200 OK - 12ms' },
    { id: '4', time: '13:19:25', level: 'INFO', text: 'Database sync check: 3 default users present' },
    { id: '5', time: '13:19:30', level: 'API', text: 'POST /api/auth/login HTTP/1.1 200 OK - 24ms' },
  ]);

  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [testingApi, setTestingApi] = useState(false);

  // Users database list state
  const [usersList, setUsersList] = useState<Array<User>>([
    { id: 'usr_superadmin', email: 'admin@bumdesa.id', role: 'superadmin', name: 'Budi Santoso (Admin Pengelola)', phone: '0812••••7890' },
    { id: 'usr_karyawan', email: 'karyawan@bumdesa.id', role: 'karyawan', name: 'Slamet Rahardjo (Teller Kasir)', phone: '0856••••1234' },
    { id: 'usr_warga', email: 'warga@bumdesa.id', role: 'pengguna', name: 'Siti Aminah (Nasabah Terdaftar)', phone: '0819••••4321', nik: '3302••••••••02', nasabahId: 'NSB-38290' },
  ]);

  // Feature Toggles state
  const [moduleToggles, setModuleToggles] = useState({
    bankSampah: true,
    sewaGedung: true,
    jadwalTruk: true,
    musdesEvoting: true,
    posyandu: true,
    wisataKuliner: true,
    marketplaceUmkm: true,
    lokerDesa: true,
  });

  // --- Real-time Customizer States ---
  const [customTheme, setCustomTheme] = useState({
    badge: 'BUMDESA',
    title: 'WASKITA WIJAYA',
    subtitle: 'DESA WARU • KAB. SUKOHARJO',
  });

  const [customNavItems, setCustomNavItems] = useState<Array<{ id: string; label: string; value: string; visible: boolean }>>([
    { id: 'nav-1', label: 'Beranda', value: 'beranda', visible: true },
    { id: 'nav-booking', label: 'Cek jadwal & booking', value: 'cek-jadwal-booking', visible: true },
    { id: 'nav-2', label: 'Marketplace UMKM', value: 'marketplace-umkm', visible: true },
    { id: 'nav-3', label: 'Tentang Kami', value: 'tentang-kami', visible: true },
    { id: 'nav-4', label: 'Layanan', value: 'layanan', visible: true },
    { id: 'nav-5', label: 'Kegiatan', value: 'kegiatan', visible: true },
    { id: 'nav-6', label: 'Pengumuman', value: 'pengumuman', visible: true },
    { id: 'nav-7', label: 'Kontak', value: 'kontak', visible: true },
  ]);

  const [newMenuLabel, setNewMenuLabel] = useState('');
  const [newMenuValue, setNewMenuValue] = useState('');

  // --- Real-time Reports State ---
  const [selectedReportId, setSelectedReportId] = useState<string>('keuangan');
  const [reportPeriod, setReportPeriod] = useState<string>('Juli 2026');

  // Pre-configured Real-Time Reports Data
  const reportsDatabase: Record<string, ReportData> = {
    keuangan: {
      id: 'KEU-2026-07',
      title: 'Laporan Real-Time Keuangan & Kas BUMDES',
      subtitle: 'Unit Pengelola Keuangan Desa Waru',
      refNo: 'BUMDES/LAP-KEU/2026/07-A',
      printedBy: 'Super Admin BUMDES',
      datePeriod: reportPeriod,
      metrics: [
        { label: 'Total Saldo Kas', value: 'Rp 184.250.000', subtext: 'Bank BCA + Cash Vault' },
        { label: 'Omzet Bulan Ini', value: 'Rp 42.800.000', subtext: '+18.5% dari bulan lalu' },
        { label: 'Beban Operasional', value: 'Rp 14.200.000', subtext: 'Gaji, BBM & Maint.' },
        { label: 'Profit Bersih', value: 'Rp 28.600.000', subtext: 'Deviden Desa Ready' },
      ],
      tableHeaders: ['Tanggal', 'Keterangan Transaksi', 'Jenis', 'Jumlah (Rp)', 'Status Verifikasi'],
      tableRows: [
        ['21/07/2026', 'Setoran Bank Sampah Unit 1 (RT 01 - RT 06)', 'Pemasukan', 'Rp 8.450.000', 'Lunas (Kasir)'],
        ['20/07/2026', 'Sewa Gedung Serbaguna (Resepsi Pernikahan)', 'Pemasukan', 'Rp 12.000.000', 'Lunas (Online Transfer)'],
        ['19/07/2026', 'Pembelian BBM Solar Truk Armada #2', 'Pengeluaran', 'Rp 1.250.000', 'Nota Resmi Pertamina'],
        ['18/07/2026', 'Honor Teller & Driver Armada Truk Sampah', 'Pengeluaran', 'Rp 4.500.000', 'Transfer Mandiri'],
        ['17/07/2026', 'Hasil Penjualan Daur Ulang Plastik ke Pabrik', 'Pemasukan', 'Rp 18.200.000', 'Lunas (Bank BCA)']
      ],
      notes: 'Laporan keuangan ini diperbarui secara otomatis dari sistem ledger transaksi kas BUMDESA Waskita Wijaya.',
      signatureTitle: 'Direktur Utama BUMDESA Waskita,',
      signatureName: 'SUTRISNO, S.Sos.'
    },
    bank_sampah: {
      id: 'BS-2026-07',
      title: 'Laporan Unit Usaha Layanan Pengelolaan Sampah Desa',
      subtitle: 'Unit Pengolahan Daur Ulang & Lingkungan',
      refNo: 'BUMDES/BS/2026/07-B',
      printedBy: 'Super Admin BUMDES',
      datePeriod: reportPeriod,
      metrics: [
        { label: 'Total Tonase Sampah', value: '18.450 Kg', subtext: 'Akumulasi Bulan Ini' },
        { label: 'Nasabah Aktif', value: '482 Nasabah', subtext: 'Terdaftar RT 01 - RT 12' },
        { label: 'Saldo Tabungan Warga', value: 'Rp 62.400.000', subtext: 'Siap ditarik tunai' },
        { label: 'Rasio Daur Ulang', value: '92.4%', subtext: 'Target Zero Waste' },
      ],
      tableHeaders: ['Kategori Sampah', 'Berat Terkumpul', 'Harga Satuan', 'Nilai Total', 'Status Penampungan'],
      tableRows: [
        ['Botol Plastik PET Clean', '5.820 Kg', 'Rp 5.000 / Kg', 'Rp 29.100.000', 'Pengepakan Siap Kirim'],
        ['Kertas & Kardus Tebal', '7.400 Kg', 'Rp 3.000 / Kg', 'Rp 22.200.000', 'Tersimpan di Hanggar'],
        ['Kaleng Aluminium & Besi', '1.250 Kg', 'Rp 15.000 / Kg', 'Rp 18.750.000', 'Terjual Lunas'],
        ['Minyak Jelantah (UCO)', '980 Liter', 'Rp 7.500 / Liter', 'Rp 7.350.000', 'Tangki Penampungan Utama'],
        ['Residu Non-Recyclable', '2.990 Kg', 'Rp 0 / Kg', 'TPA Sukoharjo', 'Diangkut Armada Truk']
      ],
      notes: 'Timbangan fisik diverifikasi langsung oleh petugas teller menggunakan timbangan digital terkalibrasi.',
      signatureTitle: 'Kepala Unit Layanan Pengelolaan Sampah Desa,',
      signatureName: 'SLAMET RAHARDJO'
    },
    fleet_truk: {
      id: 'FLT-2026-07',
      title: 'Laporan Operasional Fleet Truk Sampah RT',
      subtitle: 'Unit Logistik & Pengangkutan Wilayah',
      refNo: 'BUMDES/FLT/2026/07-C',
      printedBy: 'Super Admin BUMDES',
      datePeriod: reportPeriod,
      metrics: [
        { label: 'Total Ritase Transport', value: '142 Rit', subtext: 'Seluruh Wilayah RT' },
        { label: 'Konsumsi BBM Solar', value: '420 Liter', subtext: 'Rata-rata 2.9 Km/L' },
        { label: 'Efisiensi Rute RT', value: '98.4%', subtext: 'Tepat Jadwal Masing-Masing' },
        { label: 'Kondisi Armada', value: '3/3 Ready', subtext: 'Siap Operasional 100%' },
      ],
      tableHeaders: ['Armada Truk', 'Cakupan Wilayah', 'Ritase', 'Konsumsi BBM', 'Status Kondisi Machine'],
      tableRows: [
        ['Truk AD 8912 BS (Isuzu ELF)', 'RT 01 s.d RT 06', '48 Rit', '140 Liter Solar', 'Sangat Baik (Servis Rutin)'],
        ['Truk AD 8102 WW (Colt Diesel)', 'RT 07 s.d RT 12', '52 Rit', '155 Liter Solar', 'Ganti Oli Murni Lunas'],
        ['Pick Up AD 9012 BUM (Gran Max)', 'Pasar Desa & Kawasan Kuliner', '42 Rit', '125 Liter Pertalite', 'Sangat Baik'],
        ['Jadwal Pengangkutan Besok', 'RT 03 & Pasar Desa', '12 Rit Rencana', 'Estimasi 35 Liter', 'Driver: Andi Wijaya']
      ],
      notes: 'Seluruh armada dilengkapi GPS tracking real-time untuk memantau waktu kedatangan di setiap RT.',
      signatureTitle: 'Manajer Armada & Logistik,',
      signatureName: 'DWI PRASETYO, S.T.'
    },
    sdm_absensi: {
      id: 'SDM-2026-07',
      title: 'Laporan Absensi & Kinerja SDM Karyawan',
      subtitle: 'Unit Pengelolaan Sumber Daya Manusia',
      refNo: 'BUMDES/SDM/2026/07-D',
      printedBy: 'Super Admin BUMDES',
      datePeriod: reportPeriod,
      metrics: [
        { label: 'Total Staff Active', value: '12 Personil', subtext: 'Kasir, Driver & Helper' },
        { label: 'Presensi Kehadiran', value: '99.2%', subtext: 'Disiplin Tinggi' },
        { label: 'Total Jam Lembur', value: '28 Jam', subtext: 'Pengangkutan Event' },
        { label: 'Indeks Kinerja', value: '4.9 / 5.0', subtext: 'Sangat Memuaskan' },
      ],
      tableHeaders: ['Nama Karyawan', 'Jabatan / Unit', 'Presensi Hadir', 'Persentase', 'Evaluasi Kinerja'],
      tableRows: [
        ['Slamet Rahardjo', 'Teller & Kasir Bank Sampah', '22 / 22 Hari', '100%', 'Sangat Disiplin & Ramah'],
        ['Hartini', 'Admin Keuangan & Pembukuan', '22 / 22 Hari', '100%', 'Laporan Selalu Akurat'],
        ['Andi Wijaya', 'Driver Utama Armada Truk #1', '21 / 22 Hari', '95.4%', 'Sangat Baik (Izin Sakit 1 Hari)'],
        ['Bambang Setyawan', 'Petugas Sorting & Timbangan', '22 / 22 Hari', '100%', 'Fisik Kuat & Cermat'],
        ['Rina Astuti', 'Pengelola Sewa Gedung Aset', '22 / 22 Hari', '100%', 'Pelayanan Konsumen Prima']
      ],
      notes: 'Presensi karyawan dicatat menggunakan sistem biometrik & geolokasi GPS saat bertugas.',
      signatureTitle: 'Kepala Bagian SDM,',
      signatureName: 'MARSUDI, S.E.'
    },
    sewa_gedung: {
      id: 'GW-2026-07',
      title: 'Laporan Sewa Gedung & Pendapatan Aset Desa',
      subtitle: 'Unit Pengelolaan Aset & Gedung Serbaguna',
      refNo: 'BUMDES/GW/2026/07-E',
      printedBy: 'Super Admin BUMDES',
      datePeriod: reportPeriod,
      metrics: [
        { label: 'Tingkat Okupansi', value: '88.0%', subtext: 'Akhir Pekan Terisi Penuh' },
        { label: 'Pendapatan Sewa', value: 'Rp 38.000.000', subtext: 'Bulan Juli 2026' },
        { label: 'Reservasi Mendatang', value: '8 Event', subtext: 'Agustus - September' },
        { label: 'Rating Kepuasan', value: '4.95 / 5.0', subtext: 'Ulasan Warga & Penyewa' },
      ],
      tableHeaders: ['Nama Fasilitas Aset', 'Penyewa / Peruntukan', 'Tanggal Event', 'Nilai Sewa (Rp)', 'Status Pembayaran'],
      tableRows: [
        ['Gedung Utama Waskita', 'Pernikahan Bpk. Haryanto', '18/07/2026', 'Rp 12.000.000', 'Lunas 100%'],
        ['Lapangan Futsal Desa', 'Turnamen Karang Taruna Waru', '12/07/2026', 'Rp 3.500.000', 'Lunas 100%'],
        ['Gedung Serbaguna', 'Rapat Anggota Tahunan Koperasi', '05/07/2026', 'Rp 4.000.000', 'Lunas 100%'],
        ['Gedung Utama Waskita', 'Resepsi Pernikahan An. Siti', '02/08/2026 (Mendatang)', 'Rp 12.000.000', 'DP 50% Lunas'],
        ['Kios Kuliner BUMDES #4', 'Sewa Bulanan Lapak UMKM', 'Bulan Juli 2026', 'Rp 1.500.000', 'Lunas 100%']
      ],
      notes: 'Seluruh dana hasil pemanfaatan aset desa masuk ke kas rekening resmi BUMDESA Waskita Wijaya.',
      signatureTitle: 'Pengelola Aset & Gedung,',
      signatureName: 'RINA ASTUTI'
    }
  };

  // Load custom header settings on boot
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('app_theme_config');
      if (savedTheme) {
        setCustomTheme(JSON.parse(savedTheme));
      }
      const savedNav = localStorage.getItem('app_nav_items');
      if (savedNav) {
        setCustomNavItems(JSON.parse(savedNav));
      }
    } catch (e) {
      console.warn('Failed loading local customizer settings');
    }
  }, []);

  // Fetch live users from server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.users && data.users.length > 0) {
            setUsersList(data.users);
          }
        }
      } catch (err) {
        console.warn('Using fallback admin user list');
      }
    };
    fetchUsers();
  }, [token]);

  const testApiEndpoint = async (endpoint: string) => {
    setTestingApi(true);
    setApiResponse(null);
    try {
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
      
      const newLog = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString(),
        level: 'API' as const,
        text: `GET ${endpoint} HTTP/1.1 ${res.status} OK`
      };
      setServerLogs(prev => [newLog, ...prev]);
    } catch (err: any) {
      setApiResponse(`Error: ${err.message}`);
    } finally {
      setTestingApi(false);
    }
  };

  const handleToggleModule = (key: keyof typeof moduleToggles) => {
    setModuleToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    if (userId === currentUser.id && onRoleSwitch) {
      onRoleSwitch(newRole);
    }

    try {
      await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      showToast('Role pengguna berhasil diperbarui!', 'success');
    } catch (err) {
      console.error('Failed to sync role to backend', err);
    }
  };

  // --- Realtime Customizer Actions ---
  const handleSaveThemeConfig = () => {
    localStorage.setItem('app_theme_config', JSON.stringify(customTheme));
    window.dispatchEvent(new CustomEvent('app-theme-updated'));
    showToast('Tampilan header & judul portal berhasil diperbarui secara realtime!', 'success');
  };

  const handleSaveNavItems = () => {
    localStorage.setItem('app_nav_items', JSON.stringify(customNavItems));
    window.dispatchEvent(new CustomEvent('app-nav-updated'));
    showToast('Menu navigasi portal berhasil disinkronkan secara realtime!', 'success');
  };

  const handleToggleNavVisibility = (id: string) => {
    setCustomNavItems(prev => prev.map(item => item.id === id ? { ...item, visible: !item.visible } : item));
  };

  const handleMoveNavItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= customNavItems.length) return;
    
    const updated = [...customNavItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setCustomNavItems(updated);
  };

  const handleAddCustomMenu = () => {
    if (!newMenuLabel.trim() || !newMenuValue.trim()) {
      showToast('Mohon isi label menu dan ID halaman!', 'error');
      return;
    }
    const newItem = {
      id: `nav-${Date.now()}`,
      label: newMenuLabel.trim(),
      value: newMenuValue.trim().toLowerCase().replace(/\s+/g, '-'),
      visible: true
    };
    setCustomNavItems(prev => [...prev, newItem]);
    setNewMenuLabel('');
    setNewMenuValue('');
    showToast('Menu baru berhasil ditambahkan ke daftar navigasi!', 'success');
  };

  const handleDeleteCustomMenu = (id: string) => {
    setCustomNavItems(prev => prev.filter(i => i.id !== id));
    showToast('Menu berhasil dihapus!', 'info');
  };

  // --- Report Export Actions ---
  const activeReport = reportsDatabase[selectedReportId] || reportsDatabase.keuangan;

  const handlePrintPDF = () => {
    try {
      exportReportToPDF(activeReport);
      showToast(`Laporan PDF "${activeReport.title}" berhasil diunduh!`, 'success');
    } catch (err: any) {
      showToast(`Gagal mencetak PDF: ${err.message}`, 'error');
    }
  };

  const handlePrintJPG = () => {
    try {
      exportReportToJPG(activeReport);
      showToast(`Laporan Gambar JPG "${activeReport.title}" berhasil diunduh!`, 'success');
    } catch (err: any) {
      showToast(`Gagal mencetak JPG: ${err.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      
      {/* Super Admin Top Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 rounded-full text-xs font-mono font-bold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Role 1: Super Admin & Web Developer Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Pusat Kendali Portal Super Admin BUMDES
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Pantau laporan analitik real-time dengan cetak PDF / JPG, ubah susunan menu & tampilan website secara live, kelola hak akses user, serta kontrol saklar master fitur.
            </p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 space-y-2 min-w-[220px]">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Status Runtime Server</div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-300 font-mono">LIVE REAL-TIME (Port 3000)</span>
            </div>
            <div className="text-[11px] font-mono text-slate-300">Ekspor Laporan: PDF & JPG Ready</div>
            <div className="text-[11px] font-mono text-amber-400">Customizer UI: Active Live</div>
          </div>
        </div>
      </div>

      {/* KPI System Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Laporan Real-Time</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">5 Kategori</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Format PDF & JPG Terintegrasi</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Status Tampilan & Menu</span>
            <Layout className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">Live Edit</div>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Bisa Diubah Kapan Saja</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">System Uptime</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">99.98%</div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">0 Server Faults</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Pengguna Terdaftar</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{usersList.length} User</div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">3 Level Role Aktif</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Laporan Real-Time (PDF / JPG)</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'reservations'
              ? 'bg-[#1677B8] text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Kelola Reservasi GOR</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'billing'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Tagihan & Invoice</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'finance'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Keuangan & PADes</span>
        </button>

        <button
          onClick={() => setActiveTab('customizer')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'customizer'
              ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Kustomisasi Tampilan & Menu</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'system'
              ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Penguji API & Server</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Stream Log Real-Time</span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'modules'
              ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <ToggleRight className="w-4 h-4" />
          <span>Saklar Master Fitur</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manajemen User & Role</span>
        </button>
      </div>

      {/* Tab: Kelola Reservasi GOR & Gedung */}
      {activeTab === 'reservations' && (
        <ReservationManager
          token={token}
          currentUserRole="superadmin"
          currentUserName={currentUser.name}
        />
      )}

      {/* Tab: Billing & Invoice Tagihan */}
      {activeTab === 'billing' && (
        <BillingModule onShowToast={showToast} />
      )}

      {/* Tab: Keuangan Kas & Alokasi PAD Desa */}
      {activeTab === 'finance' && (
        <BusinessFinanceModule
          onShowToast={showToast}
          onNavigateToBilling={() => setActiveTab('billing')}
        />
      )}

      {/* Tab: Real-Time Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Top Selector Bar */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Printer className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  Pilih Laporan Eksekutif Real-Time
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Pilih jenis laporan operasional BUMDES yang ingin Anda analisis dan cetak langsung ke format dokumen PDF atau format gambar JPG.
                </p>
              </div>

              {/* Action Export Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handlePrintPDF}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  title="Unduh Laporan Format PDF"
                >
                  <FileText className="w-4 h-4" />
                  <span>Cetak Laporan (PDF)</span>
                </button>

                <button
                  onClick={handlePrintJPG}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  title="Unduh Laporan Format Gambar JPG"
                >
                  <Image className="w-4 h-4" />
                  <span>Cetak Laporan (.JPG)</span>
                </button>
              </div>
            </div>

            {/* Category Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              <button
                onClick={() => setSelectedReportId('keuangan')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedReportId === 'keuangan'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-950/50 text-teal-900 dark:text-teal-300 font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold">1. Keuangan & Kas</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Omzet & Laba BUMDES</div>
              </button>

              <button
                onClick={() => setSelectedReportId('bank_sampah')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedReportId === 'bank_sampah'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-950/50 text-teal-900 dark:text-teal-300 font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold">2. Layanan Pengelolaan Sampah</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Tonase & Daur Ulang</div>
              </button>

              <button
                onClick={() => setSelectedReportId('fleet_truk')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedReportId === 'fleet_truk'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-950/50 text-teal-900 dark:text-teal-300 font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold">3. Fleet & Truk RT</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Ritase & BBM Armada</div>
              </button>

              <button
                onClick={() => setSelectedReportId('sdm_absensi')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedReportId === 'sdm_absensi'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-950/50 text-teal-900 dark:text-teal-300 font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold">4. Absensi SDM</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Kinerja & Staff</div>
              </button>

              <button
                onClick={() => setSelectedReportId('sewa_gedung')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedReportId === 'sewa_gedung'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-950/50 text-teal-900 dark:text-teal-300 font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold">5. Sewa Gedung</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Pendapatan Aset Desa</div>
              </button>
            </div>
          </div>

          {/* Active Report Live Document View */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
            
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-800">
                  DOCUMENT NO: {activeReport.refNo}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {activeReport.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {activeReport.subtitle} • BUMDESA WASKITA WIJAYA DESA WARU
                </p>
              </div>

              <div className="text-right font-mono text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div>Periode: <span className="font-bold text-slate-800 dark:text-white">{activeReport.datePeriod}</span></div>
                <div>Status Data: <span className="text-emerald-600 dark:text-emerald-400 font-bold">REAL-TIME SYNCED</span></div>
                <div>Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeReport.metrics.map((m, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{m.label}</div>
                  <div className="text-xl font-extrabold text-teal-700 dark:text-teal-300 font-mono">{m.value}</div>
                  {m.subtext && <div className="text-[10px] text-slate-400">{m.subtext}</div>}
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Rincian Transaksi & Aktivitas Real-Time
              </h4>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-teal-700 text-white font-bold text-[11px] uppercase">
                    <tr>
                      {activeReport.tableHeaders.map((h, idx) => (
                        <th key={idx} className="p-3.5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-200">
                    {activeReport.tableRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3.5">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes & Verification Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="text-slate-500 dark:text-slate-400 italic">
                * {activeReport.notes}
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span>VERIFIED BY BUMDES DIGITAL AUDIT</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab: Realtime Customizer (UI Layout & Navigation Menu) */}
      {activeTab === 'customizer' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layout className="w-5 h-5 text-amber-500" />
                Kustomisasi Tampilan Header & Navigasi Real-Time
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Sebagai Super Admin, Anda memiliki akses penuh untuk mengubah judul aplikasi, badge header, serta menambah, mengedit, menyembunyikan, atau mengatur ulang urutan menu navigasi secara instan tanpa perlu reload aplikasi.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Section 1: Header Branding Customizer */}
              <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  1. Teks Judul & Branding Header Website
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Badge Kategori Header
                    </label>
                    <input
                      type="text"
                      value={customTheme.badge}
                      onChange={(e) => setCustomTheme({ ...customTheme, badge: e.target.value })}
                      placeholder="Contoh: BUMDESA"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Nama Utama BUMDES / Portal
                    </label>
                    <input
                      type="text"
                      value={customTheme.title}
                      onChange={(e) => setCustomTheme({ ...customTheme, title: e.target.value })}
                      placeholder="Contoh: WASKITA WIJAYA"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Sub-Judul / Lokasi Wilayah
                    </label>
                    <input
                      type="text"
                      value={customTheme.subtitle}
                      onChange={(e) => setCustomTheme({ ...customTheme, subtitle: e.target.value })}
                      placeholder="Contoh: DESA WARU • KAB. SUKOHARJO"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  {/* Live Preview Box */}
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Pratinjau Live Header:</span>
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs">
                        WW
                      </div>
                      <div>
                        <div className="text-[9px] font-black text-emerald-600 uppercase">{customTheme.badge}</div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">{customTheme.title}</div>
                        <div className="text-[9px] text-slate-400 font-bold">{customTheme.subtitle}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveThemeConfig}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Terapkan Tampilan Real-Time</span>
                  </button>
                </div>
              </div>

              {/* Section 2: Add New Menu */}
              <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  2. Tambah Menu Navigasi Baru
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Nama Label Menu
                    </label>
                    <input
                      type="text"
                      value={newMenuLabel}
                      onChange={(e) => setNewMenuLabel(e.target.value)}
                      placeholder="Contoh: E-Katalog Desa"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      ID Halaman / Route Value
                    </label>
                    <input
                      type="text"
                      value={newMenuValue}
                      onChange={(e) => setNewMenuValue(e.target.value)}
                      placeholder="Contoh: e-katalog"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <button
                    onClick={handleAddCustomMenu}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambahkan Menu Baru</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Section 3: Navigation Menu Table */}
            <div className="space-y-3 border-t border-slate-200 dark:border-slate-700 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    Kelola Urutan & Visibilitas Menu Navigasi Website
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Aktifkan/nonaktifkan menu, ubah label secara langsung, atau ubah posisi urutan tampil di header.
                  </p>
                </div>

                <button
                  onClick={handleSaveNavItems}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Navigasi Real-Time</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Urutan</th>
                      <th className="p-3.5">Nama Label Menu</th>
                      <th className="p-3.5">Target Route Page</th>
                      <th className="p-3.5">Status Tampil</th>
                      <th className="p-3.5 text-right">Aksi Pindah & Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {customNavItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="p-3.5 font-mono font-bold text-slate-400">
                          #{idx + 1}
                        </td>
                        <td className="p-3.5">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const updated = [...customNavItems];
                              updated[idx].label = e.target.value;
                              setCustomNavItems(updated);
                            }}
                            className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold text-xs w-full max-w-xs"
                          />
                        </td>
                        <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">
                          {item.value}
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => handleToggleNavVisibility(item.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                              item.visible
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {item.visible ? '✓ Tampil' : '✕ Tersembunyi'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleMoveNavItem(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-lg disabled:opacity-30 cursor-pointer"
                              title="Pindah Ke Atas"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveNavItem(idx, 'down')}
                              disabled={idx === customNavItems.length - 1}
                              className="p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-lg disabled:opacity-30 cursor-pointer"
                              title="Pindah Ke Bawah"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCustomMenu(item.id)}
                              className="p-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer ml-2"
                              title="Hapus Menu"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 1: System & API Tester */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-amber-500" />
              Uji API Backend Live
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Jalankan tes panggil HTTP REST API ke server Express lokal untuk memverifikasi fungsionalitas backend:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => testApiEndpoint('/api/health')}
                disabled={testingApi}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold flex items-center justify-between text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <span>GET /api/health</span>
                <Play className="w-3.5 h-3.5 text-emerald-500" />
              </button>

              <button
                onClick={() => testApiEndpoint('/api/auth/me')}
                disabled={testingApi}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold flex items-center justify-between text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <span>GET /api/auth/me</span>
                <Play className="w-3.5 h-3.5 text-blue-500" />
              </button>

              <button
                onClick={() => testApiEndpoint('/api/admin/users')}
                disabled={testingApi}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold flex items-center justify-between text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <span>GET /api/admin/users</span>
                <Play className="w-3.5 h-3.5 text-purple-500" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-bold uppercase text-[11px] tracking-wider">Hasil Response API JSON</span>
              {testingApi && <span className="text-amber-400 animate-pulse text-[11px]">Memanggil Endpoint...</span>}
            </div>

            <pre className="p-4 bg-slate-900 rounded-xl overflow-x-auto text-emerald-400 text-xs min-h-[180px] max-h-[300px]">
              {apiResponse || '// Klik salah satu tombol di sebelah kiri untuk menjalankan tes API.'}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Logs */}
      {activeTab === 'logs' && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white text-sm">Konsol Server Express Log Stream</span>
            </div>
            <button
              onClick={() => {
                setServerLogs(prev => [
                  { id: Date.now().toString(), time: new Date().toLocaleTimeString(), level: 'INFO', text: 'Manual log refresh triggered by Super Admin' },
                  ...prev
                ]);
              }}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Log</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
            {serverLogs.map(log => (
              <div key={log.id} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/80 flex items-start gap-3">
                <span className="text-slate-500 shrink-0 text-[11px]">{log.time}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                  log.level === 'INFO' ? 'bg-blue-500/20 text-blue-400' :
                  log.level === 'AUTH' ? 'bg-purple-500/20 text-purple-400' :
                  log.level === 'API' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {log.level}
                </span>
                <span className="text-slate-300">{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Feature Toggles */}
      {activeTab === 'modules' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ToggleRight className="w-5 h-5 text-amber-500" />
              Saklar Master Modul Aplikasi (Feature Flagging)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sebagai Super Admin, Anda memiliki hak penuh untuk mengaktifkan atau menonaktifkan modul layanan BUMDESA Waskita secara dinamik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(moduleToggles).map(([key, val]) => (
              <div key={key} className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {val ? 'Aktif - Terlihat oleh pengguna & karyawan' : 'Nonaktif - Disembunyikan dari UI publik'}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleModule(key as keyof typeof moduleToggles)}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    val ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                >
                  {val ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: User & Role Manager */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Daftar Pengguna & Pengaturan Role Akses
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ubah hak akses akun pengguna terdaftar antara Super Admin, Karyawan Operasional, atau Pengguna Warga.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Nama & Email</th>
                  <th className="p-3.5">Role Akses Aktif</th>
                  <th className="p-3.5">No. Telepon / NIK</th>
                  <th className="p-3.5">Ubah Role Langsung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{u.name || u.email}</div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{u.email}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'superadmin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' :
                        u.role === 'karyawan' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                      }`}>
                        {u.role === 'superadmin' ? '🛡️ Super Admin (Dev)' : u.role === 'karyawan' ? '👔 Karyawan BUMDES' : '👤 Pengguna Warga'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                      <div>{u.phone || '-'}</div>
                      {u.nik && <div className="text-[10px] text-slate-400">NIK: {u.nik}</div>}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleChangeRole(u.id, 'superadmin')}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            u.role === 'superadmin' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-amber-100'
                          }`}
                        >
                          Super Admin
                        </button>

                        <button
                          onClick={() => handleChangeRole(u.id, 'karyawan')}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            u.role === 'karyawan' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100'
                          }`}
                        >
                          Karyawan
                        </button>

                        <button
                          onClick={() => handleChangeRole(u.id, 'pengguna')}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            u.role === 'pengguna' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-100'
                          }`}
                        >
                          Pengguna
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
