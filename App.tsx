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

type PushData = {
  route?: string;
  entityType?: string;
  entityId?: string;
};

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
      // Never redirect the user just because a notification response
      // has no recognized destination. This is especially important
      // for stale/partial Android notification responses restored at startup.
      return false;
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
    const INITIAL_NOTIFICATION_MAX_AGE_MS = 60 * 60 * 1000;

    // Android/Expo can deliver the response restored at process startup
    // through the live listener as well as getLastNotificationResponseAsync().
    // Do not process any response until the startup response has been resolved.
    let startupResolved = false;
    const queuedResponses: Notifications.NotificationResponse[] = [];
    const processedIdentifiers = new Set<string>();

    const normalizeTimestamp = (value: unknown) => {
      const timestamp =
        typeof value === 'number' ? value : Number(value);

      if (!Number.isFinite(timestamp) || timestamp <= 0) {
        return null;
      }

      return timestamp < 1_000_000_000_000
        ? timestamp * 1000
        : timestamp;
    };

    const getNotificationTimestamp = (
      response: Notifications.NotificationResponse
    ) => {
      const data =
        response.notification.request.content.data as
          | Record<string, unknown>
          | undefined;

      const dataTimestamp = normalizeTimestamp(data?.timestamp);

      if (dataTimestamp) {
        return dataTimestamp;
      }

      return normalizeTimestamp(response.notification.date);
    };

    const isFreshInitialResponse = (
      response: Notifications.NotificationResponse
    ) => {
      if (
        response.actionIdentifier !==
        Notifications.DEFAULT_ACTION_IDENTIFIER
      ) {
        return false;
      }

      const timestamp = getNotificationTimestamp(response);

      if (!timestamp) {
        return false;
      }

      const age = Date.now() - timestamp;

      return (
        age >= -60_000 &&
        age <= INITIAL_NOTIFICATION_MAX_AGE_MS
      );
    };

    const getResponseIdentifier = (
      response: Notifications.NotificationResponse
    ) => response.notification.request.identifier;

    const processResponse = (
      response: Notifications.NotificationResponse,
      allowStale: boolean
    ) => {
      const identifier = getResponseIdentifier(response);

      if (processedIdentifiers.has(identifier)) {
        return;
      }

      if (
        response.actionIdentifier !==
        Notifications.DEFAULT_ACTION_IDENTIFIER
      ) {
        processedIdentifiers.add(identifier);
        return;
      }

      if (!allowStale && !isFreshInitialResponse(response)) {
        processedIdentifiers.add(identifier);
        Notifications.clearLastNotificationResponseAsync().catch(
          () => undefined
        );
        return;
      }

      const data =
        response.notification.request.content.data as PushData;

      processedIdentifiers.add(identifier);

      // An old or incomplete notification response must never change
      // the initial navigation state. Only recognized push routes navigate.
      if (!openPushDestination(data)) {
        return;
      }

      Notifications.clearLastNotificationResponseAsync().catch(
        () => undefined
      );
    };

    const handleResponse = (
      response: Notifications.NotificationResponse | null
    ) => {
      if (!response) return;

      if (!startupResolved) {
        queuedResponses.push(response);
        return;
      }

      // Responses received after startup are genuine user interactions,
      // so they do not need the startup age check.
      processResponse(response, true);
    };

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        handleResponse
      );

    Notifications.getLastNotificationResponseAsync()
      .then((initialResponse) => {
        if (initialResponse) {
          // This is the response persisted by the native notification
          // layer when the app process was launched. It is the only
          // response that must pass the freshness check.
          processResponse(initialResponse, false);
        }

        startupResolved = true;

        // Process any responses that arrived while the startup response
        // was being resolved. The identifier guard prevents processing
        // the same native response twice.
        for (const response of queuedResponses) {
          if (
            initialResponse &&
            getResponseIdentifier(response) ===
              getResponseIdentifier(initialResponse)
          ) {
            continue;
          }

          processResponse(response, true);
        }

        queuedResponses.length = 0;
      })
      .catch((error) => {
        console.warn(
          'Unable to read last notification response:',
          error
        );

        // If the native lookup fails, do not block the app forever.
        // Any queued event is then treated as a real interaction.
        startupResolved = true;

        for (const response of queuedResponses) {
          processResponse(response, true);
        }

        queuedResponses.length = 0;
      });

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
