import {useState, useCallback, useEffect, useContext} from 'react'
import {Alert, StyleSheet} from "react-native";
import {Bubble, GiftedChat} from 'react-native-gifted-chat'
import SockJs from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {AuthContext} from "../store/auth-context";
import RequestPaths from "../constants/requestPaths";
import {doRequest} from "../util/request";
import Colors from "../constants/colors";

let stompClient = null;
export function ChatScreen({route}) {

    const defaultObject = {
        _id: undefined,
        name: undefined,
        avatar: undefined
    }
    const contact = route.params? route.params.user : defaultObject;

    const [messages, setMessages] = useState([]);
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        const fetchMessages = async () => {
            const requestPath = `http://localhost:8080/private-messages/${contact._id}`;
            const requestObject = {
                headers: {
                    Authorization: `Bearer ${authCtx.token}`,
                },
            }
            const data = await doRequest(requestPath, requestObject);
            setMessages(data);
        };
        fetchMessages().catch(error => Alert.alert(error));
    }, [])

    useEffect(() => {
        let subscription;
        const connect = () => {
            stompClient = Stomp.over(() => new SockJs('http://localhost:8080/ws'));
            stompClient.debug=()=>{};
            stompClient.onConnect = () => {
                subscription = stompClient.subscribe(`/user/${authCtx.userId}/private`, onPrivateMessage)
            }
            stompClient.activate();
        }
        connect();
        return () => subscription.unsubscribe();
    }, [])

    const onPrivateMessage = (payload) => {
        const message = JSON.parse(payload.body);
        console.log(message)
        setMessages(previousMessages => GiftedChat.append(previousMessages, message))
    }

    const onError = (error) => {
        console.log(error);
    }

    const convertToMessageDTO = (message) => {
        return JSON.stringify({
            receiverId: contact._id,
            senderId: authCtx.userId,
            text: message.text,
            createdAt: message.createdAt
        })
    }

    const onSend = useCallback((messages = []) => {
        messages.map(giftedChatMessage => {
            stompClient.publish({destination: "/app/private-message", body: convertToMessageDTO(giftedChatMessage)});
        })
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            renderBubble={renderBubble}
            user={{
                _id: authCtx.userId,
            }}
            messagesContainerStyle={{backgroundColor:"white"}}
        />
    )
}
export default ChatScreen;

const renderBubble = (props) => {
    return (
        <Bubble
            {...props}
            textStyle={{

            }}
            wrapperStyle={{
                right: {
                    backgroundColor: Colors.primary500,
                },
                left: {
                    backgroundColor: "#ecebed"
                }
            }}
        />
    );
}

const styles = StyleSheet.create({

})