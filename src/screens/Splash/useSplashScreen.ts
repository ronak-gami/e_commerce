import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

interface UseSplashScreenOptions {
  duration?: number;
  onFinish?: () => void;
}

export const useSplashScreen = (options?: UseSplashScreenOptions) => {
  const { duration = 2800, onFinish } = options || {};

  const [isReady, setIsReady] = useState(false);

  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const footerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance animation (Logo & Title)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Footer fade in
    Animated.timing(footerFadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // 3. Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration - 400,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false, // width interpolation requires false
    }).start();

    // 4. Completion trigger
    const timer = setTimeout(() => {
      setIsReady(true);
      if (onFinish) {
        onFinish();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, fadeAnim, scaleAnim, translateYAnim, progressAnim, footerFadeAnim, onFinish]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return {
    isReady,
    fadeAnim,
    scaleAnim,
    translateYAnim,
    progressWidth,
    footerFadeAnim,
  };
};
