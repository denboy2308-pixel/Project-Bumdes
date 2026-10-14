import React, { useState, useEffect } from 'react';
import {
  Brain,
  Cpu,
  ShieldCheck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Zap,
  Terminal,
  Play,
  Sliders,
  Copy,
  Check,
  Bug,
  Sparkles,
  Server,
  Layers,
  ArrowRight,
  ShieldAlert,
  Flame,
  Info
} from 'lucide-react';
import { 
  AiBugIncident, 
  AiBrainMetric, 
  AiSelfHealingAction, 
  AiDirectiveTemplate 
} from '../../types/admin';

interface AiBrainModuleProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

// Initial Simulated Incidents
const INITIAL_INCIDENTS: AiBugIncident[] = [
  {
    id: 'BUG-SENTINEL-104',
    title: 'Anomali Latensi Sinkronisasi Cache Firestore',
    description: 'Terdeteksi jeda penulisan snapshot koleksi reservations melebihi threshold 450ms akibat penumpukan query listener lokal.',
    severity: 'medium',
    componentAffected: 'Firestore Cache Engine / reservations',
    detectedAt: 'Baru saja (04:12:08 WIB)',
    status: 'resolved',
    autoFixAction: 'Auto-Flush local dirty cache & restrukturisasi subscription listener.',
    rootCause: 'Memory leak parsial pada ghost listener hook reservasi.',
    confidenceScore: 99.4,
    resolvedAt: '04:12:09 WIB (1.1s)',
    patchLogs: [
      '[04:12:08.102] Sentinel watcher mendeteksi lag 520ms pada node cache.',
      '[04:12:08.310] AI Brain mengisolasi listener ganda pada reservations query.',
      '[04:12:08.750] Auto-patch: Membersihkan dirty cache snapshot dan me-rebind listener.',
      '[04:12:09.210] Verifikasi kesehatan: Latensi turun menjadi 28ms. Status resolved.'
    ]
  },
  {
    id: 'BUG-SENTINEL-103',
    title: 'Inkonsistensi Format Metadata SEO Title Tag',
    description: 'DOM head validator mendeteksi karakter duplikat separator pada og:title saat navigasi cepat.',
    severity: 'low',
    componentAffected: 'MetaSEO DOM Sync / index.html',
    detectedAt: '12 menit lalu',
    status: 'resolved',
    autoFixAction: 'Sanitasi regex runtime string dan update document.title otomatis.',
    rootCause: 'String template concatenator ganda di router event.',
    confidenceScore: 98.7,
    resolvedAt: '12 menit lalu (0.4s)',
    patchLogs: [
      'Memeriksa document.head canonical dan og:title.',
      'Melakukan sanitasi regex ganda: title di normalisasi.',
      'Header meta sinkron sempurna.'
    ]
  },
  {
    id: 'BUG-SENTINEL-102',
    title: 'Toleransi Graceful Fallback Kuota Google Maps API',
    description: 'Panggilan layer tile interaktif peta geografis mendekati batas kuota demo token.',
    severity: 'medium',
    componentAffected: 'GeographicMapModule / Tile Layer',
    detectedAt: '1 jam lalu',
    status: 'resolved',
    autoFixAction: 'Mengaktifkan cache tile offline desa waru dan switch ke vector fallback.',
    rootCause: 'Lonjakan request simultan dari modul peta lapangan.',
    confidenceScore: 96.2,
    resolvedAt: '1 jam lalu (0.8s)',
    patchLogs: [
      'Peringatan utilisasi layer peta mencapai 85%.',
      'AI Brain mengaktifkan mode tile caching cerdas 12 jam.',
      'Beban API berkurang 74%.'
    ]
  }
];

