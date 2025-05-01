import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// import TabScreen from './screens/Tab';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import DrawerNavigator from './navigations/DrawerNavigator';

// Main Routes with Drawer
const Routes = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default Routes;
