import React, { useState } from 'react';
import { 
  User, Edit3, Lock, ShieldCheck, Phone, MapPin, 
  Mail, Calendar, Save, CheckCircle2, Award, QrCode
} from 'lucide-react';
import { showToast } from '../../ToastNotification';
import { User as UserType } from '../../../types';

interface CustomerProfileEditProps {
  currentUser: UserType;
  onUpdateProfile?: (updated: Partial<UserType>) => void;
}

export default function CustomerProfileEdit({ currentUser, onUpdateProfile }: CustomerProfileEditProps) {
  const [profileTab, setProfileTab] = useState<'lihat-profil' | 'edit-profil' | 'keamanan'>('lihat-profil');

  // Form Edit Akun State
  const [fullName, setFullName] = useState(currentUser.name || 'Bpk. Hendra Gunawan');
  const [phone, setPhone] = useState(currentUser.phone || '081234567890');
  const [email, setEmail] = useState(currentUser.email || 'warga.waru@sukoharjo.go.id');
  const [nik, setNik] = useState(currentUser.nik || '3302198204910002');
  const [noKK, setNoKK] = useState('3302198204910015');
  const [dukuh, setDukuh] = useState('Dukuh Waru, RT 03 / RW 01');
  const [alamatLengkap, setAlamatLengkap] = useState('Jl. Dahlia No. 14, Desa Waru, Kec. Baki, Kab. Sukoharjo');

  // Password & Security State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast('Harap lengkapi nama dan nomor WhatsApp Anda!', 'warning');
      return;
    }

    if (onUpdateProfile) {
      onUpdateProfile({
        name: fullName,
        phone: phone,
        email: email,
        nik: nik
      });
    }

    setProfileTab('lihat-profil');
    showToast('Profil akun pelanggan berhasil diperbarui!', 'success');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      showToast('Harap isi kata sandi lama dan baru!', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi kata sandi baru tidak sesuai!', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Kata sandi minimal 6 karakter!', 'warning');
      return;
    }

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setProfileTab('lihat-profil');
    showToast('Kata sandi akun Anda telah berhasil diganti!', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-Nav Controls */}
      <div className="flex items-center justify-between p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setProfileTab('lihat-profil')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              profileTab === 'lihat-profil'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Akun Saya</span>
          </button>

          <button
            type="button"
            onClick={() => setProfileTab('edit-profil')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              profileTab === 'edit-profil'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Data Akun</span>
          </button>

          <button
            type="button"
            onClick={() => setProfileTab('keamanan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              profileTab === 'keamanan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Kata Sandi & Keamanan</span>
          </button>
        </div>

        <span className="hidden sm:inline-block text-xs font-mono text-emerald-600 font-bold px-3">
          ID: {currentUser.nasabahId || 'NSB-38290'}
        </span>
      </div>

      {/* VIEW 1: LIHAT PROFIL */}
      {profileTab === 'lihat-profil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Identity Pass Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 border border-emerald-800/60 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  KARTU WARGA TERDAFTAR
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600/30 border-2 border-emerald-400 text-white flex items-center justify-center font-black text-xl">
                  {fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{fullName}</h3>
                  <p className="text-xs text-emerald-200 font-mono">ID: {currentUser.nasabahId || 'NSB-38290'}</p>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    NIK: {nik.length >= 6 ? `${nik.substring(0, 4)}••••••••${nik.substring(nik.length - 2)}` : '••••••••'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>Status Keanggotaan:</span>
                <strong className="text-amber-400 font-bold">Member Terdaftar</strong>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Terdaftar Sejak:</span>
                <span className="text-white">10 Januari 2026</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Poin BUMDes:</span>
                <span className="text-emerald-400 font-bold">1.450 Poin</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setProfileTab('edit-profil')}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Perbarui Profil</span>
            </button>
          </div>

          {/* Details Table Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Rincian Informasi Data Kependudukan & Akun</span>
              </h4>
              <p className="text-xs text-slate-500">
                Data kependudukan sinkron dengan database Pemerintah Desa Waru, Kecamatan Baki.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">Nama Lengkap</span>
                <strong className="text-slate-900 dark:text-white text-sm">{fullName}</strong>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">Nomor Induk Kependudukan (NIK)</span>
                <strong className="text-slate-900 dark:text-white text-sm font-mono">
                  {nik.length >= 6 ? `${nik.substring(0, 4)}••••••••${nik.substring(nik.length - 2)}` : '••••••••'}
                </strong>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">Nomor Kartu Keluarga (KK)</span>
                <strong className="text-slate-900 dark:text-white text-sm font-mono">
                  {noKK.length >= 6 ? `${noKK.substring(0, 4)}••••••••${noKK.substring(noKK.length - 2)}` : '••••••••'}
                </strong>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">Nomor WhatsApp</span>
                <strong className="text-slate-900 dark:text-white text-sm font-mono">
                  {phone.length > 4 ? `${phone.substring(0, 4)}••••${phone.substring(phone.length - 2)}` : phone}
                </strong>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">Wilayah Dukuh / RT / RW</span>
                <strong className="text-slate-900 dark:text-white text-sm">{dukuh}</strong>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">Email Akun</span>
                <strong className="text-slate-900 dark:text-white text-sm">{email}</strong>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-xs">
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Alamat Domisili Lengkap</span>
              <p className="text-slate-800 dark:text-slate-200 mt-1">{alamatLengkap}</p>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: EDIT PROFIL */}
      {profileTab === 'edit-profil' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Perbarui Data</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">Edit Informasi Akun Pelanggan</h3>
            <p className="text-xs text-slate-500">
              Pastikan nomor WhatsApp dan alamat domisili selalu aktif untuk menerima konfirmasi booking dan penjemputan sampah.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nama Lengkap</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nomor WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Dukuh / RT / RW</label>
              <input
                type="text"
                required
                value={dukuh}
                onChange={(e) => setDukuh(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Alamat Domisili Lengkap</label>
              <textarea
                rows={3}
                required
                value={alamatLengkap}
                onChange={(e) => setAlamatLengkap(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProfileTab('lihat-profil')}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                className="flex-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan Akun</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 3: KEAMANAN & KATA SANDI */}
      {profileTab === 'keamanan' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm max-w-md mx-auto space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Keamanan Akun</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">Ganti Kata Sandi</h3>
            <p className="text-xs text-slate-500">
              Gunakan kombinasi minimal 6 huruf atau angka untuk mengamankan akses akun Anda.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Kata Sandi Saat Ini</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Kata Sandi Baru</label>
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Ulangi Kata Sandi Baru</label>
              <input
                type="password"
                required
                placeholder="Ketik ulang kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Perbarui Kata Sandi</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
