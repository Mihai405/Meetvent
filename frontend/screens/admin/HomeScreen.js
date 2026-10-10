import AdminEventCard from "../../components/Admin/AdminEventCard";
import {FlatList, StyleSheet, View} from "react-native";
import {useCallback, useContext, useEffect, useState} from "react";
import {doRequest} from "../../util/request";
import {AuthContext} from "../../store/auth-context";
import {authorizationHeader} from "../../constants/requestObjects";
import {useFocusEffect} from "@react-navigation/native";
import FAB from "../../components/ui/FAB";
import Colors from "../../constants/colors";
import {API_URL} from "../../constants/api";

function HomeScreen({navigation}) {
    const [events, setEvents] = useState([])
    const authCtx = useContext(AuthContext);
    useFocusEffect(
        useCallback(() => {
            const fetchEvents = async () => {
                const data = await doRequest(`${API_URL}/events/organizer`, authorizationHeader(authCtx.token));
                setEvents(data);
            }
            fetchEvents().catch(error => console.log(error));
        }, [])
    )

    const handleNavigation = () => {
        navigation.navigate("CreateEvent")
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                keyExtractor={(event) => event.id}
                renderItem={(itemData) => <AdminEventCard {...itemData.item} />
            }
            />
            <FAB
                visible={true}
                placement={"right"}
                icon={{ name: 'add', color: 'white' }}
                color={Colors.primary600}
                size={"small"}
                style={{marginBottom: 17, marginRight:20}}
                onPress={handleNavigation}
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
