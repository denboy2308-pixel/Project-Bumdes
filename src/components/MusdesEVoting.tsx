import React, { useState } from 'react';
import { 
  Vote, 
  CheckCircle2, 
  Lock, 
  BarChart3, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  AlertCircle,
  Award,
  Send
} from 'lucide-react';
import { showToast } from './ToastNotification';

interface VotingOption {
  id: string;
  title: string;
  category: string;
  estimatedBudget: string;
  votesCount: number;
  description: string;
}

const MUSDES_PROGRAMS: VotingOption[] = [
  {
    id: 'prog-1',
    title: 'Pengadaan Pembangkit Listrik Tenaga Surya (PLTS) TPS3R',
    category: 'Energi Terbarukan',
    estimatedBudget: 'Rp 45.000.000',
    votesCount: 142,
    description: 'Pemasangan solar panel 5.000 Watt di atap gedung pemilahan sampah untuk menekan biaya operasional listrik hingga 70%.'
  },
  {
    id: 'prog-2',
    title: 'Pemasangan Lampu Penerangan Jalan Utama (PJU) Solar RT 01-05',
    category: 'Infrastruktur Desa',
    estimatedBudget: 'Rp 38.000.000',
    votesCount: 189,
    description: 'Pemasangan 25 titik lampu penerangan jalan LED otomatis tenaga surya di sepanjang rute utama Desa Waru ke Baki.'
  },
  {
    id: 'prog-3',
    title: 'Pengadaan Mobil Ambulans Desa 24 Jam Siaga Warga',
    category: 'Kesehatan Warga',
    estimatedBudget: 'Rp 110.000.000',
    votesCount: 230,
    description: 'Pengadaan armada mobil medis untuk antar-jemput lansia, ibu melahirkan, dan kondisi darurat kesehatan warga desa.'
  },
  {
    id: 'prog-4',
    title: 'Normalisasi & Perbaikan Drainase Sawah Petani Dukuh Waru',
    category: 'Pertanian & Irigasi',
    estimatedBudget: 'Rp 28.000.000',
    votesCount: 95,
    description: 'Pembersihan dan pembetokan saluran irigasi sawah sepanjang 800m untuk cegah banjir dan jamin pasokan air sawah.'
  }
];

export default function MusdesEVoting() {
  const [programs, setPrograms] = useState<VotingOption[]>(MUSDES_PROGRAMS);
  const [nikInput, setNikInput] = useState('');
  const [voterName, setVoterName] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState<string>('prog-3');
  const [hasVoted, setHasVoted] = useState(false);

  const totalVotes = programs.reduce((sum, p) => sum + p.votesCount, 0);

  const handleCastVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (nikInput.trim().length !== 16) {
      showToast('NIK Tidak Valid', 'Silakan masukkan 16 digit Nomor Induk Kependudukan (NIK) warga Desa Waru.', 'warning');
      return;
    }
    if (!voterName.trim()) {
      showToast('Nama Warga Wajib Diisi', 'Silakan isi nama lengkap sesuai KTP.', 'warning');
      return;
    }

    setPrograms(prev => prev.map(p => p.id === selectedProgramId ? { ...p, votesCount: p.votesCount + 1 } : p));
    setHasVoted(true);
    showToast('Suara Berhasil Diisi!', 'Terima kasih telah berpartisipasi dalam E-Voting Musdes Digital Desa Waru.', 'success');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 mb-2">
            <Vote className="w-3.5 h-3.5" />
            <span>Demokrasi Transparan Desa Waru</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            E-Voting Musdes Digital Pemilihan Program Prioritas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gunakan hak suara warga Anda secara langsung, transparan, dan terverifikasi NIK KTP dalam Musyawarah Desa.
          </p>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-right">
          <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Total Hak Suara Masuk</span>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{totalVotes} Suara Warga</span>
        </div>
      </div>

      {/* Programs List with Live Progress Bars */}
      <div className="space-y-4">
        {programs.map(prog => {
          const percentage = totalVotes > 0 ? ((prog.votesCount / totalVotes) * 100).toFixed(1) : '0';
          const isSelected = selectedProgramId === prog.id;

          return (
            <div
              key={prog.id}
              onClick={() => !hasVoted && setSelectedProgramId(prog.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-400'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-md">
                    {prog.category}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1">{prog.title}</h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{prog.votesCount} Suara</span>
                  <span className="text-xs text-slate-400 font-bold block">({percentage}%)</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{prog.description}</p>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Estimasi Anggaran: <strong className="text-slate-800 dark:text-slate-200">{prog.estimatedBudget}</strong></span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {isSelected ? '✓ Program Pilihan Anda' : 'Klik untuk memilih'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${percentage}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Voting Form Section */}
      {!hasVoted ? (
        <form onSubmit={handleCastVote} className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black text-white">Verifikasi NIK KTP & Kirim Suara</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nama Sesuai KTP:</label>
              <input
                type="text"
                placeholder="Contoh: Bp. Sukirno"
                value={voterName}
                onChange={e => setVoterName(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">NIK (16 Digit):</label>
              <input
                type="text"
                maxLength={16}
                placeholder="331102xxxxxxxxxx"
                value={nikInput}
                onChange={e => setNikInput(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Vote className="w-4 h-4" />
            <span>Kirim Hak Suara E-Voting Musdes</span>
          </button>
        </form>
      ) : (
        <div className="p-6 bg-emerald-950/40 border border-emerald-800 rounded-3xl text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-black text-white">Suara Anda Telah Terrekam Resmi!</h3>
          <p className="text-xs text-slate-300">
            Terima kasih Bp/Ibu <strong>{voterName}</strong> (NIK: {nikInput.substring(0, 6)}******). Suara Anda telah berkontribusi bagi masa depan pembangunan Desa Waru.
          </p>
        </div>
      )}

    </div>
  );
}
