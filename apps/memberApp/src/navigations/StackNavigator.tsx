import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import CameraProvider from '../../hocs/CameraProvider';
import {DistanceMeasureProvider} from '../../hocs/DistanceProvider';
import AudioWithProvided from '../screens/AudioTest/AudioTest';
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import ColorVision from '../screens/ColorVision/ColorVision';
import EyeTiredness from '../screens/EyeTiredness/EyeTiredness';
import LandoltC from '../screens/LandoltC/LandoltC';
import LandoltCTest from '../screens/LandoltC/LandoltCtest';
import LandoltInstruction from '../screens/LandoltC/LandoltInstruction';
import About from '../screens/Settings/About';
import Help from '../screens/Settings/Help';
import Language from '../screens/Settings/Language';
import Profile from '../screens/Settings/Profile';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();
const CameraStack = createNativeStackNavigator();

const CameraScreen = () => {
  return (
    <CameraProvider>
      <DistanceMeasureProvider>
        <CameraStack.Navigator screenOptions={{headerShown: false}}>
          <CameraStack.Screen name="LandoltC" component={LandoltC} />
        </CameraStack.Navigator>
      </DistanceMeasureProvider>
    </CameraProvider>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Tab"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Tab" component={TabNavigator} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="LandoltCTest" component={LandoltCTest} />
      <Stack.Screen name="LandoltInstruction" component={LandoltInstruction} />
      {/* <Stack.Screen
        name="DistanceMeasure"
        component={DistanceMeasureWithProvider}
      /> */}
      <Stack.Screen name="EyeTiredness" component={EyeTiredness} />
      <Stack.Screen name="ColorVision" component={ColorVision} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Language" component={Language} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="AudioTest" component={AudioWithProvided} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
