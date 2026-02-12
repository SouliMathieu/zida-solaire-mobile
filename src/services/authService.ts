// src/services/authService.ts

import { api } from './api';
import { User } from '../types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Connexion
  login: async (data: LoginData) => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  // Inscription
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  // Récupérer le profil de l'utilisateur
  getProfile: async () => {
    const response = await api.get<User>('/api/auth/profile');
    return response.data;
  },

  // Mettre à jour le profil
  updateProfile: async (data: Partial<User>) => {
    const response = await api.patch<User>('/api/auth/profile', data);
    return response.data;
  },
};
