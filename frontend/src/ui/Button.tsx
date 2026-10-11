import {ReactNode} from "react";
import {Pressable, StyleProp, View, ViewStyle} from "react-native";
import {useTheme} from "../theme/ThemeProvider";
import Text from "./Text";

type Props = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "outline" | "accentOutline";
  size?: "lg" | "md" | "sm";
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

const heights = {lg: 50, md: 48, sm: 34};

export default function Button({title, onPress, variant = "primary", size = "lg", disabled, icon, style, accessibilityLabel}: Props) {
  const theme = useTheme();
  const height = heights[size];
  const primary = variant === "primary";
  const c = theme.color;
  const colors = disabled
    ? {bg: c.divider, border: c.divider, fg: c.iconMuted}
    : variant === "primary"
      ? {bg: c.accentFill, border: c.accentFill, fg: c.onAccentFill}
      : variant === "accentOutline"
        ? {bg: c.bg, border: c.accent, fg: c.accentText}
        : {bg: c.bg, border: c.borderControl, fg: c.ink};
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{disabled}}
      disabled={disabled}
      onPress={onPress}
      hitSlop={height < theme.size.touch ? (theme.size.touch - height) / 2 : undefined}
      style={({pressed}) => [
        {
          height,
          borderRadius: height / 2,
          paddingHorizontal: size === "sm" ? theme.space.xl : theme.space["2xl"],
          backgroundColor: colors.bg,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <View style={{flexDirection: "row", alignItems: "center", gap: theme.space.sm}}>
        {icon}
        <Text
          weight={primary || variant === "accentOutline" ? 600 : 500}
          color={colors.fg}
          style={{fontSize: primary ? theme.fontSize.button : size === "sm" ? theme.fontSize.label : theme.fontSize.body}}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
