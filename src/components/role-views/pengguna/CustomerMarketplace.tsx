import React, { useState, useRef } from 'react';
import { 
  Store, ShoppingBag, PlusCircle, Search, Filter, Star, 
  Tag, MapPin, Phone, CheckCircle2, ChevronRight, X, 
  Plus, Minus, ArrowRight, ShieldCheck, Sparkles, PackageCheck,
  Send, ExternalLink, Image as ImageIcon, RefreshCw, AlertCircle,
  Upload, Trash2, Camera, Wrench, Briefcase, FileCheck, Layers,
  Navigation
} from 'lucide-react';
import { showToast } from '../../ToastNotification';
import { reverseGeocodeGPS } from '../../../services/freeApiService';

export type MarketplaceCategory = 
  | 'Kuliner' 
  | 'Fashion' 
  | 'Kerajinan' 
  | 'Herbal' 
  | 'Pertanian' 
  | 'Jasa & Layanan';

export interface ProductItem {
  id: string;
  name: string;
  itemType: 'Produk' | 'Jasa';
  category: MarketplaceCategory;
  price: number;
  rating: number;
  soldCount: number;
  stock: number;
  unitLabel?: string; // e.g. 'bungkus', 'karung', 'sesi', 'panggilan'
  sellerName: string;
  sellerDukuh: string;
  sellerPhone: string;
  image: string;
  description: string;
  isBinaBumdes: boolean;
}

export interface CustomerOrder {
  id: string;
  productName: string;
  itemType: 'Produk' | 'Jasa';
  sellerName: string;
  qty: number;
  totalPrice: number;
  status: 'Diproses Penjual' | 'Siap Diambil di BUMDes' | 'Selesai Dikirim' | 'Jadwal Layanan Dikonfirmasi';
  orderDate: string;
  deliveryMethod: 'Ambil di BUMDes' | 'Antar ke Rumah' | 'Kunjungan Layanan ke Rumah' | 'Datang ke Lokasi Usaha';
  paymentMethod: 'Saldo E-Wallet' | 'QRIS BUMDes' | 'COD Tunai';
}

export interface RegisteredMyProduct {
  id: string;
  name: string;
  itemType: 'Produk' | 'Jasa';
  category: string;
  price: number;
  stock: number;
  image: string;
  status: 'Tayang di Marketplace' | 'Menunggu Kurasi BUMDes';
  dateRegistered: string;
}

