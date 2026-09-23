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
    lightColor: '#FF6B35',
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

  const expoToken = await Notifications.getExpoPushTokenAsync({
    projectId: EXPO_PROJECT_ID,
  });

  const token = expoToken.data;
  await registerCustomerPushToken({
    token,
    platform: Platform.OS,
  });
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
