import React from 'react';
import { View, Text, Animated, StatusBar } from 'react-native';
import { styles } from './style';
import { useSplashScreen } from './useSplashScreen';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const {
    fadeAnim,
    scaleAnim,
    translateYAnim,
    progressWidth,
    footerFadeAnim,
  } = useSplashScreen({ onFinish });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" translucent />

      {/* Ambient background glows */}
      <View style={styles.ambientGlowTop} pointerEvents="none" />
      <View style={styles.ambientGlowBottom} pointerEvents="none" />

      {/* Main Logo and Branding */}
      <Animated.View
        style={[
          styles.centerContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
          },
        ]}
      >
        <View style={styles.logoWrapper}>
          <View style={styles.logoOuterGlow} />
          <View style={styles.logoContainer}>
            {/* Minimalist Shopping Bag Icon */}
            <View style={styles.iconBagHandle} />
            <View style={styles.iconBagBody}>
              <View style={styles.iconBagAccentDot} />
            </View>
          </View>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.titleText}>STORE</Text>
          <Text style={styles.titleDot}>.</Text>
        </View>

        <Text style={styles.tagline}>Elevate Your Shopping</Text>
      </Animated.View>

      {/* Footer loading and version info */}
      <Animated.View style={[styles.footerContainer, { opacity: footerFadeAnim }]}>
        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressWidth,
              },
            ]}
          />
        </View>

        <Text style={styles.footerText}>PREMIUM COLLECTION • v1.0.0</Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
