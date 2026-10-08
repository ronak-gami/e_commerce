import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [activeThumb, setActiveThumb] = useState<'low' | 'high' | null>(null);

  // Local state for instant, buttery-smooth 60 FPS visual responsiveness
  const [localLow, setLocalLow] = useState(low);
  const [localHigh, setLocalHigh] = useState(high);

  // Sync local state when incoming props change from outside (e.g. resetFilters)
  useEffect(() => {
    setLocalLow(low);
  }, [low]);

  useEffect(() => {
    setLocalHigh(high);
  }, [high]);

  // Keep references to current values to avoid stale closures in gesture handlers
  const valuesRef = useRef({ low: localLow, high: localHigh, min, max, step, trackWidth });
  useEffect(() => {
    valuesRef.current = { low: localLow, high: localHigh, min, max, step, trackWidth };
  }, [localLow, localHigh, min, max, step, trackWidth]);

  // Track initial value at the start of a drag gesture (prevents exponential compounding)
  const dragStartValue = useRef<number>(0);

  const clampValue = useCallback(
    (val: number, minVal: number, maxVal: number) => {
      const stepped = Math.round(val / step) * step;
      // Resolve floating point precision quirks (e.g., 0.30000000000000004)
      const sanitized = parseFloat(stepped.toFixed(2));
      return Math.max(minVal, Math.min(maxVal, sanitized));
    },
    [step]
  );

  const onLayoutTrack = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setTrackWidth(width);
    }
  };

  // PanResponder for Left (Low) Thumb
  const lowPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false, // Prevents parent ScrollView from canceling touch
      onPanResponderGrant: () => {
        setActiveThumb('low');
        dragStartValue.current = valuesRef.current.low;
      },
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState) => {
        const { trackWidth: width, min: mn, max: mx, high: curHigh, step: st } = valuesRef.current;
        if (width <= 0) return;
        const totalRange = mx - mn;
        const delta = (gestureState.dx / width) * totalRange;
        const targetVal = dragStartValue.current + delta;
        const nextVal = clampValue(targetVal, mn, curHigh - st);

        setLocalLow(nextVal);
        onValueChange(nextVal, curHigh);
      },
      onPanResponderRelease: () => {
        setActiveThumb(null);
      },
      onPanResponderTerminate: () => {
        setActiveThumb(null);
      },
    })
  ).current;

  // PanResponder for Right (High) Thumb
  const highPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false, // Prevents parent ScrollView from canceling touch
      onPanResponderGrant: () => {
        setActiveThumb('high');
        dragStartValue.current = valuesRef.current.high;
      },
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState) => {
        const { trackWidth: width, min: mn, max: mx, low: curLow, step: st } = valuesRef.current;
        if (width <= 0) return;
        const totalRange = mx - mn;
        const delta = (gestureState.dx / width) * totalRange;
        const targetVal = dragStartValue.current + delta;
        const nextVal = clampValue(targetVal, curLow + st, mx);

        setLocalHigh(nextVal);
        onValueChange(curLow, nextVal);
      },
      onPanResponderRelease: () => {
        setActiveThumb(null);
      },
      onPanResponderTerminate: () => {
        setActiveThumb(null);
      },
    })
  ).current;

  const totalRange = max - min || 1;
  const leftPercent = Math.max(0, Math.min(1, (localLow - min) / totalRange));
  const rightPercent = Math.max(0, Math.min(1, (localHigh - min) / totalRange));

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
              {formatVal(localLow)}
              {suffix} − {prefix}
              {formatVal(localHigh)}
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
                left: leftPosition - 24,
                zIndex: activeThumb === 'low' ? 30 : 15,
              },
            ]}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            {...lowPanResponder.panHandlers}
          >
            <View
              style={[
                styles.thumbCircle,
                { borderColor: activeColor },
                activeThumb === 'low' && styles.thumbCircleActive,
              ]}
            />
          </View>

          {/* High Thumb */}
          <View
            style={[
              styles.thumbTouchArea,
              {
                left: rightPosition - 24,
                zIndex: activeThumb === 'high' ? 30 : 15,
              },
            ]}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            {...highPanResponder.panHandlers}
          >
            <View
              style={[
                styles.thumbCircle,
                { borderColor: activeColor },
                activeThumb === 'high' && styles.thumbCircleActive,
              ]}
            />
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
