import React, { useState } from 'react';
import { 
  Truck, 
  Calendar, 
  Clock, 
  MapPin, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  RefreshCw, 
  Phone, 
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { showToast } from './ToastNotification';

interface ScheduleItem {
  id: string;
  rtRw: string;
  dukuh: string;
  days: string[];
  timeSlot: string;
  driverName: string;
  truckPlate: string;
  status: 'Otw' | 'Selesai' | 'Menunggu';
  lastUpdated: string;
}

const SCHEDULE_DATA: ScheduleItem[] = [
  {
    id: '1',
    rtRw: 'RT 01 / RW 01',
    dukuh: 'Dukuh Waru Utama',
    days: ['Senin', 'Rabu', 'Sabtu'],
    timeSlot: '07:00 - 09:00 WIB',
    driverName: 'Pak Joko (Armada 01)',
    truckPlate: 'AD 8291 SK',
    status: 'Otw',
    lastUpdated: '10 menit yang lalu'
  },
  {
    id: '2',
    rtRw: 'RT 02 / RW 01',
    dukuh: 'Dukuh Waru Timur',
    days: ['Senin', 'Rabu', 'Sabtu'],
    timeSlot: '09:00 - 11:00 WIB',
    driverName: 'Pak Joko (Armada 01)',
    truckPlate: 'AD 8291 SK',
    status: 'Menunggu',
    lastUpdated: 'Diperkirakan 09:15 WIB'
  },
  {
    id: '3',
    rtRw: 'RT 03 / RW 02',
    dukuh: 'Dukuh Baki Barat',
    days: ['Selasa', 'Kamis', 'Minggu'],
    timeSlot: '07:30 - 09:30 WIB',
    driverName: 'Pak Slamet (Armada 02)',
    truckPlate: 'AD 9012 FK',
    status: 'Selesai',
    lastUpdated: 'Hari ini 08:45 WIB'
  },
  {
    id: '4',
    rtRw: 'RT 04 / RW 02',
    dukuh: 'Dukuh Baki Selatan',
    days: ['Selasa', 'Kamis', 'Minggu'],
    timeSlot: '10:00 - 12:00 WIB',
    driverName: 'Pak Slamet (Armada 02)',
    truckPlate: 'AD 9012 FK',
    status: 'Menunggu',
    lastUpdated: 'Sesuai Jadwal'
  }
];

export default function TrashPickupSchedule() {
  const [selectedRt, setSelectedRt] = useState<string>('Semua');
  const [reminderRt, setReminderRt] = useState('');
  const [reminderPhone, setReminderPhone] = useState('');
  const [reportRt, setReportRt] = useState('RT 01 / RW 01');
  const [reportNote, setReportNote] = useState('');
  const [reminderActive, setReminderActive] = useState(false);

  const filtered = selectedRt === 'Semua' 
    ? SCHEDULE_DATA 
    : SCHEDULE_DATA.filter(s => s.rtRw.includes(selectedRt));

  const handleToggleReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderPhone.trim()) {
      showToast('Masukkan No. WhatsApp', 'Nomor WA diperlukan untuk pengiriman notifikasi pengangkutan.', 'warning');
      return;
    }
    setReminderActive(true);
    showToast('Pengingat Berhasil Diaktifkan!', `Pengingat jadwal pengangkutan sampah untuk ${reminderRt || 'RT Anda'} akan dikirimkan H-1 ke ${reminderPhone}.`, 'success');
  };

  const handleSendUrgentReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportNote.trim()) {
      showToast('Tuliskan Laporan', 'Mohon jelaskan lokasi tumpukan sampah yang perlu dijemput.', 'warning');
      return;
    }
    const msg = `*LAPORAN TUMPUKAN SAMPAH DARURAT TPS3R*\n\n` +
      `📍 *Wilayah:* ${reportRt}\n` +
      `📝 *Catatan Tambahan:* ${reportNote}\n\n` +
      `Mohon tim driver Armada BUMDESA Waskita dapat menjadwalkan penjemputan khusus. Terima kasih!`;

    window.open(`https://wa.me/6282134567890?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Laporan Dikirim ke Driver', 'Pesan penjemputan khusus telah diteruskan via WhatsApp.', 'success');
    setReportNote('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Sistem Operasional TPS3R Live</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Jadwal Pengangkutan Sampah Interaktif Per-RT/RW
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pantau pergerakan truk armada penjemput sampah secara real-time dan aktifkan pengingat WhatsApp otomatis.
          </p>
        </div>

        {/* RT Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['Semua', 'RT 01', 'RT 02', 'RT 03', 'RT 04'].map(rt => (
            <button
              key={rt}
              onClick={() => setSelectedRt(rt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                selectedRt === rt
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {rt}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Live Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div 
            key={item.id}
            className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">{item.rtRw}</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.dukuh}</h3>
              </div>

              {item.status === 'Otw' && (
                <span className="bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950" /> ARMADA SEDANG OT W
                </span>
              )}
              {item.status === 'Selesai' && (
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase px-2.5 py-1 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> SELESAI
                </span>
              )}
              {item.status === 'Menunggu' && (
                <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px] uppercase px-2.5 py-1 rounded-md">
                  JADWAL BERIKUTNYA
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Hari Operasional:</span>
                <span className="font-bold">{item.days.join(', ')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Jam Operasional:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.timeSlot}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1 font-medium">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> {item.driverName} ({item.truckPlate})
              </span>
              <span className="text-[10px] italic">{item.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Forms: WhatsApp Reminder & Urgent Pickup Laporan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        
        {/* Form 1: Pengingat WhatsApp */}
        <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-black text-sm text-slate-900 dark:text-white">Aktifkan Pengingat Pengangkutan WA</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Dapatkan pesan pengingat malam hari sebelum jadwal pengangkutan agar tempat sampah siap ditaruh di depan rumah.
          </p>

          <form onSubmit={handleToggleReminder} className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={reminderRt}
                onChange={e => setReminderRt(e.target.value)}
                className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
              >
                <option value="">Pilih RT Anda</option>
                <option value="RT 01 / RW 01">RT 01 / RW 01</option>
                <option value="RT 02 / RW 01">RT 02 / RW 01</option>
                <option value="RT 03 / RW 02">RT 03 / RW 02</option>
                <option value="RT 04 / RW 02">RT 04 / RW 02</option>
              </select>
              <input
                type="text"
                placeholder="0821xxxxxxxx"
                value={reminderPhone}
                onChange={e => setReminderPhone(e.target.value)}
                className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{reminderActive ? 'Status: Pengingat Aktif' : 'Aktifkan Pengingat Otomatis'}</span>
            </button>
          </form>
        </div>

        {/* Form 2: Laporkan Tumpukan Khusus */}
        <div className="p-5 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-black text-sm text-slate-900 dark:text-white">Request Penjemputan / Laporkan Sampah</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Ada limbah hajatan atau tumpukan tebangan pohon berlebih? Hubungi langsung petugas driver armada BUMDESA.
          </p>

          <form onSubmit={handleSendUrgentReport} className="space-y-2.5">
            <input
              type="text"
              placeholder="Detail lokasi (Contoh: Depan Rumah Bp. Marno RT 02)"
              value={reportNote}
              onChange={e => setReportNote(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Laporan Ke Petugas WA</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
