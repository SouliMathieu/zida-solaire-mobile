// src/hooks/useAuth.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  customerLogin,
  customerRegister,
  getCustomerProfile,
  RegistrationData,
  requestCustomerPhoneChange,
  updateCustomerProfile,
  verifyCustomerLoginOtp,
  verifyCustomerPhoneChange,
  verifyCustomerRegisterOtp,
} from '../services/api';
import { useUserStore } from '../store/userStore';

export const useRequestLoginOtp = () =>
  useMutation({ mutationFn: (phone: string) => customerLogin(phone) });

export const useVerifyLoginOtp = () => {
  const setUser = useUserStore((state) => state.setUser);
  return useMutation({
    mutationFn: verifyCustomerLoginOtp,
    onSuccess: (data) => setUser(data.user, data.token),
  });
};

export const useRequestRegisterOtp = () =>
  useMutation({ mutationFn: (userData: RegistrationData) => customerRegister(userData) });

export const useVerifyRegisterOtp = () => {
  const setUser = useUserStore((state) => state.setUser);
  return useMutation({
    mutationFn: verifyCustomerRegisterOtp,
    onSuccess: (data) => setUser(data.user, data.token),
  });
};

export const useRequestPhoneChangeOtp = () =>
  useMutation({ mutationFn: (phone: string) => requestCustomerPhoneChange(phone) });

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
    },
  });
};

export const useProfile = () => {
  const token = useUserStore((state) => state.token);
  return useQuery({
    queryKey: ['profile'],
    queryFn: getCustomerProfile,
    enabled: !!token,
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
