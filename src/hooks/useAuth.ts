// src/hooks/useAuth.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerLogin, customerRegister, getCustomerProfile, updateCustomerProfile } from '../services/api';
import { useUserStore } from '../store/userStore';

export const useLogin = () => {
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (phone: string) => {
      const data = await customerLogin(phone);
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user, data.token);
    },
  });
};

export const useRegister = () => {
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (userData: {
      firstName: string;
      lastName: string;
      email?: string;
      phone: string;
      address?: string;
      city?: string;
    }) => {
      const data = await customerRegister(userData);
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user, data.token);
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
    }) => {
      const data = await updateCustomerProfile(userData);
      return data;
    },
    onSuccess: (data) => {
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};