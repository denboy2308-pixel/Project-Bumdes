import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Bell, 
  Calendar, 
  Download, 
  FileText, 
  Link2, 
  MessageCircle, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Filter,
  ArrowUpRight,
  ExternalLink,
  Copy,
  X,
  QrCode,
  CreditCard,
  Check,
  ShieldCheck
} from 'lucide-react';

interface BillingCustomer {
  id: string;
  name: string;
  category: string;
  zone: string;
  phone: string;
  amount: number;
  dueDate: string;
  status: 'lunas' | 'belum_bayar' | 'dibatalkan';
  invoicePdfUrl?: string;
  portalUrl?: string;
  period?: string;
  reservationId?: string;
  paymentDetails?: {
    paidAt: string;
    method: 'cash' | 'qris' | 'bank_transfer' | string;
    receiptNumber: string;
    verifiedBy: string;
    notes?: string;
  };
}

const INITIAL_CUSTOMERS: BillingCustomer[] = [
  {
    id: 'NAS-089',
    name: 'Bpk. Joko Susanto',
    category: 'Bank Sampah Rumah Tangga (Paket Dusun I)',
    zone: 'Dusun I / RT 02 RW 01',
    phone: '6281234567890',
    amount: 75000,
    dueDate: '05 September 2026',
    status: 'belum_bayar',
    invoicePdfUrl: '/invoices/INV-2026-089.pdf',
    portalUrl: 'https://bumdeswaskita.desa.id/portal/bayar/NAS-089'
  },
  {
    id: 'NAS-104',
    name: 'Ibu Hartini Sutrisno',
    category: 'Bank Sampah & Retribusi Niaga (Warung Makan)',
    zone: 'Dusun II / RT 04 RW 02',
    phone: '6285712345678',
    amount: 75000,
    dueDate: '04 September 2026',
    status: 'belum_bayar',
    invoicePdfUrl: '/invoices/INV-2026-104.pdf',
    portalUrl: 'https://bumdeswaskita.desa.id/portal/bayar/NAS-104'
  },
  {
    id: 'NAS-012',
    name: 'Bpk. Subagyo Martono',
    category: 'Bank Sampah Rumah Tangga',
    zone: 'Dusun I / RT 01 RW 01',
    phone: '6281398765432',
    amount: 150000,
    dueDate: '01 September 2026',
    status: 'lunas',
    invoicePdfUrl: '/invoices/INV-2026-012.pdf',
    portalUrl: 'https://bumdeswaskita.desa.id/portal/bayar/NAS-012'
  },
  {
    id: 'NAS-034',
    name: 'Ibu Ratna Dewi',
    category: 'Bank Sampah Rumah Tangga',
    zone: 'Dusun III / RT 02 RW 03',
    phone: '6281211223344',
    amount: 150000,
    dueDate: '02 September 2026',
    status: 'lunas',
    invoicePdfUrl: '/invoices/INV-2026-034.pdf',
    portalUrl: 'https://bumdeswaskita.desa.id/portal/bayar/NAS-034'
  },
  {
    id: 'NAS-055',
    name: 'Bpk. Ahmad Fauzi',
    category: 'Bank Sampah Rumah Tangga',
    zone: 'Dusun II / RT 01 RW 02',
    phone: '6287899001122',
    amount: 150000,
    dueDate: '02 September 2026',
    status: 'lunas',
    invoicePdfUrl: '/invoices/INV-2026-055.pdf',
    portalUrl: 'https://bumdeswaskita.desa.id/portal/bayar/NAS-055'
  }
];

interface BillingModuleProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function BillingModule({ onShowToast }: BillingModuleProps) {
  const [customers, setCustomers] = useState<BillingCustomer[]>(INITIAL_CUSTOMERS);
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'belum_bayar' | 'lunas'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [previewInvoiceCustomer, setPreviewInvoiceCustomer] = useState<BillingCustomer | null>(null);
  const [isOverdueSummaryOpen, setIsOverdueSummaryOpen] = useState(false);
  const [activePaymentCust, setActivePaymentCust] = useState<BillingCustomer | null>(null);
  const [paymentMethodChoice, setPaymentMethodChoice] = useState<'cash' | 'qris' | 'bank_transfer'>('cash');
  const [activeReceiptData, setActiveReceiptData] = useState<{ cust: BillingCustomer; receiptNumber: string } | null>(null);

