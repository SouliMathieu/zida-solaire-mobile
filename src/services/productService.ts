// src/services/productService.ts

import { api } from './api';
import { Product, Category } from '../types';

export const productService = {
  // Récupérer tous les produits
  getProducts: async (params?: {
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<Product[]>('/api/products', { params });
    return response.data;
  },

  // Récupérer un produit par ID
  getProductById: async (id: string) => {
    const response = await api.get<Product>(`/api/products/${id}`);
    return response.data;
  },

  // Récupérer toutes les catégories
  getCategories: async () => {
    const response = await api.get<Category[]>('/api/categories');
    return response.data;
  },

  // Récupérer une catégorie par ID
  getCategoryById: async (id: string) => {
    const response = await api.get<Category>(`/api/categories/${id}`);
    return response.data;
  },

  // Récupérer les produits d'une catégorie
  getProductsByCategory: async (categoryId: string) => {
    const response = await api.get<Product[]>(`/api/categories/${categoryId}/products`);
    return response.data;
  },
};
