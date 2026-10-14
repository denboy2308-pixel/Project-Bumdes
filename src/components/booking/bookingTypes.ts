export type BookingStep = 'select-time' | 'input-data' | 'payment' | 'ticket';
export type PaymentMethod = 'qris' | 'bank_transfer' | 'cash';

export interface ScheduleRow {
  time: string;
  gedung: { status: 'Tersedia' | 'Booked'; label: string };
  lapangan1: { status: 'Tersedia' | 'Booked'; label: string };
  lapangan2: { status: 'Tersedia' | 'Booked'; label: string };
  lapangan3: { status: 'Tersedia' | 'Booked'; label: string };
}

export interface PromoVoucher {
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // 10 for 10%, or 10000 for Rp10.000
  minHours?: number;
  description: string;
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const AVAILABLE_PROMOS: PromoVoucher[] = [
  {
    code: 'BUMDES10',
    title: 'Diskon 10% Spesial Warga',
    discountType: 'percentage',
    discountValue: 10,
    description: 'Diskon 10% dari total sewa untuk warga & komunitas Desa Waru.',
  },
  {
    code: 'WARUHEMAT',
    title: 'Potongan Rp10.000 Pemain Baru',
    discountType: 'fixed',
    discountValue: 10000,
    description: 'Potongan langsung Rp10.000 untuk pengguna baru fasilitas olahraga.',
  },
  {
    code: 'KUMPOL50',
    title: 'Hemat Rp15.000 Main 2+ Jam',
    discountType: 'fixed',
    discountValue: 15000,
    minHours: 2,
    description: 'Hemat Rp15.000 khusus durasi reservasi minimal 2 jam.',
  },
  {
    code: 'MEMBERWARU',
    title: 'Diskon 15% Member Rutin',
    discountType: 'percentage',
    discountValue: 15,
    description: 'Diskon 15% untuk anggota klub bulutangkis binaan BUMDES.',
  },
];

export const ADDON_OPTIONS: AddonOption[] = [
  {
    id: 'shuttlecock',
    name: '1 Slop Shuttlecock BUMDES Pro (12 pcs)',
    price: 35000,
    description: 'Kok bulu angsa standar turnamen PBSI.',
  },
  {
    id: 'racket_rent',
    name: 'Sewa Raket Badminton (2 Unit)',
    price: 15000,
    description: 'Tarikan senar 26 lbs siap pakai.',
  },
  {
    id: 'sound_mic',
    name: 'Sound System Mini & Wireless Mic',
    price: 25000,
    description: 'Cocok untuk rapat, senam warga, atau instruktur.',
  },
  {
    id: 'extra_lighting',
    name: 'Lampu Sorot Malam Ekstra (LED 200W)',
    price: 20000,
    description: 'Pencahayaan ekstra terang untuk pertandingan malam.',
  },
];

export const MASTER_SCHEDULE_DATA: ScheduleRow[] = [
  {
    time: '08:00',
    gedung: { status: 'Tersedia', label: 'Tersedia' },
    lapangan1: { status: 'Booked', label: 'Booked' },
    lapangan2: { status: 'Tersedia', label: 'Tersedia' },
    lapangan3: { status: 'Tersedia', label: 'Tersedia' },
  },
  {
    time: '09:00',
    gedung: { status: 'Booked', label: 'Booked' },
    lapangan1: { status: 'Tersedia', label: 'Tersedia' },
    lapangan2: { status: 'Booked', label: 'Booked' },
    lapangan3: { status: 'Tersedia', label: 'Tersedia' },
  },
  {
    time: '10:00',
    gedung: { status: 'Booked', label: 'Booked' },
    lapangan1: { status: 'Tersedia', label: 'Tersedia' },
    lapangan2: { status: 'Tersedia', label: 'Tersedia' },
    lapangan3: { status: 'Tersedia', label: 'Tersedia' },
  },
  {
    time: '11:00',
    gedung: { status: 'Tersedia', label: 'Tersedia' },
    lapangan1: { status: 'Booked', label: 'Booked' },
    lapangan2: { status: 'Tersedia', label: 'Tersedia' },
    lapangan3: { status: 'Tersedia', label: 'Tersedia' },
  },
  {
    time: '12:00',
    gedung: { status: 'Tersedia', label: 'Tersedia' },
    lapangan1: { status: 'Tersedia', label: 'Tersedia' },
    lapangan2: { status: 'Tersedia', label: 'Tersedia' },
    lapangan3: { status: 'Tersedia', label: 'Tersedia' },
  },
  {
    time: '13:00',
    gedung: { status: 'Tersedia', label: 'Tersedia' },
    lapangan1: { status: 'Tersedia', label: 'Tersedia' },
    lapangan2: { status: 'Tersedia', label: 'Tersedia' },
    lapangan3: { status: 'Tersedia', label: 'Tersedia' },
  },
  {
    time: '14:00',
    gedung: { status: 'Tersedia', label: 'Tersedia' },
    lapangan1: { status: 'Booked', label: 'Booked' },
    lapangan2: { status: 'Tersedia', label: 'Tersedia' },
    lapangan3: { status: 'Tersedia', label: 'Tersedia' },
  },
  {
    time: '15:00',
    gedung: { status: 'Tersedia', label: 'Tersedia' },
    lapangan1: { status: 'Booked', label: 'Booked' },
    lapangan2: { status: 'Tersedia', label: 'Tersedia' },
    lapangan3: { status: 'Tersedia', label: 'Tersedia' },
  },
  {
    time: '16:00',
    gedung: { status: 'Booked', label: 'Booked' },
    lapangan1: { status: 'Tersedia', label: 'Tersedia' },
    lapangan2: { status: 'Booked', label: 'Booked' },
    lapangan3: { status: 'Tersedia', label: 'Tersedia' },
  },
  {
    time: '17:00',
    gedung: { status: 'Tersedia', label: 'Tersedia' },
    lapangan1: { status: 'Tersedia', label: 'Tersedia' },
    lapangan2: { status: 'Tersedia', label: 'Tersedia' },
    lapangan3: { status: 'Booked', label: 'Booked' },
  },
  {
    time: '18:00',
    gedung: { status: 'Booked', label: 'Booked' },
    lapangan1: { status: 'Booked', label: 'Booked' },
    lapangan2: { status: 'Booked', label: 'Booked' },
    lapangan3: { status: 'Tersedia', label: 'Tersedia' },
  },
  {
    time: '19:00',
    gedung: { status: 'Tersedia', label: 'Tersedia' },
    lapangan1: { status: 'Tersedia', label: 'Tersedia' },
    lapangan2: { status: 'Booked', label: 'Booked' },
    lapangan3: { status: 'Tersedia', label: 'Tersedia' },
  },
  {
    time: '20:00',
    gedung: { status: 'Tersedia', label: 'Tersedia' },
    lapangan1: { status: 'Booked', label: 'Booked' },
    lapangan2: { status: 'Tersedia', label: 'Tersedia' },
    lapangan3: { status: 'Tersedia', label: 'Tersedia' },
  },
  {
    time: '21:00',
    gedung: { status: 'Tersedia', label: 'Tersedia' },
    lapangan1: { status: 'Tersedia', label: 'Tersedia' },
    lapangan2: { status: 'Tersedia', label: 'Tersedia' },
    lapangan3: { status: 'Tersedia', label: 'Tersedia' },
  },
];

export const ALL_HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

export const PURPOSE_OPTIONS = [
  'Latihan komunitas',
  'Sparring / Pertandingan Antar-RT',
  'Latihan Rutin Bulutangkis',
  'Turnamen Desa / Kejuaraan',
  'Rapat Warga / Musyawarah',
  'Senam Sehat / Kebugaran',
  'Acara Pertemuan / Syukuran',
  'Lainnya (Tulis Sendiri)'
];
