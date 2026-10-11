import {useEffect, useRef, useState} from "react";
import {Modal, Pressable, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {BadgeCheck, ChevronDown, ChevronRight, Heart, SlidersHorizontal, Star, X} from "lucide-react-native";
import SwipeCard from "../../../components/ui/SwipeCard";
import {currentUser, events, getEvent, GOALS, people} from "../../data";
import type {Goal, Person} from "../../data/types";
import type {TabScreenProps} from "../../navigation/types";
import {commonEvents, connectCandidates, sharedEventsLabel} from "../../logic/compat";
import {formatShortDay} from "../../logic/dates";
import {useStore} from "../../store/PrototypeStore";
import {useTheme} from "../../theme/ThemeProvider";
import Avatar from "../../ui/Avatar";
import Button from "../../ui/Button";
import IconButton from "../../ui/IconButton";
import {PersonPhoto, PhotoOverlay} from "../../ui/Media";
import {EmptyState} from "../../ui/States";
import Text from "../../ui/Text";
import TextTabs from "../../ui/TextTabs";

type Action = "pass" | "like" | "hello";

function ProfileCard({person, counter, onOpenProfile}: {person: Person; counter: string; onOpenProfile: () => void}) {
  const theme = useTheme();
  const shared = commonEvents(currentUser, person).length;
  return (
    <View style={{flex: 1, borderRadius: theme.radius.photo, overflow: "hidden", boxShadow: theme.shadow.swipeCard, backgroundColor: theme.color.surfaceMuted}}>
      <PersonPhoto personId={person.id} width="100%" height="100%"/>
      <View style={{position: "absolute", top: theme.space.md, left: theme.space.lg, right: theme.space.lg, flexDirection: "row", gap: theme.space.xxs}}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={{flex: 1, height: 3, borderRadius: 2, backgroundColor: i === 0 ? "#FFFFFF" : "rgba(255,255,255,0.5)"}}/>
        ))}
      </View>
      <View style={{position: "absolute", top: 22, left: theme.space.lg, backgroundColor: "rgba(255,255,255,0.92)", paddingVertical: theme.space.xxs, paddingHorizontal: theme.space.sm, borderRadius: 8}}>
        <Text variant="tab" weight={600}>{counter}</Text>
      </View>
      <PhotoOverlay/>
      <View style={{position: "absolute", left: 0, right: 0, bottom: 0, padding: 16}}>
        <View style={{flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: theme.space.lg}}>
          <View style={{gap: theme.space.xxs, flexShrink: 1}}>
            <View style={{flexDirection: "row", alignItems: "center", gap: theme.space.xs}}>
              <Text weight={700} color="#FFFFFF" style={{fontSize: theme.fontSize.hero, lineHeight: 29}}>{person.firstName}, {person.age}</Text>
              {person.verified && <BadgeCheck size={20} color="#FFFFFF" strokeWidth={2} accessibilityLabel="Verificat"/>}
            </View>
            {person.job && (
              <Text color="rgba(255,255,255,0.9)" style={{fontSize: theme.fontSize.label}}>
                {person.job}{person.distanceKm !== undefined ? ` · la ${person.distanceKm} km` : ""}
              </Text>
            )}
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Vezi profilul complet" onPress={onOpenProfile} hitSlop={2}
                     style={{width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center"}}>
            <ChevronRight size={theme.icon.md} color={theme.color.ink} strokeWidth={theme.icon.strokeActive}/>
          </Pressable>
        </View>
        <View style={{flexDirection: "row", flexWrap: "wrap", gap: theme.space.xs, marginTop: theme.space.md}}>
          {shared > 0 && (
            <View style={{backgroundColor: "#FFFFFF", paddingVertical: 5, paddingHorizontal: 9, borderRadius: 8}}>
              <Text variant="meta" weight={600} color={theme.color.accentText}>{sharedEventsLabel(shared)}</Text>
            </View>
          )}
          {(person.interests ?? []).slice(0, 3).map((t) => (
            <View key={t} style={{borderWidth: 1, borderColor: "rgba(255,255,255,0.6)", paddingVertical: theme.space.xxs, paddingHorizontal: 9, borderRadius: 8}}>
              <Text variant="meta" weight={500} color="#FFFFFF">{t}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function Sheet({visible, onClose, title, children}: {visible: boolean; onClose: () => void; title: string; children: React.ReactNode}) {
  const theme = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable accessibilityLabel="Închide" onPress={onClose} style={{flex: 1, backgroundColor: "rgba(42,36,32,0.35)"}}/>
      <View style={{backgroundColor: theme.color.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: theme.space.screenX, paddingBottom: 40, gap: theme.space.lg}}>
        <Text variant="section" accessibilityRole="header">{title}</Text>
        {children}
      </View>
    </Modal>
  );
}

export default function ConnectScreen({navigation, route}: TabScreenProps<"Connect">) {
  const theme = useTheme();
  const {going, seen, swipe, resetSeen, showToast} = useStore();
  const [mode, setMode] = useState<Goal>("friends");
  const [eventId, setEventId] = useState(route.params?.eventId ?? "techno");
  const [picking, setPicking] = useState(false);
  const [match, setMatch] = useState<Person | null>(null);
  // A swiped card finishes its exit animation before the next profile is shown
  const swipeAction = useRef<Action>("pass");

  useEffect(() => {
    if (route.params?.eventId) setEventId(route.params.eventId);
  }, [route.params?.eventId]);

  const event = getEvent(eventId)!;
  const candidates = connectCandidates(people, eventId, mode, seen);
  const person = candidates[0];
  const position = Math.min(event.compatible, connectCandidates(people, eventId, mode, new Set()).length - candidates.length + 1);
  const myEvents = events.filter((e) => going.has(e.id));

  const act = (action: Action) => {
    if (!person) return;
    const {matched} = swipe(person.id, eventId, action);
    if (matched) setMatch(person);
    else if (action === "like") showToast(`Like trimis lui ${person.firstName}`);
    else if (action === "hello") showToast(`Salut trimis lui ${person.firstName}`);
  };

  return (
    <SafeAreaView edges={["top"]} style={{flex: 1, backgroundColor: theme.color.bg}}>
      <View style={{paddingTop: theme.space.screenX, paddingHorizontal: theme.space.screenX, gap: theme.space.md}}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
          <Text variant="page" accessibilityRole="header">Connect</Text>
          <IconButton accessibilityLabel="Preferințe" onPress={() => navigation.navigate("Profile")}
                      icon={<SlidersHorizontal size={theme.icon.sm} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>}/>
        </View>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.space.md}}>
          <TextTabs tabs={GOALS} value={mode} onChange={setMode}/>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Eveniment: ${event.title}. Schimbă evenimentul`}
            onPress={() => setPicking(true)}
            hitSlop={6}
            style={{height: 32, paddingHorizontal: theme.space.md, borderRadius: 16, borderWidth: 1, borderColor: theme.color.borderControl, flexDirection: "row", alignItems: "center", gap: theme.space.xs, flexShrink: 1}}
          >
            <Text variant="meta" weight={500} numberOfLines={1} style={{flexShrink: 1}}>{event.title.split(" @")[0]}</Text>
            <ChevronDown size={14} color={theme.color.ink} strokeWidth={theme.icon.strokeActive}/>
          </Pressable>
        </View>
      </View>

      <View style={{flex: 1, marginTop: theme.space.lg, marginHorizontal: theme.space.screenX}}>
        {person ? (
          <SwipeCard
            key={`${person.id}-${mode}-${eventId}`}
            onSwipe={(dir: "left" | "right") => { swipeAction.current = dir === "right" ? "like" : "pass"; }}
            onCardLeftScreen={() => act(swipeAction.current)}
          >
            <ProfileCard
              person={person}
              counter={`${position} din ${event.compatible} compatibili`}
              onOpenProfile={() => navigation.navigate("ProfileView", {id: person.id, eventId})}
            />
          </SwipeCard>
        ) : (
          <EmptyState
            title="Ai văzut pe toată lumea"
            message={`Nu mai sunt profile în modul ${GOALS.find((g) => g.id === mode)!.label} pentru ${event.title}. Încearcă alt mod sau alt eveniment.`}
            action="Vezi din nou"
            onAction={resetSeen}
          />
        )}
      </View>

      <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 22, paddingVertical: theme.space["2xl"]}}>
        <Pressable accessibilityRole="button" accessibilityLabel="Treci mai departe" disabled={!person} onPress={() => act("pass")}
                   style={{width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: theme.color.borderControl, backgroundColor: theme.color.bg, alignItems: "center", justifyContent: "center", opacity: person ? 1 : 0.4}}>
          <X size={24} color={theme.color.muted} strokeWidth={theme.icon.strokeActive}/>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Trimite un salut" disabled={!person} onPress={() => act("hello")}
                   style={{width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: theme.color.borderControl, backgroundColor: theme.color.bg, alignItems: "center", justifyContent: "center", opacity: person ? 1 : 0.4}}>
          <Star size={20} color={theme.color.accentText} strokeWidth={theme.icon.strokeActive}/>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Îmi place" disabled={!person} onPress={() => act("like")}
                   style={{width: 56, height: 56, borderRadius: 28, backgroundColor: theme.color.accentFill, alignItems: "center", justifyContent: "center", opacity: person ? 1 : 0.4}}>
          <Heart size={24} color={theme.color.onAccentFill} strokeWidth={theme.icon.strokeActive}/>
        </Pressable>
      </View>

      <Sheet visible={picking} onClose={() => setPicking(false)} title="Alege evenimentul">
        {myEvents.length === 0 && <Text color={theme.color.muted}>Apasă „Merg și eu” pe un eveniment ca să cunoști oamenii de acolo.</Text>}
        {myEvents.map((e) => (
          <Pressable key={e.id} accessibilityRole="button" accessibilityState={{selected: e.id === eventId}}
                     onPress={() => { setEventId(e.id); setPicking(false); }}
                     style={{minHeight: theme.size.touch, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: theme.color.divider, paddingVertical: theme.space.md}}>
            <View style={{gap: 2, flexShrink: 1}}>
              <Text weight={e.id === eventId ? 700 : 500}>{e.title}</Text>
              <Text variant="meta" color={theme.color.muted}>{formatShortDay(e.startsAt)} · {e.compatible} compatibili</Text>
            </View>
            {e.id === eventId && <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: theme.color.accent}}/>}
          </Pressable>
        ))}
      </Sheet>

      <Modal visible={!!match} transparent animationType="fade" onRequestClose={() => setMatch(null)}>
        {match && (
          <View style={{flex: 1, backgroundColor: "rgba(42,36,32,0.55)", justifyContent: "center", padding: theme.space["3xl"]}}>
            <View accessibilityViewIsModal style={{backgroundColor: theme.color.bg, borderRadius: theme.radius.photo, padding: theme.space["3xl"], alignItems: "center", gap: theme.space.lg}}>
              <View style={{flexDirection: "row"}}>
                <Avatar name={currentUser.firstName} personId={currentUser.id} size={theme.size.avatarLg} ring/>
                <View style={{marginLeft: -18}}><Avatar name={match.firstName} personId={match.id} size={theme.size.avatarLg} ring/></View>
              </View>
              <Text variant="page" accessibilityRole="header" style={{textAlign: "center"}}>Ați făcut match!</Text>
              <Text color={theme.color.muted} style={{textAlign: "center"}}>
                Și {match.firstName} vrea să te cunoască. Mergeți amândoi la {event.title}.
              </Text>
              <Button title="Trimite un mesaj" style={{alignSelf: "stretch"}} onPress={() => {
                const id = match.id;
                setMatch(null);
                navigation.navigate("Conversation", {id});
              }}/>
              <Button title="Continuă să explorezi" variant="outline" size="md" style={{alignSelf: "stretch"}} onPress={() => setMatch(null)}/>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}
