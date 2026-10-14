import { 
  WastePackage, 
  PicWilayah, 
  DigitalAsset, 
  CitizenFeedback, 
  UmkmWasteMetric, 
  UmkmDirectoryItem, 
  MonthlyReportData 
} from './wasteTypes';

export const WASTE_PACKAGES: WastePackage[] = [
  {
    id: 'pkg-domestik',
    name: 'Paket Rumah Tangga Domestik',
    category: 'domestik',
    price: 25000,
    period: 'bulan',
    cashbackRt: 5000,
    pickupFrequency: '3x Seminggu (Senin, Rabu, Sabtu)',
    description: 'Layanan pengangkutan sampah harian rumah tangga terjadwal dengan skema bagi hasil kemakmuran lingkungan warga.',
    popular: true,
    features: [
      'Pengangkutan rutin 3x seminggu tepat di depan pagar rumah',
      'Cashback Rp 5.000 langsung masuk ke Kas RT/RW melalui PIC wilayah',
      'Maksimal 2 wadah / tempat sampah domestik standar',
      'Pengingat jadwal kedatangan armada via WhatsApp',
      'Penanganan cepat aduan sampah terlewat maksimal 2 jam',
      'Termasuk pembuangan akhir terpadu ke TPA Resmi Sukoharjo'
    ]
  },
  {
    id: 'pkg-umkm-mikro',
    name: 'Paket Pelaku Usaha Mikro & Warung',
    category: 'umkm',
    price: 50000,
    period: 'bulan',
    pickupFrequency: '4x Seminggu (Senin, Rabu, Jumat, Minggu)',
    description: 'Solusi kebersihan khusus warung makan, toko kelontong, kafe mini, dan industri rumahan di Desa Waru.',
    popular: false,
    features: [
      'Pengangkutan 4x seminggu dengan prioritas jadwal pagi',
      'Maksimal volume 4-5 kantong sampah besar per pengangkutan',
      'E-Kwitansi & Invoice resmi bulanan bertanda tangan BUMDES',
      'Stiker fisik resmi: "Mitra Usaha Peduli Kebersihan Desa Waru"',
      'Fasilitas penjemputan kardus & jerigen minyak bekas untuk bank sampah',
      'Konsultasi pengelolaan limbah sisa makanan higienis'
    ]
  },
  {
    id: 'pkg-umkm-komersial',
    name: 'Paket Pelaku Usaha Menengah & Ruko',
    category: 'umkm',
    price: 100000,
    period: 'bulan',
    pickupFrequency: 'Setiap Hari (Senin - Minggu)',
    description: 'Layanan harian intensif untuk restoran, minimarket, pasar, pusat ruko, dan bengkel dengan volume sampah tinggi.',
    popular: false,
    features: [
      'Pengangkutan rutin setiap hari (7x seminggu)',
      'Fasilitas peminjaman 1 unit Kontainer Beroda 240L dari BUMDES',
      'Jadwal pickup ganda (pagi & sore) jika ada lonjakan volume akhir pekan',
      'Laporan neraca tonase sampah komersial berkala per semester',
      'Akses prioritas darurat penjemputan sampah besar',
      'E-Sertifikat Kepatuhan Standar Lingkungan Hidup BUMDES'
    ]
  },
  {
    id: 'pkg-khusus',
    name: 'Layanan Angkut Khusus (On-Demand)',
    category: 'khusus',
    price: 75000,
    period: 'ritase / panggilan',
    pickupFrequency: 'Sesuai Booking Warga (24 Jam Sebelumnya)',
    description: 'Layanan insidental untuk sampah volume luar biasa seperti hajatan/mantenan, puing renovasi, dan tebangan pohon.',
    popular: false,
    features: [
      'Armada truk atau motor roda 3 datang langsung ke lokasi titik acara',
      'Termasuk bantuan 2 personil tenaga angkut terampil BUMDES',
      'Kapasitas angkut hingga 1.5 meter kubik per ritase',
      'Pembersihan tuntas sisa sampah pesta / daun kebun pasca acara',
      'Pembayaran fleksibel (tunai di tempat / transfer QRIS BUMDES)',
      'Jaminan pembuangan ramah lingkungan tanpa bakar sampah'
    ]
  }
];

