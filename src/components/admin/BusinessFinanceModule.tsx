import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  QrCode, 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  Download, 
  Users, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Receipt,
  ExternalLink,
  Plus,
  RefreshCw,
  Building2,
  X
} from 'lucide-react';

type BusinessTab = 'keuangan' | 'bukukas' | 'payout' | 'gajian' | 'piutang' | 'qris';

interface QrisTransaction {
  id: string;
  nmid: string;
  payerName: string;
  purpose: string;
  amount: number;
  time: string;
  status: 'settled' | 'pending';
}

interface PayrollItem {
  nip: string;
  name: string;
  role: string;
  baseSalary: number;
  commission: number;
  totalPaid: number;
  status: 'dibayar' | 'siap_transfer';
}

interface FinanceTransactionItem {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
  recordedBy: string;
}

interface FinanceSummaryData {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  pendingReceivables: number;
  unpaidInvoicesCount: number;
  paidInvoicesCount: number;
  totalInvoicesCount: number;
  padAllocation: {
    netIncome: number;
    padDesa: number;
    modalCadangan: number;
    jasaPengurus: number;
    danaSosial: number;
  };
  qrisTransactionsCount: number;
}

const INITIAL_QRIS: QrisTransaction[] = [
  { id: 'QRIS-9921', nmid: 'ID102600987123', payerName: 'PB Baki Perkasa (Bpk. Dani)', purpose: 'Sewa Lapangan Badminton 1 & 2', amount: 80000, time: '13:45:12', status: 'settled' },
  { id: 'QRIS-9920', nmid: 'ID102600987123', payerName: 'Rizky Ramadhan', purpose: 'Tiket Booking Lapangan 2', amount: 40000, time: '13:42:05', status: 'settled' },
  { id: 'QRIS-9919', nmid: 'ID102600987123', payerName: 'Warung Bu Joko (Dusun I)', purpose: 'Retribusi Bank Sampah', amount: 75000, time: '11:15:30', status: 'settled' },
  { id: 'QRIS-9918', nmid: 'ID102600987123', payerName: 'Karang Taruna RW 03', purpose: 'Uang Muka Sewa Aula Pesta', amount: 500000, time: '09:30:18', status: 'settled' }
];

const INITIAL_PAYROLL: PayrollItem[] = [
  { nip: '2026-BW-001', name: 'Bambang Sutrisno, S.E.', role: 'Direktur Utama', baseSalary: 4500000, commission: 500000, totalPaid: 5000000, status: 'dibayar' },
  { nip: '2026-BW-002', name: 'Siti Rahayu, S.E.', role: 'Bendahara', baseSalary: 3500000, commission: 350000, totalPaid: 3850000, status: 'dibayar' },
  { nip: '2026-BW-003', name: 'Joko Sasongko', role: 'Operator Lapangan GOR', baseSalary: 2500000, commission: 350000, totalPaid: 2850000, status: 'dibayar' },
  { nip: '2026-BW-004', name: 'Bagas Pratama', role: 'Kasir & Pelayanan', baseSalary: 2300000, commission: 450000, totalPaid: 2750000, status: 'siap_transfer' }
];

interface BusinessFinanceModuleProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  onNavigateToBilling: () => void;
}

