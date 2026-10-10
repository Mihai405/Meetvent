import {Pressable, View} from "react-native";
import {useTheme} from "../theme/ThemeProvider";

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
};

const KNOB = 22;

export default function Toggle({value, onValueChange, accessibilityLabel}: Props) {
  const theme = useTheme();
  const {toggleW, toggleH} = theme.size;
  const inset = (toggleH - KNOB) / 2;
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{checked: value}}
      onPress={() => onValueChange(!value)}
      hitSlop={(theme.size.touch - toggleH) / 2}
      style={{
        width: toggleW,
        height: toggleH,
        borderRadius: toggleH / 2,
        backgroundColor: value ? theme.color.accent : theme.color.toggleOff,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: KNOB,
          height: KNOB,
          borderRadius: KNOB / 2,
          backgroundColor: theme.color.bg,
          marginLeft: value ? toggleW - KNOB - inset : inset,
        }}
      />
    </Pressable>
  );
}
