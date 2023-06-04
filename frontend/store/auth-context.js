import AsyncStorage from '@react-native-async-storage/async-storage';

import {createContext, useState} from "react";

export const AuthContext = createContext({
    token: '',
    userId: undefined,
    isAuthenticated: false,
    authenticate: (token) => {
    },
    logout: () => {
    }
})

function AuthContextProvider({children}) {
    const [authToken, setAuthToken] = useState('');
    const [userId, setUserId] = useState(0);
    function authenticate(token, userId) {
        setAuthToken(token);
        setUserId(userId);
        AsyncStorage.setItem('token', token);
        AsyncStorage.setItem("userId", `${userId}`);
    }

    function logout() {
        setAuthToken(null);
        AsyncStorage.removeItem('token')
    }

    const value = {
        token: authToken,
        userId: userId,
        isAuthenticated: !!authToken,
        authenticate: authenticate,
        logout: logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContextProvider;