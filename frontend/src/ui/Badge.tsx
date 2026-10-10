import {View} from "react-native";
import {useTheme} from "../theme/ThemeProvider";
import Text from "./Text";

// "N compatibili" badge: accentText on accentSoft.
export default function Badge({label}: {label: string}) {
  const theme = useTheme();
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: theme.color.accentSoft,
        borderRadius: 8,
        paddingVertical: theme.space.xxs,
        paddingHorizontal: theme.space.sm,
      }}
    >
      <Text variant="meta" weight={600} color={theme.color.accentText}>{label}</Text>
    </View>
  );
}
