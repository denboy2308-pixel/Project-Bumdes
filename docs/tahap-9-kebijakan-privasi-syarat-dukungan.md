# Dokumentasi Tahap 9: Kebijakan Privasi (UU PDP), Syarat Layanan & Kanal Dukungan Terpadu

BUMDES Waskita Wijaya Desa Waru, Kecamatan Baki, Kabupaten Sukoharjo  
Versi: 1.0 (Produksi V1)

---

## 1. Ikhtisar Tahap 9

Tahap 9 menetapkan kerangka hukum, kepatuhan regulasi, transparansi operasional, serta sarana dukungan dan pengaduan warga (*Citizen Support & Helpdesk Ecosystem*) untuk BUMDES Waskita Wijaya:
1. **Kebijakan Privasi Berstandar UU PDP**: Disusun sesuai Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP), melindungi identitas warga desa dan melarang keras penjualan data ke pihak ketiga.
2. **Syarat & Ketentuan Layanan (Terms of Service)**: Mengatur hak dan kewajiban nasabah bank sampah, penyewa fasilitas publik (GOR & Gedung), transparansi timbangan digital, kebijakan pembatalan/reschedule/refund, serta mediasi sengketa desa.
3. **Kanal Dukungan & Tiket Pengaduan Terpadu**:
   - Integrasi WhatsApp Customer Support resmi (`+62 821-3456-7890`)
   - Formulir tiket pengaduan terpadu dengan nomor registrasi unik (`TKT-ADU-YYYYMMDD-XXX`)
   - Sistem pelacakan status penanganan tiket secara real-time (`/api/support/tickets`)
   - Pusat Tanya Jawab (FAQ) interaktif dengan fitur pencarian instan
4. **Keterhubungan Menyeluruh**: Tautan kebijakan privasi dan syarat layanan tersedia di Footer, formulir pendaftaran nasabah baru (`RegisterNasabah`), dan alur pembayaran pemesanan (`BookingPaymentStep`).

---

## 2. Rincian Dokumen Hukum

### 2.1. Kebijakan Privasi (`PrivacyPolicyView.tsx`)
- **Nomor Registrasi**: `BUMDES-WR/POL-PRIV/2026/V1`
- **Landasan Hukum**: UU No. 27 Tahun 2022 (Pelindungan Data Pribadi) dan Permendesa PDTT.
- **Data yang Dikumpulkan**: Nama, NIK terenkripsi, Nomor WhatsApp, Alamat Dusun/RT/RW, serta riwayat transaksi layanan.
- **Prinsip Minimisasi Data**: Data diproses secara sah semata-mata untuk penagihan iuran sampah, penguncian reservasi, penyaluran cashback kas RT (Rp 5.000/nasabah/bulan), dan penerbitan e-kuitansi.
- **Jaminan Keamanan**: Enkripsi password satu arah (*scrypt hashing*), sesi token acak berbatas waktu, RBAC 3-tier, serta jaminan mutlak larangan penjualan data.
- **Hak Warga**: Hak akses, koreksi mandiri, transparansi mutasi saldo, dan permohonan penutupan akun sukarela.
- **Kontak DPO**: `bumdes.waskitawijaya@waru.desa.id` / Hotline `+62 821-3456-7890`.

### 2.2. Syarat & Ketentuan Layanan (`TermsOfServiceView.tsx`)
- **Nomor Dokumen**: `PERDES-WR/BUMDES-TOS/2026/04`
- **Ketentuan Bank Sampah**: Kewajiban pemilahan jenis sampah, penimbangan digital transparan, iuran bulanan Rp 25.000, serta penarikan saldo tabungan di loket teller tanpa biaya potongan.
- **Tata Tertib Fasilitas GOR & Gedung**:
  - GOR Badminton: Wajib sepatu olahraga non-marking, dilarang merokok/miras, durasi sewa presisi per jam, dan check-in E-Tiket via kasir.
  - Gedung Pertemuan: DP 30% (Rp 750.000) saat slot dikunci, pelunasan paling lambat H-3, serta tanggung jawab keutuhan fasilitas.
- **Kebijakan Reschedule & Refund**:
  - Reschedule lapangan gratis maksimal 6 jam sebelum sesi bermain.
  - Pembatalan > 24 jam berhak refund 100% (dikurangi biaya admin bank).
  - Keadaan Kahar (*Force Majeure*): Penjadwalan ulang penuh atau pengembalian dana 100%.
- **Marketplace UMKM**: Jaminan keaslian produk lokal Desa Waru dan kepatuhan standar halal/P-IRT pangan.
- **Penyelesaian Sengketa**: Musyawarah mufakat di Kantor Desa Waru dengan fasilitasi Kepala Desa dan BPD.

---

## 3. Spesifikasi Kanal Dukungan & API Pengaduan

| Metode | Endpoint | Deskripsi | Otorisasi |
|---|---|---|---|
| `GET` | `/api/support/tickets` | Daftar tiket pengaduan publik / pencarian status via `?lookup=` atau `?ticketId=` | Publik |
| `POST` | `/api/support/tickets` | Mengirimkan tiket aduan/pertanyaan baru (menghasilkan kode `TKT-ADU-...`) | Publik / Warga |
| `PATCH` | `/api/support/tickets/:id` | Memperbarui status penanganan, staf penanggung jawab, dan catatan penyelesaian | Staf / Admin |

---

## 4. Hasil Uji Coba Fungsionalitas (Testing Results)

1. **Uji Akses Halaman Legal**:
   - Klik "Kebijakan Privasi" di footer / bottom bar &rarr; Berhasil membuka `PrivacyPolicyView` lengkap dengan nomor dokumen dan tombol cetak PDF/printer.
   - Klik "Syarat Layanan" di footer &rarr; Berhasil membuka `TermsOfServiceView` lengkap dengan regulasi Perdes dan aturan refund/reschedule.
   - Klik "Kanal Dukungan" di footer &rarr; Berhasil membuka `HelpCenterSupportView` lengkap dengan saluran hotline, form tiket, live tracker, dan FAQ.

2. **Uji Pengiriman Tiket Pengaduan (`POST /api/support/tickets`)**:
   - Input judul, uraian, kategori "Armada Sampah", nama, dan no. WhatsApp &rarr; Status HTTP 201 Created &rarr; Tiket tersimpan di memori dan basis data `db.tickets` dengan nomor registrasi unik.

3. **Uji Pelacakan Tiket (`GET /api/support/tickets?lookup=...`)**:
   - Pencarian kode tiket (misal: `TKT-ADU-108`) atau nomor kontak &rarr; Menampilkan data pelapor, tanggal, status penanganan (*Menunggu Verifikasi*, *Sedang Dikerjakan*, atau *Selesai*), dan catatan petugas lapangan.

4. **Uji Modal Pratinjau Cepat**:
   - Pada halaman `BookingPaymentStep`: Tombol "Baca Rincian Syarat, Tata Tertib & Kebijakan Reschedule / Refund Lengkap" membuka modal tanpa meninggalkan alur pemesanan.
   - Pada halaman `RegisterNasabah`: Link "Syarat & Ketentuan Layanan" dan "Kebijakan Privasi" menampilkan modal dialog ringkasan hak nasabah dan regulasi UU PDP sebelum klik submit.
