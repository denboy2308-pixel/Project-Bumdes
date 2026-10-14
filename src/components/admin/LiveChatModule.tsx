import React, { useState } from 'react';
import { 
  MessageSquare, 
  Bot, 
  UserCheck, 
  XCircle, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Search,
  CheckCheck,
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';

interface ChatSession {
  id: string;
  userName: string;
  userPhone: string;
  avatarLetter: string;
  topic: string;
  status: 'ai_active' | 'needs_human' | 'resolved';
  isRead: boolean;
  lastMessageTime: string;
  messages: Array<{
    id: string;
    sender: 'user' | 'ai' | 'admin';
    senderName: string;
    text: string;
    timestamp: string;
  }>;
}

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'CHAT-101',
    userName: 'Rizky Ramadhan (Warga Dusun I)',
    userPhone: '0812-8877-6655',
    avatarLetter: 'R',
    topic: 'Reservasi Lapangan Olahraga Badminton',
    status: 'ai_active',
    isRead: false,
    lastMessageTime: '13:42',
    messages: [
      {
        id: 'm-1',
        sender: 'user',
        senderName: 'Rizky Ramadhan',
        text: 'Halo admin BUMDes, apakah lapangan badminton slot jam 20.00 malam ini masih kosong?',
        timestamp: '13:40'
      },
      {
        id: 'm-2',
        sender: 'ai',
        senderName: 'AI Bot Waskita Wijaya',
        text: 'Halo Bpk. Rizky! Untuk malam ini jam 20.00 WIB, Lapangan 1 (Kayu Pro) sudah terisi, namun Lapangan 2 (Karpet Vinyl) masih tersedia. Tarifnya Rp 40.000/jam. Mau langsung saya buatkan reservasinya?',
        timestamp: '13:41'
      },
      {
        id: 'm-3',
        sender: 'user',
        senderName: 'Rizky Ramadhan',
        text: 'Boleh, tolong siapkan Lapangan 2 jam 20.00 sampai 22.00 ya.',
        timestamp: '13:42'
      }
    ]
  },
  {
    id: 'CHAT-102',
    userName: 'Ibu Hartini (Warga Dusun II)',
    userPhone: '0857-1234-5678',
    avatarLetter: 'H',
    topic: 'Komplain Armada Angkutan Sampah',
    status: 'needs_human',
    isRead: false,
    lastMessageTime: '13:30',
    messages: [
      {
        id: 'm-4',
        sender: 'user',
        senderName: 'Ibu Hartini',
        text: 'Selamat siang, saya mau lapor kenapa truk sampah di RT 03 belum lewat sejak hari Kamis?',
        timestamp: '13:28'
      },
      {
        id: 'm-5',
        sender: 'ai',
        senderName: 'AI Bot Waskita Wijaya',
        text: 'Mohon maaf atas ketidaknyamanan Ibu Hartini. Armada TPS3R sedang melakukan pergantian oli mesin terjadwal. Saya teruskan laporan ini ke petugas operasional sekarang.',
        timestamp: '13:29'
      },
      {
        id: 'm-6',
        sender: 'user',
        senderName: 'Ibu Hartini',
        text: 'Tolong segera ya, bak penampungan sudah penuh.',
        timestamp: '13:30'
      }
    ]
  },
  {
    id: 'CHAT-103',
    userName: 'Bpk. Hendra (Karang Taruna Dusun III)',
    userPhone: '0813-4455-6677',
    avatarLetter: 'H',
    topic: 'Peminjaman Aula Gedung Serbaguna',
    status: 'resolved',
    isRead: true,
    lastMessageTime: '11:15',
    messages: [
      {
        id: 'm-7',
        sender: 'user',
        senderName: 'Bpk. Hendra',
        text: 'Syarat peminjaman aula untuk turnamen catur warga apa saja min?',
        timestamp: '11:10'
      },
      {
        id: 'm-8',
        sender: 'admin',
        senderName: 'Tri Haryono (Admin)',
        text: 'Cukup melampirkan surat pengantar dari RT/RW setempat dan mengisi formulir di loket BUMDes atau lewat web portal resmi ini Pak.',
        timestamp: '11:14'
      },
      {
        id: 'm-9',
        sender: 'user',
        senderName: 'Bpk. Hendra',
        text: 'Baik Pak Tri, sangat jelas. Terima kasih banyak!',
        timestamp: '11:15'
      }
    ]
  }
];

