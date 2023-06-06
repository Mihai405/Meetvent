import ChatContextProvider from "../store/chat/chatContext";
import TabNavigator from "./TabNavigator";

function AuthenticatedNavigator() {
  return (
    <ChatContextProvider>
      <TabNavigator />
    </ChatContextProvider>
  );
}

export default AuthenticatedNavigator;
