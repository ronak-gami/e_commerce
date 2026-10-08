/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './src/screens';

function App() {
  return (
    <SafeAreaProvider>
      <SplashScreen />
    </SafeAreaProvider>
  );
}

export default App;

