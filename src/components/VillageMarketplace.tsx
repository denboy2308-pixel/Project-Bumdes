import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Send, 
  Store, 
  MapPin, 
  User, 
  Tag, 
  Sparkles, 
  ShoppingBasket, 
  X, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Phone,
  PackageCheck
} from 'lucide-react';
import { showToast } from './ToastNotification';

export interface ProductUMKM {
  id: string;
  name: string;
  category: 'Kuliner' | 'Kerajinan' | 'Fashion' | 'Herbal' | 'Pertanian';
  price: number;
  rating: number;
  soldCount: number;
  stock: number;
  sellerName: string;
  sellerDukuh: string;
  sellerPhone: string;
  image: string;
  description: string;
  isBinaBumdes: boolean;
}

const INITIAL_PRODUCTS: ProductUMKM[] = [];

interface CartItem {
  product: ProductUMKM;
  quantity: number;
}

export default function VillageMarketplace() {
  const [products, setProducts] = useState<ProductUMKM[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<ProductUMKM | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Form Checkout State
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Form Registration UMKM State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'Kuliner' | 'Kerajinan' | 'Fashion' | 'Herbal' | 'Pertanian'>('Kuliner');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdSeller, setNewProdSeller] = useState('');
  const [newProdDukuh, setNewProdDukuh] = useState('');
  const [newProdPhone, setNewProdPhone] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Filter Categories
  const categories = ['Semua', 'Kuliner', 'Kerajinan', 'Fashion', 'Herbal', 'Pertanian'];

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sellerDukuh.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cart Handlers
  const addToCart = (product: ProductUMKM) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast('Dimasukkan Ke Keranjang', `${product.name} telah ditambahkan ke keranjang belanja Anda.`, 'success');
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'UMKMWARU10') {
      setDiscountPercent(10);
      showToast('Kupon Berhasil Dipasang!', 'Diskon 10% Khusus Warga & Pelanggan UMKM Desa Waru telah diterapkan.', 'success');
    } else {
      showToast('Kupon Tidak Valid', 'Gunakan kode kupon UMKMWARU10 untuk mendapatkan diskon 10%.', 'warning');
    }
  };

  const rawTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = (rawTotal * discountPercent) / 100;
  const grandTotal = rawTotal - discountAmount;

    const handleCheckoutWA = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      'Marketplace belum aktif',
      'Pesanan belum tersimpan atau terkirim. Jangan melakukan pembayaran.',
      'warning'
    );
  };
  

  const handleRegisterProduct = (e: React.FormEvent) => {
    e.preventDefault();
        showToast('Pendaftaran belum aktif', 'Listing belum dikirim untuk verifikasi.', 'warning');
    return;
    if (!newProdName.trim() || !newProdPrice || !newProdSeller.trim() || !newProdPhone.trim()) {
      showToast('Mohon Isi Formulir', 'Nama produk, harga, nama UMKM, dan kontak WA wajib diisi.', 'warning');
      return;
    }

    const newProd: ProductUMKM = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      price: parseInt(newProdPrice, 10) || 10000,
      rating: 5.0,
      soldCount: 0,
      stock: 20,
      sellerName: newProdSeller,
      sellerDukuh: newProdDukuh || 'Desa Waru, Baki',
      sellerPhone: newProdPhone,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
      description: newProdDesc || 'Produk olahan berkualitas unggulan warga binaan BUMDESA Waskita Wijaya.',
      isBinaBumdes: true
    };

    setProducts(prev => [newProd, ...prev]);
    setShowRegisterModal(false);
    showToast('Produk Berhasil Terdaftar!', 'Produk UMKM Anda kini siap dipasarkan secara online di Marketplace Desa.', 'success');

    // Reset Form
    setNewProdName('');
    setNewProdPrice('');
    setNewProdSeller('');
    setNewProdDukuh('');
    setNewProdPhone('');
    setNewProdDesc('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner Hero */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-800/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-700/60 inline-flex items-center gap-2">
            <Store className="w-3.5 h-3.5" />
            <span>Pusat Ekonomi Kreatif BUMDESA Waskita Wijaya</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Marketplace Produk & Karya Asli UMKM Desa Waru
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Dukung pertumbuhan ekonomi warga lokal dengan membeli langsung produk olahan kuliner, kerajinan tangan, batik, dan hasil pertanian murni masyarakat Sukoharjo.
          </p>

          {/* Quick Stats Grid */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80">
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">UMKM Terdaftar</span>
              <span className="text-lg font-black text-emerald-400">48+ Pelaku</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Produk Binaan</span>
              <span className="text-lg font-black text-white">{products.length} Katalog</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Omset UMKM</span>
              <span className="text-lg font-black text-emerald-400">Rp 185 Juta+</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Garansi Kualitas</span>
              <span className="text-lg font-black text-white">100% Asli Desa</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Daftarkan Produk UMKM Saya</span>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 cursor-pointer transition-colors relative"
            >
              <ShoppingBasket className="w-4 h-4 text-emerald-400" />
              <span>Keranjang Belanja ({cart.reduce((s, c) => s + c.quantity, 0)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari produk tempe, batik, jamu, sambal, atau nama UMKM..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">Tidak ada produk yang cocok</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Coba gunakan kata kunci lain atau ubah kategori pencarian produk UMKM Desa Waru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Binaan BUMDESA
                    </span>
                  </div>

                  <span className="absolute top-3 right-3 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
                    {product.category}
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {product.rating} <span className="text-slate-400 font-normal">({product.soldCount} Terjual)</span>
                    </span>
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Stok: {product.stock} pcs</span>
                  </div>

                  <h3 
                    onClick={() => setSelectedProductModal(product)}
                    className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Seller Info */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="font-semibold flex items-center gap-1">
                      <Store className="w-3 h-3 text-emerald-500" /> {product.sellerName}
                    </span>
                    <span className="text-slate-400 text-[10px]">{product.sellerDukuh}</span>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block">Harga Pas:</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setSelectedProductModal(product)}
                    className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
                    title="Lihat Detail Produk"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95 transition-transform"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>+ Keranjang</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBasket className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 dark:text-white text-base">Keranjang Belanja UMKM</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-xs font-semibold">Keranjang Anda masih kosong</p>
                  <p className="text-[11px]">Pilih produk dari katalog UMKM Desa Waru di sebelah.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div 
                    key={item.product.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex gap-3 items-center"
                  >
                    <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-14 h-14 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.product.name}</h4>
                      <span className="text-[10px] text-slate-500 block truncate">{item.product.sellerName}</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        Rp {item.product.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, -1)}
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black px-1 text-slate-900 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, 1)}
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout & Promo Section */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-slate-950">
                {/* Promo Coupon */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Kode Kupon (e.g. UMKMWARU10)"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white uppercase outline-none"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Gunakan
                  </button>
                </div>

                {/* Form Delivery Address */}
                <form onSubmit={handleCheckoutWA} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nama Pembeli *"
                    value={buyerName}
                    onChange={e => setBuyerName(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Nomor WhatsApp *"
                    value={buyerPhone}
                    onChange={e => setBuyerPhone(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none"
                  />
                  <textarea
                    rows={2}
                    placeholder="Alamat Pengiriman (Dukuh / RT / RW Desa Waru) *"
                    value={buyerAddress}
                    onChange={e => setBuyerAddress(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none"
                  />

                  {/* Pricing Breakdown */}
                  <div className="py-2 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal Produk:</span>
                      <span>Rp {rawTotal.toLocaleString('id-ID')}</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Diskon ({discountPercent}%):</span>
                        <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-900 dark:text-white font-black text-sm pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span>Total Tagihan:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">Rp {grandTotal.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Pesan Langsung via WhatsApp BUMDESA</span>
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4">
            <div className="relative h-56 bg-slate-100 dark:bg-slate-800">
              <img src={selectedProductModal.image} alt={selectedProductModal.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedProductModal(null)}
                className="absolute top-3 right-3 p-2 bg-slate-950/70 text-white rounded-full cursor-pointer hover:bg-slate-950"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                  {selectedProductModal.category}
                </span>
                <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> {selectedProductModal.rating} ({selectedProductModal.soldCount} Terjual)
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-snug">{selectedProductModal.name}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{selectedProductModal.description}</p>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Nama Pelaku UMKM:</span> <span className="font-bold text-slate-900 dark:text-white">{selectedProductModal.sellerName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Lokasi Produksi:</span> <span className="font-bold text-slate-900 dark:text-white">{selectedProductModal.sellerDukuh}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Sertifikasi BUMDESA:</span> <span className="font-bold text-emerald-600">Binaan Resmi BUMDESA Waskita</span></div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Harga Produk</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">Rp {selectedProductModal.price.toLocaleString('id-ID')}</span>
                </div>

                <button
                  onClick={() => {
                    addToCart(selectedProductModal);
                    setSelectedProductModal(null);
                  }}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Tambah Ke Keranjang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Daftarkan Produk UMKM Saya */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Form Pendaftaran Produk UMKM</h3>
              <button onClick={() => setShowRegisterModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterProduct} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Produk Olahan / Karya:</label>
                <input
                  type="text"
                  placeholder="Contoh: Keripik Singkong Balado Baki"
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Kategori Produk:</label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Kuliner">Kuliner</option>
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Fashion">Fashion & Batik</option>
                    <option value="Herbal">Herbal & Jamu</option>
                    <option value="Pertanian">Pertanian</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Harga Pas (Rp):</label>
                  <input
                    type="number"
                    placeholder="15000"
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama UMKM / Pemilik:</label>
                <input
                  type="text"
                  placeholder="Contoh: Ibu Sri Handayani"
                  value={newProdSeller}
                  onChange={e => setNewProdSeller(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Asal Dukuh / RT:</label>
                  <input
                    type="text"
                    placeholder="RT 03 Dukuh Waru"
                    value={newProdDukuh}
                    onChange={e => setNewProdDukuh(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">No. WhatsApp:</label>
                  <input
                    type="text"
                    placeholder="0821xxxxxxxx"
                    value={newProdPhone}
                    onChange={e => setNewProdPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Deskripsi Ringkas Produk:</label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan keunikan dan keunggulan bahan baku produk Anda..."
                  value={newProdDesc}
                  onChange={e => setNewProdDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer"
              >
                Kirim Pendaftaran Ke Admin BUMDESA
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
