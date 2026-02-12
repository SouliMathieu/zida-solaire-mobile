// src/types/api-types.ts

// Types de réponse de l'API Next.js

export interface ApiProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    image?: string; // Optionnel maintenant
    images?: string[]; // Ajouté - c'est ce que l'API retourne
    stock: number;
    categoryId: string;
    features?: string[];
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    category?: ApiCategory;
  }
  
  export interface ApiCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
    // Relations
    products?: ApiProduct[];
    _count?: {
      products: number;
    };
  }
  
  export interface ApiOrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    productName?: string;
    // Relations
    product?: ApiProduct;
  }
  
  export interface ApiOrder {
    id: string;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    deliveryAddress: string;
    totalAmount: number;
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
    paymentMethod: string;
    notes?: string;
    trackingNumber?: string;
    createdAt: string;
    updatedAt: string;
    // Relations
    items: ApiOrderItem[];
  }
  
  export interface ApiInstallationRequest {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    propertyType: string;
    roofType?: string;
    averageMonthlyBill?: number;
    notes?: string;
    status: 'PENDING' | 'CONTACTED' | 'VISITED' | 'QUOTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ApiDevis {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    systemType: string;
    estimatedBudget?: string;
    message?: string;
    status: 'PENDING' | 'SENT' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ApiContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'UNREAD' | 'READ' | 'REPLIED';
    createdAt: string;
    updatedAt: string;
  }
  
  // Types pour les requêtes
  export interface CreateOrderRequest {
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    deliveryAddress: string;
    paymentMethod: string;
    notes?: string;
  }
  
  export interface CreateInstallationRequest {
    name: string;
    email: string;
    phone: string;
    address: string;
    propertyType: string;
    roofType?: string;
    averageMonthlyBill?: number;
    notes?: string;
  }
  
  export interface CreateDevisRequest {
    name: string;
    email: string;
    phone: string;
    address: string;
    systemType: string;
    estimatedBudget?: string;
    message?: string;
  }
  
  export interface CreateContactRequest {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }