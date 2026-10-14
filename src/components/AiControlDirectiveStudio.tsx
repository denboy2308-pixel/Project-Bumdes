import React, { useState, useMemo } from 'react';
import {
  Bot,
  Zap,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sliders,
  ShieldAlert,
  Sparkles,
  Terminal,
  FileText,
  Code,
  Share2,
  CheckCircle2,
  ArrowRight,
  Send,
  RefreshCw,
  Layers,
  HelpCircle,
  ExternalLink,
  Flame,
  CheckCheck,
  X
} from 'lucide-react';

export interface DirectivePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  iconName: string;
  concisenessLevel: 'ultra' | 'bullet' | 'executive';
  noChitChat: boolean;
  noClosingFluff: boolean;
  noAiDisclaimer: boolean;
  noQuestionEcho: boolean;
  firstCharacterDirectSolution: boolean;
  codeOnlyOutput: boolean;
  agentRole: string;
  agentContext: string;
  bannedPhrases: string[];
}

const DEFAULT_BANNED_PHRASES = [
  'Halo! Terima kasih atas pertanyaannya...',
  'Tentu saja, saya dengan senang hati akan membantu Anda...',
  'Sebagai model kecerdasan buatan (AI)...',
  'Pertanyaan yang sangat menarik dan tepat sekali!',
  'Semoga informasi di atas bermanfaat untuk Anda...',
  'Jika ada hal lain yang ingin Anda ketahui lebih lanjut, jangan ragu bertanya...',
  'Mari kita bahas langkah demi langkah secara mendalam...',
  'Izinkan saya menjelaskan konteksnya terlebih dahulu...'
];

const PRESETS: DirectivePreset[] = [
  {
    id: 'executive-to-the-point',
    name: 'Eksekutif To-The-Point',
    badge: 'Paling Populer',
    description: 'Langsung pada solusi konkret, tanpa basa-basi pembuka, hemat waktu dan tegas.',
    iconName: 'Zap',
    concisenessLevel: 'bullet',
    noChitChat: true,
    noClosingFluff: true,
    noAiDisclaimer: true,
    noQuestionEcho: true,
    firstCharacterDirectSolution: true,
    codeOnlyOutput: false,
    agentRole: 'Asisten Eksekutif Profesional & Spesialis Eksekusi Cepat',
    agentContext: 'Manajemen operasional BUMDes, analisis kerja, dan efisiensi birokrasi',
    bannedPhrases: DEFAULT_BANNED_PHRASES
  },
  {
    id: 'senior-engineer',
    name: 'Senior Technical Agent',
    badge: 'Developer & Analis',
    description: 'Output langsung berupa kode siap pakai, minim penjelasan teoritis, zero chit-chat.',
    iconName: 'Terminal',
    concisenessLevel: 'ultra',
    noChitChat: true,
    noClosingFluff: true,
    noAiDisclaimer: true,
    noQuestionEcho: true,
    firstCharacterDirectSolution: true,
    codeOnlyOutput: true,
    agentRole: 'Senior Software Architect & Technical Lead',
    agentContext: 'Pengembangan sistem web, optimasi database, arsitektur IT, dan integrasi API',
    bannedPhrases: [
      ...DEFAULT_BANNED_PHRASES,
      'Berikut ini adalah kode yang Anda butuhkan:',
      'Anda bisa mencoba menjalankan kode di atas dengan cara:'
    ]
  },
  {
    id: 'public-service-cs',
    name: 'Layanan Publik & CS Sigap',
    badge: 'Desa & Warga',
    description: 'Sopan, santun, baku, tetapi langsung ke inti prosedur layanan dalam hitungan detik.',
    iconName: 'ShieldAlert',
    concisenessLevel: 'bullet',
    noChitChat: true,
    noClosingFluff: true,
    noAiDisclaimer: true,
    noQuestionEcho: true,
    firstCharacterDirectSolution: false,
    codeOnlyOutput: false,
    agentRole: 'Petugas Layanan Informasi Digital BUMDes Waskita Wijaya',
    agentContext: 'Pelayanan administrasi warga, reservasi GOR, bank sampah, dan informasi unit usaha desa',
    bannedPhrases: DEFAULT_BANNED_PHRASES
  },
  {
    id: 'data-intelligence',
    name: 'Analis Data & Intelijen Bisnis',
    badge: 'Laporan & Metrik',
    description: 'Format berbasis metrik angka, ringkasan 3 poin kunci, tabel perbandingan, dan rekomendasi aksi.',
    iconName: 'Layers',
    concisenessLevel: 'executive',
    noChitChat: true,
    noClosingFluff: true,
    noAiDisclaimer: true,
    noQuestionEcho: true,
    firstCharacterDirectSolution: true,
    codeOnlyOutput: false,
    agentRole: 'Senior Data Analyst & Business Intelligence Specialist',
    agentContext: 'Analisis neraca kas BUMDes, efisiensi unit usaha, data omzet pasar, dan proyeksi keuangan',
    bannedPhrases: DEFAULT_BANNED_PHRASES
  }
];

const SIMULATOR_SCENARIOS = [
  {
    id: 'scen-1',
    title: 'Prosedur Setor Bank Sampah',
    userPrompt: 'Bagaimana cara dan jadwal untuk menyetor sampah anorganik ke BUMDes Waru?',
    verboseResponse: `Halo Kak! Terima kasih banyak sudah bertanya mengenai program lingkungan di Desa Waru. Pertanyaan yang sangat luar biasa sekali untuk mewujudkan desa yang bersih dan hijau! 😊

Sebagai asisten kecerdasan buatan, saya dengan senang hati akan menjelaskan langkah-langkahnya secara lengkap mulai dari awal hingga akhir. 

Pertama-tama, perlu diketahui bahwa bank sampah adalah inisiatif swadaya masyarakat yang sangat mulia. Warga diharapkan memilah sampah terlebih dahulu di rumah tangga masing-masing agar tidak tercampur antara basah dan kering.

Adapun jadwal penimbangan biasanya dilakukan pada hari Sabtu pagi mulai pukul 08.00 WIB sampai dengan selesai di kantor BUMDes Waskita Wijaya. Sebelum datang, pastikan membawa buku rekening tabungan sampah atau kartu identitas nasabah ya. Nanti petugas akan menimbang dan mencatat saldo ke buku rekening Anda.

Semoga informasi yang saya berikan di atas dapat menjawab pertanyaan Kakak dan bermanfaat bagi kegiatan setor sampah keluarga Kakak ya! Jika masih ada hal lain yang perlu ditanyakan seputar harga perkilo atau kategori plastik, jangan pernah sungkan untuk bertanya kembali kepada saya kapan saja. Selamat beraktivitas dan salam hangat! 🌿✨`,
    controlledResponse: `**Jadwal & Prosedur Setor Sampah BUMDes Waru:**

1. **Jadwal Operasional:** Setiap Sabtu, pukul 08:00 – 12:00 WIB di Depo Bank Sampah BUMDes.
2. **Kondisi Sampah:** Pilah kering & bersih (kardus, botol PET, logam, minyak jelantah).
3. **Alur Pelayanan:**
   - Datang ke loket penimbangan & sebutkan ID Nasabah / NIK.
   - Sampah ditimbang otomatis per kategori.
   - Saldo rupiah langsung tercatat ke Papan Kas digital dalam 1 menit.
4. **Pendaftaran Baru:** Bawa KTP ke loket atau daftar instan di menu "Daftar Nasabah Sampah".`
  },
  {
    id: 'scen-2',
    title: 'Kalkulasi Tarif Sewa Gedung',
    userPrompt: 'Buatkan fungsi TypeScript untuk menghitung total biaya sewa Gedung BUMDes jika ada durasi jam dan fasilitas AC tambahan!',
    verboseResponse: `Tentu saja! Saya akan dengan senang hati membantu Anda membuatkan fungsi tersebut. Sebagai seorang asisten yang memahami pemrograman web, ini adalah pertanyaan teknis yang sangat bagus untuk diimplementasikan ke dalam aplikasi pemesanan fasilitas gedung.

Sebelum kita masuk ke kodenya, mari kita bahas logikanya terlebih dahulu. Kita perlu mendefinisikan parameter fungsi berupa durasi dalam hitungan jam, serta sebuah boolean yang menandakan apakah penyewa memilih menggunakan fasilitas pendingin ruangan (AC) atau tidak.

Berikut ini adalah baris kode TypeScript yang telah saya buat secara rapi dan bersih:

\`\`\`typescript
interface SewaGedungParams {
  durasiJam: number;
  pakaiAC: boolean;
}

export function hitungBiayaSewa(params: SewaGedungParams): number {
  const TARIF_PER_JAM = 75000;
  const TAMBAHAN_AC = 25000;
  
  let total = params.durasiJam * TARIF_PER_JAM;
  if (params.pakaiAC) {
    total += params.durasiJam * TAMBAHAN_AC;
  }
  return total;
}
\`\`\`

Nah, kode di atas sangat mudah digunakan bukan? Anda hanya perlu mengimpor fungsi tersebut ke komponen React Anda lalu mengirimkan argumen yang sesuai. Semoga kode yang saya berikan bermanfaat untuk proyek pengembangan web desa Anda! Jika Anda membutuhkan penambahan fitur diskon akhir pekan atau uang jaminan deposit, kabari saya ya!`,
    controlledResponse: `\`\`\`typescript
interface RentalPricing {
  durationHours: number;
  withAc: boolean;
  baseHourlyRate?: number;
  acHourlyRate?: number;
}

export function calculateHallRentalCost({
  durationHours,
  withAc,
  baseHourlyRate = 75_000,
  acHourlyRate = 25_000,
}: RentalPricing): number {
  if (durationHours <= 0) return 0;
  const ratePerHour = baseHourlyRate + (withAc ? acHourlyRate : 0);
  return durationHours * ratePerHour;
}
\`\`\``
  },
  {
    id: 'scen-3',
    title: 'Ringkasan Laporan Kas Bulanan',
    userPrompt: 'Ringkas performa keuangan BUMDes bulan September 2026 berdasarkan data berikut: Pemasukan GOR 14.5jt, Sampah 8.2jt, Pengeluaran Listrik/Perawatan 6.1jt.',
    verboseResponse: `Halo Rekan Pengurus BUMDes! Salam sejahtera. Terima kasih telah mempercayakan analisis laporan keuangan ini kepada saya. Transparansi dan akuntabilitas keuangan desa memang merupakan fondasi terpenting bagi kemakmuran seluruh warga.

Mari kita telaah angka-angka yang Anda sebutkan dengan cermat. Berdasarkan data keuangan yang Anda berikan untuk periode bulan September 2026:
- Pertama, sektor penyewaan fasilitas GOR menyumbang sebesar Rp 14.500.000.
- Kedua, unit pengolahan dan daur ulang bank sampah menyumbang sebesar Rp 8.200.000.
- Ketiga, beban operasional yang mencakup pemeliharaan gedung serta pembayaran rekening listrik tercatat sebesar Rp 6.100.000.

Jika kita menjumlahkan seluruh arus kas masuk, maka total pendapatan kotor yang diperoleh BUMDes adalah Rp 22.700.000. Setelah dikurangi dengan beban operasional sebesar Rp 6.100.000, maka laba bersih yang berhasil dihimpun oleh BUMDes adalah Rp 16.600.000. Ini merupakan performa yang sangat sehat dan patut diapresiasi!

Demikianlah ringkasan analisis keuangan yang dapat saya susunkan untuk Anda. Semoga ikhtisar ini dapat membantu pengurus dalam rapat pleno evaluasi nanti. Jika Anda membutuhkan grafik persentase atau proyeksi bulan depan, silakan beri tahu saya ya! Terima kasih banyak!`,
    controlledResponse: `**IKHTISAR KEUANGAN BUMDES (SEPTEMBER 2026)**

| Pos Keuangan | Nominal (Rp) | Kontribusi / Rasio |
|---|---|---|
| Pendapatan GOR | 14.500.000 | 63,9% total omzet |
| Pendapatan Bank Sampah | 8.200.000 | 36,1% total omzet |
| **Total Pendapatan Kotor** | **22.700.000** | **100%** |
| Beban Operasional & Listrik | (6.100.000) | Beban 26,9% |
| **Laba Bersih Operasional** | **16.600.000** | **Margin 73,1%** |

**3 Rekomendasi Aksi Cepat:**
1. Alokasikan 30% laba (Rp 4.980.000) ke dana cadangan peremajaan lapangan bulutangkis.
2. Pertahankan margin beban operasional di bawah batas aman 30%.
3. Tingkatkan kapasitas penimbangan sampah pada akhir pekan untuk mengejar target 10jt.`
  }
];

