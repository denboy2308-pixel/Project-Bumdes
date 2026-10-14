import React, { useState } from 'react';
import { Calculator, Recycle, Coins, Sparkles, Leaf, Trees, Droplets, Zap, Plus, Trash2, ArrowRight, MessageSquare, CheckCircle2 } from 'lucide-react';

interface WasteItem {
  id: string;
  name: string;
  pricePerKg: number;
  category: 'Plastik' | 'Kertas' | 'Logam';
  co2Factor: number; // kg CO2 saved per kg
  waterFactor: number; // Liters water saved per kg
  iconEmoji: string;
}

const WASTE_CATALOG: WasteItem[] = [
  { id: '1', name: 'Botol Plastik PET (Bersih & Tanpa Label)', pricePerKg: 2500, category: 'Plastik', co2Factor: 1.5, waterFactor: 2.2, iconEmoji: '🍾' },
  { id: '2', name: 'Kardus Bekas & Box Gelombang', pricePerKg: 1800, category: 'Kertas', co2Factor: 1.1, waterFactor: 7.0, iconEmoji: '📦' },
  { id: '3', name: 'Kaleng Minuman Aluminium', pricePerKg: 15000, category: 'Logam', co2Factor: 9.0, waterFactor: 14.0, iconEmoji: '🥫' },
  { id: '4', name: 'Kertas HVS Kantor / Buku Bekas', pricePerKg: 4000, category: 'Kertas', co2Factor: 1.3, waterFactor: 8.5, iconEmoji: '📄' },
  { id: '5', name: 'Koran Bekas & Majalah', pricePerKg: 3000, category: 'Kertas', co2Factor: 1.2, waterFactor: 6.0, iconEmoji: '📰' },
  { id: '6', name: 'Gelas Plastik Bening / Mineral', pricePerKg: 3200, category: 'Plastik', co2Factor: 1.6, waterFactor: 2.5, iconEmoji: '🥤' },
  { id: '7', name: 'Besi Bekas & Logam Campuran', pricePerKg: 5000, category: 'Logam', co2Factor: 2.0, waterFactor: 5.0, iconEmoji: '⚙️' }
];

