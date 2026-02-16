// src/hooks/useForms.ts

import { useMutation } from '@tanstack/react-query';
import { formsService, ContactFormData, DevisFormData, InstallationFormData } from '../services/forms';

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (data: ContactFormData) => formsService.submitContact(data),
  });
};

export const useSubmitDevis = () => {
  return useMutation({
    mutationFn: (data: DevisFormData) => formsService.submitDevis(data),
  });
};

export const useSubmitInstallation = () => {
  return useMutation({
    mutationFn: (data: InstallationFormData) => formsService.submitInstallation(data),
  });
};