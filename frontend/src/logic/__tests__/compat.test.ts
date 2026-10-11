import {currentUser, getPerson, people} from "../../data";
import {commonEvents, commonInterests, connectCandidates, isCompatible, sharedEventsLabel} from "../compat";

const person = (id: string) => getPerson(id)!;

describe("compatibility", () => {
  it("finds shared interests and events", () => {
    expect(commonInterests(currentUser, person("u_ioana"))).toEqual(["Techno", "Fotografie", "Drumeții"]);
    expect(commonEvents(currentUser, person("u_radu"))).toEqual(["techno", "derby", "startup"]);
  });

  it("requires the same event, a shared mode and a shared interest", () => {
    expect(isCompatible(currentUser, person("u_ioana"), "techno")).toBe(true);
    // Alex goes to techno and shares "friends", but no interests with Ana
    expect(isCompatible(currentUser, person("u_alex"), "techno")).toBe(false);
    // Radu isn't going to the gallery night
    expect(isCompatible(currentUser, person("u_radu"), "galerii")).toBe(false);
  });

  it("lists Connect candidates for an event and mode, skipping already seen profiles", () => {
    const ids = (mode: "friends" | "dating" | "networking", seen: string[] = []) =>
      connectCandidates(people, "techno", mode, new Set(seen)).map((p) => p.id);
    expect(ids("friends")).toEqual(["u_ioana", "u_radu", "u_maria", "u_alex"]);
    expect(ids("dating")).toEqual(["u_ioana", "u_maria"]);
    expect(ids("networking")).toEqual(["u_alex"]);
    expect(ids("dating", ["u_ioana", "u_maria"])).toEqual([]);
  });

  it("pluralizes shared events", () => {
    expect(sharedEventsLabel(1)).toBe("1 eveniment comun");
    expect(sharedEventsLabel(3)).toBe("3 evenimente comune");
  });
});
