// src/services/api.ts

import axios from 'axios';
import { API_URL, CONFIG } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_URL,
  timeout: CONFIG.apiTimeout,
  headers: { 'Content-Type': 'application/json' },
});

async function getPersistedAuthToken() {
  const raw = await AsyncStorage.getItem('user-storage');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
}

api.interceptors.request.use(async (config) => {
  try {
    const token = await getPersistedAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) console.error('API Error:', error.response.status, error.response.data);
    else if (error.request) console.error('Network Error:', error.request);
    else console.error('Error:', error.message);
    return Promise.reject(error);
  }
);

export default api;

export const fetchProducts = async (params?: { categoryId?: string; search?: string }) => {
  const queryParams: any = {};
  if (params?.categoryId) queryParams.category = params.categoryId;
  if (params?.search) queryParams.search = params.search;
  const response = await api.get('/products', { params: queryParams });
  return response.data.products || response.data;
};

export const fetchProductById = async (id: string) => (await api.get(`/products/${id}`)).data;
export const fetchCategories = async () => (await api.get('/categories')).data;
export const fetchCategoryById = async (id: string) => (await api.get(`/categories/${id}`)).data;

export const createOrder = async (orderData: {
  items: Array<{ productId: string; name: string; quantity: number; price: number }>;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: string;
  notes?: string;
}) => {
  const nameParts = orderData.customerName.trim().split(' ');
  const firstName = nameParts[0] || 'Client';
  const lastName = nameParts.slice(1).join(' ') || 'Mobile';
  const subtotal = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 0;
  const response = await api.post('/checkout', {
    customer: {
      firstName,
      lastName,
      email: orderData.customerEmail || '',
      phone: orderData.customerPhone,
      city: 'Ouagadougou',
      address: orderData.deliveryAddress,
      notes: orderData.notes || '',
    },
    items: orderData.items.map((item) => ({
      id: item.productId,
      name: item.name,
      price: item.price,
      slug: '',
      image: '',
      quantity: item.quantity,
    })),
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  });
  return response.data;
};

export type OtpChallengeResponse = {
  challengeId: string;
  phone: string;
  expiresIn: number;
  devCode?: string;
};

export const customerLogin = async (phone: string): Promise<OtpChallengeResponse> =>
  (await api.post('/customer/login', { phone })).data;

export const verifyCustomerLoginOtp = async (data: { challengeId: string; phone: string; code: string }) =>
  (await api.post('/customer/login/verify', data)).data;

export type RegistrationData = {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
};

export const customerRegister = async (userData: RegistrationData): Promise<OtpChallengeResponse> =>
  (await api.post('/customer/register', userData)).data;

export const verifyCustomerRegisterOtp = async (userData: RegistrationData & { challengeId: string; code: string }) =>
  (await api.post('/customer/register/verify', userData)).data;

export const requestCustomerPhoneChange = async (phone: string): Promise<OtpChallengeResponse> =>
  (await api.post('/customer/phone-change/request', { phone })).data;

export const verifyCustomerPhoneChange = async (data: { challengeId: string; phone: string; code: string }) =>
  (await api.post('/customer/phone-change/verify', data)).data;

export const getCustomerProfile = async () => (await api.get('/customer/profile')).data;

export const updateCustomerProfile = async (userData: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
}) => (await api.patch('/customer/profile', userData)).data;

export const fetchCustomerOrders = async () => (await api.get('/customer/orders')).data.orders || [];
export const fetchCustomerInstallations = async () => (await api.get('/customer/installations')).data.installations || [];
export const fetchCustomerRepairRequests = async () => (await api.get('/customer/repair-requests')).data.repairs || [];

export type CustomerNotification = {
  id: string;
  type: 'order' | 'installation' | 'sav' | 'system';
  title: string;
  message: string;
  entityType?: string | null;
  entityId?: string | null;
  route?: string | null;
  readAt?: string | null;
  createdAt: string;
};

export type NotificationPreferences = {
  orderUpdates: boolean;
  installationUpdates: boolean;
  savUpdates: boolean;
  promotions: boolean;
  solarTips: boolean;
  pushEnabled: boolean;
};

export const fetchCustomerNotifications = async (): Promise<{ notifications: CustomerNotification[]; unreadCount: number }> =>
  (await api.get('/customer/notifications')).data;

export const markCustomerNotificationRead = async (id: string) =>
  (await api.patch('/customer/notifications', { id })).data;

export const markAllCustomerNotificationsRead = async () =>
  (await api.patch('/customer/notifications', { all: true })).data;

export const fetchNotificationPreferences = async (): Promise<NotificationPreferences> =>
  (await api.get('/customer/notifications/preferences')).data;

export const updateNotificationPreferences = async (data: Partial<NotificationPreferences>): Promise<NotificationPreferences> =>
  (await api.patch('/customer/notifications/preferences', data)).data;

export const registerCustomerPushToken = async (data: {
  token: string;
  platform: 'android' | 'ios';
  deviceId?: string;
}) => (await api.post('/customer/push-token', data)).data;

export const revokeCustomerPushToken = async (token: string) =>
  (await api.delete('/customer/push-token', { data: { token } })).data;

export const sendContactMessage = async (contactData: {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
}) => (await api.post('/contact', { ...contactData, subject: contactData.subject || 'Demande de contact' })).data;

export const createInstallationRequest = async (requestData: any) =>
  (await api.post('/installation-requests', requestData)).data;

export const createDevisRequest = async (devisData: any) =>
  (await api.post('/devis', devisData)).data;

export const createRepairRequest = async (requestData: {
  name: string;
  phone: string;
  address?: string;
  installationType?: string;
  problemDescription: string;
  urgency: 'low' | 'normal' | 'high';
  installedByZida: 'yes' | 'no';
}) => (await api.post('/repair-requests', requestData)).data;
