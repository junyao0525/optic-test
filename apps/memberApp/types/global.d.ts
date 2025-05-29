import {NavigationProp} from '@react-navigation/native';

declare global {
  // Define the main stack parameter list based on your StackNavigator
  type RootStackParamList = {
    Tab: undefined;
    CameraScreen: undefined;
    AudioScreen: undefined;
    EyeTiredness: undefined;
    ColorVision: undefined;
    About: undefined;
    Help: undefined;
    Language: undefined;
    Profile: undefined;
    Login: undefined;
    Register: undefined;
    AudioTest: undefined;
  };

  // Define Tab navigator parameter list
  type TabParamList = {
    Home: undefined;
    History: undefined;
    Settings: undefined;
  };

  // Define Camera stack parameter list
  type CameraStackParamList = {
    LandoltC: undefined;
  };

  // Define Audio stack parameter list
  type AudioStackParamList = {
    LandoltCTest: undefined;
  };

  // Navigation prop types for different navigators
  type RootStackNavigationProp = NavigationProp<RootStackParamList>;
  type TabNavigationProp = NavigationProp<TabParamList>;
  type CameraStackNavigationProp = NavigationProp<CameraStackParamList>;
  type AudioStackNavigationProp = NavigationProp<AudioStackParamList>;

  // Generic navigation type (you can use this as a fallback)
  type Navigation = RootStackNavigationProp;
}

// Extend React Navigation's root param list
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export {};
