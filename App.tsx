// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';

// Créer le client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <BottomTabNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
