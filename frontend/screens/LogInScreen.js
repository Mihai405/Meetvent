import { TextInput, View, StyleSheet, Image, Button, Text } from "react-native";
import Colors from "../constants/colors";
import ButtonOutlined from "../components/ui/ButtonOutlined";
import LogInForm from "../components/Auth/LogInForm";
import TextBetweenHorizontalLines from "../components/ui/TextBetweenHorizontalLines";
import { useContext, useState } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { AuthContext } from "../components/store/auth-context";

const LogInScreen = ({ navigation }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  function switchToRegister() {
    navigation.replace("Register");
  }

  async function handleAuthentication({ email, password }) {
    setIsAuthenticating(true);
    const response = await fetch("http://localhost:8080/auth/signin", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      Alert.alert(
        "Authentication failed!",
        "Could not log you in. Please check your credentials or try again later!"
      );
      setIsAuthenticating(false);
    } else {
      const data = await response.json();
      authCtx.authenticate(data.token);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logoContainer}
        source={require("./../assets/logo.png")}
      />
      <View>
        <LogInForm onAuthenticate={handleAuthentication} />
      </View>
      <View style={styles.bottomContainer}>
        <TextBetweenHorizontalLines text="Don't you have an account" />
        <View style={styles.loginButtonContainer}>
          <ButtonOutlined onPress={switchToRegister}>REGISTER</ButtonOutlined>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignSelf: "center",
    marginTop: 36,
    width: 200,
    height: 80,
  },
  bottomContainer: {
    marginBottom: 36,
  },
  loginButtonContainer: {
    width: 150,
    alignSelf: "center",
  },
});

export default LogInScreen;
