import {useState, useCallback, useEffect, useContext} from 'react'
import { StyleSheet } from "react-native";
import { GiftedChat } from 'react-native-gifted-chat'
import SockJs from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {AuthContext} from "../store/auth-context";

let stompClient = null;
export function ChatScreen() {
    let userId = 1;
    const [messages, setMessages] = useState([]);
    const authCtx = useContext(AuthContext);
    const [user, setUser] = useState({
        _id: 1,
        name: 'User1',
    })
    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ])
    }, [])
    useEffect(() => {
        const connect = () => {
            try {
                stompClient = Stomp.over(() => new SockJs('http://localhost:8080/ws'));
                stompClient.debug=()=>{};
                stompClient.onConnect = () => {
                    stompClient.subscribe(`/user/${user._id}/private`, onPrivateMessage)
                }
                stompClient.activate();
            } catch (e) {
                console.log(e);
            }
        }
        connect();
    }, [])

    const onPrivateMessage = (payload) => {
        const message = JSON.parse(payload.body);
        setMessages(previousMessages => GiftedChat.append(previousMessages, message))
    }

    const handleSend = () => {
        const bodyObject = JSON.stringify({
           receiverId: 1,
           senderId: 2,
           text: "Primul mesaj intre user2 si user1",
           date: new Date()
        });
        stompClient.publish({destination: "/app/private-message", body: bodyObject});
    }

    const onError = (error) => {
        console.log(error);
    }

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => handleSend()}
            user={{
                _id: 1,
            }}
        />
    )
}
export default ChatScreen;

const styles = StyleSheet.create({

})