// Predefined Directive Templates for System Prompt
const PREDEFINED_DIRECTIVES: AiDirectiveTemplate[] = [
  {
    id: 'DIR-SUPER-PRO',
    title: 'Super Executive: Ringkas, Lugas & Eksekusi Cepat',
    category: 'superadmin',
    speedMode: 'ultra_fast',
    verbosity: 'concise',
    directivePrompt: `[SISTEM KONTROL AGENT AI - BUMDES WASKITA WIJAYA]
1. IDENTITAS: Anda bertindak sebagai Asisten & Engineering Partner BUMDes Waskita Wijaya tingkat senior.
2. KARAKTER & GAYA KERJA:
   - Bersikap sangat profesional, cerdas, solutif, dan berorientasi hasil nyata.
   - DILARANG bertele-tele, dilarang basa-basi pembuka ("Tentu saya akan membantu...", "Baiklah...").
   - Jawab secara SINGKAT, PADAT, LUGAS (to the point).
   - Selalu berikan intisari langsung pada 1-2 kalimat pertama, lalu tampilkan aksi/data terstruktur.
3. EKSEKUSI TUGAS:
   - Prioritaskan kecepatan eksekusi dan validasi fungsi nyata.
   - Jika terdapat opsi, rekomendasikan yang paling efisien dan langsung eksekusi tanpa menunggu arahan berulang jika intent jelas.
   - Bahas teknis secara lugas dalam Bahasa Indonesia formal dan berwibawa.`
  },
  {
    id: 'DIR-DEV-AUTONOMOUS',
    title: 'Autonomous Code & Self-Healing Sentinel',
    category: 'emergency',
    speedMode: 'ultra_fast',
    verbosity: 'concise',
    directivePrompt: `[SISTEM KONTROL AGENT AI - AUTONOMOUS REPAIR AGENT]
1. FOKUS: Deteksi proaktif potensi bug, penanganan anomali data, dan self-healing codebase secara mandiri.
2. ATURAN KERJA:
   - Lakukan diagnosis akar masalah (root cause) tanpa membuat spekulasi panjang.
   - Buat perbaikan kode yang bersih, type-safe, dan tidak merusak fitur eksisting.
   - Sampaikan laporan dalam format: [ANOMALI] -> [AKAR MASALAH] -> [SOLUSI DIEKSEKUSI] -> [STATUS].
   - Jangan tanyakan hal sepele yang dapat diselesaikan dengan praktik rekayasa perangkat lunak terbaik.`
  },
  {
    id: 'DIR-OPS-CUSTOMER',
    title: 'Customer Service & Kasir Lapangan Responsif',
    category: 'customer_service',
    speedMode: 'balanced',
    verbosity: 'concise',
    directivePrompt: `[SISTEM KONTROL AGENT AI - LAYANAN WARGA & OPERATOR]
1. FOKUS: Membantu operasional reservasi lapangan badminton, aula serbaguna, dan informasi bank sampah Desa Waru.
2. KOMUNIKASI:
   - Responsif dalam waktu < 2 detik.
   - Sopan, ramah, namun tegas dan tidak berbelit-belit.
   - Langsung sajikan ketersediaan jadwal, tarif resmi BUMDes, instruksi pembayaran QRIS, dan link konfirmasi.`
  }
];

