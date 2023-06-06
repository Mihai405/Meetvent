import * as encoding from "text-encoding";
import {NavigationContainer} from "@react-navigation/native";
import {useContext, useEffect, useState} from "react";
import AuthContextProvider, {AuthContext} from "./store/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import InterestsContextProvider from "./store/interests-context";
import AuthenticatedNavigator from "./navigators/AuthenticatedNavigator";
import AuthNavigator from "./navigators/AuthNavigator";

function Navigation() {
    const authCtx = useContext(AuthContext);

    return (
        <NavigationContainer>
            {!authCtx.isAuthenticated && <AuthNavigator/>}
            {authCtx.isAuthenticated && <AuthenticatedNavigator/>}
        </NavigationContainer>
    );
}

function Root() {
    const [isTryingLogin, setIsTryingLogin] = useState(true);

    const authCtx = useContext(AuthContext);

    useEffect(() => {
        async function fetchToken() {
            const storedToken = await AsyncStorage.getItem("token");
            const storedUserId = await AsyncStorage.getItem("userId");

            if (storedToken) {
                authCtx.authenticate(storedToken, parseInt(storedUserId, 10));
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
