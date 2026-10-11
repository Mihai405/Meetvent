import {events, PROTOTYPE_NOW} from "../../data";
import {eventCountLabel, filterEvents, formatCount} from "../events";

const ids = (list: {id: string}[]) => list.map((e) => e.id);

describe("filterEvents", () => {
  it("returns every event sorted by date when no filter is set", () => {
    expect(ids(filterEvents(events, {category: "all", when: "all"}, PROTOTYPE_NOW))).toEqual([
      "jazz", "startup", "techno", "galerii", "derby", "film", "standup", "foto",
    ]);
  });

  it("filters by category", () => {
    expect(ids(filterEvents(events, {category: "art", when: "all"}, PROTOTYPE_NOW))).toEqual(["galerii", "foto"]);
  });

  it("'Azi' keeps only today's events", () => {
    expect(ids(filterEvents(events, {category: "all", when: "today"}, PROTOTYPE_NOW))).toEqual(["jazz"]);
  });

  it("'Săptămâna asta' includes today and the following weekend, not later events", () => {
    const week = ids(filterEvents(events, {category: "all", when: "week"}, PROTOTYPE_NOW));
    expect(week).toContain("jazz");
    expect(week).toContain("standup");
    expect(week).not.toContain("foto");
  });

  it("combines category, date and search", () => {
    expect(ids(filterEvents(events, {category: "art", when: "week", query: "galer"}, PROTOTYPE_NOW))).toEqual(["galerii"]);
    expect(filterEvents(events, {category: "sport", when: "today"}, PROTOTYPE_NOW)).toEqual([]);
  });

  it("search ignores case and Romanian diacritics, and matches venues and tags", () => {
    expect(ids(filterEvents(events, {category: "all", when: "all", query: "ACOPERIS"}, PROTOTYPE_NOW))).toEqual(["jazz"]);
    expect(ids(filterEvents(events, {category: "all", when: "all", query: "cluj arena"}, PROTOTYPE_NOW))).toEqual(["derby"]);
    expect(ids(filterEvents(events, {category: "all", when: "all", query: "18+"}, PROTOTYPE_NOW))).toEqual(["techno"]);
  });
});

describe("formatting", () => {
  it("abbreviates large attendance counts", () => {
    expect(formatCount(75)).toBe("75");
    expect(formatCount(1200)).toBe("1.2k");
    expect(formatCount(2000)).toBe("2k");
  });

  it("pluralizes the event count", () => {
    expect(eventCountLabel(1)).toBe("1 eveniment");
    expect(eventCountLabel(0)).toBe("0 evenimente");
    expect(eventCountLabel(8)).toBe("8 evenimente");
  });
});
