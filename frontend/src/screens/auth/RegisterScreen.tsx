import {useState} from "react";
import {Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {Camera, Check, ChevronLeft, MapPin} from "lucide-react-native";
import {CITY, GOALS, interestOptions, PROTOTYPE_NOW} from "../../data";
import type {Goal} from "../../data/types";
import type {RootScreenProps} from "../../navigation/types";
import {
  birthDateError,
  canFinishRegistration,
  emailError,
  firstNameError,
  maskBirthDate,
  passwordError,
  preferencesHint,
} from "../../logic/register";
import {useStore} from "../../store/PrototypeStore";
import {useTheme} from "../../theme/ThemeProvider";
import Button from "../../ui/Button";
import Chip from "../../ui/Chip";
import Input from "../../ui/Input";
import Text from "../../ui/Text";

type Step = 1 | 2 | 3;

const HINTS = {
  1: "Ai deja cont? Te poți autentifica din ecranul anterior.",
  2: "Poți schimba oricând aceste detalii din profil.",
};

function Checkbox({checked, onChange, children}: {checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{checked}}
      onPress={() => onChange(!checked)}
      style={{flexDirection: "row", alignItems: "flex-start", gap: theme.space.md, minHeight: theme.size.touch}}
    >
      <View style={{
        width: 20, height: 20, borderRadius: 5, marginTop: 1,
        borderWidth: 1.5, borderColor: checked ? theme.color.accentFill : theme.color.borderControl,
        backgroundColor: checked ? theme.color.accentFill : theme.color.bg,
        alignItems: "center", justifyContent: "center",
      }}>
        {checked && <Check size={14} color={theme.color.onAccentFill} strokeWidth={3}/>}
      </View>
      <View style={{flex: 1}}>{children}</View>
    </Pressable>
  );
}

