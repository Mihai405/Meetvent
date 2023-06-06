import {useCallback, useContext, useEffect, useState} from "react";
import {Stomp} from "@stomp/stompjs";
import SockJs from "sockjs-client";
import MessageActions from "../constants/messageActions";
import {GiftedChat} from "react-native-gifted-chat";

let stompClient;
function useWebSocket(myId, receiveMessageFunctionObj) {

    const [message, setMessage] = useState();

    useEffect(() => {
        let subscription;
        const connect = () => {
            stompClient = Stomp.over(() => new SockJs('http://localhost:8080/ws'));
            stompClient.debug=()=>{};
            stompClient.onConnect = () => {
                console.log(myId);
                subscription = stompClient.subscribe(`/user/${myId}/private`, onPrivateMessage, onError)
            }
            stompClient.activate();
        }
        connect();
        return () => {
            subscription.unsubscribe();
            stompClient.deactivate();
        }
    }, [])

    const onPrivateMessage = (payload) => {
        const receivedMessage = JSON.parse(payload.body);
        if(receivedMessage) {
            handleMessage(receivedMessage);
            setMessage(message);
        }
    }

    const onError = (error) => {
        console.log(error);
    }

    const handleMessage = (receivedMessage) => {
        if(receiveMessageFunctionObj.action) {
            if(receiveMessageFunctionObj.action === MessageActions.UPDATE_CONTACT_LIST) {
                receiveMessageFunctionObj.updateContactListScreen(receivedMessage);
            } else {
                receiveMessageFunctionObj.updateConversationScreen(receivedMessage);
            }
        }
    }

    const publishMessage = useCallback((messages) => {
        messages.map(messages => {
            stompClient.publish({destination: "/app/private-message", body: messages});
        })
    }, [])

    return [message, publishMessage];
}

export default useWebSocket;