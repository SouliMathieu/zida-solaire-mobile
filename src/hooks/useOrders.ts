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
  READY_FOR_PICKUP: 'PRETE',
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
    fulfillmentMethod: item.fulfillmentMethod === 'PICKUP' ? 'PICKUP' : 'DELIVERY',
    deliveryAddress: [item.deliveryAddress, item.deliveryCity]
      .filter(Boolean)
      .join(', '),
    phone: item.customerPhone || '',
    notes: item.customerNotes || undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export const useOrders = () => {
  const localOrders = useOrdersStore((state) => state.orders);
  const getOrders = useOrdersStore((state) => state.getOrders);
  const userId = useUserStore((state) => state.user?.id ?? null);
  const authenticated = useUserStore(
    (state) => !!state.user && !!state.token
  );

  return useQuery<Order[]>({
    queryKey: ['orders', userId, authenticated, localOrders],
    enabled: true,
    queryFn: async () => {
      if (USE_MOCK_DATA) return getOrders();

      // Guest checkout orders remain available on this device.
      if (!authenticated) return getOrders().filter((order) => order.userId === 'guest');

      const serverOrders = await fetchCustomerOrders();
      const synced = serverOrders.map(mapCustomerOrder);
      // Keep local copies of orders made while logged in on this device.
      const localAccountOrders = getOrders().filter((order) => order.userId === userId);
      return [...synced, ...localAccountOrders.filter(
        (local) => !synced.some((remote: Order) => remote.id === local.id)
      )].sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
  });
};

export const useOrder = (id: string) => {
  const { data: orders = [] } = useOrders();
  const userId = useUserStore((state) => state.user?.id ?? null);

  return useQuery<Order | undefined>({
    queryKey: ['order', userId, id, orders.length],
    queryFn: async () =>
      orders.find((order: Order) => order.id === id),
    enabled: !!id && !!userId,
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
      fulfillmentMethod?: 'DELIVERY' | 'PICKUP';
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
          deliveryAddress: orderData.fulfillmentMethod === 'PICKUP' ? 'Retrait chez ZIDA SOLAIRE' : orderData.deliveryAddress,
          fulfillmentMethod: orderData.fulfillmentMethod || 'DELIVERY',
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
        fulfillmentMethod: orderData.fulfillmentMethod || 'DELIVERY',
        paymentMethod: 'CASH',
        notes: orderData.notes,
      });

      const serverOrder = apiResponse.order;

      return {
        id: serverOrder.orderNumber,
        userId: 'customer',
        items: (serverOrder.items || []).map((item: any) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: Number(item.price || 0),
        })),
        totalAmount: Number(
          serverOrder.total ?? getTotalPrice()
        ),
        status:
          STATUS_MAP[serverOrder.status] ||
          'EN_ATTENTE',
        fulfillmentMethod: serverOrder.fulfillmentMethod === 'PICKUP' ? 'PICKUP' : 'DELIVERY',
        deliveryAddress: [
          serverOrder.deliveryAddress,
          serverOrder.deliveryCity,
        ]
          .filter(Boolean)
          .join(', '),
        phone:
          serverOrder.customerPhone ||
          orderData.phone,
        notes:
          serverOrder.customerNotes ||
          orderData.notes ||
          undefined,
        createdAt:
          serverOrder.createdAt ||
          new Date().toISOString(),
        updatedAt:
          serverOrder.updatedAt ||
          new Date().toISOString(),
      } satisfies Order;
    },

    onSuccess: (order) => {
      const currentUserId = useUserStore.getState().user?.id;
      addOrder({ ...order, userId: currentUserId || 'guest' });

      queryClient.invalidateQueries({
        queryKey: ['orders'],
      });

      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });

      clearCart();
    },
  });
};
