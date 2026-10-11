// Romanian date labels used across the screens.

const DAYS_SHORT = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
const DAYS_LONG = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
const MONTHS_SHORT = ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "nov", "dec"];
const MONTHS_LONG = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"];

// Parse "2026-10-16T22:00" as local time (the mock data has no time zone).
export function parseLocal(iso: string): Date {
  const [date, time = "00:00"] = iso.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm);
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatTime(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// "Azi · 21:00" or "Vin, 16 oct · 22:00"
export function formatWhen(iso: string, now: Date): string {
  const d = parseLocal(iso);
  const day = isSameDay(d, now) ? "Azi" : `${DAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
  return `${day} · ${formatTime(d)}`;
}

// "Azi" or "17 oct" (date badge on event cards)
export function formatBadgeDate(iso: string, now: Date): string {
  const d = parseLocal(iso);
  return isSameDay(d, now) ? "Azi" : `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

// "Sâm 17 oct" (compact, used in conversation context lines)
export function formatShortDay(iso: string): string {
  const d = parseLocal(iso);
  return `${DAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

// "Vineri, 16 octombrie"
export function formatLongDate(iso: string): string {
  const d = parseLocal(iso);
  return `${DAYS_LONG[d.getDay()]}, ${d.getDate()} ${MONTHS_LONG[d.getMonth()]}`;
}

// "22:00 – 05:00" or "22:00"
export function formatTimeRange(startIso: string, endIso?: string): string {
  const start = formatTime(parseLocal(startIso));
  return endIso ? `${start} – ${formatTime(parseLocal(endIso))}` : start;
}

export function ageOn(birthDate: Date, now: Date): number {
  let age = now.getFullYear() - birthDate.getFullYear();
  const beforeBirthday =
    now.getMonth() < birthDate.getMonth() || (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate());
  if (beforeBirthday) age--;
  return age;
}
