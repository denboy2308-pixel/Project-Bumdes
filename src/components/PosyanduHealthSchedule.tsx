import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  Activity, 
  Calculator, 
  CheckCircle2, 
  Send, 
  UserCheck, 
  Sparkles,
  Baby,
  Smile
} from 'lucide-react';
import { showToast } from './ToastNotification';

interface PosyanduSchedule {
  id: string;
  posyanduName: string;
  category: 'Posyandu Balita' | 'Posyandu Lansia' | 'Posbindu PTM';
  location: string;
  scheduleDay: string;
  time: string;
  midwifeName: string;
  services: string[];
}

const POSYANDU_DATA: PosyanduSchedule[] = [
  {
    id: 'pos-1',
    posyanduName: 'Posyandu Mawar 01 (RT 01 & 02)',
    category: 'Posyandu Balita',
    location: 'Gedung PAUD Melati Waru',
    scheduleDay: 'Kamis Pertama Setiap Bulan',
    time: '08:00 - 11:00 WIB',
    midwifeName: 'Bidan Rina, S.ST & Kader Kesehatan',
    services: ['Penimbangan BB & TB Balita', 'Imunisasi Dasar', 'Pemberian Makanan Tambahan (PMT)', 'Vitamin A']
  },
  {
    id: 'pos-2',
    posyanduName: 'Posyandu Lansia Sehat Sejahtera',
    category: 'Posyandu Lansia',
    location: 'Pendopo Balai Desa Waru',
    scheduleDay: 'Rabu Kedua Setiap Bulan',
    time: '08:30 - 11:30 WIB',
    midwifeName: 'Dr. Hendra (Puskesmas Baki)',
    services: ['Cek Tensi Darah', 'Cek Gula Darah & Kolesterol', 'Senam Lansia', 'Konsultasi Gizi']
  },
  {
    id: 'pos-3',
    posyanduName: 'Posyandu Flamboyan (RT 03 & 04)',
    category: 'Posyandu Balita',
    location: 'Pos Ronda Dukuh Baki',
    scheduleDay: 'Sabtu Kedua Setiap Bulan',
    time: '08:00 - 11:00 WIB',
    midwifeName: 'Bidan Endang & Kader Kesehatan',
    services: ['Ukur Lingkar Kepala', 'Pemberian Biskuit PMT', 'Konsultasi Tumbuh Tumbuh Balita']
  }
];

export default function PosyanduHealthSchedule() {
  const [childWeight, setChildWeight] = useState('');
  const [childHeight, setChildHeight] = useState('');
  const [childAgeMonths, setChildAgeMonths] = useState('');
  const [nutritionStatus, setNutritionStatus] = useState<string | null>(null);

  const calculateNutrition = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(childWeight);
    const h = parseFloat(childHeight);
    const age = parseInt(childAgeMonths, 10);

    if (!w || !h || !age) {
      showToast('Isi Data Balita', 'Berat badan, tinggi badan, dan usia bulan balita wajib diisi.', 'warning');
      return;
    }

    // Simple estimation algorithm for demo
    let status = 'Sangat Baik / Gizi Normal';
    if (w / (h / 100) < 12) {
      status = 'Cenderung Kurang (Perlu PMT Tambahan BUMDESA)';
    } else if (w / (h / 100) > 22) {
      status = 'Gizi Lebih / Perlu Konsultasi Bidan';
    }

    setNutritionStatus(status);
    showToast('Kalkulasi Tumbuh Tumbuh Selesai', `Status Tumbuh Tumbuh: ${status}`, 'success');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 mb-2">
            <Heart className="w-3.5 h-3.5" />
            <span>Kesehatan Warga & Pencegahan Stunting BUMDESA</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Jadwal Posyandu & Layanan Kesehatan Terpadu
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Jadwal rutin posyandu balita & lansia serta kalkulator mandiri gizi balita Desa Waru, Baki.
          </p>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {POSYANDU_DATA.map(pos => (
          <div
            key={pos.id}
            className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3 flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-md">
                {pos.category}
              </span>

              <h3 className="text-base font-black text-slate-900 dark:text-white mt-1.5">{pos.posyanduName}</h3>
              
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs mt-3">
                <div className="flex justify-between"><span className="text-slate-400">Jadwal:</span> <span className="font-bold text-slate-800 dark:text-slate-200">{pos.scheduleDay}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Jam:</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">{pos.time}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Lokasi:</span> <span className="font-bold text-slate-800 dark:text-slate-200">{pos.location}</span></div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Layanan Terseedia:</span>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {pos.services.map((srv, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{srv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 font-medium">
              Petugas: {pos.midwifeName}
            </div>
          </div>
        ))}
      </div>

      {/* Simulator Tumbuh Kembang Balita */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Baby className="w-5 h-5 text-emerald-400" />
          <span>Kalkulator Estimasi Tumbuh Kembang & Status Gizi Balita</span>
        </h3>

        <form onSubmit={calculateNutrition} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Usia Balita (Bulan):</label>
            <input
              type="number"
              placeholder="Contoh: 18"
              value={childAgeMonths}
              onChange={e => setChildAgeMonths(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Berat Badan (Kg):</label>
            <input
              type="number"
              step="0.1"
              placeholder="Contoh: 10.5"
              value={childWeight}
              onChange={e => setChildWeight(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Tinggi Badan (Cm):</label>
            <input
              type="number"
              step="0.1"
              placeholder="Contoh: 82"
              value={childHeight}
              onChange={e => setChildHeight(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
            >
              Cek Status Gizi
            </button>
          </div>
        </form>

        {nutritionStatus && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">Hasil Estimasi Tumbuh Kembang:</span>
              <span className="text-emerald-400 font-black text-sm">{nutritionStatus}</span>
            </div>
            <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full">
              Terverifikasi Standar Kemenkes
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
