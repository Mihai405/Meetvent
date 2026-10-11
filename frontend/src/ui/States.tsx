// Loading, empty and error states (README §6).
import {useEffect, useRef} from "react";
import {Animated, DimensionValue, View} from "react-native";
import {useTheme} from "../theme/ThemeProvider";
import Button from "./Button";
import Text from "./Text";

export function Skeleton({width, height, radius = 8}: {width: DimensionValue; height: number; radius?: number}) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(opacity, {toValue: 1, duration: 700, useNativeDriver: true}),
      Animated.timing(opacity, {toValue: 0.5, duration: 700, useNativeDriver: true}),
    ]));
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={{width, height, borderRadius: radius, backgroundColor: theme.color.surfaceMuted, opacity}}/>;
}

export function EventRowSkeleton() {
  const theme = useTheme();
  return (
    <View accessibilityLabel="Se încarcă" style={{flexDirection: "row", gap: theme.space.xl, alignItems: "center", paddingVertical: theme.space.lg}}>
      <Skeleton width={theme.size.eventThumb} height={theme.size.eventThumb} radius={theme.radius.thumb}/>
      <View style={{flex: 1, gap: theme.space.sm}}>
        <Skeleton width="35%" height={10}/>
        <Skeleton width="80%" height={14}/>
        <Skeleton width="60%" height={10}/>
      </View>
    </View>
  );
}

export function EventListSkeleton({rows = 5}: {rows?: number}) {
  return <View>{Array.from({length: rows}, (_, i) => <EventRowSkeleton key={i}/>)}</View>;
}

export function EmptyState({title, message, action, onAction}: {title: string; message: string; action?: string; onAction?: () => void}) {
  const theme = useTheme();
  return (
    <View style={{paddingVertical: 60, paddingHorizontal: theme.space["2xl"], alignItems: "center", gap: theme.space.xs}}>
      <Text weight={600} style={{fontSize: 17, textAlign: "center"}}>{title}</Text>
      <Text color={theme.color.muted} style={{textAlign: "center"}}>{message}</Text>
      {action && onAction && <Button title={action} variant="outline" size="sm" onPress={onAction} style={{marginTop: theme.space.md}}/>}
    </View>
  );
}

export function ErrorState({onRetry}: {onRetry: () => void}) {
  return (
    <EmptyState
      title="Ceva n-a mers"
      message="Nu am putut încărca datele. Verifică conexiunea și încearcă din nou."
      action="Încearcă din nou"
      onAction={onRetry}
    />
  );
}
