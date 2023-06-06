import HomeScreen from "../screens/HomeScreen";
import colors from "../constants/colors";
import LocationPicker from "../components/Location/LocationPicker";
import EventDetailScreen from "../screens/EventDetailScreen";
import { Stack } from "../constants/navigators";

function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.primary500,
          },
          headerTitle: LocationPicker,
          headerTintColor: "white",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="EventDetailScreenHome"
        component={EventDetailScreen}
        options={{
          title: "Event Details",
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;
