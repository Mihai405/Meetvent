import {ReactNode, useState} from "react";
import {Pressable, TextInput, TextInputProps, View} from "react-native";
import {Eye, EyeOff} from "lucide-react-native";
import {useTheme} from "../theme/ThemeProvider";
import Text from "./Text";

type Props = Omit<TextInputProps, "style"> & {
  label?: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  password?: boolean;
};

export default function Input({label, hint, error, icon, password, ...inputProps}: Props) {
  const theme = useTheme();
  const [hidden, setHidden] = useState(true);
  return (
    <View style={{gap: theme.space.xs}}>
      {label && <Text weight={500} style={{fontSize: theme.fontSize.label}}>{label}</Text>}
      <View
        style={{
          height: theme.size.input,
          borderRadius: theme.radius.input,
          borderWidth: 1,
          borderColor: error ? theme.color.dangerBorder : theme.color.borderControl,
          flexDirection: "row",
          alignItems: "center",
          gap: theme.space.md,
          paddingLeft: theme.space.xl,
          paddingRight: password ? theme.space.xxs : theme.space.xl,
        }}
      >
        {icon}
        <TextInput
          {...inputProps}
          accessibilityLabel={inputProps.accessibilityLabel ?? label}
          secureTextEntry={password && hidden}
          placeholderTextColor={theme.color.iconMuted}
          style={{flex: 1, fontFamily: theme.fontFamily[400], fontSize: theme.fontSize.bodyLg, color: theme.color.ink}}
        />
        {password && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Arată parola" : "Ascunde parola"}
            onPress={() => setHidden((h) => !h)}
            style={{width: theme.size.touch, height: theme.size.touch, alignItems: "center", justifyContent: "center"}}
          >
            {hidden
              ? <Eye size={theme.icon.md} color={theme.color.muted} strokeWidth={theme.icon.stroke}/>
              : <EyeOff size={theme.icon.md} color={theme.color.muted} strokeWidth={theme.icon.stroke}/>}
          </Pressable>
        )}
      </View>
      {(error || hint) && (
        <Text variant="meta" color={error ? theme.color.danger : theme.color.muted}>{error ?? hint}</Text>
      )}
    </View>
  );
}
