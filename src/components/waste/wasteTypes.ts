export interface WastePackage {
  id: string;
  name: string;
  category: 'domestik' | 'umkm' | 'khusus';
  price: number;
  period: string;
  cashbackRt?: number;
  pickupFrequency: string;
  features: string[];
  description: string;
  popular?: boolean;
}

export interface PicWilayah {
  id: string;
  rw: string;
  rt: string;
  dukuh: string;
  picName: string;
  picPhone: string;
  bankKasInfo: string;
  totalKkTerdaftar: number;
  totalKkAktifBayar: number;
  accumulatedCashbackThisMonth: number;
  statusPenyaluran: 'Sudah Ditransfer' | 'Proses Verifikasi' | 'Siap Dicairkan';
  tanggalPenyaluranTerakhir: string;
}

export interface DigitalAsset {
  id: string;
  name: string;
  code: string;
  category: 'armada_roda3' | 'truk_tpa' | 'kontainer' | 'mesin' | 'apd';
  plateNumber?: string;
  yearAcquired: number;
  operator: string;
  condition: 'Sangat Baik' | 'Perlu Servis' | 'Dalam Perbaikan';
  lastServiceDate: string;
  nextServiceDate: string;
  fuelConsumptionPerDay?: string;
  estimatedValue: number;
  notes: string;
  imageUrl?: string;
}

export interface CitizenFeedback {
  id: string;
  ticketNo: string;
  citizenName: string;
  citizenPhone: string;
  wilayahRtRw: string;
  category: 'sampah_terlewat' | 'sampah_liar' | 'tong_rusak' | 'jadwal_terlambat' | 'apresiasi';
  description: string;
  photoUrl?: string;
  submittedAt: string;
  status: 'Menunggu' | 'Petugas Meluncur' | 'Selesai';
  ratingStars?: number;
  officerResponse?: string;
}

export interface UmkmWasteMetric {
  month: string;
  volumeTon: number;
  totalUmkmActive: number;
  retribusiTerkumpul: number;
  kepatuhanBayarPercent: number;
}

export interface UmkmDirectoryItem {
  id: string;
  businessName: string;
  ownerName: string;
  category: 'Kuliner / Rumah Makan' | 'Toko Kelontong / Swalayan' | 'Kafe / Kedai' | 'Bengkel / Usaha Jasa' | 'Pusat Ruko';
  packageId: string;
  packageName: string;
  monthlyFee: number;
  averageWeeklyVolumeKg: number;
  status: 'Aktif' | 'Verifikasi';
  joinedDate: string;
}

export interface MonthlyReportData {
  month: string;
  year: number;
  totalRumahTangga: number;
  totalUmkm: number;
  totalTonase: number;
  penerimaanIuranRt: number;
  penerimaanIuranUmkm: number;
  totalPenerimaan: number;
  totalCashbackKasRt: number;
  biayaOperasionalBbmDanServis: number;
  gajiPetugasKebersihan: number;
  padesBersih: number;
}
