import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import HomeScreen from './screens/Home';
import TabScreen from './screens/Tab';
import {Colors} from './themes';

const Stack = createNativeStackNavigator();

// const Providers = () => {
//   return <></>;
// };

const Routes = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Tab"
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: Colors.BackgroundColors,
            },
          }}>
          <Stack.Screen name="Tab" component={TabScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Routes;
