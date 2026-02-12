// src/utils/apiMappers.ts

import { Product, Category, Order } from '../types';
import { ApiProduct, ApiCategory, ApiOrder } from '../types/api-types';

/**
 * Convertit un produit API en produit de l'application
 */
export const mapApiProductToProduct = (apiProduct: ApiProduct): Product => {
    // L'API retourne images comme array, on prend la première image
    const mainImage = Array.isArray(apiProduct.images) && apiProduct.images.length > 0
      ? apiProduct.images[0]
      : apiProduct.image || 'https://via.placeholder.com/400';
  
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      description: apiProduct.description,
      price: apiProduct.price,
      image: mainImage,
      images: apiProduct.images || [mainImage],
      categoryId: apiProduct.categoryId,
      stock: apiProduct.stock,
      features: apiProduct.features || [],
      isAvailable: apiProduct.isAvailable,
      createdAt: apiProduct.createdAt,
      updatedAt: apiProduct.updatedAt,
    };
  };
/**
 * Convertit une catégorie API en catégorie de l'application
 */
export const mapApiCategoryToCategory = (apiCategory: ApiCategory): Category => {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    slug: apiCategory.slug, // Ajouté
    description: apiCategory.description || '',
    image: apiCategory.image || '',
    productCount: apiCategory._count?.products || 0,
  };
};

/**
 * Convertit une commande API en commande de l'application
 */
export const mapApiOrderToOrder = (apiOrder: ApiOrder): Order => {
  // Mapper le statut de l'API Next.js vers le statut de l'app mobile
  const statusMap: Record<string, Order['status']> = {
    'PENDING': 'EN_ATTENTE',
    'CONFIRMED': 'CONFIRMEE',
    'PROCESSING': 'EN_PREPARATION',
    'SHIPPED': 'EXPEDIEE',
    'DELIVERED': 'LIVREE',
    'CANCELLED': 'ANNULEE',
  };

  return {
    id: apiOrder.id,
    userId: '1', // Peut être ajusté selon votre système d'authentification
    items: apiOrder.items.map(item => ({
      productId: item.productId,
      productName: item.productName || item.product?.name || '',
      quantity: item.quantity,
      price: item.price,
      unitPrice: item.price, // Prix unitaire
      totalPrice: item.price * item.quantity, // Prix total pour cet item
    })),
    totalAmount: apiOrder.totalAmount,
    status: statusMap[apiOrder.status] || 'EN_ATTENTE',
    deliveryAddress: apiOrder.deliveryAddress,
    phone: apiOrder.customerPhone,
    notes: apiOrder.notes,
    createdAt: apiOrder.createdAt,
    updatedAt: apiOrder.updatedAt,
  };
};

/**
 * Convertit un tableau de produits API
 */
export const mapApiProducts = (apiProducts: ApiProduct[]): Product[] => {
  return apiProducts.map(mapApiProductToProduct);
};

/**
 * Convertit un tableau de catégories API
 */
export const mapApiCategories = (apiCategories: ApiCategory[]): Category[] => {
  return apiCategories.map(mapApiCategoryToCategory);
};

/**
 * Convertit un tableau de commandes API
 */
export const mapApiOrders = (apiOrders: ApiOrder[]): Order[] => {
  return apiOrders.map(mapApiOrderToOrder);
};