export default function WasteCalculator() {
  const [selectedItems, setSelectedItems] = useState<{ itemId: string; weightKg: number }[]>([
    { itemId: '1', weightKg: 5 },
    { itemId: '2', weightKg: 10 }
  ]);
  const [filterCategory, setFilterCategory] = useState<'Semua' | 'Plastik' | 'Kertas' | 'Logam'>('Semua');

  const handleUpdateWeight = (itemId: string, newWeight: number) => {
    if (newWeight <= 0) {
      setSelectedItems(prev => prev.filter(i => i.itemId !== itemId));
    } else {
      setSelectedItems(prev => {
        const exists = prev.find(i => i.itemId === itemId);
        if (exists) {
          return prev.map(i => i.itemId === itemId ? { ...i, weightKg: newWeight } : i);
        } else {
          return [...prev, { itemId, weightKg: newWeight }];
        }
      });
    }
  };

  const handleAddItem = (itemId: string) => {
    const exists = selectedItems.find(i => i.itemId === itemId);
    if (!exists) {
      setSelectedItems(prev => [...prev, { itemId, weightKg: 2 }]);
    }
  };

  // Calculations
  let totalCash = 0;
  let totalWeightKg = 0;
  let totalCO2Saved = 0;
  let totalWaterSaved = 0;

  selectedItems.forEach(item => {
    const catalogItem = WASTE_CATALOG.find(c => c.id === item.itemId);
    if (catalogItem) {
      totalCash += catalogItem.pricePerKg * item.weightKg;
      totalWeightKg += item.weightKg;
      totalCO2Saved += catalogItem.co2Factor * item.weightKg;
      totalWaterSaved += catalogItem.waterFactor * item.weightKg;
    }
  });

  const estimatedTreesSaved = (totalCO2Saved / 20).toFixed(1);

  const filteredCatalog = WASTE_CATALOG.filter(item => 
    filterCategory === 'Semua' || item.category === filterCategory
  );

  const handleSendWAEstimasi = () => {
    let itemDetails = selectedItems.map(item => {
      const cat = WASTE_CATALOG.find(c => c.id === item.itemId);
      return `- ${cat?.name}: ${item.weightKg} Kg (Rp ${(cat ? cat.pricePerKg * item.weightKg : 0).toLocaleString('id-ID')})`;
    }).join('\n');

    const text = `Halo Admin Bank Sampah BUMDES Waskita Wijaya, saya ingin berkonsultasi estimasi setoran sampah saya:\n\n` +
      `📦 *Rincian Barang:*\n${itemDetails}\n\n` +
      `⚖️ *Total Berat:* ${totalWeightKg} Kg\n` +
      `💰 *Estimasi Hasil Tabungan:* Rp ${totalCash.toLocaleString('id-ID')}\n` +
      `🌱 *Dampak Lingkungan:* Mencegah ${totalCO2Saved.toFixed(1)} Kg Emisi CO2!\n\n` +
      `Kapan saya bisa menyetorkan barang ini ke posko? Terima kasih.`;

    window.open(`https://wa.me/6282134567890?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
            <Calculator className="w-3.5 h-3.5" />
            <span>Kalkulator Cerdas Bank Sampah</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Simulasi Hasil Tabungan & Dampak Hijau
          </h3>
          <p className="text-xs text-slate-400">
            Pilih jenis sampah rumah tangga dan masukkan estimasi berat untuk mengetahui nilai rupiah serta kontribusi lingkungan Anda.
          </p>
        </div>

        {/* Live Total Display */}
        <div className="bg-gradient-to-r from-emerald-900/80 to-teal-900/80 p-4 rounded-2xl border border-emerald-500/30 text-right shrink-0">
          <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Estimasi Uang Masuk</p>
          <p className="text-2xl font-black text-emerald-400 mt-0.5">
            Rp {totalCash.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-slate-300 mt-0.5">Dari {totalWeightKg} Kg total sampah kering</p>
        </div>
      </div>

      {/* Grid Layout: Left Catalog Picker / Right Itemized Receipt & Eco Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Waste Item Selector */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Recycle className="w-4 h-4 text-emerald-400" />
              <span>1. Pilih Katalog Sampah</span>
            </h4>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5">
              {(['Semua', 'Plastik', 'Kertas', 'Logam'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    filterCategory === cat 
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-sm' 
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Item Catalog List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
            {filteredCatalog.map((item) => {
              const selected = selectedItems.find(s => s.itemId === item.id);
              return (
                <div 
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    selected 
                      ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/30' 
                      : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{item.iconEmoji}</span>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">{item.name}</p>
                        <p className="text-[10px] text-emerald-400 font-bold mt-0.5">
                          Rp {item.pricePerKg.toLocaleString('id-ID')} / Kg
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between">
                    {selected ? (
                      <div className="flex items-center space-x-2 w-full justify-between">
                        <span className="text-[10px] font-bold text-slate-400">Berat (Kg):</span>
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => handleUpdateWeight(item.id, selected.weightKg - 1)}
                            className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={selected.weightKg}
                            onChange={(e) => handleUpdateWeight(item.id, parseFloat(e.target.value) || 0)}
                            className="w-12 text-center bg-slate-900 border border-slate-700 rounded-md text-xs font-bold text-emerald-300 py-0.5 focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdateWeight(item.id, selected.weightKg + 1)}
                            className="w-6 h-6 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddItem(item.id)}
                        className="w-full py-1.5 bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah ke Hitungan</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Eco Impact & Action */}
        <div className="lg:col-span-5 space-y-5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>2. Estimasi Dampak Lingkungan</span>
          </h4>

          {/* Impact Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5" />
                <span>Cegah CO2</span>
              </div>
              <p className="text-lg font-black text-white">{totalCO2Saved.toFixed(1)} <span className="text-xs font-normal text-slate-400">Kg</span></p>
              <p className="text-[9px] text-slate-400">Pengurangan emisi rumah kaca</p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-1">
              <div className="flex items-center space-x-1.5 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                <Droplets className="w-3.5 h-3.5" />
                <span>Hemat Air</span>
              </div>
              <p className="text-lg font-black text-white">{totalWaterSaved.toFixed(0)} <span className="text-xs font-normal text-slate-400">Liters</span></p>
              <p className="text-[9px] text-slate-400">Air bersih yang diselamatkan</p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-1 col-span-2 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                  <Trees className="w-3.5 h-3.5" />
                  <span>Setara Menanam</span>
                </div>
                <p className="text-base font-black text-white">{estimatedTreesSaved} <span className="text-xs font-normal text-slate-400">Pohon Dewasa</span></p>
              </div>
              <span className="text-2xl">🌲</span>
            </div>
          </div>

          {/* Action WA button */}
          <button
            onClick={handleSendWAEstimasi}
            disabled={selectedItems.length === 0}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Setor & Tanya Posko via WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
}
