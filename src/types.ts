export type PageType = 
  | 'beranda'
  | 'cek-jadwal-booking'
  | 'tentang-kami'
  | 'layanan'
  | 'kegiatan'
  | 'pengumuman'
  | 'kontak'
  | 'auth'
  | 'dashboard'
  | 'admin-login'
  | 'admin-dashboard'
  | 'register-nasabah'
  | 'modul-fitur'
  | 'marketplace-umkm'
  | 'jadwal-sampah'
  | 'papan-loker'
  | 'booking-hajatan'
  | 'portal-relawan'
  | 'evoting-musdes'
  | 'posyandu-kesehatan'
  | 'wisata-kuliner'
  | 'simulator-sewa-gedung'
  | 'kebijakan-privasi'
  | 'syarat-ketentuan'
  | 'pusat-bantuan'
  | 'kontrol-agent-ai';

export type UserRole = 'superadmin' | 'karyawan' | 'pengguna';

export interface User {
  id: string;
  email: string;
  role?: UserRole;
  name?: string;
  phone?: string;
  nik?: string;
  nasabahId?: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  url: string;
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  category: 'bulutangkis' | 'penanaman' | 'umum';
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
  type: 'keuangan' | 'umum';
  amount?: number; // for financial announcements
}

export interface ContactFormInput {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface Transaction {
  id: string;
  tanggal: string;
  jenis: 'Masuk' | 'Keluar'; // Masuk = Setor, Keluar = Tarik Tunai
  kategori: string;
  berat: number; // kg, 0 if Tarik Tunai
  hargaPerKg: number; // 0 if Tarik Tunai
  total: number; // positive for Masuk, negative for Keluar
  petugas: string;
}

export interface AppNotification {
  id: string;
  type: 'saldo' | 'pengumuman' | 'sistem';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  amount?: number;
  author?: string;
}

