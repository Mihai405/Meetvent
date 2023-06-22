import {FlatList, ScrollView, StyleSheet, Text, View} from "react-native";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../store/auth-context";
import Input from "../../components/ui/Input";
import Colors from "../../constants/colors";
import {FontAwesome, MaterialIcons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ButtonContainedLarge from "../../components/ui/ButtonContainedLarge";
import ButtonOutlined from "../../components/ui/ButtonOutlined";
import { Fontisto } from '@expo/vector-icons';

function CreateEventScreen() {
    const [formData, setFormData] = useState({
        title: {
            value: '',
            isInvalid: false,
        },
        city: {
            value: '',
            isInvalid: false,
        },
        street: {
            value: '',
            isInvalid: false,
        },
        location: {
            value: '',
            isInvalid: false,
        },
        date: {
            value: '',
            isInvalid: false
        },
        time: {
            value: '',
        }
    });

    const authCtx = useContext(AuthContext);

    function createPostObject() {
        return {
            title: formData.title.value,
            address: {
                city: formData.city.value,
                street: formData.street.value,
            },
            location: formData.location.value,
            date: formData.date.value,
            time: formData.time.value
        }
    }

    function credentialChangedHandler(credentialIdentifier, enteredValue) {
        setFormData((currentCredentials) => {
            return {
                ...currentCredentials,
                [credentialIdentifier]: { value: enteredValue, isInvalid: false, },
            };
        });
    }

    async function handleSubmit() {
        console.log(createPostObject());
        await fetch("http://localhost:8080/auth/signup", {
            method: "POST",
            body: JSON.stringify(createPostObject()),
            headers: {
                "Content-Type": "application/json",
            },
        }).catch(error => console.log(error))
    }

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Add Event</Text>
            <ScrollView style={styles.scrollView}>
                <Input
                    label="Title"
                    onUpdateValue={credentialChangedHandler.bind(this, 'title')}
                    value={formData.title}
                    icon="text-outline"
                />
                <Input
                    label="City"
                    onUpdateValue={credentialChangedHandler.bind(this, 'city')}
                    value={formData.city}
                >
                    <MaterialCommunityIcons name="home-city-outline" size={24} color={Colors.grey800} />
                </Input>
                <Input
                    label="Street"
                    onUpdateValue={credentialChangedHandler.bind(this, 'street')}
                    value={formData.street}
                    icon="mail-outline"
                >
                    <FontAwesome name="street-view" size={24} color={Colors.grey800} />
                </Input>
                <Input
                    label="Location"
                    onUpdateValue={credentialChangedHandler.bind(this, 'location')}
                    value={formData.location}
                    icon="location-outline"
                />
                <Input
                    label="Date"
                    onUpdateValue={credentialChangedHandler.bind(this, 'date')}
                    value={formData.date}
                    icon="mail-outline"
                >
                    <Fontisto name="date" size={24} color={Colors.grey800} />
                </Input>
                <Input
                    label="Time"
                    onUpdateValue={credentialChangedHandler.bind(this, 'time')}
                    value={formData.time}
                    icon="time-outline"
                />
                <View style={styles.imageButton}>
                    <ButtonOutlined icon="image-outline">
                        Add image
                    </ButtonOutlined>
                </View>
                <View style={styles.button}>
                    <ButtonContainedLarge
                        onPress={() => {handleSubmit()}}
                        color={Colors.primary500}
                    >
                        Submit Event
                    </ButtonContainedLarge>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20
    },
    pageTitle: {
        fontSize: 20,
        marginTop: 70,
        fontWeight: "bold",
        alignSelf: "center"
    },
    scrollView: {
        marginTop: 20
    },
    button: {
        marginTop: 10,
        alignSelf: "center",
    },
    imageButton: {
        marginTop: 10,
        width: 150,
        height: 60,
        alignSelf: "center"
    }
})

export default CreateEventScreen;