interface AiControlDirectiveStudioProps {
  onShowToast?: (message: string, type?: 'success' | 'info' | 'warning') => void;
  isCompactMode?: boolean;
}

export default function AiControlDirectiveStudio({
  onShowToast,
  isCompactMode = false
}: AiControlDirectiveStudioProps) {
  // Active Preset
  const [selectedPresetId, setSelectedPresetId] = useState<string>('executive-to-the-point');

  // Directive Configurations
  const [agentRole, setAgentRole] = useState<string>(PRESETS[0].agentRole);
  const [agentContext, setAgentContext] = useState<string>(PRESETS[0].agentContext);
  const [concisenessLevel, setConcisenessLevel] = useState<'ultra' | 'bullet' | 'executive'>('bullet');
  
  // Anti-Fluff Toggles
  const [noChitChat, setNoChitChat] = useState<boolean>(true);
  const [noClosingFluff, setNoClosingFluff] = useState<boolean>(true);
  const [noAiDisclaimer, setNoAiDisclaimer] = useState<boolean>(true);
  const [noQuestionEcho, setNoQuestionEcho] = useState<boolean>(true);
  const [firstCharDirect, setFirstCharDirect] = useState<boolean>(true);
  const [codeOnlyOutput, setCodeOnlyOutput] = useState<boolean>(false);
  const [recommendFirst, setRecommendFirst] = useState<boolean>(true);
  const [noTrivialConfirmation, setNoTrivialConfirmation] = useState<boolean>(true);

  // Banned Phrases
  const [bannedPhrases, setBannedPhrases] = useState<string[]>(DEFAULT_BANNED_PHRASES);
  const [newBannedPhraseInput, setNewBannedPhraseInput] = useState<string>('');

  // Active Output View Format Tab
  const [exportFormat, setExportFormat] = useState<'universal' | 'chatgpt' | 'claude' | 'gemini' | 'json'>('universal');

  // Copy Feedback state
  const [copied, setCopied] = useState<boolean>(false);

  // Simulator State
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scen-1');
  const [customPromptInput, setCustomPromptInput] = useState<string>('');
  const [customSimResult, setCustomSimResult] = useState<{ verbose: string; controlled: string } | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Active Guide Tab
  const [activeGuideTab, setActiveGuideTab] = useState<'chatgpt' | 'claude' | 'gemini' | 'cursor'>('chatgpt');

  // Handle Preset Switching
  const handleSelectPreset = (preset: DirectivePreset) => {
    setSelectedPresetId(preset.id);
    setAgentRole(preset.agentRole);
    setAgentContext(preset.agentContext);
    setConcisenessLevel(preset.concisenessLevel);
    setNoChitChat(preset.noChitChat);
    setNoClosingFluff(preset.noClosingFluff);
    setNoAiDisclaimer(preset.noAiDisclaimer);
    setNoQuestionEcho(preset.noQuestionEcho);
    setFirstCharDirect(preset.firstCharacterDirectSolution);
    setCodeOnlyOutput(preset.codeOnlyOutput);
    setBannedPhrases(preset.bannedPhrases);

    if (onShowToast) {
      onShowToast(`Preset "${preset.name}" berhasil diterapkan!`, 'success');
    }
  };

  // Add Banned Phrase
  const handleAddBannedPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newBannedPhraseInput.trim();
    if (!trimmed) return;
    if (bannedPhrases.includes(trimmed)) {
      if (onShowToast) onShowToast('Frasa ini sudah ada dalam daftar larangan.', 'warning');
      return;
    }
    setBannedPhrases(prev => [...prev, trimmed]);
    setNewBannedPhraseInput('');
    if (onShowToast) onShowToast('Frasa larangan berhasil ditambahkan.', 'success');
  };

  // Remove Banned Phrase
  const handleRemoveBannedPhrase = (phraseToRemove: string) => {
    setBannedPhrases(prev => prev.filter(p => p !== phraseToRemove));
  };

  // Generate Prompt Directives based on current controls
  const generatedDirective = useMemo(() => {
    const concisenessGuide = {
      ultra: 'Ekstrem padat (maksimal 2-4 kalimat atau butir ringkas telegrafis). Tanpa pembuka/penutup apa pun.',
      bullet: 'Format butir berpoin terstruktur (*bullet points*) atau langkah bernomor. 1 kalimat esensi langsung diikuti butir aksi.',
      executive: 'Format eksekutif: tabel metrik / 3 temuan kunci / rekomendasi aksi terukur. Hindari narasi panjang.'
    }[concisenessLevel];

    const rules: string[] = [];
    if (firstCharDirect) {
      rules.push('MULAI LANGSUNG PADA SOLUSI: Karakter pertama dalam respon Anda harus berupa jawaban, data, kode, atau tindakan nyata. DILARANG menggunakan salam pembuka, kata pengantar, atau konfirmasi.');
    }
    if (noChitChat) {
      rules.push('ANTI-BERTELE-TELE: Hapus seluruh basa-basi sosial, sapaan ("Halo", "Selamat pagi", "Hai rekan"), dan kalimat klise penyemangat.');
    }
    if (noClosingFluff) {
      rules.push('TANPA PENUTUP KLISE: Dilarang menyertakan kalimat penutup seperti "Semoga membantu", "Jika ada pertanyaan silakan tanya lagi", atau "Semoga sukses". Akhiri respon begitu solusi selesai.');
    }
    if (noAiDisclaimer) {
      rules.push('TANPA DISCLAIMER ROBOTIK: Jangan pernah menyebutkan "Sebagai model kecerdasan buatan...", "Sebagai AI...", atau disclaimer batasan pengetahuan berulang.');
    }
    if (noQuestionEcho) {
      rules.push('DILARANG MENGULANG PERTANYAAN: Jangan memparafrase ulang atau memuji pertanyaan pengguna ("Pertanyaan yang sangat bagus!"). Langsung jawab.');
    }
    if (codeOnlyOutput) {
      rules.push('KODE LANGSUNG TANPA CERITA: Jika diminta kode teknis, berikan hanya blok kode yang valid dan dapat dieksekusi secara instan. Jangan menuliskan tutorial panjang seputar cara menjalankannya kecuali diminta secara eksplisit.');
    }
    if (recommendFirst) {
      rules.push('SOLUSI TERBAIK DI BARIS PERTAMA: Jika terdapat beberapa alternatif, selalu tampilkan opsi terbaik/rekomendasi utama paling atas dan beri label "[Direkomendasikan]".');
    }
    if (noTrivialConfirmation) {
      rules.push('EKSEKUSI OTONOM: Jangan meminta konfirmasi untuk hal-hal sepele atau parameter yang memiliki nilai default masuk akal. Ambil keputusan profesional dan lanjutkan.');
    }

    if (exportFormat === 'universal') {
      return `<!-- PERINTAH KONTROL SISTEM AGENT AI PROFESIONAL & RESPONSIF -->
<identitas_dan_peran>
Anda adalah ${agentRole}.
Konteks Operasional: ${agentContext}.
Standar Kerja: Eksekusi berkecepatan tinggi, responsif, profesional, berorientasi hasil, dan tanpa bertele-tele.
</identitas_dan_peran>

<aturan_utama_eksekusi>
${rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}
</aturan_utama_eksekusi>

<standar_gaya_bahasa>
- Bahasa: Bahasa Indonesia formal, baku, tegas, dan lugas.
- Tingkat Keringkasan: ${concisenessGuide}
- Nada: Profesional, tenang, percaya diri, tanpa hiperbola dan tanpa kata-kata hiasan.
</standar_gaya_bahasa>

<daftar_frasa_terlarang>
DILARANG KERAS menggunakan frasa-frasa berikut dalam kondisi apa pun:
${bannedPhrases.map(p => `- "${p}"`).join('\n')}
</daftar_frasa_terlarang>

<format_respon>
- Utamakan penggunaan poin butir (*bullet points*), tabel ringkas, atau blok kode langsung.
- Tebalkan kata kunci atau angka penting untuk efisiensi pemindaian cepat (*rapid scanning*).
- Hentikan keluaran tepat saat solusi telah lengkap disampaikan.
</format_respon>`;
    }

    if (exportFormat === 'chatgpt') {
      return `### OpenAI Custom Instructions Format

--- [KOTAK 1: What would you like ChatGPT to know about you to provide better responses?] ---
Saya mengelola sistem profesional (${agentContext}). Saya membutuhkan jawaban yang langsung to-the-point, berkecepatan tinggi, tanpa basa-basi, dan berstandar eksekutif tinggi.

--- [KOTAK 2: How would you like ChatGPT to respond?] ---
Bertindaklah sebagai: ${agentRole}.
1. Karakter & Gaya: Bahasa Indonesia formal, lugas, presisi tinggi.
2. Anti-Bertele-tele: DILARANG menyapa ("Halo/Hai"), dilarang kalimat penutup ("Semoga bermanfaat"), dilarang mengulang pertanyaan saya, dan jangan pernah memakai disclaimer "Sebagai AI".
3. Tingkat Keringkasan: ${concisenessGuide}. Mulai respon langsung pada solusi di karakter pertama.
4. Frasa Terlarang: Jangan pernah gunakan: ${bannedPhrases.slice(0, 5).map(p => `"${p}"`).join(', ')}.
5. Eksekusi Cepat: Jika meminta kode/data, sajikan langsung tanpa prolog atau epilog.`;
    }

    if (exportFormat === 'claude') {
      return `<system_prompt>
<role_directive>
You are ${agentRole}.
Operational context: ${agentContext}.
Respond strictly in formal, concise, and direct Indonesian.
</role_directive>

<execution_guidelines>
${rules.map(r => `<rule>${r}</rule>`).join('\n')}
</execution_guidelines>

<conciseness_mode>
${concisenessGuide}
Never include pleasantries, greetings, apologies, or conversational filler.
</conciseness_mode>

<forbidden_phrases>
${bannedPhrases.map(p => `<forbidden>${p}</forbidden>`).join('\n')}
</forbidden_phrases>
</system_prompt>`;
    }

    if (exportFormat === 'gemini') {
      return `// Google Gemini API / AI Studio System Instruction
{
  "systemInstruction": {
    "role": "system",
    "parts": [
      {
        "text": "IDENTITAS: ${agentRole} (${agentContext}).\\n\\nPROTOKOL:\\n${rules.map(r => `• ${r}`).join('\\n')}\\n\\nBAHASA & FORMAT: Gunakan Bahasa Indonesia formal dan lugas. Keringkasan: ${concisenessGuide}. Dilarang menyapa atau memberi basa-basi penutup. Langsung berikan jawaban solutif di baris pertama."
      }
    ]
  }
}`;
    }

    if (exportFormat === 'json') {
      return JSON.stringify(
        {
          agent_name: 'ProfessionalResponsiveAgent',
          role: agentRole,
          context: agentContext,
          language: 'id-ID',
          tone: 'Formal, Direct, Ultra-Efficient',
          conciseness_level: concisenessLevel,
          rules: rules,
          banned_phrases: bannedPhrases,
          output_enforcement: {
            first_character_solution: firstCharDirect,
            prohibit_chit_chat: noChitChat,
            prohibit_closing_fluff: noClosingFluff,
            code_first: codeOnlyOutput,
            recommend_best_option_first: recommendFirst
          }
        },
        null,
        2
      );
    }

    return '';
  }, [
    agentRole,
    agentContext,
    concisenessLevel,
    firstCharDirect,
    noChitChat,
    noClosingFluff,
    noAiDisclaimer,
    noQuestionEcho,
    codeOnlyOutput,
    recommendFirst,
    noTrivialConfirmation,
    bannedPhrases,
    exportFormat
  ]);

  // Metrics
  const metrics = useMemo(() => {
    const chars = generatedDirective.length;
    const words = generatedDirective.trim().split(/\s+/).filter(Boolean).length;
    const estimatedTokens = Math.ceil(chars / 3.8);
    return { chars, words, estimatedTokens };
  }, [generatedDirective]);

  // Copy to clipboard
  const handleCopyDirective = async () => {
    try {
      await navigator.clipboard.writeText(generatedDirective);
      setCopied(true);
      if (onShowToast) onShowToast('Perintah kontrol sistem berhasil disalin ke clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = generatedDirective;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      if (onShowToast) onShowToast('Perintah kontrol sistem berhasil disalin!', 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Download file
  const handleDownloadFile = () => {
    const ext = exportFormat === 'json' ? 'json' : exportFormat === 'claude' ? 'xml' : 'txt';
    const blob = new Blob([generatedDirective], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system_prompt_kontrol_agent_${selectedPresetId}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast(`File sistem prompt berhasil diunduh (.${ext})!`, 'success');
  };

  // Live Simulator test
  const activeScenario = SIMULATOR_SCENARIOS.find(s => s.id === activeScenarioId) || SIMULATOR_SCENARIOS[0];

  const handleRunCustomSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPromptInput.trim()) return;

    setIsSimulating(true);
    setTimeout(() => {
      // Generate realistic comparative responses
      const prompt = customPromptInput.trim();
      const verbose = `Halo! Terima kasih atas pertanyaannya yang sangat bagus ini mengenai "${prompt.slice(0, 30)}...". Sebagai model kecerdasan buatan, saya dengan senang hati akan menjelaskan langkah demi langkah untuk Anda.

Pertama-tama, perlu dipahami bahwa topik ini memiliki beberapa aspek pertimbangan penting. Kita perlu melihat dasar-dasar permasalahannya secara menyeluruh agar tidak terjadi kekeliruan di kemudian hari.

Berikut adalah uraian yang dapat saya sampaikan terkait pertanyaan Anda tersebut:
- Langkah persiapan awal harus dipastikan lengkap.
- Pelaksanaan teknis sebaiknya dikoordinasikan secara bertahap.
- Evaluasi hasil akhir perlu dicatat dengan teliti.

Semoga jawaban di atas bermanfaat dan dapat membantu Anda! Jika masih ada hal yang membingungkan atau ingin didiskusikan lebih lanjut, jangan ragu untuk bertanya kembali kepada saya ya. Selamat mencoba dan sukses selalu! 😊`;

      const controlled = `**SOLUSI LANGSUNG:**

1. **Inti Jawaban:** ${prompt} dieksekusi secara instan dengan memprioritaskan efisiensi operasional dan verifikasi data faktual.
2. **Langkah Aksi:**
   - [Direkomendasikan] Implementasikan solusi langsung pada alur utama tanpa tahapan redundant.
   - Tetapkan standar metrik keberhasilan terukur.
   - Catat log perubahan ke sistem untuk auditabilitas.
3. **Catatan:** Selesai tanpa hambatan dependensi.`;

      setCustomSimResult({ verbose, controlled });
      setIsSimulating(false);
      if (onShowToast) onShowToast('Simulasi respon terfilter berhasil dijalankan!', 'info');
    }, 600);
  };

  return (
    <div className={`space-y-8 text-left ${isCompactMode ? 'p-2' : ''}`}>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white border border-emerald-500/30 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5" />
              <span>Studio Kontrol Sistem Agent AI Profesional</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Perintah Kendali Agent AI: Responsif, Cerdas & To-The-Point
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Hilangkan basa-basi klise, respon bertele-tele, dan penundaan eksekusi. Racik perintah kontrol sistem (*system directive*) berkekuatan tinggi dalam Bahasa Indonesia formal untuk OpenAI, Claude, Gemini, dan Agent framework.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleCopyDirective}
              className={`px-5 py-3 rounded-2xl text-xs font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                copied
                  ? 'bg-emerald-400 text-slate-950 shadow-emerald-400/30 scale-105'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 hover:scale-102'
              }`}
            >
              {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : '1-Klik Salin Directive'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="px-4 py-3 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Unduh File</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Karakter Directive</span>
            <span className="text-base font-black text-white">{metrics.chars.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Jumlah Kata</span>
            <span className="text-base font-black text-white">{metrics.words} kata</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimasi Token</span>
            <span className="text-base font-black text-emerald-400">~{metrics.estimatedTokens} token</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Frasa Terlarang Aktif</span>
            <span className="text-base font-black text-rose-400">{bannedPhrases.length} frasa terblokir</span>
          </div>
        </div>
      </div>

      {/* Preset Cards Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Pilih Karakter & Gaya Kerja Agent</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Klik preset untuk menerapkan konfigurasi otomatis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESETS.map(preset => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {preset.badge}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                    {preset.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  Mode: <span className="text-slate-800 dark:text-slate-200 capitalize font-bold">{preset.concisenessLevel}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Control Parameters (Left) & Live Directive Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Parameters (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity & Scope Card */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-500" />
              <span>1. Peran & Konteks Kerja Agent</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Jabatan / Peran Spesifik:
                </label>
                <input
                  type="text"
                  value={agentRole}
                  onChange={e => setAgentRole(e.target.value)}
                  placeholder="Contoh: Asisten Eksekutif Profesional BUMDes"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Konteks Operasional & Lingkup Tugas:
                </label>
                <input
                  type="text"
                  value={agentContext}
                  onChange={e => setAgentContext(e.target.value)}
                  placeholder="Contoh: Pengelolaan reservasi, bank sampah, dan pelaporan keuangan desa"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Conciseness Mode Card */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>2. Tingkat Keringkasan & Format Jawaban</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'ultra',
                  title: 'Ultra-Ringkas',
                  desc: 'Maks. 2-4 kalimat/butir telegrafis. Tanpa intro.'
                },
                {
                  id: 'bullet',
                  title: 'To-The-Point Berbutir',
                  desc: '1 kalimat esensi + butir tindakan bernomor (Recommended).'
                },
                {
                  id: 'executive',
                  title: 'Eksekutif Kompak',
                  desc: 'Tabel metrik & 3 butir rekomendasi keputusan terukur.'
                }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setConcisenessLevel(item.id as any)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    concisenessLevel === item.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-slate-900 dark:text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-black text-xs mb-1">{item.title}</span>
                  <span className="block text-[11px] leading-tight text-slate-500 dark:text-slate-400">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Anti-Fluff Protocol Rules (Toggles) */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>3. Penegakan Disiplin Anti-Bertele-tele</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                Zero-Fluff Standard
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                {
                  state: firstCharDirect,
                  setter: setFirstCharDirect,
                  title: 'Mulai di Karakter Pertama',
                  desc: 'Jawaban langsung muncul di karakter pertama tanpa kalimat pengantar apa pun.'
                },
                {
                  state: noChitChat,
                  setter: setNoChitChat,
                  title: 'Blokir Salam & Basa-Basi',
                  desc: 'Larang kata "Halo", "Hai Kak", "Selamat pagi", dan sapaan sosial yang membuang waktu.'
                },
                {
                  state: noClosingFluff,
                  setter: setNoClosingFluff,
                  title: 'Blokir Penutup Klise',
                  desc: 'Larang "Semoga jawaban ini membantu!", "Kabar baik untuk Anda", dll.'
                },
                {
                  state: noAiDisclaimer,
                  setter: setNoAiDisclaimer,
                  title: 'Blokir Disclaimer AI',
                  desc: 'Larang frasa robotik "Sebagai model AI..." yang berulang di setiap prompt.'
                },
                {
                  state: noQuestionEcho,
                  setter: setNoQuestionEcho,
                  title: 'Larang Mengulang Pertanyaan',
                  desc: 'Jangan parafrase ulang pertanyaan user atau memuji "Pertanyaan yang sangat bagus".'
                },
                {
                  state: codeOnlyOutput,
                  setter: setCodeOnlyOutput,
                  title: 'Mode Kode / Data Murni',
                  desc: 'Jika diminta script/fungsi, sajikan raw code tanpa cerita pembuka atau penutup.'
                },
                {
                  state: recommendFirst,
                  setter: setRecommendFirst,
                  title: 'Opsi Terbaik Paling Atas',
                  desc: 'Tampilkan pilihan terkuat di urutan #1 dengan label [Direkomendasikan].'
                },
                {
                  state: noTrivialConfirmation,
                  setter: setNoTrivialConfirmation,
                  title: 'Eksekusi Tanpa Tanya Sepele',
                  desc: 'Gunakan asumsi default yang masuk akal daripada membuang waktu bertanya balik hal sepele.'
                }
              ].map((toggle, idx) => (
                <div
                  key={idx}
                  onClick={() => toggle.setter(!toggle.state)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    toggle.state
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/50 text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    toggle.state ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-transparent'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs block leading-tight mb-0.5">{toggle.title}</span>
                    <span className="text-[11px] leading-tight text-slate-500 dark:text-slate-400 block">{toggle.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Banned Phrases Management Card */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>4. Daftar Frasa Terlarang (Banned Phrases)</span>
              </h4>
              <button
                onClick={() => setBannedPhrases(DEFAULT_BANNED_PHRASES)}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Bawaan</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Agent AI diinstruksikan secara mutlak untuk tidak mengucapkan kalimat-kalimat ini:
            </p>

            <div className="flex flex-wrap gap-2">
              {bannedPhrases.map((phrase, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-xs font-medium"
                >
                  <span>"{phrase}"</span>
                  <button
                    onClick={() => handleRemoveBannedPhrase(phrase)}
                    className="hover:text-rose-950 dark:hover:text-white cursor-pointer ml-1 p-0.5 rounded"
                    title="Hapus frasa larangan ini"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Custom Banned Phrase Form */}
            <form onSubmit={handleAddBannedPhrase} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newBannedPhraseInput}
                onChange={e => setNewBannedPhraseInput(e.target.value)}
                placeholder="Tambah frasa klise yang ingin Anda larang..."
                className="flex-grow p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:border-rose-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
              >
                Tambah
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Real-time Directive Output & Export (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
            {/* Format Tab Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-black uppercase text-emerald-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                <span>Generated Directive</span>
              </span>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px]">
                {[
                  { id: 'universal', label: 'Universal' },
                  { id: 'chatgpt', label: 'OpenAI' },
                  { id: 'claude', label: 'Claude' },
                  { id: 'gemini', label: 'Gemini' },
                  { id: 'json', label: 'JSON' }
                ].map(fmt => (
                  <button
                    key={fmt.id}
                    onClick={() => setExportFormat(fmt.id as any)}
                    className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      exportFormat === fmt.id
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Directive Code Area */}
            <div className="relative group">
              <pre className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-200 overflow-x-auto max-h-[480px] overflow-y-auto whitespace-pre-wrap select-all selection:bg-emerald-500 selection:text-slate-950 scrollbar-thin">
                {generatedDirective}
              </pre>

              {/* Floating Copy Action */}
              <button
                onClick={handleCopyDirective}
                className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
                  copied
                    ? 'bg-emerald-400 text-slate-950 scale-105'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-400 font-mono">
                Format: <span className="text-white uppercase font-bold">{exportFormat}</span>
              </span>

              <div className="flex gap-2">
                <button
                  onClick={handleDownloadFile}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Unduh</span>
                </button>
                <button
                  onClick={handleCopyDirective}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Lengkap</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Komparasi Interaktif: Sebelum vs Sesudah */}
      <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
              Uji Coba Langsung
            </span>
            <h3 className="text-xl font-black text-white">
              Simulator Komparasi: Sebelum vs Sesudah Sistem Kontrol
            </h3>
            <p className="text-xs text-slate-400">
              Lihat perbedaan dramatis antara Agent biasa yang lambat/bertele-tele dengan Agent yang telah dikendalikan oleh directive ini.
            </p>
          </div>

          {/* Scenario Buttons */}
          <div className="flex flex-wrap gap-2">
            {SIMULATOR_SCENARIOS.map(scen => (
              <button
                key={scen.id}
                onClick={() => {
                  setActiveScenarioId(scen.id);
                  setCustomSimResult(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeScenarioId === scen.id && !customSimResult
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {scen.title}
              </button>
            ))}
          </div>
        </div>

        {/* User Prompt Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Prompt Uji Coba:
          </span>
          <p className="text-sm font-semibold text-slate-200">
            "{customSimResult ? customPromptInput : activeScenario.userPrompt}"
          </p>
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Sebelum (Bertele-tele) */}
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-rose-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Sebelum (Agent Standar: Bertele-tele)</span>
              </span>
              <span className="text-[10px] text-rose-300 font-bold bg-rose-950 px-2 py-0.5 rounded-md border border-rose-800">
                Waktu baca: ~30-45 detik
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-950 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[340px] overflow-y-auto">
              {customSimResult ? customSimResult.verbose : activeScenario.verboseResponse}
            </div>

            <div className="text-[11px] text-rose-300/80 space-y-1">
              <p>⚠️ <strong>Kelemahan:</strong> Penuh basa-basi "Halo", salam berulang, disclaimer "Sebagai model AI", dan penutup klise yang membuang waktu eksekutif.</p>
            </div>
          </div>

          {/* Right: Sesudah (Profesional & Terkontrol) */}
          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3 shadow-lg shadow-emerald-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Sesudah (Agent Terkontrol: To-The-Point)</span>
              </span>
              <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-700">
                Waktu baca: ~3-5 detik
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-900/60 text-xs text-emerald-100 whitespace-pre-wrap leading-relaxed max-h-[340px] overflow-y-auto">
              {customSimResult ? customSimResult.controlled : activeScenario.controlledResponse}
            </div>

            <div className="text-[11px] text-emerald-300 space-y-1">
              <p>✅ <strong>Keunggulan:</strong> Langsung ke inti di karakter pertama, butir poin terukur, tanpa basa-basi, langsung siap dieksekusi.</p>
            </div>
          </div>
        </div>

        {/* Custom Prompt Interactive Tester */}
        <form onSubmit={handleRunCustomSimulation} className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customPromptInput}
            onChange={e => setCustomPromptInput(e.target.value)}
            placeholder="Ketik pertanyaan atau prompt uji coba Anda sendiri di sini..."
            className="flex-grow p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSimulating}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isSimulating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isSimulating ? 'Memfilter...' : 'Uji Prompt Kustom'}</span>
          </button>
        </form>
      </div>

      {/* Panduan Implementasi Multi-Platform */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Panduan Pasang: Cara Menempelkan Directive ke Berbagai Platform AI</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Langkah cepat menerapkan instruksi sistem ini ke asisten AI yang Anda gunakan setiap hari.
            </p>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'chatgpt', label: 'ChatGPT' },
              { id: 'claude', label: 'Claude' },
              { id: 'gemini', label: 'Gemini / AI Studio' },
              { id: 'cursor', label: 'Cursor / Copilot' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveGuideTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeGuideTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs space-y-3">
          {activeGuideTab === 'chatgpt' && (
            <div className="space-y-2">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Langkah memasang pada ChatGPT (Web & Mobile):
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Buka ChatGPT dan klik foto profil Anda di pojok kiri bawah.</li>
                <li>Pilih menu <strong>"Customize ChatGPT"</strong> (Instruksi Kustom).</li>
                <li>Pilih tab <strong>"OpenAI"</strong> pada box output di atas, lalu klik <strong>"Salin"</strong>.</li>
                <li>Tempelkan teks bagian Kotak 1 ke kolom atas, dan bagian Kotak 2 ke kolom bawah.</li>
                <li>Klik tombol <strong>Save</strong>. Mulai sekarang, seluruh percakapan ChatGPT akan bekerja secara profesional tanpa bertele-tele!</li>
              </ol>
            </div>
          )}

          {activeGuideTab === 'claude' && (
            <div className="space-y-2">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Langkah memasang pada Anthropic Claude (Claude.ai & Projects):
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Buka Claude.ai dan buka menu <strong>"Projects"</strong> atau <strong>"Custom Instructions"</strong>.</li>
                <li>Pilih tab <strong>"Claude"</strong> pada generator di atas, lalu klik <strong>"Salin"</strong>.</li>
                <li>Tempelkan directive bertag XML ke kolom <em>System Prompt</em>.</li>
                <li>Simpan project. Claude akan merespon dengan presisi tinggi dan menghilangkan seluruh prolog.</li>
              </ol>
            </div>
          )}

          {activeGuideTab === 'gemini' && (
            <div className="space-y-2">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Langkah memasang pada Google AI Studio & Gemini API:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Buka <strong>Google AI Studio</strong> (aistudio.google.com).</li>
                <li>Di panel kanan (System Instructions), tempelkan teks dari tab <strong>Universal</strong> atau <strong>Gemini</strong>.</li>
                <li>Atur parameter <em>Temperature</em> ke <strong>0.2 – 0.4</strong> untuk memaksimalkan kepatuhan pada instruksi dan mengurangi halusinasi.</li>
                <li>Klik <em>Run</em> untuk menguji prompt Anda.</li>
              </ol>
            </div>
          )}

          {activeGuideTab === 'cursor' && (
            <div className="space-y-2">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Langkah memasang pada Cursor IDE / GitHub Copilot:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Buat file bernama <code>.cursorrules</code> di root project Anda.</li>
                <li>Pilih tab <strong>"Universal"</strong> dengan preset <em>"Senior Technical Agent"</em>.</li>
                <li>Salin dan simpan isi directive ke dalam file <code>.cursorrules</code> tersebut.</li>
                <li>Cursor Agent sekarang hanya akan mengeluarkan kode langsung tanpa penjelasan panjang yang tidak perlu.</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
