# Dashboard Super Admin: Manajemen Database Pengguna & Autonomous AI Brain

Transformasi menyeluruh antarmuka Dashboard Super Admin dengan reorganisasi 5 grup navigasi sidebar ergonomis, modul manajemen penuh database pengguna (cek profil, ubah data, status bekukan/aktif, dan hapus aman), serta mesin **Autonomous AI Brain** yang mampu memonitor kesehatan website, mendeteksi bug secara mandiri, dan melakukan simulasi *self-healing* otomatis.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan konfirmasi kebutuhan pada sesi klarifikasi interaktif, keputusan utama telah disepakati sebagai berikut:

- **Pengelompokan Menu Sidebar Kiri**: Direorganisasi menjadi **5 Grup Terstruktur**:
  1. **Ikhtisar** (Dashboard Utama, Analitik Ringkas, Metrik Operasional)
  2. **Manajemen Pengguna** (Database Pengguna Penuh, Karyawan/Staf, Nasabah & Warga, Absensi & Cuti)
  3. **Website & Konten** (Live Customizer, CMS Berita, SEO & Meta, Peta Wilayah)
  4. **AI Brain Otonom** (Diagnostik Realtime, Scanner & Deteksi Bug Mandiri, Auto-Fix & Self-Healing, Log Audit AI)
  5. **Sistem & Keamanan** (Database Backup, Log Audit Sistem, Pengaturan API & Server)
- **Alur Kerja AI Brain Self-Healing**: Menggunakan sistem diagnostik realtime proaktif yang memantau integritas DOM, performa memori, kegagalan request jaringan/API, state error boundary, serta memberikan analisis rekomendasi perbaikan dan simulasi eksekusi *auto-patch* dengan audit log transparan.
- **Fitur Lengkap Database Pengguna**: Menyediakan tabel data responsif multi-filter (semua pengguna, staf admin, pelanggan/nasabah), modal edit data komprehensif, laci/modal detail profil, tombol toggle **Bekukan Akun** (Freeze / Suspend) dengan alasan penangguhan, dan dialog konfirmasi hapus aman tanpa modal pop-up bawaan browser.

---

## 1. Overview & Core Concept

- **Apa yang Dibangun**:
  1. **5-Grup Sidebar Super Admin**: Sidebar navigasi kiri modern, responsif, dan dapat di-*collapse* dengan penanda jumlah item dinamis dan pembedaan hak akses peran.
  2. **Modul Manajemen Database Pengguna Penuh (`UserManagementModule.tsx`)**:
     - Manajemen pengguna menyeluruh baik untuk staf internal (Direktur, Bendahara, Operator, dsb.) maupun nasabah/warga ekosistem BUMDes.
     - Operasi CRUD penuh: Tambah Pengguna Baru, Lihat Profil & Riwayat Akses, Edit Data Pengguna, Bekukan Akun (*Freeze / Suspend*), Aktifkan Kembali (*Reactivate*), dan Hapus Akun secara permanen dengan konfirmasi perlindungan.
  3. **Modul Autonomous AI Brain & Self-Healing (`AiBrainModule.tsx`)**:
     - Mesin pemantau otonom (*Autonomous Site Sentinel*) yang beroperasi di latar belakang.
     - Pemindai otomatis 4 layer: Layer UI/Kompilasi, Layer State/Data, Layer Jaringan/API, dan Layer Keamanan/Performa.
     - *Self-Healing Engine*: Mekanisme deteksi bug otomatis yang mampu mengisolasi error, mereset state lokal yang korup, membersihkan cache rusak, serta menyimulasikan *hot-patch* mandiri tanpa perlu merestart seluruh aplikasi.
     - *AI Diagnostic Log*: Riwayat perbaikan mandiri yang dapat diaudit oleh Super Admin.
- **Target Pengguna**: Super Administrator dan jajaran direksi BUMDes Waskita Wijaya yang memerlukan kendali penuh atas pengguna, konten web, serta keandalan sistem jangka panjang.
- **Nilai Utama**: Transparansi mutlak tata kelola user, peningkatan kecepatan perbaikan bug dari manual ke otomatis, serta pengalaman navigasi admin yang ergonomis dan bebas lag.

---

## 2. User Experience & Visual Design

