import {StyleSheet, View, Text, Image} from "react-native";
import Colors from "../../../constants/colors";

const defaultColor = Colors.primary500;

function ChatHeaderTitle({username=defaultColor, imageUri=defaultColor}) {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{uri: imageUri}}/>
            <View style={styles.textContainer}>
                <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
                    {username}
                </Text>
                <Text style={styles.active}>Active now</Text>
            </View>
        </View>
    );
}

export default ChatHeaderTitle;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 50,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: "50%",
    },
    textContainer: {
        paddingLeft: 20,
    },
    title: {
        flex: 1,
        fontSize: 17,
        fontWeight: "bold",
    },
    active: {
        color: "gray",
    },
});
