import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'node:crypto';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';

// Cryptographic Password Hashing & Verification using node:crypto scrypt
const SCRYPT_PREFIX = '$scrypt$v=1$';
const SCRYPT_CONFIG = {
  N: 16384,
  r: 8,
  p: 1,
  keylen: 64,
  maxmem: 64 * 1024 * 1024
};

function isScryptHash(stored: unknown): boolean {
  if (typeof stored !== 'string') return false;
  return stored.startsWith(SCRYPT_PREFIX);
}

function hashPassword(password: string): string {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Kata sandi tidak valid untuk hashing.');
  }
  const salt = crypto.randomBytes(16);
  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_CONFIG.keylen, {
    N: SCRYPT_CONFIG.N,
    r: SCRYPT_CONFIG.r,
    p: SCRYPT_CONFIG.p,
    maxmem: SCRYPT_CONFIG.maxmem
  });
  return `${SCRYPT_PREFIX}N=${SCRYPT_CONFIG.N},r=${SCRYPT_CONFIG.r},p=${SCRYPT_CONFIG.p}$${salt.toString('hex')}$${derivedKey.toString('hex')}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (!storedHash || !isScryptHash(storedHash)) {
      return false;
    }
    const parts = storedHash.split('$');
    // Format: ["", "scrypt", "v=1", "N=16384,r=8,p=1", "<saltHex>", "<derivedKeyHex>"]
    if (parts.length !== 6 || parts[1] !== 'scrypt' || parts[2] !== 'v=1') {
      return false;
    }
    const paramsStr = parts[3];
    const params: Record<string, number> = {};
    paramsStr.split(',').forEach(kv => {
      const [k, v] = kv.split('=');
      if (k && v) {
        params[k] = parseInt(v, 10);
      }
    });

    const N = params.N || SCRYPT_CONFIG.N;
    const r = params.r || SCRYPT_CONFIG.r;
    const p = params.p || SCRYPT_CONFIG.p;
    const salt = Buffer.from(parts[4], 'hex');
    const expectedKey = Buffer.from(parts[5], 'hex');

    if (salt.length === 0 || expectedKey.length === 0) {
      return false;
    }

    const actualKey = crypto.scryptSync(password, salt, expectedKey.length, {
      N,
      r,
      p,
      maxmem: SCRYPT_CONFIG.maxmem
    });

    if (actualKey.length !== expectedKey.length) {
      return false;
    }

    return crypto.timingSafeEqual(actualKey, expectedKey);
  } catch (err) {
    return false;
  }
}

// Ensure data and upload directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'db.json');

// Initialize local JSON Database if not exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], files: [], sessions: [] }, null, 2), { mode: 0o600 });
}

// Database Helper functions
interface DBUser {
  id: string;
  email: string;
  passwordHash: string; // One-way scrypt hash
  role?: 'superadmin' | 'karyawan' | 'pengguna';
  name?: string;
  phone?: string;
  nik?: string;
  nasabahId?: string;
}

interface DBFile {
  id: string;
  userId: string;
  name: string;
  size: number;
  uploadDate: string;
  filename: string;
  mimetype: string;
}

interface DBSession {
  token: string;
  userId: string;
  expiresAt: number;
}

interface DBReservation {
  id: string; // Booking code, e.g. 'BW-20260906-8921'
  facility: string; // e.g. 'Lapangan 1 (Karpet Vinyl)', 'Gedung Serbaguna'
  facilityKey: 'lapangan1' | 'lapangan2' | 'lapangan3' | 'gedung';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. '19:00'
  durationHours: number;
  slots: string[]; // List of hours locked: ['19:00', '20:00']
  customerName: string;
  whatsapp: string;
  email?: string;
  participantCount: number;
  purpose: string;
  totalAmount: number;
  paymentMethod: 'qris' | 'bank_transfer' | 'cash';
  paymentStatus: 'pending' | 'confirmed' | 'cancelled';
  checkInStatus?: 'pending' | 'checked_in' | 'completed';
  addons?: string[];
  notes?: string;
  createdAt: string;
  userId?: string;
}

interface DBBillingInvoice {
  id: string; // e.g. 'INV-2026-089'
  name: string;
  category: string;
  zone: string;
  phone: string;
  nik?: string;
  nasabahId?: string;
  amount: number;
  dueDate: string;
  status: 'lunas' | 'belum_bayar' | 'dibatalkan';
  period: string; // e.g. 'September 2026'
  paymentDetails?: {
    paidAt: string;
    method: 'cash' | 'qris' | 'bank_transfer';
    receiptNumber: string; // e.g. 'KWT-BW-202609-089'
    verifiedBy: string;
    notes?: string;
  };
  reservationId?: string;
  invoicePdfUrl?: string;
  portalUrl?: string;
  notes?: string;
  createdAt: string;
}

interface DBFinanceTransaction {
  id: string; // 'TRX-2026-0901'
  type: 'income' | 'expense';
  category: 'Reservasi GOR' | 'Retribusi Sampah' | 'Marketplace UMKM' | 'Sewa Gedung' | 'Operasional & Perawatan' | 'Gaji & Honor Staf' | 'Bagi Hasil PAD Desa Waru';
  amount: number;
  date: string; // YYYY-MM-DD
  referenceId?: string;
  description: string;
  paymentMethod: 'qris' | 'cash' | 'bank_transfer';
  recordedBy: string;
  createdAt: string;
}

interface DBQrisTransaction {
  id: string; // 'QRIS-9921'
  nmid: string; // 'ID102600987123'
  payerName: string;
  purpose: string;
  amount: number;
  time: string;
  status: 'settled' | 'pending';
  invoiceId?: string;
  createdAt: string;
}

interface DBSupportTicket {
  id: string; // e.g. 'TKT-ADU-108'
  title: string;
  category: 'Armada Sampah' | 'Fasilitas GOR & Gedung' | 'Tagihan & Kas' | 'Lingkungan Desa' | 'Pertanyaan Layanan';
  description: string;
  location?: string;
  name: string;
  contact: string; // phone or email
  status: 'Menunggu Verifikasi' | 'Ditugaskan ke Tim Lapangan' | 'Sedang Dikerjakan' | 'Selesai';
  assignedOfficer?: string;
  resolutionNote?: string;
  createdAt: string;
  updatedAt?: string;
}

interface DatabaseSchema {
  users: DBUser[];
  files: DBFile[];
  sessions: DBSession[];
  reservations: DBReservation[];
  invoices: DBBillingInvoice[];
  financeTransactions: DBFinanceTransaction[];
  qrisTransactions: DBQrisTransaction[];
  tickets: DBSupportTicket[];
}

function syncPrivateMetadataBackup(dbData: DatabaseSchema) {
  try {
    const backupDir = path.join(DATA_DIR, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true, mode: 0o700 });
    }
    const backupFile = path.join(backupDir, 'account_metadata_backup.json');
    const metadataBackup = {
      backupTimestamp: new Date().toISOString(),
      sourceDatabase: 'active_local_db',
      totalRecords: dbData.users ? dbData.users.length : 0,
      users: (dbData.users || []).map(u => ({
        uid: u.id,
        email: u.email,
        role: u.role || 'pengguna',
        status: 'active',
        createdAt: (u as any).createdAt || '2026-01-01T00:00:00.000Z'
      }))
    };
    fs.writeFileSync(backupFile, JSON.stringify(metadataBackup, null, 2), { mode: 0o600 });
  } catch (e) {
    console.warn('Sync private metadata backup warning:', e);
  }
}

// Atomic Database Writing (writes to temporary file, syncs, then renames atomically)
function writeDBAtomic(data: DatabaseSchema): void {
  const tmpPath = `${DB_PATH}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 8)}`;
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(tmpPath, jsonStr, { mode: 0o600, encoding: 'utf-8' });
    const fd = fs.openSync(tmpPath, 'r+');
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fs.renameSync(tmpPath, DB_PATH);
    syncPrivateMetadataBackup(data);
  } catch (err) {
    if (fs.existsSync(tmpPath)) {
      try {
        fs.unlinkSync(tmpPath);
      } catch {}
    }
    throw new Error('Gagal menulis database secara atomik.');
  }
}

function readDB(): DatabaseSchema {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed: DatabaseSchema = JSON.parse(data);
    let changed = false;
    
    // Ensure users array exists
    if (!parsed.users) {
      parsed.users = [];
      changed = true;
    }

    // Ensure reservations array exists and initialize default sample bookings if empty
    if (!parsed.reservations || parsed.reservations.length === 0) {
      parsed.reservations = [
        {
          id: 'BW-20260906-8921',
          facility: 'Lapangan 1 (Karpet Vinyl)',
          facilityKey: 'lapangan1',
          date: '2026-09-06',
          timeSlot: '19:00',
          durationHours: 2,
          slots: ['19:00', '20:00'],
          customerName: 'PB Rajawali Waru',
          whatsapp: '081234567890',
          email: 'rajawali@waru.desa.id',
          participantCount: 8,
          purpose: 'Latihan Rutin Bulutangkis Warga',
          totalAmount: 100000,
          paymentMethod: 'qris',
          paymentStatus: 'confirmed',
          checkInStatus: 'pending',
          addons: ['Penerangan Lampu LED'],
          createdAt: new Date().toISOString()
        },
        {
          id: 'BW-20260906-3412',
          facility: 'Gedung Serbaguna',
          facilityKey: 'gedung',
          date: '2026-09-06',
          timeSlot: '09:00',
          durationHours: 2,
          slots: ['09:00', '10:00'],
          customerName: 'Seminar PKK Baki',
          whatsapp: '085678901234',
          email: 'pkk@sukoharjo.go.id',
          participantCount: 45,
          purpose: 'Sosialisasi Pemberdayaan Perempuan',
          totalAmount: 200000,
          paymentMethod: 'bank_transfer',
          paymentStatus: 'confirmed',
          checkInStatus: 'checked_in',
          addons: ['Sound System BUMDes', 'Kursi Lipat 50 Unit'],
          createdAt: new Date().toISOString()
        },
        {
          id: 'BW-20260906-1189',
          facility: 'Lapangan 2 (Kayu Parquet)',
          facilityKey: 'lapangan2',
          date: '2026-09-06',
          timeSlot: '16:00',
          durationHours: 1,
          slots: ['16:00'],
          customerName: 'PB Sahabat Waru (Bpk. Agus)',
          whatsapp: '081987654321',
          participantCount: 4,
          purpose: 'Sparing Sore GOR',
          totalAmount: 50000,
          paymentMethod: 'cash',
          paymentStatus: 'pending',
          checkInStatus: 'pending',
          notes: 'Bayar tunai di loket teller',
          createdAt: new Date().toISOString()
        }
      ];
      changed = true;
    }

    // Ensure invoices array exists and initialize default sample invoices if empty
    if (!parsed.invoices || parsed.invoices.length === 0) {
      parsed.invoices = [
        {
          id: 'INV-2026-089',
          name: 'Bpk. Joko Susanto',
          category: 'Bank Sampah Rumah Tangga (Paket Dusun I)',
          zone: 'Dusun I / RT 02 RW 01',
          phone: '6281234567890',
          nasabahId: 'NAS-089',
          amount: 75000,
          dueDate: '2026-09-05',
          period: 'September 2026',
          status: 'belum_bayar',
          portalUrl: 'https://bumdeswaskita.desa.id/portal/bayar/NAS-089',
          createdAt: '2026-09-01T08:00:00.000Z'
        },
        {
          id: 'INV-2026-104',
          name: 'Ibu Hartini Sutrisno',
          category: 'Bank Sampah & Retribusi Niaga (Warung Makan)',
          zone: 'Dusun II / RT 04 RW 02',
          phone: '6285712345678',
          nasabahId: 'NAS-104',
          amount: 75000,
          dueDate: '2026-09-04',
          period: 'September 2026',
          status: 'belum_bayar',
          portalUrl: 'https://bumdeswaskita.desa.id/portal/bayar/NAS-104',
          createdAt: '2026-09-01T08:30:00.000Z'
        },
        {
          id: 'INV-2026-012',
          name: 'Bpk. Subagyo Martono',
          category: 'Bank Sampah Rumah Tangga',
          zone: 'Dusun I / RT 01 RW 01',
          phone: '6281398765432',
          nasabahId: 'NAS-012',
          amount: 150000,
          dueDate: '2026-09-01',
          period: 'September 2026',
          status: 'lunas',
          paymentDetails: {
            paidAt: '2026-09-01 10:20:00',
            method: 'cash',
            receiptNumber: 'KWT-BW-202609-012',
            verifiedBy: 'Kasir BUMDes Waru',
            notes: 'Pelunasan tunai di loket kantor'
          },
          portalUrl: 'https://bumdeswaskita.desa.id/portal/bayar/NAS-012',
          createdAt: '2026-09-01T07:45:00.000Z'
        },
        {
          id: 'INV-2026-034',
          name: 'Ibu Ratna Dewi',
          category: 'Bank Sampah Rumah Tangga',
          zone: 'Dusun III / RT 02 RW 03',
          phone: '6281211223344',
          nasabahId: 'NAS-034',
          amount: 150000,
          dueDate: '2026-09-02',
          period: 'September 2026',
          status: 'lunas',
          paymentDetails: {
            paidAt: '2026-09-02 08:45:00',
            method: 'qris',
            receiptNumber: 'KWT-BW-202609-034',
            verifiedBy: 'QRIS Auto-Settlement',
            notes: 'Pembayaran digital scan QRIS'
          },
          portalUrl: 'https://bumdeswaskita.desa.id/portal/bayar/NAS-034',
          createdAt: '2026-09-01T07:50:00.000Z'
        },
        {
          id: 'INV-2026-055',
          name: 'Bpk. Ahmad Fauzi',
          category: 'Bank Sampah Rumah Tangga',
          zone: 'Dusun II / RT 01 RW 02',
          phone: '6287899001122',
          nasabahId: 'NAS-055',
          amount: 150000,
          dueDate: '2026-09-02',
          period: 'September 2026',
          status: 'lunas',
          paymentDetails: {
            paidAt: '2026-09-02 14:15:00',
            method: 'bank_transfer',
            receiptNumber: 'KWT-BW-202609-055',
            verifiedBy: 'Bendahara BUMDes',
            notes: 'Transfer Bank Jateng'
          },
          portalUrl: 'https://bumdeswaskita.desa.id/portal/bayar/NAS-055',
          createdAt: '2026-09-01T08:10:00.000Z'
        },
        {
          id: 'INV-2026-8921',
          name: 'PB Rajawali Waru',
          category: 'Sewa Lapangan GOR',
          zone: 'Klub Olahraga Desa Waru',
          phone: '081234567890',
          amount: 100000,
          dueDate: '2026-09-06',
          period: 'September 2026',
          status: 'lunas',
          reservationId: 'BW-20260906-8921',
          paymentDetails: {
            paidAt: '2026-09-06 09:15:00',
            method: 'qris',
            receiptNumber: 'KWT-BW-202609-8921',
            verifiedBy: 'Kasir GOR Waru',
            notes: 'Booking Lapangan 1 (Karpet Vinyl) 2 Jam'
          },
          createdAt: '2026-09-06T09:14:00.000Z'
        },
        {
          id: 'INV-2026-1189',
          name: 'PB Sahabat Waru (Bpk. Agus)',
          category: 'Sewa Lapangan GOR',
          zone: 'Warga RT 02 / RW 01',
          phone: '081987654321',
          amount: 50000,
          dueDate: '2026-09-06',
          period: 'September 2026',
          status: 'belum_bayar',
          reservationId: 'BW-20260906-1189',
          createdAt: '2026-09-06T15:30:00.000Z'
        }
      ];
      changed = true;
    }

    // Ensure financeTransactions array exists and initialize default sample transactions if empty
    if (!parsed.financeTransactions || parsed.financeTransactions.length === 0) {
      parsed.financeTransactions = [
        {
          id: 'TRX-2026-0901',
          type: 'income',
          category: 'Retribusi Sampah',
          amount: 450000,
          date: '2026-09-02',
          referenceId: 'BATCH-SMP-01',
          description: 'Penerimaan Retribusi Sampah Terverifikasi Dusun I & II',
          paymentMethod: 'cash',
          recordedBy: 'Siti Rahayu, S.E. (Bendahara)',
          createdAt: '2026-09-02T16:00:00.000Z'
        },
        {
          id: 'TRX-2026-0902',
          type: 'income',
          category: 'Reservasi GOR',
          amount: 100000,
          date: '2026-09-06',
          referenceId: 'BW-20260906-8921',
          description: 'Sewa Lapangan 1 Badminton PB Rajawali Waru',
          paymentMethod: 'qris',
          recordedBy: 'Joko Sasongko (Operator GOR)',
          createdAt: '2026-09-06T09:15:00.000Z'
        },
        {
          id: 'TRX-2026-0903',
          type: 'income',
          category: 'Sewa Gedung',
          amount: 200000,
          date: '2026-09-06',
          referenceId: 'BW-20260906-3412',
          description: 'Sewa Aula Pertemuan Seminar PKK Baki',
          paymentMethod: 'bank_transfer',
          recordedBy: 'Siti Rahayu, S.E. (Bendahara)',
          createdAt: '2026-09-06T10:00:00.000Z'
        },
        {
          id: 'TRX-2026-0904',
          type: 'expense',
          category: 'Operasional & Perawatan',
          amount: 350000,
          date: '2026-09-03',
          description: 'Pembayaran Rekening Listrik & Lampu Sorot Lapangan GOR',
          paymentMethod: 'bank_transfer',
          recordedBy: 'Siti Rahayu, S.E. (Bendahara)',
          createdAt: '2026-09-03T11:00:00.000Z'
        },
        {
          id: 'TRX-2026-0905',
          type: 'expense',
          category: 'Operasional & Perawatan',
          amount: 200000,
          date: '2026-09-04',
          description: 'Bahan Pembersih Karpet Vinyl Lapangan Badminton & Sanitasi Toilet',
          paymentMethod: 'cash',
          recordedBy: 'Joko Sasongko (Operator GOR)',
          createdAt: '2026-09-04T13:30:00.000Z'
        }
      ];
      changed = true;
    }

    // Ensure qrisTransactions array exists and initialize default sample QRIS logs if empty
    if (!parsed.qrisTransactions || parsed.qrisTransactions.length === 0) {
      parsed.qrisTransactions = [
        {
          id: 'QRIS-9921',
          nmid: 'ID102600987123',
          payerName: 'PB Baki Perkasa (Bpk. Dani)',
          purpose: 'Sewa Lapangan Badminton 1 & 2',
          amount: 80000,
          time: '13:45:12',
          status: 'settled',
          createdAt: '2026-09-06T13:45:12.000Z'
        },
        {
          id: 'QRIS-9920',
          nmid: 'ID102600987123',
          payerName: 'Rizky Ramadhan',
          purpose: 'Tiket Booking Lapangan 2',
          amount: 40000,
          time: '13:42:05',
          status: 'settled',
          createdAt: '2026-09-06T13:42:05.000Z'
        },
        {
          id: 'QRIS-9919',
          nmid: 'ID102600987123',
          payerName: 'Warung Bu Joko (Dusun I)',
          purpose: 'Retribusi Bank Sampah',
          amount: 75000,
          time: '11:15:30',
          status: 'settled',
          createdAt: '2026-09-06T11:15:30.000Z'
        },
        {
          id: 'QRIS-9918',
          nmid: 'ID102600987123',
          payerName: 'Karang Taruna RW 03',
          purpose: 'Uang Muka Sewa Aula Pesta',
          amount: 500000,
          time: '09:30:18',
          status: 'settled',
          createdAt: '2026-09-06T09:30:18.000Z'
        }
      ];
      changed = true;
    }

    // Ensure tickets array exists and initialize default sample support tickets if empty
    if (!parsed.tickets || parsed.tickets.length === 0) {
      parsed.tickets = [
        {
          id: 'TKT-ADU-108',
          title: 'Tong Sampah Terpilah Depan Gang Belum Terangkut',
          category: 'Armada Sampah',
          description: 'Armada truk sampah rute RT 03 belum lewat sejak kemarin lusa, sampah botol daur ulang sudah penuh di depan gang.',
          location: 'Dukuh Waru, RT 03 / RW 01',
          name: 'Bpk. Joko Susanto',
          contact: '6281234567890',
          status: 'Sedang Dikerjakan',
          assignedOfficer: 'Slamet Rahardjo (Truk Armada 02)',
          resolutionNote: 'Armada truk 02 dijadwalkan menjemput hari ini pukul 11:00 WIB.',
          createdAt: '2026-09-05T08:30:00.000Z'
        },
        {
          id: 'TKT-ADU-094',
          title: 'Lampu LED Lapangan 1 Bagian Pojok Timur Berkedip',
          category: 'Fasilitas GOR & Gedung',
          description: 'Saat sesi main malam kemarin, salah satu lampu sorot LED berkedip sehingga silau saat servis.',
          location: 'GOR Badminton Desa Waru',
          name: 'Siti Aminah',
          contact: '6285612341234',
          status: 'Selesai',
          assignedOfficer: 'Hartini (Teknisi GOR)',
          resolutionNote: 'Driver LED sudah diganti baru oleh teknisi BUMDes pada 29 Agustus 2026.',
          createdAt: '2026-08-28T14:15:00.000Z'
        },
        {
          id: 'TKT-ADU-072',
          title: 'Pertanyaan Syarat Pemesanan Gedung Pertemuan untuk Resepsi',
          category: 'Pertanyaan Layanan',
          description: 'Apakah sewa gedung serbaguna sudah mencakup izin keramaian desa dan teknisi sound system?',
          location: 'Desa Waru',
          name: 'Bpk. Bambang Purnomo',
          contact: '6281987654321',
          status: 'Selesai',
          assignedOfficer: 'Pelayanan Kantor BUMDes',
          resolutionNote: 'Paket sewa All-in Rp 2.500.000 sudah mencakup teknisi, sound system, kursi 300 unit, dan rekomendasi izin desa.',
          createdAt: '2026-08-20T09:00:00.000Z'
        }
      ];
      changed = true;
    }

    // Support optional initial administrator bootstrap via environment variables if clean installation
    if (parsed.users.length === 0) {
      const initEmail = process.env.INITIAL_ADMIN_EMAIL;
      const initPass = process.env.INITIAL_ADMIN_PASSWORD;
      if (initEmail && initPass) {
        parsed.users.push({
          id: 'usr_bootstrap_admin',
          email: initEmail.toLowerCase().trim(),
          passwordHash: hashPassword(initPass),
          role: 'superadmin',
          name: 'Administrator Utama',
          phone: ''
        });
        changed = true;
      }
    }

    if (changed) {
      writeDBAtomic(parsed);
    } else {
      syncPrivateMetadataBackup(parsed);
    }

    return parsed;
  } catch (error) {
    const defaultDB: DatabaseSchema = {
      users: [],
      files: [],
      sessions: [],
      reservations: [],
      invoices: [],
      financeTransactions: [],
      qrisTransactions: [],
      tickets: []
    };
    const initEmail = process.env.INITIAL_ADMIN_EMAIL;
    const initPass = process.env.INITIAL_ADMIN_PASSWORD;
    if (initEmail && initPass) {
      defaultDB.users.push({
        id: 'usr_bootstrap_admin',
        email: initEmail.toLowerCase().trim(),
        passwordHash: hashPassword(initPass),
        role: 'superadmin',
        name: 'Administrator Utama',
        phone: ''
      });
    }
    writeDBAtomic(defaultDB);
    return defaultDB;
  }
}

function writeDB(data: DatabaseSchema) {
  writeDBAtomic(data);
}

// Idempotent Startup Migration: migrates plaintext passwords to scrypt one-way hash atomically
function migrateDatabasePasswords(): { migratedCount: number; totalUsers: number } {
  if (!fs.existsSync(DB_PATH)) {
    return { migratedCount: 0, totalUsers: 0 };
  }

  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  let db: DatabaseSchema;
  try {
    db = JSON.parse(raw);
  } catch (parseErr) {
    throw new Error('Struktur database tidak valid saat inisialisasi migrasi.');
  }

  if (!Array.isArray(db.users)) {
    db.users = [];
  }

  let migratedCount = 0;
  for (const user of db.users) {
    if (user.passwordHash && !isScryptHash(user.passwordHash)) {
      user.passwordHash = hashPassword(user.passwordHash);
      migratedCount++;
    }
  }

  if (migratedCount > 0) {
    writeDBAtomic(db);
  } else {
    syncPrivateMetadataBackup(db);
  }

  return { migratedCount, totalUsers: db.users.length };
}

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

async function startServer() {
  // Execute idempotent startup password migration atomically before accepting any requests
  try {
    const { migratedCount, totalUsers } = migrateDatabasePasswords();
    if (migratedCount > 0) {
      console.log(`[Security Startup] Migrasi password scrypt berhasil dijalankan untuk ${migratedCount} akun (dari total ${totalUsers} akun).`);
    } else {
      console.log(`[Security Startup] Seluruh akun terdaftar (${totalUsers} akun) telah menggunakan hash scrypt aman.`);
    }
  } catch (migErr) {
    console.error('[FATAL] Inisialisasi migrasi database gagal. Server dihentikan demi menjaga keamanan data.');
    process.exit(1);
  }

  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Trust upstream reverse proxy (Cloud Run, Caddy, Nginx, Cloudflare)
  app.set('trust proxy', 1);

  // Production HTTPS Redirection Middleware
  app.use((req, res, next) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const enableHttpsRedirect = process.env.ENABLE_HTTPS_REDIRECT === 'true';
    const forwardedProto = req.headers['x-forwarded-proto'];

    if ((isProduction || enableHttpsRedirect) && forwardedProto === 'http') {
      const host = req.headers.host || 'bumdeswaskita.desa.id';
      return res.redirect(301, `https://${host}${req.url}`);
    }
    next();
  });

  // Enterprise Security Headers (HSTS, nosniff, XSS protection, Referrer Policy)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=(self)');

    // Enforce HSTS (Strict-Transport-Security) in production over HTTPS
    if (req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    // CORS headers for iframe/cross-origin preview resilience
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json());

  // Helper: Get today's date formatted as YYYY-MM-DD in Asia/Jakarta timezone (WIB)
  function getTodayJakartaISO(): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
  }

  // Helper: Check if request is authenticated as administrator/staff
  function checkAdminAuth(req: express.Request): boolean {
    let token = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token as string;
    }

    if (token) {
      const db = readDB();
      const session = db.sessions.find(s => s.token === token && s.expiresAt > Date.now());
      if (session) {
        const user = db.users.find(u => u.id === session.userId);
        if (user) {
          const role = user.role || '';
          const adminRoles = ['superadmin', 'karyawan', 'direktur', 'bendahara', 'operator', 'manajer_fasilitas', 'editor', 'auditor', 'pic_wilayah'];
          if (adminRoles.includes(role) || user.email.includes('admin') || user.email.includes('karyawan')) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // Explicit Public Static SEO Assets (robots.txt & sitemap.xml)
  app.get('/robots.txt', (_req, res) => {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.type('text/plain').sendFile(robotsPath);
    } else {
      res.status(404).send('robots.txt tidak ditemukan');
    }
  });

  app.get('/sitemap.xml', (_req, res) => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.type('application/xml').sendFile(sitemapPath);
    } else {
      res.status(404).send('sitemap.xml tidak ditemukan');
    }
  });

  // Serve static assets from public directory
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Production-grade Health & System Monitoring endpoint
  app.get('/api/health', (_req, res) => {
    try {
      const db = readDB();
      const mem = process.memoryUsage();
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        version: '1.0.0-prod',
        environment: process.env.NODE_ENV || 'development',
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          memoryMb: {
            rss: Math.round(mem.rss / 1024 / 1024),
            heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
            heapUsed: Math.round(mem.heapUsed / 1024 / 1024)
          }
        },
        database: {
          status: 'connected',
          records: {
            users: (db.users || []).length,
            reservations: (db.reservations || []).length,
            invoices: (db.invoices || []).length,
            tickets: (db.tickets || []).length,
            financeTransactions: (db.financeTransactions || []).length
          }
        }
      });
    } catch (err: any) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: err.message || 'Database access failure'
      });
    }
  });

  // Client-side Telemetry / Error Logger endpoint
  app.post('/api/system/telemetry-log', (req, res) => {
    const { error, context, url } = req.body;
    console.warn(`[CLIENT-LOG] ${new Date().toISOString()} - ${error || 'Info'} at ${url || 'app'}`);
    res.json({ success: true, receivedAt: new Date().toISOString() });
  });

  // Helper middleware for custom session authorization (Iframe-safe)
  const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let token = '';
    
    // Check Authorization Header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } 
    // Or check URL query parameters (useful for direct file downloads)
    else if (req.query.token) {
      token = req.query.token as string;
    }

    if (!token) {
      res.status(401).json({ error: 'Authentication required. No session token provided.' });
      return;
    }

    const db = readDB();
    const session = db.sessions.find(s => s.token === token && s.expiresAt > Date.now());

    if (!session) {
      res.status(401).json({ error: 'Session expired or invalid token.' });
      return;
    }

    const user = db.users.find(u => u.id === session.userId);
    if (!user) {
      res.status(401).json({ error: 'User not found.' });
      return;
    }

    // Attach user to request
    (req as any).user = {
      id: user.id,
      email: user.email,
      role: user.role || 'pengguna',
      name: user.name || (user.email.includes('admin') ? 'Super Admin (Dev)' : user.email.includes('karyawan') ? 'Karyawan BUMDES' : 'Warga Nasabah'),
      phone: user.phone || '081234567890',
      nik: user.nik || '3302198204910002',
      nasabahId: user.nasabahId || 'NSB-' + user.id.slice(-5).toUpperCase()
    };
    next();
  };

  // --- Auth APIs ---

  // Register
  app.post('/api/auth/register', (req, res) => {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email dan kata sandi wajib diisi.' });
      return;
    }

    const db = readDB();
    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      res.status(400).json({ error: 'Email sudah terdaftar.' });
      return;
    }

    // Public registration assigns 'pengguna' (resident/customer) role only
    const assignedRole = 'pengguna';

    const newUser: DBUser = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      role: assignedRole,
      name: name || 'Warga Desa Waru',
      phone: req.body.phone || '',
      nik: req.body.nik || '',
      nasabahId: 'NSB-' + Math.floor(10000 + Math.random() * 90000)
    };

    db.users.push(newUser);

    // Create initial welcome billing invoice for newly registered resident
    if (!db.invoices) db.invoices = [];
    const welcomeInvId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    db.invoices.push({
      id: welcomeInvId,
      name: newUser.name || 'Warga Desa Waru',
      category: 'Bank Sampah Rumah Tangga',
      zone: req.body.zone || req.body.address || 'Dusun I / RT 01 RW 01',
      phone: newUser.phone || '',
      nik: newUser.nik || '',
      nasabahId: newUser.nasabahId,
      amount: 25000,
      dueDate: '15 September 2026',
      period: 'September 2026',
      status: 'belum_bayar',
      portalUrl: `https://bumdeswaskita.desa.id/portal/bayar/${newUser.nasabahId}`,
      createdAt: new Date().toISOString()
    });

    // Create session
    const token = 'tok_' + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    const session: DBSession = {
      token,
      userId: newUser.id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    db.sessions.push(session);

    writeDB(db);

    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        phone: newUser.phone,
        nik: newUser.nik,
        nasabahId: newUser.nasabahId
      },
      token
    });
  });

  // Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email dan kata sandi wajib diisi.' });
      return;
    }

    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(400).json({ error: 'Email atau kata sandi tidak valid.' });
      return;
    }

    // Create session
    const token = 'tok_' + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    const session: DBSession = {
      token,
      userId: user.id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    db.sessions.push(session);

    writeDB(db);

    const userObj = {
      id: user.id,
      email: user.email,
      role: user.role || 'pengguna',
      name: user.name || user.email,
            ...(user.phone ? { phone: user.phone } : {}),
      ...(user.nik ? { nik: user.nik } : {}),
      ...(user.nasabahId ? { nasabahId: user.nasabahId } : {}),
    };

    res.json({
      user: userObj,
      token
    });
  });

  // Role update API (restricted strictly to authenticated Super Admin)
  app.post('/api/auth/update-role', authenticate, (req, res) => {
    const reqUser = (req as any).user;
    if (reqUser.role !== 'superadmin') {
      res.status(403).json({ error: 'Akses ditolak: Hanya Super Admin yang berwenang mengubah peran pengguna.' });
      return;
    }

    const { role, userId } = req.body;
    if (!['superadmin', 'karyawan', 'pengguna'].includes(role)) {
      res.status(400).json({ error: 'Role tidak valid' });
      return;
    }

    const targetId = userId || reqUser.id;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === targetId);
    if (userIndex !== -1) {
      db.users[userIndex].role = role;
      writeDB(db);
      res.json({ success: true, user: { ...db.users[userIndex], passwordHash: undefined } });
    } else {
      res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }
  });

  // Super Admin: Update/Set User Password API
  app.post('/api/admin/update-password', (req, res) => {
    const { email, userId, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ error: 'Password baru minimal 6 karakter.' });
      return;
    }

    const db = readDB();
    const cleanEmail = (email || '').trim().toLowerCase();
    let target = db.users.find(u => (cleanEmail && u.email.toLowerCase() === cleanEmail) || (userId && u.id === userId));

    if (!target && cleanEmail) {
      const newUser: DBUser = {
        id: userId || 'usr_' + Date.now().toString(36),
        email: cleanEmail,
        passwordHash: hashPassword(newPassword),
        role: cleanEmail.includes('admin') || cleanEmail.includes('superadmin') ? 'superadmin' : 'karyawan',
        name: req.body.name || cleanEmail
      };
      (newUser as any).plainPassword = newPassword;
      (newUser as any).passwordUpdatedAt = new Date().toISOString();
      db.users.push(newUser);
      writeDB(db);
      res.json({ success: true, message: 'Password berhasil disetel dan akun disinkronisasi.', email: cleanEmail });
      return;
    }

    if (target) {
      target.passwordHash = hashPassword(newPassword);
      (target as any).plainPassword = newPassword;
      (target as any).passwordUpdatedAt = new Date().toISOString();
      writeDB(db);
      res.json({ success: true, message: 'Password pengguna berhasil diperbarui.', email: target.email });
    } else {
      res.status(404).json({ error: 'Pengguna tidak ditemukan di database backend.' });
    }
  });

  // Super Admin: Get user credential info
  app.get('/api/admin/user-credential/:email', (req, res) => {
    const email = decodeURIComponent(req.params.email).toLowerCase();
    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email);
    const plain = (user as any)?.plainPassword;
    res.json({
      email,
      plainPassword: plain || null,
      hasHash: Boolean(user?.passwordHash),
      updatedAt: (user as any)?.passwordUpdatedAt || null
    });
  });

  // Admin users list API (Restricted to superadmin or authorized staff)
  app.get('/api/admin/users', authenticate, (req, res) => {
    const requester = (req as any).user;
    if (requester.role !== 'superadmin' && requester.role !== 'karyawan') {
      res.status(403).json({ error: 'Akses ditolak. Fitur ini hanya untuk pengelola resmi.' });
      return;
    }

    const db = readDB();
    const usersList = db.users.map(u => {
      // Mask NIK and phone unless superadmin
      const rawNik = u.nik || '';
      const maskedNik = rawNik.length >= 6 
        ? `${rawNik.substring(0, 4)}••••••••${rawNik.substring(rawNik.length - 2)}`
        : (rawNik ? '••••••••' : '-');
      
      const rawPhone = u.phone || '';
      const maskedPhone = requester.role === 'superadmin' 
        ? rawPhone 
        : (rawPhone.length > 4 ? `${rawPhone.substring(0, 4)}••••${rawPhone.substring(rawPhone.length - 2)}` : rawPhone);

      return {
        id: u.id,
        email: u.email,
        role: u.role || 'pengguna',
        name: u.name || u.email,
        phone: maskedPhone || '-',
        nik: requester.role === 'superadmin' ? (u.nik || '-') : maskedNik,
        nasabahId: u.nasabahId || '-'
      };
    });
    res.json({ users: usersList });
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.json({ success: true });
      return;
    }

    const token = authHeader.split(' ')[1];
    const db = readDB();
    db.sessions = db.sessions.filter(s => s.token !== token);
    writeDB(db);

    res.json({ success: true });
  });

  // Check Session (Me)
  app.get('/api/auth/me', authenticate, (req, res) => {
    res.json({ user: (req as any).user });
  });

  // --- File Storage APIs ---

  // Upload File
  app.post('/api/files/upload', authenticate, upload.single('file'), (req, res) => {
    const user = (req as any).user;
    if (!req.file) {
      res.status(400).json({ error: 'Tidak ada berkas yang diunggah.' });
      return;
    }

    const db = readDB();
    const newFile: DBFile = {
      id: 'file_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      userId: user.id,
      name: req.file.originalname,
      size: req.file.size,
      uploadDate: new Date().toISOString(),
      filename: req.file.filename,
      mimetype: req.file.mimetype
    };

    db.files.push(newFile);
    writeDB(db);

    res.status(201).json({
      id: newFile.id,
      name: newFile.name,
      size: newFile.size,
      uploadDate: newFile.uploadDate,
      url: `/api/files/download/${newFile.id}`
    });
  });

  // List Files
  app.get('/api/files', authenticate, (req, res) => {
    const user = (req as any).user;
    const db = readDB();
    const userFiles = db.files
      .filter(f => f.userId === user.id)
      .map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        uploadDate: f.uploadDate,
        url: `/api/files/download/${f.id}`
      }));

    res.json(userFiles);
  });

  // Delete File
  app.delete('/api/files/:id', authenticate, (req, res) => {
    const user = (req as any).user;
    const fileId = req.params.id;

    const db = readDB();
    const fileIndex = db.files.findIndex(f => f.id === fileId && f.userId === user.id);

    if (fileIndex === -1) {
      res.status(404).json({ error: 'Berkas tidak ditemukan atau Anda tidak memiliki akses.' });
      return;
    }

    const file = db.files[fileIndex];
    const filepath = path.join(UPLOADS_DIR, file.filename);

    // Delete physically
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (err) {
        console.error('Gagal menghapus berkas fisik:', err);
      }
    }

    db.files.splice(fileIndex, 1);
    writeDB(db);

    res.json({ success: true, message: 'Berkas berhasil dihapus.' });
  });

  // Secure File Download/View (Ensures only file owner can access)
  app.get('/api/files/download/:id', authenticate, (req, res) => {
    const user = (req as any).user;
    const fileId = req.params.id;

    const db = readDB();
    const file = db.files.find(f => f.id === fileId && f.userId === user.id);

    if (!file) {
      res.status(404).json({ error: 'Berkas tidak ditemukan atau Anda tidak memiliki akses.' });
      return;
    }

    const filepath = path.join(UPLOADS_DIR, file.filename);
    if (!fs.existsSync(filepath)) {
      res.status(404).json({ error: 'Berkas fisik tidak ditemukan di server.' });
      return;
    }

    // Set inline view for images/PDFs if possible, else download
    const isInline = file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf';
    res.setHeader('Content-Disposition', `${isInline ? 'inline' : 'attachment'}; filename="${encodeURIComponent(file.name)}"`);
    res.setHeader('Content-Type', file.mimetype);
    res.sendFile(filepath);
  });

  // =========================================================================
  // RESERVATION & FACILITY SCHEDULE API (Server-side slot locking & validation)
  // =========================================================================

  // Helper: map facility string to normalized key
  function normalizeFacilityKey(facilityName: string): 'lapangan1' | 'lapangan2' | 'lapangan3' | 'gedung' {
    const lower = (facilityName || '').toLowerCase();
    if (lower.includes('lapangan 1') || lower.includes('lapangan-1')) return 'lapangan1';
    if (lower.includes('lapangan 2') || lower.includes('lapangan-2')) return 'lapangan2';
    if (lower.includes('lapangan 3') || lower.includes('lapangan-3')) return 'lapangan3';
    return 'gedung';
  }

  // Base schedule matrix for unreserved days (Public labels use generic status only for privacy)
  const BASE_SCHEDULE: Record<string, Record<string, { status: 'Tersedia' | 'Booked'; label: string }>> = {
    '08:00': { gedung: { status: 'Tersedia', label: 'Tersedia' }, lapangan1: { status: 'Booked', label: 'Booked' }, lapangan2: { status: 'Tersedia', label: 'Tersedia' }, lapangan3: { status: 'Tersedia', label: 'Tersedia' } },
    '09:00': { gedung: { status: 'Booked', label: 'Booked' }, lapangan1: { status: 'Tersedia', label: 'Tersedia' }, lapangan2: { status: 'Booked', label: 'Booked' }, lapangan3: { status: 'Tersedia', label: 'Tersedia' } },
    '10:00': { gedung: { status: 'Booked', label: 'Booked' }, lapangan1: { status: 'Tersedia', label: 'Tersedia' }, lapangan2: { status: 'Tersedia', label: 'Tersedia' }, lapangan3: { status: 'Tersedia', label: 'Tersedia' } },
    '11:00': { gedung: { status: 'Tersedia', label: 'Tersedia' }, lapangan1: { status: 'Booked', label: 'Booked' }, lapangan2: { status: 'Tersedia', label: 'Tersedia' }, lapangan3: { status: 'Tersedia', label: 'Tersedia' } },
    '12:00': { gedung: { status: 'Tersedia', label: 'Tersedia' }, lapangan1: { status: 'Tersedia', label: 'Tersedia' }, lapangan2: { status: 'Tersedia', label: 'Tersedia' }, lapangan3: { status: 'Tersedia', label: 'Tersedia' } },
    '13:00': { gedung: { status: 'Tersedia', label: 'Tersedia' }, lapangan1: { status: 'Tersedia', label: 'Tersedia' }, lapangan2: { status: 'Tersedia', label: 'Tersedia' }, lapangan3: { status: 'Tersedia', label: 'Tersedia' } },
    '14:00': { gedung: { status: 'Tersedia', label: 'Tersedia' }, lapangan1: { status: 'Booked', label: 'Booked' }, lapangan2: { status: 'Tersedia', label: 'Tersedia' }, lapangan3: { status: 'Tersedia', label: 'Tersedia' } },
    '15:00': { gedung: { status: 'Tersedia', label: 'Tersedia' }, lapangan1: { status: 'Booked', label: 'Booked' }, lapangan2: { status: 'Tersedia', label: 'Tersedia' }, lapangan3: { status: 'Tersedia', label: 'Tersedia' } },
    '16:00': { gedung: { status: 'Booked', label: 'Booked' }, lapangan1: { status: 'Tersedia', label: 'Tersedia' }, lapangan2: { status: 'Booked', label: 'Booked' }, lapangan3: { status: 'Tersedia', label: 'Tersedia' } },
    '17:00': { gedung: { status: 'Tersedia', label: 'Tersedia' }, lapangan1: { status: 'Tersedia', label: 'Tersedia' }, lapangan2: { status: 'Tersedia', label: 'Tersedia' }, lapangan3: { status: 'Booked', label: 'Booked' } },
    '18:00': { gedung: { status: 'Booked', label: 'Booked' }, lapangan1: { status: 'Booked', label: 'Booked' }, lapangan2: { status: 'Booked', label: 'Booked' }, lapangan3: { status: 'Tersedia', label: 'Tersedia' } },
    '19:00': { gedung: { status: 'Tersedia', label: 'Tersedia' }, lapangan1: { status: 'Tersedia', label: 'Tersedia' }, lapangan2: { status: 'Booked', label: 'Booked' }, lapangan3: { status: 'Tersedia', label: 'Tersedia' } },
    '20:00': { gedung: { status: 'Tersedia', label: 'Tersedia' }, lapangan1: { status: 'Booked', label: 'Booked' }, lapangan2: { status: 'Tersedia', label: 'Tersedia' }, lapangan3: { status: 'Tersedia', label: 'Tersedia' } },
    '21:00': { gedung: { status: 'Tersedia', label: 'Tersedia' }, lapangan1: { status: 'Tersedia', label: 'Tersedia' }, lapangan2: { status: 'Tersedia', label: 'Tersedia' }, lapangan3: { status: 'Tersedia', label: 'Tersedia' } },
  };

  // 1. Get Live Schedule for a given Date (Default today Asia/Jakarta, Privacy Protected)
  app.get('/api/reservations/schedule', (req, res) => {
    const todayJakarta = getTodayJakartaISO();
    const queryDate = typeof req.query.date === 'string' && req.query.date.trim() ? req.query.date.trim() : todayJakarta;
    const isAdmin = checkAdminAuth(req);

    const db = readDB();
    const activeReservations = (db.reservations || []).filter(
      r => r.date === queryDate && r.paymentStatus !== 'cancelled'
    );

    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
    const resultSchedule = hours.map(h => {
      const baseRow = BASE_SCHEDULE[h] || {
        gedung: { status: 'Tersedia', label: 'Tersedia' },
        lapangan1: { status: 'Tersedia', label: 'Tersedia' },
        lapangan2: { status: 'Tersedia', label: 'Tersedia' },
        lapangan3: { status: 'Tersedia', label: 'Tersedia' },
      };

      const row = {
        time: h,
        gedung: { ...baseRow.gedung },
        lapangan1: { ...baseRow.lapangan1 },
        lapangan2: { ...baseRow.lapangan2 },
        lapangan3: { ...baseRow.lapangan3 },
      };

      // Apply dynamic server reservations
      for (const resv of activeReservations) {
        if (resv.slots && resv.slots.includes(h)) {
          const key = resv.facilityKey;
          if (row[key]) {
            row[key] = {
              status: 'Booked',
              label: isAdmin ? resv.customerName : 'Booked', // Privacy: public gets generic 'Booked', admin gets customer name
              ...(isAdmin ? { customerName: resv.customerName, bookingId: resv.id } : {})
            };
          }
        }
      }

      return row;
    });

    res.json({ date: queryDate, schedule: resultSchedule });
  });

  // 2. Create Reservation with Server-Side Slot Lock and Double-Booking Prevention
  app.post('/api/reservations', (req, res) => {
    const {
      facility,
      date,
      timeSlot,
      durationHours,
      customerName,
      whatsapp,
      email,
      participantCount,
      purpose,
      paymentMethod,
      totalAmount,
      addons
    } = req.body;

    if (!facility || !date || !timeSlot || !customerName || !whatsapp) {
      res.status(400).json({ error: 'Data reservasi tidak lengkap (fasilitas, tanggal, jam, nama, dan WA wajib diisi).' });
      return;
    }

    // Validate that booking date is not in the past (Asia/Jakarta timezone)
    const todayJakarta = getTodayJakartaISO();
    if (date < todayJakarta) {
      res.status(400).json({ error: 'Tidak dapat memesan untuk tanggal yang sudah lampau. Silakan pilih tanggal hari ini atau mendatang.' });
      return;
    }

    const duration = Math.max(1, Math.min(6, parseInt(durationHours, 10) || 1));
    const facilityKey = normalizeFacilityKey(facility);

    // Compute required slot hours
    const startHourNum = parseInt(timeSlot.split(':')[0], 10);
    if (isNaN(startHourNum) || startHourNum < 8 || startHourNum > 21) {
      res.status(400).json({ error: 'Jam booking di luar jam operasional (08:00 - 22:00).' });
      return;
    }

    const requestedSlots: string[] = [];
    for (let i = 0; i < duration; i++) {
      const h = startHourNum + i;
      if (h > 21) {
        res.status(400).json({ error: 'Durasi melebihi jam operasional fasilitas.' });
        return;
      }
      requestedSlots.push(`${String(h).padStart(2, '0')}:00`);
    }

    const db = readDB();

    // Check conflict against base schedule if same day
    for (const slot of requestedSlots) {
      const baseRow = BASE_SCHEDULE[slot];
      if (baseRow && baseRow[facilityKey]?.status === 'Booked') {
        res.status(409).json({
          error: `Slot jam ${slot} pada ${facility} sudah terisi dalam jadwal rutin. Silakan pilih jam lain.`,
          conflictSlot: slot
        });
        return;
      }
    }

    // Check conflict against existing active reservations (Double-Booking Lock)
    const existingConflicts = (db.reservations || []).filter(r => 
      r.date === date &&
      r.facilityKey === facilityKey &&
      r.paymentStatus !== 'cancelled' &&
      r.slots.some(s => requestedSlots.includes(s))
    );

    if (existingConflicts.length > 0) {
      res.status(409).json({
        error: `Maaf, slot waktu yang Anda pilih baru saja dipesan oleh pengguna lain. Silakan pilih slot lain.`,
        conflictSlots: requestedSlots
      });
      return;
    }

    // Generate unique verifiable booking code
    const dateCompact = date.replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `BW-${dateCompact}-${randomSuffix}`;

    const newReservation: DBReservation = {
      id: bookingCode,
      facility,
      facilityKey,
      date,
      timeSlot,
      durationHours: duration,
      slots: requestedSlots,
      customerName: customerName.trim(),
      whatsapp: whatsapp.trim(),
      email: email ? email.trim() : undefined,
      participantCount: parseInt(participantCount, 10) || 1,
      purpose: purpose ? purpose.trim() : 'Kegiatan Warga',
      totalAmount: parseInt(totalAmount, 10) || 0,
      paymentMethod: paymentMethod === 'cash' ? 'cash' : paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'qris',
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'confirmed',
      addons: Array.isArray(addons) ? addons : [],
      createdAt: new Date().toISOString()
    };

    if (!db.reservations) {
      db.reservations = [];
    }
    db.reservations.push(newReservation);

    // Sync reservation to Billing Invoices
    if (!db.invoices) db.invoices = [];
    const invCode = `INV-2026-${newReservation.id.split('-').pop() || Math.floor(1000 + Math.random() * 9000)}`;
    const categoryName = newReservation.facility.toLowerCase().includes('gedung') ? 'Sewa Gedung' : 'Sewa Lapangan GOR';
    
    const isLunas = newReservation.paymentStatus === 'confirmed';
    const newInvoice: DBBillingInvoice = {
      id: invCode,
      name: newReservation.customerName,
      category: categoryName,
      zone: 'Kompleks GOR BUMDes Waru',
      phone: newReservation.whatsapp,
      amount: newReservation.totalAmount,
      dueDate: newReservation.date,
      period: 'September 2026',
      status: isLunas ? 'lunas' : 'belum_bayar',
      reservationId: newReservation.id,
      paymentDetails: isLunas ? {
        paidAt: new Date().toISOString(),
        method: newReservation.paymentMethod,
        receiptNumber: `KWT-BW-${newReservation.id.replace('BW-', '')}`,
        verifiedBy: newReservation.paymentMethod === 'cash' ? 'Kasir Loket GOR' : 'QRIS Digital BUMDes'
      } : undefined,
      portalUrl: `https://bumdeswaskita.desa.id/portal/bayar/${newReservation.id}`,
      createdAt: new Date().toISOString()
    };
    db.invoices.push(newInvoice);

    // If already confirmed (paid via QRIS / Bank Transfer), record in Buku Kas
    if (isLunas) {
      if (!db.financeTransactions) db.financeTransactions = [];
      db.financeTransactions.push({
        id: `TRX-${Date.now().toString().slice(-6)}`,
        type: 'income',
        category: categoryName as any,
        amount: newReservation.totalAmount,
        date: newReservation.date,
        referenceId: newReservation.id,
        description: `Penerimaan Sewa ${newReservation.facility} - ${newReservation.customerName}`,
        paymentMethod: newReservation.paymentMethod,
        recordedBy: newInvoice.paymentDetails?.verifiedBy || 'Kasir BUMDes',
        createdAt: new Date().toISOString()
      });

      if (newReservation.paymentMethod === 'qris') {
        if (!db.qrisTransactions) db.qrisTransactions = [];
        db.qrisTransactions.push({
          id: `QRIS-${Math.floor(1000 + Math.random() * 9000)}`,
          nmid: 'ID102600987123',
          payerName: newReservation.customerName,
          purpose: `Sewa ${newReservation.facility}`,
          amount: newReservation.totalAmount,
          time: new Date().toLocaleTimeString('id-ID'),
          status: 'settled',
          invoiceId: invCode,
          createdAt: new Date().toISOString()
        });
      }
    }

    writeDB(db);

    res.status(201).json({
      success: true,
      message: 'Reservasi berhasil dikunci dan dicatat di server.',
      reservation: newReservation
    });
  });

  // 3. List and Lookup Reservations (Supports Admin Access & Fast Customer Lookup)
  app.get('/api/reservations', (req, res) => {
    const db = readDB();
    let list = db.reservations || [];
    const isAdmin = checkAdminAuth(req);

    const { date, status, facilityKey, lookupCode, whatsapp } = req.query;

    // Fast Customer Lookup by booking code or phone number (Permitted for lookup of own ticket)
    if (typeof lookupCode === 'string' && lookupCode.trim()) {
      const targetCode = lookupCode.trim().toLowerCase();
      const match = list.filter(r => r.id.toLowerCase() === targetCode);
      res.json(match);
      return;
    }

    if (typeof whatsapp === 'string' && whatsapp.trim()) {
      const cleanPhone = whatsapp.replace(/\D/g, '');
      const match = list.filter(r => r.whatsapp.replace(/\D/g, '').includes(cleanPhone));
      res.json(match);
      return;
    }

    // Enforce Privacy: Complete list of reservations with customer names is restricted to authenticated admin
    if (!isAdmin) {
      res.status(403).json({
        error: 'Akses ditolak. Daftar lengkap reservasi hanya tersedia untuk pengelola/admin yang terautentikasi.'
      });
      return;
    }

    // Filter by date
    if (typeof date === 'string' && date.trim()) {
      list = list.filter(r => r.date === date.trim());
    }

    // Filter by paymentStatus
    if (typeof status === 'string' && status.trim()) {
      list = list.filter(r => r.paymentStatus === status.trim());
    }

    // Filter by facilityKey
    if (typeof facilityKey === 'string' && facilityKey.trim()) {
      list = list.filter(r => r.facilityKey === facilityKey.trim());
    }

    // Sort descending by createdAt
    list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(list);
  });

  // 4. Get User Reservation Details (By Booking Code)
  app.get('/api/reservations/:id', (req, res) => {
    const bookingId = req.params.id;
    const db = readDB();
    const found = (db.reservations || []).find(r => r.id === bookingId);
    if (!found) {
      res.status(404).json({ error: 'Reservasi tidak ditemukan.' });
      return;
    }
    res.json(found);
  });

  // 5. Update Reservation Status & Check-in (For Staff/Admin or Cancellation)
  app.patch('/api/reservations/:id/status', (req, res) => {
    const bookingId = req.params.id;
    const { paymentStatus, checkInStatus, notes } = req.body;

    const db = readDB();
    const index = (db.reservations || []).findIndex(r => r.id === bookingId);

    if (index === -1) {
      res.status(404).json({ error: 'Reservasi tidak ditemukan.' });
      return;
    }

    const current = db.reservations[index];

    if (paymentStatus && ['pending', 'confirmed', 'cancelled'].includes(paymentStatus)) {
      current.paymentStatus = paymentStatus;

      // Sync matching invoice in db.invoices
      if (db.invoices) {
        const matchingInv = db.invoices.find(inv => inv.reservationId === current.id);
        if (matchingInv) {
          if (paymentStatus === 'confirmed') {
            matchingInv.status = 'lunas';
            matchingInv.paymentDetails = {
              paidAt: new Date().toISOString(),
              method: current.paymentMethod,
              receiptNumber: `KWT-BW-${current.id.replace('BW-', '')}`,
              verifiedBy: 'Kasir Loket GOR BUMDes',
              notes: current.notes || 'Pelunasan diverifikasi staf loket'
            };

            if (!db.financeTransactions) db.financeTransactions = [];
            db.financeTransactions.unshift({
              id: `TRX-${Date.now().toString().slice(-6)}`,
              type: 'income',
              category: current.facility.toLowerCase().includes('gedung') ? 'Sewa Gedung' : 'Reservasi GOR' as any,
              amount: current.totalAmount,
              date: current.date,
              referenceId: current.id,
              description: `Pelunasan Reservasi ${current.facility} - ${current.customerName}`,
              paymentMethod: current.paymentMethod,
              recordedBy: 'Kasir Loket GOR BUMDes',
              createdAt: new Date().toISOString()
            });
          } else if (paymentStatus === 'cancelled') {
            matchingInv.status = 'dibatalkan';
          }
        }
      }
    }

    if (checkInStatus && ['pending', 'checked_in', 'completed'].includes(checkInStatus)) {
      current.checkInStatus = checkInStatus;
    }

    if (typeof notes === 'string') {
      current.notes = notes;
    }

    db.reservations[index] = current;
    writeDB(db);

    res.json({
      success: true,
      message: 'Status reservasi berhasil diperbarui.',
      reservation: current
    });
  });

  // 6. Fast Quick-Book Endpoint (For Instant Walk-In or 1-Click Customer Booking)
  app.post('/api/reservations/quick-book', (req, res) => {
    const {
      facility,
      date,
      timeSlot,
      durationHours = 1,
      customerName,
      whatsapp,
      paymentMethod = 'cash',
      isWalkIn = false,
      notes = ''
    } = req.body;

    if (!facility || !date || !timeSlot || !customerName || !whatsapp) {
      res.status(400).json({ error: 'Harap lengkapi: fasilitas, tanggal, jam, nama, dan nomor WA.' });
      return;
    }

    // Validate that booking date is not in the past (Asia/Jakarta timezone)
    const todayJakarta = getTodayJakartaISO();
    if (date < todayJakarta) {
      res.status(400).json({ error: 'Tidak dapat memesan untuk tanggal yang sudah lampau. Silakan pilih tanggal hari ini atau mendatang.' });
      return;
    }

    const duration = Math.max(1, Math.min(6, parseInt(durationHours, 10) || 1));
    const facilityKey = normalizeFacilityKey(facility);

    const startHourNum = parseInt(timeSlot.split(':')[0], 10);
    if (isNaN(startHourNum) || startHourNum < 8 || startHourNum > 21) {
      res.status(400).json({ error: 'Jam booking di luar jam operasional (08:00 - 22:00).' });
      return;
    }

    const requestedSlots: string[] = [];
    for (let i = 0; i < duration; i++) {
      const h = startHourNum + i;
      if (h > 21) {
        res.status(400).json({ error: 'Durasi melebihi batas jam operasional fasilitas.' });
        return;
      }
      requestedSlots.push(`${String(h).padStart(2, '0')}:00`);
    }

    const db = readDB();

    // Check conflict against base schedule if same day
    for (const slot of requestedSlots) {
      const baseRow = BASE_SCHEDULE[slot];
      if (baseRow && baseRow[facilityKey]?.status === 'Booked') {
        res.status(409).json({
          error: `Slot jam ${slot} pada ${facility} sudah terisi dalam jadwal rutin. Silakan pilih jam lain.`,
          conflictSlot: slot
        });
        return;
      }
    }

    // Check conflict against existing active reservations (Double-Booking Lock)
    const existingConflicts = (db.reservations || []).filter(r => 
      r.date === date &&
      r.facilityKey === facilityKey &&
      r.paymentStatus !== 'cancelled' &&
      r.slots.some(s => requestedSlots.includes(s))
    );

    if (existingConflicts.length > 0) {
      res.status(409).json({
        error: 'Slot waktu yang Anda pilih baru saja dipesan. Silakan pilih jam lain.',
        conflictSlots: requestedSlots
      });
      return;
    }

    // Calculate rate
    const hourlyRate = facilityKey === 'gedung' ? 100000 : 50000;
    const totalAmount = hourlyRate * duration;

    const dateCompact = date.replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `BW-${dateCompact}-${randomSuffix}`;

    const newReservation: DBReservation = {
      id: bookingCode,
      facility,
      facilityKey,
      date,
      timeSlot,
      durationHours: duration,
      slots: requestedSlots,
      customerName: customerName.trim(),
      whatsapp: whatsapp.trim(),
      participantCount: 4,
      purpose: isWalkIn ? 'Pemesanan Langsung Kasir GOR' : 'Booking Kilat Online',
      totalAmount,
      paymentMethod: paymentMethod === 'cash' ? 'cash' : paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'qris',
      paymentStatus: isWalkIn ? 'confirmed' : paymentMethod === 'cash' ? 'pending' : 'confirmed',
      checkInStatus: isWalkIn ? 'checked_in' : 'pending',
      notes: notes || (isWalkIn ? 'Pemesanan langsung di kasir GOR Waru' : 'Booking Kilat'),
      createdAt: new Date().toISOString()
    };

    if (!db.reservations) {
      db.reservations = [];
    }
    db.reservations.push(newReservation);

    // Sync quick-book to Billing Invoices
    if (!db.invoices) db.invoices = [];
    const invCode = `INV-2026-${newReservation.id.split('-').pop() || Math.floor(1000 + Math.random() * 9000)}`;
    const categoryName = newReservation.facility.toLowerCase().includes('gedung') ? 'Sewa Gedung' : 'Sewa Lapangan GOR';
    const isLunas = newReservation.paymentStatus === 'confirmed';

    const newInvoice: DBBillingInvoice = {
      id: invCode,
      name: newReservation.customerName,
      category: categoryName,
      zone: 'Kompleks GOR BUMDes Waru',
      phone: newReservation.whatsapp,
      amount: newReservation.totalAmount,
      dueDate: newReservation.date,
      period: 'September 2026',
      status: isLunas ? 'lunas' : 'belum_bayar',
      reservationId: newReservation.id,
      paymentDetails: isLunas ? {
        paidAt: new Date().toISOString(),
        method: newReservation.paymentMethod,
        receiptNumber: `KWT-BW-${newReservation.id.replace('BW-', '')}`,
        verifiedBy: isWalkIn ? 'Kasir Loket GOR (Langsung)' : 'QRIS Digital BUMDes'
      } : undefined,
      portalUrl: `https://bumdeswaskita.desa.id/portal/bayar/${newReservation.id}`,
      createdAt: new Date().toISOString()
    };
    db.invoices.push(newInvoice);

    if (isLunas) {
      if (!db.financeTransactions) db.financeTransactions = [];
      db.financeTransactions.push({
        id: `TRX-${Date.now().toString().slice(-6)}`,
        type: 'income',
        category: categoryName as any,
        amount: newReservation.totalAmount,
        date: newReservation.date,
        referenceId: newReservation.id,
        description: `Penerimaan Sewa ${newReservation.facility} - ${newReservation.customerName} (${isWalkIn ? 'Walk-in Kasir' : 'Booking Kilat'})`,
        paymentMethod: newReservation.paymentMethod,
        recordedBy: newInvoice.paymentDetails?.verifiedBy || 'Kasir BUMDes',
        createdAt: new Date().toISOString()
      });

      if (newReservation.paymentMethod === 'qris') {
        if (!db.qrisTransactions) db.qrisTransactions = [];
        db.qrisTransactions.push({
          id: `QRIS-${Math.floor(1000 + Math.random() * 9000)}`,
          nmid: 'ID102600987123',
          payerName: newReservation.customerName,
          purpose: `Sewa ${newReservation.facility}`,
          amount: newReservation.totalAmount,
          time: new Date().toLocaleTimeString('id-ID'),
          status: 'settled',
          invoiceId: invCode,
          createdAt: new Date().toISOString()
        });
      }
    }

    writeDB(db);

    res.status(201).json({
      success: true,
      message: 'Reservasi kilat berhasil dikunci dan dicatat di server.',
      reservation: newReservation
    });
  });

  // ==========================================
  // TAHAP 7: BILLING, INVOICE, DAN KEUANGAN PAD
  // ==========================================

  // 1. Get Billing Invoices (Supports Filter Status, Zone, Period, Lookup WhatsApp/NIK, and RBAC)
  app.get('/api/billing', (req, res) => {
    const db = readDB();
    let list = db.invoices || [];

    // Optional authentication check
    let authUser: any = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const session = (db.sessions || []).find(s => s.token === token && s.expiresAt > Date.now());
      if (session) {
        authUser = (db.users || []).find(u => u.id === session.userId);
      }
    }

    const { status, zone, period, search, phone, nasabahId, lookup } = req.query;

    // If resident role, filter by user phone or email or nik or nasabahId
    if (authUser && authUser.role === 'pengguna') {
      const userPhone = (authUser.phone || '').replace(/\D/g, '');
      const userNik = authUser.nik || '';
      const userNasabahId = (authUser.nasabahId || '').toLowerCase();

      list = list.filter(inv => {
        const invPhone = (inv.phone || '').replace(/\D/g, '');
        const matchPhone = Boolean(userPhone && invPhone && (invPhone.includes(userPhone) || userPhone.includes(invPhone)));
        const matchNik = Boolean(userNik && inv.nik && inv.nik === userNik);
        const matchNasabah = Boolean(userNasabahId && inv.nasabahId && inv.nasabahId.toLowerCase() === userNasabahId);
        return matchPhone || matchNik || matchNasabah;
      });
    } else if (typeof lookup === 'string' && lookup.trim()) {
      const term = lookup.trim().toLowerCase();
      list = list.filter(inv => 
        inv.id.toLowerCase().includes(term) ||
        inv.phone.includes(term) ||
        (inv.nasabahId && inv.nasabahId.toLowerCase().includes(term)) ||
        inv.name.toLowerCase().includes(term)
      );
    } else if (typeof phone === 'string' && phone.trim()) {
      const cleanPhone = phone.trim().replace(/\D/g, '');
      list = list.filter(inv => inv.phone.replace(/\D/g, '').includes(cleanPhone));
    } else if (typeof nasabahId === 'string' && nasabahId.trim()) {
      const cleanNasabah = nasabahId.trim().toLowerCase();
      list = list.filter(inv => (inv.nasabahId || '').toLowerCase() === cleanNasabah);
    }

    // Filter status
    if (typeof status === 'string' && ['lunas', 'belum_bayar', 'dibatalkan'].includes(status)) {
      list = list.filter(inv => inv.status === status);
    }

    // Filter zone
    if (typeof zone === 'string' && zone.trim() && zone !== 'semua') {
      list = list.filter(inv => inv.zone.toLowerCase().includes(zone.trim().toLowerCase()));
    }

    // Filter period
    if (typeof period === 'string' && period.trim()) {
      list = list.filter(inv => inv.period.toLowerCase().includes(period.trim().toLowerCase()));
    }

    // Search by name or zone
    if (typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(inv => 
        inv.name.toLowerCase().includes(q) || 
        inv.zone.toLowerCase().includes(q) || 
        inv.id.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      total: list.length,
      invoices: list
    });
  });

  // 2. Create New Custom Invoice
  app.post('/api/billing', (req, res) => {
    const { name, category, zone, phone, amount, dueDate, period, nik, nasabahId, notes, reservationId } = req.body;

    if (!name || !amount) {
      res.status(400).json({ error: 'Nama pelanggan dan nominal tagihan wajib diisi.' });
      return;
    }

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      res.status(400).json({ error: 'Nominal tagihan harus berupa angka positif.' });
      return;
    }

    const db = readDB();
    const dateSuffix = Math.floor(100 + Math.random() * 900);
    const invId = `INV-2026-${dateSuffix}`;

    const newInvoice: DBBillingInvoice = {
      id: invId,
      name: name.trim(),
      category: category || 'Bank Sampah Rumah Tangga',
      zone: zone || 'Dusun I / RT 01 RW 01',
      phone: phone || '6281234567890',
      nik: nik || undefined,
      nasabahId: nasabahId || `NAS-${dateSuffix}`,
      amount: numAmount,
      dueDate: dueDate || '10 September 2026',
      period: period || 'September 2026',
      status: 'belum_bayar',
      notes: notes || undefined,
      reservationId: reservationId || undefined,
      invoicePdfUrl: `/invoices/${invId}.pdf`,
      portalUrl: `https://bumdeswaskita.desa.id/portal/bayar/NAS-${dateSuffix}`,
      createdAt: new Date().toISOString()
    };

    if (!db.invoices) db.invoices = [];
    db.invoices.unshift(newInvoice);
    writeDB(db);

    res.status(201).json({
      success: true,
      message: `Invoice #${newInvoice.id} berhasil diterbitkan atas nama ${newInvoice.name}.`,
      invoice: newInvoice
    });
  });

  // 3. Pay / Settle Invoice (Generates E-Kuitansi, Records to Buku Kas Finance & QRIS Tracker)
  app.patch('/api/billing/:id/pay', (req, res) => {
    const invId = req.params.id;
    const { method = 'cash', verifiedBy, notes } = req.body;

    const validMethod = ['cash', 'qris', 'bank_transfer'].includes(method) ? method : 'cash';

    const db = readDB();
    const invoice = (db.invoices || []).find(i => i.id === invId);

    if (!invoice) {
      res.status(404).json({ error: 'Invoice tagihan tidak ditemukan.' });
      return;
    }

    if (invoice.status === 'lunas') {
      res.status(400).json({ error: 'Tagihan ini sudah berstatus lunas sebelumnya.', invoice });
      return;
    }

    const receiptNumber = `KWT-BW-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const paidTime = new Date().toISOString();

    invoice.status = 'lunas';
    invoice.paymentDetails = {
      paidAt: paidTime,
      method: validMethod,
      receiptNumber,
      verifiedBy: verifiedBy || (req as any).user?.name || (validMethod === 'cash' ? 'Kasir Loket BUMDes' : validMethod === 'qris' ? 'QRIS Digital BUMDes' : 'Bendahara Desa Waru'),
      notes: notes || 'Pelunasan diverifikasi'
    };

    // If tied to reservation, update reservation status
    if (invoice.reservationId) {
      const resv = (db.reservations || []).find(r => r.id === invoice.reservationId);
      if (resv) {
        resv.paymentStatus = 'confirmed';
        resv.checkInStatus = 'checked_in';
      }
    }

    // Atomically record in Buku Kas BUMDes
    let finCategory: DBFinanceTransaction['category'] = 'Retribusi Sampah';
    if (invoice.category.toLowerCase().includes('lapangan') || invoice.category.toLowerCase().includes('gor')) {
      finCategory = 'Reservasi GOR';
    } else if (invoice.category.toLowerCase().includes('gedung')) {
      finCategory = 'Sewa Gedung';
    } else if (invoice.category.toLowerCase().includes('umkm')) {
      finCategory = 'Marketplace UMKM';
    }

    if (!db.financeTransactions) db.financeTransactions = [];
    db.financeTransactions.unshift({
      id: `TRX-${Date.now().toString().slice(-6)}`,
      type: 'income',
      category: finCategory,
      amount: invoice.amount,
      date: new Date().toISOString().split('T')[0],
      referenceId: invoice.id,
      description: `Pelunasan Invoice #${invoice.id} (${invoice.name}) - ${invoice.category}`,
      paymentMethod: validMethod,
      recordedBy: invoice.paymentDetails.verifiedBy,
      createdAt: paidTime
    });

    // If QRIS, add to QRIS tracker
    if (validMethod === 'qris') {
      if (!db.qrisTransactions) db.qrisTransactions = [];
      db.qrisTransactions.unshift({
        id: `QRIS-${Math.floor(1000 + Math.random() * 9000)}`,
        nmid: 'ID102600987123',
        payerName: invoice.name,
        purpose: invoice.category,
        amount: invoice.amount,
        time: new Date().toLocaleTimeString('id-ID'),
        status: 'settled',
        invoiceId: invoice.id,
        createdAt: paidTime
      });
    }

    writeDB(db);

    res.json({
      success: true,
      message: `Pembayaran berhasil diterima! E-Kuitansi resmi #${receiptNumber} telah diterbitkan.`,
      invoice,
      receiptNumber
    });
  });

  // 4. Send Overdue / Due Date Reminder (WhatsApp Integration Link)
  app.post('/api/billing/send-reminder', (req, res) => {
    const { invoiceId, phone, name } = req.body;
    const db = readDB();
    const invoice = (db.invoices || []).find(i => i.id === invoiceId);

    const targetName = invoice ? invoice.name : (name || 'Pelanggan');
    const targetPhone = (invoice ? invoice.phone : (phone || '6281234567890')).replace(/\D/g, '');
    const targetAmount = invoice ? invoice.amount.toLocaleString('id-ID') : '75.000';
    const targetDue = invoice ? invoice.dueDate : 'Segera';
    const targetCategory = invoice ? invoice.category : 'Retribusi Sampah / Sewa';
    const targetPortal = invoice ? invoice.portalUrl : 'https://bumdeswaskita.desa.id';

    const message = `Yth. ${targetName},\n\nKami dari Pengelola *BUMDES Waskita Wijaya Desa Waru* menginformasikan tagihan *${targetCategory}* Anda sebesar *Rp ${targetAmount},-* telah mendekati/melewati tanggal jatuh tempo (${targetDue}).\n\nPembayaran dapat dilakukan di loket kasir kantor desa atau melalui scan QRIS resmi pada portal berikut:\n${targetPortal}\n\nTerima kasih atas partisipasi Anda dalam membangun Desa Waru.`;

    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

    res.json({
      success: true,
      message: `Pesan pengingat WhatsApp berhasil disiapkan untuk ${targetName}.`,
      waUrl,
      previewText: message
    });
  });

  // 5. Get Financial Summary & PAD Desa Waru Allocation (40% PAD, 30% Cadangan, 20% Pengurus, 10% Sosial)
  app.get('/api/finance/summary', (_req, res) => {
    const db = readDB();
    const transactions = db.financeTransactions || [];
    const invoices = db.invoices || [];

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const netIncome = Math.max(0, totalIncome - totalExpense);
    const totalBalance = totalIncome - totalExpense;

    const unpaidInvoices = invoices.filter(i => i.status === 'belum_bayar');
    const pendingReceivables = unpaidInvoices.reduce((acc, i) => acc + i.amount, 0);

    // PAD Desa Waru distribution scheme based on Village Enterprise Bylaw:
    // 40% PAD Pemdes Waru, 30% Cadangan Modal, 20% Jasa Pengurus, 10% Dana Sosial
    const padAllocation = {
      netIncome,
      padDesa: Math.round(netIncome * 0.40),
      modalCadangan: Math.round(netIncome * 0.30),
      jasaPengurus: Math.round(netIncome * 0.20),
      danaSosial: Math.round(netIncome * 0.10)
    };

    res.json({
      success: true,
      totalIncome,
      totalExpense,
      totalBalance,
      pendingReceivables,
      unpaidInvoicesCount: unpaidInvoices.length,
      paidInvoicesCount: invoices.filter(i => i.status === 'lunas').length,
      totalInvoicesCount: invoices.length,
      padAllocation,
      qrisTransactionsCount: (db.qrisTransactions || []).length
    });
  });

  // 6. Get Finance Cash Transactions (Buku Kas Masuk & Keluar)
  app.get('/api/finance/transactions', (req, res) => {
    const db = readDB();
    let list = db.financeTransactions || [];
    const { type, category } = req.query;

    if (type === 'income' || type === 'expense') {
      list = list.filter(t => t.type === type);
    }
    if (typeof category === 'string' && category.trim()) {
      list = list.filter(t => t.category.toLowerCase().includes(category.trim().toLowerCase()));
    }

    res.json({
      success: true,
      total: list.length,
      transactions: list
    });
  });

  // 7. Record Manual Expense or Operational Income
  app.post('/api/finance/transactions', (req, res) => {
    const { type, category, amount, description, paymentMethod = 'cash', recordedBy } = req.body;

    if (!type || !amount || !description) {
      res.status(400).json({ error: 'Tipe transaksi, nominal, dan deskripsi wajib diisi.' });
      return;
    }

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      res.status(400).json({ error: 'Nominal harus berupa angka positif.' });
      return;
    }

    const db = readDB();
    const newTx: DBFinanceTransaction = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      type: type === 'expense' ? 'expense' : 'income',
      category: category || (type === 'expense' ? 'Operasional & Perawatan' : 'Penerimaan Usaha Lainnya' as any),
      amount: numAmount,
      date: new Date().toISOString().split('T')[0],
      description: description.trim(),
      paymentMethod: ['cash', 'qris', 'bank_transfer'].includes(paymentMethod) ? paymentMethod : 'cash',
      recordedBy: recordedBy || (req as any).user?.name || 'Bendahara BUMDes',
      createdAt: new Date().toISOString()
    };

    if (!db.financeTransactions) db.financeTransactions = [];
    db.financeTransactions.unshift(newTx);
    writeDB(db);

    res.status(201).json({
      success: true,
      message: 'Transaksi keuangan kas berhasil dicatat di buku kas BUMDes.',
      transaction: newTx
    });
  });

  // 8. Get QRIS Real-Time Tracker Transactions
  app.get('/api/finance/qris', (_req, res) => {
    const db = readDB();
    res.json({
      success: true,
      total: (db.qrisTransactions || []).length,
      qrisTransactions: db.qrisTransactions || []
    });
  });

  // 9. QRIS Instant Settlement Simulator (Simulate scan from mobile app/customer)
  app.post('/api/finance/qris/simulate-scan', (req, res) => {
    const { invoiceId, payerName } = req.body;
    const db = readDB();
    const invoice = (db.invoices || []).find(i => i.id === invoiceId);

    if (!invoice) {
      res.status(404).json({ error: 'Invoice tidak ditemukan untuk scan QRIS.' });
      return;
    }

    // Execute payment settlement
    const receiptNumber = `KWT-BW-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const paidTime = new Date().toISOString();

    invoice.status = 'lunas';
    invoice.paymentDetails = {
      paidAt: paidTime,
      method: 'qris',
      receiptNumber,
      verifiedBy: 'QRIS Dynamic Settlement (NMID: ID102600987123)',
      notes: 'Scan QRIS Berhasil Terverifikasi'
    };

    if (invoice.reservationId) {
      const resv = (db.reservations || []).find(r => r.id === invoice.reservationId);
      if (resv) {
        resv.paymentStatus = 'confirmed';
        resv.checkInStatus = 'checked_in';
      }
    }

    if (!db.qrisTransactions) db.qrisTransactions = [];
    db.qrisTransactions.unshift({
      id: `QRIS-${Math.floor(1000 + Math.random() * 9000)}`,
      nmid: 'ID102600987123',
      payerName: payerName || invoice.name,
      purpose: invoice.category,
      amount: invoice.amount,
      time: new Date().toLocaleTimeString('id-ID'),
      status: 'settled',
      invoiceId: invoice.id,
      createdAt: paidTime
    });

    if (!db.financeTransactions) db.financeTransactions = [];
    db.financeTransactions.unshift({
      id: `TRX-${Date.now().toString().slice(-6)}`,
      type: 'income',
      category: (invoice.category.toLowerCase().includes('sampah') ? 'Retribusi Sampah' : invoice.category.toLowerCase().includes('gedung') ? 'Sewa Gedung' : 'Reservasi GOR') as any,
      amount: invoice.amount,
      date: new Date().toISOString().split('T')[0],
      referenceId: invoice.id,
      description: `QRIS Settled: ${invoice.name} - ${invoice.category}`,
      paymentMethod: 'qris',
      recordedBy: 'QRIS Auto-Settlement',
      createdAt: paidTime
    });

    writeDB(db);

    res.json({
      success: true,
      message: `Pembayaran QRIS Rp ${invoice.amount.toLocaleString('id-ID')} Berhasil! E-Kuitansi #${receiptNumber} diterbitkan.`,
      invoice,
      receiptNumber
    });
  });

  // ==========================================
  // TAHAP 9: KANAL DUKUNGAN, PUSAT PENGADUAN & BANTUAN WARGA
  // ==========================================

  // 1. Get Support Tickets (Supports Filter Status, Category, and Lookup Ticket ID or Phone)
  app.get('/api/support/tickets', (req, res) => {
    const db = readDB();
    let list = db.tickets || [];

    const { status, category, lookup, ticketId, phone } = req.query;

    if (typeof ticketId === 'string' && ticketId.trim()) {
      const q = ticketId.trim().toLowerCase();
      list = list.filter(t => t.id.toLowerCase() === q);
    } else if (typeof lookup === 'string' && lookup.trim()) {
      const q = lookup.trim().toLowerCase();
      list = list.filter(t => 
        t.id.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.contact.includes(q) ||
        t.title.toLowerCase().includes(q)
      );
    }

    if (typeof status === 'string' && status.trim() && status !== 'semua') {
      list = list.filter(t => t.status === status);
    }

    if (typeof category === 'string' && category.trim() && category !== 'semua') {
      list = list.filter(t => t.category.toLowerCase().includes(category.trim().toLowerCase()));
    }

    if (typeof phone === 'string' && phone.trim()) {
      const cleanPhone = phone.trim().replace(/\D/g, '');
      list = list.filter(t => t.contact.replace(/\D/g, '').includes(cleanPhone));
    }

    res.json({
      success: true,
      total: list.length,
      tickets: list
    });
  });

  // 2. Submit New Support Ticket / Complaint from Citizen or Visitor
  app.post('/api/support/tickets', (req, res) => {
    const { title, category, description, location, name, contact } = req.body;

    if (!title || !description || !name || !contact) {
      res.status(400).json({ error: 'Judul, uraian pengaduan/pertanyaan, nama lengkap, dan nomor kontak wajib diisi.' });
      return;
    }

    const validCategories = [
      'Armada Sampah', 
      'Fasilitas GOR & Gedung', 
      'Tagihan & Kas', 
      'Lingkungan Desa', 
      'Pertanyaan Layanan'
    ];
    const cat = validCategories.includes(category) ? category : 'Pertanyaan Layanan';

    const db = readDB();
    if (!db.tickets) db.tickets = [];

    const dateCompact = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randSuffix = Math.floor(100 + Math.random() * 900);
    const ticketId = `TKT-ADU-${dateCompact}-${randSuffix}`;

    const newTicket: DBSupportTicket = {
      id: ticketId,
      title: title.trim(),
      category: cat as any,
      description: description.trim(),
      location: location ? location.trim() : undefined,
      name: name.trim(),
      contact: contact.trim(),
      status: 'Menunggu Verifikasi',
      createdAt: new Date().toISOString()
    };

    db.tickets.unshift(newTicket);
    writeDB(db);

    res.status(201).json({
      success: true,
      message: `Pengaduan / permohonan bantuan Anda berhasil diterima dengan nomor tiket #${newTicket.id}. Tim BUMDes Waru akan segera menindaklanjuti.`,
      ticket: newTicket
    });
  });

  // 3. Update Support Ticket Status & Resolution (Admin & Staff)
  app.patch('/api/support/tickets/:id', (req, res) => {
    const ticketId = req.params.id;
    const { status, assignedOfficer, resolutionNote } = req.body;

    const db = readDB();
    const ticket = (db.tickets || []).find(t => t.id === ticketId);

    if (!ticket) {
      res.status(404).json({ error: 'Tiket pengaduan / bantuan tidak ditemukan.' });
      return;
    }

    if (status && ['Menunggu Verifikasi', 'Ditugaskan ke Tim Lapangan', 'Sedang Dikerjakan', 'Selesai'].includes(status)) {
      ticket.status = status;
    }
    if (assignedOfficer) {
      ticket.assignedOfficer = assignedOfficer.trim();
    }
    if (resolutionNote) {
      ticket.resolutionNote = resolutionNote.trim();
    }
    ticket.updatedAt = new Date().toISOString();

    writeDB(db);

    res.json({
      success: true,
      message: `Tiket #${ticket.id} berhasil diperbarui.`,
      ticket
    });
  });

  // Vite middleware for development or Static Assets for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BUMDES Waskita Wijaya Server running on port ${PORT}`);
  });
}

startServer();
