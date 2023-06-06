import ChatContextProvider from "../store/chat/chatContext";
import TabNavigator from "./TabNavigator";
import HomeStackNavigator from "./HomeStackNavigator";

function AuthenticatedNavigator() {
  return (
    <ChatContextProvider>
      <HomeStackNavigator />
    </ChatContextProvider>
  );
}

export default AuthenticatedNavigator;
