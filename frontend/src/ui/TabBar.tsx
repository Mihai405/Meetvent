import {ComponentType} from "react";
import {Pressable, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Calendar, House, MessageCircle, User} from "lucide-react-native";
import {useTheme} from "../theme/ThemeProvider";
import {ConnectIcon} from "./Logo";
import Text from "./Text";

type IconProps = {size: number; color: string; strokeWidth: number};

export type TabItem = {key: string; label: string; Icon: ComponentType<IconProps>};

export const MAIN_TABS: TabItem[] = [
  {key: "Home", label: "Acasă", Icon: House},
  {key: "Events", label: "Evenimente", Icon: Calendar},
  {key: "Connect", label: "Connect", Icon: ConnectIcon},
  {key: "Messages", label: "Mesaje", Icon: MessageCircle},
  {key: "Profile", label: "Profil", Icon: User},
];

type Props = {
  items?: TabItem[];
  activeKey: string;
  onPress: (key: string) => void;
};

// Bottom tab bar (README §3): 82px, white, 1px top border, 5 items.
// Also usable as React Navigation's custom tabBar via the wrapper in navigation.
export default function TabBar({items = MAIN_TABS, activeKey, onPress}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      accessibilityRole="tabbar"
      style={{
        minHeight: theme.size.tabBar,
        paddingTop: theme.space.md,
        paddingBottom: Math.max(insets.bottom, theme.space.sm),
        backgroundColor: theme.color.bg,
        borderTopWidth: 1,
        borderTopColor: theme.color.border,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
      }}
    >
      {items.map(({key, label, Icon}) => {
        const active = key === activeKey;
        const color = active ? theme.color.accentText : theme.color.tabInactive;
        return (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{selected: active}}
            onPress={() => onPress(key)}
            style={{width: 64, minHeight: theme.size.touch, alignItems: "center", gap: theme.space.xxs}}
          >
            <Icon size={theme.icon.lg} color={color} strokeWidth={active ? theme.icon.strokeActive : theme.icon.stroke}/>
            <Text variant="tab" weight={active ? 600 : 500} color={color}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