export const INITIAL_PIC_WILAYAH: PicWilayah[] = [
  {
    id: 'pic-rw01-rt01',
    rw: 'RW 01',
    rt: 'RT 01',
    dukuh: 'Dukuh Waru Utama',
    picName: 'PIC wilayah',
    picPhone: '',
    bankKasInfo: '',
    totalKkTerdaftar: 48,
    totalKkAktifBayar: 46,
    accumulatedCashbackThisMonth: 230000, // 46 * 5000
    statusPenyaluran: 'Sudah Ditransfer',
    tanggalPenyaluranTerakhir: '02 September 2026'
  },
  {
    id: 'pic-rw01-rt02',
    rw: 'RW 01',
    rt: 'RT 02',
    dukuh: 'Dukuh Waru Timur',
    picName: 'PIC wilayah',
    picPhone: '',
    bankKasInfo: '',
    totalKkTerdaftar: 54,
    totalKkAktifBayar: 52,
    accumulatedCashbackThisMonth: 260000, // 52 * 5000
    statusPenyaluran: 'Sudah Ditransfer',
    tanggalPenyaluranTerakhir: '02 September 2026'
  },
  {
    id: 'pic-rw02-rt01',
    rw: 'RW 02',
    rt: 'RT 01',
    dukuh: 'Dukuh Baki Barat',
    picName: 'PIC wilayah',
    picPhone: '',
    bankKasInfo: '',
    totalKkTerdaftar: 45,
    totalKkAktifBayar: 45,
    accumulatedCashbackThisMonth: 225000,
    statusPenyaluran: 'Sudah Ditransfer',
    tanggalPenyaluranTerakhir: '03 September 2026'
  },
  {
    id: 'pic-rw02-rt02',
    rw: 'RW 02',
    rt: 'RT 02',
    dukuh: 'Dukuh Baki Selatan',
    picName: 'PIC wilayah',
    picPhone: '',
    bankKasInfo: '',
    totalKkTerdaftar: 50,
    totalKkAktifBayar: 48,
    accumulatedCashbackThisMonth: 240000,
    statusPenyaluran: 'Siap Dicairkan',
    tanggalPenyaluranTerakhir: '01 Agustus 2026'
  },
  {
    id: 'pic-rw03-rt01',
    rw: 'RW 03',
    rt: 'RT 01',
    dukuh: 'Dukuh Tegalrejo',
    picName: 'PIC wilayah',
    picPhone: '',
    bankKasInfo: '',
    totalKkTerdaftar: 42,
    totalKkAktifBayar: 40,
    accumulatedCashbackThisMonth: 200000,
    statusPenyaluran: 'Proses Verifikasi',
    tanggalPenyaluranTerakhir: '04 Agustus 2026'
  },
  {
    id: 'pic-rw04-rt01',
    rw: 'RW 04',
    rt: 'RT 01',
    dukuh: 'Dukuh Sawahan',
    picName: 'PIC wilayah',
    picPhone: '',
    bankKasInfo: '',
    totalKkTerdaftar: 40,
    totalKkAktifBayar: 39,
    accumulatedCashbackThisMonth: 195000,
    statusPenyaluran: 'Siap Dicairkan',
    tanggalPenyaluranTerakhir: '02 Agustus 2026'
  }
];

