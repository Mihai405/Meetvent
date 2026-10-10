// Design tokens from docs/design/meetvent-design/tokens.json (v1.2).
// Accent shades are not listed here: they are derived in accent.ts.

export const DEFAULT_ACCENT = "#F57C3F";
export const ACCENT_OPTIONS = ["#F57C3F", "#F59A4A", "#EF6F5A", "#E8803A"];

export const baseColors = {
  ink: "#2A2420",
  inkBody: "#4A413C",
  muted: "#6F6660",
  tabInactive: "#776E68",
  iconMuted: "#8A817B",
  bg: "#FFFFFF",
  bgWarm: "#FCFAF8",
  surfaceMuted: "#F4F0EC",
  tintCard: "#FCF7F3",
  tintCardBorder: "#F3E8DF",
  border: "#EFE9E4",
  borderControl: "#E8E1DB",
  divider: "#F2ECE7",
  toggleOff: "#DDD4CD",
  danger: "#B23A2A",
  dangerBorder: "#E6A79B",
  onAccentFill: "#FFFFFF",
};

export const fontSize = {
  tab: 11,
  meta: 12,
  label: 13,
  body: 14,
  bodyLg: 15,
  button: 16,
  section: 18,
  page: 24,
  hero: 26,
  profileName: 28,
};

export const fontFamily = {
  400: "DMSans_400Regular",
  500: "DMSans_500Medium",
  600: "DMSans_600SemiBold",
  700: "DMSans_700Bold",
} as const;

export type FontWeight = keyof typeof fontFamily;

export const lineHeight = {tight: 1.2, body: 1.5, relaxed: 1.6};

export const space = {xxs: 4, xs: 6, sm: 8, md: 10, lg: 12, xl: 14, "2xl": 20, "3xl": 24, screenX: 20, screenXAuth: 24};

export const radius = {thumbSm: 10, thumb: 12, input: 14, card: 16, cardLg: 18, photo: 20, pill: 999};

export const size = {
  touch: 44,
  buttonPrimary: 50,
  input: 48,
  search: 46,
  chip: 34,
  iconButton: 44,
  tabBar: 82,
  avatarXs: 28,
  avatarSm: 38,
  avatarMd: 50,
  avatarLg: 96,
  eventThumb: 68,
  toggleW: 46,
  toggleH: 28,
};

export const shadow = {
  swipeCard: "0 6px 20px rgba(42,36,32,0.10)",
  floating: "0 4px 14px rgba(42,36,32,0.08)",
  toast: "0 4px 16px rgba(42,36,32,0.15)",
};

export const icon = {stroke: 1.6, strokeActive: 1.8, sm: 18, md: 20, lg: 22};
