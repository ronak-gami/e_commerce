import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  valuesBadge: {
    backgroundColor: 'rgba(225, 29, 72, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.25)',
  },
  valuesText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  sliderContainer: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  trackBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  activeHighlight: {
    position: 'absolute',
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  thumbTouchArea: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    top: -20,
  },
  thumbCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: COLORS.primary,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 6,
  },
  thumbCircleActive: {
    transform: [{ scale: 1.15 }],
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 10,
  },
  limitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  limitText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});
