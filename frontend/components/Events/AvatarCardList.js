import {Avatar} from "@rneui/base";
import {View, StyleSheet} from "react-native";
import React from "react";

function AvatarCardList() {
    return (
        <View style={styles.avatarContainer}>
            <Avatar
                size={24}
                rounded
                source={{uri: "/Users/mihai/Downloads/lenghel.jpeg"}}
            />
            <Avatar
                size={23}
                rounded
                source={{uri: "/Users/mihai/Downloads/madelyn.jpeg"}}
            />
            <Avatar
                size={24}
                rounded
                source={{uri: "/Users/mihai/Downloads/duaLipa.jpeg"}}
            />
            <Avatar
                size={24}
                rounded
                title="+99"
                containerStyle={{backgroundColor: "#666769"}}
            />
        </View>
    )
}

export default AvatarCardList;

const styles = StyleSheet.create({
    avatarContainer: {
        flexDirection: "row",
        alignSelf: "flex-end",
        marginRight: 20
    }
})