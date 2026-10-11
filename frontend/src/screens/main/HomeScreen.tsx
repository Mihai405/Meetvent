import {useState} from "react";
import {Pressable, ScrollView, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Bell, ChevronDown, ChevronRight, MapPin, SlidersHorizontal} from "lucide-react-native";
import {CATEGORIES, CITY, currentUser, getEvent, home, PROTOTYPE_NOW} from "../../data";
import type {EventItem} from "../../data/types";
import type {TabScreenProps} from "../../navigation/types";
import {useMockQuery} from "../../hooks/useMockQuery";
import {formatWhen} from "../../logic/dates";
import {useStore} from "../../store/PrototypeStore";
import {useTheme} from "../../theme/ThemeProvider";
import Avatar from "../../ui/Avatar";
import AvatarStack from "../../ui/AvatarStack";
import Chip from "../../ui/Chip";
import {CompactEventRow, EventCard, SectionHeader} from "../../ui/EventViews";
import {EventImage} from "../../ui/Media";
import SearchInput from "../../ui/SearchInput";
import {ErrorState, EventListSkeleton, Skeleton} from "../../ui/States";
import Text from "../../ui/Text";

const COMPATIBLE_FACES = ["u_ioana", "u_radu", "u_maria"];

function NextEventCard({event, onOpen, onMeet}: {event: EventItem; onOpen: () => void; onMeet: () => void}) {
  const theme = useTheme();
  return (
    <View accessibilityLabel="Următorul tău eveniment" style={{borderRadius: theme.radius.cardLg, backgroundColor: theme.color.bg, borderWidth: 1, borderColor: theme.color.border, padding: theme.space.xl, gap: theme.space.lg}}>
      <Text variant="meta" weight={600} color={theme.color.accentText}>Următorul tău eveniment</Text>
      <Pressable accessibilityRole="button" onPress={onOpen} style={{flexDirection: "row", gap: theme.space.lg, alignItems: "center"}}>
        <EventImage eventId={event.id} size={60} radius={theme.radius.thumb}/>
        <View style={{flex: 1, gap: 3}}>
          <Text weight={600} style={{fontSize: theme.fontSize.button}}>{event.title}</Text>
          <Text color={theme.color.muted} style={{fontSize: theme.fontSize.label}}>{formatWhen(event.startsAt, PROTOTYPE_NOW)} · {event.venue}</Text>
        </View>
      </Pressable>
      <View style={{height: 1, backgroundColor: theme.color.divider}}/>
      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.space.lg}}>
        <View style={{flexDirection: "row", alignItems: "center", gap: theme.space.md, flexShrink: 1}}>
          <AvatarStack people={COMPATIBLE_FACES.map((id) => ({id, personId: id, name: id.slice(2)}))}/>
          <Text color={theme.color.muted} style={{fontSize: theme.fontSize.label, flexShrink: 1}}>
            <Text weight={600} style={{fontSize: theme.fontSize.label}}>{event.compatible} compatibili</Text> merg
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Cunoaște-i pe cei care merg la ${event.title}`}
          onPress={onMeet}
          hitSlop={4}
          style={{height: 36, paddingHorizontal: theme.space.xl, borderRadius: 18, backgroundColor: theme.color.accentFill, flexDirection: "row", alignItems: "center", gap: theme.space.xs}}
        >
          <Text weight={600} color={theme.color.onAccentFill} style={{fontSize: theme.fontSize.label}}>Cunoaște-i</Text>
          <ChevronRight size={16} color={theme.color.onAccentFill} strokeWidth={2}/>
        </Pressable>
      </View>
    </View>
  );
}

export default function HomeScreen({navigation}: TabScreenProps<"Home">) {
  const theme = useTheme();
  const {showToast} = useStore();
  const {status, retry} = useMockQuery();
  const [query, setQuery] = useState("");

  const next = getEvent(home.nextEventId)!;
  const trending = home.trendingIds.map((id) => getEvent(id)!);
  const weekend = home.weekendIds.map((id) => getEvent(id)!);
  const openEvent = (id: string) => navigation.navigate("EventDetail", {id});

  return (
    <SafeAreaView edges={["top"]} style={{flex: 1, backgroundColor: theme.color.bgWarm}}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{padding: theme.space.screenX, paddingBottom: 28, gap: theme.space["2xl"]}}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
          <View style={{flexDirection: "row", alignItems: "center", gap: theme.space.md}}>
            <Pressable accessibilityRole="button" accessibilityLabel="Profilul meu" onPress={() => navigation.navigate("Profile")}>
              <Avatar name={currentUser.firstName} personId={currentUser.id} size={40}/>
            </Pressable>
            <View style={{gap: 1}}>
              <Text variant="meta" color={theme.color.muted}>Salut, {currentUser.firstName}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Locație: ${CITY}. Schimbă orașul`}
                onPress={() => showToast("Deocamdată suntem doar în Cluj-Napoca")}
                style={{flexDirection: "row", alignItems: "center", gap: theme.space.xxs}}
              >
                <MapPin size={14} color={theme.color.accentText} strokeWidth={theme.icon.strokeActive}/>
                <Text weight={600}>{CITY}</Text>
                <ChevronDown size={14} color={theme.color.ink} strokeWidth={theme.icon.strokeActive}/>
              </Pressable>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notificări, ai notificări noi"
            onPress={() => showToast("Nicio notificare nouă")}
            style={{width: theme.size.touch, height: theme.size.touch, borderRadius: 22, borderWidth: 1, borderColor: theme.color.border, backgroundColor: theme.color.bg, alignItems: "center", justifyContent: "center"}}
          >
            <Bell size={theme.icon.md} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>
            <View style={{position: "absolute", top: 11, right: 12, width: 7, height: 7, borderRadius: 4, backgroundColor: theme.color.accent}}/>
          </Pressable>
        </View>

        <Text variant="hero" accessibilityRole="header">Unde ieși weekendul ăsta?</Text>

        <View style={{flexDirection: "row", gap: theme.space.md}}>
          <SearchInput
            placeholder="Concerte, meciuri, expoziții…"
            accessibilityLabel="Caută"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => navigation.navigate("Events", {query})}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Filtre"
            onPress={() => navigation.navigate("Events", {category: "all"})}
            style={{width: theme.size.search, height: theme.size.search, borderRadius: theme.radius.input, borderWidth: 1, borderColor: theme.color.border, backgroundColor: theme.color.bg, alignItems: "center", justifyContent: "center"}}
          >
            <SlidersHorizontal size={theme.icon.sm} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginHorizontal: -theme.space.screenX}}
                    contentContainerStyle={{paddingHorizontal: theme.space.screenX, gap: theme.space.sm}}>
          {CATEGORIES.filter((c) => c.id !== "film").map((c) => (
            <Chip key={c.id} label={c.label} selected={c.id === "all"} onPress={() => navigation.navigate("Events", {category: c.id})}/>
          ))}
        </ScrollView>

        {status === "error" && <ErrorState onRetry={retry}/>}

        {status === "loading" && (
          <>
            <Skeleton width="100%" height={150} radius={theme.radius.cardLg}/>
            <EventListSkeleton rows={3}/>
          </>
        )}

        {status === "success" && (
          <>
            <NextEventCard event={next} onOpen={() => openEvent(next.id)} onMeet={() => navigation.navigate("Connect", {eventId: next.id})}/>

            <View style={{gap: theme.space.lg}}>
              <SectionHeader title="În tendințe" action="Vezi tot" onAction={() => navigation.navigate("Events", {category: "all"})}/>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginHorizontal: -theme.space.screenX}}
                          contentContainerStyle={{paddingHorizontal: theme.space.screenX, paddingBottom: theme.space.xxs, gap: theme.space.lg}}>
                {trending.map((e) => <EventCard key={e.id} event={e} onPress={() => openEvent(e.id)}/>)}
              </ScrollView>
            </View>

            <View style={{gap: theme.space.xxs}}>
              <View style={{marginBottom: theme.space.xs}}><SectionHeader title="Weekendul viitor"/></View>
              {weekend.map((e) => <CompactEventRow key={e.id} event={e} onPress={() => openEvent(e.id)}/>)}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
