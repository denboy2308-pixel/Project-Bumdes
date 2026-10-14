import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Calendar, 
  User, 
  Tag, 
  Sparkles,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { CmsArticle } from '../../types/admin';
import { recordAuditLog } from '../../services/adminService';

interface CmsModuleProps {
  actorName: string;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

const SEED_ARTICLES: CmsArticle[] = [
  {
    id: 'art-1',
    title: 'Penyaluran Hasil Laba Bersih BUMDes Waru untuk Pendapatan Asli Desa (PADes) 2026',
    category: 'PADes & Keuangan',
    summary: 'BUMDes Waskita Wijaya resmi menyerahkan dividen laba operasional tahun berjalan sebesar Rp 85.000.000,- kepada Pemerintah Desa Waru.',
    content: 'Pemerintah Desa Waru bersama pengurus BUMDes Waskita Wijaya menggelar musyawarah tahunan terkait transparansi penerimaan laba bersih unit usaha lapangan futsal, aula serbaguna, dan pengelolaan sampah terpadu. Dana disalurkan untuk perbaikan drainase dusun dan beasiswa pelajar berprestasi.',
    author: 'Tri Handoko (Super Admin)',
    publishedDate: '02 September 2026',
    status: 'published'
  },
  {
    id: 'art-2',
    title: 'Jadwal Pembersihan & Perawatan Rutin Lantai Kayu Lapangan Bulutangkis',
    category: 'Berita BUMDes',
    summary: 'Perawatan berkala lantai vinyl & kayu pro lapangan badminton untuk menjaga kenyamanan dan keselamatan atlet lokal.',
    content: 'Diberitahukan kepada seluruh anggota PB dan masyarakat umum bahwa setiap hari Senin pagi pukul 06.00-10.00 WIB, lapangan akan disterilisasi dan dipel menggunakan formula khusus antiselip.',
    author: 'Joko Sasongko (Operator)',
    publishedDate: '28 Agustus 2026',
    status: 'published'
  },
  {
    id: 'art-3',
    title: 'Sosialisasi Program Tabungan Emas Berbasis Setor Sampah Kering Dusun II',
    category: 'Kegiatan Warga',
    summary: 'Warga kini dapat mengonversikan saldo tabungan bank sampah plastik menjadi gram emas batangan bekerjasama dengan Pegadaian.',
    content: 'Program inovatif pemilahan sampah organik dan anorganik di Desa Waru mendapatkan sambutan hangat dari ibu-ibu PKK. Setiap kilogram sampah botol PET dan kardus dapat ditabung langsung melalui aplikasi BUMDes.',
    author: 'Anisa Putri (Editor Desa)',
    publishedDate: '15 Agustus 2026',
    status: 'published'
  }
];

export default function CmsModule({ actorName, onShowToast }: CmsModuleProps) {
  const [articles, setArticles] = useState<CmsArticle[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<CmsArticle | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CmsArticle['category']>('Berita BUMDes');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(actorName);
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bumdes_cms_articles');
      if (stored) {
        setArticles(JSON.parse(stored));
      } else {
        setArticles(SEED_ARTICLES);
        localStorage.setItem('bumdes_cms_articles', JSON.stringify(SEED_ARTICLES));
      }
    } catch (e) {
      setArticles(SEED_ARTICLES);
    }
  }, []);

  const saveArticles = (newArticles: CmsArticle[]) => {
    setArticles(newArticles);
    try {
      localStorage.setItem('bumdes_cms_articles', JSON.stringify(newArticles));
    } catch (e) {}
  };

  const openAddModal = () => {
    setEditingArticle(null);
    setTitle('');
    setCategory('Berita BUMDes');
    setSummary('');
    setContent('');
    setAuthor(actorName);
    setStatus('published');
    setIsModalOpen(true);
  };

  const openEditModal = (article: CmsArticle) => {
    setEditingArticle(article);
    setTitle(article.title);
    setCategory(article.category);
    setSummary(article.summary);
    setContent(article.content);
    setAuthor(article.author);
    setStatus(article.status);
    setIsModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      onShowToast('Judul dan isi artikel wajib diisi', 'warning');
      return;
    }

    if (editingArticle) {
      // Update
      const updated = articles.map(a => a.id === editingArticle.id ? {
        ...a,
        title,
        category,
        summary: summary || title,
        content,
        author,
        status
      } : a);
      saveArticles(updated);
      await recordAuditLog(actorName, 'superadmin', `Memperbarui Artikel: "${title}"`, `articles/${editingArticle.id}`);
      onShowToast('Artikel berhasil diperbarui!', 'success');
    } else {
      // Create
      const newArt: CmsArticle = {
        id: `art-${Date.now()}`,
        title,
        category,
        summary: summary || title,
        content,
        author,
        publishedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        status
      };
      saveArticles([newArt, ...articles]);
      await recordAuditLog(actorName, 'superadmin', `Menulis Artikel Baru: "${title}"`, `articles/${newArt.id}`);
      onShowToast('Artikel baru berhasil dipublikasikan!', 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteArticle = async (id: string, artTitle: string) => {
    if (!window.confirm(`Hapus artikel "${artTitle}"?`)) return;
    const remaining = articles.filter(a => a.id !== id);
    saveArticles(remaining);
    await recordAuditLog(actorName, 'superadmin', `Menghapus Artikel: "${artTitle}"`, `articles/${id}`);
    onShowToast('Artikel berhasil dihapus', 'info');
  };

  const toggleStatus = (id: string) => {
    const updated = articles.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'published' ? 'draft' : 'published';
        return { ...a, status: nextStatus as any };
      }
      return a;
    });
    saveArticles(updated);
    onShowToast('Status publikasi artikel diubah', 'info');
  };

  const filteredArticles = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'all' || a.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-pink-500/20 text-pink-400 rounded-xl border border-pink-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">CMS Berita, Publikasi & Informasi Desa</h2>
          </div>
          <p className="text-xs text-slate-400">
            Kelola artikel kegiatan desa, rilis transparansi PADes, dan pengumuman resmi BUMDes Waskita Wijaya.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Buat Artikel Baru</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul berita atau artikel..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Berita BUMDes', 'PADes & Keuangan', 'Pengumuman Desa', 'Kegiatan Warga'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((art) => (
          <div 
            key={art.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-800 text-emerald-400 border border-slate-700">
                  {art.category}
                </span>

                <button
                  type="button"
                  onClick={() => toggleStatus(art.id)}
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase cursor-pointer transition-colors ${
                    art.status === 'published' 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                  title="Klik untuk ubah status"
                >
                  {art.status === 'published' ? '● Terbit' : '○ Draft'}
                </button>
              </div>

              <h3 className="text-sm font-black text-white line-clamp-2 mb-2 group-hover:text-emerald-400 transition-colors">
                {art.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                {art.summary || art.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center space-x-1.5 truncate mr-2">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{art.publishedDate}</span>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(art)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit Artikel"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteArticle(art.id, art.title)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Artikel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl">
          <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Tidak ada artikel berita yang cocok dengan kriteria pencarian.</p>
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-black text-white">
                {editingArticle ? 'Perbarui Artikel Desa' : 'Buat Artikel / Berita Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Judul Artikel / Berita *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Peresmian Unit Usaha Pengolahan Sampah Desa Waru"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Berita BUMDes">Berita BUMDes</option>
                    <option value="PADes & Keuangan">PADes & Keuangan</option>
                    <option value="Pengumuman Desa">Pengumuman Desa</option>
                    <option value="Kegiatan Warga">Kegiatan Warga</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Status Publikasi</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="published">Langsung Terbit (Published)</option>
                    <option value="draft">Simpan sebagai Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Ringkasan Berita (Lead / Excerpt)</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Kalimat pengantar singkat yang menarik pembaca..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Konten Lengkap Berita *</label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan berita lengkap mengenai kegiatan atau pengumuman BUMDes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {editingArticle ? 'Simpan Pembaruan' : 'Terbitkan Artikel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
