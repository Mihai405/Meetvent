import {ComponentType, ReactNode, useState} from "react";
import {Alert, Pressable, ScrollView, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {
  BadgeCheck, Briefcase, Check, ChevronLeft, Cigarette, Dumbbell, GlassWater, GraduationCap, Heart, Languages,
  Moon, MoreHorizontal, Ruler, X,
} from "lucide-react-native";
import {currentUser, getEvent, getPerson, myTopArtists, PROTOTYPE_NOW} from "../../data";
import type {Details, Person, Prompt} from "../../data/types";
import type {RootScreenProps} from "../../navigation/types";
import {commonEvents, commonInterests} from "../../logic/compat";
import {formatWhen} from "../../logic/dates";
import {useStore} from "../../store/PrototypeStore";
import {useTheme} from "../../theme/ThemeProvider";
import Scene, {SceneKind} from "../../illustrations/Scene";
import {EventImage, PersonPhoto, PhotoOverlay} from "../../ui/Media";
import {EmptyState} from "../../ui/States";
import Text from "../../ui/Text";

type IconType = ComponentType<{size: number; color: string; strokeWidth: number}>;

const ARTIST_SCENES: SceneKind[] = ["concert", "comedy", "jazz", "film"];

function detailChips(d: Details): {Icon: IconType; text: string}[] {
  const chips: {Icon: IconType; text: string}[] = [];
  if (d.job) chips.push({Icon: Briefcase, text: d.job});
  if (d.education) chips.push({Icon: GraduationCap, text: d.education});
  if (d.heightCm) chips.push({Icon: Ruler, text: `${(d.heightCm / 100).toFixed(2).replace(".", ",")} m`});
  if (d.zodiac) chips.push({Icon: Moon, text: d.zodiac});
  if (d.drinking) chips.push({Icon: GlassWater, text: d.drinking});
  if (d.smoking) chips.push({Icon: Cigarette, text: d.smoking});
  if (d.sport) chips.push({Icon: Dumbbell, text: `Sport de ${d.sport}`});
  if (d.languages?.length) chips.push({Icon: Languages, text: d.languages.join(", ")});
  return chips;
}

function Section({title, aside, children}: {title: string; aside?: ReactNode; children: ReactNode}) {
  const theme = useTheme();
  return (
    <View style={{marginHorizontal: theme.space.screenX, gap: theme.space.md}}>
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "baseline"}}>
        <Text variant="label" color={theme.color.muted} accessibilityRole="header">{title}</Text>
        {aside}
      </View>
      {children}
    </View>
  );
}

function PromptCard({prompt}: {prompt: Prompt}) {
  const theme = useTheme();
  const [liked, setLiked] = useState(false);
  return (
    <View style={{marginHorizontal: theme.space.screenX, borderRadius: theme.radius.cardLg, backgroundColor: theme.color.tintCard, borderWidth: 1, borderColor: theme.color.tintCardBorder, padding: 18, gap: theme.space.sm}}>
      <Text color={theme.color.muted} style={{fontSize: theme.fontSize.label}}>{prompt.question}</Text>
      <Text weight={600} style={{fontSize: 19, lineHeight: 26}}>{prompt.answer}</Text>
      <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
        <Pressable accessibilityRole="button" accessibilityLabel="Apreciază răspunsul" accessibilityState={{selected: liked}}
                   onPress={() => setLiked((l) => !l)} hitSlop={2}
                   style={{width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: theme.color.tintCardBorder, backgroundColor: theme.color.bg, alignItems: "center", justifyContent: "center"}}>
          <Heart size={theme.icon.sm} color={theme.color.accentText} fill={liked ? theme.color.accentText : "none"} strokeWidth={theme.icon.strokeActive}/>
        </Pressable>
      </View>
    </View>
  );
}

function Divider() {
  const theme = useTheme();
  return <View style={{height: 1, backgroundColor: theme.color.divider, marginHorizontal: theme.space.screenX}}/>;
}