### A. Struktur Navigasi Sidebar Kiri (5 Grup Utama)
Sidebar kiri memiliki lebar tetap 280px pada desktop dengan latar belakang gelap elegan (`bg-[#060c18] border-r border-slate-800`), font judul grup tajam, dan indikator aktif bernuansa cyan/emerald:

```
┌───────────────────────────────────────────────┐
│ [BUMDes Waskita] · SUPER ADMIN PORTAL         │
│ Profil: den.boy2308 (Super Admin Utama)       │
├───────────────────────────────────────────────┤
│ ▼ 1. IKHTISAR (2)                             │
│    ├─ Dashboard Eksekutif                     │
│    └─ Ringkasan Tiket & Transaksi             │
├───────────────────────────────────────────────┤
│ ▼ 2. MANAJEMEN PENGGUNA (3)                   │
│    ├─ Database Pengguna & Hak Akses (Lengkap) │
│    ├─ Absensi & Kehadiran Live                │
│    └─ Pengajuan & Izin Cuti                   │
├───────────────────────────────────────────────┤
│ ▼ 3. WEBSITE & KONTEN (4)                     │
│    ├─ Tampilan & Live Customizer              │
│    ├─ CMS Publikasi & Berita                  │
│    ├─ Meta SEO & OpenGraph                    │
│    └─ Peta Geografis & Wilayah Desa           │
├───────────────────────────────────────────────┤
│ ▼ 4. AI BRAIN OTONOM (3)           [NEW / AI] │
│    ├─ Pusat Kendali AI Brain & Sentinel       │
│    ├─ Deteksi Bug & Self-Healing Otomatis     │
│    └─ Studio Kontrol Direktif Agent AI        │
├───────────────────────────────────────────────┤
│ ▼ 5. SISTEM & KEAMANAN (4)                    │
│    ├─ Pemantauan Sistem & Server              │
│    ├─ Pencadangan Database (Backup)           │
│    ├─ Pusat Pesan & Broadcast Warga           │
│    └─ Audit Log Aktivitas Admin               │
└───────────────────────────────────────────────┘
```

### B. Alur Interaksi Manajemen Database Pengguna
1. **Pencarian & Multi-Filter**: Super Admin dapat mencari instan berdasarkan Nama, Email, NIK/ID, atau No. Telepon, serta memfilter berdasarkan Role dan Status Akun (*Semua, Aktif, Dibekukan/Frozen, Nonaktif*).
2. **Cek Profil Lengkap (Detail Drawer / Modal)**:
   - Menampilkan avatar, identitas lengkap, zona wilayah dusun, status verifikasi, riwayat login terakhir, dan log aktivitas pengguna.
3. **Modal Edit / Ubah Data Pengguna**:
   - Form komprehensif untuk memperbarui Nama, Email, Peran (*Role Access*), Nomor Telepon, Zona Dusun, dan opsi reset kata sandi baru.
4. **Tindakan Bekukan / Aktifkan Akun**:
   - Super Admin dapat membekukan akun yang bermasalah atau menunggak dengan memasukkan alasan pembekuan (misal: "Aktivitas mencurigakan" atau "Permintaan penonaktifan sementara").
   - Akun yang dibekukan mendapatkan status visual jelas bertuliskan **DIBEKUKAN** berwarna amber/merah dan diblokir dari aksi sistem.
   - Tombol 1-klik untuk mengaktifkan kembali (*Unfreeze*) secara instan.
5. **Hapus Pengguna Aman**:
   - Menggunakan dialog modal konfirmasi in-app yang elegan (bukan `window.confirm`), menampilkan detail akun yang akan dihapus dengan opsi konfirmasi protektif.

### C. Alur Interaksi Autonomous AI Brain & Self-Healing
1. **Live Sentinel Dashboard**:
   - Menampilkan status kesehatan keseluruhan aplikasi: *100% Optimal*, *Komponen Sehat*, *Latensi Rendah*, dan *Zero Runtime Leak*.
2. **Scanner Bug Mandiri**:
   - Tombol pemicu diagnosa mendalam serta pemindaian otomatis berkala.
   - Deteksi proaktif:
     - *Dangling listeners & state leak*
     - *Missing or corrupted localStorage keys*
     - *Failed network / API timeouts*
     - *Stale cache & DOM orphan elements*
