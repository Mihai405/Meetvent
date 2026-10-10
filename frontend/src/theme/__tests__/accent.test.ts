import {contrastWithWhite, deriveAccent, FILL_MIN_CONTRAST, hexToRgb, TEXT_MIN_CONTRAST} from "../accent";

describe("deriveAccent", () => {
  it("reproduces the shades in tokens.json for the default accent", () => {
    expect(deriveAccent("#F57C3F")).toEqual({
      accent: "#F57C3F",
      accentFill: "#E07139",
      accentText: "#B1592D",
      accentSoft: "#FEEFE8",
      accentLine: "#FAB795",
    });
  });

  it.each(["#F57C3F", "#F59A4A", "#EF6F5A", "#E8803A", "#FFFF00"])(
    "meets the contrast thresholds for %s",
    (accent) => {
      const {accentFill, accentText} = deriveAccent(accent);
      expect(contrastWithWhite(hexToRgb(accentFill))).toBeGreaterThanOrEqual(FILL_MIN_CONTRAST);
      expect(contrastWithWhite(hexToRgb(accentText))).toBeGreaterThanOrEqual(TEXT_MIN_CONTRAST);
    },
  );

  it("leaves an already dark accent unchanged", () => {
    const {accentFill, accentText} = deriveAccent("#2A2420");
    expect(accentFill).toBe("#2A2420");
    expect(accentText).toBe("#2A2420");
  });
});
