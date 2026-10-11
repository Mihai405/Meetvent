import {
  birthDateError,
  canFinishRegistration,
  emailError,
  maskBirthDate,
  parseBirthDate,
  passwordError,
  preferencesHint,
} from "../register";

const NOW = new Date(2026, 9, 10);

describe("emailError", () => {
  it("accepts a normal address", () => {
    expect(emailError("ana@exemplu.ro")).toBeUndefined();
  });
  it.each(["", "ana", "ana@", "ana@exemplu", "ana exemplu@x.ro"])("rejects %p", (email) => {
    expect(emailError(email)).toBeDefined();
  });
});

describe("passwordError", () => {
  it("accepts 8+ characters with a digit and an uppercase letter", () => {
    expect(passwordError("Parola123")).toBeUndefined();
  });
  it("explains what is missing", () => {
    expect(passwordError("Ab1")).toMatch(/minim 8/);
    expect(passwordError("Parolalunga")).toMatch(/cifră/);
    expect(passwordError("parola123")).toMatch(/literă mare/);
  });
});

describe("birth date", () => {
  it("parses ZZ / LL / AAAA and rejects impossible dates", () => {
    expect(parseBirthDate("16 / 10 / 2000")).toEqual(new Date(2000, 9, 16));
    expect(parseBirthDate("31/02/2000")).toBeUndefined();
    expect(parseBirthDate("2000-10-16")).toBeUndefined();
  });

  it("requires the user to be at least 18", () => {
    expect(birthDateError("10 / 10 / 2008", NOW)).toBeUndefined();
    expect(birthDateError("11 / 10 / 2008", NOW)).toMatch(/18 ani/);
    expect(birthDateError("01 / 01 / 2030", NOW)).toMatch(/formatul/);
  });

  it("masks typed digits into the expected format", () => {
    expect(maskBirthDate("16102000")).toBe("16 / 10 / 2000");
    expect(maskBirthDate("161")).toBe("16 / 1");
    expect(maskBirthDate("16 / 10 / 2000123")).toBe("16 / 10 / 2000");
  });
});

describe("preferences step", () => {
  it("needs at least 3 interests and one goal", () => {
    expect(canFinishRegistration(2, ["friends"])).toBe(false);
    expect(canFinishRegistration(3, [])).toBe(false);
    expect(canFinishRegistration(3, ["dating"])).toBe(true);
  });

  it("tells the user how many interests are still missing", () => {
    expect(preferencesHint(1, ["friends"])).toBe("Mai alege 2.");
    expect(preferencesHint(3, [])).toBe("Alege și ce cauți.");
    expect(preferencesHint(5, ["friends"])).toBe("Perfect, ești gata.");
  });
});
