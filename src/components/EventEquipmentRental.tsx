import React, { useState } from 'react';
import { 
  Tent, 
  Volume2, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Calculator,
  ShieldCheck,
  PackageCheck,
  QrCode,
  X
} from 'lucide-react';
import { showToast } from './ToastNotification';

interface EquipmentItem {
  id: string;
  name: string;
  category: 'Tenda' | 'Sound System' | 'Panggung' | 'Kursi & Meja' | 'Pendingin';
  pricePerDay: number;
  unit: string;
  image: string;
  description: string;
}

const EQUIPMENT_CATALOG: EquipmentItem[] = [
  {
    id: 'eq-1',
    name: 'Tenda Dekorasi VIP Hajatan (8x12 meter)',
    category: 'Tenda',
    pricePerDay: 750000,
    unit: 'Set / Hari',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
    description: 'Tenda kain rumbai lengkap dengan plafon dekorasi warna custom untuk pernikahan & hajatan warga.'
  },
  {
    id: 'eq-2',
    name: 'Paket Sound System Audio Pro 5.000 Watt + Mixer',
    category: 'Sound System',
    pricePerDay: 850000,
    unit: 'Set / Hari',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    description: '4 Speaker Subwoofer, 2 Monitor Vokal, Mixer Digital 16 Channel, & 4 Wireless Microphone.'
  },
  {
    id: 'eq-3',
    name: 'Panggung Ringging Karang Taruna (6x4 meter)',
    category: 'Panggung',
    pricePerDay: 500000,
    unit: 'Set / Hari',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    description: 'Panggung besi kokoh dilapisi karpet merah tebal dan tangga keselamatan.'
  },
  {
    id: 'eq-4',
    name: 'Kursi Lipat Chitose + Cover Kain Putih (50 Unit)',
    category: 'Kursi & Meja',
    pricePerDay: 150000,
    unit: 'Paket / Hari',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    description: 'Kursi lipat besi stainless dengan sarung kain bersih terawat.'
  },
  {
    id: 'eq-5',
    name: 'Cooling Mist Fan (Kipas Blower Embun Misting)',
    category: 'Pendingin',
    pricePerDay: 200000,
    unit: 'Unit / Hari',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80',
    description: 'Kipas angin embun kapasitas tangki 60 liter penyegar udara arena hajatan.'
  }
];

