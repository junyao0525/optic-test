/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import './gesture-handler';
import i18n from './src/localization/i18n';
import Routes from './src/Routes';
import SplashScreen from './src/screens/SplashScreen';

// Log initial language
console.log('Initial language:', i18n.language);

function App(): React.JSX.Element {
  return (
      <I18nextProvider i18n={i18n}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <SplashScreen>
          <Routes />
        </SplashScreen>
      </I18nextProvider>
  );
}

export default App;
