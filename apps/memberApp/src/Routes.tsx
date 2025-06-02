// Routes.tsx
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './config';
import AuthNavigator from './navigations/AuthNavigator';
import DrawerNavigator from './navigations/DrawerNavigator';
import { AuthProvider, useAuth } from './providers/AuthProvider';
const Main = () => {
  const {user} = useAuth();

  return (
    <NavigationContainer>
      {user ? <DrawerNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const Routes = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <Main />
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Routes;