export default function CustomerMarketplace() {
  const [activeMarketSubTab, setActiveMarketSubTab] = useState<'daftar-produk' | 'pesanan-saya' | 'daftar-umkm-saya'>('daftar-produk');
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'Semua' | 'Produk' | 'Jasa'>('Semua');

  // File Input Ref for Device Upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Products state (includes community products & community services)
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 'prod-1',
      name: 'Keripik Tempe Renyah Sanjai Desa Waru (250g)',
      itemType: 'Produk',
      category: 'Kuliner',
      price: 15000,
      rating: 4.9,
      soldCount: 342,
      stock: 45,
      unitLabel: 'bungkus',
      sellerName: 'Ibu Nurhayah (Dapur Berkah)',
      sellerDukuh: 'RT 02 Dukuh Waru',
      sellerPhone: '6282134567890',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      description: 'Keripik tempe kedelai lokal renyah bertabur rempah-rempah pilihan resep warisan keluarga Sukoharjo tanpa bahan pengawet.',
      isBinaBumdes: true
    },
    {
      id: 'prod-2',
      name: 'Batik Tulis Corak Daun Waru Baki (Kain 2x1.1m)',
      itemType: 'Produk',
      category: 'Fashion',
      price: 275000,
      rating: 5.0,
      soldCount: 89,
      stock: 12,
      unitLabel: 'lembar',
      sellerName: 'Sanggar Batik Ibu Handayani',
      sellerDukuh: 'RT 04 Dukuh Baki',
      sellerPhone: '6282134567891',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      description: 'Kain batik tulis pewarna alam khas desa Waru Baki, dikerjakan secara presisi oleh pengrajin lokal berstandar ekspor.',
      isBinaBumdes: true
    },
    {
      id: 'prod-3',
      name: 'Jamu Tradisional Kunyit Asam & Beras Kencur Segar (500ml)',
      itemType: 'Produk',
      category: 'Herbal',
      price: 12000,
      rating: 4.8,
      soldCount: 512,
      stock: 60,
      unitLabel: 'botol',
      sellerName: 'Mbah Parto Jamu Segar',
      sellerDukuh: 'RT 01 Dukuh Waru',
      sellerPhone: '6282134567892',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
      description: 'Jamu segar olahan bahan herbal asli kebun desa tanpa pemanis buatan, menyehatkan dan memelihara daya tahan tubuh.',
      isBinaBumdes: true
    },
    {
      id: 'prod-4',
      name: 'Keranjang Anyaman Bambu Multi-Fungsi / Parsel',
      itemType: 'Produk',
      category: 'Kerajinan',
      price: 35000,
      rating: 4.9,
      soldCount: 178,
      stock: 25,
      unitLabel: 'buah',
      sellerName: 'Kelompok Anyam Bambu Lestari',
      sellerDukuh: 'RT 03 Dukuh Waru',
      sellerPhone: '6282134567893',
      image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=600&q=80',
      description: 'Keranjang estetik anyaman bambu apus pilihan, cocok untuk wadah hantaran, buah meja tamu, maupun suvenir pernikahan.',
      isBinaBumdes: true
    },
    {
      id: 'prod-5',
      name: 'Beras Organik Menthik Wangi Sukoharjo (5 Kg)',
      itemType: 'Produk',
      category: 'Pertanian',
      price: 75000,
      rating: 4.9,
      soldCount: 620,
      stock: 50,
      unitLabel: 'karung 5kg',
      sellerName: 'Gapoktan Subur Makmur',
      sellerDukuh: 'RT 05 Dukuh Karang',
      sellerPhone: '6282134567894',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      description: 'Beras pulen aromatik menthik wangi hasil panen sawah irigasi alami petani Waru tanpa pestisida kimia.',
      isBinaBumdes: true
    },
    {
      id: 'prod-6',
      name: 'Sambal Bawang Klotok Kemasan Botol Segel (180g)',
      itemType: 'Produk',
      category: 'Kuliner',
      price: 22000,
      rating: 4.8,
      soldCount: 215,
      stock: 30,
      unitLabel: 'botol',
      sellerName: 'Warung Pedas Bu Tri',
      sellerDukuh: 'RT 01 Dukuh Baki',
      sellerPhone: '6282134567895',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
      description: 'Sambal bawang ulek matang khas pedesaan dengan gurihnya suwiran ikan klotok higienis.',
      isBinaBumdes: false
    },
    // Jasa UMKM Warga
    {
      id: 'serv-1',
      name: 'Jasa Servis Elektronik, Kipas Angin & Pompa Air Rumah',
      itemType: 'Jasa',
      category: 'Jasa & Layanan',
      price: 35000,
      rating: 4.9,
      soldCount: 76,
      stock: 5,
      unitLabel: 'panggilan/servis',
      sellerName: 'Pak Joko Servis Cepat',
      sellerDukuh: 'RT 03 Dukuh Waru',
      sellerPhone: '6282134567896',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      description: 'Layanan servis kelistrikan, perbaikan mesin cuci, kipas angin, dan pompa air submersible langsung ke rumah warga desa.',
      isBinaBumdes: true
    },
    {
      id: 'serv-2',
      name: 'Jasa Jahit & Vermak Kilat Pakaian, Celana, Kebaya Bu RT',
      itemType: 'Jasa',
      category: 'Jasa & Layanan',
      price: 20000,
      rating: 5.0,
      soldCount: 142,
      stock: 8,
      unitLabel: 'potong pakaian',
      sellerName: 'Rumah Jahit Bu Hartati',
      sellerDukuh: 'RT 02 Dukuh Baki',
      sellerPhone: '6282134567897',
      image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80',
      description: 'Jasa jahit pakaian seragam, kebaya acara adat, vermak celana jeans, potong tepi rapi dan cepat bisa dijemput antar.',
      isBinaBumdes: true
    },
    {
      id: 'serv-3',
      name: 'Jasa Potong Rambut / Barbershop Home Service Warga Waru',
      itemType: 'Jasa',
      category: 'Jasa & Layanan',
      price: 25000,
      rating: 4.8,
      soldCount: 95,
      stock: 6,
      unitLabel: 'kepala/sesi',
      sellerName: 'Mas Dani Barbershop Desa',
      sellerDukuh: 'RT 04 Dukuh Waru',
      sellerPhone: '6282134567898',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
      description: 'Cukur rambut pria & anak-anak rapi modern, bisa dipanggil langsung ke rumah atau datang ke sanggar Mas Dani.',
      isBinaBumdes: false
    }
  ]);

  // Customer Orders State
  const [myOrders, setMyOrders] = useState<CustomerOrder[]>([
    {
      id: 'ORD-UMKM-551',
      productName: 'Keripik Tempe Renyah Sanjai Desa Waru (250g)',
      itemType: 'Produk',
      sellerName: 'Ibu Nurhayah (Dapur Berkah)',
      qty: 3,
      totalPrice: 45000,
      status: 'Diproses Penjual',
      orderDate: '2026-09-05',
      deliveryMethod: 'Ambil di BUMDes',
      paymentMethod: 'Saldo E-Wallet'
    }
  ]);

  // Registered My Products State (Products submitted by current customer)
  const [myRegisteredProducts, setMyRegisteredProducts] = useState<RegisteredMyProduct[]>([
    {
      id: 'MY-PROD-01',
      name: 'Keripik Pisang Tanduk Manis Gurih (200g)',
      itemType: 'Produk',
      category: 'Kuliner',
      price: 16000,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      status: 'Tayang di Marketplace',
      dateRegistered: '2026-08-28'
    }
  ]);

  // Order/Purchase Modal State
  const [selectedProductToBuy, setSelectedProductToBuy] = useState<ProductItem | null>(null);
  const [orderQty, setOrderQty] = useState(1);
  const [orderNote, setOrderNote] = useState('');
  const [orderDelivery, setOrderDelivery] = useState<'Ambil di BUMDes' | 'Antar ke Rumah' | 'Kunjungan Layanan ke Rumah' | 'Datang ke Lokasi Usaha'>('Ambil di BUMDes');
  const [orderPayment, setOrderPayment] = useState<'Saldo E-Wallet' | 'QRIS BUMDes' | 'COD Tunai'>('Saldo E-Wallet');

  // Register Product / Jasa Form State
  const [regItemType, setRegItemType] = useState<'Produk' | 'Jasa'>('Produk');
  const [regName, setRegName] = useState('');
  const [regCategory, setRegCategory] = useState<MarketplaceCategory>('Kuliner');
  const [regPrice, setRegPrice] = useState<number>(20000);
  const [regStock, setRegStock] = useState<number>(30);
  const [regUnitLabel, setRegUnitLabel] = useState('bungkus');
  const [regSellerName, setRegSellerName] = useState('');
  const [regDukuh, setRegDukuh] = useState('RT 03 Dukuh Waru');
  const [regPhone, setRegPhone] = useState('081234567890');
  const [regDesc, setRegDesc] = useState('');
  
  // File Upload State from Device
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOrderGpsLoading, setIsOrderGpsLoading] = useState(false);

  // Free API GPS Geocoding for Customer Order
  const handleDetectOrderGps = () => {
    if (!navigator.geolocation) {
      showToast('Perangkat tidak mendukung deteksi GPS!', 'warning');
      return;
    }

    setIsOrderGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await reverseGeocodeGPS(latitude, longitude);
          const prefix = selectedProductToBuy?.itemType === 'Jasa' ? 'Alamat Layanan: ' : 'Alamat Pengiriman: ';
          setOrderNote((prev) => prev ? `${prev} · ${prefix}${res.formattedAddress}` : `${prefix}${res.formattedAddress}`);
          showToast(`Alamat berhasil dideteksi dari satelit GPS: ${res.road}, ${res.village}`, 'success');
        } catch {
          showToast('Gagal memproses alamat GPS, silakan ketik manual', 'warning');
        } finally {
          setIsOrderGpsLoading(false);
        }
      },
      () => {
        setIsOrderGpsLoading(false);
        showToast('Izin GPS ditolak atau tidak tersedia.', 'info');
      },
      { timeout: 8000 }
    );
  };

  // Filter products by category, type & search
  const filteredProducts = products.filter(p => {
    const matchType = selectedTypeFilter === 'Semua' || p.itemType === selectedTypeFilter;
    const matchCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchCat && matchQuery;
  });

  // Handle File Input Selection from User Device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, atau WEBP)!', 'warning');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Ukuran foto terlalu besar! Maksimum 10MB.', 'warning');
      return;
    }

    setUploadedImageFile(file);
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const result = loadEvt.target?.result as string;
      setUploadedImagePreview(result);
      showToast(`Foto "${file.name}" berhasil diunggah dari perangkat!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImageFile(null);
    setUploadedImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Quick Preset Images for Instant Testing
  const handleUsePresetImage = (url: string, label: string) => {
    setUploadedImagePreview(url);
    setUploadedImageFile(null);
    showToast(`Foto sampel "${label}" dipilih`, 'info');
  };

  const handleOpenBuyModal = (prod: ProductItem) => {
    setSelectedProductToBuy(prod);
    setOrderQty(1);
    setOrderNote('');
    // Default delivery method according to item type
    if (prod.itemType === 'Jasa') {
      setOrderDelivery('Kunjungan Layanan ke Rumah');
    } else {
      setOrderDelivery('Ambil di BUMDes');
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductToBuy) return;

    const deliveryCost = (orderDelivery === 'Antar ke Rumah' || orderDelivery === 'Kunjungan Layanan ke Rumah') ? 3000 : 0;
    const total = (selectedProductToBuy.price * orderQty) + deliveryCost;

    const newOrder: CustomerOrder = {
      id: 'ORD-UMKM-' + Math.floor(100 + Math.random() * 900),
      productName: selectedProductToBuy.name,
      itemType: selectedProductToBuy.itemType,
      sellerName: selectedProductToBuy.sellerName,
      qty: orderQty,
      totalPrice: total,
      status: selectedProductToBuy.itemType === 'Jasa' ? 'Jadwal Layanan Dikonfirmasi' : 'Diproses Penjual',
      orderDate: '2026-09-06',
      deliveryMethod: orderDelivery,
      paymentMethod: orderPayment
    };

    setMyOrders([newOrder, ...myOrders]);
    setSelectedProductToBuy(null);
    setActiveMarketSubTab('pesanan-saya');
    showToast(`Pesanan ${selectedProductToBuy.itemType.toLowerCase()} berhasil dibuat! Penjual (${selectedProductToBuy.sellerName}) akan segera menghubungi Anda.`, 'success');
  };

  const handleRegisterProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regSellerName.trim()) {
      showToast('Harap lengkapi nama penawaran dan nama usaha/toko Anda!', 'warning');
      return;
    }

    // Default image if no photo uploaded
    const finalImage = uploadedImagePreview || (
      regItemType === 'Jasa' 
        ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
    );

    const newRegistered: RegisteredMyProduct = {
      id: (regItemType === 'Jasa' ? 'MY-JASA-' : 'MY-PROD-') + Math.floor(10 + Math.random() * 90),
      name: regName,
      itemType: regItemType,
      category: regCategory,
      price: Number(regPrice),
      stock: Number(regStock),
      image: finalImage,
      status: 'Tayang di Marketplace',
      dateRegistered: '2026-09-06'
    };

    // Also add to public marketplace catalog immediately
    const newMarketProduct: ProductItem = {
      id: 'umkm-' + Date.now(),
      name: regName,
      itemType: regItemType,
      category: regCategory,
      price: Number(regPrice),
      rating: 5.0,
      soldCount: 0,
      stock: Number(regStock),
      unitLabel: regUnitLabel || (regItemType === 'Jasa' ? 'layanan' : 'pcs'),
      sellerName: regSellerName,
      sellerDukuh: regDukuh,
      sellerPhone: regPhone,
      image: finalImage,
      description: regDesc || `${regItemType} UMKM unggulan warga Desa Waru, siap melayani warga desa dengan ramah dan terpercaya.`,
      isBinaBumdes: true
    };

    setMyRegisteredProducts([newRegistered, ...myRegisteredProducts]);
    setProducts([newMarketProduct, ...products]);

    // Reset Form
    setRegName('');
    setRegDesc('');
    setUploadedImageFile(null);
    setUploadedImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    showToast(`${regItemType} "${regName}" berhasil didaftarkan dengan foto dari perangkat dan langsung tayang di katalog Desa!`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-Nav Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveMarketSubTab('daftar-produk')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMarketSubTab === 'daftar-produk'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Katalog Produk & Jasa UMKM ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMarketSubTab('pesanan-saya')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMarketSubTab === 'pesanan-saya'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pesanan Saya ({myOrders.length})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setActiveMarketSubTab('daftar-umkm-saya')}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeMarketSubTab === 'daftar-umkm-saya'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Daftarkan Produk / Jasa Saya</span>
        </button>
      </div>

      {/* VIEW 1: KATALOG PRODUK & JASA UMKM */}
      {activeMarketSubTab === 'daftar-produk' && (
        <div className="space-y-6">
          
          {/* Header Search & Category Filter */}
          <div className="p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            
            {/* Top Row: Search & Type Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk keripik, batik, beras, atau jasa servis pompa, jahit..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              {/* Type Switcher: Semua, Produk Fisik, Jasa / Layanan */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTypeFilter('Semua')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedTypeFilter === 'Semua'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Semua ({products.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTypeFilter('Produk')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedTypeFilter === 'Produk'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Produk Fisik ({products.filter(p => p.itemType === 'Produk').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTypeFilter('Jasa')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedTypeFilter === 'Jasa'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Jasa & Layanan ({products.filter(p => p.itemType === 'Jasa').length})</span>
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3" /> Kategori:
              </span>
              {['Semua', 'Kuliner', 'Fashion', 'Kerajinan', 'Herbal', 'Pertanian', 'Jasa & Layanan'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                    selectedCategory === cat
                      ? cat === 'Jasa & Layanan' 
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'Jasa & Layanan' && <Wrench className="w-3 h-3" />}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((prod) => (
              <div 
                key={prod.id} 
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-md transition-all group"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-white text-[10px] font-bold backdrop-blur-xs ${
                        prod.itemType === 'Jasa' ? 'bg-blue-600/90' : 'bg-emerald-600/90'
                      }`}>
                        {prod.itemType === 'Jasa' ? '🛠️ Jasa / Layanan' : '📦 Produk Fisik'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[10px] font-bold">
                        {prod.category}
                      </span>
                      {prod.isBinaBumdes && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/95 backdrop-blur-xs text-slate-950 text-[10px] font-black">
                          ★ Binaan BUMDes
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className={`font-bold font-mono text-base ${
                          prod.itemType === 'Jasa' ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          Rp {prod.price.toLocaleString('id-ID')}
                        </span>
                        {prod.unitLabel && (
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            /{prod.unitLabel}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{prod.rating}</span>
                        <span className="text-slate-400 font-normal">({prod.soldCount} dipesan)</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {prod.name}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {prod.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Store className="w-3 h-3 text-slate-400" />
                        <strong className="text-slate-700 dark:text-slate-300">{prod.sellerName}</strong>
                      </span>
                      <span>
                        {prod.itemType === 'Jasa' ? `Kapasitas: ${prod.stock}/hari` : `Stok: ${prod.stock}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buy Action Buttons */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenBuyModal(prod)}
                    className={`flex-1 py-2 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer text-white ${
                      prod.itemType === 'Jasa' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {prod.itemType === 'Jasa' ? (
                      <>
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Pesan Jasa Ini</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Beli / Pesan</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://wa.me/${prod.sellerPhone}?text=Halo%20${encodeURIComponent(prod.sellerName)},%20saya%20tertarik%20dengan%20${encodeURIComponent(prod.name)}%20dari%20Portal%20Marketplace%20BUMDes%20Waru`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    title="Hubungi WhatsApp Penyedia / Penjual"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Store className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">Tidak ada produk atau jasa ditemukan untuk filter kategori tersebut.</p>
              <button
                type="button"
                onClick={() => { setSelectedCategory('Semua'); setSelectedTypeFilter('Semua'); setSearchQuery(''); }}
                className="mt-3 px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: PESANAN & RIWAYAT SAYA */}
      {activeMarketSubTab === 'pesanan-saya' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>Riwayat Pesanan Produk & Jasa UMKM Saya</span>
              </h3>
              <p className="text-xs text-slate-500">Pantau status penyiapan pesanan, pengiriman barang, atau konfirmasi kunjungan jasa teknisi.</p>
            </div>
          </div>

          <div className="space-y-3">
            {myOrders.map((ord) => (
              <div 
                key={ord.id}
                className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      #{ord.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      ord.itemType === 'Jasa' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                    }`}>
                      {ord.itemType === 'Jasa' ? '🛠️ Jasa' : '📦 Produk'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {ord.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ord.productName}</h4>
                  <p className="text-xs text-slate-500">
                    Penyedia: <strong>{ord.sellerName}</strong> · Kuantitas: <strong>{ord.qty} {ord.itemType === 'Jasa' ? 'layanan' : 'pcs'}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Metode: {ord.deliveryMethod} · Pembayaran: {ord.paymentMethod} · Tanggal: {ord.orderDate}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 block">Total Tagihan</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      Rp {ord.totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast(`Struk bukti pesanan #${ord.id} berhasil dicetak!`, 'info')}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    Cetak Struk
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: DAFTARKAN PRODUK / JASA UMKM SAYA */}
      {activeMarketSubTab === 'daftar-umkm-saya' && (
        <div className="space-y-8">
          
          {/* Registration Form Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm max-w-3xl mx-auto space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Pemberdayaan Ekonomi & Wirausaha Desa Waru
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                Daftarkan Produk atau Jasa UMKM Anda
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pasarkan olahan makanan, produk kerajinan, maupun keahlian jasa reparasi/jahit Anda langsung kepada seluruh warga desa secara terpadu.
              </p>
            </div>

            <form onSubmit={handleRegisterProduct} className="space-y-5">
              
              {/* TIPE PENAWARAN: PRODUK FISIK VS JASA / LAYANAN */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Pilih Jenis Penawaran:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRegItemType('Produk');
                      setRegCategory('Kuliner');
                      setRegUnitLabel('bungkus');
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      regItemType === 'Produk'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                    }`}
                  >
                    <PackageCheck className="w-4 h-4" />
                    <div className="text-left">
                      <span className="block font-bold">Produk Fisik</span>
                      <span className="text-[10px] opacity-80 font-normal">Makanan, kerajinan, batik, dll.</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegItemType('Jasa');
                      setRegCategory('Jasa & Layanan');
                      setRegUnitLabel('layanan/panggilan');
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      regItemType === 'Jasa'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <div className="text-left">
                      <span className="block font-bold">Jasa & Layanan</span>
                      <span className="text-[10px] opacity-80 font-normal">Servis elektronik, jahit, cukur, dll.</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {regItemType === 'Jasa' ? 'Nama Jasa / Layanan yang Ditawarkan' : 'Nama Produk Dagangan'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={regItemType === 'Jasa' ? 'Contoh: Jasa Servis Mesin Cuci & Pompa Air' : 'Contoh: Peyek Kacang Gurih Renyah 200g'}
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Kategori</label>
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  >
                    {regItemType === 'Produk' ? (
                      <>
                        <option value="Kuliner">Kuliner & Minuman</option>
                        <option value="Fashion">Fashion & Batik</option>
                        <option value="Kerajinan">Kerajinan Tangan</option>
                        <option value="Herbal">Herbal & Obat Tradisional</option>
                        <option value="Pertanian">Hasil Pertanian / Sayur</option>
                      </>
                    ) : (
                      <>
                        <option value="Jasa & Layanan">Jasa & Layanan Perbaikan / Rumah Tangga</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Pricing & Unit/Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {regItemType === 'Jasa' ? 'Tarif Mulai Dari (Rp)' : 'Harga Jual Satuan (Rp)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={500}
                    value={regPrice}
                    onChange={(e) => setRegPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {regItemType === 'Jasa' ? 'Kapasitas Order / Hari' : 'Jumlah Stok Siap Kirim'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={regStock}
                    onChange={(e) => setRegStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Satuan</label>
                  <input
                    type="text"
                    required
                    placeholder="bungkus, pcs, porsi, sesi, panggilan"
                    value={regUnitLabel}
                    onChange={(e) => setRegUnitLabel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              {/* Seller / Provider Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {regItemType === 'Jasa' ? 'Nama Teknisi / Penyedia Jasa' : 'Nama Toko / Nama Anda'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={regItemType === 'Jasa' ? 'Pak Joko Servis' : 'Dapur Mbak Sri'}
                    value={regSellerName}
                    onChange={(e) => setRegSellerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Dukuh / RT Alamat</label>
                  <input
                    type="text"
                    required
                    value={regDukuh}
                    onChange={(e) => setRegDukuh(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nomor WhatsApp Aktif</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* UPLOAD FOTO PRODUK DARI PERANGKAT (DEVICE FILE MANAGER INTEGRATION) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Foto {regItemType} (Unggah dari Perangkat)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    File Explorer / Galeri HP & PC didukung
                  </span>
                </div>

                {/* Hidden Native File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="product-file-upload-input"
                />

                {/* Dropzone & Preview Box */}
                {!uploadedImagePreview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      isDragOver
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                        : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50/60 dark:bg-slate-900/60'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Klik untuk memilih foto dari perangkat Anda
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        atau seret & lepaskan file gambar langsung ke sini
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                      <span>JPG, PNG, WEBP (Maksimal 10MB)</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-300 dark:border-slate-700 shadow-xs">
                      <img
                        src={uploadedImagePreview}
                        alt="Preview Foto"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                        Siap Tayang
                      </span>
                    </div>

                    <div className="flex-1 space-y-1.5 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-600 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Foto Berhasil Dimuat dari File Perangkat</span>
                      </div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">
                        {uploadedImageFile ? uploadedImageFile.name : 'Foto pilihan pengguna'}
                      </p>
                      {uploadedImageFile && (
                        <p className="text-[11px] text-slate-400 font-mono">
                          Ukuran file: {(uploadedImageFile.size / 1024).toFixed(1)} KB · Tipe: {uploadedImageFile.type}
                        </p>
                      )}

                      <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                        >
                          Ganti Foto
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Presets Helper */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-medium">Atau gunakan foto sampel cepat:</span>
                  <button
                    type="button"
                    onClick={() => handleUsePresetImage('https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80', 'Keripik')}
                    className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    Contoh Makanan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUsePresetImage('https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80', 'Batik')}
                    className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    Contoh Batik
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUsePresetImage('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', 'Servis Teknisi')}
                    className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    Contoh Jasa Servis
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {regItemType === 'Jasa' ? 'Rincian Keahlian & Jangkauan Layanan' : 'Deskripsi & Keunggulan Produk'}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={regItemType === 'Jasa' ? 'Tuliskan jenis kerusakan yang bisa ditangani, garansi servis, dan estimasi waktu pengerjaan...' : 'Tuliskan rasa, bahan baku, berat bersih, atau cara penyajian...'}
                  value={regDesc}
                  onChange={(e) => setRegDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2 ${
                  regItemType === 'Jasa'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Simpan & Daftarkan {regItemType} Sekarang</span>
              </button>
            </form>
          </div>

          {/* List of Registered Products */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              <span>Produk & Jasa UMKM yang Telah Saya Daftarkan ({myRegisteredProducts.length})</span>
            </h4>

            <div className="space-y-3">
              {myRegisteredProducts.map((p) => (
                <div 
                  key={p.id}
                  className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          p.itemType === 'Jasa' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.itemType}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        Kategori: {p.category} · Tarif: Rp {p.price.toLocaleString('id-ID')} · Kuota: {p.stock}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {p.dateRegistered}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* BUY / ORDER MODAL POPUP (SUPPORTS BOTH PRODUK & JASA) */}
      {selectedProductToBuy && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {selectedProductToBuy.itemType === 'Jasa' ? (
                  <>
                    <Wrench className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Pesan Jasa / Layanan UMKM</h4>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Pesan Produk UMKM</h4>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedProductToBuy(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img
                src={selectedProductToBuy.image}
                alt={selectedProductToBuy.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold text-white ${
                    selectedProductToBuy.itemType === 'Jasa' ? 'bg-blue-600' : 'bg-emerald-600'
                  }`}>
                    {selectedProductToBuy.itemType}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {selectedProductToBuy.category}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">{selectedProductToBuy.name}</h5>
                <p className="text-[11px] text-slate-500">Penyedia: {selectedProductToBuy.sellerName} ({selectedProductToBuy.sellerDukuh})</p>
                <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  Rp {selectedProductToBuy.price.toLocaleString('id-ID')} {selectedProductToBuy.unitLabel && `/${selectedProductToBuy.unitLabel}`}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-4">
              
              {/* Qty Selector */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {selectedProductToBuy.itemType === 'Jasa' ? 'Jumlah Sesi / Pengerjaan' : 'Jumlah Pesanan (Qty)'}
                </span>
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                    className="p-1 hover:text-emerald-600 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold text-xs w-6 text-center">{orderQty}</span>
                  <button
                    type="button"
                    onClick={() => setOrderQty(orderQty + 1)}
                    className="p-1 hover:text-emerald-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Delivery / Service Option */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {selectedProductToBuy.itemType === 'Jasa' ? 'Metode Pelaksanaan Jasa' : 'Metode Pengambilan Barang'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProductToBuy.itemType === 'Jasa' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setOrderDelivery('Kunjungan Layanan ke Rumah')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left cursor-pointer transition-all ${
                          orderDelivery === 'Kunjungan Layanan ke Rumah'
                            ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600'
                        }`}
                      >
                        Teknisi Datang ke Rumah
                        <span className="text-[10px] text-slate-400 block font-normal">+Rp 3.000 (Khusus Desa Waru)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderDelivery('Datang ke Lokasi Usaha')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left cursor-pointer transition-all ${
                          orderDelivery === 'Datang ke Lokasi Usaha'
                            ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600'
                        }`}
                      >
                        Datang ke Tempat Mitra
                        <span className="text-[10px] text-slate-400 block font-normal">Sesuai alamat RT penyedia</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setOrderDelivery('Ambil di BUMDes')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left cursor-pointer transition-all ${
                          orderDelivery === 'Ambil di BUMDes'
                            ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600'
                        }`}
                      >
                        Ambil di Kantor BUMDes
                        <span className="text-[10px] text-slate-400 block font-normal">Gratis ongkir</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderDelivery('Antar ke Rumah')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left cursor-pointer transition-all ${
                          orderDelivery === 'Antar ke Rumah'
                            ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600'
                        }`}
                      >
                        Kurir Antar ke Rumah
                        <span className="text-[10px] text-slate-400 block font-normal">+Rp 3.000 (Khusus Desa Waru)</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Metode Pembayaran</label>
                <select
                  value={orderPayment}
                  onChange={(e) => setOrderPayment(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                >
                  <option value="Saldo E-Wallet">Saldo E-Wallet Tabungan Sampah (Otomatis)</option>
                  <option value="QRIS BUMDes">Scan QRIS Dinamis BUMDes</option>
                  <option value="COD Tunai">Bayar Tunai Langsung Saat Terima / Pengerjaan</option>
                </select>
              </div>

              {/* Notes & Address */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {selectedProductToBuy.itemType === 'Jasa' ? 'Catatan Alamat & Jadwal Kunjungan' : 'Alamat Pengiriman / Catatan Pesanan'}
                  </label>
                  {(orderDelivery === 'Antar ke Rumah' || orderDelivery === 'Kunjungan Layanan ke Rumah') && (
                    <button
                      type="button"
                      onClick={handleDetectOrderGps}
                      disabled={isOrderGpsLoading}
                      className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {isOrderGpsLoading ? (
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                      ) : (
                        <Navigation className="w-2.5 h-2.5" />
                      )}
                      <span>Gunakan GPS Rumah</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder={selectedProductToBuy.itemType === 'Jasa' ? 'Contoh: RT 02 Waru, pompa air mati total / luang jam 15.00 sore' : 'Contoh: Jl. Mawar RT 03/01 Waru, tolong pilihkan rasa gurih manis'}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              {/* Subtotal */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-between border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Total Biaya:</span>
                <span className="text-base font-black font-mono text-emerald-700 dark:text-emerald-300">
                  Rp {(
                    (selectedProductToBuy.price * orderQty) + 
                    ((orderDelivery === 'Antar ke Rumah' || orderDelivery === 'Kunjungan Layanan ke Rumah') ? 3000 : 0)
                  ).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductToBuy(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-2 py-2.5 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-colors ${
                    selectedProductToBuy.itemType === 'Jasa'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {selectedProductToBuy.itemType === 'Jasa' ? 'Konfirmasi Pemesanan Jasa' : 'Konfirmasi & Bayar Pesanan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
