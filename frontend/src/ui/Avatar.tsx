import {Image, View} from "react-native";
import {useTheme} from "../theme/ThemeProvider";
import Text from "./Text";
import Portrait from "../illustrations/Portrait";
import {portraitFor} from "../data";

type Props = {
  name: string;
  uri?: string;
  // Shows the illustrated placeholder portrait when there is no photo
  personId?: string;
  size?: number;
  // White ring used in stacks and on photos
  ring?: boolean;
  // Accent ring used for new connections
  accentRing?: boolean;
};

export default function Avatar({name, uri, personId, size = 38, ring, accentRing}: Props) {
  const theme = useTheme();
  const borderWidth = ring || accentRing ? 2 : 0;
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={name}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth,
        borderColor: accentRing ? theme.color.accent : theme.color.bg,
        backgroundColor: theme.color.accentSoft,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {uri
        ? <Image source={{uri}} style={{width: "100%", height: "100%"}}/>
        : personId
          ? <Portrait who={portraitFor(personId)} crop="face"/>
          : <Text weight={600} color={theme.color.accentText} style={{fontSize: Math.max(10, size * 0.38)}}>{name.charAt(0)}</Text>}
    </View>
  );
}
