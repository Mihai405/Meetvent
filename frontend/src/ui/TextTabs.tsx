import {Pressable, View} from "react-native";
import {useTheme} from "../theme/ThemeProvider";
import Text from "./Text";

type Tab<T extends string> = {id: T; label: string};

type Props<T extends string> = {tabs: Tab<T>[]; value: T; onChange: (id: T) => void};

// Text tabs with a 2px accent underline on the active tab.
export default function TextTabs<T extends string>({tabs, value, onChange}: Props<T>) {
  const theme = useTheme();
  return (
    <View accessibilityRole="tablist" style={{flexDirection: "row", gap: theme.space["2xl"]}}>
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{selected: active}}
            onPress={() => onChange(tab.id)}
            style={{minHeight: theme.size.touch, justifyContent: "center"}}
          >
            <Text weight={active ? 600 : 500} color={active ? theme.color.ink : theme.color.muted} style={{paddingBottom: theme.space.xs}}>
              {tab.label}
            </Text>
            <View style={{height: 2, borderRadius: 1, backgroundColor: active ? theme.color.accent : "transparent"}}/>
          </Pressable>
        );
      })}
    </View>
  );
}
