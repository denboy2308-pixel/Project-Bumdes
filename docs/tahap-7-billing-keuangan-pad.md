# Dokumentasi Tahap 7: Sistem Billing Terintegrasi, E-Kuitansi Digital, Pelacakan QRIS, dan Buku Kas Alokasi PAD Desa

BUMDES Waskita Wijaya Desa Waru, Kecamatan Baki, Kabupaten Sukoharjo  
Versi: 1.0 (Produksi V1)

---

## 1. Ikhtisar Tahap 7

Tahap 7 melengkapi ekosistem BUMDES Waskita Wijaya dengan sistem manajemen keuangan ujung-ke-ujung (*end-to-end financial system*):
1. **Penerbitan & Penagihan Tagihan (Billing & Invoice)**: Mencakup retribusi bank sampah warga per dusun/RT, sewa fasilitas GOR badminton dan gedung serbaguna, serta transaksi marketplace UMKM desa.
2. **E-Kuitansi Resmi Digital**: Penerbitan bukti setor bernomor seri sah (`KWT-BW-YYYYMM-XXXX`) dengan tanda tangan digital bendahara/sistem dan format siap cetak/unduh PDF.
3. **Pelacak QRIS Real-Time & Auto-Settlement**: Monitor transaksi QRIS dinamis ber-NMID nasional (`ID102600987123`) dengan verifikasi lunas instan ke sistem invoice dan kasir.
4. **Buku Kas BUMDes Otomatis**: Integrasi pencatatan kas masuk dan keluar secara riil yang otomatis tersinkronisasi saat invoice atau reservasi dilunasi.
5. **Kalkulator & Alokasi PAD Desa Waru**: Distribusi laba bersih BUMDes berdasarkan Perdes (40% Pendapatan Asli Desa Waru, 30% Cadangan Modal, 20% Jasa Pengurus/Karyawan, 10% Dana Sosial Warga).

---

## 2. Fitur Baru yang Diimplementasikan

### 2.1. Modul Penagihan Digital & Invoice Terpusat (*BillingModule*)
- **Filter Berdasarkan Periode & Wilayah**: Memungkinkan kasir dan admin menyaring tagihan berdasarkan bulan (contoh: *September 2026*), zona dusun/RT, serta status pelunasan (*Lunas* vs *Belum Bayar*).
- **Pembuatan Invoice Baru**: Dukungan input tagihan kustom dengan nomor invoice unik (`INV-2026-XXX`), tanggal jatuh tempo, dan nominal terstandar.
- **Penerimaan Pembayaran di Loket / Online**: Staf kasir dapat memverifikasi pembayaran tunai, QRIS, atau transfer bank dalam 1 klik dengan pencatatan nama verifikator resmi.
- **Pengingat Jatuh Tempo WhatsApp**: Generasi pesan pengingat tagihan instan dengan tautan pembayaran yang siap dikirim langsung ke nomor WhatsApp nasabah.
- **Pratinjau & Cetak Dokumen PDF**: Fitur cetak invoice perorangan dan rekapitulasi penagihan massal format surat dinas BUMDes.

### 2.2. Modul Keuangan Bisnis & Alokasi PAD Desa (*BusinessFinanceModule*)
- **Ringkasan Finansial Real-Time**: Menampilkan Total Pemasukan, Total Pengeluaran, Saldo Kas Berjalan, serta Piutang Tertunggak yang diambil langsung dari backend server.
- **Buku Kas Masuk & Keluar**: Pencatatan transaksi manual untuk biaya operasional kantor, pemeliharaan sarana prasarana desa, atau pendapatan usaha sampingan.
- **Distribusi PAD Desa Waru**:
  - `40%` PAD Pemdes Waru (pemberdayaan infrastruktur dan kas desa).
  - `30%` Cadangan Modal Pengembangan BUMDes.
  - `20%` Jasa Pengurus, Teller, dan Karyawan Operasional.
  - `10%` Dana Sosial dan Bantuan Warga Pra-Sejahtera.
- **Monitor QRIS BUMDes**: Log transaksi digital lengkap dengan jam pembayaran, nama pembayar, nomor invoice, dan status penyelesaian (*settled*).
- **Manajemen Penggajian (Payroll)**: Rekapitulasi gaji pokok dan insentif pengelola BUMDes.

### 2.3. Portal Pembayaran & E-Kuitansi Mandiri Warga (*CustomerPaymentHistory*)
- **Riwayat Tagihan Pribadi**: Warga nasabah dapat melihat daftar tagihan aktif maupun tagihan lunas mereka.
- **Bayar via QRIS Mandiri**: Pop-up QRIS dinamis yang dapat langsung discan oleh nasabah dengan simulasi verifikasi instan.
- **E-Kuitansi Resmi**: Penerbitan bukti bayar dengan nomor kuitansi, tanggal pelunasan, cap digital, dan tombol cetak bukti pembayaran.

### 2.4. Sinkronisasi Antar-Modul yang Mulus (Cross-Module Sync)
- **Pendaftaran Nasabah Baru**: Setiap nasabah baru yang mendaftar melalui `/api/auth/register` secara otomatis menerima invoice perdana retribusi bank sampah (Rp 25.000) untuk pengujian pembayaran digital.
- **Reservasi Cepat & Booking Kilat**: Setiap reservasi fasilitas yang berstatus lunas otomatis mencatat pendapatan pada Buku Kas BUMDes dan tabel transaksi QRIS secara atomik.

---

## 3. Spesifikasi Endpoint API Keuangan & Billing

| Metode | Endpoint | Deskripsi | Otorisasi |
|---|---|---|---|
| `GET` | `/api/billing` | Daftar seluruh invoice tagihan atau filter per user / periode / dusun | Publik / Pelanggan / Kasir |
| `POST` | `/api/billing` | Menerbitkan invoice baru atas nama nasabah | Kasir / Admin |
| `PATCH` | `/api/billing/:id/pay` | Menerima pembayaran invoice, menerbitkan E-Kuitansi, dan mencatat ke Buku Kas | Kasir / Teller / Sistem QRIS |
| `POST` | `/api/billing/send-reminder` | Menghasilkan pesan dan tautan pengingat WhatsApp tagihan | Kasir / Admin |
| `GET` | `/api/finance/summary` | Rekapitulasi neraca keuangan, piutang, dan skema bagi hasil PAD Desa | Publik / Admin / BPD |
| `GET` | `/api/finance/transactions` | Daftar transaksi buku kas masuk dan keluar | Teller / Kasir / Admin |
| `POST` | `/api/finance/transactions` | Mencatat transaksi kas operasional baru | Teller / Bendahara |
| `GET` | `/api/finance/qris` | Daftar transaksi masuk dari QRIS dinamis BUMDes | Teller / Kasir / Admin |
| `POST` | `/api/finance/qris/simulate-scan` | Eksekusi pelunasan instan invoice melalui pemindaian QRIS | Nasabah / Publik / Kasir |

---

## 4. Keamanan & Integritas Buku Kas

1. **Jaminan Transaksi Atomik**: Penulisan data buku kas dan invoice terproteksi dengan fungsi `writeDBAtomic` untuk mencegah *race conditions* atau data rusak.
2. **Nomor Kuitansi Unik**: Format kuitansi `KWT-BW-YYYYMM-XXXX` dijamin tidak berulang dan terikat pada ID invoice asalnya.
3. **Pemisahan Hak Akses**: Warga hanya dapat melihat riwayat tagihan pribadi mereka berdasarkan NIK, nomor WhatsApp, atau ID nasabah pada sesi login aktif.
