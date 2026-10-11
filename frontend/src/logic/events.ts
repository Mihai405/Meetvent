import type {Category, EventItem} from "../data/types";
import {isSameDay, parseLocal} from "./dates";

export type WhenFilter = "all" | "today" | "week";

export type EventFilters = {
  category: Category | "all";
  when: WhenFilter;
  query?: string;
};

// "Săptămâna asta" covers today and the next 8 days (through the following weekend).
const WEEK_DAYS = 8;

function normalize(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function matchesWhen(event: EventItem, when: WhenFilter, now: Date): boolean {
  if (when === "all") return true;
  const start = parseLocal(event.startsAt);
  if (when === "today") return isSameDay(start, now);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + WEEK_DAYS + 1);
  return start >= today && start < weekEnd;
}

export function matchesQuery(event: EventItem, query: string | undefined): boolean {
  if (!query || !query.trim()) return true;
  const q = normalize(query);
  return [event.title, event.venue, ...(event.tags ?? [])].some((field) => normalize(field).includes(q));
}

// Category, date and search filters combine (README §4, Evenimente).
export function filterEvents(events: EventItem[], filters: EventFilters, now: Date): EventItem[] {
  return events
    .filter((e) => filters.category === "all" || e.category === filters.category)
    .filter((e) => matchesWhen(e, filters.when, now))
    .filter((e) => matchesQuery(e, filters.query))
    .sort((a, b) => parseLocal(a.startsAt).getTime() - parseLocal(b.startsAt).getTime());
}

// 1200 -> "1.2k", 410 -> "410"
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${Number.isInteger(k) ? k : k.toFixed(1)}k`;
}

export function eventCountLabel(n: number): string {
  return n === 1 ? "1 eveniment" : `${n} evenimente`;
}
