import {Stack} from "../constants/navigators";
import HomeScreen from "../screens/admin/HomeScreen";
import EventDetailScreen from "../screens/admin/EventDetailScreen";

function AuthenticatedAdminNavigator() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="AdminHomeScreen" component={HomeScreen}/>
            <Stack.Screen name="AdminEventDetailScreen" component={EventDetailScreen}/>
        </Stack.Navigator>
    )
}

export default AuthenticatedAdminNavigator;