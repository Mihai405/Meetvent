import { Alert, StyleSheet, View } from "react-native";
import Input from "../ui/Input";
import Colors from "../../constants/colors";
import ButtonContainedLarge from "../ui/ButtonContainedLarged";
import { useState } from "react";

const RegisterForm = ({onAuthenticate}) => {
  credentialInputVO = {
    value: "",
    isInvalid: false,
  };

  const registerObject = {
    username: { ...credentialInputVO },
    email: { ...credentialInputVO },
    password: { ...credentialInputVO },
    confirmPassword: { ...credentialInputVO },
  };

  const [credentials, setCredentials] = useState(registerObject);

  function handleInputChange(credentialIdentifier, enteredText) {
    setCredentials((prevCredentials) => {
      return {
        ...prevCredentials,
        [credentialIdentifier]: { value: enteredText, isInvalid: false },
      };
    });
  }

  function handleSubmit() {
    const username = credentials.username.value.trim();
    const email = credentials.email.value.trim();
    const password = credentials.password.value.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;
    const passwordsAreEqual = password === credentials.confirmPassword.value;

    if (!emailIsValid || !passwordIsValid || !passwordsAreEqual) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentials((currentCredentials) => {
        return {
          username: {
            value: currentCredentials.username.value,
            isInvalid: false,
          },
          email: {
            value: currentCredentials.email.value,
            isInvalid: !emailIsValid,
          },
          password: {
            value: currentCredentials.password.value,
            isInvalid: !passwordIsValid,
          },
          confirmPassword: {
            value: currentCredentials.confirmPassword.value,
            isInvalid: !passwordIsValid || !passwordsAreEqual,
          },
        };
      });
      return;
    }
    onAuthenticate({username, email, password });
  }

  return (
    <View>
      <Input
        label="Username"
        icon="person-outline"
        isInvalid={credentials.username.isInvalid}
        textInputConfig={{
          onChangeText: handleInputChange.bind(this, "username"),
          value: credentials.username.value,
        }}
      />
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
      <Input
        label="Confirm Password"
        icon="lock-closed-outline"
        isInvalid={credentials.confirmPassword.isInvalid}
        textInputConfig={{
          onChangeText: handleInputChange.bind(this, "confirmPassword"),
          secureTextEntry: true,
          value: credentials.confirmPassword.value,
        }}
      />
      <View style={styles.buttons}>
        <ButtonContainedLarge
          color={Colors.primary500}
          icon="arrow-forward-circle-outline"
          iconSize={28}
          iconOnTheRight={true}
          onPress={handleSubmit}
        >
          REGISTER
        </ButtonContainedLarge>
      </View>
    </View>
  );
};

export default RegisterForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 24,
    justifyContent: "center",
    alignSelf: "center",
  },
});
