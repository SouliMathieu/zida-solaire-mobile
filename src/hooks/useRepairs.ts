import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCustomerRepairRequests } from '../services/api';
import { useUserStore } from '../store/userStore';

export type RepairTicket = {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  installationType?: string | null;
  problemDescription: string;
  urgency: string;
  installedByZida: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export function useCustomerRepairs() {
  const authenticated = useUserStore((state) => state.isAuthenticated());

  return useQuery<RepairTicket[]>({
    queryKey: ['customer-repairs'],
    queryFn: fetchCustomerRepairRequests,
    enabled: authenticated,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useRefreshCustomerRepairs() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['customer-repairs'] });
}
