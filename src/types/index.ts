// src/types/index.ts

// Catégorie de produit
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
  productCount?: number; // Ajouté pour la compatibilité avec l'API
}

// Produit
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: Category;
  image: string; // Changé de images[] à image pour correspondre à l'API
  images?: string[]; // Gardé pour compatibilité si nécessaire
  stock: number;
  features?: string[]; // Ajouté pour correspondre à l'API
  specifications?: Record<string, string>;
  isAvailable: boolean; // Ajouté pour correspondre à l'API
  createdAt?: string; // Rendu optionnel
  updatedAt?: string; // Rendu optionnel
}

// Article du panier
export interface CartItem {
  product: Product;
  quantity: number;
}

// Utilisateur
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

// Statut de commande
export type OrderStatus = 
  | 'EN_ATTENTE'
  | 'CONFIRMEE'
  | 'EN_PREPARATION'
  | 'PRETE'
  | 'EN_LIVRAISON'
  | 'EXPEDIEE' // Ajouté pour correspondre à l'API
  | 'LIVREE'
  | 'ANNULEE';

// Article de commande
// Article de commande
export interface OrderItem {
  productId: string;
  productName: string;
  product?: Product;
  quantity: number;
  price: number;
}

// Commande
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