import {ReactNode} from "react";
import {Pressable, StyleProp, View, ViewStyle} from "react-native";
import {useTheme} from "../theme/ThemeProvider";
import Text from "./Text";

type Props = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "outline";
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
          backgroundColor: primary ? theme.color.accentFill : theme.color.bg,
          borderWidth: primary ? 0 : 1,
          borderColor: theme.color.borderControl,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <View style={{flexDirection: "row", alignItems: "center", gap: theme.space.sm}}>
        {icon}
        <Text
          weight={primary ? 600 : 500}
          color={primary ? theme.color.onAccentFill : theme.color.ink}
          style={{fontSize: primary ? theme.fontSize.button : size === "sm" ? theme.fontSize.label : theme.fontSize.body}}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
