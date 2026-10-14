import React, { useState } from 'react';
import { 
  MessageSquare, Send, User, Shield, CheckCheck, 
  Clock, Sparkles, Phone, HelpCircle, ChevronRight
} from 'lucide-react';
import { showToast } from '../../ToastNotification';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  time: string;
}

export default function CustomerMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'admin',
      text: 'Halo Bapak/Ibu Warga Desa Waru! Selamat datang di layanan Customer Service BUMDes Waskita Wijaya. Ada yang bisa kami bantu seputar reservasi lapangan, jadwal armada sampah, atau produk UMKM?',
      time: '08:30 WIB'
    },
    {
      id: 'msg-2',
      sender: 'user',
      text: 'Pagi admin, apakah untuk sewa lapangan GOR badminton malam ini masih ada lampu tambahan yang tersedia?',
      time: '08:35 WIB'
    },
    {
      id: 'msg-3',
      sender: 'admin',
      text: 'Semua lampu LED stadion dalam kondisi prima dan otomatis aktif untuk jadwal malam pukul 19:00 - 23:00 WIB. Jangan lupa scan QR tiket di pintu masuk ya!',
      time: '08:38 WIB'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: inputMsg,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');

    // Simulate quick automated BUMDes reply
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: 'msg-reply-' + Date.now(),
        sender: 'admin',
        text: 'Pesan Anda telah diterima oleh petugas piket BUMDes Waru. Kami akan membalas segera.',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[560px]">
      
      {/* Header Chat */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <span className="w-3 h-3 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full absolute -bottom-0.5 -right-0.5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Customer Service BUMDes Waskita Wijaya
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Pusat bantuan & komunikasi resmi warga Desa Waru, Baki
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/6282134567890?text=Halo%20Admin%20BUMDes%20Waru,%20saya%20warga%20ingin%20bertanya"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Chat via WhatsApp</span>
        </a>
      </div>

      {/* Messages List Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/40">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs rounded-tl-xs'
              }`}
            >
              <p className="leading-relaxed">{m.text}</p>
              <div
                className={`text-[10px] flex items-center justify-end gap-1 font-mono ${
                  m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                }`}
              >
                <span>{m.time}</span>
                {m.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Message Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Tulis pesan atau pertanyaan Anda kepada admin BUMDes..."
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-colors shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Kirim</span>
        </button>
      </form>

    </div>
  );
}
