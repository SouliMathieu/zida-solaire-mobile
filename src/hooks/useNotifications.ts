import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchCustomerNotifications,
  fetchNotificationPreferences,
  markAllCustomerNotificationsRead,
  markCustomerNotificationRead,
  updateNotificationPreferences,
} from '../services/api';
import { useUserStore } from '../store/userStore';

export function useNotifications() {
  const token = useUserStore((state) => state.token);
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchCustomerNotifications,
    enabled: !!token,
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markCustomerNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllCustomerNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useNotificationPreferences() {
  const token = useUserStore((state) => state.token);
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: fetchNotificationPreferences,
    enabled: !!token,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notification-preferences'] }),
  });
}
