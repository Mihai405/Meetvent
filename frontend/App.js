import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import LogInScreen from "./screens/LogInScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
  AuthContext,
  AuthContextProvider,
} from "./components/store/auth-context";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LogInScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authContext = useContext(AuthContext);
  return (
    <NavigationContainer style={styles.rootScreen}>
      {!authContext.isAuthenticated && <AuthNavigator />}
      {authContext.isAuthenticated && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Button title="LogOut" onPress={() => authContext.logout()}/>
        </View>
      )}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authContext = useContext(AuthContext);
  useEffect(() => {
    async function fetchToken() {
      const authToken = await AsyncStorage.getItem("token");
      if (authToken) {
        authContext.authenticate(authToken);
      }
      setIsTryingLogin(false);
    }
    fetchToken();
  }, []);
  if (isTryingLogin) {
    return <LoadingOverlay />;
  }
  return <Navigation />;
}

export default function App() {
  return (
    <AuthContextProvider>
      <Root />
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
});
