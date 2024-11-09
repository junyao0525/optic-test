declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
      Tab: undefined;
    }

    type TabParamList = {
      Home: undefined;
      Me: undefined;
      Unknown: undefined;
    };

    type TabParamListKey = keyof TabParamList;
  }
}

export {};
