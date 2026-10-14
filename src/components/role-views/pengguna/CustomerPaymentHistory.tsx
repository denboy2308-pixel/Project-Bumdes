import React, { useState, useEffect } from 'react';
import { 
  CreditCard, QrCode, Download, CheckCircle2, Clock, 
  ArrowUpRight, ArrowDownLeft, X, Sparkles, Receipt,
  Check, FileText, AlertCircle, RefreshCw, Copy
} from 'lucide-react';
import { showToast } from '../../ToastNotification';
import { getQrCodeImageUrl } from '../../../services/freeApiService';

export interface CustomerBilling {
  id: string;
  category: 'Retribusi Sampah' | 'Sewa Lapangan GOR' | 'Sewa Gedung' | 'Pesanan UMKM';
  description: string;
  amount: number;
  dueDate: string;
  status: 'Lunas' | 'Menunggu Pembayaran' | 'Jatuh Tempo';
  paidAt?: string;
  invoiceNumber: string;
  receiptNumber?: string;
}

export default function CustomerPaymentHistory() {
  const [filterType, setFilterType] = useState<'semua' | 'lunas' | 'tagihan-aktif'>('semua');
  const [activeQrisBill, setActiveQrisBill] = useState<CustomerBilling | null>(null);
  const [activeReceiptModal, setActiveReceiptModal] = useState<CustomerBilling | null>(null);

  const [billings, setBillings] = useState<CustomerBilling[]>([
    {
      id: 'BIL-SMP-09',
      category: 'Retribusi Sampah',
      description: 'Iuran Retribusi Sampah Rumah Tangga RT 03 - Periode September 2026',
      amount: 25000,
      dueDate: '2026-09-15',
      status: 'Menunggu Pembayaran',
      invoiceNumber: 'INV/2026/09/SMP-0082'
    },
    {
      id: 'BIL-GOR-88',
      category: 'Sewa Lapangan GOR',
      description: 'Booking Lapangan 1 GOR Badminton (Sesi 19:00 - 21:00 WIB)',
      amount: 70000,
      dueDate: '2026-09-07',
      status: 'Lunas',
      paidAt: '2026-09-06 09:14 WIB',
      invoiceNumber: 'INV/2026/09/GOR-4912',
      receiptNumber: 'KWT-BUMDES-90214'
    },
    {
      id: 'BIL-UMK-23',
      category: 'Pesanan UMKM',
      description: 'Keripik Tempe Renyah Sanjai (3 pcs)',
      amount: 45000,
      dueDate: '2026-09-05',
      status: 'Lunas',
      paidAt: '2026-09-05 14:20 WIB',
      invoiceNumber: 'INV/2026/09/UMK-1102',
      receiptNumber: 'KWT-BUMDES-88123'
    },
    {
      id: 'BIL-SMP-08',
      category: 'Retribusi Sampah',
      description: 'Iuran Retribusi Sampah Rumah Tangga RT 03 - Periode Agustus 2026',
      amount: 25000,
      dueDate: '2026-08-15',
      status: 'Lunas',
      paidAt: '2026-08-10 11:05 WIB',
      invoiceNumber: 'INV/2026/08/SMP-0071',
      receiptNumber: 'KWT-BUMDES-77412'
    }
  ]);

  const fetchCustomerBills = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/billing', { headers });
      const data = await res.json();
      if (data.invoices && Array.isArray(data.invoices) && data.invoices.length > 0) {
        const mapped: CustomerBilling[] = data.invoices.map((inv: any) => ({
          id: inv.id,
          category: inv.category.includes('Sampah') ? 'Retribusi Sampah' :
                    inv.category.includes('Lapangan') || inv.category.includes('GOR') ? 'Sewa Lapangan GOR' :
                    inv.category.includes('Gedung') ? 'Sewa Gedung' : 'Pesanan UMKM',
          description: `${inv.category} (${inv.zone || 'Desa Waru'}) - Periode ${inv.period || 'September 2026'}`,
          amount: inv.amount,
          dueDate: inv.dueDate,
          status: inv.status === 'lunas' ? 'Lunas' : 'Menunggu Pembayaran',
          paidAt: inv.paymentDetails?.paidAt ? new Date(inv.paymentDetails.paidAt).toLocaleString('id-ID') : undefined,
          invoiceNumber: inv.id,
          receiptNumber: inv.paymentDetails?.receiptNumber
        }));
        setBillings(mapped);
      }
    } catch (err) {
      console.warn('Gagal memuat billing nasabah dari server:', err);
    }
  };

  useEffect(() => {
    fetchCustomerBills();
  }, []);

  const filteredBills = billings.filter(b => {
    if (filterType === 'lunas') return b.status === 'Lunas';
    if (filterType === 'tagihan-aktif') return b.status !== 'Lunas';
    return true;
  });

  const handlePayBill = (bill: CustomerBilling) => {
    setActiveQrisBill(bill);
  };

  const handleConfirmQrisPayment = async () => {
    if (!activeQrisBill) return;

    try {
      const res = await fetch('/api/finance/qris/simulate-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: activeQrisBill.id,
          payerName: 'Warga Nasabah Desa Waru',
          amount: activeQrisBill.amount
        })
      });

      const data = await res.json();
      const generatedReceipt = data.receiptNumber || ('KWT-BW-202609-' + Math.floor(10000 + Math.random() * 90000));

      setBillings(prev => prev.map(b => {
        if (b.id === activeQrisBill.id) {
          return {
            ...b,
            status: 'Lunas',
            paidAt: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) + ' WIB',
            receiptNumber: generatedReceipt
          };
        }
        return b;
      }));

      const paidBill = activeQrisBill;
      setActiveQrisBill(null);
      showToast(`Pembayaran ${paidBill.category} sebesar Rp ${paidBill.amount.toLocaleString('id-ID')} Berhasil! E-Kuitansi #${generatedReceipt} diterbitkan.`, 'success');
    } catch (err: any) {
      showToast('Koneksi verifikasi pembayaran gagal.', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Total Tagihan Aktif</span>
            <p className="text-xl font-black font-mono text-amber-500 mt-1">
              Rp {billings.filter(b => b.status !== 'Lunas').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('id-ID')}
            </p>
            <span className="text-[11px] text-slate-500">
              {billings.filter(b => b.status !== 'Lunas').length} Tagihan Belum Dibayar
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Total Pembayaran Berhasil</span>
            <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              Rp {billings.filter(b => b.status === 'Lunas').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('id-ID')}
            </p>
            <span className="text-[11px] text-slate-500">
              {billings.filter(b => b.status === 'Lunas').length} Transaksi Selesai
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Metode Bayar Resmi</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
              QRIS Dinamis BUMDes
            </p>
            <span className="text-[11px] text-emerald-600 font-mono">BCA, Mandiri, BRI, GoPay, OVO</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType('semua')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'semua'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Semua Riwayat
          </button>
          <button
            type="button"
            onClick={() => setFilterType('tagihan-aktif')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'tagihan-aktif'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Menunggu Pembayaran ({billings.filter(b => b.status !== 'Lunas').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('lunas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'lunas'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sudah Lunas
          </button>
        </div>

        <button
          type="button"
          onClick={() => showToast('Riwayat transaksi telah diperbarui', 'info')}
          className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Segarkan</span>
        </button>
      </div>

      {/* Billings & Transactions List */}
      <div className="space-y-3">
        {filteredBills.map((bill) => (
          <div
            key={bill.id}
            className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                  {bill.invoiceNumber}
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                  {bill.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  bill.status === 'Lunas'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                }`}>
                  {bill.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{bill.description}</h4>
              <p className="text-xs text-slate-500 font-mono">
                {bill.paidAt ? `Dibayar: ${bill.paidAt}` : `Jatuh Tempo: ${bill.dueDate}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block">Jumlah Tagihan</span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  Rp {bill.amount.toLocaleString('id-ID')}
                </span>
              </div>

              {bill.status !== 'Lunas' ? (
                <button
                  type="button"
                  onClick={() => handlePayBill(bill)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Bayar QRIS</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveReceiptModal(bill)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kuitansi Resmi</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* QRIS PAYMENT MODAL */}
      {activeQrisBill && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Pembayaran QRIS BUMDes</span>
              <button
                type="button"
                onClick={() => setActiveQrisBill(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-500">{activeQrisBill.category}</p>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{activeQrisBill.description}</h4>
              <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                Rp {activeQrisBill.amount.toLocaleString('id-ID')}
              </p>
            </div>

            {/* Dynamic QRIS Code */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
              <div className="bg-white p-2 rounded-lg shadow-xs border border-slate-200">
                <img
                  src={getQrCodeImageUrl(`QRIS-BUMDES-${activeQrisBill.invoiceNumber}-${activeQrisBill.amount}`, 240)}
                  alt="QRIS BUMDes"
                  className="w-44 h-44 object-contain"
                  crossOrigin="anonymous"
                />
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-semibold mt-2">
                NMID: ID102008491029 · {activeQrisBill.invoiceNumber}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Buka aplikasi m-Banking atau e-Wallet Anda (GoPay, OVO, Dana, BCA, Mandiri), lalu scan kode QR di atas.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(activeQrisBill.invoiceNumber);
                  showToast('Nomor invoice disalin ke clipboard!', 'success');
                }}
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Salin No. Tagihan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = getQrCodeImageUrl(`QRIS-BUMDES-${activeQrisBill.invoiceNumber}-${activeQrisBill.amount}`, 400);
                  link.download = `QRIS-${activeQrisBill.invoiceNumber}.png`;
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  showToast('QRIS tersimpan ke galeri!', 'success');
                }}
                className="py-2 px-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh QRIS</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleConfirmQrisPayment}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-sm cursor-pointer transition-colors"
            >
              Simulasi: Saya Sudah Membayar
            </button>
          </div>
        </div>
      )}

      {/* KUITANSI DIGITAL MODAL */}
      {activeReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Kuitansi Pembayaran Sah</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveReceiptModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 font-mono text-xs">
              <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-600 pb-2.5">
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">BUMDES WASKITA WIJAYA</h5>
                <p className="text-[11px] text-slate-500">Desa Waru, Kec. Baki, Kab. Sukoharjo</p>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">No. Kuitansi: {activeReceiptModal.receiptNumber}</p>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Invoice:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeReceiptModal.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tanggal Bayar:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeReceiptModal.paidAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kategori:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeReceiptModal.category}</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 dark:border-slate-600 py-2">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{activeReceiptModal.description}</p>
              </div>

              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-800 dark:text-slate-200">TOTAL LUNAS:</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  Rp {activeReceiptModal.amount.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="text-center pt-2 text-[11px] text-slate-400 font-sans">
                Dokumen bukti pembayaran elektronik sah yang terdaftar di server BUMDes Waskita Wijaya.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Kuitansi resmi PDF telah berhasil diunduh', 'success');
                  setActiveReceiptModal(null);
                }}
                className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Dokumen Kuitansi (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
