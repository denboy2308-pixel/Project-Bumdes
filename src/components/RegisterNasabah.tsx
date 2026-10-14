import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  FileText, 
  MapPin, 
  Phone, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  ArrowLeft, 
  Info,
  QrCode,
  CreditCard,
  Download,
  Check,
  Camera,
  Upload,
  Trash2,
  Image,
  ShieldCheck,
  X
} from 'lucide-react';
import { PageType, User as UserType } from '../types';

interface RegisterNasabahProps {
  onBackToHome: () => void;
  onAuthSuccess: (user: UserType, token: string) => void;
}

export default function RegisterNasabah({ onBackToHome, onAuthSuccess }: RegisterNasabahProps) {
  // Form State
  const [jenisNasabah, setJenisNasabah] = useState<'Perorangan' | 'UMKM' | 'Lembaga'>('Perorangan');
  const [nik, setNik] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('Laki-laki');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  const [village, setVillage] = useState('Waru');
  const [subdistrict, setSubdistrict] = useState('Baki');
  const [city, setCity] = useState('Sukoharjo');
  const [selectedUnit, setSelectedUnit] = useState('Bank Sampah Waskita Wijaya Utama (RT 02 / RW 03)');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeLegalModal, setActiveLegalModal] = useState<'terms' | 'privacy' | null>(null);
  
  // File Upload State & Handlers
  const [fotoBangunan, setFotoBangunan] = useState<string | null>(null);
  const [fotoBangunanName, setFotoBangunanName] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setFotoBangunanName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBangunan(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError('File yang diunggah harus berupa gambar (JPEG, PNG, dll).');
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFotoBangunan(null);
    setFotoBangunanName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Camera State & Handlers
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
          return () => {
                  cameraStream?.getTracks().forEach((track) => track.stop());
          };
            }, [cameraStream]);
          
    

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      setError(null);
      // Wait for video ref to mount, then set source
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setError('Gagal mengakses kamera. Silakan periksa izin kamera pada browser Anda.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setFotoBangunan(dataUrl);
        setFotoBangunanName(`foto_kamera_${Date.now()}.jpg`);
        stopCamera();
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);
  
  // UI State
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validations
    if (nik.length !== 16) {
      setError('NIK harus berjumlah tepat 16 digit angka.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi harus minimal 6 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Submit email, password and rich resident profile to the real API register endpoint
      const fullAddressStr = `${address}, RT ${rt} / RW ${rw}, Desa ${village}, Kec. ${subdistrict}, ${city}`;
      const zoneStr = `RT ${rt} / RW ${rw} Desa ${village}`;

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          name: fullName,
          phone,
          nik,
          address: fullAddressStr,
          zone: zoneStr
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat membuat akun pengguna.');
      }

      // 2. Registration is successful on the backend
      // Save all other rich metadata into a simulated state
      setRegisteredUser({
        nik,
        fullName,
        phone,
        email,
        address: `${address}, RT ${rt} / RW ${rw}, Desa ${village}, Kec. ${subdistrict}, ${city}`,
        unit: selectedUnit,
        jenisNasabah,
        fotoBangunan,
        noNasabah: 'NSB-' + Math.floor(100000 + Math.random() * 900000),
        registerDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        token: data.token,
        user: data.user
      });

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Koneksi ke server gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartUsing = () => {
    if (registeredUser) {
      onAuthSuccess(registeredUser.user, registeredUser.token);
    }
  };

  if (isSuccess && registeredUser) {
    return (
      <div id="register-success-view" className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-center animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8 md:p-12 space-y-8 max-w-2xl mx-auto">
          
          {/* Animated Success Badge */}
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Pendaftaran Nasabah Berhasil!</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Selamat! Akun Anda pada Unit Usaha "Layanan Pengelolaan Sampah Desa" telah aktif di sistem BUMDES Waskita Wijaya Desa Waru.
            </p>
          </div>

          {/* Interactive Digital Member Card */}
          <div className="border border-slate-100 bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl p-6 text-white text-left relative overflow-hidden shadow-lg shadow-emerald-950/20 max-w-md mx-auto">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                  Kartu Anggota Digital
                </span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                  Nasabah {registeredUser.jenisNasabah}
                </span>
                <h4 className="font-bold text-sm tracking-wide mt-1.5 uppercase text-emerald-100">BUMDES WASKITA WIJAYA</h4>
                <p className="text-[8px] text-emerald-300/80">Desa Waru, Kec. Baki, Sukoharjo</p>
              </div>
              <Building2 className="w-8 h-8 text-white/30" />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[9px] text-emerald-300 uppercase tracking-wider">Nomor Nasabah</p>
                <p className="text-lg font-mono font-bold tracking-wider">{registeredUser.noNasabah}</p>
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex-1 space-y-3 min-w-0">
                  <div>
                    <p className="text-[9px] text-emerald-300 uppercase tracking-wider">Nama Lengkap</p>
                    <p className="text-xs font-bold truncate">{registeredUser.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-emerald-300 uppercase tracking-wider">NIK Kependudukan</p>
                    <p className="text-xs font-mono truncate">
                      {registeredUser.nik && registeredUser.nik.length >= 6 
                        ? `${registeredUser.nik.substring(0, 4)}••••••••${registeredUser.nik.substring(registeredUser.nik.length - 2)}` 
                        : '••••••••'}
                    </p>
                  </div>
                </div>
                {registeredUser.fotoBangunan && (
                  <div className="shrink-0 w-16 h-20 rounded-xl border border-white/20 overflow-hidden bg-emerald-950/40 relative shadow-md">
                    <img 
                      src={registeredUser.fotoBangunan} 
                      alt="Foto Bangunan" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-emerald-950/80 py-0.5 text-center text-[6px] text-white tracking-wider font-extrabold uppercase">FOTO</div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center gap-4">
                <div>
                  <p className="text-[8px] text-emerald-300/80">Unit Terdaftar: <span className="font-semibold text-white">{registeredUser.unit.split('(')[0]}</span></p>
                  <p className="text-[8px] text-emerald-300/80">Terdaftar Sejak: <span className="font-semibold text-white">{registeredUser.registerDate}</span></p>
                </div>
                <div className="bg-white p-1 rounded">
                  <QrCode className="w-8 h-8 text-slate-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={handleStartUsing}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Masuk Ke Papan Kas Saya</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Cetak Kartu</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div id="register-nasabah-container" className="bg-slate-50 min-h-screen pb-16">
      
      {/* Top Banner Government Styled like dinaslhdki.id but sleek & modern */}
      <div className="bg-white border-b border-slate-200 py-4 shadow-sm shrink-0">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <button 
            onClick={onBackToHome}
            className="flex items-center space-x-1.5 text-slate-500 hover:text-emerald-600 text-xs font-bold transition-colors self-start md:self-auto cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI KE BERANDA</span>
          </button>
          <div className="text-center md:text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Daftar Nasabah Sampah</p>
            <h1 className="text-sm font-bold text-emerald-800 mt-1 uppercase tracking-tight">UNIT USAHA "LAYANAN PENGELOLAAN SAMPAH DESA"</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Form Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 md:p-8 text-white text-left relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Formulir Daftar Nasabah Sampah Baru</h2>
                <p className="text-xs text-emerald-200 mt-1">
                  Isilah data kependudukan Anda secara valid untuk mendaftarkan akun nasabah pengelolaan sampah digital.
                </p>
              </div>
              <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 flex items-center space-x-2 text-xs">
                <Info className="w-4 h-4 text-emerald-300" />
                <span className="font-semibold text-emerald-100">Gratis & Cepat</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="m-6 md:m-8 mb-0 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl flex items-start space-x-2.5 text-left">
              <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 rotate-180" />
              <p className="leading-normal font-semibold">{error}</p>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleRegister} className="p-6 md:p-8 space-y-8 text-left">
            
            {/* Section 1: Kependudukan (NIK & Nama) */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">1</div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Identitas Kependudukan</h3>
              </div>

              {/* Pilihan Jenis Nasabah */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Pilih Jenis Nasabah *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setJenisNasabah('Perorangan')}
                    className={`p-4 rounded-xl border flex flex-col items-start text-left transition-all relative overflow-hidden cursor-pointer ${
                      jenisNasabah === 'Perorangan'
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className={`p-1.5 rounded-lg ${jenisNasabah === 'Perorangan' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        <User className="w-4 h-4" />
                      </div>
                      {jenisNasabah === 'Perorangan' && (
                        <div className="w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-bold mt-3 block ${jenisNasabah === 'Perorangan' ? 'text-emerald-800' : 'text-slate-700'}`}>Perorangan</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 leading-normal">Untuk warga desa perorangan / rumah tangga biasa.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setJenisNasabah('UMKM')}
                    className={`p-4 rounded-xl border flex flex-col items-start text-left transition-all relative overflow-hidden cursor-pointer ${
                      jenisNasabah === 'UMKM'
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className={`p-1.5 rounded-lg ${jenisNasabah === 'UMKM' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      {jenisNasabah === 'UMKM' && (
                        <div className="w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-bold mt-3 block ${jenisNasabah === 'UMKM' ? 'text-emerald-800' : 'text-slate-700'}`}>UMKM</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 leading-normal">Untuk pelaku usaha mikro, warung, toko, atau industri rumahan.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setJenisNasabah('Lembaga')}
                    className={`p-4 rounded-xl border flex flex-col items-start text-left transition-all relative overflow-hidden cursor-pointer ${
                      jenisNasabah === 'Lembaga'
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className={`p-1.5 rounded-lg ${jenisNasabah === 'Lembaga' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      {jenisNasabah === 'Lembaga' && (
                        <div className="w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-bold mt-3 block ${jenisNasabah === 'Lembaga' ? 'text-emerald-800' : 'text-slate-700'}`}>Lembaga</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 leading-normal">Untuk sekolah, tempat ibadah, instansi RT/RW, atau yayasan.</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Nomor Induk Kependudukan (NIK) Sesuai KTP *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      placeholder="Masukkan 16 digit NIK"
                      value={nik}
                      onChange={(e) => setNik(e.target.value.replace(/[^0-49:5-9]/g, ''))} // only digits
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-medium">NIK harus terdaftar resmi di Dispendukcapil Kabupaten Sukoharjo.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Nama Lengkap Sesuai KTP *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: BUDI SANTOSO"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 font-bold tracking-wide"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Tempat Lahir *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sukoharjo"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Tanggal Lahir *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Jenis Kelamin *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('Laki-laki')}
                      className={`py-3 text-xs font-bold rounded-xl border text-center transition-all ${
                        gender === 'Laki-laki' 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Laki-laki
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('Perempuan')}
                      className={`py-3 text-xs font-bold rounded-xl border text-center transition-all ${
                        gender === 'Perempuan' 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Perempuan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Kontak & Domisili */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">2</div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Kontak & Alamat Domisili</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Nomor WhatsApp Aktif *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-49:5-9]/g, ''))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-medium">Laporan setoran & rincian saldo bulanan akan dikirim via WA otomatis.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Alamat Email Aktif *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Contoh: budi@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Alamat Jalan / Dukuh Sesuai KTP *</label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 text-slate-400 pointer-events-none">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <textarea
                    required
                    rows={2}
                    placeholder="Contoh: Jl. Mawar No. 15, Dukuh Tegalsari"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 leading-normal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-bold text-slate-700 block">RT *</label>
                  <input
                    type="text"
                    required
                    placeholder="02"
                    value={rt}
                    onChange={(e) => setRt(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 text-center font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-bold text-slate-700 block">RW *</label>
                  <input
                    type="text"
                    required
                    placeholder="03"
                    value={rw}
                    onChange={(e) => setRw(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 text-center font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-slate-700 block">Desa/Kelurahan *</label>
                  <input
                    type="text"
                    required
                    disabled
                    value={village}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-bold"
                  />
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-bold text-slate-700 block">Kecamatan *</label>
                  <input
                    type="text"
                    required
                    disabled
                    value={subdistrict}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-bold"
                  />
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-bold text-slate-700 block">Kabupaten *</label>
                  <input
                    type="text"
                    required
                    disabled
                    value={city}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-bold"
                  />
                </div>
              </div>

              {/* Foto Depan Bangunan */}
              <div className="space-y-2 mt-4">
                <label className="text-xs font-bold text-slate-700 block">Foto Depan Bangunan / Rumah Tempat Tinggal *</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all relative overflow-hidden ${
                    dragActive 
                      ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]' 
                      : (fotoBangunan || isCameraActive) 
                        ? 'border-emerald-500 bg-slate-50' 
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                    id="foto-bangunan-upload"
                  />
                  
                  {isCameraActive ? (
                    <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl flex flex-col justify-end aspect-video">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      
                      {/* Live Camera Indicators & Buttons */}
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        <span>LIVE KAMERA</span>
                      </div>
                      
                      <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex justify-between items-center gap-4">
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                        
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="w-14 h-14 rounded-full bg-white hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center shadow-lg cursor-pointer"
                          title="Ambil Foto Sekarang"
                        >
                          <div className="w-11 h-11 rounded-full border-2 border-emerald-600 bg-transparent flex items-center justify-center">
                            <div className="w-7 h-7 rounded-full bg-emerald-600"></div>
                          </div>
                        </button>
                        
                        <div className="w-16"></div> {/* Spacer to center the capture button */}
                      </div>
                    </div>
                  ) : !fotoBangunan ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                      <div className="flex gap-4">
                        {/* Direct Camera Button (User wants this logo to access the camera directly) */}
                        <button
                          type="button"
                          onClick={startCamera}
                          className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-md shadow-emerald-100 cursor-pointer"
                          title="Buka Kamera Langsung"
                        >
                          <Camera className="w-8 h-8" />
                        </button>
                        
                        {/* Alternative File Upload Icon Button */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200/80 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-sm cursor-pointer"
                          title="Unggah Foto dari Berkas"
                        >
                          <Upload className="w-7 h-7" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700">
                          Klik <span className="text-emerald-600 font-extrabold">Logo Kamera</span> untuk ambil foto langsung, atau{' '}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-emerald-600 hover:text-emerald-700 font-extrabold focus:outline-none underline cursor-pointer"
                          >
                            pilih berkas
                          </button>
                        </p>
                        <p className="text-[10px] text-slate-400">Tarik & lepas berkas foto di sini • Format JPG, PNG, WEBP (Maksimal 5MB)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center gap-6 py-2">
                      <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-slate-200 shadow-md shrink-0 bg-slate-100">
                        <img 
                          src={fotoBangunan} 
                          alt="Pratinjau Bangunan" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1 right-1 bg-emerald-600 text-white p-1 rounded-full shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="text-center md:text-left flex-1 min-w-0 space-y-2">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-700 truncate">{fotoBangunanName || 'foto_bangunan.jpg'}</p>
                          <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-center md:justify-start gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Gambar berhasil dimuat</span>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          <button
                            type="button"
                            onClick={startCamera}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[11px] transition-colors flex items-center space-x-1 shadow-sm cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Ambil Ulang</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-[11px] transition-colors flex items-center space-x-1 shadow-sm cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Unggah Berkas</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold rounded-lg text-[11px] transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Unit Bank Sampah & Keamanan */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">3</div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Pilihan Unit & Keamanan Akun</h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Pilih Unit Wilayah Layanan Pengelolaan Sampah Terdekat *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 font-bold"
                  >
                    <option value="Layanan Pengelolaan Sampah Waskita Wijaya Utama (RT 02 / RW 03)">Layanan Pengelolaan Sampah Waskita Wijaya Utama (RT 02 / RW 03)</option>
                    <option value="Layanan Pengelolaan Sampah Unit 01 Waru (RT 01 / RW 01)">Layanan Pengelolaan Sampah Unit 01 Waru (RT 01 / RW 01)</option>
                    <option value="Layanan Pengelolaan Sampah Unit 02 Waru (RT 04 / RW 02)">Layanan Pengelolaan Sampah Unit 02 Waru (RT 04 / RW 02)</option>
                    <option value="Layanan Pengelolaan Sampah Unit 03 Waru (RT 03 / RW 04)">Layanan Pengelolaan Sampah Unit 03 Waru (RT 03 / RW 04)</option>
                  </select>
                </div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  Pilih unit lokasi penjemputan sampah yang paling dekat dengan rumah tinggal Anda.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Kata Sandi Baru *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Konfirmasi Kata Sandi Baru *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="Masukkan ulang kata sandi"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and conditions statement */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start space-x-3 text-xs text-slate-500 leading-relaxed text-left">
              <FileText className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p>
                  Dengan mengklik tombol pendaftaran di bawah, saya menyatakan bahwa seluruh data kependudukan (NIK, Nama, dan Alamat) yang dimasukkan adalah benar, sah, dan sesuai dengan dokumen identitas resmi KTP Desa Waru, Kabupaten Sukoharjo.
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-[11px] font-semibold">
                  <span className="text-slate-600">Saya telah membaca dan menyetujui:</span>
                  <button
                    type="button"
                    onClick={() => setActiveLegalModal('terms')}
                    className="text-emerald-700 hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <span>Syarat & Ketentuan Layanan</span>
                  </button>
                  <span className="text-slate-400">&bull;</span>
                  <button
                    type="button"
                    onClick={() => setActiveLegalModal('privacy')}
                    className="text-emerald-700 hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <span>Kebijakan Privasi (UU PDP No. 27/2022)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Dialog for Legal Review */}
            {activeLegalModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl text-left space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-900">
                        {activeLegalModal === 'terms' ? 'Syarat & Tata Tertib Nasabah BUMDes' : 'Kebijakan Perlindungan Data Pribadi'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveLegalModal(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {activeLegalModal === 'terms' ? (
                    <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
                      <p><strong>1. Keabsahan Data:</strong> Calon nasabah wajib berdomisili di Desa Waru, Kec. Baki atau memiliki tempat usaha aktif di wilayah Desa Waru.</p>
                      <p><strong>2. Penimbangan & Saldo:</strong> Setiap kilogram sampah anorganik yang disetorkan ditimbang menggunakan timbangan digital resmi BUMDes dan otomatis masuk ke saldo tabungan kas.</p>
                      <p><strong>3. Retribusi & Cashback RT:</strong> Iuran sampah rumah tangga Rp 25.000/bulan mencakup alokasi kas RT Rp 5.000/bulan untuk kesejahteraan warga lingkungan.</p>
                      <p><strong>4. Penarikan Saldo:</strong> Saldo kas nasabah dapat dicairkan tunai sewaktu-waktu di loket teller BUMDes tanpa potongan biaya penutupan.</p>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
                      <p><strong>1. Kepatuhan Regulasi:</strong> Pengelolaan data pribadi nasabah tunduk pada UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).</p>
                      <p><strong>2. Batas Penggunaan:</strong> NIK, nomor WhatsApp, dan alamat rumah warga hanya digunakan untuk administrasi bank sampah, penjemputan armada, dan penyaluran bagi hasil RT.</p>
                      <p><strong>3. Jaminan Keamanan:</strong> BUMDES Waskita Wijaya menjamin data tidak akan diperjualbelikan kepada pihak komersial manapun.</p>
                      <p><strong>4. Hak Warga:</strong> Nasabah berhak memperbarui nomor telepon atau memohon penutupan akun kapan saja melalui kantor sekretariat BUMDes.</p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveLegalModal(null)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Saya Mengerti
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-sm transition-colors text-center cursor-pointer"
              >
                Batalkan & Kembali
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-100 hover:shadow-lg transition-all disabled:opacity-75 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Memproses Pendaftaran...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Daftar Sebagai Nasabah Baru</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
}
