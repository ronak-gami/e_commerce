import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { ModalProvider } from './src/context/ModalContext';
import { KeyboardAppProvider } from './src/components/Keyboard';

function App() {
  return (
    <SafeAreaProvider>
      <KeyboardAppProvider>
        <StatusBar barStyle="light-content" backgroundColor="#090D16" />
        <AuthProvider>
          <CartProvider>
            <ModalProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </ModalProvider>
          </CartProvider>
        </AuthProvider>
      </KeyboardAppProvider>
    </SafeAreaProvider>
  );
}

export default App;