export default function EventEquipmentRental() {
  const [selectedEquipments, setSelectedEquipments] = useState<Record<string, number>>({
    'eq-1': 1,
    'eq-2': 1
  });
  const [eventDate, setEventDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toISOString().split('T')[0];
  });
  const [durationDays, setDurationDays] = useState(1);
  const [renterName, setRenterName] = useState('');
  const [renterPhone, setRenterPhone] = useState('');
  const [renterLocation, setRenterLocation] = useState('');
  const [showQrisModal, setShowQrisModal] = useState(false);

  const toggleEquipmentQuantity = (id: string, delta: number) => {
    setSelectedEquipments(prev => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const calculateTotalCost = () => {
    let subtotal = 0;
    Object.entries(selectedEquipments).forEach(([id, qty]) => {
      const item = EQUIPMENT_CATALOG.find(e => e.id === id);
      if (item) {
        subtotal += item.pricePerDay * Number(qty);
      }
    });
    return subtotal * durationDays;
  };

  const grandTotal = calculateTotalCost();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(selectedEquipments).length === 0) {
      showToast('Pilih Peralatan Hajatan', 'Silakan tentukan minimal 1 alat tenda atau sound system.', 'warning');
      return;
    }
    if (!renterName.trim() || !renterPhone.trim() || !renterLocation.trim()) {
      showToast('Lengkapi Form Pemesan', 'Nama, WA, dan lokasi hajatan wajib diisi.', 'warning');
      return;
    }

    setShowQrisModal(true);
  };

  const handleConfirmPay = () => {
    setShowQrisModal(false);

    const itemsSummary = Object.entries(selectedEquipments).map(([id, qty]) => {
      const item = EQUIPMENT_CATALOG.find(e => e.id === id);
      const cost = item ? item.pricePerDay * Number(qty) : 0;
      return `- *${item?.name}* x${qty} unit (Rp ${cost.toLocaleString('id-ID')}/hari)`;
    }).join('\n');

    const formattedTotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(grandTotal);

    const msg = `*BOOKING PERALATAN HAJATAN BUMDESA WASKITA*\n\n` +
      `👤 *Pemesan:* ${renterName}\n` +
      `📱 *No. WA:* ${renterPhone}\n` +
      `📍 *Lokasi Hajatan:* ${renterLocation}\n` +
      `📅 *Tanggal Digunakan:* ${eventDate} (${durationDays} Hari)\n\n` +
      `🎪 *PERALATAN DIPILIH:* \n${itemsSummary}\n\n` +
      `💰 *TOTAL BIAYA:* ${formattedTotal}\n` +
      `🏷️ *Status:* DP 30% Terverifikasi QRIS\n\n` +
      `Mohon tim tim bongkar-pasang BUMDESA menyiapkan jadwal pengiriman. Terima kasih!`;

    window.open(`https://wa.me/6282134567890?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Pemesanan Tenda Berhasil!', 'Data telah diteruskan ke tim pengangkut & pasang BUMDESA Waru.', 'success');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 mb-2">
            <Tent className="w-3.5 h-3.5" />
            <span>Unit Logistik & Perlengkapan Acara BUMDESA</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Booking Alat Tenda & Sound System Hajatan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sewa perlengkapan hajatan pernikahan, pengajian, dan acara warga harga bersahabat terjamin aman.
          </p>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EQUIPMENT_CATALOG.map(item => {
          const qty = selectedEquipments[item.id] || 0;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                qty > 0 
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-md' 
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80'
              }`}
            >
              <div>
                <div className="h-36 rounded-xl overflow-hidden relative mb-2">
                  <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-slate-950/80 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{item.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Sewa Per Hari:</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    Rp {item.pricePerDay.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Counter Control */}
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => toggleEquipmentQuantity(item.id, -1)}
                    className="w-6 h-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-black px-1 text-slate-900 dark:text-white">{qty}</span>
                  <button
                    onClick={() => toggleEquipmentQuantity(item.id, 1)}
                    className="w-6 h-6 bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Form & Calculator Summary */}
      <form onSubmit={handleBookingSubmit} className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <span>Formulir Jadwal & Estimasi Total Sewa</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Tanggal Acara Hajatan:</label>
            <input
              type="date"
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Durasi Sewa (Hari):</label>
            <input
              type="number"
              min={1}
              max={7}
              value={durationDays}
              onChange={e => setDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nama Pemesan / Sohibul Hajat:</label>
            <input
              type="text"
              placeholder="Contoh: Bp. H. Supardi"
              value={renterName}
              onChange={e => setRenterName(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nomor WhatsApp Aktif:</label>
            <input
              type="text"
              placeholder="0821xxxxxxxx"
              value={renterPhone}
              onChange={e => setRenterPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Lokasi Pemasangan Tenda (Dukuh/RT):</label>
            <input
              type="text"
              placeholder="Contoh: Lapangan RT 03 Dukuh Waru"
              value={renterLocation}
              onChange={e => setRenterLocation(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Tagihan Alat:</span>
            <span className="text-xl font-black text-emerald-400">Rp {grandTotal.toLocaleString('id-ID')}</span>
            <span className="text-[10px] text-slate-400 block">Termasuk Gratis Biaya Bongkar Pasang & Antar Wilayah Desa Waru</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Bayar DP 30% QRIS & Kirim Jadwal</span>
          </button>
        </div>
      </form>

      {/* QRIS Modal */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full space-y-4 text-center text-white">
            <h3 className="text-base font-black">DP 30% Booking Tenda & Sound</h3>
            <p className="text-xs text-slate-400">Transfer DP 30% untuk mengunci tanggal peralatan hajatan Anda.</p>
            
            <div className="p-4 bg-white rounded-2xl inline-block">
              <QrCode className="w-36 h-36 text-slate-950 mx-auto" />
              <span className="text-[10px] font-black text-slate-900 block mt-1">NMID: ID10928374652</span>
              <span className="text-sm font-black text-slate-900">DP 30%: Rp {((grandTotal * 0.3)).toLocaleString('id-ID')}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowQrisModal(false)}
                className="flex-1 py-2.5 bg-slate-800 text-xs font-bold text-slate-300 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmPay}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl cursor-pointer"
              >
                Konfirmasi Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
