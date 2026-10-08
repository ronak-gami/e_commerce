import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  PanResponder,
  LayoutChangeEvent,
  GestureResponderEvent,
} from 'react-native';
import { styles } from './style';
import { COLORS } from '../../theme/colors';

export interface RangeSliderProps {
  min: number;
  max: number;
  low: number;
  high: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  activeColor?: string;
  onValueChange: (low: number, high: number) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  low,
  high,
  step = 1,
  prefix = '',
  suffix = '',
  label,
  activeColor = COLORS.primary,
  onValueChange,
}) => {
  const [trackWidth, setTrackWidth] = useState(0);

  // Keep latest values in ref to avoid stale closure in PanResponder
  const stateRef = useRef({ low, high, min, max, step, trackWidth });
  useEffect(() => {
    stateRef.current = { low, high, min, max, step, trackWidth };
  }, [low, high, min, max, step, trackWidth]);

  const onLayoutTrack = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setTrackWidth(width);
    }
  };

  const clampValue = (val: number, minVal: number, maxVal: number) => {
    const stepped = Math.round(val / step) * step;
    return Math.max(minVal, Math.min(maxVal, stepped));
  };

  // PanResponder for Left (Low) Thumb
  const lowPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState) => {
        const { trackWidth: width, min: mn, max: mx, high: currentHigh } = stateRef.current;
        if (width <= 0) return;
        const totalRange = mx - mn;
        const delta = (gestureState.dx / width) * totalRange;
        const startVal = stateRef.current.low;
        const newVal = clampValue(startVal + delta, mn, currentHigh - step);
        onValueChange(newVal, currentHigh);
      },
    })
  ).current;

  // PanResponder for Right (High) Thumb
  const highPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState) => {
        const { trackWidth: width, min: mn, max: mx, low: currentLow } = stateRef.current;
        if (width <= 0) return;
        const totalRange = mx - mn;
        const delta = (gestureState.dx / width) * totalRange;
        const startVal = stateRef.current.high;
        const newVal = clampValue(startVal + delta, currentLow + step, mx);
        onValueChange(currentLow, newVal);
      },
    })
  ).current;

  const totalRange = max - min || 1;
  const leftPercent = Math.max(0, Math.min(1, (low - min) / totalRange));
  const rightPercent = Math.max(0, Math.min(1, (high - min) / totalRange));

  const leftPosition = trackWidth > 0 ? leftPercent * trackWidth : 0;
  const rightPosition = trackWidth > 0 ? rightPercent * trackWidth : 0;
  const highlightWidth = Math.max(0, rightPosition - leftPosition);

  const formatVal = (v: number) => {
    const isInt = Number.isInteger(step) && Number.isInteger(v);
    return isInt ? v.toString() : v.toFixed(1);
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.headerRow}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.valuesBadge}>
            <Text style={[styles.valuesText, { color: activeColor }]}>
              {prefix}
              {formatVal(low)}
              {suffix} − {prefix}
              {formatVal(high)}
              {suffix}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.sliderContainer}>
        <View style={styles.trackBackground} onLayout={onLayoutTrack}>
          {/* Active Highlight Track */}
          <View
            style={[
              styles.activeHighlight,
              {
                left: leftPosition,
                width: highlightWidth,
                backgroundColor: activeColor,
              },
            ]}
          />

          {/* Low Thumb */}
          <View
            style={[
              styles.thumbTouchArea,
              {
                left: leftPosition - 19,
              },
            ]}
            {...lowPanResponder.panHandlers}
          >
            <View style={[styles.thumbCircle, { borderColor: activeColor }]} />
          </View>

          {/* High Thumb */}
          <View
            style={[
              styles.thumbTouchArea,
              {
                left: rightPosition - 19,
              },
            ]}
            {...highPanResponder.panHandlers}
          >
            <View style={[styles.thumbCircle, { borderColor: activeColor }]} />
          </View>
        </View>
      </View>

      <View style={styles.limitsRow}>
        <Text style={styles.limitText}>
          {prefix}
          {formatVal(min)}
          {suffix}
        </Text>
        <Text style={styles.limitText}>
          {prefix}
          {formatVal(max)}
          {suffix}
        </Text>
      </View>
    </View>
  );
};

export default RangeSlider;
