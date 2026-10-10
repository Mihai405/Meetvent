import {useEffect, useState} from "react";
import {Client} from "@stomp/stompjs";
import {WS_URL} from "../constants/api";

let stompClient;
function useWebSocket() {

    const[isClientConnected, setIsClientConnected] = useState(false);

    useEffect(() => {
        const connect = () => {
            stompClient = new Client({
                brokerURL: WS_URL,
                // React Native's WebSocket needs these to frame STOMP messages correctly
                forceBinaryWSFrames: true,
                appendMissingNULLonIncoming: true,
            });
            stompClient.debug=()=>{};
            stompClient.onConnect = () => {
                setIsClientConnected(true);
            }
            stompClient.onDisconnect = () => {
                setIsClientConnected(false);
            }
            stompClient.onWebSocketClose = () => {
                setIsClientConnected(false);
            }
            stompClient.activate();
        }
        connect();
        return () => {
            stompClient.deactivate();
        }
    }, [])

    return [isClientConnected, stompClient];
}

export default useWebSocket;
