import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { HomeView } from './components/views/HomeView';
import { ShopView } from './components/views/ShopView';
import { ServicesView } from './components/views/ServicesView';
import { EducationView } from './components/views/EducationView';
import { AboutView } from './components/views/AboutView';
import { ContactView } from './components/views/ContactView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CheckCircle2, ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AuthModal } from './auth/components/AuthModal';
import { ProfileView } from './auth/components/ProfileView';
import { ProtectedRoute } from './auth/components/ProtectedRoute';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, notification } = useApp();
  const { isAuthenticated, isAdmin, profile, logout, authNotice } = useAuth();
  const toastMessage = notification || authNotice;
  const canUseCustomerCart = !isAdmin && (!isAuthenticated || Boolean(profile));

  const handleLogout = async () => {
    await logout();
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBFC] text-[#241A1E] selection:bg-[#E84A7F] selection:text-white">
      
      {/* Admin Mode Status Banner (Only visible when admin is authenticated) */}
      {isAdmin && (
        <div className="bg-[#2D1B22] text-[#FDF2F7] px-4 py-2 text-xs flex items-center justify-between border-b border-[#C89D42]/30 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#25D366]" />
            <span className="font-semibold text-white">Admin Session Active</span>
            <span className="hidden sm:inline text-neutral-400">• Store Management Mode</span>
          </div>

          <div className="flex items-center gap-3">
            {activeTab !== 'admin' ? (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1 bg-[#E84A7F] hover:bg-[#D42A63] text-white rounded-full font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>Open Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-full font-semibold text-[11px] transition-colors cursor-pointer"
              >
                Preview Storefront
              </button>
            )}

            <button
              onClick={() => void handleLogout()}
              className="text-neutral-400 hover:text-rose-300 flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
              title="End Admin Session"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Global Navigation */}
      <Navbar />

      {/* Main Page View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeView />}
        {(activeTab === 'shop' || activeTab.startsWith('category-')) && <ShopView />}
        {activeTab === 'services' && <ServicesView />}
        {activeTab === 'education' && <EducationView />}
        {activeTab === 'about' && <AboutView />}
        {activeTab === 'contact' && <ContactView />}
        {activeTab === 'profile' && <ProtectedRoute><ProfileView /></ProtectedRoute>}
        {activeTab.startsWith('admin') && <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Modals & Overlays */}
      <ProductDetailModal />
      {canUseCustomerCart && <CartDrawer />}
      <AuthModal />
      <FloatingWhatsApp />

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#2D1B22] text-white px-5 py-3 rounded-full shadow-2xl border border-[#C89D42]/40 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
