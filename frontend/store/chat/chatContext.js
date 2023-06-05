import {createContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AuthContext} from "../auth-context";

export const ChatContext = createContext({
    unreadMessages: 0,
    updateUnreadMessages: () => {}
})

let stompClient = null;

function ChatContextProvider() {
    const [unreadMessages, setUnreadMessages] = useState(0);
    useEffect(() => {

    }, [])
    function updateUnreadMessages(unreadMessages) {
        setUnreadMessages(unreadMessages);
    }

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

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export default ChatContextProvider;