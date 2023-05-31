import {Alert, FlatList, StyleSheet, Text, View} from "react-native";
import EventCard from "../components/Events/EventCard";
import {AuthContext} from "../store/auth-context";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import {useCallback, useContext, useEffect, useState} from "react";
import FiltersDropdown from "../components/Events/Filters/FiltersDropdown";
import {InterestsContext} from "../store/interests-context";
import {doRequest} from "../util/request";

function EventsScreen({eventsRoute, filtersDropdown}) {
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [activeFilters, setActiveFilters] = useState([]);

    const authCtx = useContext(AuthContext);
    const interestsCtx = useContext(InterestsContext);

    useEffect(() => {
        setIsLoading(true);
        const fetchEvents = async () => {
            try {
                const requestPath = `http://localhost:8080/events/city/${interestsCtx.city}`
                const requestObject = {
                    headers: {
                        Authorization: `Bearer ${authCtx.token}`,
                    },
                }
                const data = await doRequest(requestPath, requestObject);
                setEvents(data);
            } catch (e) {
                Alert.alert(error.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchEvents().catch(error => Alert.alert(error.message));
    }, []);

    useEffect(() => {
        if (eventsRoute.params) {
            setActiveFilters([eventsRoute.params.interestId]);
        }
    }, [eventsRoute]);

    if (isLoading) {
        return <LoadingOverlay/>;
    }

    if (events.length === 0) {
        return (
            <Text style={styles.noEventsText}>
                No events found in {interestsCtx.city}!
            </Text>
        );
    }

    function onPressFilter(id) {
        if (!activeFilters.includes(id)) {
            setActiveFilters((prevState) => [...prevState, id]);
        } else {
            setActiveFilters((prevState) =>
                prevState.filter((interestId) => interestId !== id)
            );
        }
    }

    const filteredEvents = events.filter((event) =>
        activeFilters.includes(event.interestKey)
    );

    return (
        <View style={styles.rootScreen}>
            {filtersDropdown && (
                <FiltersDropdown
                    activeFilters={activeFilters}
                    onPressFilter={onPressFilter}
                />
            )}
            <FlatList
                data={activeFilters.length === 0 ? events : filteredEvents}
                keyExtractor={(event) => event.id}
                renderItem={(itemData) => (
                    <EventCard
                        id={itemData.item.id}
                        image={itemData.item.imageUri}
                        title={itemData.item.title}
                        date={itemData.item.date}
                        location={itemData.item.location}
                    />
                )}
            />
        </View>
    );
}

export default EventsScreen;

const styles = StyleSheet.create({
    rootScreen: {
        flex: 1,
    },
    noEventsText: {
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 24,
        fontSize: 24,
    },
});