export default function RegisterScreen({navigation}: RootScreenProps<"Register">) {
  const theme = useTheme();
  const {logIn} = useStore();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(true);
  const [photo, setPhoto] = useState<string>();
  const [firstName, setFirstName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [interests, setInterests] = useState<string[]>(["Festivaluri", "Techno"]);
  const [goals, setGoals] = useState<Goal[]>(["friends"]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

  const next = () => {
    const stepErrors = step === 1
      ? {email: emailError(email), password: passwordError(password)}
      : {firstName: firstNameError(firstName), birthDate: birthDateError(birthDate, PROTOTYPE_NOW)};
    setErrors(stepErrors);
    if (Object.values(stepErrors).every((e) => !e)) setStep((s) => (s + 1) as Step);
  };

  const back = () => (step === 1 ? navigation.goBack() : setStep((s) => (s - 1) as Step));

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Acces la poze", "Permite accesul la poze din Setări ca să adaugi o poză de profil.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.7});
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const canFinish = step === 3 && canFinishRegistration(interests.length, goals);
  const hint = step === 3 ? preferencesHint(interests.length, goals) : HINTS[step];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.color.bg}}>
      <View style={{paddingTop: theme.space.lg, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: theme.space.sm}}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={step === 1 ? "Înapoi la autentificare" : "Pasul anterior"}
          onPress={back}
          style={{width: theme.size.touch, height: theme.size.touch, alignItems: "center", justifyContent: "center"}}
        >
          <ChevronLeft size={theme.icon.lg} color={theme.color.ink} strokeWidth={theme.icon.strokeActive}/>
        </Pressable>
        <View accessibilityRole="progressbar" accessibilityLabel="Progres înregistrare" accessibilityValue={{min: 1, max: 3, now: step}}
              style={{flex: 1, flexDirection: "row", gap: theme.space.xs}}>
          {[1, 2, 3].map((n) => (
            <View key={n} style={{flex: 1, height: 4, borderRadius: 2, backgroundColor: n <= step ? theme.color.accent : theme.color.border}}/>
          ))}
        </View>
        <Text variant="meta" color={theme.color.muted} style={{width: theme.size.touch, textAlign: "center"}}>{step}/3</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{flex: 1}}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{padding: theme.space.screenXAuth, gap: 22}}>
          {step === 1 && (
            <>
              <View style={{gap: theme.space.xs}}>
                <Text variant="page" accessibilityRole="header">Creează-ți contul</Text>
                <Text color={theme.color.muted}>Durează un minut. Promitem.</Text>
              </View>
              <Input label="Email" placeholder="nume@exemplu.ro" value={email} onChangeText={setEmail} error={errors.email}
                     keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress"/>
              <Input label="Parolă" placeholder="Minim 8 caractere" value={password} onChangeText={setPassword} password
                     hint="Folosește cel puțin o cifră și o literă mare." error={errors.password} autoComplete="new-password" textContentType="newPassword"/>
              <Checkbox checked={terms} onChange={setTerms}>
                <Text color={theme.color.inkBody} style={{fontSize: theme.fontSize.label}}>
                  Accept <Text weight={600} color={theme.color.accentText} style={{fontSize: theme.fontSize.label}}>Termenii</Text> și{" "}
                  <Text weight={600} color={theme.color.accentText} style={{fontSize: theme.fontSize.label}}>Politica de confidențialitate</Text>.
                </Text>
              </Checkbox>
            </>
          )}

          {step === 2 && (
            <>
              <View style={{gap: theme.space.xs}}>
                <Text variant="page" accessibilityRole="header">Despre tine</Text>
                <Text color={theme.color.muted}>Asta văd ceilalți prima dată.</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Adaugă o poză de profil"
                onPress={pickPhoto}
                style={{
                  alignSelf: "center", width: 112, height: 112, borderRadius: 56, overflow: "hidden",
                  borderWidth: 1, borderStyle: "dashed", borderColor: theme.color.accentLine, backgroundColor: theme.color.accentSoft,
                  alignItems: "center", justifyContent: "center", gap: theme.space.xxs,
                }}
              >
                {photo
                  ? <Image source={{uri: photo}} style={{width: "100%", height: "100%"}}/>
                  : <>
                      <Camera size={theme.icon.lg} color={theme.color.accentText} strokeWidth={theme.icon.stroke}/>
                      <Text variant="meta" weight={600} color={theme.color.accentText}>Adaugă poză</Text>
                    </>}
              </Pressable>
              <Input label="Prenume" placeholder="Cum te strigă prietenii" value={firstName} onChangeText={setFirstName}
                     error={errors.firstName} autoComplete="given-name" textContentType="givenName"/>
              <Input label="Data nașterii" placeholder="ZZ / LL / AAAA" value={birthDate} keyboardType="number-pad"
                     onChangeText={(v) => setBirthDate(maskBirthDate(v))} error={errors.birthDate}
                     hint="Trebuie să ai cel puțin 18 ani. Arătăm doar vârsta."/>
              <Input label="Oraș" value={CITY} editable={false}
                     icon={<MapPin size={theme.icon.sm} color={theme.color.iconMuted} strokeWidth={theme.icon.stroke}/>}/>
            </>
          )}

          {step === 3 && (
            <>
              <View style={{gap: theme.space.xs}}>
                <Text variant="page" accessibilityRole="header">Ce îți place?</Text>
                <Text color={theme.color.muted}>Alege cel puțin 3. Așa îți arătăm evenimente și oameni potriviți.</Text>
              </View>
              <View style={{flexDirection: "row", flexWrap: "wrap", gap: theme.space.sm}}>
                {interestOptions.map((i) => (
                  <Chip key={i} label={i} tone="soft" selected={interests.includes(i)} onPress={() => setInterests(toggle(interests, i))}/>
                ))}
              </View>
              <View style={{gap: theme.space.md}}>
                <Text weight={500} style={{fontSize: theme.fontSize.label}}>Ce cauți?</Text>
                <View style={{flexDirection: "row", gap: theme.space.sm}}>
                  {GOALS.map((g) => (
                    <View key={g.id} style={{flex: 1}}>
                      <Chip label={g.label} tone="soft" fullWidth selected={goals.includes(g.id)} onPress={() => setGoals(toggle(goals, g.id))}/>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
        </ScrollView>

        <View style={{paddingHorizontal: theme.space.screenXAuth, paddingBottom: theme.space.lg, gap: theme.space.md}}>
          {step < 3
            ? <Button title="Continuă" onPress={next} disabled={step === 1 && !terms}/>
            : <Button title="Gata, intră în Meetvent" onPress={logIn} disabled={!canFinish}/>}
          <Text variant="meta" color={theme.color.muted} style={{textAlign: "center"}} accessibilityLiveRegion="polite">{hint}</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
