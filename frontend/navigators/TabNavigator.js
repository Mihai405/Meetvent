import colors from "../constants/colors";
import { Tab } from "../constants/navigators";
import { Ionicons } from "@expo/vector-icons";
import ChatStackNavigator from "./ChatStackNavigator";
import EventsStackNavigator from "./EventStackNavigator";
import ConnectScreen from "../screens/ConnectScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeStackNavigator from "./HomeStackNavigator";

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary500,
      }}
      id="BottomTabNavigator"
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ChatStack"
        component={ChatStackNavigator}
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="EventsStack"
        component={EventsStackNavigator}
        options={{
          title: "Events",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Connect"
        component={ConnectScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="infinite" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
