import React, { useState } from 'react';
import { User, Mail, Lock, LogIn, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthPageProps {
  onAuthSuccess: (user: UserType, token: string) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan sistem.');
      }

      // Success
      onAuthSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'Koneksi ke server gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="auth-container" className="py-20 bg-emerald-50/40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center px-4 min-h-[70vh]">
      <div className="max-w-md w-full blur-container border border-white/60 shadow-xl overflow-hidden p-0 bg-white/80">
        
        {/* Banner header */}
        <div className="bg-gradient-to-tr from-emerald-600 to-green-500 p-8 text-center text-white relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/20">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Portal Digital BUMDES</h2>
          <p className="text-xs text-emerald-100 mt-1">
            {isLogin ? 'Masuk ke Papan Kas Anda' : 'Buat akun warga baru secara gratis'}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100">
          <button
            id="auth-tab-login"
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`w-1/2 py-4 text-center text-sm font-bold transition-all ${
              isLogin 
                ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/20' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Masuk Portal
          </button>
          <button
            id="auth-tab-register"
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`w-1/2 py-4 text-center text-sm font-bold transition-all ${
              !isLogin 
                ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/20' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Buat Akun Baru
          </button>
        </div>

        {/* Input Form Body */}
        <div className="p-8 space-y-6 text-left">
          
          {error && (
            <div id="auth-error-badge" className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl flex items-start space-x-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="leading-normal">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label htmlFor="auth-email" className="text-xs font-semibold text-slate-700">Alamat Email *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="auth-email"
                  required
                  placeholder="contoh: warga@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="auth-password" className="text-xs font-semibold text-slate-700">Kata Sandi *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="auth-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="auth-submit-btn"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-emerald-100 hover:shadow-lg transition-all disabled:opacity-75 cursor-pointer pt-3 pb-3"
            >
              {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{isLoading ? 'Memproses...' : isLogin ? 'Masuk Portal' : 'Daftar Akun'}</span>
            </button>

          </form>

          {/* Secure Portal Information */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            {isLogin ? (
              <p>
                Belum memiliki akun warga? Klik tab <strong>Buat Akun Baru</strong> untuk mendaftar secara mandiri.
              </p>
            ) : (
              <p>
                Sudah memiliki akun terdaftar? Silakan beralih ke tab <strong>Masuk Portal</strong>.
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
