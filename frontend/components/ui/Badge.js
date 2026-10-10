import {View, Text, StyleSheet} from 'react-native';

const statusColors = {
    primary: '#2089dc',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff190c',
};

function Badge({status = 'primary', value, badgeStyle, textStyle, containerStyle}) {
    const hasValue = value !== undefined && value !== null;
    return (
        <View style={containerStyle}>
            <View style={[styles.badge, !hasValue && styles.miniBadge, {backgroundColor: statusColors[status]}, badgeStyle]}>
                {hasValue && <Text style={[styles.text, textStyle]}>{value}</Text>}
            </View>
        </View>
    );
}

export default Badge;

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'center',
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'white',
    },
    miniBadge: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        minWidth: 8,
        height: 8,
        borderRadius: 4,
    },
    text: {
        fontSize: 12,
        color: 'white',
        paddingHorizontal: 4,
    },
});
