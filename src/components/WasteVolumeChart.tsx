import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, Info } from 'lucide-react';

interface MonthlyData {
  month: string;
  plastik: number;
  kertas: number;
  logam: number;
  total: number;
}

const data: MonthlyData[] = [
  { month: 'Januari', plastik: 320, kertas: 450, logam: 120, total: 890 },
  { month: 'Februari', plastik: 380, kertas: 490, logam: 150, total: 1020 },
  { month: 'Maret', plastik: 450, kertas: 520, logam: 180, total: 1150 },
  { month: 'April', plastik: 510, kertas: 580, logam: 210, total: 1300 },
  { month: 'Mei', plastik: 580, kertas: 640, logam: 240, total: 1460 },
  { month: 'Juni', plastik: 670, kertas: 710, logam: 290, total: 1670 },
];

type CategoryType = 'all' | 'plastik' | 'kertas' | 'logam';

export default function WasteVolumeChart() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  const categories = [
    { id: 'all' as CategoryType, name: 'Semua Kategori', color: '#10b981' },
    { id: 'plastik' as CategoryType, name: 'Plastik (PET)', color: '#3b82f6' },
    { id: 'kertas' as CategoryType, name: 'Kertas & Karton', color: '#f59e0b' },
    { id: 'logam' as CategoryType, name: 'Logam & Kaca', color: '#a855f7' },
  ];

  const getBarColor = (category: CategoryType) => {
    switch (category) {
      case 'plastik': return '#3b82f6';
      case 'kertas': return '#f59e0b';
      case 'logam': return '#a855f7';
      default: return '#10b981';
    }
  };

  const currentTotal = data.reduce((acc, curr) => {
    if (activeCategory === 'all') return acc + curr.total;
    return acc + curr[activeCategory];
  }, 0);

  const averageVolume = Math.round(currentTotal / data.length);

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-5 transition-colors duration-300 shadow-sm">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="space-y-1">
          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>Tren Volume Sampah Bulanan (2026)</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Total akumulasi setoran sampah anorganik warga Desa Waru ke Bank Sampah.
          </p>
        </div>

        {/* Stats Highlight */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200/40 dark:border-slate-800 shadow-sm self-start sm:self-auto">
          <div className="text-left">
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Rata-rata / Bulan</p>
            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{averageVolume.toLocaleString('id-ID')} kg</span>
            </p>
          </div>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/50 dark:bg-slate-900/60 rounded-xl">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 min-w-[100px] text-center text-xs font-bold py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Recharts Container */}
      <div className="w-full h-64 sm:h-72 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value} kg`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148, 163, 184, 0.15)', radius: [8, 8, 0, 0] }}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(51, 65, 85, 0.5)',
                borderRadius: '12px',
                padding: '10px 12px',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
              }}
              labelStyle={{ fontWeight: 800, color: '#10b981', marginBottom: '4px' }}
              formatter={(value: any, name: any) => {
                const label = name === 'total' ? 'Total Volume' : name.charAt(0).toUpperCase() + name.slice(1);
                return [`${value} kg`, label];
              }}
            />
            {activeCategory === 'all' ? (
              <>
                <Legend 
                  verticalAlign="top" 
                  height={32}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingBottom: 10 }}
                />
                <Bar dataKey="plastik" name="Plastik" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="kertas" name="Kertas" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="logam" name="Logam & Lain" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </>
            ) : (
              <Bar 
                dataKey={activeCategory} 
                name={categories.find(c => c.id === activeCategory)?.name || ''} 
                fill={getBarColor(activeCategory)}
                radius={[8, 8, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(activeCategory)}
                    opacity={0.85 + (index / data.length) * 0.15} // dynamic highlight for newer months
                  />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Banner */}
      <div className="flex gap-3 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 text-xs text-slate-700 dark:text-slate-300">
        <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-emerald-900 dark:text-emerald-400">Sinergi Kebersihan & Ekonomi</p>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
            Terdapat peningkatan partisipasi warga sebesar <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">87%</strong> dari Januari ke Juni. Melalui pemilahan yang konsisten, tabungan kas warga meningkat seiring dengan berkurangnya tumpukan sampah liar di sekitar pemukiman Desa Waru.
          </p>
        </div>
      </div>
    </div>
  );
}