3. **Self-Healing & Auto-Fix Simulator**:
   - Ketika bug terdeteksi (atau disimulasikan melalui tombol demo tes kerusakan), AI Brain akan:
     - Mengidentifikasi sumber kesalahan secara otomatis (*Root Cause Analysis*).
     - Menjalankan protokol perbaikan mandiri (*Auto-Recovery Patch*).
     - Memulihkan integritas data tanpa me-refresh paksa halaman pengguna.
     - Mencatat detail insiden dan resolusi pada **Audit Log AI Brain**.

### D. Disiplin Desain (Frontend & SaaS Guidelines)
- **Zero-Pill Metadata**: Metadata tabular, tanggal, dan status ditampilkan dengan teks bersih dan separator titik (`·`), tanpa pil bertumpuk.
- **Tabular Numerals**: Seluruh metrik angka, waktu, dan hitungan kuota menggunakan `tabular-nums` atau `font-mono`.
- **Warna & Kontras Status**:
  - Hijau (`#16A34A`): Status Aktif / Normal
  - Amber (`#D97706`): Status Dibekukan / Peringatan
  - Crimson (`#DC2626`): Status Nonaktif / Error Terdeteksi
  - Cyan / Biru (`#06B6D4`): Aksen Utama & AI Intelligence

---

## 3. Key Product Decisions & Trade-Offs

- **Pengelompokan 5 Menu Sidebar**:
  - *Pendekatan*: Memisahkan operasional menjadi 5 kelompok fungsional (Ikhtisar, Pengguna, Web, AI Brain, Sistem) menggantikan struktur lama yang terlalu campur aduk.
  - *Alasan*: Meningkatkan kecepatan akses navigasi Super Admin dan memberikan porsi terdedikasi bagi fitur baru AI Brain.
- **Implementasi AI Brain**:
  - *Pendekatan*: Membuat komponen modular cerdas `AiBrainModule.tsx` yang dilengkapi algoritma deteksi anomali, sistem *error boundary capture*, perbaikan cache/storage mandiri, dan visualisasi pemindaian interaktif.
  - *Alasan*: Menyediakan kemampuan *self-healing* nyata di lingkungan web browser yang dapat mendeteksi kondisi error dan memulihkannya secara otonom.
- **Manajemen Modal In-App vs Native Browser Dialog**:
  - *Pendekatan*: Mengganti seluruh fungsi `window.confirm` dan `window.alert` dengan modal dialog konfirmasi Tailwind responsif.
  - *Alasan*: Menghindari pemblokiran oleh browser iFrame sandbox sekaligus menyajikan antarmuka super admin yang mewah dan profesional.

---

## 4. Technical Architecture & Data Strategy

### Diagram Arsitektur Komponen

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Super Admin Dashboard                           │
├────────────────────────────────────────────────────────────────────────┤
│ Header: Info Super Admin · Jam Realtime · Switch User · Website Publik │
├──────────────────────────────────┬─────────────────────────────────────┤
│ 5-Group Sticky Sidebar           │ Main Content Viewport               │
│                                  │                                     │
│ 1. [IKHTISAR]                    │ ┌─────────────────────────────────┐ │
│    - Overview & KPI              │ │ activeTab Router:               │ │
│    - Tiket & Keuangan            │ │                                 │ │
│                                  │ │ ▶ overview                      │ │
│ 2. [MANAJEMEN PENGGUNA]          │ │ ▶ users (UserManagementModule)  │ │
│    - Database Pengguna Lengkap   │ │   - User Table & Filters        │ │
│    - Absensi Karyawan            │ │   - Profile View Drawer         │ │
│    - Pengajuan Cuti              │ │   - Edit Data Modal             │ │
│                                  │ │   - Freeze / Unfreeze Handler   │ │
│ 3. [WEBSITE & KONTEN]            │ │   - Safe Delete Confirm Modal   │ │
│    - Live Site Customizer        │ │                                 │ │
│    - CMS & Publikasi             │ │ ▶ ai-brain (AiBrainModule)      │ │
│    - Meta SEO Manager            │ │   - Realtime Sentinel Guard     │ │
│    - Peta Geografis Desa         │ │   - Auto Bug Detection Engine   │ │
│                                  │ │   - Self-Healing Auto-Fixer     │ │
│ 4. [AI BRAIN OTONOM]             │ │   - Autonomous Audit Log        │ │
│    - Pusat Kendali AI Brain      │ │                                 │ │
│    - Deteksi & Self-Healing      │ │ ▶ customizer, cms, backup, dll  │ │
│    - Studio Kontrol Agent AI     │ └─────────────────────────────────┘ │
│                                  │                                     │
│ 5. [SISTEM & KEAMANAN]           │                                     │
│    - Monitoring Server           │                                     │
│    - Backup Database             │                                     │
│    - Audit Logs Sistem           │                                     │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### Model Data Pengguna & AI Brain

