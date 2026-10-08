import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  // Ambient lighting effects
  ambientGlowTop: {
    position: 'absolute',
    top: -height * 0.15,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    backgroundColor: COLORS.glow,
  },
  ambientGlowBottom: {
    position: 'absolute',
    bottom: -height * 0.2,
    right: -width * 0.2,
    width: width * 1.0,
    height: width * 1.0,
    borderRadius: (width * 1.0) / 2,
    backgroundColor: 'rgba(56, 189, 248, 0.12)', // sky blue ambient
  },
  // Center Content
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  // Logo Box
  logoWrapper: {
    marginBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoOuterGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 36,
    backgroundColor: COLORS.glowStrong,
  },
  logoContainer: {
    width: 104,
    height: 104,
    borderRadius: 28,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: 'rgba(129, 140, 248, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  // Minimalist Bag SVG-like CSS Art Icon
  iconBagHandle: {
    width: 32,
    height: 20,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 3.5,
    borderBottomWidth: 0,
    borderColor: COLORS.primaryLight,
    marginBottom: -4,
  },
  iconBagBody: {
    width: 48,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBagAccentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accentGold,
  },
  // Title & Tagline
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  titleText: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  titleDot: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.accentGold,
    marginLeft: 2,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  // Footer
  footerContainer: {
    alignItems: 'center',
    paddingBottom: 48,
    width: '100%',
  },
  progressBarTrack: {
    width: 140,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 2,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    letterSpacing: 1.5,
  },
});
