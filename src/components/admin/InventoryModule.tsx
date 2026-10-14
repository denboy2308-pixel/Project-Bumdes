import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  QrCode, 
  Printer, 
  Download, 
  Settings, 
  SlidersHorizontal, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Plus,
  FileSpreadsheet,
  Layers
} from 'lucide-react';

interface AssetItem {
  id: string;
  code: string;
  name: string;
  brand: string;
  unit: 'lapangan' | 'aula' | 'sampah' | 'kantor';
  valuation: number;
  condition: 'baik' | 'perlu_servis' | 'rusak';
  stickerPrinted: boolean;
  acquiredYear: number;
  location: string;
  imageUrl: string;
}

const INITIAL_ASSETS: AssetItem[] = [
  {
    id: 'ast-1',
    code: 'AST-GOR-001',
    name: 'Karpet Vinyl Bulutangkis Standar BWF Pro (Line 2)',
    brand: 'Enlio Pro Court',
    unit: 'lapangan',
    valuation: 45000000,
    condition: 'baik',
    stickerPrinted: true,
    acquiredYear: 2024,
    location: 'GOR Waskita Wijaya - Lapangan 2',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=200&auto=format&fit=crop&q=60'
  },
  {
    id: 'ast-2',
    code: 'AST-GOR-002',
    name: 'Lampu Sorot LED Stadion Lapangan 1000 Watt',
    brand: 'Philips ArenaVision',
    unit: 'lapangan',
    valuation: 18500000,
    condition: 'baik',
    stickerPrinted: true,
    acquiredYear: 2025,
    location: 'Rangka Atap GOR Lapangan 1 & 2',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=200&auto=format&fit=crop&q=60'
  },
  {
    id: 'ast-3',
    code: 'AST-AUL-001',
    name: 'Sound System Line Array & Mixer Digital 32-Channel',
    brand: 'Yamaha TF3 + Behringer',
    unit: 'aula',
    valuation: 62000000,
    condition: 'baik',
    stickerPrinted: true,
    acquiredYear: 2024,
    location: 'Ruang Operator Audio Aula Serbaguna',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&auto=format&fit=crop&q=60'
  },
  {
    id: 'ast-4',
    code: 'AST-AUL-002',
    name: 'Kursi Banquet Pesta & Sarung Emas (400 Unit)',
    brand: 'Futura FTR-405',
    unit: 'aula',
    valuation: 96000000,
    condition: 'baik',
    stickerPrinted: true,
    acquiredYear: 2023,
    location: 'Gudang Penyimpanan Kursi Aula',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&auto=format&fit=crop&q=60'
  },
  {
    id: 'ast-5',
    code: 'AST-SMP-001',
    name: 'Truk Sampah Dump Dyna 130HT Roda 6',
    brand: 'Toyota Dyna',
    unit: 'sampah',
    valuation: 210000000,
    condition: 'perlu_servis',
    stickerPrinted: true,
    acquiredYear: 2022,
    location: 'Pool Hanggar TPS3R Desa Waru',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&auto=format&fit=crop&q=60'
  },
  {
    id: 'ast-6',
    code: 'AST-SMP-002',
    name: 'Mesin Pencacah Sampah Organik Otomatis 12 PK',
    brand: 'Honda Diesel Engine',
    unit: 'sampah',
    valuation: 28000000,
    condition: 'baik',
    stickerPrinted: false,
    acquiredYear: 2025,
    location: 'Unit Pengolahan Maggot TPS3R',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=60'
  },
  {
    id: 'ast-7',
    code: 'AST-KNT-001',
    name: 'Server Rack & Komputer Kasir All-in-One Touchscreen',
    brand: 'Lenovo ThinkCentre + UPS APC',
    unit: 'kantor',
    valuation: 23000000,
    condition: 'baik',
    stickerPrinted: true,
    acquiredYear: 2025,
    location: 'Loket Layanan Kantor BUMDes',
    imageUrl: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=200&auto=format&fit=crop&q=60'
  }
];

interface InventoryModuleProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function InventoryModule({ onShowToast }: InventoryModuleProps) {
  const [assets, setAssets] = useState<AssetItem[]>(INITIAL_ASSETS);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(INITIAL_ASSETS[0]);
  
  // Autocomplete state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Konfigurasi Cetak Stiker & Printer
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [stickerPaperSize, setStickerPaperSize] = useState<'thermal_58' | 'thermal_80' | 'a4_label'>('thermal_80');
  const [printerConnection, setPrinterConnection] = useState<'bluetooth' | 'usb' | 'network'>('bluetooth');

  // Metrik Penghitungan
  const totalAssetsCount = assets.length;
  const totalValuation = assets.reduce((sum, item) => sum + item.valuation, 0);
  const stickersPrintedCount = assets.filter(a => a.stickerPrinted).length;
  const maintenanceCount = assets.filter(a => a.condition === 'perlu_servis').length;

