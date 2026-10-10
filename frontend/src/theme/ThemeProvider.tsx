import {createContext, ReactNode, useContext, useMemo, useState} from "react";
import {deriveAccent} from "./accent";
import {baseColors, DEFAULT_ACCENT, fontFamily, fontSize, icon, lineHeight, radius, shadow, size, space} from "./tokens";

function buildTheme(accent: string) {
  return {
    color: {...baseColors, ...deriveAccent(accent)},
    fontFamily,
    fontSize,
    lineHeight,
    space,
    radius,
    size,
    shadow,
    icon,
  };
}

export type Theme = ReturnType<typeof buildTheme>;

type ThemeContextValue = {theme: Theme; setAccent: (accent: string) => void};

const ThemeContext = createContext<ThemeContextValue>({theme: buildTheme(DEFAULT_ACCENT), setAccent: () => {}});

export function ThemeProvider({children, initialAccent = DEFAULT_ACCENT}: {children: ReactNode; initialAccent?: string}) {
  const [accent, setAccent] = useState(initialAccent);
  const value = useMemo(() => ({theme: buildTheme(accent), setAccent}), [accent]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext).theme;
}

export function useSetAccent(): (accent: string) => void {
  return useContext(ThemeContext).setAccent;
}