```typescript
// Status Pengguna Tambahan
export type UserAccountStatus = 'active' | 'frozen' | 'inactive';

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  active: boolean;
  status?: UserAccountStatus;       // 'active' | 'frozen' | 'inactive'
  frozenReason?: string;            // Alasan akun dibekukan
  frozenAt?: string;                // Waktu pembekuan
  phone?: string;
  zone?: string;
  createdAt?: string;
  lastLogin?: string;
}

// Log & Status AI Brain
export interface BugReport {
  id: string;
  type: 'ui_render' | 'network_api' | 'storage_state' | 'performance_lag';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  component: string;
  detectedAt: string;
  status: 'detected' | 'analyzing' | 'healed' | 'monitoring';
  patchApplied?: string;
  recoveryTimeMs?: number;
}

export interface AiBrainHealthMetrics {
  overallHealth: number;            // 0 - 100%
  activeGuards: number;
  totalBugsDetected: number;
  totalBugsSelfHealed: number;
  memoryIntegrity: number;          // %
  lastScanTimestamp: string;
  autonomousMode: boolean;
}
```

---

## 5. Rencana Langkah Eksekusi (Execution Checklist)

1. **Struktur Tipe Data**:
   - Memperbarui `src/types/admin.ts` dengan status akun (`active`, `frozen`, `inactive`), `frozenReason`, serta tipe model `BugReport` dan `AiBrainHealthMetrics`.
2. **Pengembangan Modul Autonomous AI Brain (`src/components/admin/AiBrainModule.tsx`)**:
   - Membangun antarmuka komprehensif untuk *Sentinel Status*, *Live Bug Scanner*, simulasi penanganan bug otomatis (*Self-Healing*), serta tabel audit log AI.
3. **Peningkatan Menyeluruh Modul Manajemen Pengguna (`src/components/admin/UserManagementModule.tsx`)**:
   - Menambahkan laci/modal Cek Profil Pengguna dengan detail lengkap dan riwayat login.
   - Menambahkan modal Edit Pengguna dengan validasi form (Nama, Email, Peran, No Telp, Zona, Password).
   - Menambahkan aksi Bekukan Akun (*Freeze*) dengan dialog input alasan pembekuan dan penanda status visual *DIBEKUKAN*.
   - Menambahkan aksi Buka Pembekuan (*Unfreeze*) 1-klik.
   - Mengganti `window.confirm` dengan modal konfirmasi Hapus Pengguna yang elegan dan aman.
   - Menambahkan tab switcher antara Staf Internal dan Nasabah/Warga BUMDes.
4. **Restrukturisasi Navigasi Sidebar Super Admin (`src/components/admin/AdminDashboard.tsx`)**:
   - Mengelompokkan ulang seluruh navigasi sidebar menjadi 5 grup yang telah disepakati: **Ikhtisar**, **Manajemen Pengguna**, **Website & Konten**, **AI Brain Otonom**, dan **Sistem & Keamanan**.
   - Menambahkan tab handler untuk `ai-brain` dan integrasi dengan `AiControlDirectiveStudio`.
5. **Verifikasi & Pengujian Mutu**:
   - Menjalankan `compile_applet` dan `lint_applet` untuk menjamin tidak ada kesalahan sintaks atau tipe TypeScript.
   - Memverifikasi fungsionalitas CRUD user, status pembekuan, alur scan & auto-fix AI Brain, serta kenyamanan navigasi sidebar responsif.
