// src/store/ordersStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderStatus } from '../types';

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  getOrders: () => Order[];
  getOrderById: (orderId: string) => Order | undefined;
}

const isLegacyDemoOrder = (order: Order) =>
  order.id === 'ORDER-001' || order.id === 'ORDER-002';

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order: Order) => {
        set((state) => ({
          orders: [order, ...state.orders.filter((item) => item.id !== order.id)],
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
        return [...get().orders]
          .filter((order) => !isLegacyDemoOrder(order))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      },

      getOrderById: (orderId: string) => {
        return get().orders.find(
          (order) => order.id === orderId && !isLegacyDemoOrder(order)
        );
      },
    }),
    {
      name: 'orders-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persistedState: any) => ({
        ...persistedState,
        orders: Array.isArray(persistedState?.orders)
          ? persistedState.orders.filter((order: Order) => !isLegacyDemoOrder(order))
          : [],
      }),
    }
  )
);
