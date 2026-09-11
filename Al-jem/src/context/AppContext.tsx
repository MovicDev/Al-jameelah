import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, Service, AdminSettings, CartItem, CustomerOrderInfo, LoggedOrder, ActiveTab, ProductStatus } from '../types';
import { initialAdminSettings, initialProducts, initialServices } from '../data/initialData';
import { useAuth } from '../auth/AuthContext';
import * as productApi from '../api/productApi';
import * as serviceApi from '../api/serviceApi';
import * as settingsApi from '../api/settingsApi';
import * as orderApi from '../api/orderApi';
import { isProductOutOfStock } from '../utils/productAvailability';

interface AppContextType {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
  selectedPostId: string | null;
  setSelectedPostId: (id: string | null) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductStatus: (id: string, status: ProductStatus) => Promise<void>;
  toggleProductFeatured: (id: string) => Promise<void>;
  resetDefaultProducts: () => Promise<void>;

  // Services
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, updates: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceAvailability: (id: string) => Promise<void>;

  // Settings
  settings: AdminSettings;
  updateSettings: (newSettings: Partial<AdminSettings>) => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: LoggedOrder[];
  logWhatsAppOrder: (customerInfo: CustomerOrderInfo) => Promise<LoggedOrder>;
  updateOrderStatus: (orderId: string, status: LoggedOrder['status']) => Promise<void>;

  // WhatsApp helpers
  getCleanWhatsAppNumber: () => string;
  generateCheckoutWhatsAppUrl: (customerInfo?: CustomerOrderInfo, order?: LoggedOrder) => string;
  generateProductWhatsAppUrl: (product: Product, quantity?: number, size?: string) => string;
  generateServiceWhatsAppUrl: (service: Service) => string;
  generateGeneralWhatsAppUrl: (customMessage?: string) => string;

