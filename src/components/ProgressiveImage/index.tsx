import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Animated,
  ImageStyle,
  StyleProp,
  ImageResizeMode,
} from 'react-native';
import { styles } from './style';
import { VectorIcon } from '../VectorIcon';
import { COLORS } from '../../theme/colors';

interface ProgressiveImageProps {
  sourceUri: string | null;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  sourceUri,
  style,
  resizeMode = 'contain',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const imageOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    // Shimmer pulse animation for placeholder
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    if (!isLoaded && !hasError) {
      pulse.start();
    } else {
      pulse.stop();
    }

    return () => pulse.stop();
  }, [isLoaded, hasError, pulseAnim]);

  const handleLoadSuccess = () => {
    setIsLoaded(true);
    Animated.parallel([
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLoadError = () => {
    setHasError(true);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Shimmer skeleton placeholder */}
      {!isLoaded && !hasError && (
        <Animated.View
          style={[
            styles.placeholder,
            {
              opacity: pulseAnim,
            },
          ]}
        />
      )}

      {/* Fallback Vector Icon if loading fails or uri is missing */}
      {(hasError || !sourceUri) && (
        <View style={styles.errorContainer}>
          <VectorIcon name="sparkles" size={24} color={COLORS.primaryLight} />
        </View>
      )}

      {/* Actual remote image with smooth fade-in & scale spring */}
      {sourceUri && !hasError && (
        <Animated.Image
          source={{ uri: sourceUri }}
          style={[
            style,
            {
              opacity: imageOpacity,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          resizeMode={resizeMode}
          onLoad={handleLoadSuccess}
          onError={handleLoadError}
        />
      )}
    </View>
  );
};

export default ProgressiveImage;
