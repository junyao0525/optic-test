/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
// import SplashScreen from 'src/screens/SplashScreen';
import './gesture-handler';
import Routes from './src/Routes';
import SplashScreen from './src/screens/SplashScreen';

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <SplashScreen>
        <Routes />
      </SplashScreen>
    </>
  );
}

export default App;
