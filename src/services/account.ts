import api from './api';

export async function deleteCustomerAccount() {
  const response = await api.delete('/customer/delete-account');
  return response.data;
}
