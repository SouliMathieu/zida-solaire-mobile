import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { EXPO_PROJECT_ID } from '../constants/config';
import { registerCustomerPushToken, revokeCustomerPushToken } from './api';

const PUSH_TOKEN_STORAGE_KEY = 'zida-expo-push-token';

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

type PushActivationStage =
  | 'ANDROID_CHANNEL'
  | 'PERMISSION'
  | 'FCM_TOKEN'
  | 'EXPO_TOKEN'
  | 'SERVER_REGISTER'
  | 'LOCAL_SAVE';

export class PushActivationDiagnosticError extends Error {
  constructor(
    public readonly stage: PushActivationStage,
    public readonly httpStatus?: number
  ) {
    super('PUSH-DIAG-2-' + stage + (httpStatus ? '-' + httpStatus : ''));
    this.name = 'PushActivationDiagnosticError';
  }
}

// Ne journaliser aucun jeton push, ni le contenu des requêtes HTTP.
function activationError(stage: PushActivationStage, error: unknown) {
  const httpStatus = Number((error as { response?: { status?: number } } | null)?.response?.status) || undefined;
  console.warn('Push activation diagnostic:', { stage, httpStatus });
  return new PushActivationDiagnosticError(stage, httpStatus);
}

export async function enablePushNotifications() {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
    return { enabled: false, reason: 'unsupported' as const };
  }

  try {
    await ensureAndroidChannel();
  } catch (error) {
    throw activationError('ANDROID_CHANNEL', error);
  }

  let permissions;
  try {
    permissions = await Notifications.getPermissionsAsync();
    if (permissions.status !== 'granted') {
      permissions = await Notifications.requestPermissionsAsync();
    }
  } catch (error) {
    throw activationError('PERMISSION', error);
  }

  if (permissions.status !== 'granted') {
    return { enabled: false, reason: 'permission-denied' as const };
  }

  // Permet de séparer un problème de Firebase/Google Play Services d'un problème Expo.
  if (Platform.OS === 'android') {
    try {
      const fcmToken = await Notifications.getDevicePushTokenAsync();
      if (!fcmToken.data) throw new Error('No native device token');
    } catch (error) {
      throw activationError('FCM_TOKEN', error);
    }
  }

  let token: string;
  try {
    const expoToken = await Notifications.getExpoPushTokenAsync({
      projectId: EXPO_PROJECT_ID,
    });
    token = expoToken.data;
    if (!token) throw new Error('No Expo push token');
  } catch (error) {
    throw activationError('EXPO_TOKEN', error);
  }

  try {
    await registerCustomerPushToken({ token, platform: Platform.OS });
  } catch (error) {
    throw activationError('SERVER_REGISTER', error);
  }

  try {
    await AsyncStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token);
  } catch (error) {
    throw activationError('LOCAL_SAVE', error);
  }

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
