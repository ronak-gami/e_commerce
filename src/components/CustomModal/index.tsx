import React from 'react';
import {
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { styles } from './style';
import { ModalConfig } from '../../context/ModalContext';
import { VectorIcon, IconName } from '../VectorIcon';
import { COLORS } from '../../theme/colors';

interface CustomModalViewProps {
  config: ModalConfig;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
  onBackdropPress: () => void;
}

export const CustomModalView: React.FC<CustomModalViewProps> = ({
  config,
  fadeAnim,
  scaleAnim,
  onPrimaryPress,
  onSecondaryPress,
  onBackdropPress,
}) => {
  const {
    title,
    message,
    type = 'info',
    primaryText = 'Got It',
    secondaryText,
  } = config;

  const getIconProps = (): { name: IconName; color: string; style: any } => {
    switch (type) {
      case 'success':
        return { name: 'check', color: '#10B981', style: styles.iconSuccess };
      case 'error':
        return { name: 'close', color: '#EF4444', style: styles.iconError };
      case 'warning':
        return { name: 'alert', color: '#F59E0B', style: styles.iconWarning };
      case 'info':
      default:
        return { name: 'cart', color: COLORS.primaryLight, style: styles.iconInfo };
    }
  };

  const iconData = getIconProps();

  return (
    <TouchableWithoutFeedback onPress={onBackdropPress}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.modalCard,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Status Vector Icon with Soft Glow Halo */}
            <View style={[styles.iconContainer, iconData.style]}>
              <VectorIcon name={iconData.name} size={30} color={iconData.color} />
            </View>

            {/* Title & Message */}
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.messageText}>{message}</Text>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={onPrimaryPress}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>{primaryText}</Text>
              </TouchableOpacity>

              {secondaryText && (
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={onSecondaryPress}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryBtnText}>{secondaryText}</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default CustomModalView;
