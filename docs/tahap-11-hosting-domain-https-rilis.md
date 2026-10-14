# Dokumentasi Tahap 11: Hosting, Domain Resmi (.desa.id), HTTPS & Konfigurasi Rilis Produksi

BUMDES Waskita Wijaya Desa Waru, Kecamatan Baki, Kabupaten Sukoharjo  
Versi: 1.0 (Produksi V1)

---

## 1. Ikhtisar Tahap 11

Tahap 11 menetapkan seluruh spesifikasi teknis dan operasional untuk peluncuran portal digital BUMDES Waskita Wijaya ke lingkungan *hosting* publik dengan perlindungan enkripsi penuh HTTPS dan nama domain resmi instansi desa.

---

## 2. Tata Kelola Domain Resmi (`.desa.id`)

### 2.1. Otoritas & Regulasi Nama Domain
Sesuai Peraturan Menteri Komunikasi dan Informatika Republik Indonesia tentang Pengelolaan Nama Domain Instansi Penyelenggara Negara, nama domain yang digunakan adalah:
- **Domain Resmi**: `https://bumdeswaskita.desa.id`
- **Subdomain Alternatif**: `https://www.bumdeswaskita.desa.id`
- **Penyedia Pendaftaran**: Layanan Domain Instansi Desa Kementerian Kominfo RI / PANDI (Pengelola Nama Domain Internet Indonesia).

### 2.2. Dokumen Persyaratan Pendaftaran Domain Desa
1. Surat Permohonan Nama Domain yang ditandatangani oleh Kepala Desa Waru.
2. Surat Keputusan (SK) Pengangkatan Kepala Desa Waru yang masih berlaku.
3. Peraturan Desa (Perdes) Waru Nomor 04 Tahun 2021 tentang Pendirian Badan Usaha Milik Desa Waskita Wijaya.
4. e-KTP Pemohon / Penanggung Jawab Teknis BUMDes Waru.

### 2.3. Tabel Konfigurasi DNS Records Resmi
| Jenis Record | Host / Nama | Nilai / Tujuan (Target) | TTL | Fungsi |
|---|---|---|---|---|
| **A** | `@` | `[IP_SERVER_PRODUKSI]` | 300 (Auto) | Mengarahkan domain utama ke server portal |
| **CNAME** | `www` | `bumdeswaskita.desa.id.` | 300 (Auto) | Mengarahkan alias www ke domain utama |
| **TXT** | `@` | `google-site-verification=...` | 3600 | Verifikasi kepemilikan Google Search Console |
| **TXT** | `@` | `v=spf1 include:_spf.google.com ~all` | 3600 | Autentikasi email resmi desa (anti-spoofing) |
| **CAA** | `@` | `0 issue "letsencrypt.org"` | 3600 | Otorisasi penerbit sertifikat SSL/TLS |

---

## 3. Pilihan Infrastruktur Hosting

### Opsi A: Google Cloud Run (Rekomendasi Utama)
- **Tipe**: Serverless Container (Fully Managed).
- **Region**: `asia-southeast2` (Jakarta) atau `asia-east1`.
- **Fitur Utama**:
  - Penskalaan otomatis dari 0 hingga ratusan kontainer secara elastis sesuai kepadatan pengunjung.
  - Sertifikat SSL/TLS Google-Managed diterbitkan otomatis tanpa perpanjangan manual.
  - Integrasi native dengan identitas komputasi awan dan *Zero Maintenance OS*.
- **Perintah Deploy**:
  ```bash
  # 1. Build image dengan Google Cloud Build
  gcloud builds submit --tag gcr.io/[PROJECT_ID]/bumdes-waskita-app

  # 2. Deploy ke Cloud Run
  gcloud run deploy bumdes-waskita-service \
    --image gcr.io/[PROJECT_ID]/bumdes-waskita-app \
    --platform managed \
    --region asia-southeast2 \
    --allow-unauthenticated \
    --port 3000 \
    --set-env-vars NODE_ENV=production,ENABLE_HTTPS_REDIRECT=true
  ```

### Opsi B: Virtual Private Server (VPS) Dedicated (Linux Ubuntu 24.04 LTS)
Bagi pemerintah desa yang menyewa VPS lokal (misal: IDCloudHost, Biznet Gio, atau Linode):
1. **Container Engine**: Docker Engine & Docker Compose dengan berkas `Dockerfile` multi-stage bawaan.
2. **Reverse Proxy & SSL**:
   - Pilihan 1: **Caddy Web Server** (`caddy/Caddyfile`) dengan sertifikat Let's Encrypt terotomatisasi penuh dan kompresi Zstandard/Gzip.
   - Pilihan 2: **Nginx** (`nginx/bumdeswaskita.conf`) dengan Certbot ACME bot.

---

## 4. Keamanan HTTPS & Perlindungan Jaringan (Security Hardening)

Seluruh middleware keamanan telah aktif di `server.ts`:
1. **Proxy Trust**: `app.set('trust proxy', 1)` diaktifkan agar Express mengenali alamat IP asli dan protokol HTTPS di balik reverse proxy.
2. **Pengalihan Otomatis HTTPS (301 Permanent Redirect)**:
   Setiap permintaan melalui protokol HTTP tanpa enkripsi otomatis dialihkan ke HTTPS resmi.
3. **HTTP Strict Transport Security (HSTS)**:
   Header `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` memaksa browser selalu terhubung melalui enkripsi TLS 1.3 selama 1 tahun penuh.
4. **Header Pertahanan Browser**:
   - `X-Content-Type-Options: nosniff` (mencegah MIME-sniffing exploit).
   - `X-XSS-Protection: 1; mode=block` (mencegah refleksi skrip jahat).
   - `Referrer-Policy: strict-origin-when-cross-origin` (melindungi kerahasiaan URL rujukan).
   - `Permissions-Policy: camera=(self), microphone=(), geolocation=(self)` (membatasi izin perangkat keras).

---

## 5. Konfigurasi Lingkungan Produksi (`.env`)

Template konfigurasi tersimpan di `.env.example`:
```env
NODE_ENV="production"
PORT=3000
APP_URL="https://bumdeswaskita.desa.id"
PRODUCTION_DOMAIN="bumdeswaskita.desa.id"
ENABLE_HTTPS_REDIRECT="true"
SESSION_SECRET="[RANDOM_64_CHARACTERS_HEX_KEY]"
CORS_ALLOWED_ORIGINS="https://bumdeswaskita.desa.id"
```

---

## 6. Prosedur Rilis & Verifikasi Operasional (Runbook)

1. **Kompilasi Aset Produksi**:
   ```bash
   npm run build
   ```
   *Menghasilkan bundle Vite di `dist/` dan berkas server terkompilasi di `dist/server.cjs`.*
2. **Menjalankan Server**:
   ```bash
   npm run start
   ```
   *Menjalankan `node dist/server.cjs` pada port 3000.*
3. **Pemeriksaan Kesehatan (*Health Check Probe*)**:
   ```bash
   curl -I http://localhost:3000/api/health
   # Respons wajib: HTTP/1.1 200 OK dengan {"status":"healthy", ...}
   ```
4. **Pemeriksaan Header Keamanan**:
   ```bash
   curl -I http://localhost:3000/
   # Memastikan adanya header Strict-Transport-Security dan X-Content-Type-Options
   ```
