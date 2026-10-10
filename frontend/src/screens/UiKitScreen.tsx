import {ReactNode, useState} from "react";
import {Pressable, ScrollView, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Bookmark, Heart, Mail, Settings, SlidersHorizontal, X} from "lucide-react-native";
import {useSetAccent, useTheme} from "../theme/ThemeProvider";
import {ACCENT_OPTIONS} from "../theme/tokens";
import Avatar from "../ui/Avatar";
import AvatarStack from "../ui/AvatarStack";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Chip from "../ui/Chip";
import IconButton from "../ui/IconButton";
import Input from "../ui/Input";
import Logo from "../ui/Logo";
import SearchInput from "../ui/SearchInput";
import TabBar from "../ui/TabBar";
import Text from "../ui/Text";
import TextTabs from "../ui/TextTabs";
import Toggle from "../ui/Toggle";

// Lets screenshots of the lower sections be taken without manual scrolling
const INITIAL_SCROLL_Y = Number(process.env.EXPO_PUBLIC_UI_KIT_Y ?? 0);

const PEOPLE = [
  {id: "1", name: "Ioana"},
  {id: "2", name: "Radu"},
  {id: "3", name: "Maria"},
  {id: "4", name: "Alex"},
];

function Section({title, children}: {title: string; children: ReactNode}) {
  const theme = useTheme();
  return (
    <View style={{gap: theme.space.lg}}>
      <Text variant="label" color={theme.color.muted}>{title}</Text>
      {children}
    </View>
  );
}

// Step 1 preview of the design foundation (theme + base components).
export default function UiKitScreen() {
  const theme = useTheme();
  const setAccent = useSetAccent();
  const [category, setCategory] = useState("music");
  const [interests, setInterests] = useState(["Techno", "Drumeții"]);
  const [mode, setMode] = useState<"friends" | "dating" | "networking">("friends");
  const [showEvents, setShowEvents] = useState(true);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("Home");

  const toggleInterest = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  return (
    <SafeAreaView edges={["top"]} style={{flex: 1, backgroundColor: theme.color.bgWarm}}>
      <ScrollView contentOffset={{x: 0, y: INITIAL_SCROLL_Y}} contentContainerStyle={{padding: theme.space.screenX, gap: theme.space["3xl"]}}>
        <Logo/>
        <Text variant="page">UI kit · pasul 1</Text>

        <Section title="Accent (derivat din brand)">
          <View style={{flexDirection: "row", gap: theme.space.md}}>
            {ACCENT_OPTIONS.map((a) => (
              <Pressable key={a} accessibilityLabel={`Accent ${a}`} onPress={() => setAccent(a)}
                         style={{width: 36, height: 36, borderRadius: 18, backgroundColor: a, borderWidth: a === theme.color.accent ? 3 : 0, borderColor: theme.color.ink}}/>
            ))}
          </View>
          <View style={{flexDirection: "row", gap: theme.space.sm}}>
            {(["accent", "accentFill", "accentText", "accentSoft", "accentLine"] as const).map((k) => (
              <View key={k} style={{alignItems: "center", gap: theme.space.xxs}}>
                <View style={{width: 52, height: 36, borderRadius: theme.radius.thumbSm, backgroundColor: theme.color[k], borderWidth: 1, borderColor: theme.color.border}}/>
                <Text variant="meta" color={theme.color.muted} style={{fontSize: 10}}>{k.replace("accent", "") || "base"}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Tipografie">
          <Text variant="hero">Ce faci weekendul ăsta?</Text>
          <Text variant="section">În tendințe</Text>
          <Text variant="body" color={theme.color.inkBody}>Corp 14 · Cunoaște oameni noi la evenimentele la care mergi oricum.</Text>
          <Text variant="meta" color={theme.color.muted}>Meta 12 · Vin 16 oct · 22:00 · Form Space</Text>
        </Section>

        <Section title="Butoane">
          <Button title="Autentificare"/>
          <Button title="Merg și eu" disabled/>
          <Button title="Continuă cu Google" variant="outline" size="md"/>
          <View style={{flexDirection: "row", gap: theme.space.md, alignItems: "center"}}>
            <Button title="Urmărește" variant="outline" size="sm"/>
            <IconButton accessibilityLabel="Filtre" icon={<SlidersHorizontal size={18} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>}/>
            <IconButton accessibilityLabel="Salvează" selected={saved} onPress={() => setSaved((s) => !s)}
                        icon={<Bookmark size={18} color={saved ? theme.color.accentText : theme.color.ink} fill={saved ? theme.color.accent : "none"} strokeWidth={theme.icon.stroke}/>}/>
            <IconButton accessibilityLabel="Treci peste" icon={<X size={20} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>}/>
            <IconButton accessibilityLabel="Îmi place" icon={<Heart size={20} color={theme.color.accentText} strokeWidth={theme.icon.stroke}/>}/>
          </View>
        </Section>

        <Section title="Chip-uri">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: theme.space.sm}}>
            {[["all", "Toate"], ["music", "Muzică"], ["sport", "Sport"], ["art", "Artă"], ["tech", "Tech"]].map(([id, label]) => (
              <Chip key={id} label={label} selected={category === id} onPress={() => setCategory(id)}/>
            ))}
          </ScrollView>
          <View style={{flexDirection: "row", flexWrap: "wrap", gap: theme.space.sm}}>
            {["Festivaluri", "Techno", "Drumeții", "Fotografie", "Jazz"].map((i) => (
              <Chip key={i} label={i} tone="soft" selected={interests.includes(i)} onPress={() => toggleInterest(i)}/>
            ))}
          </View>
        </Section>

        <Section title="Taburi">
          <TextTabs value={mode} onChange={setMode}
                    tabs={[{id: "friends", label: "Prieteni"}, {id: "dating", label: "Dating"}, {id: "networking", label: "Networking"}]}/>
        </Section>

        <Section title="Input-uri">
          <Input label="Email" placeholder="nume@exemplu.ro" keyboardType="email-address" autoCapitalize="none"
                 icon={<Mail size={18} color={theme.color.iconMuted} strokeWidth={theme.icon.stroke}/>}/>
          <Input label="Parolă" placeholder="Parola ta" password hint="Minim 8 caractere, o cifră"/>
          <Input label="Prenume" placeholder="Ana" error="Câmp obligatoriu"/>
          <View style={{flexDirection: "row", gap: theme.space.md}}>
            <SearchInput placeholder="Caută evenimente, locuri…"/>
            <IconButton accessibilityLabel="Setări" icon={<Settings size={18} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>}/>
          </View>
        </Section>

        <Section title="Toggle, avatare, badge">
          <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
            <Text>Arată evenimentele mele</Text>
            <Toggle value={showEvents} onValueChange={setShowEvents} accessibilityLabel="Arată evenimentele mele"/>
          </View>
          <View style={{flexDirection: "row", alignItems: "center", gap: theme.space.lg}}>
            <Avatar name="Ana" size={theme.size.avatarLg}/>
            <Avatar name="Ioana" size={theme.size.avatarMd} accentRing/>
            <AvatarStack people={PEOPLE}/>
            <Badge label="14 compatibili"/>
          </View>
        </Section>
      </ScrollView>
      <TabBar activeKey={tab} onPress={setTab}/>
    </SafeAreaView>
  );
}
