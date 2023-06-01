import {NavigationContainer} from '@react-navigation/native'
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Ionicons} from '@expo/vector-icons';

import HomeScreen from "./screens/HomeScreen";
import EventsScreen from "./screens/EventsScreen";
import ConnectScreen from "./screens/ConnectScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EventDetailScreen from "./screens/EventDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import colors from "./constants/colors";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import {useContext, useEffect, useState} from "react";
import AuthContextProvider, {AuthContext} from "./store/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import LocationPicker from "./components/Location/LocationPicker";
import ChatButton from "./components/ui/ChatButton";
import ChatScreen from "./screens/ChatScreen";
import FiltersButton from "./components/Events/Filters/FiltersButton";
import InterestsContextProvider from "./store/interests-context";

function HomeStackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{
                headerStyle: {
                    backgroundColor: colors.primary500,
                },
                headerTitle: LocationPicker,
                headerRight: ChatButton,
                headerTintColor: "white",
                headerShadowVisible: false
            }}/>
            <Stack.Screen name="EventDetailScreenHome" component={EventDetailScreen} options={{
                title: "Event Details"
            }}/>
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{
                title: "Chat"
            }}/>
        </Stack.Navigator>
    )
}
function EventsStackNavigator({navigation, route}) {
    const [filtersDropdownActive, setFilterDropdownActive] = useState(false);
    const [activeFiltersArray, setActiveFiltersArray] = useState([]);
    useEffect(() => {
        if(route.params?.interestId >=0 ) {
            setActiveFiltersArray([route.params.interestId]);
        }
    }, [route.params?.interestId]);
    useEffect(() => {
        const unsubscribeBlur = navigation.addListener("blur", (e) => {
            setActiveFiltersArray([]);
            setFilterDropdownActive(false);
        });
        return () => unsubscribeBlur();
    }, [navigation]);
    return (
        <Stack.Navigator>
            <Stack.Screen name="Events" options={{
                headerRight: () => {
                    return (<FiltersButton isActive={filtersDropdownActive} filtersNumber={activeFiltersArray.length} onPress={() =>
                        setFilterDropdownActive(
                            prevState => !prevState
                        )
                    }/>)
                }
            }}>
                {
                    () => {
                        return (<EventsScreen activeFilters={activeFiltersArray} setActiveFilters={setActiveFiltersArray} filtersDropdown={filtersDropdownActive}/>)
                    }
                }
            </Stack.Screen>
            <Stack.Screen name="EventDetailScreenEvents" component={EventDetailScreen} options={{
                title: "Event details"}}/>
        </Stack.Navigator>
    )
}

function AuthenticatedNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.primary500
            }}
            id="BottomTabNavigator"
        >
            <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{
                title: "Home",
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                    <Ionicons name="home" color={color} size={size}/>
                ),
            }}/>
            <Tab.Screen name="EventsStack" component={EventsStackNavigator} options={{
                title: "Events",
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                    <Ionicons name="calendar" color={color} size={size}/>
                ),
            }}/>
            <Tab.Screen name="Connect" component={ConnectScreen} options={{
                tabBarIcon: ({color, size}) => (
                    <Ionicons name="infinite" color={color} size={size}/>
                ),
            }}/>
            <Tab.Screen name="Profile" component={ProfileScreen} options={{
                tabBarIcon: ({color, size}) => (
                    <Ionicons name="person" color={color} size={size}/>
                ),
            }}/>
        </Tab.Navigator>
    )
}

function AuthNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{
                headerShown: false,
            }}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={{
                headerShown: false,
            }}/>
        </Stack.Navigator>
    )
}

function Navigation() {
    const authCtx = useContext(AuthContext);

    return (
        <NavigationContainer>
            {!authCtx.isAuthenticated && <AuthNavigator/>}
            {authCtx.isAuthenticated && <AuthenticatedNavigator/>}
        </NavigationContainer>
    )
}

function Root() {
    const [isTryingLogin, setIsTryingLogin] = useState(true);

    const authCtx = useContext(AuthContext);

    useEffect(() => {
        async function fetchToken() {
            const storedToken = await AsyncStorage.getItem('token');

            if (storedToken) {
                authCtx.authenticate(storedToken);
            }

            setIsTryingLogin(false);
        }

        fetchToken();
    }, []);

    if (isTryingLogin) {
        return <LoadingOverlay/>;
    }

    return <Navigation/>;
}

export default function App() {
    return (
        <AuthContextProvider>
            <InterestsContextProvider>
                <Root/>
            </InterestsContextProvider>
        </AuthContextProvider>
    );
}
