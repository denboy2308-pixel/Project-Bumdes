import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Save, 
  CheckCircle, 
  Eye, 
  Share2, 
  Code, 
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { MetaSEOSettings, AdminUser } from '../../types/admin';
import { getMetaSEOSettings, saveMetaSEOSettings, DEFAULT_META_SEO } from '../../services/adminService';

interface MetaSEOManagerProps {
  currentUser: AdminUser;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function MetaSEOManager({ currentUser, onShowToast }: MetaSEOManagerProps) {
  const [seo, setSeo] = useState<MetaSEOSettings>(DEFAULT_META_SEO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activePreview, setActivePreview] = useState<'google' | 'whatsapp' | 'code'>('google');

  useEffect(() => {
    loadSEO();
  }, []);

  const loadSEO = async () => {
    setLoading(true);
    try {
      const data = await getMetaSEOSettings();
      setSeo(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveMetaSEOSettings(seo, currentUser.name);
      onShowToast('Konfigurasi Meta SEO berhasil disimpan dan disinkronkan ke website publik!', 'success');
    } catch (err: any) {
      onShowToast(err.message || 'Gagal menyimpan konfigurasi SEO', 'warning');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan konfigurasi Meta SEO ke pengaturan standar BUMDes?')) {
      setSeo(DEFAULT_META_SEO);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[350px] space-y-3">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Memuat konfigurasi Meta SEO dari Cloud Firestore...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Manajemen Meta SEO & Tampilan Google</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                SEO Engine v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Atur bagaimana website BUMDes muncul di hasil pencarian Google, thumbnail WhatsApp, dan media sosial secara real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Reset Standar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan & Terapkan Live</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 7 Columns */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Judul Halaman Web (Page Title)</span>
              <span className="text-[10px] text-slate-500 font-mono">{seo.siteTitle.length}/65 karakter (disarankan ~60)</span>
            </label>
            <input
              type="text"
              value={seo.siteTitle}
              onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="BUMDES Waskita Wijaya - Desa Waru, Sukoharjo"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Deskripsi Penelusuran (Meta Description)</span>
              <span className="text-[10px] text-slate-500 font-mono">{seo.metaDescription.length}/160 karakter</span>
            </label>
            <textarea
              rows={3}
              value={seo.metaDescription}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Deskripsi singkat yang muncul di bawah judul Google..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Kata Kunci SEO (Keywords)
              </label>
              <input
                type="text"
                value={seo.metaKeywords}
                onChange={(e) => setSeo({ ...seo, metaKeywords: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="sewa lapangan, bumdes waru, gedung baki"
              />
              <span className="text-[10px] text-slate-500 block">Pisahkan dengan tanda koma</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                URL Resmi (Canonical URL)
              </label>
              <input
                type="url"
                value={seo.canonicalUrl}
                onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="https://bumdeswaskitawijaya.desa.id"
              />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pengaturan Open Graph (WhatsApp, Facebook, Twitter)</span>
            </h4>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Judul Kartu Berbagi (OG Title)
              </label>
              <input
                type="text"
                value={seo.ogTitle}
                onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="Judul saat dibagikan ke WA"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                URL Gambar Pratinjau (OG Image)
              </label>
              <input
                type="url"
                value={seo.ogImageUrl}
                onChange={(e) => setSeo({ ...seo, ogImageUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="https://domain.com/thumbnail-banner.jpg"
              />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Indeks Mesin Pencari (Robots)
              </label>
              <select
                value={seo.robotsIndexing}
                onChange={(e) => setSeo({ ...seo, robotsIndexing: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="index, follow">Izinkan Google Mengindeks (index, follow)</option>
                <option value="noindex, follow">Sembunyikan Sementara (noindex, follow)</option>
                <option value="noindex, nofollow">Blokir Total Mesin Pencari (noindex, nofollow)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Google Search Console Verification
              </label>
              <input
                type="text"
                value={seo.googleSearchConsoleId || ''}
                onChange={(e) => setSeo({ ...seo, googleSearchConsoleId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                placeholder="gsc-verify-code"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Simpan Perubahan Meta SEO ke Database</span>
            </button>
          </div>
        </form>

        {/* Right Preview Simulator: 5 Columns */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Simulator Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActivePreview('google')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activePreview === 'google' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Google SERP</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePreview('whatsapp')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activePreview === 'whatsapp' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Card</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePreview('code')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activePreview === 'code' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HTML Head</span>
            </button>
          </div>

          {/* Preview Container */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Simulasi Tampilan Langsung</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/50">
                Live Preview
              </span>
            </div>

            {/* 1. Google SERP Simulator */}
            {activePreview === 'google' && (
              <div className="bg-white rounded-xl p-4 text-slate-900 font-sans shadow-md space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">
                    W
                  </div>
                  <span className="font-semibold text-slate-700 truncate">{seo.canonicalUrl.replace('https://', '')}</span>
                  <span className="text-slate-400">›</span>
                  <span className="text-slate-500">beranda</span>
                </div>
                <h4 className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2">
                  {seo.siteTitle || 'Judul Halaman Belum Diatur'}
                </h4>
                <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-3">
                  {seo.metaDescription || 'Deskripsi halaman pencarian Google akan muncul di sini...'}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[10px] text-emerald-700 font-medium">
                  <span className="bg-emerald-50 px-2 py-0.5 rounded">✓ Resmi Desa Waru</span>
                  <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-700">HTTPS Aman</span>
                </div>
              </div>
            )}

            {/* 2. WhatsApp Share Card Simulator */}
            {activePreview === 'whatsapp' && (
              <div className="bg-[#0b141a] p-3 rounded-xl border border-slate-800">
                <div className="bg-[#1f2c34] rounded-xl overflow-hidden border border-[#2a3942] max-w-sm mx-auto shadow-md">
                  {seo.ogImageUrl && (
                    <img 
                      src={seo.ogImageUrl} 
                      alt="Thumbnail Preview" 
                      className="w-full h-36 object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback image if broken
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                  )}
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {seo.canonicalUrl.replace('https://', '').split('/')[0]}
                    </span>
                    <h5 className="text-xs font-bold text-white line-clamp-2">
                      {seo.ogTitle || seo.siteTitle}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {seo.ogDescription || seo.metaDescription}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. HTML Head Code View */}
            {activePreview === 'code' && (
              <pre className="bg-slate-950 p-3 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed border border-slate-800">
{`<!-- Meta SEO Output Otomatis -->
<title>${seo.siteTitle}</title>
<meta name="description" content="${seo.metaDescription}" />
<meta name="keywords" content="${seo.metaKeywords}" />
<meta name="robots" content="${seo.robotsIndexing}" />
<link rel="canonical" href="${seo.canonicalUrl}" />

<!-- Open Graph Social Tags -->
<meta property="og:title" content="${seo.ogTitle || seo.siteTitle}" />
<meta property="og:description" content="${seo.ogDescription || seo.metaDescription}" />
<meta property="og:image" content="${seo.ogImageUrl}" />
<meta property="og:url" content="${seo.canonicalUrl}" />
<meta name="author" content="${seo.author}" />`}
              </pre>
            )}

            {/* Last Update Stamp */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span>Terakhir disinkronkan: {new Date(seo.updatedAt).toLocaleString('id-ID')}</span>
              <span>Oleh: {seo.updatedBy || 'SuperAdmin'}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
