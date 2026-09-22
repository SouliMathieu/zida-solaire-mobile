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

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || 'Client',
    lastName: parts.slice(1).join(' ') || 'ZIDA',
  };
};

export const formsService = {
  submitContact: async (data: ContactFormData) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  submitDevis: async (data: DevisFormData) => {
    const response = await api.post('/devis', data);
    return response.data;
  },

  submitInstallation: async (data: InstallationFormData) => {
    const { firstName, lastName } = splitName(data.name);
    const description = [
      `Type de propriété: ${data.propertyType}`,
      data.roofType ? `Type de toiture: ${data.roofType}` : null,
      data.averageMonthlyBill ? `Facture mensuelle moyenne: ${data.averageMonthlyBill}` : null,
      data.notes ? `Notes: ${data.notes}` : null,
    ].filter(Boolean).join('\n');

    const response = await api.post('/installation-requests', {
      firstName,
      lastName,
      phone: data.phone,
      email: data.email || undefined,
      type: 'SOLAR',
      address: data.address,
      description: description || 'Demande d’installation solaire depuis l’application mobile.',
    });
    return response.data;
  },
};