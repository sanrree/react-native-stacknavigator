import { useRef, useEffect } from 'react';
import { Animated, Easing, Dimensions } from 'react-native';

function useAnimation(duration = 250) {
  const animatedValue = useRef(new Animated.Value(0));

  useEffect(() => {
    animatedValue.current.addListener(({ value }) => (this._value = value));
  }, []);

  const isAnimationRunning = useRef(false);

  function animate(toValue, callback) {
    isAnimationRunning.current = true;

    Animated.timing(animatedValue.current, {
      duration,
      toValue,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      isAnimationRunning.current = false;
      if (callback) {
        callback();
      }
    });
  }

  function fixAnimatedValue(value) {
    animatedValue.current.setValue(value - 1);
  }

  function getDefaultAnimations(index, length) {
    if (index < length - 2) return;

    if (index === length - 2) {
      return {
        transform: [
          {
            translateX: animatedValue.current.interpolate({
              inputRange: [index, index + 1],
              outputRange: [0, -Dimensions.get('window').width],
              extrapolate: 'clamp',
            }),
          },
        ],
      };
    }

    return {
      transform: [
        {
          translateX: animatedValue.current.interpolate({
            inputRange: [index - 1, index],
            outputRange: [Dimensions.get('window').width, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
  }

  return {
    animatedValue,
    animate,
    isAnimationRunning,
    fixAnimatedValue,
    getDefaultAnimations,
  };
}

export default useAnimation;
