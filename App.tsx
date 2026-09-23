// App.tsx

import React, { useEffect, useRef } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const navigationRef = createNavigationContainerRef<any>();

type PushData = {
  route?: string;
  entityType?: string;
  entityId?: string;
};

function openPushDestination(data: PushData) {
  if (!navigationRef.isReady()) return false;

  switch (data.route) {
    case 'OrdersArea':
      navigationRef.navigate('Compte', { screen: 'OrdersArea' });
      break;
    case 'Installations':
      navigationRef.navigate('Mon énergie', { screen: 'Installations' });
      break;
    case 'RepairTickets':
      navigationRef.navigate('Assistance', { screen: 'RepairTickets' });
      break;
    default:
      navigationRef.navigate('Compte', { screen: 'Notifications' });
      break;
  }

  queryClient.invalidateQueries({ queryKey: ['customer-notifications'] });
  return true;
}

export default function App() {
  const pendingPush = useRef<PushData | null>(null);

  useEffect(() => {
    const handleResponse = (response: Notifications.NotificationResponse | null) => {
      if (!response) return;
      const data = response.notification.request.content.data as PushData;
      if (!openPushDestination(data)) pendingPush.current = data;
    };

    const subscription = Notifications.addNotificationResponseReceivedListener(handleResponse);

    Notifications.getLastNotificationResponseAsync()
      .then(handleResponse)
      .catch((error) => console.warn('Unable to read last notification response:', error));

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            if (pendingPush.current) {
              const data = pendingPush.current;
              pendingPush.current = null;
              openPushDestination(data);
            }
          }}
        >
          <BottomTabNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
