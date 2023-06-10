import AdminEventCard from "../../components/Admin/AdminEventCard";
import {FlatList, StyleSheet, View} from "react-native";
import {useCallback, useContext, useEffect, useState} from "react";
import {doRequest} from "../../util/request";
import {AuthContext} from "../../store/auth-context";
import {authorizationHeader} from "../../constants/requestObjects";
import {useFocusEffect} from "@react-navigation/native";

function HomeScreen() {
    const [events, setEvents] = useState([])
    const authCtx = useContext(AuthContext);
    useFocusEffect(
        useCallback(() => {
            const fetchEvents = async () => {
                const data = await doRequest("http://localhost:8080/events/organizer", authorizationHeader(authCtx.token));
                setEvents(data);
            }
            fetchEvents().catch(error => console.log(error));
        }, [])
    )

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                keyExtractor={(event) => event.id}
                renderItem={(itemData) => <AdminEventCard {...itemData.item} />}
            />
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex:1,
        paddingHorizontal: 15,
    },
})
