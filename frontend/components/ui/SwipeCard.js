import {StyleSheet, useWindowDimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, useSharedValue, withSpring, withTiming} from 'react-native-reanimated';
import {scheduleOnRN} from 'react-native-worklets';

const SWIPE_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 800;

function SwipeCard({onSwipe, onCardLeftScreen, children}) {
    const {width} = useWindowDimensions();
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const pan = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            const swiped = Math.abs(event.translationX) > SWIPE_THRESHOLD || Math.abs(event.velocityX) > VELOCITY_THRESHOLD;
            if (!swiped) {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                return;
            }
            const direction = event.translationX > 0 ? "right" : "left";
            scheduleOnRN(onSwipe, direction);
            translateX.value = withTiming(Math.sign(event.translationX) * width * 1.5, {duration: 250}, (finished) => {
                if (finished && onCardLeftScreen) {
                    scheduleOnRN(onCardLeftScreen);
                }
            });
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {translateX: translateX.value},
            {translateY: translateY.value},
            {rotate: `${translateX.value / 20}deg`},
        ],
    }));

    return (
        <GestureDetector gesture={pan}>
            <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                {children}
            </Animated.View>
        </GestureDetector>
    );
}

export default SwipeCard;
