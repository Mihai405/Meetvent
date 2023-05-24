import { Alert, StyleSheet, View } from "react-native";
import ButtonContainedLarge from "../ui/ButtonContainedLarged";
import Input from "../ui/Input";
import Colors from "../../constants/colors";
import { useState } from "react";

const LogInForm = ({onAuthenticate}) => {
  const logInObject = {
    email: { value: "", isInvalid: false },
    password: { value: "", isInvalid: false },
  };

  const [credentials, setCredentials] = useState(logInObject);

  function handleInputChange(credentialIdentifier, enteredValue) {
    setCredentials((prevCredentials) => {
      return {
        ...prevCredentials,
        [credentialIdentifier]: { value: enteredValue, isInvalid: false },
      };
    });
  }

  function handleSubmit() {
    const email = credentials.email.value.trim();
    const password = credentials.password.value.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;

    if (!emailIsValid || !passwordIsValid) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentials((currentCredentials) => {
        return {
          email: {
            value: currentCredentials.email.value,
            isInvalid: !emailIsValid,
          },
          password: {
            value: currentCredentials.password.value,
            isInvalid: !passwordIsValid,
          },
        };
      });
      return;
    }
    onAuthenticate({email, password});
  }

  return (
    <View style={styles.container}>
      <Input
        label="Email Address"
        icon="mail-outline"
        isInvalid={credentials.email.isInvalid}
        textInputConfig={{
          onChangeText: handleInputChange.bind(this, "email"),
          value: credentials.email.value,
        }}
      />
      <Input
        label="Password"
        icon="lock-closed-outline"
        isInvalid={credentials.password.isInvalid}
        textInputConfig={{
          onChangeText: handleInputChange.bind(this, "password"),
          secureTextEntry: true,
          value: credentials.password.value,
        }}
      />
      <View style={styles.buttons}>
        <ButtonContainedLarge
          color={Colors.primary500}
          icon="arrow-forward-circle-outline"
          iconSize={28}
          onPress={handleSubmit}
        >
          LOGIN
        </ButtonContainedLarge>
      </View>
    </View>
  );
};

export default LogInForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 24,
    justifyContent: "center",
    alignSelf: "center",
  },
});