  // New Invoice Form
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newAmount, setNewAmount] = useState('75000');
  const [newZone, setNewZone] = useState('Dusun I / RT 01');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState('Bank Sampah Rumah Tangga');

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`/api/billing?period=${encodeURIComponent(selectedMonth)}`);
      const data = await res.json();
      if (data.invoices && Array.isArray(data.invoices) && data.invoices.length > 0) {
        setCustomers(data.invoices);
      }
    } catch (err) {
      console.warn('Gagal memuat billing invoices dari server:', err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [selectedMonth]);

  const lunasList = customers.filter(c => c.status === 'lunas');
  const belumBayarList = customers.filter(c => c.status === 'belum_bayar');

  const lunasCount = lunasList.length;
  const lunasAmount = lunasList.reduce((acc, c) => acc + c.amount, 0);

  const belumBayarCount = belumBayarList.length;
  const belumBayarAmount = belumBayarList.reduce((acc, c) => acc + c.amount, 0);

  const filteredCustomers = customers.filter(c => {
    const matchesStatus = statusFilter === 'semua' ? true : c.status === statusFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCopyLink = (url?: string, name?: string) => {
    const link = url || 'https://bumdeswaskita.desa.id';
    navigator.clipboard.writeText(link);
    onShowToast(`Tautan portal pembayaran untuk ${name || 'nasabah'} disalin ke clipboard!`, 'success');
  };

  const handleSendMassDueReminder = () => {
    onShowToast(
      `Pengingat jatuh tempo massal (WhatsApp API & Notifikasi) dikirim ke ${belumBayarCount} nasabah tertunggak!`,
      'info'
    );
  };

  const handleDownloadAllPdf = () => {
    setIsOverdueSummaryOpen(true);
    onShowToast(`Membuka dokumen PDF rekapitulasi ${belumBayarCount} tunggakan nasabah periode ${selectedMonth}`, 'success');
  };

  const handleDownloadSinglePdf = (c: BillingCustomer) => {
    setPreviewInvoiceCustomer(c);
    onShowToast(`Membuka lembar invoice resmi #${c.id} (${c.name}) format PDF`, 'info');
  };

  const handleCreateInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;

    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCustomerName.trim(),
          category: newCategory,
          zone: newZone,
          phone: newPhone || '6281234567890',
          amount: Number(newAmount) || 75000,
          dueDate: '10 September 2026',
          period: selectedMonth
        })
      });

      const data = await res.json();
      if (res.ok && data.invoice) {
        setCustomers(prev => [data.invoice, ...prev]);
        setNewCustomerName('');
        setIsInvoiceModalOpen(false);
        onShowToast(`Invoice baru #${data.invoice.id} atas nama ${data.invoice.name} berhasil diterbitkan dan dicatat di server!`, 'success');
      } else {
        throw new Error(data.error || 'Gagal menerbitkan invoice.');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Koneksi ke server gagal.', 'warning');
    }
  };

  const handleConfirmPayment = async (cust: BillingCustomer) => {
    try {
      const res = await fetch(`/api/billing/${cust.id}/pay`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: paymentMethodChoice,
          verifiedBy: 'Kasir BUMDes Waru',
          notes: `Pelunasan via ${paymentMethodChoice === 'cash' ? 'Tunai di Kasir' : paymentMethodChoice === 'qris' ? 'Scan QRIS Kasir' : 'Transfer Bank'}`
        })
      });

      const data = await res.json();
      if (res.ok && data.invoice) {
        setCustomers(prev => prev.map(c => c.id === cust.id ? { ...c, ...data.invoice, status: 'lunas' } : c));
        setActivePaymentCust(null);
        setActiveReceiptData({
          cust: { ...cust, ...data.invoice, status: 'lunas' },
          receiptNumber: data.receiptNumber || `KWT-BW-${Date.now().toString().slice(-6)}`
        });
        onShowToast(`Pelunasan #${cust.id} (${cust.name}) berhasil diverifikasi! E-Kuitansi diterbitkan.`, 'success');
      } else {
        throw new Error(data.error || 'Gagal memproses pelunasan.');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Gagal menghubungi server.', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
              <span>Sub Menu Tagihan (Manajemen Billing & Nasabah Sampah)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                INVOICE MATRIX
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Pantau status pelunasan retribusi, cetak dokumen tagihan PDF, dan kirim pesan otomatis penagihan via WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* Tampilan Halaman Contoh: Tagihan Nasabah Sampah (LUNAS 13 vs Belum Bayar 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* KARTU LUNAS */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-800/80 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Status Tagihan Nasabah: LUNAS
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-3 mt-2">
            <span className="text-4xl font-black text-white font-mono">{lunasCount}</span>
            <span className="text-xs font-bold text-slate-400">Nasabah Telah Menyelesaikan Retribusi</span>
          </div>
          <p className="text-xl font-black text-emerald-300 font-mono mt-2">
            Rp {lunasAmount.toLocaleString('id-ID')},-
          </p>
          <div className="mt-3 text-[10px] text-slate-400">
            Terverifikasi via QRIS & Loket Kasir Kantor BUMDes
          </div>
        </div>

        {/* KARTU BELUM BAYAR */}
        <div className="p-6 bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-800/80 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-rose-400">
              Status Tagihan: BELUM BAYAR (TUNGGAKAN)
            </span>
            <AlertCircle className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
          <div className="flex items-baseline space-x-3 mt-2">
            <span className="text-4xl font-black text-white font-mono">{belumBayarCount}</span>
            <span className="text-xs font-bold text-slate-400">Nasabah Melewati Tanggal Jatuh Tempo</span>
          </div>
          <p className="text-xl font-black text-rose-300 font-mono mt-2">
            Rp {belumBayarAmount.toLocaleString('id-ID')},-
          </p>
          <div className="mt-3 text-[10px] text-rose-400/90 font-medium">
            Siap dikirimi notifikasi penagihan serentak (WA + Email + DM)
          </div>
        </div>
      </div>

      {/* Aksi Tagihan: Isian Beberapa Menu Halaman Melebar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Buat Invoice */}
          <button
            type="button"
            onClick={() => setIsInvoiceModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Invoice</span>
          </button>

          {/* 2. Kirim Pesan Jatuh Tempo (WA+Email+DM) */}
          <button
            type="button"
            onClick={handleSendMassDueReminder}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
            title="Kirim pengingat massal ke seluruh kontak tertunggak"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Kirim Pesan Jatuh Tempo (WA + Email + DM Akun Pelanggan)</span>
          </button>

          {/* 3. Pilihan Bulan Tagihan */}
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs text-white font-bold focus:outline-none"
            >
              <option value="September 2026">September 2026</option>
              <option value="Agustus 2026">Agustus 2026</option>
              <option value="Juli 2026">Juli 2026</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 4. Pilihan Menu (Semua, Belum Bayar, Lunas) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-1 flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setStatusFilter('semua')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'semua' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('belum_bayar')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'belum_bayar' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              Belum Bayar ({belumBayarCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('lunas')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'lunas' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lunas ({lunasCount})
            </button>
          </div>

          {/* 5. Download PDF Tunggakan Semua Periode */}
          <button
            type="button"
            onClick={handleDownloadAllPdf}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download PDF Tunggakan Semua Periode</span>
          </button>
        </div>
      </div>

      {/* Tabel Informasi Pelanggan & Tombol AKSI Lengkap */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/90">
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Daftar Pelanggan & Jatuh Tempo Periode {selectedMonth}
            </h4>
            <span className="text-[11px] text-slate-400">
              Integrasi tombol langsung: Cetak PDF, Salin Tautan, dan Kirim Pesan WhatsApp
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau dusun..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Nama Pelanggan</th>
                <th className="px-4 py-3.5">Wilayah & Layanan</th>
                <th className="px-4 py-3.5">Nomor Kontak</th>
                <th className="px-4 py-3.5">Total Tunggakan / Tarif</th>
                <th className="px-4 py-3.5">Jatuh Tempo</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-center">AKSI PENAGIHAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCustomers.map((cust) => {
                const isBelumBayar = cust.status === 'belum_bayar';
                // Pesan WhatsApp otomatis yang siap kirim
                const waMessageText = encodeURIComponent(
                  `Yth. ${cust.name},\n\nKami dari BUMDes Waskita Wijaya memberitahukan tagihan ${cust.category} sebesar Rp ${cust.amount.toLocaleString('id-ID')} dengan status jatuh tempo pada ${cust.dueDate}.\n\nSilakan melihat invoice dan melakukan pembayaran melalui tautan resmi ini:\n${cust.portalUrl}\n\nTerima kasih atas partisipasi Anda dalam memajukan kebersihan dan kemandirian Desa Waru.`
                );
                const waLink = `https://wa.me/${cust.phone}?text=${waMessageText}`;

                return (
                  <tr key={cust.id} className="hover:bg-slate-850 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-bold text-white block">{cust.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono block mt-0.5">ID: {cust.id}</span>
                    </td>

                    <td className="px-4 py-4 text-slate-300">
                      <span className="block font-medium">{cust.zone}</span>
                      <span className="text-[10px] text-slate-500 block">{cust.category}</span>
                    </td>

                    <td className="px-4 py-4 font-mono text-slate-300">
                      +{cust.phone}
                    </td>

                    <td className="px-4 py-4 font-mono font-bold">
                      <span className={isBelumBayar ? 'text-rose-400 text-sm' : 'text-emerald-400 text-sm'}>
                        Rp {cust.amount.toLocaleString('id-ID')},-
                      </span>
                    </td>

                    <td className="px-4 py-4 text-slate-400">
                      {cust.dueDate}
                    </td>

                    <td className="px-4 py-4">
                      {isBelumBayar ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 inline-block">
                          Belum Bayar
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 inline-block">
                          Lunas
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        {/* 0. Tombol Bayar Cepat (Khusus Belum Bayar) */}
                        {isBelumBayar ? (
                          <button
                            type="button"
                            onClick={() => {
                              setActivePaymentCust(cust);
                              setPaymentMethodChoice('cash');
                            }}
                            title="Terima Pembayaran di Loket Kasir"
                            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center space-x-1 shadow-md cursor-pointer transition-all"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Terima Bayar</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveReceiptData({
                                cust,
                                receiptNumber: cust.paymentDetails?.receiptNumber || `KWT-BW-202609-${cust.id.replace(/\D/g, '').slice(-3) || '001'}`
                              });
                            }}
                            title="Lihat E-Kuitansi Resmi BUMDes"
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>E-Kuitansi</span>
                          </button>
                        )}

                        {/* 1. Ikon PDF dengan isi invoice sesuai status tunggakan */}
                        <button
                          type="button"
                          onClick={() => handleDownloadSinglePdf(cust)}
                          title={`Download Lembar PDF Invoice #${cust.id}`}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                        >
                          <FileText className="w-4 h-4 text-rose-400" />
                        </button>

                        {/* 2. Ikon Tautan (Salin tautan akun pelanggan) */}
                        <button
                          type="button"
                          onClick={() => handleCopyLink(cust.portalUrl, cust.name)}
                          title="Salin Tautan Akun & Pembayaran Nasabah"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer border border-slate-700"
                        >
                          <Link2 className="w-4 h-4" />
                        </button>

                        {/* 3. Ikon WhatsApp yang langsung terintegrasi dengan nomor pelanggan dan pesan tagihan */}
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Kirim Tagihan & Perintah Membayar via WhatsApp Langsung"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Buat Invoice Baru */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-black text-white">Terbitkan Invoice Baru</h4>
              <button 
                type="button" 
                onClick={() => setIsInvoiceModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Nama Nasabah / Pelanggan *</label>
                <input 
                  type="text"
                  value={newCustomerName}
                  onChange={e => setNewCustomerName(e.target.value)}
                  placeholder="Contoh: Bpk. Slamet Widodo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Wilayah Dusun & RT *</label>
                <input 
                  type="text"
                  value={newZone}
                  onChange={e => setNewZone(e.target.value)}
                  placeholder="Dusun II / RT 03"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Nomor WhatsApp Aktif (Format: 628xxx) *</label>
                <input 
                  type="text"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="6281234567890"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Nominal Tagihan (Rp) *</label>
                <input 
                  type="number"
                  value={newAmount}
                  onChange={e => setNewAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl"
                >
                  Terbitkan & Buat Tautan Bayar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pratinjau Dokumen PDF Invoice Resmi */}
      {previewInvoiceCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            {/* Action Bar Atas */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-sm">Dokumen Invoice Resmi BUMDes Waskita Wijaya</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Cetak / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewInvoiceCustomer(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Isi Lembar Invoice Kertas */}
            <div className="p-8 overflow-y-auto space-y-6 text-xs leading-relaxed bg-white">
              {/* Kop Surat */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black uppercase text-slate-900 tracking-wide">
                    BADAN USAHA MILIK DESA (BUMDes) WASKITA WIJAYA
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    Pemerintah Desa Waru, Kecamatan Baki, Kabupaten Sukoharjo, Jawa Tengah
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    SK Pendirian Perdes No. 04/2021 · Telp/WA: +62 812-3456-7890 · Email: info@bumdeswaskita.desa.id
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold text-xs">
                    INVOICE
                  </span>
                </div>
              </div>

              {/* Info Pelanggan & Nomor Invoice */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Diterbitkan Untuk:</span>
                  <p className="font-bold text-sm text-slate-900">{previewInvoiceCustomer.name}</p>
                  <p className="text-slate-600">{previewInvoiceCustomer.zone}</p>
                  <p className="text-slate-600 font-mono">{previewInvoiceCustomer.phone}</p>
                </div>
                <div className="text-right space-y-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Nomor Faktur:</span>
                    <p className="font-mono font-bold text-slate-900">INV/2026/09/{previewInvoiceCustomer.id}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Periode Tagihan:</span>
                    <p className="text-slate-900 font-semibold">{selectedMonth}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Jatuh Tempo:</span>
                    <p className="text-rose-600 font-bold">{previewInvoiceCustomer.dueDate}</p>
                  </div>
                </div>
              </div>

              {/* Tabel Rincian */}
              <table className="w-full text-left border-collapse border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="border border-slate-200 p-2 text-center w-12">No</th>
                    <th className="border border-slate-200 p-2">Deskripsi Layanan</th>
                    <th className="border border-slate-200 p-2 text-center w-20">Volume</th>
                    <th className="border border-slate-200 p-2 text-right w-32">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 p-2 text-center">1</td>
                    <td className="border border-slate-200 p-2">
                      <span className="font-bold text-slate-900 block">Retribusi Pengelolaan Bank Sampah & Kebersihan</span>
                      <span className="text-[10px] text-slate-500">
                        Pengangkutan sampah rumah tangga terpilah secara berkala (Selasa, Kamis, Sabtu)
                      </span>
                    </td>
                    <td className="border border-slate-200 p-2 text-center">1 Bulan</td>
                    <td className="border border-slate-200 p-2 text-right font-mono font-bold">
                      Rp {previewInvoiceCustomer.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr>
                    <td colSpan={3} className="border border-slate-200 p-2 text-right font-bold text-slate-700">
                      Total Tagihan
                    </td>
                    <td className="border border-slate-200 p-2 text-right font-black text-sm font-mono text-slate-900">
                      Rp {previewInvoiceCustomer.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Status Stamp Watermark & QRIS */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-white border border-slate-300 rounded-xl p-1 flex items-center justify-center">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Metode Pembayaran Resmi:</span>
                    <p className="font-bold text-slate-900">QRIS Bank Indonesia / BUMDes Account</p>
                    <p className="text-[10px] text-slate-500 font-mono">NMID: ID102600987123</p>
                  </div>
                </div>

                <div>
                  {previewInvoiceCustomer.status === 'lunas' ? (
                    <div className="border-4 border-emerald-600 text-emerald-700 font-black px-4 py-1.5 rounded-xl uppercase tracking-widest text-sm -rotate-6">
                      ✓ LUNAS RESMI
                    </div>
                  ) : (
                    <div className="border-4 border-rose-600 text-rose-700 font-black px-4 py-1.5 rounded-xl uppercase tracking-widest text-sm -rotate-6">
                      BELUM BAYAR
                    </div>
                  )}
                </div>
              </div>

              {/* Tanda Tangan */}
              <div className="grid grid-cols-2 gap-4 pt-4 text-center">
                <div>
                  <p className="text-slate-500 text-[11px]">Diterima Oleh Nasabah,</p>
                  <div className="h-14" />
                  <p className="font-bold text-slate-900">({previewInvoiceCustomer.name})</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">BUMDes Waskita Wijaya,</p>
                  <div className="h-14 flex items-center justify-center">
                    <span className="text-[10px] text-emerald-600 font-bold border border-emerald-500 px-2 py-0.5 rounded">
                      TERTANDA DIGITAL
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 underline">Bambang Sutrisno, S.E.</p>
                  <p className="text-[10px] text-slate-500">Direktur BUMDes</p>
                </div>
              </div>
            </div>

            {/* Footer Dialog */}
            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleCopyLink(previewInvoiceCustomer.portalUrl, previewInvoiceCustomer.name)}
                className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Salin Tautan Portal Bayar</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewInvoiceCustomer(null)}
                className="px-4 py-1.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dokumen PDF Rekapitulasi Tunggakan Semua Periode */}
      {isOverdueSummaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <span className="font-bold text-sm">Dokumen Rekapitulasi Tunggakan Nasabah Semua Periode</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOverdueSummaryOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-xs leading-relaxed bg-white">
              <div className="border-b-2 border-slate-900 pb-4">
                <h2 className="text-base font-black uppercase text-slate-900 tracking-wide">
                  LAPORAN DAFTAR TUNGGAKAN IURAN BANK SAMPAH
                </h2>
                <p className="text-[11px] text-slate-600">
                  BUMDes Waskita Wijaya · Pemerintah Desa Waru, Kec. Baki, Sukoharjo
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Per tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
                </p>
              </div>

              {/* Total Summary */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-700">Total Tagihan Tertunggak:</span>
                  <p className="text-2xl font-black text-rose-700 font-mono">
                    Rp {belumBayarAmount.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-rose-700">Jumlah Nasabah:</span>
                  <p className="text-lg font-bold text-rose-800">{belumBayarCount} Warga</p>
                </div>
              </div>

              {/* Tabel Tunggakan */}
              <table className="w-full text-left border-collapse border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="border border-slate-200 p-2">Nama Nasabah</th>
                    <th className="border border-slate-200 p-2">Wilayah / Dusun</th>
                    <th className="border border-slate-200 p-2">Jatuh Tempo</th>
                    <th className="border border-slate-200 p-2 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {belumBayarList.map((c) => (
                    <tr key={c.id}>
                      <td className="border border-slate-200 p-2">
                        <span className="font-bold text-slate-900 block">{c.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{c.phone}</span>
                      </td>
                      <td className="border border-slate-200 p-2 text-slate-700">{c.zone}</td>
                      <td className="border border-slate-200 p-2 text-rose-600 font-bold">{c.dueDate}</td>
                      <td className="border border-slate-200 p-2 text-right font-mono font-bold text-slate-900">
                        Rp {c.amount.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-4 flex justify-between items-center text-slate-500 text-[11px]">
                <span>Dicetak otomatis oleh Sistem Billing Terpadu BUMDes Waskita Wijaya</span>
                <span className="font-mono">Hal. 1 / 1</span>
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOverdueSummaryOpen(false)}
                className="px-4 py-1.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1-Klik Kasir: Terima Pembayaran Tagihan */}
      {activePaymentCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-black text-white">Kasir: Terima Pembayaran Tagihan</h4>
              </div>
              <button
                type="button"
                onClick={() => setActivePaymentCust(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Nama Nasabah:</span>
                <span className="font-bold text-white">{activePaymentCust.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Kategori / Layanan:</span>
                <span className="text-slate-300">{activePaymentCust.category}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Wilayah / Dusun:</span>
                <span className="text-slate-300">{activePaymentCust.zone}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-bold">Total Pembayaran:</span>
                <span className="text-emerald-400 font-black font-mono text-base">
                  Rp {activePaymentCust.amount.toLocaleString('id-ID')},-
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Pilih Metode Pembayaran Kasir:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethodChoice('cash')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethodChoice === 'cash'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-lg block mb-0.5">💵</span>
                  <span className="text-[11px] font-bold block">Tunai Loket</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethodChoice('qris')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethodChoice === 'qris'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-lg block mb-0.5">📱</span>
                  <span className="text-[11px] font-bold block">QRIS BUMDes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethodChoice('bank_transfer')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethodChoice === 'bank_transfer'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-lg block mb-0.5">🏦</span>
                  <span className="text-[11px] font-bold block">Bank Jateng</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setActivePaymentCust(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleConfirmPayment(activePaymentCust)}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Konfirmasi Lunas & Terbitkan Kuitansi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal E-Kuitansi Digital Resmi BUMDes (Siap Cetak & Verifikasi QR) */}
      {activeReceiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Bukti Pembayaran E-Kuitansi Resmi BUMDes</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Kuitansi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReceiptData(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-xs leading-relaxed bg-white">
              {/* Kop Surat Kuitansi */}
              <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-black uppercase text-slate-900 tracking-wide">
                    BUMDes WASKITA WIJAYA DESA WARU
                  </h2>
                  <p className="text-[10px] text-slate-600">
                    Kecamatan Baki, Kabupaten Sukoharjo, Jawa Tengah · Unit Usaha Terpadu
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-black text-xs rounded-lg block">
                    KUITANSI LUNAS
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    No: {activeReceiptData.receiptNumber}
                  </span>
                </div>
              </div>

              {/* Rincian Pembayaran */}
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Telah Diterima Dari:</span>
                  <span className="col-span-2 font-bold text-slate-900">{activeReceiptData.cust.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Nomor Faktur / Ref:</span>
                  <span className="col-span-2 font-mono text-slate-700 font-bold">{activeReceiptData.cust.id}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Untuk Pembayaran:</span>
                  <span className="col-span-2 text-slate-800">{activeReceiptData.cust.category} ({activeReceiptData.cust.zone})</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Metode & Status:</span>
                  <span className="col-span-2 font-semibold text-emerald-700">
                    LUNAS TERVERIFIKASI ({activeReceiptData.cust.paymentDetails?.method === 'cash' ? 'Tunai di Kasir' : activeReceiptData.cust.paymentDetails?.method === 'qris' ? 'QRIS BUMDes' : 'Transfer Bank'})
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-700 font-bold">Jumlah Uang:</span>
                  <span className="col-span-2 font-black text-base text-slate-900 font-mono">
                    Rp {activeReceiptData.cust.amount.toLocaleString('id-ID')},-
                  </span>
                </div>
              </div>

              {/* Stempel & QR Code Keabsahan */}
              <div className="grid grid-cols-2 gap-4 items-center pt-2">
                <div className="flex items-center space-x-3 p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <QrCode className="w-12 h-12 text-slate-900" />
                  <div>
                    <span className="text-[9px] font-bold uppercase text-slate-500 block">Validasi Digital QR</span>
                    <span className="text-[10px] font-mono text-slate-700 block">Keabsahan Terverifikasi</span>
                    <span className="text-[9px] text-emerald-700 font-bold">Buku Kas BUMDes Masuk</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[10px] text-slate-500">Desa Waru, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="text-[10px] text-slate-500">Petugas / Bendahara BUMDes,</p>
                  <div className="h-10 flex items-center justify-center">
                    <span className="text-[9px] font-mono font-bold text-emerald-700 border border-emerald-400 px-2 py-0.5 rounded">
                      [LUNAS TERTANDA]
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 underline text-xs">
                    {activeReceiptData.cust.paymentDetails?.verifiedBy || 'Siti Rahayu, S.E.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[10px] text-slate-500">Simpan bukti kuitansi ini sebagai tanda pelunasan yang sah.</span>
              <button
                type="button"
                onClick={() => setActiveReceiptData(null)}
                className="px-4 py-1.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
              >
                Tutup Kuitansi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
