declare module 'react-native-vector-icons/Ionicons' {
  import { Component } from 'react';
  import { TextStyle, StyleProp } from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
  }

  export default class Ionicons extends Component<IconProps> {}
}

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { Component } from 'react';
  import { TextStyle, StyleProp } from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
  }

  export default class MaterialCommunityIcons extends Component<IconProps> {}
}

declare module 'react-native-vector-icons/Feather' {
  import { Component } from 'react';
  import { TextStyle, StyleProp } from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
  }

  export default class Feather extends Component<IconProps> {}
}

declare module '@react-native-async-storage/async-storage' {
  interface AsyncStorageStatic {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
    clear: () => Promise<void>;
    getAllKeys: () => Promise<readonly string[]>;
  }
  const AsyncStorage: AsyncStorageStatic;
  export default AsyncStorage;
}

declare module 'react-native-keyboard-controller' {
  import { ComponentType, ReactNode } from 'react';
  import { ScrollViewProps, ViewProps } from 'react-native';

  export interface KeyboardProviderProps {
    children?: ReactNode;
    statusBarTranslucent?: boolean;
    navigationBarTranslucent?: boolean;
  }
  export const KeyboardProvider: ComponentType<KeyboardProviderProps>;

  export interface KeyboardAwareScrollViewProps extends ScrollViewProps {
    bottomOffset?: number;
    extraKeyboardSpace?: number;
    enabled?: boolean;
  }
  export const KeyboardAwareScrollView: ComponentType<KeyboardAwareScrollViewProps>;

  export const useKeyboardHandler: (handler: any, deps?: any[]) => void;
  export const KeyboardAvoidingView: ComponentType<ViewProps>;
}
