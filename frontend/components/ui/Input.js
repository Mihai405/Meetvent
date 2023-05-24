import { StyleSheet, View, Text, TextInput } from "react-native";
import Colors from "../../constants/colors";
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';

const Input = ({label, icon, isInvalid, textInputConfig}) => {
  const [inputBorderColor, setInputBorderColor] = useState(Colors.grey800);

  function customOnFocus() {
    setInputBorderColor(Colors.primary500);
  }

  function customOnBlur() {
    setInputBorderColor(Colors.grey800);
  }

  return (
    <View style={styles.inputContainer}>
      <Text
        style={[
          styles.label,
          { color: inputBorderColor },
          isInvalid && styles.labelInvalid
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.input,
          { borderColor: inputBorderColor },
          isInvalid && styles.inputInvalid,
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color={isInvalid ? Colors.error500 : inputBorderColor}
        />
        <TextInput
          style={{ marginHorizontal: icon ? 8 : 0, flex: 1 }}
          {...textInputConfig}
          autoCorrect={false}
          autoCapitalize="none"
          onFocus={customOnFocus}
          onBlur={customOnBlur}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 8,
    },
    label: {
        marginBottom: 4,
        marginLeft: 8,
        fontWeight: "bold"
    },
    labelInvalid: {
        color: Colors.error500,
        fontWeight: "bold"
    },
    input: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1
    },
    inputInvalid: {
        borderWidth: 2,
        borderColor: Colors.error500
    },
})

export default Input;