export const INITIAL_DIGITAL_ASSETS: DigitalAsset[] = [
  {
    id: 'ast-01',
    name: 'Motor Roda Tiga Viar New Karya 200 Long',
    code: 'AST-ARM-01',
    category: 'armada_roda3',
    plateNumber: 'AD 8291 SK',
    yearAcquired: 2023,
    operator: 'Pak Joko Sutrisno (Driver 01)',
    condition: 'Sangat Baik',
    lastServiceDate: '28 Agustus 2026',
    nextServiceDate: '28 September 2026',
    fuelConsumptionPerDay: '3.5 Liter Pertalite',
    estimatedValue: 38500000,
    notes: 'Bak hidrolik buka tiga sisi. Armada operasional utama rute RW 01 dan RW 02. Oli mesin baru diganti.'
  },
  {
    id: 'ast-02',
    name: 'Motor Roda Tiga Tossa Giga Hercules 150',
    code: 'AST-ARM-02',
    category: 'armada_roda3',
    plateNumber: 'AD 9012 FK',
    yearAcquired: 2022,
    operator: 'Pak Slamet Riyadi (Driver 02)',
    condition: 'Sangat Baik',
    lastServiceDate: '15 Agustus 2026',
    nextServiceDate: '15 September 2026',
    fuelConsumptionPerDay: '3.0 Liter Pertalite',
    estimatedValue: 32000000,
    notes: 'Kondisi rantai dan rem baru diperbarui. Operasional rute RW 03 dan RW 04.'
  },
  {
    id: 'ast-03',
    name: 'Motor Roda Tiga Viar Karya 150 Standar',
    code: 'AST-ARM-03',
    category: 'armada_roda3',
    plateNumber: 'AD 7721 SK',
    yearAcquired: 2024,
    operator: 'Pak Wahyu Widodo (Driver Cadangan & Niaga)',
    condition: 'Sangat Baik',
    lastServiceDate: '20 Agustus 2026',
    nextServiceDate: '20 September 2026',
    fuelConsumptionPerDay: '2.5 Liter Pertalite',
    estimatedValue: 36000000,
    notes: 'Armada fokus penjemputan pelaku usaha UMKM dan panggilan darurat / on-demand.'
  },
  {
    id: 'ast-04',
    name: 'Truk Engkel Dump Isuzu Elf NMR 71 HD',
    code: 'AST-TRUK-01',
    category: 'truk_tpa',
    plateNumber: 'AD 1455 B',
    yearAcquired: 2021,
    operator: 'Pak Bowo Pranoto & Tim Retribusi',
    condition: 'Sangat Baik',
    lastServiceDate: '10 Agustus 2026',
    nextServiceDate: '10 Oktober 2026',
    fuelConsumptionPerDay: '12 Liter Solar (Ritase TPA)',
    estimatedValue: 145000000,
    notes: 'Kapasitas 6 meter kubik. Rutin angkut residu ke TPA Mojorejo Sukoharjo 2x seminggu. Uji KIR berlaku hingga Januari 2027.'
  },
  {
    id: 'ast-05',
    name: 'Mesin Pres Hidrolik Kardus & Botol PET 10 Ton',
    code: 'AST-MSN-01',
    category: 'mesin',
    yearAcquired: 2023,
    operator: 'Operator Depo (Pak Darmo)',
    condition: 'Sangat Baik',
    lastServiceDate: '05 Juli 2026',
    nextServiceDate: '05 Oktober 2026',
    estimatedValue: 28000000,
    notes: 'Ditempatkan di Depo TPS3R Desa Waru. Memadatkan 100 kg kardus menjadi bal rapi dalam 15 menit.'
  },
  {
    id: 'ast-06',
    name: 'Mesin Pencacah Kompos Bio-Rotary 7.5 HP',
    code: 'AST-MSN-02',
    category: 'mesin',
    yearAcquired: 2023,
    operator: 'Kelompok Tani & Tim Pengolahan Kompos',
    condition: 'Perlu Servis',
    lastServiceDate: '12 Juni 2026',
    nextServiceDate: '08 September 2026',
    estimatedValue: 18500000,
    notes: 'Pisau pencacah perlu diasah ulang pekan ini untuk persiapan produksi pupuk organik desa musim tanam.'
  },
  {
    id: 'ast-07',
    name: 'Paket 16 Unit Dustbin Roda 660 Liter HDPE Jerman',
    code: 'AST-KTN-01',
    category: 'kontainer',
    yearAcquired: 2024,
    operator: 'Tersebar di 8 Titik Depo Strategis',
    condition: 'Sangat Baik',
    lastServiceDate: '01 Agustus 2026',
    nextServiceDate: '01 November 2026',
    estimatedValue: 48000000,
    notes: 'Dilengkapi pedal injak kaki higienis dan tutup kedap bau. 4 unit cadangan di gudang BUMDES.'
  },
  {
    id: 'ast-08',
    name: 'Perlengkapan APD & Keselamatan Tim Kebersihan (8 Set)',
    code: 'AST-APD-01',
    category: 'apd',
    yearAcquired: 2026,
    operator: 'Seluruh Kru Armada & Pemilah',
    condition: 'Sangat Baik',
    lastServiceDate: '15 Juli 2026',
    nextServiceDate: '15 Januari 2027',
    estimatedValue: 6400000,
    notes: 'Terdiri dari rompi fosfor bersertifikat EN471, sepatu boots tebal anti-paku, sarung tangan nitril tebal, dan kacamata pelindung.'
  }
];

