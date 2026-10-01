// src/hooks/useAuth.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  confirmCustomerPinReset,
  customerLogin,
  customerRegister,
  getCustomerProfile,
  RegistrationData,
  requestCustomerPhoneChange,
  requestCustomerPinReset,
  updateCustomerProfile,
  verifyCustomerPhoneChange,
  verifyCustomerRegistrationEmail,
} from '../services/api';
import { useUserStore } from '../store/userStore';

export const useLoginWithPin = () => {
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: customerLogin,
    onSuccess: (data) => setUser(data.user, data.token),
  });
};

export const useRequestRegistration = () =>
  useMutation({
    mutationFn: (userData: RegistrationData) =>
      customerRegister(userData),
  });

export const useVerifyRegistrationEmail = () => {
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: verifyCustomerRegistrationEmail,
    onSuccess: (data) => setUser(data.user, data.token),
  });
};

export const useRequestPinReset = () =>
  useMutation({
    mutationFn: (identifier: string) =>
      requestCustomerPinReset(identifier),
  });

export const useConfirmPinReset = () =>
  useMutation({
    mutationFn: confirmCustomerPinReset,
  });

export const useRequestPhoneChangeOtp = () =>
  useMutation({
    mutationFn: (phone: string) => requestCustomerPhoneChange(phone),
  });

export const useVerifyPhoneChangeOtp = () => {
  const setUser = useUserStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyCustomerPhoneChange,
    onSuccess: (data) => {
      setUser(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['customer-installations'] });
      queryClient.invalidateQueries({ queryKey: ['customer-repairs'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    },
  });
};

export const useProfile = () => {
  const token = useUserStore((state) => state.token);
  const userId = useUserStore((state) => state.user?.id ?? null);

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: getCustomerProfile,
    enabled: !!token && !!userId,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useUserStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (userData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
    }) => updateCustomerProfile(userData),

    onSuccess: (data) => {
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
