import React, { useState } from 'react';
import { 
  Users, 
  Hash, 
  Send, 
  Paperclip, 
  Smile, 
  Search, 
  ShieldCheck, 
  CheckCheck, 
  Clock, 
  Plus,
  Phone,
  Video,
  Info
} from 'lucide-react';
import { AdminRole, AdminUser } from '../../types/admin';

interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
  attachment?: string;
}

interface ChannelOrUser {
  id: string;
  type: 'channel' | 'direct';
  name: string;
  subtitle: string;
  status?: 'online' | 'on_duty' | 'break' | 'offline';
  unreadCount?: number;
  role?: AdminRole;
  avatarText?: string;
}

const INITIAL_TARGETS: ChannelOrUser[] = [
  { id: 'ch-general', type: 'channel', name: 'koordinasi-utama-desa', subtitle: 'Kanal koordinasi umum seluruh divisi BUMDes', unreadCount: 2 },
  { id: 'ch-gor', type: 'channel', name: 'petugas-gor-lapangan', subtitle: 'Jadwal shift, lampu, dan kebersihan lapangan badminton' },
  { id: 'ch-sampah', type: 'channel', name: 'armada-sampah-rt', subtitle: 'Logistik truk sampah Dusun I, II, dan III' },
  { id: 'ch-kas', type: 'channel', name: 'divisi-keuangan-pades', subtitle: 'Sinkronisasi setoran kasir dan buku kas bank' },
  // Pegawai 1-on-1
  { id: 'usr-direktur', type: 'direct', name: 'Bambang Sutrisno, S.E.', subtitle: 'Direktur Utama BUMDes', status: 'online', role: 'direktur', avatarText: 'B' },
  { id: 'usr-bendahara', type: 'direct', name: 'Siti Rahayu, S.E.', subtitle: 'Bendahara Keuangan', status: 'online', role: 'bendahara', avatarText: 'S', unreadCount: 1 },
  { id: 'usr-karyawan', type: 'direct', name: 'Bagas Pratama', subtitle: 'Staf Kasir & Pelayanan', status: 'on_duty', role: 'karyawan', avatarText: 'B' },
  { id: 'usr-operator', type: 'direct', name: 'Joko Sasongko', subtitle: 'Operator Lapangan (Di GOR)', status: 'on_duty', role: 'operator', avatarText: 'J' },
  { id: 'usr-fasilitas', type: 'direct', name: 'Agus Wijaya', subtitle: 'Pengelola Fasilitas & Aula', status: 'break', role: 'manajer_fasilitas', avatarText: 'A' },
  { id: 'usr-editor', type: 'direct', name: 'Dian Permata', subtitle: 'Editor Berita & Publikasi Desa', status: 'offline', role: 'editor', avatarText: 'D' },
  { id: 'usr-auditor', type: 'direct', name: 'Drs. H. Mulyadi', subtitle: 'Auditor / Pengawas BPD', status: 'offline', role: 'auditor', avatarText: 'M' },
  { id: 'usr-pic', type: 'direct', name: 'Suwardi (Dusun I)', subtitle: 'PIC Wilayah Dusun & RT', status: 'online', role: 'pic_wilayah', avatarText: 'S' }
];

const INITIAL_MESSAGES: Record<string, DirectMessage[]> = {
  'ch-general': [
    {
      id: 'g-1',
      senderId: 'usr-direktur',
      senderName: 'Bambang Sutrisno (Direktur)',
      senderRole: 'Direktur Utama',
      text: 'Selamat pagi rekan-rekan pengelola BUMDes Waskita Wijaya. Mohon pastikan persiapan turnamen bulutangkis antar-RT malam ini sudah rapi.',
      timestamp: '08:30'
    },
    {
      id: 'g-2',
      senderId: 'usr-operator',
      senderName: 'Joko Sasongko (Operator)',
      senderRole: 'Operator Lapangan',
      text: 'Siap Pak Direktur! Karpet vinyl Lapangan 1 & 2 sudah dipel bersih dan lampu penerangan 1000W sudah diuji coba.',
      timestamp: '08:45'
    }
  ],
  'usr-bendahara': [
    {
      id: 'd-1',
      senderId: 'usr-bendahara',
      senderName: 'Siti Rahayu, S.E.',
      senderRole: 'Bendahara Keuangan',
      text: 'Pak Tri, laporan rekap penerimaan kasir badminton hari Sabtu kemarin sebesar Rp 1.450.000 sudah saya cocokkan dengan QRIS settlement bank.',
      timestamp: '11:15'
    },
    {
      id: 'd-2',
      senderId: 'me',
      senderName: 'Tri Haryono (Anda)',
      senderRole: 'Super Admin',
      text: 'Terima kasih Bu Siti, kerja bagus! Tolong kuitansi dan slip setorannya difoto lalu diarsipkan ke modul Laporan Real-Time ya.',
      timestamp: '11:20'
    }
  ]
};

interface StaffDmModuleProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  currentUser?: AdminUser;
}

