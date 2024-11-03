/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
// import SplashScreen from 'src/screens/SplashScreen';
import Routes from './src/Routes';

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Routes />
    </>
  );
}

export default App;
