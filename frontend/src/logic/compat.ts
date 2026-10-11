// "Compatibil" = someone going to the same event, with at least one mode in
// common and at least one shared interest (README §5).
import type {Goal, Person} from "../data/types";

export function commonInterests(a: Person, b: Person): string[] {
  const mine = new Set(a.interests ?? []);
  return (b.interests ?? []).filter((i) => mine.has(i));
}

export function commonEvents(a: Person, b: Person): string[] {
  const mine = new Set(a.goingTo ?? []);
  return (b.goingTo ?? []).filter((e) => mine.has(e));
}

export function sharesGoal(a: Person, b: Person): boolean {
  return a.goals.some((g) => b.goals.includes(g));
}

export function isCompatible(me: Person, other: Person, eventId: string): boolean {
  return (
    me.id !== other.id &&
    (other.goingTo ?? []).includes(eventId) &&
    sharesGoal(me, other) &&
    commonInterests(me, other).length > 0
  );
}

// Profiles shown in Connect: going to the event and visible in the selected mode.
export function connectCandidates(people: Person[], eventId: string, mode: Goal, excluded: Set<string>): Person[] {
  return people.filter((p) => (p.goingTo ?? []).includes(eventId) && p.goals.includes(mode) && !excluded.has(p.id));
}

export function sharedEventsLabel(n: number): string {
  return n === 1 ? "1 eveniment comun" : `${n} evenimente comune`;
}
