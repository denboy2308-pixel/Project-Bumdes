# Rencana Arsitektur Produksi Versi 1.0 (BUMDES Waskita Wijaya)

Dokumen ini menetapkan keputusan dan cetak biru arsitektur rilis pertama untuk aplikasi BUMDES Waskita Wijaya Desa Waru, Kecamatan Baki, Kabupaten Sukoharjo. Dokumen ini didasarkan pada kondisi implementasi nyata kode sumber saat ini serta memisahkan kesiapan kode dari tahapan *cloud provisioning*.

---

## 1. Audit Implementasi Riil Saat Ini

Berdasarkan audit menyeluruh terhadap kode sumber aktif:
1. **Frontend**: React 19 SPA dengan Vite dan Tailwind CSS. Komponen UI mencakup Beranda Publik, Reservasi GOR & Gedung, Marketplace UMKM, Layanan Pengelolaan Sampah, Portal Nasabah/Warga, dan Panel Dashboard Admin/Staf.
2. **Backend**: Node.js Express (`server.ts`) yang berjalan terintegrasi dengan Vite middleware saat pengembangan (`"dev": "tsx server.ts"`) dan dibundel menjadi CJS (`dist/server.cjs`) untuk produksi (`"start": "node dist/server.cjs"`).
3. **Database Aktif**: JSON lokal terisolasi (`data/db.json`) dengan operasi penulisan atomik (`writeDBAtomic` via berkas temporer + `fsyncSync` + `renameSync`) dan izin berkas ketat (`mode: 0o600`).
4. **Autentikasi Aktif**: Manajemen sesi token internal (`db.sessions`) dengan kata sandi ter-hash scrypt ber-salt acak dan verifikasi waktu-konstan (`crypto.timingSafeEqual`). Metadata akun dibackup tanpa kredensial ke `data/backups/account_metadata_backup.json`.
5. **Penyimpanan Berkas Aktif**: Multer menyimpan unggahan dokumen ke direktori lokal privat (`data/uploads/`), dilindungi verifikasi kepemilikan token di endpoint `/api/files/download/:id`.
6. **Integrasi Firebase / Firestore**: Konfigurasi klien telah diinisialisasi di `src/lib/firebase.ts`, dan file `firestore.rules` telah diperketat dengan prinsip *default-deny* dan helper *custom claim* RBAC. Namun, operasi bisnis (registrasi, transaksi, reservasi) saat ini masih dilayani oleh API Express lokal, bukan panggilan langsung Firestore dari peramban.

---

## 2. Pilihan Arsitektur Rilis Pertama: *Trusted Backend-Driven Architecture*

Untuk rilis pertama (V1.0), arsitektur yang dipilih dan direkomendasikan adalah **Trusted Backend-Driven Architecture** (Frontend SPA + Trusted Express API Gateway + Managed Persistence).

```
[Browser / Client (React SPA)]
            │
            ▼ (HTTPS / API calls with Bearer Token)
[Trusted Express Server (Containerized Node.js)]
      ├── Rate Limiting & Input Validation
      ├── Auth Verification (Scrypt / Firebase Admin SDK)
      ├── Role-Based Access Control (RBAC)
      ├── Double-Booking Lock / Atomic Transactions
      └── File Upload Validation (Magic Bytes / Size Limit)
            │
      ┌─────┴─────────────────────────┐
      ▼                               ▼
[Persistent Database]       [Cloud Storage / Encrypted Vault]
(Cloud SQL / Firestore via  (Private Bucket with Signed URLs)
 Trusted Admin SDK)
```

### Mengapa Arsitektur Ini yang Dipilih?
1. **Integritas Transaksi Finansial**: Operasi kas desa, pembagian deviden PAD, penarikan saldo nasabah sampah, dan pembayaran sewa tidak boleh dimutasi langsung oleh klien peramban.
2. **Pencegahan Booking Ganda**: Reservasi lapangan bulutangkis dan sewa gedung serbaguna membutuhkan *transactional lock* atau atomic validation di sisi server sebelum konfirmasi diterbitkan.
3. **Kesesuaian dengan Aturan Firestore yang Ada**: Aturan pada `firestore.rules` sengaja menutup hak *create/update/delete* klien untuk koleksi sensitif (`/admins`, `/auditLogs`, `/reservations`, `/hallBookings`, `/finances`, `/siteSettings`), mewajibkan penulisan melalui *trusted backend*.

---

## 3. Komponen Arsitektur & Rekomendasi Alur

### 3.1. Alur Autentikasi & RBAC
- **Rilis V1.0**: Backend Express memverifikasi sesi melalui token dengan hash scrypt satu arah (`$scrypt$v=1$...`).
- **Target Transisi Cloud**: 
  - Akun staf/admin dikaitkan dengan Firebase Authentication / Identity Platform.
  - Otorisasi peran diterapkan melalui **Firebase Auth Custom Claims** (`role: 'superadmin' | 'karyawan' | 'bendahara' | ...`) yang hanya dapat diterbitkan oleh Backend melalui Firebase Admin SDK.
  - Klien tidak dapat merekayasa klaim peran, dan operasi staf mewajibkan `email_verified == true` sesuai dengan `firestore.rules`.