export default function StaffDmModule({ onShowToast, currentUser }: StaffDmModuleProps) {
  const [activeTargetId, setActiveTargetId] = useState<string>('usr-bendahara');
  const [messages, setMessages] = useState<Record<string, DirectMessage[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeTarget = INITIAL_TARGETS.find(t => t.id === activeTargetId) || INITIAL_TARGETS[0];
  const currentChatMessages = messages[activeTargetId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: currentUser ? `${currentUser.name} (Anda)` : 'Tri Haryono (Anda)',
      senderRole: currentUser?.role || 'Super Administrator',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeTargetId]: [...(prev[activeTargetId] || []), newMsg]
    }));

    setInputText('');
    onShowToast(`Pesan terkirim ke ${activeTarget.name}`, 'success');
  };

  const filteredTargets = INITIAL_TARGETS.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const channels = filteredTargets.filter(t => t.type === 'channel');
  const staffMembers = filteredTargets.filter(t => t.type === 'direct');

  return (
    <div className="space-y-4">
      {/* Banner Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
              <span>Menu DM Karyawan & Kolaborasi Seluruh Staf</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                10 PERAN TERINTEGRASI
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Saluran internal aman untuk bercakap dan berinteraksi dengan seluruh jajaran pegawai BUMDes Waskita Wijaya.
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="h-[680px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* Sisi Kiri: Daftar Kanal & Karyawan */}
        <div className="w-full md:w-80 border-r border-slate-800 bg-slate-950/60 flex flex-col">
          
          {/* Header Bilah Sisi */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-white">Saluran & Kontak Tim</h4>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Status Anda: Online (Super Admin)</span>
              </span>
            </div>
            <button 
              type="button" 
              onClick={() => onShowToast('Fitur pembuatan kanal grup baru dibuka', 'info')}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Buat Saluran Baru"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-slate-800/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari rekan atau divisi..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Scroll Area Daftar Item */}
          <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
            
            {/* Grup Kanal Umum */}
            <div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase px-2 tracking-wider block mb-1">
                Kanal Koordinasi Divisi
              </span>
              <div className="space-y-0.5">
                {channels.map((ch) => {
                  const isSelected = ch.id === activeTargetId;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setActiveTargetId(ch.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                        isSelected 
                          ? 'bg-slate-800 text-white' 
                          : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <Hash className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{ch.name}</span>
                      </div>
                      {ch.unreadCount && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-cyan-500 text-slate-950 font-black">
                          {ch.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grup Seluruh Karyawan Terdaftar */}
            <div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase px-2 tracking-wider block mb-1">
                Seluruh Karyawan ({staffMembers.length} Staf)
              </span>
              <div className="space-y-1">
                {staffMembers.map((staf) => {
                  const isSelected = staf.id === activeTargetId;
                  return (
                    <div
                      key={staf.id}
                      onClick={() => setActiveTargetId(staf.id)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors border ${
                        isSelected 
                          ? 'bg-slate-900 border-cyan-500/50 text-white' 
                          : 'border-transparent hover:bg-slate-900/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <div className="relative shrink-0">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 text-cyan-300 font-black text-xs flex items-center justify-center border border-slate-700">
                            {staf.avatarText}
                          </div>
                          <span className={`w-2 h-2 rounded-full absolute -bottom-0.5 -right-0.5 border border-slate-950 ${
                            staf.status === 'online' ? 'bg-emerald-400' :
                            staf.status === 'on_duty' ? 'bg-amber-400' :
                            staf.status === 'break' ? 'bg-blue-400' : 'bg-slate-500'
                          }`} />
                        </div>
                        <div className="truncate">
                          <h5 className="text-xs font-bold truncate leading-tight">{staf.name}</h5>
                          <span className="text-[10px] text-slate-400 truncate block mt-0.5">{staf.subtitle}</span>
                        </div>
                      </div>

                      {staf.unreadCount ? (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-500 text-slate-950 font-black shrink-0">
                          {staf.unreadCount}
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-slate-500 uppercase shrink-0">
                          {staf.status === 'online' ? 'Aktif' : staf.status === 'on_duty' ? 'Di Lap.' : ''}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Sisi Kanan: Area Percakapan Tim */}
        <div className="flex-1 flex flex-col bg-slate-900">
          
          {/* Header Target Obrolan */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 font-black text-sm flex items-center justify-center border border-cyan-500/30">
                {activeTarget.type === 'channel' ? '#' : activeTarget.avatarText}
              </div>
              <div>
                <h4 className="text-xs font-black text-white flex items-center gap-2">
                  <span>{activeTarget.name}</span>
                  {activeTarget.role && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-800 text-cyan-400">
                      {activeTarget.role.toUpperCase()}
                    </span>
                  )}
                </h4>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {activeTarget.subtitle}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                type="button" 
                onClick={() => onShowToast(`Menghubungi nomor darurat kantor BUMDes`, 'info')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer" 
                title="Panggilan Suara"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Area Pesan Obrolan */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40 custom-scrollbar">
            {currentChatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Users className="w-8 h-8 opacity-40" />
                <p className="text-xs">Belum ada riwayat pesan di saluran ini. Mulai percakapan sekarang!</p>
              </div>
            ) : (
              currentChatMessages.map((msg) => {
                const isMe = msg.senderId === 'me';
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-xs'
                        : 'bg-slate-800 text-slate-200 rounded-tl-xs'
                    }`}>
                      <div className="flex items-center justify-between space-x-3 mb-1 text-[10px] font-bold">
                        <span className={isMe ? 'text-cyan-200' : 'text-cyan-400'}>
                          {msg.senderName} <span className="opacity-70 font-normal">({msg.senderRole})</span>
                        </span>
                        <span className="opacity-70 font-mono text-[9px]">{msg.timestamp}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Box Kirim Pesan */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onShowToast('Unggah lampiran nota/berkas dibuka', 'info')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
              title="Lampirkan Dokumen atau Foto Lapangan"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input 
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Tulis pesan internal ke ${activeTarget.name}...`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
