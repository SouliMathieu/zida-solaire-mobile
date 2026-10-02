// App.tsx

import React, { useEffect, useRef } from 'react';
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

const INITIAL_NOTIFICATION_MAX_AGE_MS = 60 * 60 * 1000;

type PushData = {
  route?: string;
  entityType?: string;
  entityId?: string;
};

function normalizeTimestamp(value: unknown) {
  const timestamp = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(timestamp) || timestamp <= 0) return null;
  return timestamp < 1_000_000_000_000
    ? timestamp * 1000
    : timestamp;
}

function getNotificationTimestamp(
  response: Notifications.NotificationResponse
) {
  const data = response.notification.request.content.data as
    | Record<string, unknown>
    | undefined;

  const dataTimestamp = normalizeTimestamp(data?.timestamp);
  if (dataTimestamp) return dataTimestamp;

  return normalizeTimestamp(response.notification.date);
}

function isFreshInitialResponse(
  response: Notifications.NotificationResponse
) {
  if (
    response.actionIdentifier !==
    Notifications.DEFAULT_ACTION_IDENTIFIER
  ) {
    return false;
  }

  const timestamp = getNotificationTimestamp(response);
  if (!timestamp) return false;

  const age = Date.now() - timestamp;

  return (
    age >= -60_000 &&
    age <= INITIAL_NOTIFICATION_MAX_AGE_MS
  );
}

function openPushDestination(data: PushData) {
  if (!navigationRef.isReady()) return false;

  switch (data.route) {
    case 'OrdersArea':
    case 'Orders':
    case 'OrderDetail':
      navigationRef.navigate('Profil', {
        screen: 'OrdersArea',
      });
      break;

    case 'Installations':
    case 'Installation':
    case 'InstallationDetail':
      navigationRef.navigate('Profil', {
        screen: 'Installations',
      });
      break;

    case 'RepairTickets':
    case 'RepairTicketDetail':
    case 'RepairRequest':
      navigationRef.navigate('Assistance', {
        screen: 'RepairTickets',
      });
      break;

    case 'InstallationRequest':
      navigationRef.navigate('Assistance', {
        screen: 'InstallationRequest',
      });
      break;

    case 'Contact':
      navigationRef.navigate('Assistance', {
        screen: 'Contact',
      });
      break;

    default:
      navigationRef.navigate('Profil', {
        screen: 'Notifications',
      });
      break;
  }

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
  const pendingPush = useRef<PushData | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      onAppStateChange
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const handleResponse = (
      response: Notifications.NotificationResponse | null
    ) => {
      if (!response) return;

      const data =
        response.notification.request.content.data as PushData;

      if (!openPushDestination(data)) {
        pendingPush.current = data;
      }

      Notifications.clearLastNotificationResponseAsync().catch(
        () => undefined
      );
    };

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        handleResponse
      );

    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (!response) return;

        if (!isFreshInitialResponse(response)) {
          Notifications.clearLastNotificationResponseAsync().catch(
            () => undefined
          );
          return;
        }

        handleResponse(response);
      })
      .catch((error) =>
        console.warn(
          'Unable to read last notification response:',
          error
        )
      );

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
