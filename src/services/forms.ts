// src/services/forms.ts

import api from './api';

export interface ContactFormData {
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  message: string;
}

export interface DevisFormData {
  name: string;
  email?: string;
  phone: string;
  address: string;
  systemType: string;
  estimatedBudget?: string;
  message?: string;
}

export interface InstallationFormData {
  name: string;
  email?: string;
  phone: string;
  address: string;
  propertyType: string;
  roofType?: string;
  averageMonthlyBill?: string;
  notes?: string;
}

export const formsService = {
  // Contact
  submitContact: async (data: ContactFormData) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  // Devis
  submitDevis: async (data: DevisFormData) => {
    const response = await api.post('/devis', data);
    return response.data;
  },

  // Installation
  submitInstallation: async (data: InstallationFormData) => {
    const response = await api.post('/installation-requests', data);
    return response.data;
  },
};