### 3.2. Database Persisten
- **Keadaan Saat Ini**: `data/db.json` dengan penulisan atomik aman.
- **Rekomendasi Produksi**: 
  - Data operasional terdistribusi dipindahkan ke Firestore (atau Cloud SQL PostgreSQL) terkelola.
  - Seluruh operasi penulisan data finansial dan status reservasi dijalankan via Admin SDK di backend Express tepercaya.
  - Hak baca dokumen profil dibatasi hanya untuk pemilik UID atau admin berwenang.

### 3.3. Penyimpanan Berkas (File Storage)
- **Keadaan Saat Ini**: Direktori lokal `data/uploads/` dengan streaming terotentikasi.
- **Rekomendasi Produksi**:
  - Berkas dipindahkan ke Google Cloud Storage (Bucket privat).
  - Akses unduhan dokumen warga (foto bukti, KTP/surat) hanya diberikan melalui *Signed URL* berdurasi terbatas (misalnya 15 menit) setelah validasi sesi di backend.
  - Tidak ada *bucket* publik untuk dokumen kependudukan.

### 3.4. Operasi Finansial & Pembayaran Tepercaya
- **Prinsip**: Klien dilarang mengubah saldo, menerbitkan tiket lunas, atau mengubah status tagihan.
- **Alur Pembayaran**:
  1. Pengguna mengajukan pesanan / reservasi -> status awal `PENDING_VERIFICATION` dengan waktu kedaluwarsa (*holding time*).
  2. Pembayaran via Transfer Bank / QRIS diverifikasi melalui *webhook* resmi penyedia pembayaran (*payment gateway*) ber-signature HMAC, atau verifikasi manual oleh peran `bendahara` melalui panel tertutup.
  3. Status diubah menjadi `CONFIRMED` dan tiket/e-kuitansi diterbitkan secara atomik di server.

### 3.5. Secrets & Environment Management
- Variabel lingkungan rahasia tidak boleh dikompilasi ke dalam bundel klien (`VITE_`).
- Rahasia seperti kunci privat Admin SDK, database credential, webhook secret, dan kunci sesi dimuat murni di lingkungan server runtime via `process.env`.
- Berkas `.env.example` disiapkan sebagai dokumentasi variabel tanpa membocorkan nilai rahasia.

### 3.6. Strategi Migrasi Akun Scrypt yang Ada
- Format hash saat ini (`$scrypt$v=1$N=16384,r=8,p=1$<saltHex>$<derivedKeyHex>`) adalah standar kriptografi mandiri (*self-describing*).
- **Prosedur Migrasi**:
  1. Ekspor data akun dari `data/db.json` menggunakan script migrasi internal.
  2. Saat migrasi ke database persisten baru, data `id`, `email`, `passwordHash`, dan profil dipetakan tanpa mengubah isi hash.
  3. Verifikator server tetap menggunakan algoritma scrypt dengan salt dan parameter yang tersimpan di hash.
  4. Pengguna tidak perlu mereset kata sandi dan login lama tetap berfungsi normal.

### 3.7. Backup & Disaster Recovery
- Backup metadata harian otomatis tanpa kredensial/data privat (seperti format `account_metadata_backup.json`).
- Cadangan database persisten harian (*snapshot*) dengan retensi minimal 30 hari.
- Prosedur pemulihan (*disaster recovery*): Pemulihan snapshot database ke *staging instance* untuk pengujian integritas data sebelum dialihkan ke *production*.

---

## 4. Pemisahan Batasan: Kesiapan Kode vs. Cloud Provisioning

| Aspek | Sudah Siap di Kode Sumber | Menunggu Cloud Provisioning |
|---|---|---|
| **Keamanan Password** | Hashing scrypt, salt acak, timing-safe equal | Integrasi Identity Platform / Auth provider |
| **Firestore Security** | Aturan `firestore.rules` default-deny & RBAC | Deploy rules ke project cloud via tool resmi |
| **Pencegahan Bocoran** | Masking NIK/kontak, penutupan endpoint admin | Pengaturan IAM GCP / Secret Manager |
| **Reservasi & Transaksi** | Validasi input dan proteksi data di backend | Konfigurasi Redis / Transaction lock & Payment Gateway |
| **File Storage** | Upload handler lokal privat & verifikasi akses | Penyediaan Google Cloud Storage Bucket & IAM |
| **Environment** | Template konfigurasi `.env.example` terstandar | Injeksi environment variable di Cloud Run/Hosting |

*Catatan: Dokumen ini tidak melakukan pembuatan layanan cloud, migrasi akun prematur, ataupun deployment sebelum disepakati.*
