import React, { useState } from 'react';
import { 
  LayoutDashboard, Ticket, Wallet, MapPin, Users, Clock, Palmtree, 
  Search, ChevronDown, ChevronRight, Plus, Printer, FileText, 
  CheckCircle2, XCircle, AlertCircle, Scale, Building2, Truck, ArrowUpRight, 
  ArrowDownLeft, UserCheck, Shield, Send, DollarSign, Calendar, Map, Eye, Menu, X, Receipt
} from 'lucide-react';
import { User, Transaction } from '../../types';
import { generateTransactionPDF } from '../../utils/pdfGenerator';
import { showToast } from '../ToastNotification';
import WasteRouteMap from '../WasteRouteMap';
import ReservationManager from '../admin/ReservationManager';
import BillingModule from '../admin/BillingModule';

interface KaryawanViewProps {
  currentUser: User;
  token: string;
}

type MenuKey = 'dashboard' | 'reservasi' | 'billing' | 'tiket' | 'dompet' | 'peta' | 'karyawan' | 'absensi' | 'cuti';

export default function KaryawanView({ currentUser, token }: KaryawanViewProps) {
  const [activeMenu, setActiveMenu] = useState<MenuKey>('dashboard');
  const [isOperasionalOpen, setIsOperasionalOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState<'ID' | 'EN' | 'ZH'>('ID');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // --- 1. STATE: TIKET (PENGADUAN & OPERASIONAL) ---
  const [tickets, setTickets] = useState([
    { id: 'TKT-1001', warga: 'Budi Santoso', rt: 'RT 02/RW 01', judul: 'Sampah Daur Ulang Lumayan Banyak Belum Diangkut', kategori: 'Sampah', prioritas: 'Tinggi', status: 'DIPROSES', tanggal: '2026-07-21 08:30' },
    { id: 'TKT-1002', warga: 'Siti Aminah', rt: 'RT 03/RW 01', judul: 'Pertanyaan Jadwal Sewa Tenda Pernikahan', kategori: 'Sewa Gedung', prioritas: 'Sedang', status: 'SELESAI', tanggal: '2026-07-20 14:15' },
    { id: 'TKT-1003', warga: 'Rahmat Hidayat', rt: 'RT 05/RW 02', judul: 'Armada Roda 3 Mogok di Gang Sempit', kategori: 'Armada', prioritas: 'Tinggi', status: 'OPEN', tanggal: '2026-07-21 10:05' },
    { id: 'TKT-1004', warga: 'Dewi Kartika', rt: 'RT 01/RW 01', judul: 'Koreksi Saldo Setoran Botol Plastik', kategori: 'Teller', prioritas: 'Rendah', status: 'DIPROSES', tanggal: '2026-07-21 11:20' },
  ]);
  const [newTicketForm, setNewTicketForm] = useState({ warga: '', rt: 'RT 01/RW 01', judul: '', kategori: 'Sampah', prioritas: 'Sedang' });

  // --- 2. STATE: DOMPET & TELLER TRANSACTIONS ---
  const [nasabahName, setNasabahName] = useState('Siti Aminah (RT 03/RW 01)');
  const [kategoriSampah, setKategoriSampah] = useState('Botol Plastik PET (Bersih)');
  const [beratKg, setBeratKg] = useState('12');
  const [hargaPerKg, setHargaPerKg] = useState('5000');
  const [jenisTx, setJenisTx] = useState<'Masuk' | 'Keluar'>('Masuk');
  const [tarikTunaiAmount, setTarikTunaiAmount] = useState('50000');
  const [todayTransactions, setTodayTransactions] = useState<Transaction[]>([
    {
      id: 'TX-KRY-101',
      tanggal: '2026-07-21',
      jenis: 'Masuk',
      kategori: 'Botol Plastik PET (Bersih)',
      berat: 12,
      hargaPerKg: 5000,
      total: 60000,
      petugas: currentUser.name || 'ANDI FAJAR'
    },
    {
      id: 'TX-KRY-102',
      tanggal: '2026-07-21',
      jenis: 'Masuk',
      kategori: 'Koran & Karton Dus',
      berat: 25,
      hargaPerKg: 3500,
      total: 87500,
      petugas: currentUser.name || 'ANDI FAJAR'
    },
    {
      id: 'TX-KRY-103',
      tanggal: '2026-07-21',
      jenis: 'Keluar',
      kategori: 'Penarikan Saldo Kas Mandiri Warga',
      berat: 0,
      hargaPerKg: 0,
      total: -50000,
      petugas: currentUser.name || 'ANDI FAJAR'
    }
  ]);

  // --- 3. STATE: PETA & FLEET TRACKING ---
  const [selectedPin, setSelectedPin] = useState<string | null>('ARM-01');
  const fleetLocations = [
    { id: 'ARM-01', supir: 'Pak Joko (Truck 01)', rt: 'RT 01 & RT 02 / RW 01', lat: '-7.4123', lng: '109.2341', status: 'Bergerak (25 km/j)', muatan: '1.2 Ton', bateraiGps: '94%' },
    { id: 'ARM-02', supir: 'Pak Slamet (Truck 02)', rt: 'RT 03 & RT 04 / RW 02', lat: '-7.4150', lng: '109.2388', status: 'Berhenti (TPS BUMDES)', muatan: '1.8 Ton', bateraiGps: '88%' },
    { id: 'ARM-03', supir: 'Pak Herman (Motor Roda 3)', rt: 'RT 05 (Lini Sempit)', lat: '-7.4182', lng: '109.2312', status: 'Standby / Service', muatan: '0.4 Ton', bateraiGps: '100%' },
  ];

  // --- 4. STATE: KARYAWAN DIRECTORY ---
  const employees = [
    { nik: 'KRY-001', nama: currentUser.name || 'ANDI FAJAR', jabatan: 'Sales & Field Representative', divisi: 'Operasional Layanan', noHp: '0812-3456-7890', status: 'Aktif' },
    { nik: 'KRY-002', nama: 'Slamet Rahardjo', jabatan: 'Head Teller & Kasir', divisi: 'Keuangan & Bank Sampah', noHp: '0813-9876-5432', status: 'Aktif' },
    { nik: 'KRY-003', nama: 'Joko Susilo', jabatan: 'Driver Armada Truk RT 01-02', divisi: 'Logistik & Kebersihan', noHp: '0857-1122-3344', status: 'On Duty' },
    { nik: 'KRY-004', nama: 'Hartini Wati', jabatan: 'Staff Verifikator Sewa Gedung', divisi: 'Aset & Gedung', noHp: '0821-4455-6677', status: 'Aktif' },
  ];

  // --- 5. STATE: ABSENSI (PRESENSI) ---
  const [absensiLogs, setAbsensiLogs] = useState([
    { tanggal: '2026-07-21', jamMasuk: '07:45:12 WIB', jamKeluar: '--:--:--', status: 'HADIR (Tepat Waktu)', lokasi: 'Kantor BUMDES Desa Waru (GPS Matches)' },
    { tanggal: '2026-07-20', jamMasuk: '07:50:00 WIB', jamKeluar: '17:02:10 WIB', status: 'HADIR', lokasi: 'TPS & Bank Sampah Waru' },
    { tanggal: '2026-07-19', jamMasuk: '08:05:30 WIB', jamKeluar: '17:00:00 WIB', status: 'HADIR (Terlambat 5m)', lokasi: 'Kantor BUMDES' },
  ]);
  const [isCheckedIn, setIsCheckedIn] = useState(true);

  // --- 6. STATE: CUTI & IZIN ---
  const [cutiList, setCutiList] = useState([
    { id: 'CUTI-04', jenis: 'Cuti Tahunan', mulai: '12 Agustus 2026', selesai: '14 Agustus 2026', durasi: '3 Hari', alasan: 'Acara Keluarga di Luar Kota', status: 'DISETUJUI' },
    { id: 'CUTI-02', jenis: 'Izin Sakit', mulai: '05 Juni 2026', selesai: '05 Juni 2026', durasi: '1 Hari', alasan: 'Demam & Berobat Dokter', status: 'SELESAI' }
  ]);
  const [sisaCutiTahunan] = useState(9);
  const [cutiForm, setCutiForm] = useState({ jenis: 'Cuti Tahunan', mulai: '', selesai: '', alasan: '' });

  // Handlers
  const handleProcessTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const beratNum = parseFloat(beratKg) || 0;
    const hargaNum = parseFloat(hargaPerKg) || 0;
    const totalCalc = jenisTx === 'Masuk' ? (beratNum * hargaNum) : -Math.abs(parseFloat(tarikTunaiAmount) || 0);

    const newTxItem: Transaction = {
      id: 'TX-KRY-' + Math.floor(100 + Math.random() * 900),
      tanggal: new Date().toISOString().split('T')[0],
      jenis: jenisTx,
      kategori: jenisTx === 'Masuk' ? kategoriSampah : 'Penarikan Tunai Kas Warga',
      berat: jenisTx === 'Masuk' ? beratNum : 0,
      hargaPerKg: jenisTx === 'Masuk' ? hargaNum : 0,
      total: totalCalc,
      petugas: currentUser.name || 'ANDI FAJAR'
    };

    setTodayTransactions([newTxItem, ...todayTransactions]);
    showToast(`Transaksi ${jenisTx === 'Masuk' ? 'Setoran' : 'Pencairan'} untuk ${nasabahName} berhasil diproses!`, 'success');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.warga || !newTicketForm.judul) {
      showToast('Mohon lengkapi nama warga dan judul tiket pengaduan.', 'warning');
      return;
    }
    const newT = {
      id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
      warga: newTicketForm.warga,
      rt: newTicketForm.rt,
      judul: newTicketForm.judul,
      kategori: newTicketForm.kategori,
      prioritas: newTicketForm.prioritas,
      status: 'OPEN',
      tanggal: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setTickets([newT, ...tickets]);
    setNewTicketForm({ warga: '', rt: 'RT 01/RW 01', judul: '', kategori: 'Sampah', prioritas: 'Sedang' });
    showToast(`Tiket ${newT.id} berhasil diterbitkan dan masuk antrean tim operasional!`, 'success');
  };

  const handleCheckInToggle = () => {
    if (!isCheckedIn) {
      const nowStr = new Date().toLocaleTimeString('id-ID') + ' WIB';
      setAbsensiLogs([
        { tanggal: new Date().toISOString().split('T')[0], jamMasuk: nowStr, jamKeluar: '--:--:--', status: 'HADIR (GPS Valid)', lokasi: 'Kantor BUMDES Desa Waru' },
        ...absensiLogs
      ]);
      setIsCheckedIn(true);
      showToast('Absensi Masuk Berhasil dicatat dengan verifikasi koordinat GPS!', 'success');
    } else {
      setIsCheckedIn(false);
      showToast('Absensi Pulang/Keluar Berhasil dicatat. Selamat beristirahat!', 'info');
    }
  };

  const handleApplyCuti = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cutiForm.mulai || !cutiForm.alasan) {
      showToast('Mohon lengkapi tanggal dan alasan pengajuan cuti.', 'warning');
      return;
    }
    const newCuti = {
      id: 'CUTI-0' + (cutiList.length + 1),
      jenis: cutiForm.jenis,
      mulai: cutiForm.mulai,
      selesai: cutiForm.selesai || cutiForm.mulai,
      durasi: '2 Hari',
      alasan: cutiForm.alasan,
      status: 'MENUNGGU'
    };
    setCutiList([newCuti, ...cutiList]);
    setCutiForm({ jenis: 'Cuti Tahunan', mulai: '', selesai: '', alasan: '' });
    showToast('Permohonan cuti berhasil dikirim ke Kepala BUMDES untuk persetujuan.', 'success');
  };

  const menuItemsList = [
    { key: 'dashboard' as MenuKey, label: 'Dashboard', icon: LayoutDashboard },
    { key: 'reservasi' as MenuKey, label: 'Reservasi GOR', icon: Building2 },
    { key: 'billing' as MenuKey, label: 'Tagihan & Kasir', icon: Receipt },
    { key: 'tiket' as MenuKey, label: 'Tiket', icon: Ticket, badge: tickets.filter(t => t.status !== 'SELESAI').length },
    { key: 'dompet' as MenuKey, label: 'Dompet', icon: Wallet },
    { key: 'peta' as MenuKey, label: 'Peta', icon: MapPin },
    { key: 'karyawan' as MenuKey, label: 'Karyawan', icon: Users },
    { key: 'absensi' as MenuKey, label: 'Absensi', icon: Clock },
    { key: 'cuti' as MenuKey, label: 'Cuti', icon: Palmtree, badge: cutiList.filter(c => c.status === 'MENUNGGU').length },
  ];

  const filteredMenuItems = menuItemsList.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalKasMasuk = todayTransactions.filter(t => t.total > 0).reduce((acc, t) => acc + t.total, 0);

  return (
    <div className="min-h-screen bg-[#07131e] text-slate-100 font-sans flex flex-col md:flex-row rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#091726] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-black text-lg">◈</span>
          <span className="font-extrabold text-sm tracking-wider text-white">JARA AI NMS</span>
        </div>
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ================= SIDEBAR NAVIGATION (Matching Screenshot EXACTLY) ================= */}
      <aside className={`w-full md:w-64 bg-[#081523] border-r border-slate-800/80 flex flex-col justify-between shrink-0 transition-all ${
        isMobileSidebarOpen ? 'block' : 'hidden md:flex'
      }`}>
        <div className="p-4 space-y-5">
          
          {/* Brand Header */}
          <div className="flex items-center gap-2 px-2 pt-1">
            <span className="text-cyan-400 font-black text-xl">◈</span>
            <span className="font-extrabold text-base tracking-widest text-white uppercase font-mono">
              JARA AI NMS
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-cyan-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari menu... (mis. paja"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1e30] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
            />
          </div>

          {/* OPERASIONAL Accordion Section Header */}
          <div className="space-y-1">
            <button
              onClick={() => setIsOperasionalOpen(!isOperasionalOpen)}
              className="w-full flex items-center justify-between px-2 py-2 text-slate-400 hover:text-white transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-sm">🤝</span>
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-emerald-400/90 group-hover:text-emerald-300">
                  OPERASIONAL
                </span>
                <span className="px-1.5 py-0.2 bg-slate-800 text-cyan-400 rounded text-[10px] font-mono font-bold">
                  7
                </span>
              </div>
              {isOperasionalOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* Menu List */}
            {isOperasionalOpen && (
              <div className="pl-3 border-l border-cyan-900/40 space-y-1 pt-1 ml-3">
                {filteredMenuItems.map(item => {
                  const IconComp = item.icon;
                  const isActive = activeMenu === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveMenu(item.key);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-cyan-950/60 text-cyan-300 font-bold border-l-2 border-cyan-400 shadow-sm'
                          : 'text-slate-400 hover:bg-[#0c1a29] hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-[10px] font-mono font-bold">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Footer: Language Selector & User Profile */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#07121d]">
          {/* Language Selector Buttons */}
          <div className="flex items-center gap-1.5 justify-start">
            {(['ID', 'EN', 'ZH'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  lang === l
                    ? 'border border-cyan-500 text-cyan-300 bg-cyan-950/50'
                    : 'border border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* User Profile Badge (ANDI FAJAR - sales / Karyawan) */}
          <div className="flex items-center gap-3 pt-1">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shrink-0 border border-emerald-400 shadow-sm">
              {(currentUser.name || 'ANDI FAJAR').charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-extrabold text-white font-mono uppercase tracking-wide truncate">
                {currentUser.name || 'ANDI FAJAR'}
              </div>
              <div className="text-[11px] font-mono text-cyan-400/80 truncate">
                {currentUser.role || 'sales'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 bg-[#091726] p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 text-left">
        
        {/* Top Header Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <span>JARA AI NMS</span>
              <span>/</span>
              <span>OPERASIONAL</span>
              <span>/</span>
              <span className="text-white font-bold">{activeMenu.toUpperCase()}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeMenu === 'dashboard' && '📊 Overview Operasional & Performa BUMDES'}
              {activeMenu === 'reservasi' && '🏸 Kelola Reservasi GOR Badminton & Gedung'}
              {activeMenu === 'billing' && '🧾 Kasir Tagihan, Invoice & E-Kuitansi'}
              {activeMenu === 'tiket' && '🚩 Sistem Tiket Pengaduan & Trouble Tickets'}
              {activeMenu === 'dompet' && '💰 Kas Teller Bank Sampah & E-Wallet BUMDES'}
              {activeMenu === 'peta' && '🗺️ Peta Jalur Armada Truk & Coverage Pelanggan'}
              {activeMenu === 'karyawan' && '🪪 Direktori Staff & Karyawan Operasional'}
              {activeMenu === 'absensi' && '🕒 Sistem Presensi & Live Clock-In Karyawan'}
              {activeMenu === 'cuti' && '🌴 Manajemen Pengajuan Cuti & Permohonan Izin'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-[#0d2135] border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Server Online & Synced</span>
            </div>
          </div>
        </div>

        {/* ================= RESERVASI GOR & GEDUNG ================= */}
        {activeMenu === 'reservasi' && (
          <ReservationManager
            token={token}
            currentUserRole={currentUser.role}
            currentUserName={currentUser.name}
          />
        )}

        {/* ================= TAGIHAN & KASIR LOKET ================= */}
        {activeMenu === 'billing' && (
          <BillingModule onShowToast={showToast} />
        )}

        {/* ================= 1. MENU: DASHBOARD ================= */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0b1c2e] p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span>Tiket Open</span>
                  <Ticket className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-300 font-mono">
                  {tickets.filter(t => t.status === 'OPEN' || t.status === 'DIPROSES').length} Tiket
                </div>
                <div className="text-[11px] text-slate-400">Memerlukan tindakan tim</div>
              </div>

              <div className="bg-[#0b1c2e] p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span>Kas Teller Masuk Hari Ini</span>
                  <Wallet className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-300 font-mono">
                  +Rp {totalKasMasuk.toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-slate-400">{todayTransactions.length} transaksi diproses</div>
              </div>

              <div className="bg-[#0b1c2e] p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span>Armada Truk RT Operating</span>
                  <Truck className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-cyan-300 font-mono">
                  3 / 3 Unit
                </div>
                <div className="text-[11px] text-slate-400">100% armada aktif di lapangan</div>
              </div>

              <div className="bg-[#0b1c2e] p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span>Status Presensi Saya</span>
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl font-black text-purple-300 font-mono">
                  {isCheckedIn ? 'HADIR (Active)' : 'BELUM ABSEN'}
                </div>
                <div className="text-[11px] text-slate-400">Verifikasi koordinat GPS</div>
              </div>
            </div>

            {/* Live Operational Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Tickets Widget */}
              <div className="bg-[#0b1c2e] p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-cyan-400" />
                    Tiket Pengaduan Terbaru
                  </h3>
                  <button onClick={() => setActiveMenu('tiket')} className="text-xs text-cyan-400 hover:underline cursor-pointer">Lihat Semua →</button>
                </div>
                <div className="space-y-2">
                  {tickets.slice(0, 3).map(t => (
                    <div key={t.id} className="p-3 bg-[#0f243a] rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-white font-mono">{t.id} - {t.warga}</div>
                        <div className="text-slate-400 text-[11px]">{t.judul}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono shrink-0 ${
                        t.status === 'OPEN' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        t.status === 'DIPROSES' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teller Today Transactions Widget */}
              <div className="bg-[#0b1c2e] p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    Transaksi Teller Terakhir
                  </h3>
                  <button onClick={() => setActiveMenu('dompet')} className="text-xs text-cyan-400 hover:underline cursor-pointer">Ke Loket Teller →</button>
                </div>
                <div className="space-y-2">
                  {todayTransactions.slice(0, 3).map(tx => (
                    <div key={tx.id} className="p-3 bg-[#0f243a] rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
                      <div>
                        <div className="font-bold text-slate-200">{tx.kategori}</div>
                        <div className="text-[10px] text-slate-400">{tx.id} | {tx.tanggal}</div>
                      </div>
                      <div className={`font-bold ${tx.total >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {tx.total >= 0 ? `+Rp ${tx.total.toLocaleString('id-ID')}` : `-Rp ${Math.abs(tx.total).toLocaleString('id-ID')}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. MENU: TIKET ================= */}
        {activeMenu === 'tiket' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket Creation Form */}
            <div className="lg:col-span-1 bg-[#0b1c2e] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Buat Tiket Pengaduan Baru
              </h3>
              <form onSubmit={handleCreateTicket} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Nama Pelapor / Warga</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bpk. Budi Santoso"
                    value={newTicketForm.warga}
                    onChange={(e) => setNewTicketForm({...newTicketForm, warga: e.target.value})}
                    className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Wilayah RT/RW</label>
                    <select
                      value={newTicketForm.rt}
                      onChange={(e) => setNewTicketForm({...newTicketForm, rt: e.target.value})}
                      className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="RT 01/RW 01">RT 01/RW 01</option>
                      <option value="RT 02/RW 01">RT 02/RW 01</option>
                      <option value="RT 03/RW 01">RT 03/RW 01</option>
                      <option value="RT 04/RW 02">RT 04/RW 02</option>
                      <option value="RT 05/RW 02">RT 05/RW 02</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Prioritas</label>
                    <select
                      value={newTicketForm.prioritas}
                      onChange={(e) => setNewTicketForm({...newTicketForm, prioritas: e.target.value})}
                      className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="Rendah">Rendah</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Tinggi">Tinggi</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Kategori Kendala</label>
                  <select
                    value={newTicketForm.kategori}
                    onChange={(e) => setNewTicketForm({...newTicketForm, kategori: e.target.value})}
                    className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="Sampah">Sampah & Penjemputan Truk</option>
                    <option value="Sewa Gedung">Izin Sewa Gedung Serbaguna</option>
                    <option value="Teller">Rekening Bank Sampah / Saldo</option>
                    <option value="Armada">Kendaraan Operational Breakdown</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Rincian Pengaduan / Masalah</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Deskripsikan detail kendala..."
                    value={newTicketForm.judul}
                    onChange={(e) => setNewTicketForm({...newTicketForm, judul: e.target.value})}
                    className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                >
                  Terbitkan Tiket Pengaduan
                </button>
              </form>
            </div>

            {/* Tickets Table */}
            <div className="lg:col-span-2 bg-[#0b1c2e] p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-cyan-400" />
                  Daftar Trouble Tickets Operasional ({tickets.length})
                </h3>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f243a] text-slate-400 font-mono font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">ID & Waktu</th>
                      <th className="p-3">Pelapor & Wilayah</th>
                      <th className="p-3">Pengaduan</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {tickets.map(t => (
                      <tr key={t.id} className="hover:bg-[#0f243a]/50">
                        <td className="p-3 font-mono">
                          <div className="font-bold text-cyan-300">{t.id}</div>
                          <div className="text-[10px] text-slate-500">{t.tanggal}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-white">{t.warga}</div>
                          <div className="text-[10px] text-slate-400">{t.rt}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-slate-200">{t.judul}</div>
                          <span className="text-[10px] text-slate-400 font-mono">Kategori: {t.kategori}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            t.status === 'OPEN' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            t.status === 'DIPROSES' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. MENU: DOMPET ================= */}
        {activeMenu === 'dompet' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Teller Form */}
            <div className="lg:col-span-1 bg-[#0b1c2e] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Loket Penimbangan & Pencairan Saldo
              </h3>

              <div className="flex bg-[#0f243a] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setJenisTx('Masuk')}
                  className={`w-1/2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    jenisTx === 'Masuk' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'
                  }`}
                >
                  Setor Sampah (+Saldo)
                </button>
                <button
                  type="button"
                  onClick={() => setJenisTx('Keluar')}
                  className={`w-1/2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    jenisTx === 'Keluar' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400'
                  }`}
                >
                  Tarik Tunai (-Saldo)
                </button>
              </div>

              <form onSubmit={handleProcessTransaction} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">ID Nasabah / Nama Warga</label>
                  <input
                    type="text"
                    required
                    value={nasabahName}
                    onChange={(e) => setNasabahName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                {jenisTx === 'Masuk' ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-300">Kategori Sampah</label>
                      <select
                        value={kategoriSampah}
                        onChange={(e) => setKategoriSampah(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white"
                      >
                        <option value="Botol Plastik PET (Bersih)">Botol Plastik PET (Bersih) - Rp 5.000/Kg</option>
                        <option value="Koran Bekas & Karton Dus">Koran Bekas & Karton Dus - Rp 3.500/Kg</option>
                        <option value="Kaleng Aluminium & Besi">Kaleng Aluminium & Besi - Rp 15.000/Kg</option>
                        <option value="Minyak Jelantah Dapur">Minyak Jelantah Dapur - Rp 7.000/Kg</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-300">Berat (Kg)</label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={beratKg}
                          onChange={(e) => setBeratKg(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white font-mono font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-300">Harga / Kg (Rp)</label>
                        <input
                          type="number"
                          value={hargaPerKg}
                          onChange={(e) => setHargaPerKg(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800 text-emerald-300 text-xs flex justify-between items-center font-mono font-bold">
                      <span>Total Saldo Masuk:</span>
                      <span>Rp {((parseFloat(beratKg) || 0) * (parseFloat(hargaPerKg) || 0)).toLocaleString('id-ID')}</span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Nominal Penarikan Tunai (Rp)</label>
                    <input
                      type="number"
                      value={tarikTunaiAmount}
                      onChange={(e) => setTarikTunaiAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white font-mono font-bold"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                >
                  Simpan & Terbitkan Struk Kas
                </button>
              </form>
            </div>

            {/* Transactions Table & Print */}
            <div className="lg:col-span-2 bg-[#0b1c2e] p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  Mutasi Dompet Kas BUMDES ({todayTransactions.length})
                </h3>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f243a] text-slate-400 font-mono font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">ID & Tanggal</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Berat</th>
                      <th className="p-3">Total Saldo</th>
                      <th className="p-3">Cetak Struk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {todayTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-[#0f243a]/50">
                        <td className="p-3 font-mono">
                          <div className="font-bold text-cyan-300">{tx.id}</div>
                          <div className="text-[10px] text-slate-500">{tx.tanggal}</div>
                        </td>
                        <td className="p-3 font-medium text-slate-200">{tx.kategori}</td>
                        <td className="p-3 font-mono">{tx.berat > 0 ? `${tx.berat} Kg` : 'Tarik Tunai'}</td>
                        <td className={`p-3 font-mono font-bold ${tx.total >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.total >= 0 ? `+Rp ${tx.total.toLocaleString('id-ID')}` : `-Rp ${Math.abs(tx.total).toLocaleString('id-ID')}`}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => generateTransactionPDF(tx, nasabahName)}
                            className="px-2.5 py-1 bg-[#0f243a] hover:bg-cyan-950 text-cyan-300 border border-slate-700 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Printer className="w-3 h-3" />
                            <span>PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. MENU: PETA ================= */}
        {activeMenu === 'peta' && (
          <WasteRouteMap />
        )}

        {/* ================= 5. MENU: KARYAWAN ================= */}
        {activeMenu === 'karyawan' && (
          <div className="bg-[#0b1c2e] p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Direktori Staff & Karyawan Operasional BUMDES
                </h3>
                <p className="text-xs text-slate-400">
                  Daftar anggota tim, NIK internal, divisi kerja, dan kontak darurat karyawan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.map(emp => (
                <div key={emp.nik} className="p-5 bg-[#0f243a] rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-cyan-400">{emp.nik}</span>
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-mono font-bold">
                      {emp.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white">{emp.nama}</h4>
                    <p className="text-xs text-cyan-300 font-medium">{emp.jabatan}</p>
                    <p className="text-xs text-slate-400">Divisi: {emp.divisi}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
                    <span>No. WhatsApp: {emp.noHp}</span>
                    <a href={`https://wa.me/${emp.noHp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-bold">
                      Hubungi →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 6. MENU: ABSENSI ================= */}
        {activeMenu === 'absensi' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-[#0b1c2e] p-6 rounded-2xl border border-slate-800 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white">Presensi Harian Karyawan</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Verifikasi lokasi kantor via GPS Geolocation & Waktu Server
                </p>
              </div>

              <div className="p-4 bg-[#0f243a] rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                <div className="text-slate-400">Status Saat Ini:</div>
                <div className={`text-base font-bold ${isCheckedIn ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isCheckedIn ? '● SUDAH ABSEN MASUK' : '○ BELUM ABSEN'}
                </div>
                <div className="text-[10px] text-slate-500">Koordinat Kantor Waru: -7.4123, 109.2341 (Valid)</div>
              </div>

              <button
                onClick={handleCheckInToggle}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-lg ${
                  isCheckedIn
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isCheckedIn ? 'Check-Out / Absen Pulang' : 'Check-In / Absen Masuk GPS'}
              </button>
            </div>

            <div className="lg:col-span-2 bg-[#0b1c2e] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Riwayat Log Presensi Saya ({absensiLogs.length} Rekam)
              </h3>

              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f243a] text-slate-400 font-mono font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Jam Masuk</th>
                      <th className="p-3">Jam Keluar</th>
                      <th className="p-3">Status & Lokasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {absensiLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-[#0f243a]/50">
                        <td className="p-3 font-mono font-bold text-white">{log.tanggal}</td>
                        <td className="p-3 font-mono text-emerald-400">{log.jamMasuk}</td>
                        <td className="p-3 font-mono text-slate-400">{log.jamKeluar}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-mono font-bold">
                            {log.status}
                          </span>
                          <div className="text-[10px] text-slate-500 truncate max-w-xs">{log.lokasi}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. MENU: CUTI ================= */}
        {activeMenu === 'cuti' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-[#0b1c2e] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palmtree className="w-4 h-4 text-amber-400" />
                Form Pengajuan Cuti / Izin
              </h3>

              <div className="p-3 bg-[#0f243a] rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Sisa Kuota Cuti Tahunan:</span>
                <span className="text-amber-300 font-bold text-sm">{sisaCutiTahunan} Hari</span>
              </div>

              <form onSubmit={handleApplyCuti} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Jenis Permohonan</label>
                  <select
                    value={cutiForm.jenis}
                    onChange={(e) => setCutiForm({...cutiForm, jenis: e.target.value})}
                    className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="Cuti Tahunan">Cuti Tahunan</option>
                    <option value="Izin Sakit">Izin Sakit</option>
                    <option value="Cuti Melahirkan/Alasan Penting">Cuti Melahirkan / Alasan Penting</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Mulai Tanggal</label>
                    <input
                      type="date"
                      required
                      value={cutiForm.mulai}
                      onChange={(e) => setCutiForm({...cutiForm, mulai: e.target.value})}
                      className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Sampai Tanggal</label>
                    <input
                      type="date"
                      value={cutiForm.selesai}
                      onChange={(e) => setCutiForm({...cutiForm, selesai: e.target.value})}
                      className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Alasan Permohonan</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tuliskan keperluan pengajuan cuti..."
                    value={cutiForm.alasan}
                    onChange={(e) => setCutiForm({...cutiForm, alasan: e.target.value})}
                    className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                >
                  Kirim Pengajuan Cuti
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-[#0b1c2e] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palmtree className="w-4 h-4 text-amber-400" />
                Riwayat Pengajuan Cuti Saya ({cutiList.length})
              </h3>

              <div className="space-y-3">
                {cutiList.map(c => (
                  <div key={c.id} className="p-4 bg-[#0f243a] rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">{c.id}</span>
                        <span className="font-bold text-white">{c.jenis}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({c.durasi})</span>
                      </div>
                      <div className="text-slate-300 mt-1">Mulai: <strong className="text-amber-300 font-mono">{c.mulai}</strong> s/d <strong className="text-amber-300 font-mono">{c.selesai}</strong></div>
                      <div className="text-slate-400 text-[11px] mt-0.5">Alasan: {c.alasan}</div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono shrink-0 self-start sm:self-center ${
                      c.status === 'DISETUJUI' || c.status === 'SELESAI' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      c.status === 'MENUNGGU' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}

