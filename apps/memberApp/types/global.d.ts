declare global {
  type TabParamList = {
    Home: undefined;
    History: undefined;
    Settings: undefined;
  };

  type TabParamListKey = keyof TabParamList;

  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
      Tab: undefined;
      ColorVision: undefined;
      LandoltC: undefined;
      EyeTiredness: undefined;
      History: undefined;
      About: undefined;
      Help: undefined;
      Language: undefined;
      Profile: undefined;
    }
  }
}

export {};