export default function ProfileViewScreen({navigation, route}: RootScreenProps<"ProfileView">) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {swipe, showToast, openThread} = useStore();
  const person: Person | undefined = getPerson(route.params.id);
  const isMe = person?.id === currentUser.id;

  if (!person) {
    return (
      <View style={{flex: 1, paddingTop: insets.top + 40}}>
        <EmptyState title="Profil indisponibil" message="Persoana nu mai folosește Meetvent." action="Înapoi" onAction={() => navigation.goBack()}/>
      </View>
    );
  }

  const shared = isMe ? [] : commonEvents(currentUser, person).map((id) => getEvent(id)!).filter(Boolean);
  const sharedInterests = isMe ? [] : commonInterests(currentUser, person);
  const myArtists = new Set(myTopArtists.map((a) => a.name));
  const details = detailChips(person.details ?? {});
  const eventId = route.params.eventId ?? shared[0]?.id ?? "techno";

  const act = (action: "pass" | "like") => {
    const {matched} = swipe(person.id, eventId, action);
    if (action === "like") {
      if (matched) {
        openThread(person.id, eventId);
        navigation.replace("Conversation", {id: person.id});
        return;
      }
      showToast(`Like trimis lui ${person.firstName}`);
    }
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.color.bg}}>
      <ScrollView contentContainerStyle={{paddingBottom: 130 + insets.bottom, gap: theme.space["3xl"]}}>
        <View style={{height: 520}}>
          <PersonPhoto personId={person.id} width="100%" height={520}/>
          <View style={{position: "absolute", top: insets.top + theme.space.sm, left: 16, right: 16, flexDirection: "row", justifyContent: "space-between"}}>
            <Pressable accessibilityRole="button" accessibilityLabel="Înapoi" onPress={() => navigation.goBack()}
                       style={{width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center"}}>
              <ChevronLeft size={theme.icon.md} color={theme.color.ink} strokeWidth={theme.icon.strokeActive}/>
            </Pressable>
            {!isMe && (
              <Pressable accessibilityRole="button" accessibilityLabel="Mai multe opțiuni"
                         onPress={() => Alert.alert(person.firstName, undefined, [{text: "Raportează", style: "destructive"}, {text: "Blochează", style: "destructive"}, {text: "Anulează", style: "cancel"}])}
                         style={{width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center"}}>
                <MoreHorizontal size={theme.icon.md} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>
              </Pressable>
            )}
          </View>
          <PhotoOverlay opacity={0.72}/>
          <View style={{position: "absolute", left: theme.space.screenX, right: theme.space.screenX, bottom: theme.space.screenX}}>
            <View style={{flexDirection: "row", alignItems: "center", gap: theme.space.xs}}>
              <Text weight={700} color="#FFFFFF" accessibilityRole="header" style={{fontSize: theme.fontSize.profileName, lineHeight: 31}}>{person.firstName}, {person.age}</Text>
              {person.verified && <BadgeCheck size={22} color="#FFFFFF" strokeWidth={2} accessibilityLabel="Verificat"/>}
            </View>
            <Text color="rgba(255,255,255,0.92)" style={{marginTop: theme.space.xxs}}>
              {[person.job ?? person.details?.job, person.city ?? "Cluj-Napoca", person.distanceKm !== undefined && !isMe ? `la ${person.distanceKm} km` : undefined].filter(Boolean).join(" · ")}
            </Text>
          </View>
        </View>

        {shared.length > 0 && (
          <View style={{marginHorizontal: theme.space.screenX, gap: theme.space.md}}>
            <Text variant="label" color={theme.color.accentText}>Mergeți amândoi la</Text>
            {shared.map((e) => (
              <Pressable key={e.id} accessibilityRole="button" onPress={() => navigation.navigate("EventDetail", {id: e.id})}
                         style={{flexDirection: "row", gap: theme.space.lg, alignItems: "center"}}>
                <EventImage eventId={e.id} size={48} radius={theme.radius.thumb}/>
                <View style={{gap: 2}}>
                  <Text weight={600}>{e.title}</Text>
                  <Text variant="meta" color={theme.color.muted}>{formatWhen(e.startsAt, PROTOTYPE_NOW)}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {shared.length > 0 && <Divider/>}

        {person.bio && (
          <Section title="Despre mine">
            <Text style={{fontSize: theme.fontSize.bodyLg, lineHeight: 24}}>{person.bio}</Text>
          </Section>
        )}

        {details.length > 0 && (
          <Section title="Detalii">
            <View style={{flexDirection: "row", flexWrap: "wrap", gap: theme.space.sm}}>
              {details.map(({Icon, text}) => (
                <View key={text} style={{flexDirection: "row", alignItems: "center", gap: theme.space.xs, height: theme.size.chip, paddingHorizontal: theme.space.lg, borderRadius: 17, borderWidth: 1, borderColor: theme.color.borderControl}}>
                  <Icon size={15} color={theme.color.muted} strokeWidth={theme.icon.stroke}/>
                  <Text weight={500} style={{fontSize: theme.fontSize.label}}>{text}</Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        {person.prompts?.[0] && <PromptCard prompt={person.prompts[0]}/>}

        {person.bio && (
          <View style={{marginHorizontal: theme.space.screenX, height: 420, borderRadius: theme.radius.cardLg, overflow: "hidden"}}>
            <PersonPhoto personId={person.id} variant="b" width="100%" height={420}/>
          </View>
        )}

        {(person.interests?.length ?? 0) > 0 && (
          <Section
            title="Interese"
            aside={sharedInterests.length > 0
              ? <Text variant="meta" weight={600} color={theme.color.accentText}>{sharedInterests.length} în comun</Text>
              : undefined}
          >
            <View style={{flexDirection: "row", flexWrap: "wrap", gap: theme.space.sm}}>
              {person.interests!.map((i) => {
                const common = sharedInterests.includes(i);
                return (
                  <View key={i} accessibilityLabel={common ? `${i}, în comun` : i}
                        style={{flexDirection: "row", alignItems: "center", gap: 5, height: theme.size.chip, paddingHorizontal: theme.space.lg, borderRadius: 17, borderWidth: 1,
                                borderColor: common ? theme.color.accentLine : theme.color.borderControl, backgroundColor: common ? theme.color.accentSoft : theme.color.bg}}>
                    {common && <Check size={14} color={theme.color.accentText} strokeWidth={2.2}/>}
                    <Text weight={common ? 600 : 500} color={common ? theme.color.accentText : theme.color.ink} style={{fontSize: theme.fontSize.label}}>{i}</Text>
                  </View>
                );
              })}
            </View>
          </Section>
        )}

        {(person.topArtists?.length ?? 0) > 0 && (
          <Section title={`Ce ascultă ${person.firstName}`} aside={<Text variant="tab" weight={400} color={theme.color.muted}>din Spotify</Text>}>
            {person.topArtists!.map((a, idx) => (
              <View key={a.name} style={{flexDirection: "row", alignItems: "center", gap: theme.space.lg}}>
                <View style={{width: 42, height: 42, borderRadius: theme.radius.thumbSm, overflow: "hidden"}}><Scene kind={ARTIST_SCENES[idx % ARTIST_SCENES.length]}/></View>
                <View style={{flex: 1}}>
                  <Text weight={600}>{a.name}</Text>
                  <Text variant="meta" color={theme.color.muted}>{a.genre}</Text>
                </View>
                {myArtists.has(a.name) && (
                  <View style={{backgroundColor: theme.color.accentSoft, paddingVertical: 3, paddingHorizontal: theme.space.sm, borderRadius: 8}}>
                    <Text variant="tab" weight={600} color={theme.color.accentText}>Și tu</Text>
                  </View>
                )}
              </View>
            ))}
          </Section>
        )}

        {person.prompts?.[1] && <PromptCard prompt={person.prompts[1]}/>}

        {(person.pastEvents?.length ?? 0) > 0 && (
          <Section title="A mai fost la">
            <Text style={{lineHeight: 22}}>
              {person.pastEvents!.join(" · ")} · <Text color={theme.color.muted}>și încă 9 evenimente</Text>
            </Text>
          </Section>
        )}

        {!isMe && (
          <View style={{flexDirection: "row", justifyContent: "center", gap: theme.space["3xl"]}}>
            {["Raportează", "Blochează"].map((label) => (
              <Pressable key={label} accessibilityRole="button" onPress={() => showToast(label === "Raportează" ? "Raport trimis. Mulțumim!" : "Profil blocat")}
                         style={{paddingVertical: theme.space.lg, paddingHorizontal: theme.space.sm}}>
                <Text weight={500} color={theme.color.muted} style={{fontSize: theme.fontSize.label}}>{label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {!isMe && (
        <View style={{position: "absolute", left: 0, right: 0, bottom: insets.bottom + theme.space.lg, flexDirection: "row", justifyContent: "center", gap: 22}}>
          <Pressable accessibilityRole="button" accessibilityLabel="Treci mai departe" onPress={() => act("pass")}
                     style={{width: 56, height: 56, borderRadius: 28, backgroundColor: theme.color.bg, borderWidth: 1, borderColor: theme.color.borderControl, alignItems: "center", justifyContent: "center", boxShadow: theme.shadow.floating}}>
            <X size={24} color={theme.color.muted} strokeWidth={theme.icon.strokeActive}/>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Îmi place" onPress={() => act("like")}
                     style={{width: 56, height: 56, borderRadius: 28, backgroundColor: theme.color.accentFill, alignItems: "center", justifyContent: "center", boxShadow: theme.shadow.floating}}>
            <Heart size={24} color={theme.color.onAccentFill} strokeWidth={theme.icon.strokeActive}/>
          </Pressable>
        </View>
      )}
    </View>
  );
}
