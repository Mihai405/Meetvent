import {createContext, useContext, useEffect, useState} from "react";
import {AuthContext} from "../auth-context";
import useWebSocket from "../../customHooks/useWebSocket";
import MessageActions from "../../constants/messageActions";
export const ChatContext = createContext({
    publishMessage: undefined,
    receivedMessage: "",
})

const receiveMessageObject = {
    action: undefined,
    updateContactListScreen: undefined,
    updateConversationScreen: undefined
}

function ChatContextProvider({children}) {
    const authCtx = useContext(AuthContext);
    const [message, publishMessage] = useWebSocket(authCtx.userId, receiveMessageObject);

    const value = {
        message: message,
        publishMessage: publishMessage,
        receiveMessageObject: receiveMessageObject
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export default ChatContextProvider;