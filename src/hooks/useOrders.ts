// src/hooks/useOrders.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createOrder as createOrderApi,
} from '../services/api';
import { useCartStore } from '../store/cartStore';
import { USE_MOCK_DATA } from '../constants/config';
import { useOrdersStore } from '../store/ordersStore';
import { Order } from '../types';

export const useOrders = () => {
  const getOrders = useOrdersStore((state) => state.getOrders);

  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      // Toujours utiliser les données locales
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getOrders();
    },
  });
};

export const useOrder = (id: string) => {
  const getOrderById = useOrdersStore((state) => state.getOrderById);

  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getOrderById(id);
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const addOrder = useOrdersStore((state) => state.addOrder);
  const clearCart = useCartStore((state) => state.clearCart);
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  return useMutation({
    mutationFn: async (orderData: {
      deliveryAddress: string;
      phone: string;
      customerName?: string;
      customerEmail?: string;
      notes?: string;
    }) => {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const newOrder: Order = {
          id: `ORDER-${Date.now()}`,
          userId: '1',
          items: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
          totalAmount: getTotalPrice(),
          status: 'EN_ATTENTE',
          deliveryAddress: orderData.deliveryAddress,
          phone: orderData.phone,
          notes: orderData.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        addOrder(newOrder);
        return newOrder;
      }

      // Appel API
      const apiResponse = await createOrderApi({
        items: orderItems,
        customerName: orderData.customerName || 'Client Mobile',
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.phone,
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: 'CASH',
        notes: orderData.notes,
      });

      // Créer l'objet Order complet pour le store local
      const newOrder: Order = {
        id: apiResponse.orderNumber,
        userId: '1',
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: getTotalPrice(),
        status: 'EN_ATTENTE',
        deliveryAddress: orderData.deliveryAddress,
        phone: orderData.phone,
        notes: orderData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return newOrder;
    },
    onSuccess: (order) => {
      addOrder(order);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      clearCart();
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const cancelOrder = useOrdersStore((state) => state.cancelOrder);

  return useMutation({
    mutationFn: async (orderId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      cancelOrder(orderId);
      return orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};