export const INITIAL_CITIZEN_FEEDBACK: CitizenFeedback[] = [
  {
    id: 'tkt-01',
    ticketNo: 'TIKET-2026-0901',
    citizenName: 'Ibu Ratna Dewi',
    citizenPhone: '0812-9988-7711',
    wilayahRtRw: 'RT 02 / RW 01 (Dukuh Waru Timur)',
    category: 'sampah_terlewat',
    description: 'Selamat pagi admin, tong sampah di depan rumah nomor 14 tadi pagi sepertinya terlewat karena tertutup mobil parkir tetangga. Mohon dibantu diangkut siang ini ya.',
    submittedAt: '05 September 2026, 08:30 WIB',
    status: 'Petugas Meluncur',
    officerResponse: 'Armada 01 Pak Joko sudah dihubungi dan sedang putar balik dari jalan mawar untuk mengangkut. Estimasi tiba pukul 09.15 WIB.',
    ratingStars: 5
  },
  {
    id: 'tkt-02',
    ticketNo: 'TIKET-2026-0899',
    citizenName: 'Bpk. Haryono',
    citizenPhone: '0856-4231-8890',
    wilayahRtRw: 'RT 01 / RW 03 (Jalan Tegalrejo No. 8)',
    category: 'tong_rusak',
    description: 'Engsel tutup tong sampah BUMDES di pertigaan gang 4 lepas kena angin kencang kemarin sore.',
    submittedAt: '04 September 2026, 14:15 WIB',
    status: 'Selesai',
    officerResponse: 'Tim logistik BUMDES telah memasang baut dan engsel baru pada tanggal 04 September pukul 16.00 WIB. Sudah berfungsi normal kembali.',
    ratingStars: 5
  },
  {
    id: 'tkt-03',
    ticketNo: 'TIKET-2026-0895',
    citizenName: 'Bpk. Tri Wibowo (Ketua RW 02)',
    citizenPhone: '0813-2890-5544',
    wilayahRtRw: 'RW 02 Keseluruhan',
    category: 'apresiasi',
    description: 'Terima kasih atas tertibnya pencairan cashback Rp 5.000 per KK bulan ini. Kas RT kami sangat terbantu untuk beli lampu penerangan jalan gang.',
    submittedAt: '03 September 2026, 19:40 WIB',
    status: 'Selesai',
    officerResponse: 'Sama-sama Bapak RW. Terima kasih atas dukungan seluruh warga yang selalu tertib membayar iuran sebelum tanggal 5 tiap bulannya.',
    ratingStars: 5
  }
];

export const UMKM_PERFORMANCE_METRICS: UmkmWasteMetric[] = [
  { month: 'Apr', volumeTon: 2.8, totalUmkmActive: 28, retribusiTerkumpul: 1850000, kepatuhanBayarPercent: 92 },
  { month: 'Mei', volumeTon: 3.2, totalUmkmActive: 31, retribusiTerkumpul: 2100000, kepatuhanBayarPercent: 94 },
  { month: 'Jun', volumeTon: 3.6, totalUmkmActive: 36, retribusiTerkumpul: 2450000, kepatuhanBayarPercent: 95 },
  { month: 'Jul', volumeTon: 3.9, totalUmkmActive: 39, retribusiTerkumpul: 2700000, kepatuhanBayarPercent: 97 },
  { month: 'Agu', volumeTon: 4.3, totalUmkmActive: 42, retribusiTerkumpul: 2950000, kepatuhanBayarPercent: 98 },
  { month: 'Sep', volumeTon: 4.6, totalUmkmActive: 45, retribusiTerkumpul: 3200000, kepatuhanBayarPercent: 98 }
];

