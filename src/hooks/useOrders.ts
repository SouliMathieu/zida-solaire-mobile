// src/hooks/useOrders.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrder as createOrderApi, fetchCustomerOrders } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { USE_MOCK_DATA } from '../constants/config';
import { useOrdersStore } from '../store/ordersStore';
import { useUserStore } from '../store/userStore';
import { Order, OrderStatus } from '../types';

const STATUS_MAP: Record<string, OrderStatus> = {
  PENDING: 'EN_ATTENTE',
  CONFIRMED: 'CONFIRMEE',
  PREPARING: 'EN_PREPARATION',
  PROCESSING: 'EN_PREPARATION',
  SHIPPED: 'EXPEDIEE',
  DELIVERED: 'LIVREE',
  CANCELLED: 'ANNULEE',
};

function mapCustomerOrder(item: any): Order {
  return {
    id: item.orderNumber || item.id,
    userId: 'customer',
    items: (item.items || []).map((line: any) => ({
      productId: line.productId,
      productName: line.productName,
      quantity: line.quantity,
      price: Number(line.price || 0),
    })),
    totalAmount: Number(item.total || 0),
    status: STATUS_MAP[item.status] || 'EN_ATTENTE',
    deliveryAddress: [item.deliveryAddress, item.deliveryCity].filter(Boolean).join(', '),
    phone: item.customerPhone || '',
    notes: item.customerNotes || undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export const useOrders = () => {
  const getOrders = useOrdersStore((state) => state.getOrders);
  const authenticated = useUserStore((state) => !!state.user && !!state.token);

  return useQuery<Order[]>({
    queryKey: ['orders', authenticated ? 'server' : 'local'],
    queryFn: async () => {
      if (authenticated && !USE_MOCK_DATA) {
        try {
          const serverOrders = await fetchCustomerOrders();
          return serverOrders.map(mapCustomerOrder);
        } catch (error) {
          console.warn('Customer order sync unavailable, using local history.', error);
        }
      }
      return getOrders();
    },
  });
};

export const useOrder = (id: string) => {
  const { data: orders = [] } = useOrders();
  return useQuery<Order | undefined>({
    queryKey: ['order', id, orders.length],
    queryFn: async () => orders.find((order: Order) => order.id === id),
    enabled: !!id,
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
        return {
          id: `ORDER-${Date.now()}`,
          userId: '1',
          items: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
          totalAmount: getTotalPrice(),
          status: 'EN_ATTENTE' as OrderStatus,
          deliveryAddress: orderData.deliveryAddress,
          phone: orderData.phone,
          notes: orderData.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } satisfies Order;
      }

      const apiResponse = await createOrderApi({
        items: orderItems,
        customerName: orderData.customerName || 'Client Mobile',
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.phone,
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: 'CASH',
        notes: orderData.notes,
      });

      return {
        id: apiResponse.orderNumber,
        userId: '1',
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: getTotalPrice(),
        status: 'EN_ATTENTE' as OrderStatus,
        deliveryAddress: orderData.deliveryAddress,
        phone: orderData.phone,
        notes: orderData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } satisfies Order;
    },
    onSuccess: (order) => {
      addOrder(order);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      clearCart();
    },
  });
};
