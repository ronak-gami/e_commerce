import React, { ReactNode } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';

let NativeKeyboardProvider: any = null;
let NativeKeyboardAwareScrollView: any = null;

try {
  const keyboardController = require('react-native-keyboard-controller');
  NativeKeyboardProvider = keyboardController.KeyboardProvider;
  NativeKeyboardAwareScrollView = keyboardController.KeyboardAwareScrollView;
} catch {
  // Graceful fallback when package is not yet compiled
}

export const KeyboardAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  if (NativeKeyboardProvider) {
    return (
      <NativeKeyboardProvider statusBarTranslucent navigationBarTranslucent>
        {children}
      </NativeKeyboardProvider>
    );
  }
  return <>{children}</>;
};

export interface KeyboardAwareContainerProps extends ScrollViewProps {
  children?: ReactNode;
  bottomOffset?: number;
}

export const KeyboardAwareContainer: React.FC<KeyboardAwareContainerProps> = ({
  children,
  bottomOffset = 24,
  ...props
}) => {
  if (NativeKeyboardAwareScrollView) {
    return (
      <NativeKeyboardAwareScrollView
        bottomOffset={bottomOffset}
        keyboardShouldPersistTaps="handled"
        {...props}
      >
        {children}
      </NativeKeyboardAwareScrollView>
    );
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled" {...props}>
      {children}
    </ScrollView>
  );
};

export default KeyboardAwareContainer;
