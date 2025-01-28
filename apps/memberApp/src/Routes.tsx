import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import HomeScreen from './screens/Home';
import TabScreen from './screens/Tab';
import {Colors} from './themes';
import LandoltC from './screens/LandoltC/LandoltC';
import DistanceMeasure from './screens/LandoltC/DistanceMeasure';
import EyeTiredness from './screens/EyeTiredness/EyeTiredness';
import ColorVision from './screens/ColorVision/ColorVision';

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
              backgroundColor: Colors.backgroundColor,
            },
          }}>
          <Stack.Screen name="Tab" component={TabScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="LandoltC" component={LandoltC} />
          <Stack.Screen name="DistanceMeasure" component={DistanceMeasure} />
          <Stack.Screen name="EyeTiredness" component={EyeTiredness} />
          <Stack.Screen name="ColorVision" component={ColorVision} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Routes;
