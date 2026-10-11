import {useState} from "react";
import {KeyboardAvoidingView, Platform, Pressable, ScrollView, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Lock, Mail} from "lucide-react-native";
import type {RootScreenProps} from "../../navigation/types";
import {emailError} from "../../logic/register";
import {useStore} from "../../store/PrototypeStore";
import {useTheme} from "../../theme/ThemeProvider";
import AvatarStack from "../../ui/AvatarStack";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import {LogoMark} from "../../ui/Logo";
import Text from "../../ui/Text";

const FACES = ["u_ioana", "u_radu", "u_maria", "u_alex"];

export default function LoginScreen({navigation}: RootScreenProps<"Login">) {
  const theme = useTheme();
  const {logIn, showToast} = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const submit = () => {
    const next = {email: emailError(email), password: password ? undefined : "Introdu parola."};
    setErrors(next);
    if (!next.email && !next.password) logIn();
  };

  const iconProps = {size: theme.icon.sm, color: theme.color.iconMuted, strokeWidth: theme.icon.stroke};

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.color.bg}}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{flex: 1}}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flexGrow: 1, paddingTop: 40, paddingHorizontal: theme.space.screenXAuth, paddingBottom: theme.space["3xl"]}}>
          <View style={{alignItems: "center", gap: theme.space.lg}}>
            <LogoMark size={34}/>
            <Text weight={700} accessibilityRole="header" style={{fontSize: theme.fontSize.profileName, letterSpacing: -0.56}}>Meetvent</Text>
            <Text color={theme.color.muted} style={{textAlign: "center"}}>Cunoaște oameni noi la evenimentele{"\n"}la care mergi oricum.</Text>
            <View style={{marginTop: theme.space.xxs}}>
              <AvatarStack people={FACES.map((id) => ({id, personId: id, name: id.slice(2)}))} size={34}/>
            </View>
          </View>

          <View style={{gap: theme.space.xl, marginTop: 36}}>
            <Input label="Email" placeholder="nume@exemplu.ro" icon={<Mail {...iconProps}/>} value={email} onChangeText={setEmail}
                   error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress"/>
            <Input label="Parolă" placeholder="Parola ta" icon={<Lock {...iconProps}/>} password value={password} onChangeText={setPassword}
                   error={errors.password} autoComplete="current-password" textContentType="password" onSubmitEditing={submit}/>
            <Pressable accessibilityRole="link" onPress={() => showToast("Ți-am trimis un link de resetare pe email")} style={{alignSelf: "flex-end", paddingVertical: theme.space.xxs}}>
              <Text weight={600} color={theme.color.accentText} style={{fontSize: theme.fontSize.label}}>Ai uitat parola?</Text>
            </Pressable>
          </View>

          <Button title="Autentificare" onPress={submit} style={{marginTop: theme.space["2xl"]}}/>

          <View style={{flexDirection: "row", alignItems: "center", gap: theme.space.lg, marginVertical: 22}}>
            <View style={{flex: 1, height: 1, backgroundColor: theme.color.border}}/>
            <Text variant="meta" color={theme.color.muted}>sau</Text>
            <View style={{flex: 1, height: 1, backgroundColor: theme.color.border}}/>
          </View>

          <View style={{gap: theme.space.md}}>
            <Button title="Continuă cu Apple" variant="outline" size="md" onPress={logIn}/>
            <Button title="Continuă cu Google" variant="outline" size="md" onPress={logIn}/>
          </View>

          <View style={{marginTop: "auto", paddingTop: theme.space["3xl"], flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <Text color={theme.color.muted}>Nu ai cont? </Text>
            <Pressable accessibilityRole="link" onPress={() => navigation.navigate("Register")} style={{paddingVertical: theme.space.lg, paddingHorizontal: theme.space.xxs}}>
              <Text weight={600} color={theme.color.accentText}>Creează unul</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
