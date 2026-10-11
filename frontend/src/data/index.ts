// Prototype data: mock-data.json from the design handoff plus the few values the
// screens show that the JSON doesn't contain (curation, likes, display times).
import raw from "./mockData.json";
import type {SceneKind} from "../illustrations/Scene";
import type {Artist, Category, Conversation, CurrentUser, EventItem, Goal, Person} from "./types";

// mock-data.json lists only "techno" for the current user, but the design's
// conversations and "N evenimente comune" counts assume these four events.
export const currentUser = {...raw.currentUser, goingTo: ["techno", "derby", "galerii", "startup"]} as CurrentUser;
export const people = raw.people as Person[];
export const events = raw.events as EventItem[];
export const conversations = raw.conversations as Conversation[];
export const interestOptions: string[] = raw.interestOptions;

// "Today" in the prototype, so relative labels ("Azi", "Săptămâna asta") match the design.
export const PROTOTYPE_NOW = new Date(2026, 9, 10, 12, 0);

export const CITY = "Cluj-Napoca";

export const GOALS: {id: Goal; label: string}[] = [
  {id: "friends", label: "Prieteni"},
  {id: "dating", label: "Dating"},
  {id: "networking", label: "Networking"},
];

export const CATEGORIES: {id: Category | "all"; label: string}[] = [
  {id: "all", label: "Toate"},
  {id: "music", label: "Muzică"},
  {id: "sport", label: "Sport"},
  {id: "art", label: "Artă"},
  {id: "tech", label: "Tech"},
  {id: "comedy", label: "Comedie"},
  {id: "film", label: "Film"},
];

export const CATEGORY_LABEL: Record<Category, string> = {
  music: "Muzică", sport: "Sport", art: "Artă", tech: "Tech", comedy: "Comedie", film: "Film",
};

const EVENT_SCENE: Record<string, SceneKind> = {
  jazz: "jazz", startup: "tech", techno: "concert", derby: "football",
  galerii: "gallery", standup: "comedy", film: "film", foto: "photo",
};

export function sceneFor(eventId: string): SceneKind {
  return EVENT_SCENE[eventId] ?? "concert";
}

// Illustrated placeholder portrait for a person id ("u_ioana" -> "ioana").
export function portraitFor(personId: string): string {
  return personId.replace(/^u_/, "");
}

export const home = {
  nextEventId: "techno",
  trendingIds: ["derby", "galerii", "jazz"],
  weekendIds: ["standup", "film"],
};

// People who already liked the current user: liking them back is a match.
export const likedBy = ["u_ioana", "u_maria"];
export const likesCount = 12;
export const newConnectionIds = ["u_ioana", "u_maria", "u_bianca", "u_cristi"];

// Display time and short event label per conversation, as shown in Messages.
export const conversationMeta: Record<string, {time: string; preview?: string}> = {
  u_radu: {time: "acum 2 min"},
  u_ioana: {time: "14:20"},
  u_alex: {time: "Ieri"},
  u_maria: {time: "Joi"},
};

export const myTopArtists: Artist[] = [
  {name: "Bicep", genre: "Electronic"},
  {name: "Bonobo", genre: "Downtempo"},
];

export const defaultIcebreakers = ["Salut! La ce oră ajungi?", "Mai mergi cu cineva?", "Prima oară la un astfel de eveniment?"];

export const eventDescription =
  "[Descrierea evenimentului, scrisă de organizator – line-up, reguli de acces, dress code. Afișăm doar primele 3 rânduri ca pagina să rămână scurtă.]";

export const venueAddress = "[Adresa locației]";

export function getEvent(id: string): EventItem | undefined {
  return events.find((e) => e.id === id);
}

export function getPerson(id: string): Person | undefined {
  if (id === currentUser.id) return currentUser;
  return people.find((p) => p.id === id);
}
