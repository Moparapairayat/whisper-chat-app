import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

type AnimatedOrbProps = {
  colors: [string, string, ...string[]];
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
};

export function AnimatedOrb({ colors, size, initialX, initialY, duration }: AnimatedOrbProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const easing = Easing.inOut(Easing.ease);

    translateX.value = withRepeat(
      withSequence(
        withTiming(30, { duration, easing }),
        withTiming(-30, { duration, easing }),
        withTiming(0, { duration, easing })
      ),
      -1 // infinite
    );

    translateY.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: duration * 0.8, easing }),
        withTiming(20, { duration: duration * 0.8, easing }),
        withTiming(0, { duration: duration * 0.8, easing })
      ),
      -1
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: duration * 1.2, easing }),
        withTiming(0.9, { duration: duration * 1.2, easing }),
        withTiming(1, { duration: duration * 1.2, easing })
      ),
      -1
    );
  }, [duration, translateX, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: initialX,
          top: initialY,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={colors}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: 0.6,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
}
