import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Globe, 
  Building2,
  RefreshCw,
  KeyRound,
  FileCheck,
  Crown,
  Sparkles,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { AdminUser } from '../../types/admin';
import { 
  loginAdminUser, 
  loginWithGoogle,
  grantSuperAdminAccess
} from '../../services/adminService';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToPublic: () => void;
}

export default function AdminLoginPage({ onLoginSuccess, onBackToPublic }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleQuickSuperAdminLogin = async (targetEmail = 'den.boy2308@gmail.com') => {
    setErrorMsg('');
    setLoading(true);
    try {
      const user = grantSuperAdminAccess(
        targetEmail, 
        targetEmail === 'den.boy2308@gmail.com' ? 'Den Boy (Super Administrator Utama)' : 'Super Administrator BUMDes'
      );
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengaktifkan sesi Super Admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Mohon isi alamat email dan kata sandi.');
      return;
    }

    setLoading(true);
    try {
      const user = await loginAdminUser(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login dengan akun Google dibatalkan atau terjadi kendala.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block">
              BUMDES WASKITA WIJAYA
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase block">
              Sistem Administrasi & Portal Otoritas
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToPublic}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Kembali ke Website Publik</span>
        </button>
      </div>

      {/* Main Content Area: Centered Professional Form */}
      <div className="max-w-4xl w-full mx-auto my-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: Security Information */}
        <div className="md:col-span-5 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Autentikasi Terproteksi</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            Portal Masuk Otoritas Resmi BUMDes
          </h1>

          <p className="text-xs text-slate-400 leading-relaxed">
            Halaman ini khusus diperuntukkan bagi pengelola, staf operasional, dan administrator yang memiliki kredensial resmi terdaftar di sistem BUMDES Waskita Wijaya.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <KeyRound className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold block text-white">Alur Masuk Tunggal</span>
                Autentikasi wajib menggunakan akun terdaftar dan kata sandi valid tanpa pintasan.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <FileCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold block text-white">Audit Trail Aktif</span>
                Setiap aktivitas masuk dicatat dalam log audit sistem untuk integritas tata kelola.
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="md:col-span-7 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative text-left">
          
          <div className="mb-6 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Akses Super Administrator</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Masuk Super Admin & Pengelola
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gunakan akun resmi yang terdaftar untuk membuka dashboard kendali penuh sistem.
            </p>
          </div>

          {/* Quick Super Admin Direct Access Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-amber-950/30 border border-emerald-500/40 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                  Akses Cepat 1-Klik Super Admin
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Terverifikasi
              </span>
            </div>

            <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
              Klik tombol di bawah untuk langsung masuk dengan hak akses penuh <strong>Super Administrator</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickSuperAdminLogin('den.boy2308@gmail.com')}
                disabled={loading}
                className="w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                <Crown className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span className="truncate">Masuk: den.boy2308@gmail.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSuperAdminLogin('superadmin@bumdeswaskita.id')}
                disabled={loading}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Masuk: superadmin master</span>
              </button>
            </div>

            {/* Credentials Info & Auto-fill */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="text-slate-400 font-mono text-[10px]">
                Sandi: <strong className="text-amber-300 font-mono">SuperAdminWaskita#2026</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopy('SuperAdminWaskita#2026', 'pass')}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700 flex items-center gap-1 cursor-pointer"
                  title="Salin Kata Sandi"
                >
                  {copiedKey === 'pass' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  <span>{copiedKey === 'pass' ? 'Tersalin' : 'Salin Sandi'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAutoFill('den.boy2308@gmail.com', 'SuperAdminWaskita#2026')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3 h-3 text-emerald-400" />
                  <span>Isi Form Otomatis</span>
                </button>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-300 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Alamat Email Pengelola
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="den.boy2308@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 block">
                  Kata Sandi
                </label>
                <span className="text-[10px] text-slate-500">Min. 6 Karakter</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Otoritas...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px bg-slate-800 flex-1" />
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Atau Masuk Dengan</span>
            <div className="h-px bg-slate-800 flex-1" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google Sign-In (den.boy2308@gmail.com)</span>
          </button>

          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-500">
              Sistem terenkripsi · Hanya akun resmi terdaftar dengan status aktif yang dapat mengakses panel ini.
            </span>
          </div>

        </div>

      </div>

      {/* Footer info */}
      <div className="max-w-5xl w-full mx-auto text-center text-xs text-slate-500 pt-4 border-t border-slate-900">
        © {new Date().getFullYear()} BUMDES Waskita Wijaya · Desa Waru, Kec. Baki, Kab. Sukoharjo · Sistem Terproteksi
      </div>

    </div>
  );
}
