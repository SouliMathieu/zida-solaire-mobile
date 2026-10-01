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
  const userId = useUserStore((state) => state.user?.id ?? null);

  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: fetchCustomerNotifications,
    enabled: !!token && !!userId,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markCustomerNotificationRead,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllCustomerNotificationsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      }),
  });
}

export function useNotificationPreferences() {
  const token = useUserStore((state) => state.token);
  const userId = useUserStore((state) => state.user?.id ?? null);

  return useQuery({
    queryKey: ['notification-preferences', userId],
    queryFn: fetchNotificationPreferences,
    enabled: !!token && !!userId,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['notification-preferences'],
      }),
  });
}
