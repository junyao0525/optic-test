import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {AudioProvider} from '../providers/AudioProvider';
import CameraProvider from '../providers/CameraProvider';
import {DistanceMeasureProvider} from '../providers/DistanceProvider';
import AudioTestScreen from '../screens/AudioTest/AudioTest';
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import ColorVision from '../screens/ColorVision/ColorVision';
import EyeTiredness from '../screens/EyeTiredness/EyeTiredness';
import LandoltC from '../screens/LandoltC/LandoltC';
import LandoltCTest from '../screens/LandoltC/LandoltCtest';
import About from '../screens/Settings/About';
import Help from '../screens/Settings/Help';
import Language from '../screens/Settings/Language';
import Profile from '../screens/Settings/Profile';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();
const CameraStack = createNativeStackNavigator();
const AudioStack = createNativeStackNavigator();

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

const AudioScreen = () => {
  return (
    <AudioProvider>
      <AudioStack.Navigator screenOptions={{headerShown: false}}>
        <AudioStack.Screen name="LandoltCTest" component={LandoltCTest} />
      </AudioStack.Navigator>
    </AudioProvider>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Tab"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Tab" component={TabNavigator} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="AudioScreen" component={AudioScreen} />
      <Stack.Screen name="EyeTiredness" component={EyeTiredness} />
      <Stack.Screen name="ColorVision" component={ColorVision} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Language" component={Language} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="AudioTest" component={AudioTestScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
