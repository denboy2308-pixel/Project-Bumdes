import React from 'react';
import { Calendar, Clock, Building, ArrowRight } from 'lucide-react';
import { MASTER_SCHEDULE_DATA } from './bookingTypes';
import { getTodayJakartaISO, getRelativeDateJakartaISO } from '../../utils/dateUtils';

interface BookingScheduleTableProps {
  selectedSlot: string | null;
  onSelectSlot: (facilityName: string, time: string, status: string) => void;
  scheduleData?: typeof MASTER_SCHEDULE_DATA;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  onOpenQuickBooking?: () => void;
  onOpenCheckTicket?: () => void;
}

export default function BookingScheduleTable({
  selectedSlot,
  onSelectSlot,
  scheduleData = MASTER_SCHEDULE_DATA,
  selectedDate,
  onDateChange,
  onOpenQuickBooking,
  onOpenCheckTicket,
}: BookingScheduleTableProps) {
  const todayISO = getTodayJakartaISO();
  const effectiveDate = selectedDate || todayISO;
  const tomorrowISO = getRelativeDateJakartaISO(1);
  const dayAfterISO = getRelativeDateJakartaISO(2);

  const formatDateDisplay = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };
  return (
    <section
      id="section-jadwal-fasilitas"
      className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#E5EAF0] dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header Title */}
        <div className="text-center md:text-left mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-[#20B486] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 mb-2">
              <Building className="w-3.5 h-3.5" />
              Live Monitoring Fasilitas Desa
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172B4D] dark:text-slate-100 tracking-tight uppercase">
              JADWAL FASILITAS
            </h1>
            <p className="text-sm sm:text-base text-[#718096] dark:text-slate-400 font-medium mt-1">
              Ketersediaan Gedung dan Tiga Lapangan Badminton
            </p>
          </div>

          {/* Date Indicator & Quick Jump Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
            {/* Native Date Picker */}
            <div className="flex items-center gap-2 bg-[#F5F8FA] dark:bg-slate-800 border border-[#E5EAF0] dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-[#172B4D] dark:text-slate-200">
              <Calendar className="w-4 h-4 text-[#1677B8] dark:text-sky-400" />
              <input
                type="date"
                min={todayISO}
                value={effectiveDate}
                onChange={(e) => onDateChange && onDateChange(e.target.value)}
                className="bg-transparent outline-none text-xs sm:text-sm font-bold text-[#172B4D] dark:text-slate-200 cursor-pointer"
              />
            </div>

            {/* Quick Date Pills */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => onDateChange && onDateChange(todayISO)}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  effectiveDate === todayISO
                    ? 'bg-[#1677B8] text-white border-[#1677B8]'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-[#E5EAF0] dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => onDateChange && onDateChange(tomorrowISO)}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  effectiveDate === tomorrowISO
                    ? 'bg-[#1677B8] text-white border-[#1677B8]'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-[#E5EAF0] dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                Besok
              </button>
              <button
                type="button"
                onClick={() => onDateChange && onDateChange(dayAfterISO)}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  effectiveDate === dayAfterISO
                    ? 'bg-[#1677B8] text-white border-[#1677B8]'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-[#E5EAF0] dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                Lusa
              </button>
            </div>

            {/* Cek E-Tiket Button */}
            {onOpenCheckTicket && (
              <button
                type="button"
                onClick={onOpenCheckTicket}
                className="px-3 py-2 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#172B4D] dark:text-slate-200 border border-[#E5EAF0] dark:border-slate-700 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>🔍 Cek E-Tiket</span>
              </button>
            )}

            {/* Quick Booking Button */}
            {onOpenQuickBooking && (
              <button
                type="button"
                onClick={onOpenQuickBooking}
                className="px-3 py-2 bg-[#20B486] hover:bg-[#18966f] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>⚡ Booking Kilat</span>
              </button>
            )}

            <a
              href="#section-booking-baru"
              className="px-4 py-2 bg-[#1677B8] hover:bg-[#125f94] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Booking Baru</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 text-xs font-semibold text-[#718096] dark:text-slate-400 bg-[#F5F8FA] dark:bg-slate-800/60 p-3 rounded-xl border border-[#E5EAF0] dark:border-slate-800">
          <span className="font-bold text-[#172B4D] dark:text-slate-200">Keterangan:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-700 dark:text-emerald-400">Tersedia (Bisa Dibooking)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="text-rose-700 dark:text-rose-400">Booked / Terjadwal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#1677B8] dark:bg-sky-400"></span>
            <span className="text-[#1677B8] dark:text-sky-400">Slot Dipilih ({selectedSlot || '19:00'})</span>
          </div>
          <span className="hidden lg:inline text-[11px] text-slate-400 dark:text-slate-500 ml-auto">
            *Klik slot &quot;Tersedia&quot; untuk langsung memilih di formulir reservasi bawah
          </span>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="block sm:hidden text-[11px] text-slate-500 dark:text-slate-400 mb-2 italic">
          ↔ Geser ke samping untuk melihat seluruh lapangan
        </div>

        {/* Schedule Table Container with Horizontal Scroll and Sticky Time Column */}
        <div className="overflow-x-auto rounded-xl border border-[#E5EAF0] dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
          <table className="w-full text-left border-collapse text-sm min-w-[650px]">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 border-b border-[#E5EAF0] dark:border-slate-800 text-[#172B4D] dark:text-slate-200">
                <th className="sticky left-0 z-10 bg-[#F8FAFC] dark:bg-slate-800 py-3.5 px-4 font-bold text-xs uppercase tracking-wider w-24 text-center border-r border-[#E5EAF0] dark:border-slate-700 shadow-[1px_0_0_0_#E5EAF0] dark:shadow-[1px_0_0_0_#334155]">
                  Waktu
                </th>
                <th className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#E5EAF0] dark:border-slate-800">
                  Gedung
                </th>
                <th className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#E5EAF0] dark:border-slate-800">
                  Lapangan 1
                </th>
                <th className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#E5EAF0] dark:border-slate-800">
                  Lapangan 2
                </th>
                <th className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider">
                  Lapangan 3
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF0] dark:divide-slate-800 font-medium text-xs sm:text-sm">
              {scheduleData.map((row, idx) => {
                const isHourSelected = selectedSlot === row.time;

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isHourSelected
                        ? 'bg-blue-50/60 dark:bg-sky-950/40'
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Column 1: Waktu (Sticky column on mobile) */}
                    <td className="sticky left-0 z-10 py-3 px-4 font-bold text-[#172B4D] dark:text-slate-200 text-center border-r border-[#E5EAF0] dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/90 shadow-[1px_0_0_0_#E5EAF0] dark:shadow-[1px_0_0_0_#334155]">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{row.time}</span>
                      </div>
                    </td>

                    {/* Column 2: Gedung */}
                    <td className="py-3 px-4 border-r border-[#E5EAF0] dark:border-slate-800">
                      {row.gedung.status === 'Tersedia' ? (
                        <button
                          type="button"
                          onClick={() => onSelectSlot('Gedung Serbaguna', row.time, 'Tersedia')}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{row.gedung.label}</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>{row.gedung.label}</span>
                        </span>
                      )}
                    </td>

                    {/* Column 3: Lapangan 1 */}
                    <td className="py-3 px-4 border-r border-[#E5EAF0] dark:border-slate-800">
                      {row.lapangan1.status === 'Tersedia' ? (
                        <button
                          type="button"
                          onClick={() => onSelectSlot('Lapangan Badminton 1', row.time, 'Tersedia')}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{row.lapangan1.label}</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span>{row.lapangan1.label}</span>
                        </span>
                      )}
                    </td>

                    {/* Column 4: Lapangan 2 */}
                    <td className="py-3 px-4 border-r border-[#E5EAF0] dark:border-slate-800">
                      {row.lapangan2.status === 'Tersedia' ? (
                        <button
                          type="button"
                          onClick={() => onSelectSlot('Lapangan Badminton 2', row.time, 'Tersedia')}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{row.lapangan2.label}</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span>{row.lapangan2.label}</span>
                        </span>
                      )}
                    </td>

                    {/* Column 5: Lapangan 3 */}
                    <td className="py-3 px-4">
                      {row.lapangan3.status === 'Tersedia' ? (
                        <button
                          type="button"
                          onClick={() => onSelectSlot('Lapangan Badminton 3', row.time, 'Tersedia')}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{row.lapangan3.label}</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span>{row.lapangan3.label}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
