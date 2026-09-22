// src/utils/apiMappers.ts

import { Product, Category, Order } from '../types';
import { ApiProduct, ApiCategory, ApiOrder } from '../types/api-types';

export const mapApiProductToProduct = (apiProduct: ApiProduct): Product => {
  const mainImage = Array.isArray(apiProduct.images) && apiProduct.images.length > 0
    ? apiProduct.images[0]
    : apiProduct.image || 'https://via.placeholder.com/400';

  const categoryId = apiProduct.categoryId || apiProduct.category?.id || '';
  const category = apiProduct.category
    ? {
        id: apiProduct.category.id,
        name: apiProduct.category.name,
        slug: apiProduct.category.slug || '',
        description: apiProduct.category.description || '',
        image: apiProduct.category.image || '',
        productCount: apiProduct.category._count?.products || 0,
      }
    : undefined;

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description || apiProduct.shortDescription || '',
    shortDescription: apiProduct.shortDescription || undefined,
    price: apiProduct.price,
    compareAtPrice: apiProduct.compareAtPrice ?? null,
    image: mainImage,
    images: apiProduct.images || [mainImage],
    categoryId,
    category,
    stock: apiProduct.stock,
    lowStockThreshold: apiProduct.lowStockThreshold,
    sku: apiProduct.sku,
    warranty: apiProduct.warranty || undefined,
    weight: apiProduct.weight ?? null,
    features: apiProduct.features || [],
    specifications: apiProduct.specifications || undefined,
    isAvailable: apiProduct.isAvailable ?? apiProduct.stock > 0,
    isFeatured: apiProduct.isFeatured,
    createdAt: apiProduct.createdAt,
    updatedAt: apiProduct.updatedAt,
  };
};

export const mapApiCategoryToCategory = (apiCategory: ApiCategory): Category => ({
  id: apiCategory.id,
  name: apiCategory.name,
  slug: apiCategory.slug || '',
  description: apiCategory.description || '',
  image: apiCategory.image || '',
  productCount: apiCategory._count?.products || 0,
});

export const mapApiOrderToOrder = (apiOrder: ApiOrder): Order => {
  const statusMap: Record<string, Order['status']> = {
    PENDING: 'EN_ATTENTE',
    CONFIRMED: 'CONFIRMEE',
    PROCESSING: 'EN_PREPARATION',
    SHIPPED: 'EXPEDIEE',
    DELIVERED: 'LIVREE',
    CANCELLED: 'ANNULEE',
  };

  return {
    id: apiOrder.id,
    userId: '1',
    items: apiOrder.items.map((item) => ({
      productId: item.productId,
      productName: item.productName || item.product?.name || '',
      quantity: item.quantity,
      price: item.price,
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

export const mapApiProducts = (apiProducts: ApiProduct[]): Product[] => apiProducts.map(mapApiProductToProduct);
export const mapApiCategories = (apiCategories: ApiCategory[]): Category[] => apiCategories.map(mapApiCategoryToCategory);
export const mapApiOrders = (apiOrders: ApiOrder[]): Order[] => apiOrders.map(mapApiOrderToOrder);
