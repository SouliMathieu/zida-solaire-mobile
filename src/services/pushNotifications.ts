import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { EXPO_PROJECT_ID } from '../constants/config';
import { registerCustomerPushToken, revokeCustomerPushToken } from './api';

const PUSH_TOKEN_STORAGE_KEY = 'zida-expo-push-token';

// Identifiant affiché lors du diagnostic, sans divulguer les jetons d'appareil.
export const PUSH_DIAGNOSTIC_VERSION = 'PUSH-DIAG-02';

export class PushActivationError extends Error {
  constructor(
    public readonly stage: 'fcm' | 'expo' | 'server',
    public readonly httpStatus?: number
  ) {
    super(`Échec ${stage}${httpStatus ? ` (HTTP ${httpStatus})` : ''}`);
    this.name = 'PushActivationError';
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('zida-updates', {
    name: 'Suivi ZIDA',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#063970',
    sound: 'default',
  });
}

export async function enablePushNotifications() {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
    return { enabled: false, reason: 'unsupported' as const };
  }

  await ensureAndroidChannel();

  let permissions = await Notifications.getPermissionsAsync();
  if (permissions.status !== 'granted') {
    permissions = await Notifications.requestPermissionsAsync();
  }

  if (permissions.status !== 'granted') {
    return { enabled: false, reason: 'permission-denied' as const };
  }

  // Expo obtient lui-même le jeton natif FCM lors de cet appel.
  // Une requête native préalable double inutilement les tentatives.
  let token: string | undefined;
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const expoToken = await Notifications.getExpoPushTokenAsync({
        projectId: EXPO_PROJECT_ID,
      });
      const candidate = expoToken.data;
      if (!candidate || !/^Expo(?:nent)?PushToken\[[^\]]+\]$/.test(candidate)) {
        throw new Error('Jeton Expo absent ou malformé');
      }
      token = candidate;
      break;
    } catch (error) {
      lastError = error;
      console.warn('Expo push token acquisition failed:', { attempt, error });
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, attempt * 1500));
      }
    }
  }
  if (!token) {
    console.warn('Expo push token unavailable after retries:', lastError);
    throw new PushActivationError('expo');
  }

  try {
    await registerCustomerPushToken({
      token,
      platform: Platform.OS,
    });
  } catch (error: any) {
    const status = Number(error?.response?.status);
    console.warn('Push registration rejected by ZIDA API:', {
      status: Number.isFinite(status) ? status : 'network-error',
    });
    throw new PushActivationError(
      'server',
      Number.isFinite(status) && status > 0 ? status : undefined
    );
  }

  await AsyncStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token);
  return { enabled: true, token };
}

export async function disablePushNotifications() {
  const token = await AsyncStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
  if (token) {
    try {
      await revokeCustomerPushToken(token);
    } finally {
      await AsyncStorage.removeItem(PUSH_TOKEN_STORAGE_KEY);
    }
  }
  return { enabled: false };
}

export async function revokePushTokenOnLogout() {
  try {
    await disablePushNotifications();
  } catch (error) {
    console.warn('Push token revoke on logout failed:', error);
    await AsyncStorage.removeItem(PUSH_TOKEN_STORAGE_KEY);
  }
}

export async function getStoredPushToken() {
  return AsyncStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
}
