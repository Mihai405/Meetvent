const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";
const WS_URL = `${API_URL.replace(/^http/, "ws")}/ws/websocket`;

export {API_URL, WS_URL};
