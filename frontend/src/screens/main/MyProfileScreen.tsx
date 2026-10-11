import {ReactNode, useState} from "react";
import {Alert, Image, Pressable, ScrollView, TextInput, useWindowDimensions, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {Check, Eye, LogOut, Plus, Settings} from "lucide-react-native";
import {CITY, currentUser, GOALS} from "../../data";
import type {TabScreenProps} from "../../navigation/types";
import {useStore} from "../../store/PrototypeStore";
import {useTheme} from "../../theme/ThemeProvider";
import Scene from "../../illustrations/Scene";
import Avatar from "../../ui/Avatar";
import IconButton from "../../ui/IconButton";
import {PersonPhoto} from "../../ui/Media";
import Text from "../../ui/Text";
import Toggle from "../../ui/Toggle";

const MAX_PHOTOS = 6;
const MAX_PROMPTS = 3;
const MAX_BIO = 300;

function SectionTitle({children, action, onAction}: {children: string; action?: string; onAction?: () => void}) {
  const theme = useTheme();
  return (
    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
      <Text variant="label" color={theme.color.muted} accessibilityRole="header">{children}</Text>
      {action && (
        <Pressable accessibilityRole="button" onPress={onAction} style={{paddingVertical: theme.space.md}}>
          <Text weight={600} color={theme.color.accentText} style={{fontSize: theme.fontSize.label}}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

function DashedButton({label, onPress, children, style}: {label: string; onPress: () => void; children: ReactNode; style?: object}) {
  const theme = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
               style={[{borderRadius: theme.radius.input, borderWidth: 1, borderStyle: "dashed", borderColor: theme.color.accentLine, backgroundColor: theme.color.bg, alignItems: "center", justifyContent: "center"}, style]}>
      {children}
    </Pressable>
  );
}

export default function MyProfileScreen({navigation}: TabScreenProps<"Profile">) {
  const theme = useTheme();
  const {width} = useWindowDimensions();
  const {goals, toggleGoal, privacy, setPrivacy, logOut, showToast} = useStore();
  const [photos, setPhotos] = useState<string[]>([]);
  const [bio, setBio] = useState(currentUser.bio ?? "");
  const [editingBio, setEditingBio] = useState(false);

  const tile = (width - theme.space.screenX * 2 - theme.space.sm * 2) / 3;
  const placeholderTiles = 4;
  const photoCount = placeholderTiles + photos.length;
  const missingPhotos = MAX_PHOTOS - photoCount;
  const completion = Math.min(1, currentUser.profileCompletion + photos.length * 0.05);
  const prompts = currentUser.prompts ?? [];
  const d = currentUser.details ?? {};
  const detailRows: [string, string | undefined][] = [
    ["Job", d.job], ["Studii", d.education], ["Oraș", currentUser.city ?? CITY],
    ["Înălțime", d.heightCm ? `${d.heightCm} cm` : undefined], ["Zodie", d.zodiac], ["Băutură", d.drinking],
    ["Fumat", d.smoking], ["Sport", d.sport], ["Limbi", d.languages?.join(", ")],
  ];

  const addPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Acces la poze", "Permite accesul la poze din Setări ca să-ți adaugi poze.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ["images"], allowsEditing: true, aspect: [3, 4], quality: 0.7});
    if (!result.canceled) setPhotos((p) => [...p, result.assets[0].uri]);
  };

  const confirmLogout = () => Alert.alert("Te deconectezi?", undefined, [
    {text: "Anulează", style: "cancel"},
    {text: "Deconectare", style: "destructive", onPress: logOut},
  ]);

  return (
    <SafeAreaView edges={["top"]} style={{flex: 1, backgroundColor: theme.color.bg}}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{padding: theme.space.screenX, paddingBottom: 40, gap: theme.space["3xl"]}}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
          <Text variant="page" accessibilityRole="header">Profilul meu</Text>
          <View style={{flexDirection: "row", gap: theme.space.sm, alignItems: "center"}}>
            <Pressable accessibilityRole="button" accessibilityLabel="Previzualizează profilul" hitSlop={4}
                       onPress={() => navigation.navigate("ProfileView", {id: currentUser.id, preview: true})}
                       style={{height: 36, paddingHorizontal: theme.space.lg, borderRadius: 18, borderWidth: 1, borderColor: theme.color.borderControl, flexDirection: "row", alignItems: "center", gap: theme.space.xs}}>
              <Eye size={16} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>
              <Text weight={500} style={{fontSize: theme.fontSize.label}}>Previzualizare</Text>
            </Pressable>
            <IconButton accessibilityLabel="Setări" onPress={() => showToast("Setările vin în curând")}
                        icon={<Settings size={theme.icon.sm} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>}/>
          </View>
        </View>

        <View style={{alignItems: "center", gap: theme.space.md}}>
          <Avatar name={currentUser.firstName} personId={currentUser.id} uri={photos[0]} size={theme.size.avatarLg}/>
          <Text variant="section">{currentUser.firstName} {currentUser.lastName}, {currentUser.age}</Text>
          <View style={{width: 220, gap: theme.space.xs, alignItems: "center"}}>
            <View accessibilityRole="progressbar" accessibilityLabel="Profil completat" accessibilityValue={{min: 0, max: 100, now: Math.round(completion * 100)}}
                  style={{width: "100%", height: 4, borderRadius: 2, backgroundColor: theme.color.divider, overflow: "hidden"}}>
              <View style={{width: `${completion * 100}%`, height: 4, backgroundColor: theme.color.accent}}/>
            </View>
            <Text variant="meta" color={theme.color.muted}>
              Profil completat {Math.round(completion * 100)}%{missingPhotos > 0 ? ` · mai adaugă ${missingPhotos === 1 ? "o poză" : `${missingPhotos} poze`}` : ""}
            </Text>
          </View>
        </View>

        <View style={{gap: theme.space.md}}>
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "baseline"}}>
            <Text variant="label" color={theme.color.muted}>Poze · {photoCount} din {MAX_PHOTOS}</Text>
            <Text variant="tab" weight={400} color={theme.color.muted}>Ține apăsat ca să reordonezi</Text>
          </View>
          <View style={{flexDirection: "row", flexWrap: "wrap", gap: theme.space.sm}}>
            <View style={{width: tile, height: tile * 4 / 3, borderRadius: theme.radius.input, overflow: "hidden"}}>
              <PersonPhoto personId={currentUser.id} width="100%" height="100%"/>
              <View style={{position: "absolute", left: 6, top: 6, backgroundColor: "rgba(255,255,255,0.92)", paddingVertical: 3, paddingHorizontal: 6, borderRadius: 6}}>
                <Text weight={600} style={{fontSize: 10}}>Principală</Text>
              </View>
            </View>
            <View style={{width: tile, height: tile * 4 / 3, borderRadius: theme.radius.input, overflow: "hidden"}}>
              <PersonPhoto personId={currentUser.id} variant="b" width="100%" height="100%"/>
            </View>
            {(["concert", "photo"] as const).map((kind) => (
              <View key={kind} style={{width: tile, height: tile * 4 / 3, borderRadius: theme.radius.input, overflow: "hidden"}}><Scene kind={kind}/></View>
            ))}
            {photos.map((uri) => (
              <Image key={uri} source={{uri}} accessibilityLabel="Poza ta" style={{width: tile, height: tile * 4 / 3, borderRadius: theme.radius.input}}/>
            ))}
            {Array.from({length: Math.max(0, missingPhotos)}, (_, i) => (
              <DashedButton key={i} label="Adaugă poză" onPress={addPhoto} style={{width: tile, height: tile * 4 / 3}}>
                <Plus size={theme.icon.lg} color={theme.color.accentText} strokeWidth={theme.icon.strokeActive}/>
              </DashedButton>
            ))}
          </View>
        </View>

        <View style={{gap: theme.space.md}}>
          <View style={{gap: 2}}>
            <Text variant="label" color={theme.color.muted}>Ce cauți pe Meetvent</Text>
            <Text variant="meta" color={theme.color.muted}>Apari doar în modurile bifate.</Text>
          </View>
          <View style={{flexDirection: "row", flexWrap: "wrap", gap: theme.space.sm}}>
            {GOALS.map((g) => {
              const on = goals.includes(g.id);
              return (
                <Pressable key={g.id} accessibilityRole="checkbox" accessibilityState={{checked: on}}
                           onPress={() => {
                             if (on && goals.length === 1) { showToast("Păstrează cel puțin un mod"); return; }
                             toggleGoal(g.id);
                           }}
                           hitSlop={4}
                           style={{height: 36, paddingHorizontal: theme.space.xl, borderRadius: 18, borderWidth: 1, borderColor: on ? theme.color.accentLine : theme.color.borderControl, backgroundColor: on ? theme.color.accentSoft : theme.color.bg, flexDirection: "row", alignItems: "center", gap: theme.space.xs}}>
                  {on && <Check size={14} color={theme.color.accentText} strokeWidth={2.2}/>}
                  <Text weight={on ? 600 : 500} color={on ? theme.color.accentText : theme.color.ink} style={{fontSize: theme.fontSize.label}}>{g.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{gap: theme.space.xs}}>
          <SectionTitle action={editingBio ? "Gata" : "Editează"} onAction={() => setEditingBio((e) => !e)}>Despre mine</SectionTitle>
          {editingBio ? (
            <View style={{gap: theme.space.xxs}}>
              <TextInput
                accessibilityLabel="Despre mine"
                value={bio}
                onChangeText={(v) => setBio(v.slice(0, MAX_BIO))}
                multiline
                autoFocus
                style={{minHeight: 96, borderRadius: theme.radius.input, borderWidth: 1, borderColor: theme.color.borderControl, padding: theme.space.lg, fontFamily: theme.fontFamily[400], fontSize: theme.fontSize.body, color: theme.color.ink, textAlignVertical: "top"}}
              />
              <Text variant="meta" color={theme.color.muted} style={{alignSelf: "flex-end"}}>{bio.length}/{MAX_BIO}</Text>
            </View>
          ) : (
            <Text style={{lineHeight: 22}}>{bio || "Spune-le celorlalți câte ceva despre tine."}</Text>
          )}
        </View>

        <View style={{gap: theme.space.sm}}>
          <Text variant="label" color={theme.color.muted}>Prompturi · {prompts.length} din {MAX_PROMPTS}</Text>
          {prompts.map((p) => (
            <Pressable key={p.question} accessibilityRole="button" accessibilityHint="Editează promptul" onPress={() => showToast("Editarea prompturilor vine în curând")}
                       style={{borderRadius: theme.radius.input, borderWidth: 1, borderColor: theme.color.border, paddingVertical: theme.space.xl, paddingHorizontal: 16, gap: theme.space.xxs}}>
              <Text variant="meta" color={theme.color.muted}>{p.question}</Text>
              <Text weight={600} style={{fontSize: theme.fontSize.bodyLg, lineHeight: 21}}>{p.answer}</Text>
            </Pressable>
          ))}
          {prompts.length < MAX_PROMPTS && (
            <DashedButton label="Adaugă un prompt" onPress={() => showToast("Alegerea prompturilor vine în curând")} style={{height: 48, flexDirection: "row", gap: theme.space.xs}}>
              <Plus size={16} color={theme.color.accentText} strokeWidth={theme.icon.strokeActive}/>
              <Text weight={600} color={theme.color.accentText} style={{fontSize: theme.fontSize.label}}>Adaugă un prompt</Text>
            </DashedButton>
          )}
        </View>

        <View>
          <View style={{marginBottom: theme.space.xxs}}><Text variant="label" color={theme.color.muted}>Detalii</Text></View>
          {detailRows.map(([label, value]) => (
            <Pressable key={label} accessibilityRole="button" accessibilityLabel={`${label}: ${value ?? "necompletat"}`}
                       onPress={() => showToast(`Editarea câmpului ${label} vine în curând`)}
                       style={{height: 48, borderBottomWidth: 1, borderBottomColor: theme.color.divider, flexDirection: "row", alignItems: "center", gap: theme.space.lg}}>
              <Text style={{flex: 1}}>{label}</Text>
              <Text weight={value ? 400 : 600} color={value ? theme.color.muted : theme.color.accentText} style={{fontSize: theme.fontSize.label}}>{value ?? "Adaugă"}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{gap: theme.space.md}}>
          <SectionTitle action="Editează" onAction={() => showToast("Editarea intereselor vine în curând")}>Interese</SectionTitle>
          <View style={{flexDirection: "row", flexWrap: "wrap", gap: theme.space.sm}}>
            {(currentUser.interests ?? []).map((i) => (
              <View key={i} style={{height: theme.size.chip, paddingHorizontal: theme.space.lg, borderRadius: 17, backgroundColor: theme.color.accentSoft, justifyContent: "center"}}>
                <Text weight={600} color={theme.color.accentText} style={{fontSize: theme.fontSize.label}}>{i}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{flexDirection: "row", alignItems: "center", gap: theme.space.lg, paddingVertical: theme.space.xl, paddingHorizontal: 16, borderRadius: theme.radius.input, borderWidth: 1, borderColor: theme.color.border}}>
          <View style={{flex: 1, gap: 1}}>
            <Text weight={600}>Muzica ta</Text>
            <Text variant="meta" color={theme.color.muted}>Arată artiștii tăi de top</Text>
          </View>
          <Pressable accessibilityRole="button" hitSlop={5} onPress={() => showToast("Conectarea Spotify vine în curând")}
                     style={{height: theme.size.chip, paddingHorizontal: theme.space.lg, borderRadius: 17, borderWidth: 1, borderColor: theme.color.accentText, justifyContent: "center"}}>
            <Text weight={600} color={theme.color.accentText} style={{fontSize: theme.fontSize.label}}>Conectează Spotify</Text>
          </Pressable>
        </View>

        <View>
          <View style={{marginBottom: theme.space.xxs}}><Text variant="label" color={theme.color.muted}>Confidențialitate</Text></View>
          {([
            ["showEvents", "Arată la ce evenimente merg", "Alții văd evenimentele comune pe profilul tău"],
            ["showDistance", "Arată distanța", "Ascunde-o dacă vrei mai multă discreție"],
          ] as const).map(([key, label, hint]) => (
            <View key={key} style={{flexDirection: "row", alignItems: "center", gap: theme.space.lg, paddingVertical: theme.space.lg, borderBottomWidth: 1, borderBottomColor: theme.color.divider}}>
              <View style={{flex: 1, gap: 2}}>
                <Text weight={500}>{label}</Text>
                <Text variant="meta" color={theme.color.muted}>{hint}</Text>
              </View>
              <Toggle value={privacy[key]} onValueChange={(v) => setPrivacy(key, v)} accessibilityLabel={label}/>
            </View>
          ))}
        </View>

        <Pressable accessibilityRole="button" onPress={confirmLogout}
                   style={{alignSelf: "center", height: 40, paddingHorizontal: 22, borderRadius: 20, borderWidth: 1, borderColor: theme.color.dangerBorder, flexDirection: "row", alignItems: "center", gap: theme.space.sm}}>
          <LogOut size={16} color={theme.color.danger} strokeWidth={theme.icon.strokeActive}/>
          <Text weight={600} color={theme.color.danger} style={{fontSize: theme.fontSize.label}}>Deconectare</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
