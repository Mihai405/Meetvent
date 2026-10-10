import {View} from "react-native";
import {useTheme} from "../theme/ThemeProvider";
import Avatar from "./Avatar";

type Person = {id: string; name: string; uri?: string};

type Props = {people: Person[]; size?: number; max?: number};

export default function AvatarStack({people, size, max = 4}: Props) {
  const theme = useTheme();
  const avatarSize = size ?? theme.size.avatarXs;
  return (
    <View style={{flexDirection: "row"}} accessibilityLabel={people.map((p) => p.name).join(", ")}>
      {people.slice(0, max).map((p, i) => (
        <View key={p.id} style={{marginLeft: i === 0 ? 0 : -8}}>
          <Avatar name={p.name} uri={p.uri} size={avatarSize} ring/>
        </View>
      ))}
    </View>
  );
}
