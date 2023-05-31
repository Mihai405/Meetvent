import {Pressable, StyleSheet, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import colors from "../../../constants/colors";
import Colors from "../../../constants/colors";

function FiltersButton({onPress, isActive}) {
    const color = isActive ? "white" : Colors.primary500;
    const backgroundColor = isActive ? Colors.primary500 : "white";

    return (
        <View style={[styles.buttonOuterContainer, {backgroundColor: backgroundColor, borderColor: color}]}>
            <Pressable onPress={onPress} style={({pressed}) =>
                pressed
                    ? [styles.buttonInnerContainer, styles.pressed]
                    : [styles.buttonInnerContainer]
            }>
                <Ionicons name="filter" color={color} size={20}/>
            </Pressable>
        </View>
    )
}

export default FiltersButton;

const styles = StyleSheet.create({
    buttonOuterContainer: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    buttonInnerContainer: {
        overflow: "hidden"
    },
    pressed: {
        opacity: 0.75,
    },
})