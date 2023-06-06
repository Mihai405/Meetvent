import {useState, useCallback, useEffect, useContext} from "react";
import {Alert, StyleSheet} from "react-native";
import {Bubble, GiftedChat} from "react-native-gifted-chat";
import {AuthContext} from "../store/auth-context";
import {doRequest} from "../util/request";
import Colors from "../constants/colors";
import {ChatContext} from "../store/chat/chatContext";
import MessageActions from "../constants/messageActions";

const defaultObject = {
    _id: undefined,
    name: undefined,
    avatar: undefined,
};
let renderNumber = 0;

export function ChatScreen({route}) {
    const contact = route.params ? route.params.user : defaultObject;
    const [messages, setMessages] = useState([]);
    const authCtx = useContext(AuthContext);
    const chatCtx = useContext(ChatContext);

    useEffect(() => {
        const fetchMessages = async () => {
            const requestPath = `http://localhost:8080/private-messages/${contact._id}`;
            const requestObject = {
                headers: {
                    Authorization: `Bearer ${authCtx.token}`,
                },
            };
            const data = await doRequest(requestPath, requestObject);
            setMessages(data);
        };
        fetchMessages().catch((error) => Alert.alert(error));
    }, []);

    const updateConversationScreen = (receivedMessage) => {
        if (receivedMessage) {
            setMessages((previousMessages) =>
                GiftedChat.append(previousMessages, [receivedMessage])
            );
        }
    };
    chatCtx.receiveMessageObject.action = MessageActions.UPDATE_CONVERSATION;
    chatCtx.receiveMessageObject.updateConversationScreen =
        updateConversationScreen;

    renderNumber = renderNumber + 1;
    console.log("Render number " + renderNumber);
    const convertToMessageDTO = (message) => {
        return JSON.stringify({
            receiverId: contact._id,
            senderId: authCtx.userId,
            text: message.text,
            createdAt: message.createdAt,
        });
    };

    const handleMessageSend = useCallback((messages) => {
        chatCtx.publishMessage(
            messages.map((message) => convertToMessageDTO(message))
        );
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages)
        );
    }, []);

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => handleMessageSend(messages)}
            renderBubble={renderBubble}
            user={{
                _id: authCtx.userId,
            }}
            messagesContainerStyle={{backgroundColor: "white"}}
        />
    );
}

export default ChatScreen;

const renderBubble = (props) => {
    return (
        <Bubble
            {...props}
            textStyle={{}}
            wrapperStyle={{
                right: {
                    backgroundColor: Colors.primary500,
                },
                left: {
                    backgroundColor: "#ecebed",
                },
            }}
        />
    );
};

const styles = StyleSheet.create({});
