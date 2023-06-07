import {useState, useCallback, useEffect, useContext} from "react";
import {Alert, StyleSheet, View} from "react-native";
import {Bubble, GiftedChat, InputToolbar, Send} from "react-native-gifted-chat";
import {AuthContext} from "../store/auth-context";
import {doRequest} from "../util/request";
import Colors from "../constants/colors";
import {ChatContext} from "../store/chat/chatContext";
import MessageActions from "../constants/messageActions";
import {FontAwesome} from "@expo/vector-icons";

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
        if (receivedMessage && receivedMessage.user._id === contact._id) {
            setMessages((previousMessages) =>
                GiftedChat.append(previousMessages, [receivedMessage])
            );
        }
    };
    chatCtx.receiveMessageObject.action = MessageActions.UPDATE_CONVERSATION;
    chatCtx.receiveMessageObject.updateConversationScreen = updateConversationScreen;

    // renderNumber = renderNumber + 1;
    // console.log("Render number " + renderNumber);
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
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={(messages) => handleMessageSend(messages)}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderSend={renderSend}
                user={{
                    _id: authCtx.userId,
                }}
                messagesContainerStyle={{backgroundColor: "white"}}
            />
        </View>
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

const renderInputToolbar = (props) => {
    return <InputToolbar {...props} containerStyle={{
        borderColor: "lightgray",
        borderWidth: 1,
    }} textInputStyle={{ }}/>
}

const renderSend = (props) => {
    return (
        <Send
            {...props}
        >
            <View style={{marginRight: 10, marginBottom: 12}}>
                <FontAwesome name="send" size={20} color={Colors.primary500} />
            </View>
        </Send>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    }
});