export const UMKM_DIRECTORY: UmkmDirectoryItem[] = [
  {
    id: 'umkm-01',
    businessName: 'Warung Makan & Soto Mbak Tin',
    ownerName: 'Ibu Hartini',
    category: 'Kuliner / Rumah Makan',
    packageId: 'pkg-umkm-mikro',
    packageName: 'Paket Pelaku Usaha Mikro',
    monthlyFee: 50000,
    averageWeeklyVolumeKg: 85,
    status: 'Aktif',
    joinedDate: 'Januari 2024'
  },
  {
    id: 'umkm-02',
    businessName: 'Kedai Kopi & Toast Sudut Waru',
    ownerName: 'Mas Dimas Anugrah',
    category: 'Kafe / Kedai',
    packageId: 'pkg-umkm-mikro',
    packageName: 'Paket Pelaku Usaha Mikro',
    monthlyFee: 50000,
    averageWeeklyVolumeKg: 65,
    status: 'Aktif',
    joinedDate: 'Maret 2024'
  },
  {
    id: 'umkm-03',
    businessName: 'Swalayan & Toko Kelontong Berkah 24',
    ownerName: 'H. Sudarsono',
    category: 'Toko Kelontong / Swalayan',
    packageId: 'pkg-umkm-komersial',
    packageName: 'Paket Komersial Menengah',
    monthlyFee: 100000,
    averageWeeklyVolumeKg: 210,
    status: 'Aktif',
    joinedDate: 'Februari 2024'
  },
  {
    id: 'umkm-04',
    businessName: 'Bengkel Motor & Cuci Steam Wijaya Motor',
    ownerName: 'Bpk. Agus Santoso',
    category: 'Bengkel / Usaha Jasa',
    packageId: 'pkg-umkm-mikro',
    packageName: 'Paket Pelaku Usaha Mikro',
    monthlyFee: 50000,
    averageWeeklyVolumeKg: 45,
    status: 'Aktif',
    joinedDate: 'April 2024'
  },
  {
    id: 'umkm-05',
    businessName: 'Restoran Ikan Bakar Pondok Waru',
    ownerName: 'Bpk. Hendra Gunawan',
    category: 'Kuliner / Rumah Makan',
    packageId: 'pkg-umkm-komersial',
    packageName: 'Paket Komersial Menengah',
    monthlyFee: 100000,
    averageWeeklyVolumeKg: 280,
    status: 'Aktif',
    joinedDate: 'November 2023'
  },
  {
    id: 'umkm-06',
    businessName: 'Apotek & Toko Obat Sehat Waru',
    ownerName: 'apt. Rina Kusuma',
    category: 'Pusat Ruko',
    packageId: 'pkg-umkm-mikro',
    packageName: 'Paket Pelaku Usaha Mikro',
    monthlyFee: 50000,
    averageWeeklyVolumeKg: 30,
    status: 'Aktif',
    joinedDate: 'Mei 2024'
  }
];

export const CURRENT_MONTHLY_REPORT: MonthlyReportData = {
  month: 'Agustus',
  year: 2026,
  totalRumahTangga: 485,
  totalUmkm: 45,
  totalTonase: 16.8, // 16.8 Ton
  penerimaanIuranRt: 12125000, // 485 * 25.000
  penerimaanIuranUmkm: 3200000,
  totalPenerimaan: 15325000,
  totalCashbackKasRt: 2425000, // 485 * 5.000
  biayaOperasionalBbmDanServis: 3650000,
  gajiPetugasKebersihan: 4500000,
  padesBersih: 4750000 // 15.325.000 - 2.425.000 - 3.650.000 - 4.500.000
};
