import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Menu as MenuIcon, 
  Eye, 
  EyeOff, 
  Check, 
  Save, 
  AlertTriangle, 
  Bell, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Sliders, 
  Layers, 
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { PublicSiteConfig, SiteMenuConfig } from '../../types/admin';
import { recordAuditLog } from '../../services/adminService';
import { LOGO_OPTIONS } from '../logoData';

interface LiveSiteCustomizerProps {
  actorName: string;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

const DEFAULT_MENUS: SiteMenuConfig[] = [
  { id: 'm-1', label: 'Beranda', pageKey: 'home', visible: true, order: 1 },
  { id: 'm-2', label: 'Profil & Legalitas', pageKey: 'about', visible: true, order: 2 },
  { id: 'm-3', label: 'Layanan Terpadu', pageKey: 'services', visible: true, order: 3 },
  { id: 'm-4', label: 'Booking Lapangan', pageKey: 'lapangan', visible: true, order: 4 },
  { id: 'm-5', label: 'Sewa Aula Gedung', pageKey: 'gedung', visible: true, order: 5 },
  { id: 'm-6', label: 'Bank Sampah Digital', pageKey: 'waste', visible: true, order: 6 },
  { id: 'm-7', label: 'Pengumuman & Berita', pageKey: 'announcements', visible: true, order: 7 },
  { id: 'm-8', label: 'Kontak & Lokasi', pageKey: 'contact', visible: true, order: 8 }
];

const DEFAULT_CONFIG: PublicSiteConfig = {
  siteName: 'BUMDES Waskita Wijaya',
  contactWhatsApp: '6282134567890',
  runningAnnouncement: '📢 Selamat datang di Portal BUMDes Waskita Wijaya. Pemesanan Gedung & Lapangan Olahraga dapat dilakukan secara online 24 jam.',
  isAnnouncementActive: true,
  announcementType: 'info',
  onlineBookingActive: true,
  maintenanceMode: false,
  maintenanceNotice: 'Sistem sedang dalam proses pemeliharaan rutin dan pembaruan server. Layanan akan kembali aktif segera.',
  themeColor: 'emerald',
  updatedAt: new Date().toISOString()
};

export default function LiveSiteCustomizer({ actorName, onShowToast }: LiveSiteCustomizerProps) {
  const [config, setConfig] = useState<PublicSiteConfig>(DEFAULT_CONFIG);
  const [menus, setMenus] = useState<SiteMenuConfig[]>(DEFAULT_MENUS);
  const [selectedLogoId, setSelectedLogoId] = useState<string>(() => {
    return localStorage.getItem('bumdes_selected_logo') || 'option-b';
  });
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'menus' | 'theme' | 'announcement' | 'maintenance'>('menus');

  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('bumdes_public_config');
      if (savedConfig) setConfig(JSON.parse(savedConfig));

      const savedMenus = localStorage.getItem('bumdes_custom_menus');
      if (savedMenus) setMenus(JSON.parse(savedMenus));
    } catch (e) {}
  }, []);

  const handleSelectLogo = (logoId: string) => {
    setSelectedLogoId(logoId);
    localStorage.setItem('bumdes_selected_logo', logoId);
    window.dispatchEvent(new Event('bumdes-logo-updated'));
    onShowToast('Logo BUMDes berhasil diperbarui!', 'success');
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updatedConfig = { ...config, updatedAt: new Date().toISOString() };
      localStorage.setItem('bumdes_public_config', JSON.stringify(updatedConfig));
      localStorage.setItem('bumdes_custom_menus', JSON.stringify(menus));
      
      await recordAuditLog(actorName, 'superadmin', 'Kustomisasi Tampilan & Pengaturan Website Publik', 'siteSettings/customizer');
      onShowToast('Perubahan tampilan dan menu website berhasil disimpan!', 'success');
    } catch (e: any) {
      onShowToast('Gagal menyimpan perubahan', 'warning');
    } finally {
      setSaving(false);
    }
  };

  const toggleMenuVisibility = (id: string) => {
    setMenus(prev => prev.map(m => m.id === id ? { ...m, visible: !m.visible } : m));
  };

  const moveMenu = (index: number, direction: 'up' | 'down') => {
    const newMenus = [...menus];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newMenus.length) return;
    const temp = newMenus[index];
    newMenus[index] = newMenus[targetIndex];
    newMenus[targetIndex] = temp;
    // update order numbers
    newMenus.forEach((m, idx) => { m.order = idx + 1; });
    setMenus(newMenus);
  };

  const handleMenuLabelChange = (id: string, newLabel: string) => {
    setMenus(prev => prev.map(m => m.id === id ? { ...m, label: newLabel } : m));
  };

  return (
    <div className="space-y-6">
      {/* Header card with save button */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Editor Menu & Tampilan Website Langsung</h2>
          </div>
          <p className="text-xs text-slate-400">
            Kustomisasi susunan navigasi, teks pengumuman darurat, warna aksen tema, dan mode pemeliharaan website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Save className="w-4 h-4" />}
          <span>Simpan Perubahan Tampilan</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSection('menus')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSection === 'menus'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <MenuIcon className="w-4 h-4 text-emerald-400" />
          <span>Susunan Menu Navigasi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('announcement')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSection === 'announcement'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span>Banner Pengumuman</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('theme')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSection === 'theme'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Warna Aksen Tema</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('maintenance')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSection === 'maintenance'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Mode Pemeliharaan (Maintenance)</span>
        </button>
      </div>

      {/* SECTION 1: MENUS */}
      {activeSection === 'menus' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">Kelola Menu Navigasi Header & Footer</h3>
              <p className="text-xs text-slate-400">Atur urutan dan visibilitas tombol navigasi yang tampil di website publik.</p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
              {menus.filter(m => m.visible).length} Menu Aktif
            </span>
          </div>

          <div className="space-y-2 pt-2">
            {menus.map((menu, idx) => (
              <div 
                key={menu.id} 
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  menu.visible 
                    ? 'bg-slate-950/70 border-slate-800' 
                    : 'bg-slate-950/30 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1 mr-4">
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveMenu(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Geser ke Atas"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === menus.length - 1}
                      onClick={() => moveMenu(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Geser ke Bawah"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="w-6 text-center font-mono text-xs text-slate-500">{idx + 1}</span>

                  <input
                    type="text"
                    value={menu.label}
                    onChange={(e) => handleMenuLabelChange(menu.id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl focus:border-emerald-500 focus:outline-none flex-1 max-w-xs"
                  />

                  <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded-md hidden sm:inline">
                    #{menu.pageKey}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => toggleMenuVisibility(menu.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      menu.visible
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {menu.visible ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Tampil</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Disembunyikan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: ANNOUNCEMENT BANNER */}
      {activeSection === 'announcement' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-black text-white">Banner Pengumuman Berjalan (Top Ticker)</h3>
            <p className="text-xs text-slate-400">Pemberitahuan resmi yang muncul di bagian paling atas seluruh halaman website.</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Status Banner Pengumuman</span>
              <span className="text-[11px] text-slate-400">Tampilkan teks berjalan ke seluruh pengunjung website</span>
            </div>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, isAnnouncementActive: !prev.isAnnouncementActive }))}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                config.isAnnouncementActive ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  config.isAnnouncementActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Teks Pengumuman</label>
            <textarea
              rows={3}
              value={config.runningAnnouncement}
              onChange={(e) => setConfig(prev => ({ ...prev, runningAnnouncement: e.target.value }))}
              placeholder="Masukkan teks pengumuman yang akan berjalan di header..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Tipe / Nuansa Pengumuman</label>
            <div className="grid grid-cols-3 gap-3">
              {(['info', 'warning', 'promo'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, announcementType: type }))}
                  className={`p-3 rounded-2xl border text-xs font-bold capitalize transition-all cursor-pointer text-left ${
                    config.announcementType === type
                      ? 'bg-slate-800 border-emerald-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span>{type === 'info' ? 'Informasi Resmi' : type === 'warning' ? 'Peringatan / Darurat' : 'Promo / Event'}</span>
                    {config.announcementType === type && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {type === 'info' ? 'Warna Biru / Emerald' : type === 'warning' ? 'Warna Merah / Amber' : 'Warna Emas / Pink'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview of Banner */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-400">Pratinjau Banner:</span>
            <div className={`p-3 rounded-xl text-xs font-medium flex items-center space-x-2 ${
              config.announcementType === 'warning' 
                ? 'bg-amber-950/80 text-amber-200 border border-amber-800'
                : config.announcementType === 'promo'
                ? 'bg-purple-950/80 text-purple-200 border border-purple-800'
                : 'bg-emerald-950/80 text-emerald-200 border border-emerald-800'
            }`}>
              <Bell className="w-4 h-4 shrink-0" />
              <span className="truncate">{config.runningAnnouncement || 'Pengumuman kosong'}</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: THEME COLOR */}
      {activeSection === 'theme' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-black text-white">Pilihan Warna Aksen Utama Website</h3>
            <p className="text-xs text-slate-400">Menyesuaikan identitas visual desa yang mencerminkan karakter BUMDes Waskita Wijaya.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { key: 'emerald', label: 'Hijau Zamrud BUMDes', colorHex: '#10B981', desc: 'Standar resmi BUMDes (Kemakmuran & Pertanian)' },
              { key: 'blue', label: 'Biru Maritim & Air', colorHex: '#0284C7', desc: 'Modernitas, ketenangan, & tata kelola air desa' },
              { key: 'amber', label: 'Emas Kemakmuran', colorHex: '#F59E0B', desc: 'Energi ekonomi, UMKM lokal, & kejayaan warga' },
              { key: 'indigo', label: 'Indigo Kebangsaan', colorHex: '#6366F1', desc: 'Wibawa birokrasi profesional & pelayanan publik' }
            ].map((theme) => (
              <div
                key={theme.key}
                onClick={() => setConfig(prev => ({ ...prev, themeColor: theme.key as any }))}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  config.themeColor === theme.key
                    ? 'bg-slate-800 border-white/40 ring-2 ring-emerald-500 shadow-xl'
                    : 'bg-slate-950 border-slate-800 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: theme.colorHex }}>
                    {config.themeColor === theme.key && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{theme.colorHex}</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{theme.label}</h4>
                <p className="text-[11px] text-slate-400">{theme.desc}</p>
              </div>
            ))}
          </div>

          {/* Pilihan Desain Logo Resmi BUMDes */}
          <div className="pt-2 border-t border-slate-800 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-400" />
                <span>Pilihan Desain Logo Resmi BUMDes</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Pilih logo utama yang akan ditampilkan pada Navbar Header, Footer, dan Dokumen resmi website.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {LOGO_OPTIONS.map((opt) => {
                const isSelected = selectedLogoId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectLogo(opt.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500 shadow-xl'
                        : 'bg-slate-950 border-slate-800 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{opt.badge}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                      </div>
                      <div className="w-full aspect-square rounded-xl bg-white p-2 border border-slate-700 shadow-inner flex items-center justify-center overflow-hidden mb-3">
                        <img src={opt.src} alt={opt.name} className="w-full h-full object-contain" />
                      </div>
                      <h5 className="text-xs font-bold text-white mb-0.5">{opt.name}</h5>
                      <p className="text-[10px] text-emerald-400 font-semibold mb-1">{opt.tagline}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{opt.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectLogo(opt.id);
                      }}
                      className={`mt-3 w-full py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? '✓ Logo Aktif' : 'Terapkan Logo'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick contact config */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kontak & Saluran Cepat Publik</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Nomor WhatsApp Resmi BUMDes</label>
                <input
                  type="text"
                  value={config.contactWhatsApp}
                  onChange={(e) => setConfig(prev => ({ ...prev, contactWhatsApp: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Contoh: 6281234567890"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Nama Resmi di Header</label>
                <input
                  type="text"
                  value={config.siteName}
                  onChange={(e) => setConfig(prev => ({ ...prev, siteName: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: MAINTENANCE MODE */}
      {activeSection === 'maintenance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center space-x-3 text-rose-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="text-sm font-black text-white">Mode Pemeliharaan (Maintenance Mode)</h3>
              <p className="text-xs text-slate-400">Tutup akses publik sementara saat perbaikan atau audit keuangan tahunan.</p>
            </div>
          </div>

          <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-rose-200 block">Kunci Website Publik (Mode Pemeliharaan)</span>
              <span className="text-[11px] text-rose-300/70">Ketika aktif, pengunjung publik akan diarahkan ke layar perbaikan santun. Admin tetap bisa login via /admin.</span>
            </div>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                config.maintenanceMode ? 'bg-rose-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  config.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Pesan Pemeliharaan untuk Pengunjung</label>
            <textarea
              rows={3}
              value={config.maintenanceNotice}
              onChange={(e) => setConfig(prev => ({ ...prev, maintenanceNotice: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white focus:border-rose-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
