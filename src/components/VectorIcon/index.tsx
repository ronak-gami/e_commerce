import React from 'react';
import { StyleProp, TextStyle, View, StyleSheet } from 'react-native';

let IoniconsComponent: any = null;
try {
  IoniconsComponent = require('react-native-vector-icons/Ionicons').default;
} catch {
  // Graceful fallback if native font binary is not yet compiled
}

export type IconName =
  | 'search'
  | 'cart'
  | 'back'
  | 'heart'
  | 'heart-outline'
  | 'close'
  | 'star'
  | 'trash'
  | 'plus'
  | 'minus'
  | 'apple'
  | 'google'
  | 'facebook'
  | 'sparkles'
  | 'check'
  | 'alert'
  | 'info'
  | 'arrow-forward'
  | 'external-link'
  | 'filter'
  | 'grid'
  | 'list';

interface VectorIconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

const ICON_MAP: Record<IconName, string> = {
  search: 'search-outline',
  cart: 'bag-handle-outline',
  back: 'chevron-back',
  heart: 'heart',
  'heart-outline': 'heart-outline',
  close: 'close-outline',
  star: 'star',
  trash: 'trash-outline',
  plus: 'add',
  minus: 'remove',
  apple: 'logo-apple',
  google: 'logo-google',
  facebook: 'logo-facebook',
  sparkles: 'sparkles',
  check: 'checkmark-circle-outline',
  alert: 'alert-circle-outline',
  info: 'information-circle-outline',
  'arrow-forward': 'arrow-forward',
  'external-link': 'open-outline',
  filter: 'options-outline',
  grid: 'grid-outline',
  list: 'list-outline',
};

export const VectorIcon: React.FC<VectorIconProps> = ({
  name,
  size = 20,
  color = '#FFFFFF',
  style,
}) => {
  const iconGlyph = ICON_MAP[name] || 'ellipse-outline';

  if (IoniconsComponent) {
    return <IoniconsComponent name={iconGlyph} size={size} color={color} style={style} />;
  }

  // Pure SVG/Vector path geometric fallback when testing before native fonts compile
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <View
        style={{
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: size * 0.35,
          borderWidth: 1.5,
          borderColor: color,
        }}
      />
    </View>
  );
};

export default VectorIcon;
