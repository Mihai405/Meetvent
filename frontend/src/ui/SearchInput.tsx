import {TextInput, TextInputProps, View} from "react-native";
import {Search} from "lucide-react-native";
import {useTheme} from "../theme/ThemeProvider";

type Props = Omit<TextInputProps, "style">;

export default function SearchInput(props: Props) {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        height: theme.size.search,
        borderRadius: theme.radius.input,
        backgroundColor: theme.color.surfaceMuted,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.space.md,
        paddingHorizontal: theme.space.xl,
      }}
    >
      <Search size={theme.icon.sm} color={theme.color.iconMuted} strokeWidth={theme.icon.stroke}/>
      <TextInput
        accessibilityLabel={props.accessibilityLabel ?? props.placeholder}
        placeholderTextColor={theme.color.muted}
        returnKeyType="search"
        {...props}
        style={{flex: 1, fontFamily: theme.fontFamily[400], fontSize: theme.fontSize.body, color: theme.color.ink}}
      />
    </View>
  );
}
