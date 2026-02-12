// src/services/api.ts

import axios from 'axios';
import { API_URL, CONFIG } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Créer une instance axios
const api = axios.create({
  baseURL: API_URL,
  timeout: CONFIG.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
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

// ==================== PRODUITS ====================

export const fetchProducts = async (params?: {
  categoryId?: string;
  search?: string;
}) => {
  try {
    const queryParams: any = {};
    
    if (params?.categoryId) {
      queryParams.category = params.categoryId; 
    }
    
    if (params?.search) {
      queryParams.search = params.search;
    }
    
    const response = await api.get('/products', { params: queryParams });
    
    // L'API retourne {products: [...], total, pages, currentPage}
    // On extrait seulement le tableau products
    return response.data.products || response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// ==================== CATÉGORIES ====================

export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchCategoryById = async (id: string) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// ==================== COMMANDES ====================

export const fetchOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const fetchOrderById = async (id: string) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const createOrder = async (orderData: {
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: string;
  notes?: string;
}) => {
  try {
    const nameParts = orderData.customerName.trim().split(' ');
    const firstName = nameParts[0] || 'Client';
    const lastName = nameParts.slice(1).join(' ') || 'Mobile';

    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 0;
    const total = subtotal + deliveryFee;

    const checkoutPayload = {
      customer: {
        firstName: firstName,
        lastName: lastName,
        email: orderData.customerEmail || '',
        phone: orderData.customerPhone,
        city: 'Ouagadougou',
        address: orderData.deliveryAddress,
        notes: orderData.notes || '',
      },
      items: orderData.items.map(item => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        slug: '',
        image: '',
        quantity: item.quantity,
      })),
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
    };

    const response = await api.post('/checkout', checkoutPayload);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};


export const updateOrderStatus = async (
  orderId: string,
  status: string
) => {
  try {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// ==================== CHECKOUT ====================

export const processCheckout = async (checkoutData: {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
  notes?: string;
}) => {
  try {
    const response = await api.post('/checkout', {
      items: checkoutData.items,
      customerName: checkoutData.customerInfo.name,
      customerEmail: checkoutData.customerInfo.email,
      customerPhone: checkoutData.customerInfo.phone,
      deliveryAddress: checkoutData.customerInfo.address,
      paymentMethod: checkoutData.paymentMethod,
      notes: checkoutData.notes,
    });
    return response.data;
  } catch (error) {
    console.error('Error processing checkout:', error);
    throw error;
  }
};

// ==================== CONTACT ====================

export const sendContactMessage = async (contactData: {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
}) => {
  try {
    const response = await api.post('/contact', {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      subject: contactData.subject || 'Demande de contact',
      message: contactData.message,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending contact message:', error);
    throw error;
  }
};

// ==================== DEMANDES D'INSTALLATION ====================

export const createInstallationRequest = async (requestData: {
  name: string;
  email: string;
  phone: string;
  address: string;
  propertyType: string;
  roofType?: string;
  averageMonthlyBill?: number;
  notes?: string;
}) => {
  try {
    const response = await api.post('/installation-requests', requestData);
    return response.data;
  } catch (error) {
    console.error('Error creating installation request:', error);
    throw error;
  }
};

// ==================== DEVIS ====================

export const createDevisRequest = async (devisData: {
  name: string;
  email: string;
  phone: string;
  address: string;
  systemType: string;
  estimatedBudget?: string;
  message?: string;
}) => {
  try {
    const response = await api.post('/devis', devisData);
    return response.data;
  } catch (error) {
    console.error('Error creating devis request:', error);
    throw error;
  }
};