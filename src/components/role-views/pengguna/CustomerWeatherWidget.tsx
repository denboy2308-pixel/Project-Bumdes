import React, { useState, useEffect } from 'react';
import { 
  CloudSun, Wind, Droplets, RefreshCw, Sparkles, 
  ChevronRight, Calendar, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import { fetchWaruWeather, WaruWeatherForecast } from '../../../services/freeApiService';

interface CustomerWeatherWidgetProps {
  onSelectBooking?: () => void;
  compact?: boolean;
}

export default function CustomerWeatherWidget({ onSelectBooking, compact = false }: CustomerWeatherWidgetProps) {
  const [weather, setWeather] = useState<WaruWeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWeather = async () => {
    setLoading(true);
    try {
      const data = await fetchWaruWeather();
      setWeather(data);
    } catch {
      // Handled in service fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  if (loading || !weather) {
    return (
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/80 border border-sky-200 dark:border-sky-900/60 animate-pulse flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-200 dark:bg-slate-700" />
          <div className="space-y-1.5">
            <div className="w-24 h-3 bg-sky-200 dark:bg-slate-700 rounded" />
            <div className="w-36 h-2 bg-sky-100 dark:bg-slate-700 rounded" />
          </div>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Memuat radar cuaca satelit...</span>
      </div>
    );
  }

  // Recommendation logic for booking badminton / event
  const isGoodForSports = !weather.isRainy && weather.temperature <= 33;

  if (compact) {
    return (
      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{weather.weatherIcon}</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white">{weather.temperature}°C</span>
              <span className="text-slate-500 font-medium">· {weather.weatherDesc}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Desa Waru, Baki · Angin {weather.windSpeed} km/j · Kelembapan {weather.humidity}%
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadWeather}
          title="Perbarui Cuaca"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs relative overflow-hidden space-y-4">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-900 dark:text-white">
            Prakiraan Cuaca Desa Waru
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
            Satelit: {weather.lastUpdated} WIB
          </span>
        </div>

        <button
          type="button"
          onClick={loadWeather}
          className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Perbarui</span>
        </button>
      </div>

      {/* Main Condition Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        
        {/* Current Condition */}
        <div className="sm:col-span-2 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700/60 shadow-xs flex items-center justify-center text-2xl shrink-0 border border-slate-200/80 dark:border-slate-600">
            {weather.weatherIcon}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {weather.temperature}°C
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {weather.weatherDesc}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sensasi suhu: <strong className="text-slate-700 dark:text-slate-300">{weather.apparentTemperature}°C</strong> · Kec. Baki, Kab. Sukoharjo
            </p>
          </div>
        </div>

        {/* Atmosphere Stats */}
        <div className="flex sm:flex-col justify-between sm:justify-center sm:items-end gap-1.5 text-xs border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-700 pt-2 sm:pt-0 sm:pl-4">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span>Kelembapan: <strong className="text-slate-800 dark:text-slate-200">{weather.humidity}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Wind className="w-3.5 h-3.5 text-teal-500" />
            <span>Angin: <strong className="text-slate-800 dark:text-slate-200">{weather.windSpeed} km/j</strong></span>
          </div>
        </div>
      </div>

      {/* Sports / Outdoor Recommendation Banner */}
      <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
        isGoodForSports
          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
          : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-2">
          {isGoodForSports ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span className="text-xs font-medium leading-relaxed">
            {isGoodForSports
              ? 'Kondisi cuaca sangat ideal untuk sesi main di GOR Badminton & aktivitas warga.'
              : 'Ada kemungkinan gerimis, lapangan indoor GOR Waru beratap siap digunakan.'}
          </span>
        </div>

        {onSelectBooking && (
          <button
            type="button"
            onClick={onSelectBooking}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs shrink-0 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Reservasi GOR</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Hourly Quick Strip */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80">
        <div className="text-[11px] font-semibold text-slate-500 mb-2">
          Prakiraan Per Jam
        </div>
        <div className="grid grid-cols-5 gap-2">
          {weather.hourlyForecast.map((h, idx) => (
            <div 
              key={idx} 
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 text-center space-y-1"
            >
              <div className="text-[10px] font-mono text-slate-500">{h.time}</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">{h.temp}°C</div>
              <div className="text-[10px] text-slate-500">
                {h.rainProb > 0 ? `🌧️ ${h.rainProb}%` : '☀️ Cerah'}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
