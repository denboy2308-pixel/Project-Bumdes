/**
 * Date helper utilities with Asia/Jakarta (WIB - UTC+7) timezone support.
 * Ensures consistent current date defaults and past-date validation across the application.
 */

export function getTodayJakartaISO(): string {
  // Always compute current date in Asia/Jakarta timezone formatted as YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

export function isPastDateJakarta(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = getTodayJakartaISO();
  return dateStr < today;
}

export function getRelativeDateJakartaISO(offsetDays: number): string {
  const [y, m, d] = getTodayJakartaISO().split('-').map(Number);
  const date = new Date(y, m - 1, d + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatJakartaDateDisplay(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  try {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('id-ID', options || {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}
