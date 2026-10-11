// Event list items from README §3 (Event row, Event card) and the Home screen.
import {Pressable, View} from "react-native";
import {Bookmark} from "lucide-react-native";
import {PROTOTYPE_NOW} from "../data";
import type {EventItem} from "../data/types";
import {formatBadgeDate, formatWhen} from "../logic/dates";
import {formatCount} from "../logic/events";
import {useTheme} from "../theme/ThemeProvider";
import Badge from "./Badge";
import {EventImage} from "./Media";
import Text from "./Text";

type Props = {event: EventItem; onPress: () => void};

export function SectionHeader({title, action, onAction}: {title: string; action?: string; onAction?: () => void}) {
  const theme = useTheme();
  return (
    <View style={{flexDirection: "row", alignItems: "baseline", justifyContent: "space-between"}}>
      <Text variant="section" accessibilityRole="header">{title}</Text>
      {action && (
        <Pressable accessibilityRole="link" onPress={onAction} hitSlop={12}>
          <Text weight={600} color={theme.color.accentText} style={{fontSize: theme.fontSize.label}}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

// Events list row: thumbnail 68, date, title, meta with "N compatibili", bookmark.
export function EventRow({event, onPress, saved, onToggleSaved}: Props & {saved: boolean; onToggleSaved: () => void}) {
  const theme = useTheme();
  return (
    <View style={{flexDirection: "row", gap: theme.space.xs, alignItems: "center", paddingVertical: theme.space.lg, borderBottomWidth: 1, borderBottomColor: theme.color.divider}}>
      <Pressable accessibilityRole="button" onPress={onPress} style={{flexDirection: "row", gap: theme.space.xl, flex: 1, alignItems: "center"}}>
        <EventImage eventId={event.id} size={theme.size.eventThumb} radius={theme.radius.thumb}/>
        <View style={{flex: 1, gap: 3}}>
          <Text variant="meta" weight={600} color={theme.color.accentText}>{formatWhen(event.startsAt, PROTOTYPE_NOW)}</Text>
          <Text weight={600} style={{fontSize: theme.fontSize.bodyLg, lineHeight: 19}}>{event.title}</Text>
          <Text variant="meta" color={theme.color.muted}>
            {event.venue} · {formatCount(event.going)} merg · <Text variant="meta" weight={600} color={theme.color.accentText}>{event.compatible} compatibili</Text>
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={saved ? "Elimină din salvate" : "Salvează evenimentul"}
        accessibilityState={{selected: saved}}
        onPress={onToggleSaved}
        style={{width: theme.size.touch, height: theme.size.touch, alignItems: "center", justifyContent: "center", marginRight: -10}}
      >
        <Bookmark size={theme.icon.md} strokeWidth={theme.icon.stroke}
                  color={saved ? theme.color.accentFill : theme.color.iconMuted}
                  fill={saved ? theme.color.accentFill : "none"}/>
      </Pressable>
    </View>
  );
}

// Carousel card: width 200, image 116, white date badge.
export function EventCard({event, onPress}: Props) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${formatWhen(event.startsAt, PROTOTYPE_NOW)}`}
      onPress={onPress}
      style={{width: 200, borderRadius: theme.radius.card, backgroundColor: theme.color.bg, borderWidth: 1, borderColor: theme.color.border, overflow: "hidden"}}
    >
      <View>
        <EventImage eventId={event.id} width="100%" height={116}/>
        <View style={{position: "absolute", top: theme.space.sm, left: theme.space.sm, backgroundColor: theme.color.bg, borderRadius: 8, paddingVertical: theme.space.xxs, paddingHorizontal: 7}}>
          <Text variant="tab" weight={600} color={theme.color.accentText}>{formatBadgeDate(event.startsAt, PROTOTYPE_NOW)}</Text>
        </View>
      </View>
      <View style={{paddingTop: theme.space.md, paddingHorizontal: theme.space.lg, paddingBottom: theme.space.lg, gap: 3}}>
        <Text weight={600} numberOfLines={1}>{event.title}</Text>
        <Text variant="meta" color={theme.color.muted} numberOfLines={1}>{event.venue} · {formatCount(event.going)} merg</Text>
      </View>
    </Pressable>
  );
}

// Compact row with a compatibles badge (Home, "Weekendul viitor").
export function CompactEventRow({event, onPress}: Props) {
  const theme = useTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={{flexDirection: "row", gap: theme.space.lg, alignItems: "center", paddingVertical: theme.space.sm}}>
      <EventImage eventId={event.id} size={52} radius={theme.radius.thumb}/>
      <View style={{flex: 1, gap: 2}}>
        <Text weight={600}>{event.title}</Text>
        <Text variant="meta" color={theme.color.muted}>{formatWhen(event.startsAt, PROTOTYPE_NOW)}</Text>
      </View>
      <Badge label={`${event.compatible} compatibili`}/>
    </Pressable>
  );
}
