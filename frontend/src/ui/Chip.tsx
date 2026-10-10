import {ReactNode} from "react";
import {Pressable, View} from "react-native";
import {useTheme} from "../theme/ThemeProvider";
import Text from "./Text";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  // "fill": categories (solid accent when selected); "soft": interests / modes (tinted when selected)
  tone?: "fill" | "soft";
  icon?: ReactNode;
};

export default function Chip({label, selected = false, onPress, tone = "fill", icon}: Props) {
  const theme = useTheme();
  const c = theme.color;
  const colors = !selected
    ? {bg: c.bg, border: c.borderControl, fg: c.ink}
    : tone === "fill"
      ? {bg: c.accentFill, border: c.accentFill, fg: c.onAccentFill}
      : {bg: c.accentSoft, border: c.accentLine, fg: c.accentText};
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{selected}}
      onPress={onPress}
      hitSlop={(theme.size.touch - theme.size.chip) / 2}
      style={({pressed}) => ({
        height: theme.size.chip,
        borderRadius: theme.size.chip / 2,
        paddingHorizontal: theme.space.xl,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.bg,
        justifyContent: "center",
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View style={{flexDirection: "row", alignItems: "center", gap: theme.space.xs}}>
        {icon}
        <Text weight={selected ? 600 : 500} color={colors.fg} style={{fontSize: theme.fontSize.label}}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
