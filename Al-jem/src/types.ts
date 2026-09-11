export type ProductCategory = 'hair-oils' | 'hair-creams' | 'hair-care' | 'natural-hair';

export type ProductStatus = 'available' | 'out_of_stock' | 'hidden';
export type StockStatus = 'in_stock' | 'out_of_stock' | 'low_stock';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'whatsapp_sent';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  stockStatus?: StockStatus;
  status: ProductStatus;
  featured: boolean;
  size: string;
  description: string;
  shortDescription: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string;
  hairTypes: string[];
  rating: number;
  reviewCount: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration: string;
  description: string;
  benefits: string[];
  image: string;
  available: boolean;
  deliverable: string;
  popular?: boolean;
}

export interface AdminSettings {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  phoneDisplay: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  shippingNotice: string;
  announcementBar: string;
  currencySymbol: string;
  currencyCode: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface CustomerOrderInfo {
  customerName: string;
  customerPhone: string;
  deliveryCityState: string;
  deliveryAddress: string;
  notes?: string;
}

export interface LoggedOrder {
  id: string;
  orderNumber: string;
  customerInfo: CustomerOrderInfo;
  items: {
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  subtotal: number;
  totalAmount: number;
  status: 'whatsapp_sent' | 'contacted' | 'processing' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface EducationPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string[];
  author: string;
  publishedDate: string;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  hairJourney: string;
  productUsed: string;
  image: string;
  verified: boolean;
  date: string;
}

export type ActiveTab = 
  | 'home'
  | 'shop'
  | 'category-hair-oils'
  | 'category-hair-creams'
  | 'category-hair-care'
  | 'category-natural-hair'
  | 'services'
  | 'education'
  | 'about'
  | 'contact'
  | 'profile'
  | 'product-detail'
  | 'admin'
  | 'admin-products'
  | 'admin-services'
  | 'admin-orders'
  | 'admin-settings';
