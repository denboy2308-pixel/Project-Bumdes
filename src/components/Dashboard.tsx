import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { 
  Upload, Trash2, FileText, Download, LogOut, File, Image, CheckCircle, 
  AlertCircle, Plus, Sparkles, HardDrive, UserCheck, Printer, Search, Filter, Coins, Calendar, Info, X, Radio, BellRing, ChevronRight,
  Shield, User, Users
} from 'lucide-react';
import { UploadedFile, User as UserType, Transaction, AppNotification, UserRole } from '../types';
import { generateTransactionPDF } from '../utils/pdfGenerator';
import { showToast } from './ToastNotification';
import NotificationCenter from './NotificationCenter';
const SuperAdminView = lazy(() => import('./role-views/SuperAdminView'));
const KaryawanView = lazy(() => import('./role-views/KaryawanView'));
const PenggunaView = lazy(() => import('./role-views/PenggunaView'));

interface DashboardProps {
  currentUser: UserType;
  onLogout: () => void;
  token: string;
}

export default function Dashboard({ currentUser, onLogout, token }: DashboardProps) {
  const activeRole: UserRole = currentUser.role || 'pengguna';

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Bank Sampah Transaction History state
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TX-001',
      tanggal: '2026-07-15',
      jenis: 'Masuk',
      kategori: 'Botol Plastik PET (Bersih)',
      berat: 8,
      hargaPerKg: 5000,
      total: 40000,
      petugas: 'Slamet Rahardjo'
    },
    {
      id: 'TX-002',
      tanggal: '2026-07-08',
      jenis: 'Masuk',
      kategori: 'Koran Bekas & Karton Tebal',
      berat: 15,
      hargaPerKg: 3000,
      total: 45000,
      petugas: 'Slamet Rahardjo'
    },
    {
      id: 'TX-003',
      tanggal: '2026-07-01',
      jenis: 'Keluar',
      kategori: 'Penarikan Tunai Kas Mandiri',
      berat: 0,
      hargaPerKg: 0,
      total: -30000,
      petugas: 'Hartini'
    },
    {
      id: 'TX-004',
      tanggal: '2026-06-20',
      jenis: 'Masuk',
      kategori: 'Kaleng Aluminium & Logam Besi',
      berat: 3,
      hargaPerKg: 15000,
      total: 45000,
      petugas: 'Slamet Rahardjo'
    },
    {
      id: 'TX-005',
      tanggal: '2026-05-18',
      jenis: 'Masuk',
      kategori: 'Plastik Campuran & Gelas Mineral',
      berat: 10,
      hargaPerKg: 2000,
      total: 20000,
      petugas: 'Hartini'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'Semua' | 'Masuk' | 'Keluar'>('Semua');

  // Interactive addition of simulation transactions
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTx, setNewTx] = useState({
    jenis: 'Masuk' as 'Masuk' | 'Keluar',
    kategori: 'Botol Plastik PET (Bersih)',
    berat: '5',
    hargaPerKg: '5000',
    totalManual: '15000', // for Keluar (Tarik Tunai)
    petugas: 'Slamet Rahardjo'
  });

  // Notifications State for Real-Time BUMDES Updates
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'NOTIF-001',
      type: 'saldo',
      title: 'Setoran Sampah Berhasil Ditimbang',
      message: 'Petugas Slamet Rahardjo telah memverifikasi setoran Botol Plastik PET (8 Kg). Saldo bertambah Rp 40.000.',
      timestamp: '10:30 WIB',
      read: false,
      amount: 40000,
      author: 'Slamet Rahardjo (Petugas Lapangan)'
    },
    {
      id: 'NOTIF-002',
      type: 'pengumuman',
      title: 'Jadwal Penimbangan Rutin Dusun Waru',
      message: 'Penimbangan sampah kering minggu ini dilaksanakan pada Sabtu pukul 08.00 WIB di Pos RW 02.',
      timestamp: 'Kemarin 14:15 WIB',
      read: false,
      author: 'Pengurus BUMDES Waskita Wijaya'
    },
    {
      id: 'NOTIF-003',
      type: 'saldo',
      title: 'Kredit Setoran Koran & Karton',
      message: 'Setoran Koran Bekas & Karton Tebal (15 Kg) telah dicatat ke dalam buku rekening tabungan digital Anda.',
      timestamp: '08 Jul 2026',
      read: true,
      amount: 45000,
      author: 'Hartini (Bendahara BUMDES)'
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifikasi Dibaca', 'Semua notifikasi telah ditandai sebagai telah dibaca.', 'info');
  };

  const handleClearAll = () => {
    setNotifications([]);
    showToast('Notifikasi Dibersihkan', 'Pusat notifikasi telah dikosongkan.', 'info');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSimulateNotification = (type: 'saldo' | 'pengumuman') => {
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    
    if (type === 'saldo') {
      const sampleCategories = [
        { name: 'Karton & Dus Gelombang', price: 3500, weight: 12 },
        { name: 'Botol Kaca Bening / Sirup', price: 1500, weight: 10 },
        { name: 'Kaleng Minuman Aluminium', price: 16000, weight: 2.5 },
        { name: 'Kertas HVS Bekas Kantor', price: 4000, weight: 8 }
      ];
      const selected = sampleCategories[Math.floor(Math.random() * sampleCategories.length)];
      const totalGain = selected.weight * selected.price;

      // 1. Add new transaction
      const newTransaction: Transaction = {
        id: `TX-${Math.floor(100 + Math.random() * 900)}`,
        tanggal: new Date().toISOString().split('T')[0],
        jenis: 'Masuk',
        kategori: selected.name,
        berat: selected.weight,
        hargaPerKg: selected.price,
        total: totalGain,
        petugas: 'Slamet Rahardjo (Sistem Otomatis)'
      };
      setTransactions(prev => [newTransaction, ...prev]);

      // 2. Add notification
      const newNotif: AppNotification = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        type: 'saldo',
        title: '⚡ Saldo Tabungan Masuk (Real-Time)',
        message: `Timbangan setoran ${selected.name} (${selected.weight} Kg) berhasil diverifikasi. Saldo bertambah Rp ${totalGain.toLocaleString('id-ID')}.`,
        timestamp: 'Baru saja (' + nowStr + ')',
        read: false,
        amount: totalGain,
        author: 'Petugas Bank Sampah BUMDES'
      };
      setNotifications(prev => [newNotif, ...prev]);

      // 3. Show Toast Alert
      showToast(
        '💰 Update Saldo Real-Time!', 
        `Setoran ${selected.name} (+Rp ${totalGain.toLocaleString('id-ID')}) telah masuk ke tabungan Anda.`, 
        'success'
      );
    } else {
      const sampleAnnouncements = [
        'Insentif Pemilahan Sampah Organik & Kering Tahap III Siap Dicairkan!',
        'Penyesuaian Harga Beli Kardus Kering & Kaleng Aluminium Per 1 Agustus 2026.',
        'Undangan Kerja Bakti Lingkungan & Sosialisasi Komposting Desa Waru.',
        'Layanan Pengambilan Sampah Rutin Ditingkatkan Menjadi 2x Seminggu.'
      ];
      const title = sampleAnnouncements[Math.floor(Math.random() * sampleAnnouncements.length)];

      const newNotif: AppNotification = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        type: 'pengumuman',
        title: `📢 ${title}`,
        message: 'Pengurus BUMDES Waskita Wijaya menerbitkan pengumuman resmi terbaru untuk seluruh nasabah warga desa.',
        timestamp: 'Baru saja (' + nowStr + ')',
        read: false,
        author: 'Sekretariat BUMDES Waskita Wijaya'
      };
      setNotifications(prev => [newNotif, ...prev]);

      showToast(
        '📢 Pengumuman Baru BUMDES!', 
        title, 
        'info'
      );
    }
  };

  // Optional: Background periodic real-time simulation trigger every 45s
  useEffect(() => {
    const timer = setInterval(() => {
      // 30% chance every 45s to receive a simulated live event if notifications count < 10
      if (Math.random() < 0.35) {
        const types: ('saldo' | 'pengumuman')[] = ['saldo', 'pengumuman'];
        const chosen = types[Math.floor(Math.random() * types.length)];
        handleSimulateNotification(chosen);
      }
    }, 45000);

    return () => clearInterval(timer);
  }, []);

  const saldoTabungan = transactions.reduce((acc, tx) => acc + tx.total, 0);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.kategori.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.petugas.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Semua' || tx.jenis === filterType;
    return matchesSearch && matchesType;
  });

  const handleDownloadPDF = () => {
    try {
      generateTransactionPDF(currentUser, filteredTransactions);
      showToast('Laporan Diunduh', 'Mutasi tabungan bank sampah berhasil diekspor ke PDF.', 'success');
    } catch (err: any) {
      setError(err.message || 'Gagal mengekspor berkas PDF.');
    }
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const beratNum = parseFloat(newTx.berat) || 0;
    const hargaNum = parseInt(newTx.hargaPerKg) || 0;
    const totalManualNum = parseInt(newTx.totalManual) || 0;

    const computedTotal = newTx.jenis === 'Masuk' 
      ? beratNum * hargaNum 
      : -totalManualNum;

    const transaction: Transaction = {
      id: `TX-${Math.floor(100 + Math.random() * 900)}`,
      tanggal: new Date().toISOString().split('T')[0],
      jenis: newTx.jenis,
      kategori: newTx.jenis === 'Masuk' ? newTx.kategori : 'Penarikan Tunai Mandiri',
      berat: newTx.jenis === 'Masuk' ? beratNum : 0,
      hargaPerKg: newTx.jenis === 'Masuk' ? hargaNum : 0,
      total: computedTotal,
      petugas: newTx.petugas
    };

    setTransactions([transaction, ...transactions]);
    setShowAddModal(false);
    
    // Push a real-time notification
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const notif: AppNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      type: 'saldo',
      title: newTx.jenis === 'Masuk' ? '⚡ Setoran Sampah Dicatat' : '💸 Penarikan Tunai Berhasil',
      message: newTx.jenis === 'Masuk' 
        ? `Transaksi setoran ${newTx.kategori} sebesar Rp ${computedTotal.toLocaleString('id-ID')} telah berhasil dibukukan.`
        : `Penarikan tunai saldo tabungan sebesar Rp ${totalManualNum.toLocaleString('id-ID')} telah diproses oleh ${newTx.petugas}.`,
      timestamp: 'Baru saja (' + nowStr + ')',
      read: false,
      amount: computedTotal,
      author: newTx.petugas
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(
      'Transaksi Berhasil', 
      `Berhasil mencatat transaksi ${newTx.jenis === 'Masuk' ? 'setor sampah' : 'tarik tunai'} sebesar Rp ${Math.abs(computedTotal).toLocaleString('id-ID')}.`, 
      'success'
    );
  };


  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user's uploaded files from backend on mount
  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Gagal memuat daftar berkas.');
      }
      const data = await response.json();
      setFiles(data);
    } catch (err: any) {
      setError(err.message || 'Koneksi ke server gagal.');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [token]);

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  // Handle Drag Leave
  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  // Upload file handler
  const uploadFile = async (file: File) => {
    if (!file) return;

    setError(null);
    setSuccessMsg(null);
    setIsUploading(true);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(40);
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      setUploadProgress(80);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengunggah berkas.');
      }

      setUploadProgress(100);
      setSuccessMsg(`Berkas "${file.name}" berhasil diunggah!`);
      
      // Refresh list
      fetchFiles();
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah berkas ke server.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  // Handle Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  // Handle manual input select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  // Trigger manual input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Delete file handler
  const handleDeleteFile = async (id: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus berkas "${name}"?`)) {
      return;
    }

    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(`/api/files/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghapus berkas.');
      }

      setSuccessMsg(`Berkas "${name}" berhasil dihapus.`);
      fetchFiles();
    } catch (err: any) {
      setError(err.message || 'Koneksi ke server gagal.');
    }
  };

  // Formatter helpers
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext || '')) {
      return <Image className="w-5 h-5 text-emerald-500" />;
    }
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div id="dashboard-view" className="py-8 bg-slate-50 dark:bg-slate-900 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Current Authenticated Role Badge */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Peran Akses Terkini:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 ${
              activeRole === 'superadmin' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
              activeRole === 'karyawan' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
              'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}>
              {activeRole === 'superadmin' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span>Super Admin (Pengembang Website)</span>
                </>
              ) : activeRole === 'karyawan' ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Karyawan BUMDES (Operasional)</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pengguna Warga (Nasabah/Penyewa)</span>
                </>
              )}
            </span>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Status: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Terotentikasi</span>
          </div>
        </div>

        {/* Header Bar with Logout & Notifications */}
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <UserCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-2">
                <span>Portal Desa Waru</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Sistem Online</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white truncate max-w-md">
                {currentUser.name || currentUser.email}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 w-full md:w-auto shrink-0 justify-end">
            <NotificationCenter 
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClearAll={handleClearAll}
              onDeleteNotification={handleDeleteNotification}
              onSimulateNotification={handleSimulateNotification}
            />

            <button
              id="dashboard-logout-btn"
              onClick={onLogout}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Real-Time Live Ticker / Alert Banner for Latest Unread Notification */}
        {notifications.some(n => !n.read) && (
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <BellRing className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Pemberitahuan
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {notifications.find(n => !n.read)?.timestamp}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">
                  {notifications.find(n => !n.read)?.title}: <span className="font-normal text-slate-400">{notifications.find(n => !n.read)?.message}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => {
                  const firstUnread = notifications.find(n => !n.read);
                  if (firstUnread) handleMarkAsRead(firstUnread.id);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors cursor-pointer border border-slate-700"
              >
                Tandai Dibaca
              </button>
            </div>
          </div>
        )}

        {/* Dynamic View Mount Based on activeRole */}
        <Suspense fallback={
          <div className="min-h-[400px] flex items-center justify-center p-12 bg-slate-900/40 rounded-3xl border border-slate-800">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-xs font-semibold">Memuat dashboard peran {activeRole}...</span>
            </div>
          </div>
        }>
          {activeRole === 'superadmin' && (
            <SuperAdminView 
              currentUser={{ ...currentUser, role: activeRole }} 
              token={token} 
            />
          )}

          {activeRole === 'karyawan' && (
            <KaryawanView 
              currentUser={{ ...currentUser, role: activeRole }} 
              token={token} 
            />
          )}

          {activeRole === 'pengguna' && (
            <PenggunaView 
              currentUser={{ ...currentUser, role: activeRole }} 
              token={token} 
            />
          )}
        </Suspense>

      </div>
    </div>
  );
}
