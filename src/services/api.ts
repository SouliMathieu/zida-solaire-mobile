// src/services/api.ts

import axios from 'axios';
import { API_URL, CONFIG } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_URL,
  timeout: CONFIG.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
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

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getPersistedAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
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

export const fetchProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const fetchCategoryById = async (id: string) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

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

export const customerLogin = async (phone: string): Promise<OtpChallengeResponse> => {
  const response = await api.post('/customer/login', { phone });
  return response.data;
};

export const verifyCustomerLoginOtp = async (data: {
  challengeId: string;
  phone: string;
  code: string;
}) => {
  const response = await api.post('/customer/login/verify', data);
  return response.data;
};

export type RegistrationData = {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
};

export const customerRegister = async (userData: RegistrationData): Promise<OtpChallengeResponse> => {
  const response = await api.post('/customer/register', userData);
  return response.data;
};

export const verifyCustomerRegisterOtp = async (
  userData: RegistrationData & { challengeId: string; code: string }
) => {
  const response = await api.post('/customer/register/verify', userData);
  return response.data;
};

export const getCustomerProfile = async () => {
  const response = await api.get('/customer/profile');
  return response.data;
};

export const updateCustomerProfile = async (userData: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
}) => {
  const response = await api.patch('/customer/profile', userData);
  return response.data;
};

export const fetchCustomerOrders = async () => {
  const response = await api.get('/customer/orders');
  return response.data.orders || [];
};

export const fetchCustomerInstallations = async () => {
  const response = await api.get('/customer/installations');
  return response.data.installations || [];
};

export const fetchCustomerRepairRequests = async () => {
  const response = await api.get('/customer/repair-requests');
  return response.data.repairs || [];
};

export const sendContactMessage = async (contactData: {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
}) => {
  const response = await api.post('/contact', {
    ...contactData,
    subject: contactData.subject || 'Demande de contact',
  });
  return response.data;
};

export const createInstallationRequest = async (requestData: any) => {
  const response = await api.post('/installation-requests', requestData);
  return response.data;
};

export const createDevisRequest = async (devisData: any) => {
  const response = await api.post('/devis', devisData);
  return response.data;
};

export const createRepairRequest = async (requestData: {
  name: string;
  phone: string;
  address?: string;
  installationType?: string;
  problemDescription: string;
  urgency: 'low' | 'normal' | 'high';
  installedByZida: 'yes' | 'no';
}) => {
  const response = await api.post('/repair-requests', requestData);
  return response.data;
};
