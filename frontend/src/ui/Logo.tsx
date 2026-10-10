import {View} from "react-native";
import Svg, {Circle} from "react-native-svg";
import {useTheme} from "../theme/ThemeProvider";
import Text from "./Text";

// Two overlapping circles: left filled with accent, right outlined in ink.
export function LogoMark({size = 32}: {size?: number}) {
  const theme = useTheme();
  return (
    <Svg width={size * 1.5} height={size} viewBox="0 0 48 32" accessibilityElementsHidden>
      <Circle cx={16} cy={16} r={13} fill={theme.color.accent}/>
      <Circle cx={30} cy={16} r={13} fill="none" stroke={theme.color.ink} strokeWidth={2.5}/>
    </Svg>
  );
}

// Tab bar / Connect icon: two overlapping outlined circles.
export function ConnectIcon({size = 22, color, strokeWidth = 1.6}: {size?: number; color: string; strokeWidth?: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={12} r={6} stroke={color} strokeWidth={strokeWidth}/>
      <Circle cx={15} cy={12} r={6} stroke={color} strokeWidth={strokeWidth}/>
    </Svg>
  );
}

export default function Logo({size = 32}: {size?: number}) {
  const theme = useTheme();
  return (
    <View accessibilityRole="header" accessibilityLabel="Meetvent" style={{alignItems: "center", gap: theme.space.lg}}>
      <LogoMark size={size}/>
      <Text weight={700} style={{fontSize: theme.fontSize.profileName, letterSpacing: -0.02 * theme.fontSize.profileName}}>Meetvent</Text>
    </View>
  );
}
