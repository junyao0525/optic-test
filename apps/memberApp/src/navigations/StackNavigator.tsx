import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ColorVision from '../screens/ColorVision/ColorVision';
import EyeTiredness from '../screens/EyeTiredness/EyeTiredness';
import DistanceMeasure from '../screens/LandoltC/DistanceMeasure';
import LandoltC from '../screens/LandoltC/LandoltC';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Tab"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Tab" component={TabNavigator} />
      <Stack.Screen name="LandoltC" component={LandoltC} />
      <Stack.Screen name="DistanceMeasure" component={DistanceMeasure} />
      <Stack.Screen name="EyeTiredness" component={EyeTiredness} />
      <Stack.Screen name="ColorVision" component={ColorVision} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