  // Notifications
  notification: string | null;
  showNotification: (msg: string) => void;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'aljameelah_cart_v1',
  WISHLIST: 'aljameelah_wishlist_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  // Navigation state
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(initialAdminSettings);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<LoggedOrder[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to persist wishlist', e);
    }
  }, [wishlist]);

  useEffect(() => {
    let active = true;
    void Promise.all([productApi.listProducts(), serviceApi.listServices(), settingsApi.getSettings()])
      .then(([savedProducts, savedServices, savedSettings]) => {
        if (!active) return;
        setProducts(savedProducts);
        setServices(savedServices);
        if (savedSettings) setSettings({ ...initialAdminSettings, ...savedSettings });
      })
      .catch((error) => console.error('Failed to load MongoDB catalog data', error));
    return () => { active = false; };
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) { setOrders([]); return; }
    void orderApi.listOrders()
      .then(setOrders)
      .catch((error) => console.error('Failed to load MongoDB orders', error));
  }, [isAdmin]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Product CRUD
  const addProduct = async (newProd: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const product = await productApi.createProduct(newProd);
    setProducts((current) => [product, ...current]);
    showNotification(`Product "${product.name}" added successfully!`);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const saved = await productApi.updateProduct(id, updates);
    setProducts((current) => current.map((product) => product.id === id ? saved : product));
    setCart((prev) =>
      prev.map((item) => item.product.id === id ? { ...item, product: saved } : item)
    );
    showNotification('Product updated successfully');
  };

  const deleteProduct = async (id: string) => {
    await productApi.deleteProduct(id);
    setProducts((current) => current.filter((product) => product.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    showNotification('Product deleted from catalog');
  };

  const toggleProductStatus = (id: string, status: ProductStatus) => updateProduct(id, { status });

  const toggleProductFeatured = async (id: string) => {
    const product = products.find((candidate) => candidate.id === id);
    if (product) await updateProduct(id, { featured: !product.featured });
  };

  const resetDefaultProducts = async () => {
    await Promise.all([...products.map((product) => productApi.deleteProduct(product.id)), ...services.map((service) => serviceApi.deleteService(service.id))]);
    const [savedProducts, savedServices, savedSettings] = await Promise.all([
      Promise.all(initialProducts.map(({ id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...product }) => productApi.createProduct(product))),
      Promise.all(initialServices.map(({ id: _id, ...service }) => serviceApi.createService(service))),
      settingsApi.updateSettings(initialAdminSettings),
    ]);
    setProducts(savedProducts);
    setServices(savedServices);
    setSettings(savedSettings);
    showNotification('Catalog reset to initial products and services.');
  };

  // Service CRUD
  const addService = async (newServ: Omit<Service, 'id'>) => {
    const service = await serviceApi.createService(newServ);
    setServices((current) => [service, ...current]);
    showNotification(`Service "${service.name}" added!`);
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    const saved = await serviceApi.updateService(id, updates);
    setServices((current) => current.map((service) => service.id === id ? saved : service));
    showNotification('Service updated');
  };

  const deleteService = async (id: string) => {
    await serviceApi.deleteService(id);
    setServices((current) => current.filter((service) => service.id !== id));
    showNotification('Service removed');
  };

  const toggleServiceAvailability = async (id: string) => {
    const service = services.find((candidate) => candidate.id === id);
    if (service) await updateService(id, { available: !service.available });
  };

  const updateSettings = async (newSettings: Partial<AdminSettings>) => {
    const saved = await settingsApi.updateSettings(newSettings);
    setSettings((current) => ({ ...current, ...saved }));
    showNotification('Settings saved successfully!');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    const size = selectedSize || product.size || 'Standard';
    if (isProductOutOfStock(product)) {
      showNotification(`"${product.name}" is currently out of stock.`);
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prev, { product, quantity, selectedSize: size }];
      }
    });

    showNotification(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: string, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && (selectedSize ? item.selectedSize === selectedSize : true))
      )
    );
  };

  const updateCartQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && (selectedSize ? item.selectedSize === selectedSize : true)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => {
    const effectivePrice = item.product.discountPrice ?? item.product.price;
    return total + effectivePrice * item.quantity;
  }, 0);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showNotification('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showNotification('Saved to your wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // WhatsApp URL helpers
  const getCleanWhatsAppNumber = () => {
    // Strip +, spaces, dashes, brackets
    let cleaned = settings.whatsappNumber.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '234' + cleaned.slice(1);
    }
    return cleaned || '2347083807419';
  };

  const formatPrice = (price: number) => `₦${price.toLocaleString('en-NG')}`;

  const logWhatsAppOrder = async (customerInfo: CustomerOrderInfo): Promise<LoggedOrder> => {
    const order = await orderApi.createOrder({
      customerInfo,
      items: cart.map((item) => ({
        productId: item.product.id,
        size: item.selectedSize,
        quantity: item.quantity,
      })),
    });
    setOrders((previous) => [order, ...previous]);
    return order;
  };

  const updateOrderStatus = async (orderId: string, status: LoggedOrder['status']) => {
    const previousOrder = orders.find((order) => order.id === orderId);
    setOrders((previous) => previous.map((order) => order.id === orderId ? { ...order, status } : order));
    try {
      const savedOrder = await orderApi.updateOrderStatus(orderId, status);
      setOrders((previous) => previous.map((order) => order.id === orderId ? savedOrder : order));
      showNotification('Order status updated');
    } catch (error) {
      console.error('Failed to update MongoDB order', error);
      if (previousOrder) setOrders((previous) => previous.map((order) => order.id === orderId ? previousOrder : order));
      showNotification('The order status could not be saved.');
    }
  };

  const generateCheckoutWhatsAppUrl = (customerInfo?: CustomerOrderInfo, order?: LoggedOrder) => {
    const num = getCleanWhatsAppNumber();
    const checkoutItems = order?.items ?? cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      size: item.selectedSize,
      quantity: item.quantity,
      price: item.product.discountPrice ?? item.product.price,
      image: item.product.images[0] ?? '',
    }));
    if (checkoutItems.length === 0) {
      return `https://wa.me/${num}?text=${encodeURIComponent(
        'Hello Al-jameelah World 👋\n\nI would like to make an enquiry about your natural hair products.'
      )}`;
    }

    let itemsText = '';
    checkoutItems.forEach((item, index) => {
      const sub = item.price * item.quantity;
      itemsText += `${index + 1}. ${item.productName} — ${item.size}\n   Quantity: ${item.quantity}\n   Price: ${formatPrice(sub)}\n\n`;
    });

    let customerDetailsText = '';
    const checkoutCustomer = order?.customerInfo ?? customerInfo;
    if (checkoutCustomer?.customerName) {
      customerDetailsText = `\n👤 Customer Details:\n• Name: ${checkoutCustomer.customerName}\n• Phone: ${checkoutCustomer.customerPhone}\n• Location: ${checkoutCustomer.deliveryCityState}\n${
        checkoutCustomer.deliveryAddress ? `• Address: ${checkoutCustomer.deliveryAddress}\n` : ''
      }${checkoutCustomer.notes ? `• Special Notes: ${checkoutCustomer.notes}\n` : ''}`;
    }

    const message = `Hello Al-jameelah World 👋

I would like to place an order.
${customerDetailsText}
🛍️ Selected Products:
${itemsText}Total: ${formatPrice(order?.totalAmount ?? cartTotal)}

Please assist me with my order confirmation and delivery schedule.

Thank you.`;

    return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  };

  const generateProductWhatsAppUrl = (product: Product, quantity = 1, size?: string) => {
    const num = getCleanWhatsAppNumber();
    const chosenSize = size || product.size;
    const effectivePrice = (product.discountPrice ?? product.price) * quantity;

    const message = `Hello Al-jameelah World 👋

I would like to order:
• Product: ${product.name} (${chosenSize})
• Quantity: ${quantity}
• Total Price: ${formatPrice(effectivePrice)}

Please confirm product availability and doorstep delivery fee to my location.

Thank you.`;

    return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  };

  const generateServiceWhatsAppUrl = (service: Service) => {
    const num = getCleanWhatsAppNumber();
    const message = `Hello Al-jameelah World 👋

I am interested in booking a hair care service.

💇‍♀️ Service:
• ${service.name} (${formatPrice(service.price)})
• Duration: ${service.duration}
• Delivery format: ${service.deliverable}

I would like to know more about available dates, time slots, and booking requirements.

Thank you.`;

    return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  };

  const generateGeneralWhatsAppUrl = (customMessage?: string) => {
    const num = getCleanWhatsAppNumber();
    const defaultMsg = 'Hello Al-jameelah World 👋\n\nI would like to make an enquiry about your natural hair products and services.';
    const message = customMessage || defaultMsg;
    return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        selectedProductId,
        setSelectedProductId,
        selectedServiceId,
        setSelectedServiceId,
        selectedPostId,
        setSelectedPostId,
        searchQuery,
        setSearchQuery,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        toggleProductFeatured,
        resetDefaultProducts,
        services,
        addService,
        updateService,
        deleteService,
        toggleServiceAvailability,
        settings,
        updateSettings,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        logWhatsAppOrder,
        updateOrderStatus,
        getCleanWhatsAppNumber,
        generateCheckoutWhatsAppUrl,
        generateProductWhatsAppUrl,
        generateServiceWhatsAppUrl,
        generateGeneralWhatsAppUrl,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
