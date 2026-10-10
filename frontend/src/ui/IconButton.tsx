import {ReactNode} from "react";
import {Pressable, StyleProp, ViewStyle} from "react-native";
import {useTheme} from "../theme/ThemeProvider";

type Props = {
  icon: ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
  size?: 40 | 44;
  bordered?: boolean;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function IconButton({icon, onPress, accessibilityLabel, size = 44, bordered = true, selected, style}: Props) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={selected === undefined ? undefined : {selected}}
      onPress={onPress}
      hitSlop={(theme.size.touch - size) / 2}
      style={({pressed}) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: bordered ? 1 : 0,
          borderColor: theme.color.border,
          backgroundColor: theme.color.bg,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}
