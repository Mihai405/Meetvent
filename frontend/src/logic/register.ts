// Register validations (README §4 Register and §6).
import type {Goal} from "../data/types";
import {ageOn} from "./dates";

export const MIN_INTERESTS = 3;
export const MIN_AGE = 18;

export function emailError(email: string): string | undefined {
  if (!email.trim()) return "Introdu adresa de email.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return "Adresa de email nu pare validă.";
  return undefined;
}

export function passwordError(password: string): string | undefined {
  if (password.length < 8) return "Parola trebuie să aibă minim 8 caractere.";
  if (!/\d/.test(password)) return "Adaugă cel puțin o cifră.";
  if (!/[A-ZĂÂÎȘȚ]/.test(password)) return "Adaugă cel puțin o literă mare.";
  return undefined;
}

export function firstNameError(name: string): string | undefined {
  return name.trim() ? undefined : "Spune-ne cum te cheamă.";
}

// Parses "ZZ / LL / AAAA" (spaces optional). Returns undefined for impossible dates.
export function parseBirthDate(input: string): Date | undefined {
  const m = input.replace(/\s/g, "").match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (!m) return undefined;
  const [day, month, year] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return undefined;
  return d;
}

export function birthDateError(input: string, now: Date): string | undefined {
  const d = parseBirthDate(input);
  if (!d || d > now) return "Folosește formatul ZZ / LL / AAAA.";
  if (ageOn(d, now) < MIN_AGE) return "Trebuie să ai cel puțin 18 ani.";
  return undefined;
}

// Formats digits typed into the birth date field as "ZZ / LL / AAAA".
export function maskBirthDate(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean);
  return parts.join(" / ");
}

export function preferencesHint(interestCount: number, goals: Goal[]): string {
  if (interestCount < MIN_INTERESTS) return `Mai alege ${MIN_INTERESTS - interestCount}.`;
  if (goals.length === 0) return "Alege și ce cauți.";
  return "Perfect, ești gata.";
}

export function canFinishRegistration(interestCount: number, goals: Goal[]): boolean {
  return interestCount >= MIN_INTERESTS && goals.length > 0;
}
