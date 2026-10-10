import {View, Text, Image, StyleSheet} from 'react-native';

function Avatar({size = 34, rounded, source, title, containerStyle}) {
    const dimensions = {width: size, height: size, borderRadius: rounded ? size / 2 : 0};
    return (
        <View style={[styles.container, dimensions, title && styles.titleContainer, containerStyle]}>
            {source?.uri
                ? <Image source={source} style={[styles.image, dimensions]}/>
                : title && <Text style={[styles.title, {fontSize: size / 2.5}]}>{title}</Text>}
        </View>
    );
}

export default Avatar;

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        backgroundColor: '#bdbdbd',
    },
    image: {
        resizeMode: 'cover',
    },
    title: {
        color: 'white',
        textAlign: 'center',
    },
});
