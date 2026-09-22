// src/types/index.ts

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number | null;
  categoryId: string;
  category?: Category;
  image: string;
  images?: string[];
  stock: number;
  lowStockThreshold?: number;
  sku?: string;
  warranty?: string;
  weight?: number | null;
  features?: string[];
  specifications?: Record<string, string | number | boolean>;
  isAvailable: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export type OrderStatus =
  | 'EN_ATTENTE'
  | 'CONFIRMEE'
  | 'EN_PREPARATION'
  | 'PRETE'
  | 'EN_LIVRAISON'
  | 'EXPEDIEE'
  | 'LIVREE'
  | 'ANNULEE';

export interface OrderItem {
  productId: string;
  productName: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  phone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
