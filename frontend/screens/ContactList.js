import {Alert, FlatList, StyleSheet, Text, View} from "react-native";
import {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../store/auth-context";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import colors from "../constants/colors";
import ChatCard from "../components/Profile/ChatCard";
import ContactListItem from "../components/Chat/ChatList/ContactListItem";

function ContactList() {
    const [isLoading, setIsLoading] = useState(false);
    const [conversations, setConversations] = useState(false);
    const authCtx = useContext(AuthContext);

    const fetchEvent = useCallback(async () => {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8080/tinder/conversations`, {
            headers: {
                "Authorization": `Bearer ${authCtx.token}`
            },
        })
        if (!response.ok) {
            Alert.alert(
                'Something went wrong!',
                'Please try again later!'
            );
        } else {
            const data = await response.json();
            setConversations(data)

        }
        setIsLoading(false);
    }, [])

    useEffect(() => {
        fetchEvent();
    }, [fetchEvent])

    if (isLoading) {
        return <LoadingOverlay/>;
    }

    return (
        <View style={styles.container}>
            {conversations.length !== 0 &&
                <FlatList data={conversations} keyExtractor={({contact}) => contact._id} renderItem={(itemData) =>
                    // <ChatCard user={itemData.item.contact}/>
                    <ContactListItem {...itemData.item}/>
                }/>}
            {/*{conversations.length === 0 &&*/}
            {/*    <View style={styles.emptyContainer}>*/}
            {/*        <Text style={styles.title}>No connections found!</Text>*/}
            {/*    </View>*/}
            {/*}*/}
        </View>
    )
}

export default ContactList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
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
        alignItems: "center"
    },
    title: {
        fontWeight: "bold",
        fontSize: 20
    }
})