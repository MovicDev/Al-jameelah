import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  Sparkles, 
  ShoppingBag, 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Users, 
  DollarSign, 
  MessageCircle, 
  Clock, 
  RotateCcw,
  Search,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Lock,
  LogOut,
  KeyRound,
  Upload
} from 'lucide-react';
import { Product, Service, StockStatus, ProductStatus, LoggedOrder } from '../../types';
import { ProductEditorModal, ServiceEditorModal } from './AdminEditorModals';
import { useAuth } from '../../auth/AuthContext';
import { getDiscountPriceError } from '../../api/productPayload';
import { listRegisteredUsers } from '../../api/userApi';
import type { Profile } from '../../auth/types';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    services, 
    addService, 
    updateService, 
    deleteService, 
    orders, 
    updateOrderStatus, 
    settings, 
    updateSettings, 
    resetDefaultProducts,
    showNotification,
    setActiveTab,
  } = useApp();
  const { logout } = useAuth();

  const [activeAdminTab, setActiveAdminTab] = useState<'products' | 'services' | 'orders' | 'customers' | 'settings'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<Profile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');

  useEffect(() => {
    let active = true;
    void listRegisteredUsers()
      .then((users) => {
        if (active) setRegisteredUsers(users);
      })
      .catch((error) => {
        if (active) setUsersError(error instanceof Error ? error.message : 'Registered customers could not be loaded.');
      })
      .finally(() => {
        if (active) setUsersLoading(false);
      });
    return () => { active = false; };
  }, []);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    name: '',
    slug: '',
    category: 'hair-oils',
    price: 5000,
    discountPrice: undefined,
    size: '100ml',
    shortDescription: '',
    description: '',
    benefits: [],
    ingredients: ['Chebe extract', 'Argan oil', 'Castor oil'],
    howToUse: '',
    hairTypes: [],
    stock: 50,
    stockStatus: 'in_stock',
    status: 'available',
    featured: false,
    images: ['https://images.unsplash.com/photo-1608248597359-5407d57c79e6?auto=format&fit=crop&w=600&q=80'],
    rating: 5.0,
    reviewCount: 12,
    sku: 'AJ-NEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<Omit<Service, 'id'>>({
    name: '',
    slug: '',
    duration: '45 mins',
    price: 15000,
    description: '',
    deliverable: '1-on-1 WhatsApp Consultation + Regimen PDF',
    benefits: ['Deep scalp analysis', 'Custom growth plan'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    popular: false,
    available: true,
  });

  // Settings State
  const [tempSettings, setTempSettings] = useState(settings);
  useEffect(() => setTempSettings(settings), [settings]);

  // Open modal to add product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      slug: '',
      category: 'hair-oils',
      price: 6000,
      discountPrice: undefined,
      size: '100ml',
      shortDescription: '',
      description: '',
      benefits: [],
      ingredients: ['Shea Butter', 'Castor Oil'],
      howToUse: '',
      hairTypes: [],
      stock: 50,
      stockStatus: 'in_stock',
      status: 'available',
      featured: false,
      images: ['https://images.unsplash.com/photo-1608248597359-5407d57c79e6?auto=format&fit=crop&w=600&q=80'],
      rating: 5.0,
      reviewCount: 10,
      sku: `AJ-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsProductModalOpen(true);
  };

  // Open modal to edit product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    setIsProductModalOpen(true);
  };

  // Save product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) return;

    const discountPriceError = getDiscountPriceError(productForm.price, productForm.discountPrice);
    if (discountPriceError) {
      showNotification(discountPriceError);
      return;
    }

    const finalImages = productForm.images && productForm.images.length > 0
      ? productForm.images
      : ['https://images.unsplash.com/photo-1608248597359-5407d57c79e6?auto=format&fit=crop&w=600&q=80'];

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, { ...productForm, images: finalImages });
      } else {
        await addProduct({
          ...productForm,
          images: finalImages,
          slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        });
      }
      setIsProductModalOpen(false);
    } catch (error) {
      console.error(error);
      showNotification('The product could not be saved. Check the form and try again.');
    }
  };

  // Open service modal
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      slug: '',
      duration: '45 mins',
      price: 15000,
      description: '',
      deliverable: '1-on-1 WhatsApp Session + Hair Plan',
      benefits: ['Scalp evaluation', 'Personalized schedule'],
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      popular: false,
      available: true,
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (srv: Service) => {
    setEditingService(srv);
    setServiceForm({ ...srv });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name) return;

    try {
      if (editingService) {
        await updateService(editingService.id, serviceForm);
      } else {
        await addService({
          ...serviceForm,
          slug: serviceForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        });
      }
      setIsServiceModalOpen(false);
    } catch (error) {
      console.error(error);
      showNotification('The service could not be saved. Check the form and try again.');
    }
  };

  // Filtered product inventory
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner */}
      <div className="bg-[#2D1B22] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-[#3B252E]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]"></span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#E5C384]">Admin Control Hub</span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold">
            Al-jameelah World Manager
          </h1>
          <p className="text-xs text-[#D8C6CE]">
            Real-time management for dynamic products, services, WhatsApp orders, and business parameters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('shop')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Preview Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset all products and services back to initial defaults?')) {
                void resetDefaultProducts().catch(() => showNotification('The catalog could not be reset.'));
              }
            }}
            className="px-4 py-2 bg-[#E84A7F]/20 hover:bg-[#E84A7F]/30 text-[#F9EAE1] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#E84A7F]/40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
          <button
            onClick={() => void logout().then(() => setActiveTab('home'))}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-500/30"
            title="Log out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#F0E6EA] shadow-xs space-y-1">
          <span className="text-xs text-[#8C7A82] flex items-center gap-1">
            <Package className="w-4 h-4 text-[#E84A7F]" /> Products Catalog
          </span>
          <p className="font-serif-display font-bold text-2xl text-[#2D1B22]">{products.length}</p>
          <p className="text-[11px] text-[#1E7E34]">{products.filter(p => p.stockStatus === 'in_stock').length} Active in Stock</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0E6EA] shadow-xs space-y-1">
          <span className="text-xs text-[#8C7A82] flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-[#C89D42]" /> Services Listed
          </span>
          <p className="font-serif-display font-bold text-2xl text-[#2D1B22]">{services.length}</p>
          <p className="text-[11px] text-[#8C7A82]">{services.filter(s => s.available).length} Open for Booking</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0E6EA] shadow-xs space-y-1">
          <span className="text-xs text-[#8C7A82] flex items-center gap-1">
            <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp Orders
          </span>
          <p className="font-serif-display font-bold text-2xl text-[#2D1B22]">{orders.length}</p>
          <p className="text-[11px] text-[#8C7A82]">{orders.filter(o => o.status === 'whatsapp_sent').length} Pending Dispatch</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0E6EA] shadow-xs space-y-1">
          <span className="text-xs text-[#8C7A82] flex items-center gap-1">
            <Users className="w-4 h-4 text-[#8E5D74]" /> Registered Customers
          </span>
          <p className="font-serif-display font-bold text-2xl text-[#2D1B22]">{registeredUsers.length}</p>
          <p className="text-[11px] text-[#8C7A82]">Customer accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0E6EA] shadow-xs space-y-1">
          <span className="text-xs text-[#8C7A82] flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-[#E84A7F]" /> Orders Pipeline (₦)
          </span>
          <p className="font-serif-display font-bold text-xl sm:text-2xl text-[#E84A7F]">
            ₦{orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString('en-NG')}
          </p>
          <p className="text-[11px] text-[#8C7A82]">Generated via WhatsApp</p>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-[#E8DCE2] gap-6 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveAdminTab('products')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeAdminTab === 'products' ? 'border-[#E84A7F] text-[#E84A7F]' : 'border-transparent text-[#8C7A82] hover:text-[#2D1B22]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('services')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeAdminTab === 'services' ? 'border-[#E84A7F] text-[#E84A7F]' : 'border-transparent text-[#8C7A82] hover:text-[#2D1B22]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Services ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`flex-shrink-0 pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeAdminTab === 'orders' ? 'border-[#E84A7F] text-[#E84A7F]' : 'border-transparent text-[#8C7A82] hover:text-[#2D1B22]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>WhatsApp Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('customers')}
          className={`flex-shrink-0 pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeAdminTab === 'customers' ? 'border-[#E84A7F] text-[#E84A7F]' : 'border-transparent text-[#8C7A82] hover:text-[#2D1B22]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customers ({registeredUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeAdminTab === 'settings' ? 'border-[#E84A7F] text-[#E84A7F]' : 'border-transparent text-[#8C7A82] hover:text-[#2D1B22]'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Store Settings</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS INVENTORY */}
      {activeAdminTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8C7A82] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-white border border-[#E8DCE2] rounded-xl pl-9 pr-4 py-2 text-xs text-[#2D1B22] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/40"
              />
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#E84A7F] hover:bg-[#D42A63] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-[#F0E6EA] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F5] border-b border-[#F0E6EA] text-[#6B5A63] uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (NGN)</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5ECF0] text-[#2D1B22]">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#FAF7F5]/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 rounded-xl object-cover border border-[#F0E6EA]" />
                          <div>
                            <p className="font-bold text-xs">{prod.name}</p>
                            <p className="text-[11px] text-[#8C7A82]">{prod.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize bg-[#FAF7F5] px-2.5 py-1 rounded-full border border-[#F0E6EA] text-[11px]">
                          {prod.category.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold">₦{prod.price.toLocaleString('en-NG')}</span>
                        {prod.discountPrice && (
                          <span className="text-[10px] text-[#8C7A82] block line-through">
                            ₦{prod.discountPrice.toLocaleString('en-NG')}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            const nextStatus: StockStatus = prod.stockStatus === 'in_stock' ? 'out_of_stock' : 'in_stock';
                            void updateProduct(prod.id, { stockStatus: nextStatus, status: nextStatus === 'out_of_stock' ? 'out_of_stock' : 'available' });
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            prod.stockStatus === 'in_stock'
                              ? 'bg-[#E8F8EE] text-[#1E7E34]'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {prod.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-2 text-[#6B5A63] hover:text-[#2D1B22] hover:bg-[#FAF7F5] rounded-xl transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${prod.name}"?`)) {
                                void deleteProduct(prod.id).catch(() => showNotification('The product could not be deleted.'));
                              }
                            }}
                            className="p-2 text-[#9C8B93] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES MANAGEMENT */}
      {activeAdminTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display font-bold text-xl text-[#2D1B22]">Services & Hair Consultations</h3>
            <button
              onClick={handleOpenAddService}
              className="px-5 py-2.5 bg-[#E84A7F] hover:bg-[#D42A63] text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((srv) => (
              <div key={srv.id} className="bg-white rounded-3xl border border-[#F0E6EA] p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-4">
                  <img src={srv.image} alt={srv.name} className="w-20 h-20 rounded-2xl object-cover border border-[#F0E6EA]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#2D1B22] truncate">{srv.name}</h4>
                      <span className="text-xs font-bold text-[#E84A7F]">₦{srv.price.toLocaleString('en-NG')}</span>
                    </div>
                    <p className="text-xs text-[#8C7A82] mt-0.5">Duration: {srv.duration}</p>
                    <p className="text-xs text-[#6B5A63] line-clamp-2 mt-2">{srv.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#F5ECF0]">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    srv.available ? 'bg-[#E8F8EE] text-[#1E7E34]' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {srv.available ? 'Available' : 'Paused'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditService(srv)}
                      className="px-3 py-1.5 bg-[#FAF7F5] hover:bg-[#FDF2F7] text-xs font-semibold rounded-lg text-[#2D1B22] hover:text-[#E84A7F]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete service "${srv.name}"?`)) {
                          void deleteService(srv.id).catch(() => showNotification('The service could not be deleted.'));
                        }
                      }}
                      className="p-1.5 text-[#9C8B93] hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WHATSAPP ORDERS LOG */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-serif-display font-bold text-xl text-[#2D1B22]">WhatsApp Checkout Orders Log</h3>
            <p className="text-xs text-[#8C7A82] mt-0.5">
              Logged automatically whenever a customer proceeds through the WhatsApp checkout drawer.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#F0E6EA] space-y-3">
              <ShoppingBag className="w-12 h-12 text-[#8C7A82] mx-auto opacity-50" />
              <h4 className="font-bold text-sm text-[#2D1B22]">No Orders Logged Yet</h4>
              <p className="text-xs text-[#8C7A82]">
                Orders initiated by shoppers will appear here in real-time with full customer and product breakdowns.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl border border-[#F0E6EA] p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5ECF0] pb-4">
                    <div>
                      <span className="font-bold text-sm text-[#2D1B22]">Order #{order.orderNumber}</span>
                      <span className="text-xs text-[#8C7A82] block">{new Date(order.createdAt).toLocaleString('en-NG')}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-serif-display font-bold text-lg text-[#E84A7F]">
                        ₦{order.totalAmount.toLocaleString('en-NG')}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as LoggedOrder['status'])}
                        className="bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-1 text-xs text-[#2D1B22] font-semibold"
                      >
                        <option value="whatsapp_sent">WhatsApp Sent</option>
                        <option value="contacted">Contacted</option>
                        <option value="processing">Processing Dispatch</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#4A3E42] bg-[#FAF7F5] p-4 rounded-2xl border border-[#F0E6EA]">
                    <div>
                      <span className="text-[#8C7A82] block text-[10px] uppercase font-bold">Customer:</span>
                      <p className="font-semibold text-[#2D1B22]">{order.customerInfo.customerName || 'Direct Shopper'}</p>
                      <p>{order.customerInfo.customerPhone}</p>
                    </div>
                    <div>
                      <span className="text-[#8C7A82] block text-[10px] uppercase font-bold">Delivery Destination:</span>
                      <p className="font-semibold text-[#2D1B22]">{order.customerInfo.deliveryCityState || 'Lagos, Nigeria'}</p>
                      <p>{order.customerInfo.deliveryAddress}</p>
                    </div>
                    <div>
                      <span className="text-[#8C7A82] block text-[10px] uppercase font-bold">Notes:</span>
                      <p className="italic">{order.customerInfo.notes || 'No special requests'}</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-[#2D1B22]">Items in Order:</span>
                    <ul className="divide-y divide-[#F5ECF0]">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="py-2 flex items-center justify-between">
                          <span>{item.quantity}x {item.productName} ({item.size})</span>
                          <span className="font-semibold text-[#2D1B22]">
                            ₦{(item.price * item.quantity).toLocaleString('en-NG')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: REGISTERED CUSTOMERS */}
      {activeAdminTab === 'customers' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-serif-display font-bold text-xl text-[#2D1B22]">Registered Customers</h3>
            <p className="text-xs text-[#8C7A82] mt-0.5">Names, email addresses, and phone numbers supplied during registration.</p>
          </div>

          {usersError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">{usersError}</div>
          )}

          <div className="overflow-hidden rounded-3xl border border-[#F0E6EA] bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="border-b border-[#F0E6EA] bg-[#FAF7F5] text-[10px] font-semibold uppercase tracking-wider text-[#6B5A63]">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone Number</th>
                    <th className="p-4">Registered</th>
                    <th className="p-4">Account</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5ECF0] text-[#2D1B22]">
                  {usersLoading ? (
                    <tr><td colSpan={5} className="p-10 text-center text-[#8C7A82]">Loading registered customers…</td></tr>
                  ) : registeredUsers.length === 0 ? (
                    <tr><td colSpan={5} className="p-10 text-center text-[#8C7A82]">No customer has registered yet.</td></tr>
                  ) : registeredUsers.map((customer) => (
                    <tr key={customer.id} className="transition-colors hover:bg-[#FAF7F5]/70">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {customer.avatar_url ? (
                            <img src={customer.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDF2F7] font-serif-display font-bold text-[#E84A7F]">
                              {customer.full_name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span className="font-bold">{customer.full_name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[#6B5A63]">{customer.email}</td>
                      <td className="p-4 font-medium">{customer.phone || 'Not provided'}</td>
                      <td className="p-4 text-[#6B5A63]">{new Date(customer.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="p-4"><span className="rounded-full bg-[#E8F8EE] px-2.5 py-1 text-[10px] font-bold text-[#1E7E34]">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STORE & WHATSAPP SETTINGS */}
      {activeAdminTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F0E6EA] shadow-xs space-y-6 max-w-3xl">
          <div>
            <h3 className="font-serif-display font-bold text-2xl text-[#2D1B22]">Store & WhatsApp Integration</h3>
            <p className="text-xs text-[#8C7A82] mt-1">
              Configure your official Nigerian phone number, Instagram handle, and delivery dispatch details.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void updateSettings(tempSettings).catch(() => showNotification('Store configuration could not be updated.'));
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-bold text-[#4A3E42] mb-1">Brand Name</label>
              <input
                type="text"
                value={tempSettings.brandName}
                onChange={(e) => setTempSettings({ ...tempSettings, brandName: e.target.value })}
                className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-4 py-2.5 text-[#2D1B22]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#4A3E42] mb-1">Official WhatsApp Phone (With +234) *</label>
                <input
                  type="text"
                  value={tempSettings.whatsappNumber}
                  onChange={(e) => setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })}
                  className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-4 py-2.5 text-[#2D1B22]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3E42] mb-1">Display Call Hotline</label>
                <input
                  type="text"
                  value={tempSettings.phoneDisplay}
                  onChange={(e) => setTempSettings({ ...tempSettings, phoneDisplay: e.target.value })}
                  className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-4 py-2.5 text-[#2D1B22]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#4A3E42] mb-1">Instagram Handle</label>
                <input
                  type="text"
                  value={tempSettings.instagram}
                  onChange={(e) => setTempSettings({ ...tempSettings, instagram: e.target.value })}
                  className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-4 py-2.5 text-[#2D1B22]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3E42] mb-1">Support Email</label>
                <input
                  type="email"
                  value={tempSettings.email}
                  onChange={(e) => setTempSettings({ ...tempSettings, email: e.target.value })}
                  className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-4 py-2.5 text-[#2D1B22]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#4A3E42] mb-1">Dispatch Location / Address</label>
              <input
                type="text"
                value={tempSettings.address}
                onChange={(e) => setTempSettings({ ...tempSettings, address: e.target.value })}
                className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-4 py-2.5 text-[#2D1B22]"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-[#E84A7F] hover:bg-[#D42A63] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              Save Store Settings
            </button>
          </form>
        </div>
      )}

      <ProductEditorModal
        open={isProductModalOpen}
        editing={Boolean(editingProduct)}
        value={productForm}
        onChange={setProductForm}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={(event) => void handleSaveProduct(event)}
      />
      <ServiceEditorModal
        open={isServiceModalOpen}
        editing={Boolean(editingService)}
        value={serviceForm}
        onChange={setServiceForm}
        onClose={() => setIsServiceModalOpen(false)}
        onSubmit={(event) => void handleSaveService(event)}
      />

    </div>
  );
};
