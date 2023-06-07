import {Alert, FlatList, StyleSheet, Text, View} from "react-native";
import {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../store/auth-context";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import colors from "../constants/colors";
import ChatCard from "../components/Profile/ChatCard";
import ContactListItem from "../components/Chat/ChatList/ContactListItem";
import useWebSocket from "../customHooks/useWebSocket";
import {GiftedChat} from "react-native-gifted-chat";
import MessageActions from "../constants/messageActions";
import {ChatContext} from "../store/chat/chatContext";
import getUpdatedConversationList from "../util/chat/updateConversationList";
import {useFocusEffect} from "@react-navigation/native";
import {doRequest} from "../util/request";
import {authorizationHeader} from "../constants/requestObjects";

let renderNumber = 0;

function ContactList() {
    const [conversations, setConversations] = useState([]);

    const authCtx = useContext(AuthContext);
    const chatCtx = useContext(ChatContext);

    useFocusEffect(
        useCallback(() => {
           const fetchConversations = async ()=> {
               const data = await doRequest(`http://localhost:8080/tinder/conversations`, authorizationHeader(authCtx.token));
               setConversations(data);
           }
           chatCtx.receiveMessageObject.action = MessageActions.UPDATE_CONTACT_LIST;
           fetchConversations().catch(error => console.log(error));
        }, [])
    );

    chatCtx.receiveMessageObject.updateContactListScreen = (receivedMessage) =>
        setConversations(
            getUpdatedConversationList(conversations, receivedMessage, authCtx.userId)
        );

    // renderNumber = renderNumber + 1
    // console.log("Render number " + renderNumber);
    conversations.map(conversation => {
        console.log(conversation);
    })
    return (
        <View style={styles.container}>
            {conversations.length !== 0 && (
                <FlatList
                    data={conversations}
                    keyExtractor={({contact}) => contact._id}
                    renderItem={(itemData) => (
                        // <ChatCard user={itemData.item.contact}/>
                        <ContactListItem {...itemData.item} />
                    )}
                />
            )}
            {/*{conversations.length === 0 &&*/}
            {/*    <View style={styles.emptyContainer}>*/}
            {/*        <Text style={styles.title}>No connections found!</Text>*/}
            {/*    </View>*/}
            {/*}*/}
        </View>
    );
}

export default ContactList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        // borderRadius: 20,
        // padding: 8,
        // margin: 8,
    },
    emptyContainer: {
        backgroundColor: "#FFFFFF",
        height: 66,
        width: 350,
        margin: 4,
        borderRadius: 8,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
    },
});
