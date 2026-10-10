import {Pressable, StyleSheet} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";

function FAB({visible = true, placement, icon, color, size, style, onPress}) {
    if (!visible) {
        return null;
    }
    const diameter = size === "small" ? 40 : 56;
    return (
        <Pressable
            style={({pressed}) => [
                styles.button,
                placement && styles.placed,
                placement === "left" ? {left: 0} : {right: 0},
                {width: diameter, height: diameter, borderRadius: diameter / 2, backgroundColor: color},
                style,
                pressed && styles.pressed,
            ]}
            onPress={onPress}
        >
            <MaterialIcons name={icon?.name} color={icon?.color} size={24}/>
        </Pressable>
    );
}

export default FAB;

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2},
        elevation: 4,
    },
    placed: {
        position: 'absolute',
        bottom: 0,
    },
    pressed: {
        opacity: 0.75,
    },
});