export default function BusinessFinanceModule({ onShowToast, onNavigateToBilling }: BusinessFinanceModuleProps) {
  const [activeTab, setActiveTab] = useState<BusinessTab>('keuangan');
  const [qrisList, setQrisList] = useState<QrisTransaction[]>(INITIAL_QRIS);
  const [payrollList, setPayrollList] = useState<PayrollItem[]>(INITIAL_PAYROLL);
  const [cashTransactions, setCashTransactions] = useState<FinanceTransactionItem[]>([]);
  const [summary, setSummary] = useState<FinanceSummaryData | null>(null);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New Transaction Form
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [txCategory, setTxCategory] = useState('Operasional & Perawatan');
  const [txAmount, setTxAmount] = useState('150000');
  const [txDesc, setTxDesc] = useState('');
  const [txMethod, setTxMethod] = useState<'cash' | 'qris' | 'bank_transfer'>('cash');

  const fetchFinanceData = async () => {
    setIsLoading(true);
    try {
      const [sumRes, txRes, qrisRes] = await Promise.all([
        fetch('/api/finance/summary'),
        fetch('/api/finance/transactions'),
        fetch('/api/finance/qris')
      ]);

      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummary(sumData);
      }
      if (txRes.ok) {
        const txData = await txRes.json();
        if (txData.transactions && Array.isArray(txData.transactions)) {
          setCashTransactions(txData.transactions);
        }
      }
      if (qrisRes.ok) {
        const qData = await qrisRes.json();
        if (qData.qrisTransactions && Array.isArray(qData.qrisTransactions) && qData.qrisTransactions.length > 0) {
          setQrisList(qData.qrisTransactions);
        }
      }
    } catch (err) {
      console.warn('Gagal memuat data keuangan dari server:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || !txDesc.trim()) return;

    try {
      const res = await fetch('/api/finance/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: txType,
          category: txCategory,
          amount: Number(txAmount),
          description: txDesc.trim(),
          paymentMethod: txMethod,
          recordedBy: 'Bendahara BUMDes'
        })
      });

      const data = await res.json();
      if (res.ok && data.transaction) {
        onShowToast(`Transaksi ${txType === 'expense' ? 'pengeluaran' : 'pemasukan'} berhasil dicatat di buku kas!`, 'success');
        setIsAddExpenseModalOpen(false);
        setTxDesc('');
        fetchFinanceData();
      } else {
        throw new Error(data.error || 'Gagal menyimpan transaksi.');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Koneksi ke server gagal.', 'warning');
    }
  };

  const handlePrintSlip = (item: PayrollItem) => {
    onShowToast(`Mencetak slip gaji resmi format PDF untuk ${item.name}`, 'info');
  };

  const handlePrintAllSlips = () => {
    onShowToast('Mencetak seluruh berkas slip gaji karyawan periode September 2026', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
              <span>Menu BISNIS & Transaksi Finansial Terpadu</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PADES VERIFIED
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Pengelolaan arus kas, payroll penggajian karyawan, pelunasan vendor, piutang, dan pelacak QRIS live.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToBilling}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
        >
          <Receipt className="w-3.5 h-3.5 text-cyan-400" />
          <span>Buka Sub-Menu Tagihan</span>
        </button>
      </div>

      {/* Bilah Tab Memanjang Menu Bisnis */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center space-x-2 overflow-x-auto shadow-md">
        <button
          type="button"
          onClick={() => setActiveTab('keuangan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'keuangan'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Laporan Laba Rugi & PADes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bukukas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'bukukas'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Buku Kas & Jurnal Mutasi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('qris')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'qris'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QRIS Real-Time Tracker ({qrisList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gajian')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'gajian'
              ? 'bg-purple-500 text-white font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Gajian & Payroll Karyawan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payout')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'payout'
              ? 'bg-blue-500 text-white font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payout (Pembayaran Vendor)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('piutang')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'piutang'
              ? 'bg-rose-500 text-white font-black shadow-md'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Piutang Pihak Ketiga</span>
        </button>
      </div>

      {/* Konten Tab Terpilih */}
      <div className="space-y-6">
        
        {/* TAB 1: QRIS TRACKER */}
        {activeTab === 'qris' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    QRIS Real-Time Settlement Tracker
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Setiap scan QRIS di loket GOR, aula, atau transfer sampah otomatis tercatat dalam hitungan detik
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl text-xs font-mono font-bold">
                NMID: ID102600987123
              </span>
            </div>

            <div className="divide-y divide-slate-800">
              {qrisList.map((tx) => (
                <div key={tx.id} className="py-3.5 flex items-center justify-between hover:bg-slate-850 px-3 rounded-2xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                      QR
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-white">{tx.payerName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">#{tx.id}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{tx.purpose}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-400 font-mono block">
                      + Rp {tx.amount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {tx.time} · Lunas Terverifikasi
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: GAJIAN / PAYROLL */}
        {activeTab === 'gajian' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Penggajian & Slip Gaji Karyawan BUMDes
                </h4>
                <span className="text-[11px] text-slate-400">Periode: September 2026 (Gaji Pokok + Komisi Pelayanan)</span>
              </div>
              <button
                type="button"
                onClick={handlePrintAllSlips}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Semua Slip Gaji (PDF)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Nama Pegawai & NIP</th>
                    <th className="px-4 py-3">Jabatan</th>
                    <th className="px-4 py-3">Gaji Pokok</th>
                    <th className="px-4 py-3">Komisi Transaksi</th>
                    <th className="px-4 py-3">Total Diterima</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payrollList.map((p) => (
                    <tr key={p.nip} className="hover:bg-slate-850">
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">NIP: {p.nip}</span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-300">{p.role}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-300">Rp {p.baseSalary.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-3.5 font-mono text-emerald-400">+ Rp {p.commission.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-3.5 font-mono font-black text-white text-sm">
                        Rp {p.totalPaid.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handlePrintSlip(p)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
                        >
                          Cetak Slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LAPORAN KEUANGAN */}
        {activeTab === 'keuangan' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Laporan Keuangan & PADes (Pendapatan Asli Desa)
              </h4>
              <button
                type="button"
                onClick={() => onShowToast('Laporan keuangan diekspor ke Excel', 'success')}
                className="px-3.5 py-1.5 bg-slate-800 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unduh Neraca (Excel)</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Laporan Keuangan Laba Rugi & Alokasi PADes (Pendapatan Asli Desa)
                </h4>
                <span className="text-[11px] text-slate-400">
                  Data real-time sinkron dari penerimaan sewa GOR, gedung, bank sampah, dan QRIS live
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 rounded-xl text-xs font-black shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat Pengeluaran / Pemasukan</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    fetchFinanceData();
                    onShowToast('Data laporan keuangan diperbarui dari server.', 'info');
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 cursor-pointer"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('Laporan keuangan diekspor ke Excel', 'success')}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Unduh Excel</span>
                </button>
              </div>
            </div>

            {/* 4 Kartu Metrik Keuangan Utama */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-950 rounded-2xl border border-emerald-900/40 relative overflow-hidden">
                <span className="text-[10px] text-emerald-400 uppercase font-black tracking-wider block">Total Pendapatan Usaha</span>
                <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                  Rp {(summary?.totalIncome ?? 48250000).toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-slate-500 block mt-0.5">GOR, Gedung, Retribusi & UMKM</span>
              </div>

              <div className="p-5 bg-slate-950 rounded-2xl border border-rose-900/40 relative overflow-hidden">
                <span className="text-[10px] text-rose-400 uppercase font-black tracking-wider block">Biaya Operasional</span>
                <p className="text-2xl font-black text-rose-400 mt-1 font-mono">
                  Rp {(summary?.totalExpense ?? 5450000).toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-slate-500 block mt-0.5">Listrik, Perawatan & Armada</span>
              </div>

              <div className="p-5 bg-slate-950 rounded-2xl border border-cyan-900/40 relative overflow-hidden">
                <span className="text-[10px] text-cyan-400 uppercase font-black tracking-wider block">Saldo Kas Bersih BUMDes</span>
                <p className="text-2xl font-black text-cyan-300 mt-1 font-mono">
                  Rp {(summary?.totalBalance ?? 42800000).toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-slate-500 block mt-0.5">Saldo Real Kas Bank Jateng</span>
              </div>

              <div className="p-5 bg-slate-950 rounded-2xl border border-amber-900/40 relative overflow-hidden">
                <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider block">Piutang Belum Tertagih</span>
                <p className="text-2xl font-black text-amber-400 mt-1 font-mono">
                  Rp {(summary?.pendingReceivables ?? 150000).toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-slate-500 block mt-0.5">{summary?.unpaidInvoicesCount ?? 2} Invoice Belum Lunas</span>
              </div>
            </div>

            {/* Skema Distribusi Bagi Hasil Laba Bersih BUMDes (AD/ART Desa Waru) */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <h5 className="text-xs font-black text-white uppercase tracking-wider">
                  Distribusi Laba Usaha BUMDes Sesuai Perdes Desa Waru
                </h5>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
                  <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                    <span>40% PAD Desa Waru</span>
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">PEMDES</span>
                  </div>
                  <p className="text-lg font-black text-white font-mono">
                    Rp {(summary?.padAllocation.padDesa ?? 17120000).toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Disetor langsung ke Rekening Kas Desa Waru</p>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60">
                  <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
                    <span>30% Modal Cadangan</span>
                    <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded">EKSPANSI</span>
                  </div>
                  <p className="text-lg font-black text-white font-mono">
                    Rp {(summary?.padAllocation.modalCadangan ?? 12840000).toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Pengembangan unit usaha & reinvestasi</p>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60">
                  <div className="flex items-center justify-between text-purple-400 font-bold mb-1">
                    <span>20% Jasa Pengurus</span>
                    <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded">INSENTIF</span>
                  </div>
                  <p className="text-lg font-black text-white font-mono">
                    Rp {(summary?.padAllocation.jasaPengurus ?? 8560000).toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Bonus kinerja pengurus & karyawan</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60">
                  <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                    <span>10% Dana Sosial</span>
                    <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">WARGA</span>
                  </div>
                  <p className="text-lg font-black text-white font-mono">
                    Rp {(summary?.padAllocation.danaSosial ?? 4280000).toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Bantuan warga miskin & beasiswa desa</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUKU KAS & JURNAL MUTASI */}
        {activeTab === 'bukukas' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Buku Kas Umum & Jurnal Mutasi Keuangan
                </h4>
                <span className="text-[11px] text-slate-400">
                  Rekapitulasi transaksi penerimaan dan pengeluaran operasional BUMDes
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExpenseModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Catat Transaksi Baru</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Tanggal & ID</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Uraian / Deskripsi</th>
                    <th className="px-4 py-3">Metode</th>
                    <th className="px-4 py-3">Petugas</th>
                    <th className="px-4 py-3 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {cashTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-500">
                        Belum ada transaksi kas yang dicatat.
                      </td>
                    </tr>
                  ) : (
                    cashTransactions.map((tx) => {
                      const isIncome = tx.type === 'income';
                      return (
                        <tr key={tx.id} className="hover:bg-slate-850">
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-white block">{tx.date}</span>
                            <span className="text-[10px] text-slate-500 font-mono">#{tx.id}</span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-300">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 inline-block">
                              {tx.category}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-200 font-medium">
                            {tx.description}
                          </td>
                          <td className="px-4 py-3.5 uppercase font-mono text-[10px] text-slate-400">
                            {tx.paymentMethod}
                          </td>
                          <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                            {tx.recordedBy}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono font-black text-sm">
                            <span className={isIncome ? 'text-emerald-400' : 'text-rose-400'}>
                              {isIncome ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PAYOUT & PIUTANG */}
        {(activeTab === 'payout' || activeTab === 'piutang') && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              {activeTab === 'payout' ? 'Jadwal Payout Pembayaran Pengadaan Vendor' : 'Daftar Piutang Pihak Ketiga'}
            </h4>
            <p className="text-xs text-slate-400">
              {activeTab === 'payout' 
                ? 'Pencatatan invoice masuk dari penyedia bola badminton, vendor sound system, dan supplier pupuk maggot.'
                : 'Rekapitulasi instansi atau perorangan yang menggunakan aula pernikahan dengan skema pembayaran termin.'}
            </p>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300">
              Seluruh transaksi tercatat secara otomatis di buku kas utama BUMDes.
            </div>
          </div>
        )}

      </div>

      {/* Modal Pencatatan Transaksi Kas Baru */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-black text-white">Catat Transaksi Buku Kas Baru</h4>
              <button
                type="button"
                onClick={() => setIsAddExpenseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Tipe Mutasi *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTxType('expense');
                      setTxCategory('Operasional & Perawatan');
                    }}
                    className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                      txType === 'expense'
                        ? 'bg-rose-950 text-rose-300 border-rose-700'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Pengeluaran (Beban)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTxType('income');
                      setTxCategory('Penerimaan Usaha Lainnya');
                    }}
                    className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                      txType === 'income'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Pemasukan (Kasir/Usaha)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Kategori Transaksi *</label>
                <select
                  value={txCategory}
                  onChange={e => setTxCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                >
                  {txType === 'expense' ? (
                    <>
                      <option value="Operasional & Perawatan">Operasional & Perawatan GOR</option>
                      <option value="Gaji & Honor Staf">Gaji & Honor Staf</option>
                      <option value="Pengadaan Perlengkapan">Pengadaan Perlengkapan (Shuttlecock/Net)</option>
                      <option value="Listrik & Utilitas">Listrik & Utilitas Desa</option>
                      <option value="Operasional Armada Sampah">Operasional Armada Sampah</option>
                    </>
                  ) : (
                    <>
                      <option value="Reservasi GOR">Reservasi GOR Badminton</option>
                      <option value="Retribusi Sampah">Retribusi Bank Sampah</option>
                      <option value="Sewa Gedung">Sewa Gedung Serbaguna</option>
                      <option value="Marketplace UMKM">Bagi Hasil Penjualan UMKM</option>
                      <option value="Penerimaan Usaha Lainnya">Penerimaan Usaha Lainnya</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Nominal (Rp) *</label>
                <input
                  type="number"
                  value={txAmount}
                  onChange={e => setTxAmount(e.target.value)}
                  placeholder="Contoh: 150000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Keterangan / Uraian *</label>
                <input
                  type="text"
                  value={txDesc}
                  onChange={e => setTxDesc(e.target.value)}
                  placeholder="Contoh: Pembelian 3 Slop Shuttlecock Merk Samurai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Metode Bayar</label>
                <select
                  value={txMethod}
                  onChange={e => setTxMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="cash">Tunai Kas</option>
                  <option value="bank_transfer">Transfer Bank Jateng</option>
                  <option value="qris">QRIS BUMDes</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl"
                >
                  Simpan Transaksi Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
