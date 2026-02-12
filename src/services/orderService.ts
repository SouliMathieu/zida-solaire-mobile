// src/services/orderService.ts

import { api } from './api';
import { Order } from '../types';

export interface CreateOrderData {
  items: {
    productId: string;
    quantity: number;
  }[];
  deliveryAddress: string;
  phone: string;
  notes?: string;
}

export const orderService = {
  // Créer une commande
  createOrder: async (data: CreateOrderData) => {
    const response = await api.post<Order>('/api/orders', data);
    return response.data;
  },

  // Récupérer toutes les commandes de l'utilisateur
  getMyOrders: async () => {
    const response = await api.get<Order[]>('/api/orders/me');
    return response.data;
  },

  // Récupérer une commande par ID
  getOrderById: async (id: string) => {
    const response = await api.get<Order>(`/api/orders/${id}`);
    return response.data;
  },

  // Annuler une commande
  cancelOrder: async (id: string) => {
    const response = await api.patch<Order>(`/api/orders/${id}/cancel`);
    return response.data;
  },
};
