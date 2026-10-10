import {StyleSheet, Text as RNText, TextProps as RNTextProps} from "react-native";
import {useTheme} from "../theme/ThemeProvider";
import type {FontWeight} from "../theme/tokens";

const variants = {
  hero: {size: "hero", weight: 700, line: "tight", tracking: -0.01},
  page: {size: "page", weight: 700, line: "tight", tracking: -0.01},
  profileName: {size: "profileName", weight: 700, line: "tight", tracking: -0.01},
  section: {size: "section", weight: 700, line: "tight", tracking: 0},
  label: {size: "label", weight: 600, line: "body", tracking: 0},
  bodyLg: {size: "bodyLg", weight: 400, line: "relaxed", tracking: 0},
  body: {size: "body", weight: 400, line: "body", tracking: 0},
  meta: {size: "meta", weight: 400, line: "body", tracking: 0},
  tab: {size: "tab", weight: 500, line: "tight", tracking: 0},
} as const;

export type TextVariant = keyof typeof variants;

type Props = RNTextProps & {
  variant?: TextVariant;
  weight?: FontWeight;
  color?: string;
};

export default function Text({variant = "body", weight, color, style, ...rest}: Props) {
  const theme = useTheme();
  const v = variants[variant];
  // A fontSize override in `style` keeps line height and tracking proportional
  const fontSize = StyleSheet.flatten(style)?.fontSize ?? theme.fontSize[v.size];
  return (
    <RNText
      {...rest}
      style={[
        {
          fontFamily: theme.fontFamily[weight ?? v.weight],
          fontSize,
          lineHeight: Math.round(fontSize * theme.lineHeight[v.line]),
          letterSpacing: v.tracking * fontSize,
          color: color ?? theme.color.ink,
        },
        style,
      ]}
    />
  );
}
