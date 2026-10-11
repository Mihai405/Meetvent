import {View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useStore} from "../store/PrototypeStore";
import {useTheme} from "../theme/ThemeProvider";
import Text from "./Text";

// Confirmation toast (README §4 Connect), shared by all screens.
export default function Toast() {
  const theme = useTheme();
  const {toast} = useStore();
  const insets = useSafeAreaInsets();
  if (!toast) return null;
  return (
    <View pointerEvents="none" style={{position: "absolute", top: insets.top + 72, left: 0, right: 0, alignItems: "center"}}>
      <View
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        style={{
          backgroundColor: theme.color.bg,
          borderRadius: theme.radius.thumb,
          paddingVertical: 9,
          paddingHorizontal: theme.space.xl,
          boxShadow: theme.shadow.toast,
        }}
      >
        <Text weight={600} style={{fontSize: theme.fontSize.label}}>{toast}</Text>
      </View>
    </View>
  );
}
