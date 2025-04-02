import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// import TabScreen from './screens/Tab';
import DrawerNavigator from './navigations/DrawerNavigator';

// Main Routes with Drawer
const Routes = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Routes;