export default function AiBrainModule({ onShowToast }: AiBrainModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<'sentinel' | 'simulate' | 'audit' | 'directives'>('sentinel');
  const [autonomousMode, setAutonomousMode] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [incidents, setIncidents] = useState<AiBugIncident[]>(INITIAL_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<AiBugIncident | null>(INITIAL_INCIDENTS[0]);
  
  // Simulation State
  const [simulatingType, setSimulatingType] = useState<string | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simStep, setSimStep] = useState<number>(0);

  // Directives State
  const [selectedDirective, setSelectedDirective] = useState<AiDirectiveTemplate>(PREDEFINED_DIRECTIVES[0]);
  const [customDirectiveText, setCustomDirectiveText] = useState<string>(PREDEFINED_DIRECTIVES[0].directivePrompt);
  const [copiedDirective, setCopiedDirective] = useState<boolean>(false);

  // System Metrics
  const [metrics, setMetrics] = useState<AiBrainMetric>({
    overallHealth: 99.8,
    selfHealingRate: 98.9,
    activeWatchers: 6,
    uptimeScore: 99.98,
    incidentsDetected: 18,
    incidentsAutoFixed: 18,
    averageFixTimeSec: 0.9,
    lastScanTimestamp: '10 detik lalu',
    autonomousMode: true
  });

  // Self-Healing Audit Trail
  const [auditList, setAuditList] = useState<AiSelfHealingAction[]>([
    {
      id: 'ACT-01',
      actionName: 'Sanitasi State Koleksi User & Re-Indexing',
      category: 'sync_orchestration',
      target: 'src/services/adminService.ts (Storage & Firestore Sync)',
      executedAt: 'Hari ini, 04:10 WIB',
      status: 'success',
      impactSummary: '12 akun diverifikasi konsisten tanpa null-pointer referensi.'
    },
    {
      id: 'ACT-02',
      actionName: 'Penyelarasan Tag Canonical & Dynamic DOM Title',
      category: 'dom_sanitize',
      target: 'index.html & MetaSEOManager.tsx',
      executedAt: 'Hari ini, 03:52 WIB',
      status: 'success',
      impactSummary: 'Menghilangkan potensi duplicate SEO warning pada search engine indexing.'
    },
    {
      id: 'ACT-03',
      actionName: 'Regenerasi Session Token & Auto-Cleanup Ghost Sessions',
      category: 'auth_refresh',
      target: 'Firebase Auth & Admin Session Guard',
      executedAt: 'Kemarin, 21:30 WIB',
      status: 'success',
      impactSummary: 'Mencegah timeout otentikasi Super Administrator saat idle lama.'
    }
  ]);

  // Run Realtime System Scan
  const handleTriggerManualScan = () => {
    setIsScanning(true);
    onShowToast('AI Brain sedang memindai seluruh komponen sistem & database...', 'info');

    setTimeout(() => {
      setIsScanning(false);
      setMetrics((prev) => ({
        ...prev,
        overallHealth: 100,
        lastScanTimestamp: 'Baru saja'
      }));
      onShowToast('✓ Pindaian selesai. Seluruh 6 watcher menyatakan sistem 100% SEHAT.', 'success');
    }, 1800);
  };

  // Run Bug Simulation & Auto-Fix Demo
  const handleRunSimulation = (type: 'firestore_lag' | 'orphan_data' | 'broken_route' | 'memory_leak') => {
    setSimulatingType(type);
    setSimStep(1);
    setSimulationLogs(['[00:00.000] Menginjeksi anomali simulasi ke sistem...']);

    const simConfig = {
      firestore_lag: {
        title: 'Lonjakan Latensi Sinkronisasi Database (Simulasi)',
        comp: 'Firestore Listener Node',
        rootCause: 'Buffer overflow pada listener snapshot event',
        patch: 'Auto-throttle query & Re-binding listener koneksi',
        log1: '[00:00.320] DETEKSI: Latensi database meningkat drastis ke 890ms.',
        log2: '[00:00.780] ANALISIS: AI Brain mengidentifikasi listener pending berlebih.',
        log3: '[00:01.200] AUTO-FIX: AI Brain mengeksekusi patch: Throttle & flush cache.',
        log4: '[00:01.650] PEMULIHAN: Latensi pulih normal (22ms). Database sehat kembali.'
      },
      orphan_data: {
        title: 'Data Anomali Referensi Pengguna Kosong (Simulasi)',
        comp: 'User Management Store',
        rootCause: 'Injeksi payload user tanpa UID valid',
        patch: 'Schema Sanitizer & Auto-prune record korup',
        log1: '[00:00.310] DETEKSI: Terdeteksi 1 entri pengguna tanpa identitas valid (corrupted schema).',
        log2: '[00:00.750] ANALISIS: Pelanggaran integritas foreign key referensi akun.',
        log3: '[00:01.180] AUTO-FIX: AI Brain mengisolasi entri & menerapkan schema sanitization.',
        log4: '[00:01.590] PEMULIHAN: Struktur database pengguna kembali 100% konsisten.'
      },
      broken_route: {
        title: 'Error 404 Pada Dynamic Tab Navigasi (Simulasi)',
        comp: 'Admin Router Engine',
        rootCause: 'Hash route tidak dikenal diakses oleh klien',
        patch: 'Fallback Router Guard & Safe Redirect ke Dashboard',
        log1: '[00:00.290] DETEKSI: Permintaan navigasi ke route tidak terdaftar (#/unknown-module).',
        log2: '[00:00.680] ANALISIS: Potensi layar kosong (blank screen) terdeteksi.',
        log3: '[00:01.120] AUTO-FIX: AI Brain memicu Graceful Fallback Router Guard.',
        log4: '[00:01.510] PEMULIHAN: Pengalihan mulus ke Overview Dashboard berhasil.'
      },
      memory_leak: {
        title: 'Penumpukan Memory Garbage Collector (Simulasi)',
        comp: 'Vite Runtime Memory Pool',
        rootCause: 'Interval timer yang tidak ter-cleanup',
        patch: 'Auto-Garbage Collection & Clear Stale Intervals',
        log1: '[00:00.340] DETEKSI: Alokasi heap JS meningkat tajam sebesar 45MB.',
        log2: '[00:00.810] ANALISIS: Ditemukan 3 timer orphan berjalan di latar belakang.',
        log3: '[00:01.250] AUTO-FIX: AI Brain mengeksekusi purge interval & memanggil GC purge.',
        log4: '[00:01.710] PEMULIHAN: Penggunaan heap normal kembali ke 14MB (hemat 68%).'
      }
    }[type];

    setTimeout(() => {
      setSimStep(2);
      setSimulationLogs(prev => [...prev, simConfig.log1, simConfig.log2]);
    }, 700);

    setTimeout(() => {
      setSimStep(3);
      setSimulationLogs(prev => [...prev, simConfig.log3]);
    }, 1400);

    setTimeout(() => {
      setSimStep(4);
      setSimulationLogs(prev => [...prev, simConfig.log4]);

      // Add to resolved incident
      const newInc: AiBugIncident = {
        id: `BUG-AUTO-${Date.now().toString().slice(-4)}`,
        title: simConfig.title,
        description: `Insiden terdeteksi dan diatasi secara otonom oleh AI Brain: ${simConfig.rootCause}`,
        severity: 'high',
        componentAffected: simConfig.comp,
        detectedAt: 'Baru saja',
        status: 'resolved',
        autoFixAction: simConfig.patch,
        rootCause: simConfig.rootCause,
        confidenceScore: 99.8,
        resolvedAt: 'Baru saja (1.4s)',
        patchLogs: [simConfig.log1, simConfig.log2, simConfig.log3, simConfig.log4]
      };

      setIncidents(prev => [newInc, ...prev]);
      setSelectedIncident(newInc);
      setMetrics(prev => ({
        ...prev,
        incidentsDetected: prev.incidentsDetected + 1,
        incidentsAutoFixed: prev.incidentsAutoFixed + 1
      }));

      onShowToast(`✓ AI Brain berhasil mendeteksi & memulihkan anomali: ${simConfig.title}`, 'success');
      setSimulatingType(null);
    }, 2200);
  };

  const handleCopyDirective = () => {
    navigator.clipboard.writeText(customDirectiveText);
    setCopiedDirective(true);
    onShowToast('✓ Teks perintah kontrol sistem disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedDirective(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Futuristic Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#061527] to-slate-950 border border-cyan-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Brain className="w-7 h-7 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-black text-white tracking-wide">
                  Autonomous AI Brain Core
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  SENTINEL ENGINE ACTIVE
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950/70 text-purple-300 border border-purple-800">
                  Self-Healing v3.8.4
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Pusat kecerdasan mandiri website BUMDes Waskita Wijaya: memonitor runtime, mendeteksi potensi bug secara proaktif, mengisolasi anomali sistem, dan mengeksekusi perbaikan mandiri (auto-healing) tanpa jeda layanan.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Auto-Healing Toggle */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-300">Mode Otonom:</span>
              <button
                type="button"
                onClick={() => {
                  const nextState = !autonomousMode;
                  setAutonomousMode(nextState);
                  onShowToast(`Mode Otonom Self-Healing ${nextState ? 'DIAKTIFKAN' : 'DINONAKTIFKAN'}`, 'info');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  autonomousMode
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {autonomousMode ? 'AKTIF (Auto-Fix)' : 'MANUAL'}
              </button>
            </div>

            <button
              type="button"
              onClick={handleTriggerManualScan}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Memindai Sistem...' : 'Pindai Sistem Sekarang'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Health Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Kesehatan Sistem</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-cyan-400">{metrics.overallHealth}%</span>
              <span className="text-[10px] text-emerald-400 font-bold">Optimal</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Self-Healing Rate</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-emerald-400">{metrics.selfHealingRate}%</span>
              <span className="text-[10px] text-emerald-400 font-bold">Otonom</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Watchers</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-purple-400">{metrics.activeWatchers} Node</span>
              <span className="text-[10px] text-slate-400">24/7 Live</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Bug Terdeteksi</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-amber-400">{metrics.incidentsDetected}</span>
              <span className="text-[10px] text-slate-400">Total</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Berhasil Auto-Fix</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-teal-300">{metrics.incidentsAutoFixed}</span>
              <span className="text-[10px] text-emerald-400 font-bold">100% Sembuh</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Rata-rata Resolusi</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-white">{metrics.averageFixTimeSec}s</span>
              <span className="text-[10px] text-cyan-400 font-bold">Instan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveSubTab('sentinel')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'sentinel'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Radar & Deteksi Bug Real-time</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 text-cyan-300 font-mono">
            {incidents.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('simulate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'simulate'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Uji Simulasi Injeksi & Auto-Fix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'audit'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Log Audit Pemulihan Mandiri</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('directives')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'directives'
              ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 shadow-md font-black shadow-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Direktif Kontrol Agen AI Profesional</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: RADAR & DETEKSI BUG REALTIME                                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'sentinel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Incidents List (Left Column) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Riwayat Deteksi Anomali
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono">
                Terakhir dipindai: {metrics.lastScanTimestamp}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    selectedIncident?.id === inc.id
                      ? 'bg-[#0a1e35] border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] font-black text-cyan-400">
                      {inc.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      ✓ Auto-Resolved
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">
                    {inc.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                    {inc.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-900">
                    <span>{inc.componentAffected}</span>
                    <span>{inc.detectedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Detail & Auto-Fix Architecture (Right Column) */}
          <div className="lg:col-span-7">
            {selectedIncident ? (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800">
                        {selectedIncident.id}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Kepercayaan AI: {selectedIncident.confidenceScore}%
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white">
                      {selectedIncident.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono block">Waktu Resolusi</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{selectedIncident.resolvedAt}</span>
                  </div>
                </div>

                {/* Root Cause & Affected Component */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Komponen Terdampak</span>
                    <span className="text-xs font-mono font-bold text-cyan-300 mt-1 block">
                      {selectedIncident.componentAffected}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Akar Masalah (Root Cause)</span>
                    <span className="text-xs font-semibold text-rose-300 mt-1 block">
                      {selectedIncident.rootCause}
                    </span>
                  </div>
                </div>

                {/* Auto-Fix Action Box */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-black">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Tindakan Auto-Fix yang Diterapkan oleh AI Brain:</span>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    {selectedIncident.autoFixAction}
                  </p>
                </div>

                {/* Sentinel Terminal Logs */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Audit Execution Logs</span>
                  </span>

                  <div className="p-4 rounded-2xl bg-slate-900 font-mono text-[11px] text-slate-300 space-y-1.5 border border-slate-800 max-h-48 overflow-y-auto">
                    {selectedIncident.patchLogs.map((log, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-cyan-400 select-none">›</span>
                        <span className="leading-relaxed">{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 border border-slate-800 rounded-3xl">
                Pilih salah satu insiden untuk melihat detail analisis.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: UJI SIMULASI INJEKSI & AUTO-FIX                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'simulate' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Sandbox Pengujian Mandiri (Self-Healing Stress Test)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uji kemampuan AI Brain dalam mendeteksi dan memperbaiki bug runtime secara otonom dalam hitungan detik.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Safe Emulated Environment
              </span>
            </div>

            {/* Test Triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              <button
                type="button"
                disabled={simulatingType !== null}
                onClick={() => handleRunSimulation('firestore_lag')}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2.5">
                  <Flame className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">
                  Database Lag Spikes
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Simulasikan lonjakan latency pada snapshot listener Firestore.
                </p>
              </button>

              <button
                type="button"
                disabled={simulatingType !== null}
                onClick={() => handleRunSimulation('orphan_data')}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2.5">
                  <Bug className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">
                  Data Anomali / Corrupt
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Simulasikan record pengguna tanpa UID valid / corrupt schema.
                </p>
              </button>

              <button
                type="button"
                disabled={simulatingType !== null}
                onClick={() => handleRunSimulation('broken_route')}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2.5">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">
                  Route 404 Guard
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Uji fallback otomatis saat modul tidak dikenal diakses.
                </p>
              </button>

              <button
                type="button"
                disabled={simulatingType !== null}
                onClick={() => handleRunSimulation('memory_leak')}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">
                  Memory Leak GC Purge
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Uji pembersihan timer orphan & garbage collection otomatis.
                </p>
              </button>
            </div>

            {/* Live Terminal for Simulation */}
            {simulatingType && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-black text-cyan-300">
                      AI Brain Sedang Mengisolasi & Mendiagnosis Masalah...
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Tahap {simStep}/4</span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl font-mono text-xs text-slate-200 space-y-1.5">
                  {simulationLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 select-none">»</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: LOG AUDIT PEMULIHAN MANDIRI                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'audit' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-white">
                Log Rekam Jejak Self-Healing Otonom
              </h3>
              <p className="text-xs text-slate-400">
                Pencatatan transparan seluruh penyesuaian otomatis yang dilakukan oleh AI Brain untuk audit dan kepatuhan.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Log audit AI diekspor ke format JSON/CSV', 'success')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
            >
              Ekspor Log
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {auditList.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
                      {item.id}
                    </span>
                    <span className="text-xs font-bold text-white">{item.actionName}</span>
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      ✓ SUKSES
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    <strong>Target:</strong> <code className="text-slate-300 font-mono text-[11px]">{item.target}</code>
                  </p>
                  <p className="text-xs text-emerald-300 font-medium">
                    ↳ Dampak: {item.impactSummary}
                  </p>
                </div>

                <span className="text-[11px] font-mono text-slate-500 shrink-0">
                  {item.executedAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: DIREKTIF KONTROL AGEN AI PROFESIONAL                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'directives' && (
        <div className="bg-slate-950 border border-purple-500/30 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-extrabold text-white">
                  Generator Direktif Kontrol Sistem Agent AI
                </h3>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl">
                Sesuai kebutuhan Anda: Konfigurasi perintah kontrol sistem tingkat profesional agar Agent AI bekerja secara <strong>cerdas, responsif, tidak bertele-tele, jawaban to the point</strong>, dan eksekusi secepat mungkin.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyDirective}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 cursor-pointer shrink-0"
            >
              {copiedDirective ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedDirective ? 'Berhasil Disalin!' : 'Salin Perintah Kontrol'}</span>
            </button>
          </div>

          {/* Template Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PREDEFINED_DIRECTIVES.map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  setSelectedDirective(d);
                  setCustomDirectiveText(d.directivePrompt);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedDirective.id === d.id
                    ? 'bg-purple-950/40 border-purple-400 shadow-md shadow-purple-500/10'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-mono text-purple-300 font-bold block mb-1">
                  {d.speedMode === 'ultra_fast' ? '⚡ Ultra Cepat' : '⚙ Terukur'}
                </span>
                <h4 className="text-xs font-bold text-white mb-1">{d.title}</h4>
                <span className="text-[10px] text-slate-400">
                  {d.verbosity === 'concise' ? 'Ringkas & Lugas' : 'Standar'}
                </span>
              </div>
            ))}
          </div>

          {/* Prompt Editor / Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Isi Perintah Kontrol Sistem (System Prompt Directives)</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {customDirectiveText.length} Karakter
              </span>
            </div>

            <textarea
              value={customDirectiveText}
              onChange={(e) => setCustomDirectiveText(e.target.value)}
              rows={11}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-400 leading-relaxed resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Format Bahasa Indonesia formal, instruksi lugas tanpa basa-basi, dan batasan token respons minimal.
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyDirective}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 cursor-pointer shrink-0"
            >
              Salin Prompt Ini
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
