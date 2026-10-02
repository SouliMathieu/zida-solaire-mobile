// App.tsx

import React, { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { navigationRef } from './src/navigation/navigationRef';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

type PushData = {
  route?: string;
  entityType?: string;
  entityId?: string;
};

type PushDestination = {
  tab: 'Profil' | 'Assistance';
  screen: string;
};

function getPushDestination(data: PushData): PushDestination | null {
  switch (data.route) {
    case 'OrdersArea':
    case 'Orders':
    case 'OrderDetail':
      return {
        tab: 'Profil',
        screen: 'OrdersArea',
      };

    case 'Installations':
    case 'Installation':
    case 'InstallationDetail':
      return {
        tab: 'Profil',
        screen: 'Installations',
      };

    case 'RepairTickets':
    case 'RepairTicketDetail':
    case 'RepairRequest':
      return {
        tab: 'Assistance',
        screen: 'RepairTickets',
      };

    case 'InstallationRequest':
      return {
        tab: 'Assistance',
        screen: 'InstallationRequest',
      };

    case 'Contact':
      return {
        tab: 'Assistance',
        screen: 'Contact',
      };

    default:
      return null;
  }
}

function openPushDestination(data: PushData) {
  const destination = getPushDestination(data);

  if (!destination || !navigationRef.isReady()) {
    return false;
  }

  navigationRef.navigate(destination.tab, {
    screen: destination.screen,
    initial: false,
  });

  queryClient.invalidateQueries({
    queryKey: ['notifications'],
  });

  return true;
}

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

export default function App() {
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      onAppStateChange
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    // Important startup rule:
    // never use Expo's persisted "last notification response" to decide
    // the initial screen. Android may restore an old response after an APK
    // update or process restart, which previously caused a delayed redirect.
    let startupResolved = false;

    const clearStartupResponse = async () => {
      try {
        await Notifications.clearLastNotificationResponseAsync();
      } catch (error) {
        console.warn(
          'Unable to clear startup notification response:',
          error
        );
      } finally {
        startupResolved = true;
      }
    };

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {
          // Responses emitted while the app is still resolving startup may be
          // native replays of a persisted response. Ignore them completely.
          if (!startupResolved) {
            return;
          }

          if (
            response.actionIdentifier !==
            Notifications.DEFAULT_ACTION_IDENTIFIER
          ) {
            return;
          }

          const data =
            response.notification.request.content.data as PushData;

          // Only an explicit, recognized route coming from a live user tap
          // is allowed to change navigation after startup.
          openPushDestination(data);

          Notifications.clearLastNotificationResponseAsync().catch(
            () => undefined
          );
        }
      );

    clearStartupResponse();

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer ref={navigationRef}>
          <BottomTabNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
