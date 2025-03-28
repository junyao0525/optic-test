import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ColorVision from './screens/ColorVision/ColorVision';
import EyeTiredness from './screens/EyeTiredness/EyeTiredness';
import HistoryScreen from './screens/Historys';
import HomeScreen from './screens/Home';
import DistanceMeasure from './screens/LandoltC/DistanceMeasure';
import LandoltC from './screens/LandoltC/LandoltC';
import SettingScreen from './screens/Settings';
// import TabScreen from './screens/Tab';
import CustomTabContent from './components/CustomTabContent';
import DrawerNavigator from './navigations/DrawerNavigator';
import {Colors} from './themes';

// Create Stack & Drawer Navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const HomeStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: Colors.backgroundColor,
      },
    }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="LandoltC" component={LandoltC} />
    <Stack.Screen name="DistanceMeasure" component={DistanceMeasure} />
    <Stack.Screen name="EyeTiredness" component={EyeTiredness} />
    <Stack.Screen name="ColorVision" component={ColorVision} />
    <Stack.Screen name="History" component={HistoryScreen} />
    <Stack.Screen name="Setting" component={SettingScreen} />
  </Stack.Navigator>
);

const TabScreen = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabContent {...props} />}
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="stack" component={HomeStackNavigator} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
};

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
