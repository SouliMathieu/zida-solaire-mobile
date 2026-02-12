// src/hooks/useProducts.ts

import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductById, fetchCategories } from '../services/api';
import { USE_MOCK_DATA } from '../constants/config';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../utils/mockData';
import { mapApiProducts, mapApiProductToProduct, mapApiCategories } from '../utils/apiMappers';
import { Product } from '../types';

// Hook pour récupérer tous les produits
export const useProducts = (params?: {
  categoryId?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Mode développement avec données mockées
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredProducts = [...MOCK_PRODUCTS];
        
        if (params?.categoryId) {
          filteredProducts = filteredProducts.filter(
            (p: Product) => p.categoryId === params.categoryId
          );
        }
        
        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredProducts = filteredProducts.filter(
            (p: Product) => p.name.toLowerCase().includes(searchLower) ||
                 p.description.toLowerCase().includes(searchLower)
          );
        }
        
        return filteredProducts;
      }
      
      // Mode production avec API réelle
      const apiProducts = await fetchProducts(params);
      return mapApiProducts(apiProducts);
    },
  });
};

// Hook pour récupérer un produit par ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return MOCK_PRODUCTS.find((p: Product) => p.id === id);
      }
      
      const apiProduct = await fetchProductById(id);
      return apiProduct ? mapApiProductToProduct(apiProduct) : undefined;
    },
    enabled: !!id, // Ne lance la requête que si l'ID existe
  });
};

// Hook pour récupérer toutes les catégories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_CATEGORIES;
      }
      
      const apiCategories = await fetchCategories();
      return mapApiCategories(apiCategories);
    },
  });
};

// Hook pour récupérer une catégorie par ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return MOCK_CATEGORIES.find((c: any) => c.id === id);
      }
      
      const categories = await fetchCategories();
      const apiCategories = mapApiCategories(categories);
      return apiCategories.find((c: any) => c.id === id);
    },
    enabled: !!id,
  });
};