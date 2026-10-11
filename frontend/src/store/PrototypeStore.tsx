// In-memory state for the UI prototype. Replaced by backend calls later.
import {createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState} from "react";
import {conversations as seedConversations, currentUser, defaultIcebreakers, likedBy} from "../data";
import type {ChatMessage, Goal} from "../data/types";
import {formatTime} from "../logic/dates";

export type Thread = {with: string; eventId: string; unread: number; messages: ChatMessage[]; icebreakers: string[]};

type SwipeAction = "pass" | "like" | "hello";

type Store = {
  loggedIn: boolean;
  logIn: () => void;
  logOut: () => void;

  saved: Set<string>;
  toggleSaved: (eventId: string) => void;
  going: Set<string>;
  toggleGoing: (eventId: string) => void;

  goals: Goal[];
  toggleGoal: (goal: Goal) => void;
  privacy: {showEvents: boolean; showDistance: boolean};
  setPrivacy: (key: "showEvents" | "showDistance", value: boolean) => void;

  seen: Set<string>;
  swipe: (personId: string, eventId: string, action: SwipeAction) => {matched: boolean};
  resetSeen: () => void;

  threads: Thread[];
  getThread: (personId: string) => Thread | undefined;
  openThread: (personId: string, eventId: string) => void;
  sendMessage: (personId: string, text: string) => void;
  markRead: (personId: string) => void;

  toast: string | null;
  showToast: (text: string) => void;
};

const StoreContext = createContext<Store | null>(null);

function seedThreads(): Thread[] {
  return seedConversations.map((c) => ({
    with: c.with,
    eventId: c.eventId,
    unread: c.unread ?? 0,
    icebreakers: c.icebreakers ?? defaultIcebreakers,
    messages: c.messages ?? (c.lastMessage
      ? [{
          from: c.lastMessage.startsWith("Tu: ") ? currentUser.id : c.with,
          text: c.lastMessage.replace(/^Tu: /, ""),
          at: c.at ?? "",
        }]
      : []),
  }));
}

const now = () => formatTime(new Date());

export function PrototypeStoreProvider({children, initiallyLoggedIn = false}: {children: ReactNode; initiallyLoggedIn?: boolean}) {
  const [loggedIn, setLoggedIn] = useState(initiallyLoggedIn);
  const [saved, setSaved] = useState(() => new Set(["techno", "derby"]));
  const [going, setGoing] = useState(() => new Set(currentUser.goingTo ?? []));
  const [goals, setGoals] = useState<Goal[]>(currentUser.goals);
  const [privacy, setPrivacyState] = useState(currentUser.privacy);
  const [seen, setSeen] = useState(() => new Set<string>());
  const [threads, setThreads] = useState(seedThreads);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toggleIn = (setter: typeof setSaved) => (id: string) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const showToast = useCallback((text: string) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const openThread = useCallback((personId: string, eventId: string) => {
    setThreads((prev) => prev.some((t) => t.with === personId)
      ? prev
      : [{with: personId, eventId, unread: 0, messages: [], icebreakers: defaultIcebreakers}, ...prev]);
  }, []);

  const sendMessage = useCallback((personId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setThreads((prev) => {
      const thread = prev.find((t) => t.with === personId);
      if (!thread) return prev;
      const updated = {
        ...thread,
        messages: [...thread.messages, {from: currentUser.id, text: trimmed, at: now()}],
        icebreakers: thread.icebreakers.filter((q) => q !== trimmed),
      };
      return [updated, ...prev.filter((t) => t.with !== personId)];
    });
  }, []);

  const value = useMemo<Store>(() => ({
    loggedIn,
    logIn: () => setLoggedIn(true),
    logOut: () => setLoggedIn(false),
    saved,
    toggleSaved: toggleIn(setSaved),
    going,
    toggleGoing: toggleIn(setGoing),
    goals,
    toggleGoal: (goal) => setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal])),
    privacy,
    setPrivacy: (key, v) => setPrivacyState((prev) => ({...prev, [key]: v})),
    seen,
    swipe: (personId, eventId, action) => {
      setSeen((prev) => new Set(prev).add(personId));
      const matched = action !== "pass" && likedBy.includes(personId);
      if (matched) openThread(personId, eventId);
      return {matched};
    },
    resetSeen: () => setSeen(new Set()),
    threads,
    getThread: (personId) => threads.find((t) => t.with === personId),
    openThread,
    sendMessage,
    markRead: (personId) => setThreads((prev) => prev.map((t) => (t.with === personId ? {...t, unread: 0} : t))),
    toast,
    showToast,
  }), [loggedIn, saved, going, goals, privacy, seen, threads, toast, showToast, openThread, sendMessage]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside PrototypeStoreProvider");
  return store;
}
