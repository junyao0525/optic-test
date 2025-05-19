import {NavigationProp} from '@react-navigation/native'; // Ensure this is imported

declare global {
  // Define the type for your Tab screens and params
  type TabParamList = {
    Home: undefined;
    History: undefined;
    Settings: undefined;
  };

  // A helper type to access the keys of the TabParamList
  type TabParamListKey = keyof TabParamList;

  // Generic Navigation type for navigation across TabParamList screens
  type Navigation = NavigationProp<TabParamList>;

  // Make sure RootStackParamList is defined somewhere else in your code
  export type RootStackParamList = {
    Tab: undefined;
    ColorVision: undefined;
    LandoltC: undefined;
    LandoltCTest: undefined;
    EyeTiredness: undefined;
    History: undefined;
    About: undefined;
    Help: undefined;
    Language: undefined;
    Profile: undefined;
    Login: undefined;
    Register: undefined;
    LandoltInstruction: {
      eye: 'left' | 'right';
    };
    AudioTest: undefined;
  };

  // Extend the RootParamList for React Navigation
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
      // You can add more navigation types if needed
      Tab: undefined;
      ColorVision: undefined;
      LandoltC: undefined;
      LandoltCTest: undefined;
      EyeTiredness: undefined;
      History: undefined;
      About: undefined;
      Help: undefined;
      Language: undefined;
      Profile: undefined;
      Login: undefined;
      Register: undefined;
      LandoltInstruction: {
        eye: 'left' | 'right';
      };
    }
  }
}

export {};