  // Matching items for autocomplete
  const matchingSuggestions = assets.filter(item => {
    if (!searchKeyword.trim()) return false;
    const q = searchKeyword.toLowerCase();
    return (
      item.code.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  // Filter Aset Berdasarkan Pencarian & Unit Usaha
  const filteredAssets = assets.filter(item => {
    const matchesSearch = 
      item.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.location.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesUnit = selectedUnit === 'all' ? true : item.unit === selectedUnit;
    return matchesSearch && matchesUnit;
  });

  const handleSelectSuggestion = (item: AssetItem) => {
    setSelectedAsset(item);
    setSearchKeyword(item.name);
    setIsDropdownOpen(false);
    onShowToast(`Aset terpilih: ${item.name} (${item.code})`, 'info');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || matchingSuggestions.length === 0) {
      if (e.key === 'ArrowDown' && matchingSuggestions.length > 0) {
        setIsDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % matchingSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + matchingSuggestions.length) % matchingSuggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (matchingSuggestions[highlightedIndex]) {
        handleSelectSuggestion(matchingSuggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const handlePrintSticker = (asset: AssetItem) => {
    setSelectedAsset(asset);
    setIsPrintModalOpen(true);
  };

  const handleExecutePrint = () => {
    if (selectedAsset) {
      setAssets(prev => prev.map(a => a.id === selectedAsset.id ? { ...a, stickerPrinted: true } : a));
    }
    setIsPrintModalOpen(false);
    onShowToast(
      `Stiker QR Barcode untuk ${selectedAsset?.code} berhasil dicetak menggunakan printer ${printerConnection.toUpperCase()} (Ukuran: ${stickerPaperSize})`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
              <span>Menu Inventaris (Aset Tetap, Valuasi & Generator Label Barcode)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AUDIT READY
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Pencatatan kapitalisasi inventaris desa, pelacakan kondisi fisik mesin/alat, dan cetak stiker QR thermal.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('Formulir tambah aset inventaris baru dibuka', 'info')}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Aset Baru</span>
        </button>
      </div>

      {/* SEARCH BAR SESUAI SPESIFIKASI PERSIS DARI PROMPT PENGGUNA */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative z-30">
        <div className="max-w-3xl mx-auto space-y-2">
          {/* Input Element dengan Icon Kaca Pembesar dan Placeholder Persis */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input 
              type="text"
              value={searchKeyword}
              onChange={e => {
                setSearchKeyword(e.target.value);
                setIsDropdownOpen(true);
                setHighlightedIndex(0);
              }}
              onFocus={() => {
                if (matchingSuggestions.length > 0) setIsDropdownOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Cari apa saja: kode aset, Merk,  nama Benda/alat"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-inner"
            />

            {/* Dropdown Hasil Pencarian dengan Navigasi Keyboard ↑ ↓ dan Enter */}
            {isDropdownOpen && matchingSuggestions.length > 0 && (
              <div 
                className="absolute left-0 right-0 top-full mt-2 bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto z-50 divide-y divide-slate-800"
              >
                <div className="px-3 py-2 bg-slate-900/80 text-[10px] text-slate-400 font-bold uppercase tracking-wider flex justify-between">
                  <span>Hasil Rekomendasi ({matchingSuggestions.length} Aset)</span>
                  <span>Gunakan ↑ ↓ dan [Enter] untuk memilih</span>
                </div>
                {matchingSuggestions.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                      idx === highlightedIndex 
                        ? 'bg-emerald-950/60 border-l-4 border-emerald-500 pl-2' 
                        : 'hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0" 
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-white">{item.name}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300 font-mono">
                            {item.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Merk: <span className="text-slate-200 font-semibold">{item.brand}</span> · {item.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400 font-mono block">
                        Rp {item.valuation.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        Unit: {item.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sub-teks (Helper Text) Persis dengan penekanan bold pada kata "pilih" */}
          <p className="text-[11px] text-slate-400 text-center">
            Ketik lalu <strong className="text-white font-black">pilih</strong> dari daftar — detail lengkapnya muncul di bawah. Bisa pakai ↑ ↓ dan Enter.
          </p>
        </div>

        {/* DETAIL LENGKAP ASET TERPILIH DI BAWAH SEARCH BAR */}
        {selectedAsset && (
          <div className="mt-6 pt-6 border-t border-slate-800 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                Detail Lengkap Aset Terpilih
              </span>
              <span className="text-[11px] text-slate-400">
                Terdaftar di Neraca BUMDes sejak {selectedAsset.acquiredYear}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              {/* Foto Aset & QR Code */}
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-800 group">
                  <img 
                    src={selectedAsset.imageUrl} 
                    alt={selectedAsset.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg text-[10px] font-mono font-bold text-white border border-slate-700">
                    {selectedAsset.code}
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-5 h-5 text-cyan-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Stiker Fisik Aset:</span>
                      <span className="text-xs font-bold text-white">
                        {selectedAsset.stickerPrinted ? '✓ Sudah Ditempel' : '⚠️ Belum Ditempel'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePrintSticker(selectedAsset)}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cetak Stiker
                  </button>
                </div>
              </div>

              {/* Rincian Spesifikasi & Valuasi */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300">
                      Unit Usaha: {selectedAsset.unit}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      selectedAsset.condition === 'baik' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      selectedAsset.condition === 'perlu_servis' ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      Kondisi: {selectedAsset.condition === 'baik' ? 'Prima (Baik)' : selectedAsset.condition === 'perlu_servis' ? 'Perlu Servis' : 'Rusak'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white mt-1">
                    {selectedAsset.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Merk / Pabrikan: <strong className="text-slate-200 font-bold">{selectedAsset.brand}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Nilai Kapitalisasi</span>
                    <span className="text-sm font-black text-emerald-400 font-mono block mt-0.5">
                      Rp {selectedAsset.valuation.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Lokasi Penempatan</span>
                    <span className="text-xs font-bold text-slate-200 block mt-0.5 line-clamp-1">
                      {selectedAsset.location}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Tahun Perolehan</span>
                    <span className="text-xs font-bold text-slate-200 block mt-0.5">
                      {selectedAsset.acquiredYear} (Audit Sah)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handlePrintSticker(selectedAsset)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Stiker Label Thermal ({selectedAsset.code})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const newCondition = selectedAsset.condition === 'baik' ? 'perlu_servis' : 'baik';
                      setAssets(prev => prev.map(a => a.id === selectedAsset.id ? { ...a, condition: newCondition } : a));
                      setSelectedAsset(prev => prev ? { ...prev, condition: newCondition } : null);
                      onShowToast(`Kondisi aset ${selectedAsset.name} diperbarui menjadi: ${newCondition}`, 'info');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ubah Status Kondisi Fisik</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tampilan Metrik: Jumlah Aset, Nilai Aset, Stiker Aset, dan Servis */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Jumlah Unit Aset Terdata
          </span>
          <p className="text-2xl font-black text-white mt-1 font-mono">{totalAssetsCount} Unit</p>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Semua Unit Usaha BUMDes</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Nilai Kapitalisasi Aset
          </span>
          <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">
            Rp {(totalValuation / 1000000).toFixed(1)} Juta
          </p>
          <span className="text-[10px] text-slate-500 block mt-0.5">Sesuai Audit Neraca Desa</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Stiker Label QR Tercetak
          </span>
          <p className="text-2xl font-black text-cyan-400 mt-1 font-mono">
            {stickersPrintedCount} / {totalAssetsCount}
          </p>
          <span className="text-[10px] text-slate-500 block mt-0.5">Stiker Fisik Terpasang</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Jadwal Pemeliharaan / Servis
          </span>
          <p className="text-2xl font-black text-amber-400 mt-1 font-mono">{maintenanceCount} Aset</p>
          <span className="text-[10px] text-amber-400/80 block mt-0.5">Truk & Pencacah Sampah</span>
        </div>
      </div>

      {/* Filter Pencarian Sesuai Unit Usaha */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 flex items-center space-x-2 overflow-x-auto shadow-md">
        <span className="text-xs font-bold text-slate-400 px-2 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Pencarian per Unit Usaha:</span>
        </span>

        <button
          type="button"
          onClick={() => setSelectedUnit('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedUnit === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Semua Unit ({assets.length})
        </button>

        <button
          type="button"
          onClick={() => setSelectedUnit('lapangan')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedUnit === 'lapangan' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          🏸 Lapangan Badminton GOR
        </button>

        <button
          type="button"
          onClick={() => setSelectedUnit('aula')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedUnit === 'aula' ? 'bg-blue-500 text-white font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          🏛️ Aula Gedung Serbaguna
        </button>

        <button
          type="button"
          onClick={() => setSelectedUnit('sampah')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedUnit === 'sampah' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          🚛 Hanggar TPS3R & Sampah
        </button>

        <button
          type="button"
          onClick={() => setSelectedUnit('kantor')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedUnit === 'kantor' ? 'bg-purple-500 text-white font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          🏢 Kantor Utama BUMDes
        </button>
      </div>

      {/* Tabel Daftar Barang Lengkap dengan Foto & Identitas */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Tabel Daftar Barang & Aset Tetap Desa
            </h4>
            <span className="text-[11px] text-slate-400">
              Dilengkapi foto barang, kode barcode aset, kondisi fisik, dan generator cetak label stiker
            </span>
          </div>
          <button
            type="button"
            onClick={() => onShowToast('Ekspor daftar inventaris aset ke format CSV/Excel selesai', 'success')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ekspor Data Aset</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Foto & Identitas Aset</th>
                <th className="px-4 py-3.5">Kode Aset</th>
                <th className="px-4 py-3.5">Merk / Spesifikasi</th>
                <th className="px-4 py-3.5">Unit Penempatan</th>
                <th className="px-4 py-3.5">Nilai Perolehan</th>
                <th className="px-4 py-3.5">Kondisi</th>
                <th className="px-5 py-3.5 text-center">Stiker Aset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-850 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={asset.imageUrl} 
                        alt={asset.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-white block leading-snug">{asset.name}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Tahun: {asset.acquiredYear}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-cyan-400 font-bold">
                    {asset.code}
                  </td>

                  <td className="px-4 py-3.5 text-slate-300 font-medium">
                    {asset.brand}
                  </td>

                  <td className="px-4 py-3.5 text-slate-300">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                      {asset.unit}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{asset.location}</span>
                  </td>

                  <td className="px-4 py-3.5 font-mono font-black text-emerald-400">
                    Rp {asset.valuation.toLocaleString('id-ID')}
                  </td>

                  <td className="px-4 py-3.5">
                    {asset.condition === 'baik' && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Baik
                      </span>
                    )}
                    {asset.condition === 'perlu_servis' && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">
                        Perlu Servis
                      </span>
                    )}
                    {asset.condition === 'rusak' && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                        Rusak
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => handlePrintSticker(asset)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{asset.stickerPrinted ? 'Cetak Ulang Stiker' : 'Cetak Stiker Baru'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog Cetak Stiker & Konfigurasi Printer */}
      {isPrintModalOpen && selectedAsset && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-black text-white">Generator Stiker Barcode & Konfigurasi Cetak</h4>
              </div>
              <button 
                type="button" 
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            {/* Preview Stiker yang Siap Dicetak */}
            <div className="p-4 bg-white text-slate-900 rounded-2xl flex items-center space-x-4 border-2 border-dashed border-slate-400 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 border border-slate-300 rounded-xl p-1.5 flex flex-col items-center justify-center shrink-0">
                <QrCode className="w-14 h-14 text-slate-950" />
                <span className="text-[7px] font-mono font-bold tracking-tighter text-slate-600">SCAN AUDIT</span>
              </div>
              <div className="text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-slate-950 block">{selectedAsset.code}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-200 rounded text-slate-800">
                    {stickerPaperSize.toUpperCase()}
                  </span>
                </div>
                <h5 className="font-bold leading-tight text-slate-900 mt-0.5 line-clamp-1">{selectedAsset.name}</h5>
                <span className="text-[10px] text-slate-600 block mt-0.5">Merk: {selectedAsset.brand}</span>
                
                {/* Barcode line simulation */}
                <div className="mt-1.5 flex items-center space-x-0.5 h-4 opacity-80">
                  <div className="w-0.5 h-full bg-black" />
                  <div className="w-1 h-full bg-black" />
                  <div className="w-0.5 h-full bg-black" />
                  <div className="w-1.5 h-full bg-black" />
                  <div className="w-0.5 h-full bg-black" />
                  <div className="w-2 h-full bg-black" />
                  <div className="w-0.5 h-full bg-black" />
                  <div className="w-1 h-full bg-black" />
                  <div className="w-1.5 h-full bg-black" />
                  <div className="w-0.5 h-full bg-black" />
                </div>
                <span className="text-[8px] font-mono font-bold text-slate-500 block mt-0.5">
                  BUMDES WASKITA WIJAYA · WARU, SUKOHARJO
                </span>
              </div>
            </div>

            {/* Konfigurasi Ukuran Cetak */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Pilihan Format Ukuran Cetak Stiker:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStickerPaperSize('thermal_58')}
                    className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-colors ${
                      stickerPaperSize === 'thermal_58' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Thermal 58mm
                  </button>
                  <button
                    type="button"
                    onClick={() => setStickerPaperSize('thermal_80')}
                    className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-colors ${
                      stickerPaperSize === 'thermal_80' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Thermal 80mm
                  </button>
                  <button
                    type="button"
                    onClick={() => setStickerPaperSize('a4_label')}
                    className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-colors ${
                      stickerPaperSize === 'a4_label' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Kertas A4 (24 Label)
                  </button>
                </div>
              </div>

              {/* Konfigurasi Printer */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Koneksi Printer Target:
                </label>
                <select
                  value={printerConnection}
                  onChange={e => setPrinterConnection(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="bluetooth">Bluetooth Thermal Printer (MP-58 / RPP-02N)</option>
                  <option value="usb">Direct USB Cable Thermal (Epson TM-T82)</option>
                  <option value="network">Network IP Printer (LAN Office)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecutePrint}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Kirim Perintah Cetak</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
