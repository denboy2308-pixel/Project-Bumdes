# Dokumentasi Tahap 6: Sistem Reservasi Cepat & Manajemen Terintegrasi

BUMDES Waskita Wijaya Desa Waru, Kecamatan Baki, Kabupaten Sukoharjo  
Versi: 1.0 (Produksi V1)

---

## 1. Ikhtisar Tahap 6

Tahap 6 berfokus pada penyempurnaan alur reservasi fasilitas publik (3 Lapangan Badminton Vinyl/Parquet dan Gedung Serbaguna Desa Waru) agar berjalan **lebih cepat, mudah, dan aman** baik untuk pelanggan umum, warga nasabah, maupun petugas pengelola (Teller & Administrator).

---

## 2. Fitur Baru yang Diimplementasikan

### 2.1. Server-Side Slot Locking & Pencegahan Booking Ganda (Double-Booking Prevention)
- **Validasi Waktu Nyata**: Seluruh permintaan slot jam diperiksa dan dikunci secara atomik di sisi server (`server.ts`).
- **Pengecekan Konflik**: Backend memverifikasi slot jam yang diminta terhadap jadwal rutin BUMDES dan reservasi aktif yang ada. Jika slot telah diambil, server merespons dengan kode status HTTP `409 Conflict` dan daftar slot bentrok, mencegah tabrakan jadwal antar-pemesan.
- **Pelepasan Slot Otomatis**: Jika reservasi dibatalkan oleh admin atau staf, slot waktu yang bersangkutan seketika kembali berstatus "Tersedia" di jadwal live tanpa perlu restart server.

### 2.2. Pemesanan Kilat 1-Menit bagi Pelanggan (*Express Quick Booking*)
- **Akses Langsung**: Tombol **⚡ Booking Kilat** tersedia langsung di header jadwal monitoring fasilitas.
- **Formulir Ramping**: Pelanggan cukup memilih fasilitas, tanggal, jam main, serta nama dan nomor WhatsApp, lalu menekan konfirmasi.
- **Penerbitan E-Tiket Instan**: Server langsung mengunci slot dan menerbitkan kode booking resmi (format `BW-YYYYMMDD-XXXX`) lengkap dengan QR code verifikasi dan tautan bagikan ke WhatsApp.

### 2.3. Fitur Pencarian & Cek Status E-Tiket Mandiri
- **Pencarian Cepat**: Pelanggan dapat memasukkan Kode Booking atau nomor WhatsApp mereka pada tombol **🔍 Cek E-Tiket**.
- **Tampilan Tiket Digital**: Menampilkan status pembayaran (Lunas Terverifikasi / Menunggu Pembayaran Loket), rincian sewa, serta tombol cetak bukti reservasi.

### 2.4. Pusat Kendali Reservasi Admin & Karyawan (*Reservation Manager*)
- **Menu Baru**: Terintegrasi langsung di sidebar staf `KaryawanView` ("Reservasi GOR") dan tab `SuperAdminView` ("Kelola Reservasi GOR").
- **Kasir GOR / Form Walk-In (Pemesanan di Loket)**: Petugas dapat mendaftarkan pemain yang datang langsung ke lapangan dalam waktu kurang dari 10 detik dengan opsi metode pembayaran "💵 Tunai Loket" atau "📱 QRIS Kasir".
- **Tindakan Cepat (Quick Actions)**:
  - Verifikasi Lunas (1-klik konfirmasi pembayaran tunai).
  - Check-in Hadir Pemain (validasi kedatangan di lapangan).
  - Pembatalan & Pembebasan Slot.
  - Cetak Bukti Booking Resmi atau kirim pesan notifikasi WhatsApp resmi via tautan langsung.
- **Metrik Hari Ini**: Total pemesanan, perincian lunas vs menunggu pembayaran, dan total penerimaan kas sewa secara live.

---

## 3. Spesifikasi Endpoint API Reservasi

| Metode | Endpoint | Deskripsi | Otorisasi |
|---|---|---|---|
| `GET` | `/api/reservations/schedule?date=YYYY-MM-DD` | Matriks jadwal ketersediaan jam 08:00–21:00 terpadu | Publik |
| `GET` | `/api/reservations` | Daftar seluruh reservasi atau pencarian via `?lookupCode=` / `?whatsapp=` | Terproteksi / Filter Publik |
| `GET` | `/api/reservations/:id` | Rincian tiket reservasi spesifik | Publik / Terotentikasi |
| `POST` | `/api/reservations` | Formulir lengkap booking fasilitas dengan kalkulasi diskon & add-on | Publik / Warga |
| `POST` | `/api/reservations/quick-book` | Pemesanan kilat 1-menit / walk-in loket GOR | Publik / Kasir |
| `PATCH` | `/api/reservations/:id/status` | Pembaruan status pembayaran, check-in, dan pembatalan | Petugas / Admin |

---

## 4. Keamanan & Kepatuhan Data

1. **Privasi Identitas Jadwal Publik**: Endpoint jadwal (`/api/reservations/schedule`) hanya menampilkan label generik `BOOKED` untuk slot yang dipesan secara online, melindungi data pribadi pemesan (nama & no. HP) dari konsumsi publik.
2. **Integritas Transaksi Kas**: Perubahan status lunas pada transaksi tunai hanya dapat dilakukan melalui endpoint terproteksi oleh staf yang bertugas.
3. **Penyimpanan Atomik**: Setiap transaksi reservasi ditulis menggunakan mekanisme `writeDBAtomic` (`fsyncSync` + `renameSync`), mencegah korupsi data jika server mengalami interupsi daya.
