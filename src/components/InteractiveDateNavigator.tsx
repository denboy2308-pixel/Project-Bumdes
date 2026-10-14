import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays,
  Sparkles,
  Check,
  RotateCcw
} from 'lucide-react';

export interface DateAvailabilityInfo {
  status: 'available' | 'limited' | 'full' | 'past';
  label: string;
  badge?: string;
}

interface InteractiveDateNavigatorProps {
  selectedDate: string; // format YYYY-MM-DD
  onSelectDate: (date: string) => void;
  accentColor?: 'emerald' | 'blue';
  title?: string;
  subtitle?: string;
  getAvailability?: (dateStr: string) => DateAvailabilityInfo;
  onReserveClick?: (dateStr: string) => void;
}

// Date helper utilities (time-zone safe using local year/month/date)
function parseDate(isoStr: string): Date {
  const [y, m, d] = isoStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
}

function addMonths(date: Date, months: number): Date {
  const res = new Date(date);
  res.setMonth(res.getMonth() + months);
  return res;
}

const INDO_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const INDO_DAYS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const INDO_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function InteractiveDateNavigator({
  selectedDate,
  onSelectDate,
  accentColor = 'emerald',
  title = 'Jadwal & Reservasi Tanggal',
  subtitle,
  getAvailability
}: InteractiveDateNavigatorProps) {
  const [showMonthGrid, setShowMonthGrid] = useState(false);
  const todayISO = useMemo(() => formatDateISO(new Date()), []);
  const selectedDateObj = useMemo(() => parseDate(selectedDate), [selectedDate]);

  // Current view month/year for month grid navigation
  const [viewMonthDate, setViewMonthDate] = useState<Date>(() => parseDate(selectedDate));

  // Determine relation to today
  const dayDifference = useMemo(() => {
    const today = parseDate(todayISO);
    const selected = parseDate(selectedDate);
    const diffTime = selected.getTime() - today.getTime();
    return Math.round(diffTime / (1000 * 3600 * 24));
  }, [selectedDate, todayISO]);

  const relativeLabel = useMemo(() => {
    if (dayDifference === 0) return 'Hari Ini';
    if (dayDifference === -1) return 'Kemarin (Arsip)';
    if (dayDifference === 1) return 'Besok';
    if (dayDifference === 2) return 'Lusa';
    if (dayDifference === -7) return 'Minggu Lalu';
    if (dayDifference === 7) return 'Minggu Depan';
    if (dayDifference < -1) return `${Math.abs(dayDifference)} hari lalu`;
    return `${dayDifference} hari mendatang`;
  }, [dayDifference]);

  // Generate 7-day strip centered around the selected date
  const dateStrip = useMemo(() => {
    const current = parseDate(selectedDate);
    const dates: Date[] = [];
    for (let i = -3; i <= 3; i++) {
      dates.push(addDays(current, i));
    }
    return dates;
  }, [selectedDate]);

  // Month grid calculations
  const monthDays = useMemo(() => {
    const year = viewMonthDate.getFullYear();
    const month = viewMonthDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { date: Date; isCurrentMonth: boolean; iso: string }[] = [];

    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      days.push({ date: d, isCurrentMonth: false, iso: formatDateISO(d) });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true, iso: formatDateISO(d) });
    }

    const totalSlots = Math.ceil(days.length / 7) * 7;
    let nextDay = 1;
    while (days.length < totalSlots) {
      const d = new Date(year, month + 1, nextDay++);
      days.push({ date: d, isCurrentMonth: false, iso: formatDateISO(d) });
    }

    return days;
  }, [viewMonthDate]);

  // Quick navigation helpers
  const handleQuickJump = (daysDelta: number) => {
    const today = parseDate(todayISO);
    const target = addDays(today, daysDelta);
    const iso = formatDateISO(target);
    onSelectDate(iso);
    setViewMonthDate(target);
  };

  const handleStepDay = (step: number) => {
    const current = parseDate(selectedDate);
    const target = addDays(current, step);
    const iso = formatDateISO(target);
    onSelectDate(iso);
    setViewMonthDate(target);
  };

  const handleStepMonth = (months: number) => {
    const current = parseDate(selectedDate);
    const target = addMonths(current, months);
    const iso = formatDateISO(target);
    onSelectDate(iso);
    setViewMonthDate(target);
  };

  // Theme styles
  const isBlue = accentColor === 'blue';
  const primaryBg = isBlue ? 'bg-blue-600' : 'bg-emerald-600';
  const primaryText = isBlue ? 'text-blue-400' : 'text-emerald-400';
  const activeStripBg = isBlue 
    ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-md shadow-blue-900/50 border-blue-400' 
    : 'bg-gradient-to-b from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/50 border-emerald-400';

  const formattedFullDate = useMemo(() => {
    const d = selectedDateObj;
    return `${INDO_DAYS[d.getDay()]}, ${d.getDate()} ${INDO_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }, [selectedDateObj]);

  const getDayStatus = (iso: string): DateAvailabilityInfo => {
    if (getAvailability) return getAvailability(iso);
    const today = parseDate(todayISO);
    const target = parseDate(iso);
    const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diff < 0) return { status: 'past', label: 'Arsip / Lampau', badge: 'Selesai' };
    if (diff === 0) return { status: 'limited', label: 'Hari Ini (Ramai)', badge: 'Hari Ini' };
    if (diff % 5 === 0) return { status: 'full', label: 'Jadwal Penuh', badge: 'Penuh' };
    if (diff % 3 === 0) return { status: 'limited', label: 'Sisa Sedikit', badge: 'Terbatas' };
    return { status: 'available', label: 'Slot Terbuka', badge: 'Tersedia' };
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md text-white">
      
      {/* 1. TOP BAR: Title, Selected Date Badge, Month Stepper & Quick Jump (Wide, Single Row on Desktop) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        
        {/* Left: Title & Active Date Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-2">
            <span className={`w-7 h-7 rounded-xl ${isBlue ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'} flex items-center justify-center text-xs font-black shrink-0`}>
              <CalendarIcon className="w-3.5 h-3.5" />
            </span>
            <h4 className="text-sm font-black text-white whitespace-nowrap">
              {title}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-white whitespace-nowrap">
              {formattedFullDate}
            </span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
              dayDifference < 0 
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50' 
                : dayDifference === 0 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' 
                : 'bg-blue-950 text-blue-300 border border-blue-700/50'
            }`}>
              {relativeLabel}
            </span>
          </div>
        </div>

        {/* Right: Quick Shortcuts & Month Controls (Dense & Clean) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          
          {/* Quick Buttons: Kemarin, Hari Ini, Besok, Lusa */}
          <div className="inline-flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
            <button
              type="button"
              onClick={() => handleQuickJump(-1)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dayDifference === -1 
                  ? `${primaryBg} text-white shadow-xs` 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Cek Jadwal Kemarin"
            >
              Kemarin
            </button>
            <button
              type="button"
              onClick={() => handleQuickJump(0)}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                dayDifference === 0 
                  ? `${primaryBg} text-white shadow-xs` 
                  : 'text-emerald-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hari Ini</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickJump(1)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dayDifference === 1 
                  ? `${primaryBg} text-white shadow-xs` 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Besok
            </button>
            <button
              type="button"
              onClick={() => handleQuickJump(2)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dayDifference === 2 
                  ? `${primaryBg} text-white shadow-xs` 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Lusa
            </button>
          </div>

          {/* Month Stepper: < Bulan Tahun > */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => handleStepMonth(-1)}
              title="Bulan Sebelumnya"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-bold text-white whitespace-nowrap min-w-[110px] text-center">
              {INDO_MONTHS[viewMonthDate.getMonth()].slice(0, 3)} {viewMonthDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => handleStepMonth(1)}
              title="Bulan Berikutnya"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Full Month Calendar Dropdown */}
          <button
            type="button"
            onClick={() => setShowMonthGrid(!showMonthGrid)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              showMonthGrid 
                ? `${primaryBg} text-white border-transparent` 
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Buka / Tutup Kalender Bulanan Penuh"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showMonthGrid ? 'Tutup' : 'Kalender'}</span>
          </button>

          {/* Reset button if navigated far away */}
          {Math.abs(dayDifference) > 2 && (
            <button
              type="button"
              onClick={() => handleQuickJump(0)}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Reset ke Hari Ini"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

        </div>
      </div>

      {/* 2. FULL MONTH POPUP/DROPDOWN (WHEN TOGGLED) */}
      {showMonthGrid && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-300">
              Pilih dari Kalender Bulanan ({INDO_MONTHS[viewMonthDate.getMonth()]} {viewMonthDate.getFullYear()})
            </span>
            <div className="flex items-center gap-2.5 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Tersedia
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Terbatas
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Penuh
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500">
            {INDO_DAYS_SHORT.map(day => (
              <div key={day} className="py-0.5">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthDays.map(({ date, isCurrentMonth, iso }) => {
              const isSelected = iso === selectedDate;
              const isToday = iso === todayISO;
              const statusInfo = getDayStatus(iso);
              
              let dotColor = 'bg-emerald-400';
              if (statusInfo.status === 'past') dotColor = 'bg-slate-600';
              else if (statusInfo.status === 'full') dotColor = 'bg-rose-500';
              else if (statusInfo.status === 'limited') dotColor = 'bg-amber-400';

              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => {
                    onSelectDate(iso);
                    setViewMonthDate(date);
                    setShowMonthGrid(false);
                  }}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center min-h-[36px] cursor-pointer ${
                    isSelected
                      ? `${primaryBg} text-white shadow-xs font-black ring-2 ring-white/30`
                      : isToday
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/50'
                      : isCurrentMonth
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800/80'
                      : 'text-slate-600 hover:text-slate-400 border border-transparent'
                  }`}
                >
                  <span>{date.getDate()}</span>
                  <span className={`w-1 h-1 rounded-full ${dotColor}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. ULTRA-SLEEK 7-DAY HORIZONTAL STRIP (Widescreen Friendly, Fast 1-Click Tap) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => handleStepDay(-1)}
          title="Geser 1 Hari Mundur"
          className="p-2 sm:p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 flex-1">
          {dateStrip.map(date => {
            const iso = formatDateISO(date);
            const isSelected = iso === selectedDate;
            const isToday = iso === todayISO;
            const statusInfo = getDayStatus(iso);

            const diff = Math.round((date.getTime() - parseDate(todayISO).getTime()) / (1000 * 3600 * 24));
            let dayBadge = '';
            if (diff === 0) dayBadge = 'Hari Ini';
            else if (diff === -1) dayBadge = 'Kemarin';
            else if (diff === 1) dayBadge = 'Besok';
            else if (diff === 2) dayBadge = 'Lusa';

            return (
              <button
                key={iso}
                type="button"
                onClick={() => {
                  onSelectDate(iso);
                  setViewMonthDate(date);
                }}
                className={`py-2 px-1 sm:px-2 rounded-xl border transition-all text-center flex flex-col justify-between items-center cursor-pointer min-h-[58px] sm:min-h-[62px] relative overflow-hidden ${
                  isSelected
                    ? activeStripBg
                    : isToday
                    ? 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-emerald-500/60 shadow-xs'
                    : 'bg-slate-950/80 hover:bg-slate-800/90 text-slate-300 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Day of Week + Relative Mini Tag */}
                <div className="flex items-center justify-center gap-1 w-full">
                  <span className={`text-[10px] font-black uppercase ${
                    isSelected ? 'text-white' : 'text-slate-400'
                  }`}>
                    {INDO_DAYS_SHORT[date.getDay()]}
                  </span>
                  {dayBadge && (
                    <span className={`text-[8px] font-bold px-1 rounded ${
                      isSelected 
                        ? 'bg-black/30 text-white' 
                        : isToday 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {dayBadge.slice(0, 3)}
                    </span>
                  )}
                </div>

                {/* Big Date Number */}
                <span className="text-base sm:text-lg font-black leading-tight my-0.5">
                  {date.getDate()}
                </span>

                {/* Availability Status Dot / Label */}
                <div className="flex items-center justify-center gap-1 w-full text-[9px] font-bold truncate">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isSelected 
                      ? 'bg-white' 
                      : statusInfo.status === 'past' 
                      ? 'bg-slate-500' 
                      : statusInfo.status === 'full' 
                      ? 'bg-rose-400' 
                      : statusInfo.status === 'limited' 
                      ? 'bg-amber-400' 
                      : 'bg-emerald-400'
                  }`} />
                  <span className={`hidden sm:inline truncate ${
                    isSelected ? 'text-white font-black' : 'text-slate-400'
                  }`}>
                    {statusInfo.badge || statusInfo.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handleStepDay(1)}
          title="Geser 1 Hari Maju"
          className="p-2 sm:p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
