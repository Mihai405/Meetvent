import {LinkingOptions, NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import * as Linking from "expo-linking";
import {useStore} from "../store/PrototypeStore";
import {useTheme} from "../theme/ThemeProvider";
import TabBar from "../ui/TabBar";
import Toast from "../ui/Toast";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import HomeScreen from "../screens/main/HomeScreen";
import EventsScreen from "../screens/main/EventsScreen";
import ConnectScreen from "../screens/main/ConnectScreen";
import MessagesScreen from "../screens/main/MessagesScreen";
import MyProfileScreen from "../screens/main/MyProfileScreen";
import EventDetailScreen from "../screens/main/EventDetailScreen";
import ProfileViewScreen from "../screens/main/ProfileViewScreen";
import ConversationScreen from "../screens/main/ConversationScreen";
import type {RootStackParamList, TabParamList} from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Deep links, e.g. exp://127.0.0.1:8081/--/event/techno in Expo Go.
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Login: "login",
      Register: "register",
      Tabs: {
        screens: {Home: "home", Events: "events", Connect: "connect", Messages: "messages", Profile: "profile"},
      },
      EventDetail: "event/:id",
      ProfileView: "person/:id",
      Conversation: "chat/:id",
    },
  },
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={({state, navigation}) => (
        <TabBar activeKey={state.routes[state.index].name} onPress={(key) => navigation.navigate(key)}/>
      )}
    >
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Events" component={EventsScreen}/>
      <Tab.Screen name="Connect" component={ConnectScreen}/>
      <Tab.Screen name="Messages" component={MessagesScreen}/>
      <Tab.Screen name="Profile" component={MyProfileScreen}/>
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const theme = useTheme();
  const {loggedIn} = useStore();
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{headerShown: false, contentStyle: {backgroundColor: theme.color.bg}}}>
        {loggedIn ? (
          <>
            <Stack.Screen name="Tabs" component={Tabs}/>
            <Stack.Screen name="EventDetail" component={EventDetailScreen}/>
            <Stack.Screen name="ProfileView" component={ProfileViewScreen}/>
            <Stack.Screen name="Conversation" component={ConversationScreen}/>
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
          </>
        )}
      </Stack.Navigator>
      <Toast/>
    </NavigationContainer>
  );
}
