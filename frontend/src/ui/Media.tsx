// Photo slots: a real image when available, otherwise the design's illustrated placeholder.
import {Image, StyleProp, View, ViewStyle} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import Portrait from "../illustrations/Portrait";
import Scene from "../illustrations/Scene";
import {portraitFor, sceneFor} from "../data";

type Box = {size?: number; width?: number | `${number}%`; height?: number | `${number}%`; radius?: number; style?: StyleProp<ViewStyle>};

function frame({size, width, height, radius = 0, style}: Box): StyleProp<ViewStyle> {
  return [{width: width ?? size, height: height ?? size, borderRadius: radius, overflow: "hidden"}, style];
}

export function PersonPhoto({personId, uri, variant, crop, ...box}: Box & {personId: string; uri?: string; variant?: "a" | "b"; crop?: "full" | "face"}) {
  return (
    <View style={frame(box)}>
      {uri
        ? <Image source={{uri}} style={{width: "100%", height: "100%"}} accessibilityIgnoresInvertColors/>
        : <Portrait who={portraitFor(personId)} variant={variant} crop={crop}/>}
    </View>
  );
}

export function EventImage({eventId, uri, ...box}: Box & {eventId: string; uri?: string}) {
  return (
    <View style={frame(box)}>
      {uri
        ? <Image source={{uri}} style={{width: "100%", height: "100%"}} accessibilityIgnoresInvertColors/>
        : <Scene kind={sceneFor(eventId)}/>}
    </View>
  );
}

// Dark gradient behind text placed on photos (tokens: overlayPhoto).
export function PhotoOverlay({opacity = 0.78}: {opacity?: number}) {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={["rgba(42,36,32,0)", `rgba(42,36,32,${opacity})`]}
      style={{position: "absolute", left: 0, right: 0, bottom: 0, top: "35%"}}
    />
  );
}