import { AdminUser } from '../../types/admin';

interface LiveChatModuleProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  currentUser?: AdminUser;
}

export default function LiveChatModule({ onShowToast, currentUser }: LiveChatModuleProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('CHAT-101');
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const selectedSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

  const handleSelectSession = (id: string) => {
    setSelectedSessionId(id);
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isRead: true } : s));
  };

  const handleTakeover = () => {
    if (!selectedSession) return;
    setSessions(prev => prev.map(s => {
      if (s.id === selectedSession.id) {
        return {
          ...s,
          status: 'needs_human',
          messages: [
            ...s.messages,
            {
              id: `sys-${Date.now()}`,
              sender: 'admin',
              senderName: 'Sistem Handover',
              text: '🚨 PERHATIAN: AI Bot dijeda. Staf Pengelola BUMDes telah mengambil alih percakapan ini secara langsung.',
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return s;
    }));
    onShowToast(`Percakapan #${selectedSession.id} berhasil diambil alih`, 'info');
  };

  const handleReturnToAi = () => {
    if (!selectedSession) return;
    setSessions(prev => prev.map(s => {
      if (s.id === selectedSession.id) {
        return {
          ...s,
          status: 'ai_active',
          messages: [
            ...s.messages,
            {
              id: `sys-${Date.now()}`,
              sender: 'ai',
              senderName: 'Sistem Bot',
              text: '🤖 AI Bot Waskita Wijaya kembali aktif mendampingi percakapan.',
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return s;
    }));
    onShowToast('Mode respons AI diaktifkan kembali', 'info');
  };

  const handleCloseChat = () => {
    if (!selectedSession) return;
    setSessions(prev => prev.map(s => {
      if (s.id === selectedSession.id) {
        return {
          ...s,
          status: 'resolved',
          messages: [
            ...s.messages,
            {
              id: `sys-${Date.now()}`,
              sender: 'admin',
              senderName: 'Sistem',
              text: '✅ Sesi percakapan ditutup oleh pengelola BUMDes. Tiket layanan tercatat selesai.',
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return s;
    }));
    onShowToast(`Sesi chat #${selectedSession.id} ditutup`, 'success');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedSession) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'admin' as const,
      senderName: 'Tri Haryono (Pengelola)',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setSessions(prev => prev.map(s => {
      if (s.id === selectedSession.id) {
        return {
          ...s,
          lastMessageTime: newMsg.timestamp,
          messages: [...s.messages, newMsg]
        };
      }
      return s;
    }));

    setInputText('');
    onShowToast('Pesan balasan langsung terkirim ke warga', 'success');
  };

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
              <span>Menu Live Chat (AI + Human Handover Support)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Pantau obrolan warga dengan AI secara langsung, ambil alih kendali pesan, atau tutup tiket chat.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 bg-amber-950/60 text-amber-300 border border-amber-800/80 rounded-xl font-bold">
            🤖 AI Aktif: {sessions.filter(s => s.status === 'ai_active').length}
          </span>
          <span className="px-2.5 py-1 bg-rose-950/60 text-rose-300 border border-rose-800/80 rounded-xl font-bold">
            ⚠️ Butuh Staf: {sessions.filter(s => s.status === 'needs_human').length}
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="h-[680px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        
        {/* Sisi Kiri: Tabel / Daftar Pengguna Percakapan */}
        <div className="w-full lg:w-84 border-r border-slate-800 flex flex-col bg-slate-950/60">
          
          {/* Filter & Search Bar */}
          <div className="p-3.5 border-b border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama warga atau topik..."
                className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex items-center space-x-1">
              <button 
                type="button" 
                onClick={() => setFilterStatus('all')}
                className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors ${filterStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Semua
              </button>
              <button 
                type="button" 
                onClick={() => setFilterStatus('ai_active')}
                className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors ${filterStatus === 'ai_active' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'text-slate-400 hover:text-white'}`}
              >
                AI Aktif
              </button>
              <button 
                type="button" 
                onClick={() => setFilterStatus('needs_human')}
                className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors ${filterStatus === 'needs_human' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-white'}`}
              >
                Perlu Staf
              </button>
            </div>
          </div>

          {/* List Sesi */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-850 custom-scrollbar">
            {filteredSessions.map((session) => {
              const isSelected = session.id === selectedSession.id;
              return (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`p-3.5 cursor-pointer transition-all border-l-4 ${
                    isSelected 
                      ? 'bg-slate-900 border-l-cyan-500' 
                      : session.status === 'needs_human'
                        ? 'bg-rose-950/10 border-l-rose-500 hover:bg-slate-900'
                        : 'border-l-transparent hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center space-x-2 truncate">
                      <div className="w-6 h-6 rounded-lg bg-slate-800 text-cyan-400 flex items-center justify-center font-black text-xs shrink-0">
                        {session.avatarLetter}
                      </div>
                      <span className="text-xs font-black text-white truncate">{session.userName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1">{session.lastMessageTime}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate mb-2 pl-8">
                    {session.topic}
                  </p>

                  <div className="flex items-center justify-between pl-8">
                    {session.status === 'ai_active' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-950/80 text-amber-300 border border-amber-800">
                        <Bot className="w-2.5 h-2.5" />
                        <span>AI Menjawab</span>
                      </span>
                    )}
                    {session.status === 'needs_human' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>Butuh Respon Staf</span>
                      </span>
                    )}
                    {session.status === 'resolved' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-800 text-slate-400">
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Selesai</span>
                      </span>
                    )}

                    {!session.isRead ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>Pesan Baru</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                        <CheckCheck className="w-3 h-3 text-cyan-400" />
                        <span>Dibuka</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sisi Kanan: Ruang Percakapan & Handover Controls */}
        <div className="flex-1 flex flex-col bg-slate-900">
          
          {/* Header Percakapan */}
          <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90">
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-black text-white">{selectedSession.userName}</h4>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded-md">
                  {selectedSession.userPhone}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Topik Percakapan: <strong className="text-cyan-400 font-semibold">{selectedSession.topic}</strong>
              </span>
            </div>

            {/* Handover & Action Buttons */}
            <div className="flex items-center space-x-2">
              {selectedSession.status === 'ai_active' ? (
                <button
                  type="button"
                  onClick={handleTakeover}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  title="Jeda AI dan tangani langsung"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>⚡ Ambil Alih dari AI</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReturnToAi}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  title="Kembalikan penjawab ke bot AI"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Kembalikan ke AI</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCloseChat}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                title="Tutup tiket chat ini"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Tutup Chat</span>
              </button>
            </div>
          </div>

          {/* Area Pesan Chat Bubble */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40 custom-scrollbar">
            {selectedSession.messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isAi = msg.sender === 'ai';
              const isAdmin = msg.sender === 'admin';

              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-md rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-slate-800 text-slate-200 rounded-tl-xs'
                      : isAi
                        ? 'bg-purple-950/70 border border-purple-800/80 text-purple-200 rounded-tr-xs'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs'
                  }`}>
                    <div className="flex items-center justify-between space-x-4 mb-1 text-[10px] font-bold">
                      <span className={isUser ? 'text-cyan-400' : isAi ? 'text-purple-300 flex items-center gap-1' : 'text-slate-950'}>
                        {isAi && <Bot className="w-2.5 h-2.5 inline" />}
                        {msg.senderName}
                      </span>
                      <span className="opacity-70 font-mono text-[9px]">{msg.timestamp}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Box Langsung */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900 flex items-center space-x-2">
            <input 
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Ketik pesan balasan langsung ke ${selectedSession.userName}...`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
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
