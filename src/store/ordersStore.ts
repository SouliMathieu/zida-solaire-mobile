// src/store/ordersStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderItem, OrderStatus } from '../types';

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  getOrders: () => Order[];
  getOrderById: (orderId: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [
        // Commandes de test initiales
        {
          id: 'ORDER-001',
          userId: '1',
          items: [
            {
              productId: 'PROD-001',
              productName: 'Panneau Solaire 300W',
              quantity: 5,
              price: 300000,
              unitPrice: 300000,
              totalPrice: 1500000,
            },
          ],
          totalAmount: 1500000,
          status: 'EN_LIVRAISON',
          deliveryAddress: 'Ouagadougou, Secteur 15',
          phone: '+226 70 00 00 00',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'ORDER-002',
          userId: '1',
          items: [
            {
              productId: 'PROD-002',
              productName: 'Batterie Solaire 200Ah',
              quantity: 2,
              price: 175000,
              unitPrice: 175000,
              totalPrice: 350000,
            },
          ],
          totalAmount: 350000,
          status: 'EN_ATTENTE',
          deliveryAddress: 'Bobo-Dioulasso',
          phone: '+226 71 11 11 11',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],

      addOrder: (order: Order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      updateOrderStatus: (orderId: string, status: OrderStatus) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          ),
        }));
      },

      cancelOrder: (orderId: string) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: 'ANNULEE' as OrderStatus,
                  updatedAt: new Date().toISOString(),
                }
              : order
          ),
        }));
      },

      getOrders: () => {
        return get().orders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((order) => order.id === orderId);
      },
    }),
    {
      name: 'orders-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);