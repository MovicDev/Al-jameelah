import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  Phone, 
  ChevronDown,
  ArrowRight,
  LogIn,
  UserRound,
  LogOut
} from 'lucide-react';
import { ActiveTab } from '../types';
import { useAuth } from '../auth/AuthContext';
import { shouldShowCart } from '../utils/navigationVisibility';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setSelectedCategory, 
    cartItemCount, 
    setIsCartOpen,
    wishlist,
    settings,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProductId
  } = useApp();
  const { isAuthenticated, isAdmin, profile, openAuth, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const showCart = shouldShowCart({ isAdmin, cartItemCount, isRolePending: isAuthenticated && !profile });
  const signedInName = profile?.full_name?.trim().split(/\s+/)[0] || profile?.email || 'Account';

  const handleNavClick = (tab: ActiveTab, category?: string) => {
    setActiveTab(tab);
    if (category) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserLogout = async () => {
    await logout();
    setActiveTab('home');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered search preview
  const searchResults = searchQuery.trim() 
    ? products.filter(p => 
        p.status !== 'hidden' && 
        (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.category.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F0E6EA] transition-all duration-300">
      {/* Top Announcement Bar
      <div className="bg-[#1C1418] text-[#F9EAE1] px-4 py-2 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E84A7F] animate-pulse"></span>
            <span>{settings.announcementBar}</span>
          </div>
          <div className="flex items-center gap-4 text-xs opacity-90">
            <span className="hidden md:inline-flex items-center gap-1 text-[#E5C384]">
              <Sparkles className="w-3.5 h-3.5" /> 100% Pure Al-jameelah Formulations
            </span>
            <a 
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E84A7F] transition-colors flex items-center gap-1 text-[#F2C0D4]"
            >
              <Phone className="w-3 h-3" /> WhatsApp: {settings.phoneDisplay}
            </a>
          </div>
        </div>
      </div> */}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#2D1B22] hover:text-[#E84A7F] hover:bg-[#FDF2F7] focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button 
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="text-left group flex items-center gap-3 cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E84A7F] via-[#F48FB1] to-[#C89D42] p-[2px] shadow-sm group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <span className="font-serif-display font-bold text-[#E84A7F] text-lg">AJ</span>
                </div>
              </div>
              <div>
                <h1 className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-[#2D1B22] group-hover:text-[#E84A7F] transition-colors">
                  Al-jameelah <span className="font-light text-[#C89D42]">World</span>
                </h1>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C7A82] font-medium -mt-0.5">
                  Natural Hair Care
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <button
              id="nav-home-btn"
              onClick={() => handleNavClick('home')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === 'home' 
                  ? 'text-[#E84A7F] bg-[#FDF2F7] font-semibold' 
                  : 'text-[#4A3E42] hover:text-[#E84A7F] hover:bg-[#FAF7F5]'
              }`}
            >
              Home
            </button>

            {/* Shop with Dropdown */}
            <div className="relative" onMouseLeave={() => setShopDropdownOpen(false)}>
              <button
                id="nav-shop-dropdown-btn"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onClick={() => handleNavClick('shop', 'all')}
                className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-1 transition-all duration-200 ${
                  activeTab === 'shop' || activeTab.startsWith('category-')
                    ? 'text-[#E84A7F] bg-[#FDF2F7] font-semibold' 
                    : 'text-[#4A3E42] hover:text-[#E84A7F] hover:bg-[#FAF7F5]'
                }`}
              >
                <span>Shop</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Dropdown Menu */}
              {shopDropdownOpen && (
                <div 
                  className="absolute left-0 mt-1 w-64 rounded-2xl bg-white shadow-xl border border-[#F0E6EA] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseEnter={() => setShopDropdownOpen(true)}
                >
                  <button
                    onClick={() => handleNavClick('shop', 'all')}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#2D1B22] hover:bg-[#FDF2F7] hover:text-[#E84A7F] font-semibold flex items-center justify-between"
                  >
                    <span>All Products</span>
                    <span className="text-xs bg-[#FAF7F5] px-2 py-0.5 rounded-full text-[#8C7A82]">{products.length}</span>
                  </button>
                  <div className="h-px bg-[#F5ECF0] my-1"></div>
                  <button
                    onClick={() => handleNavClick('shop', 'hair-oils')}
                    className="w-full text-left px-4 py-2 text-sm text-[#4A3E42] hover:bg-[#FDF2F7] hover:text-[#E84A7F] flex items-center gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#E5C384]"></span>
                    <span>Hair Oils & Boosters</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('shop', 'hair-creams')}
                    className="w-full text-left px-4 py-2 text-sm text-[#4A3E42] hover:bg-[#FDF2F7] hover:text-[#E84A7F] flex items-center gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#E84A7F]"></span>
                    <span>Hair Creams & Butters</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('shop', 'hair-care')}
                    className="w-full text-left px-4 py-2 text-sm text-[#4A3E42] hover:bg-[#FDF2F7] hover:text-[#E84A7F] flex items-center gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#8E5D74]"></span>
                    <span>Hair Care & Treatments</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('shop', 'natural-hair')}
                    className="w-full text-left px-4 py-2 text-sm text-[#4A3E42] hover:bg-[#FDF2F7] hover:text-[#E84A7F] flex items-center gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#C89D42]"></span>
                    <span>Natural 4A–4C Essentials</span>
                  </button>
                </div>
              )}
            </div>

            <button
              id="nav-services-btn"
              onClick={() => handleNavClick('services')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === 'services' 
                  ? 'text-[#E84A7F] bg-[#FDF2F7] font-semibold' 
                  : 'text-[#4A3E42] hover:text-[#E84A7F] hover:bg-[#FAF7F5]'
              }`}
            >
              Services
            </button>

            <button
              id="nav-education-btn"
              onClick={() => handleNavClick('education')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === 'education' 
                  ? 'text-[#E84A7F] bg-[#FDF2F7] font-semibold' 
                  : 'text-[#4A3E42] hover:text-[#E84A7F] hover:bg-[#FAF7F5]'
              }`}
            >
              Hair Tips
            </button>

            <button
              id="nav-about-btn"
              onClick={() => handleNavClick('about')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === 'about' 
                  ? 'text-[#E84A7F] bg-[#FDF2F7] font-semibold' 
                  : 'text-[#4A3E42] hover:text-[#E84A7F] hover:bg-[#FAF7F5]'
              }`}
            >
              About
            </button>

            <button
              id="nav-contact-btn"
              onClick={() => handleNavClick('contact')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === 'contact' 
                  ? 'text-[#E84A7F] bg-[#FDF2F7] font-semibold' 
                  : 'text-[#4A3E42] hover:text-[#E84A7F] hover:bg-[#FAF7F5]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action Utilities */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <div className="relative">
              <button
                id="search-toggle-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full text-[#4A3E42] hover:text-[#E84A7F] hover:bg-[#FDF2F7] transition-colors focus:outline-none"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search Modal / Popover */}
              {searchOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#F0E6EA] p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-[#8C7A82] absolute left-3.5" />
                    <input
                      type="text"
                      placeholder="Search growth oil, butter, mask..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full bg-[#FAF7F5] pl-10 pr-8 py-2.5 rounded-2xl text-sm text-[#2D1B22] placeholder:text-[#9C8B93] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/30 border border-[#EFE5EB]"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 text-[#8C7A82] hover:text-[#2D1B22]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Search Results Preview */}
                  {searchQuery.trim() && (
                    <div className="mt-3 divide-y divide-[#F5ECF0] max-h-64 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        searchResults.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => {
                              setSelectedProductId(product.id);
                              setSearchOpen(false);
                            }}
                            className="py-2.5 px-2 flex items-center gap-3 hover:bg-[#FDF2F7] rounded-xl cursor-pointer transition-colors"
                          >
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="w-11 h-11 object-cover rounded-xl border border-[#F0E6EA]"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#2D1B22] truncate">{product.name}</p>
                              <p className="text-[11px] text-[#E84A7F] font-bold">₦{product.price.toLocaleString('en-NG')}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#8C7A82]" />
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center text-xs text-[#8C7A82]">
                          No products found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Account Button */}
            <button
              type="button"
              onClick={() => isAuthenticated ? handleNavClick('profile') : openAuth('login')}
              className={isAuthenticated
                ? 'flex items-center gap-2 rounded-full border border-[#E8DCE2] bg-[#FAF7F5] py-1.5 pl-1.5 pr-3 text-[#4A3E42] transition-colors hover:border-[#F2C0D4] hover:bg-[#FDF2F7]'
                : 'p-2.5 rounded-full text-[#4A3E42] hover:text-[#E84A7F] hover:bg-[#FDF2F7] transition-colors'}
              title={isAuthenticated ? 'My profile' : 'Sign in'}
              aria-label={isAuthenticated ? 'Open my profile' : 'Sign in'}
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
              ) : isAuthenticated ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F2C0D4]/40">
                  <UserRound className="h-4 w-4 text-[#E84A7F]" />
                </span>
              ) : <LogIn className="w-5 h-5" />}
              {isAuthenticated && (
                <span className="hidden min-w-0 flex-col text-left xl:flex">
                  <span className="max-w-24 truncate text-[11px] font-bold text-[#2D1B22]">Hi, {signedInName}</span>
                  <span className="flex items-center gap-1 text-[9px] font-semibold text-[#1E7E34]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" /> Signed in
                  </span>
                </span>
              )}
            </button>

            {isAuthenticated && !isAdmin && (
              <button
                type="button"
                onClick={() => void handleUserLogout()}
                className="hidden rounded-full p-2.5 text-[#8C7A82] transition-colors hover:bg-rose-50 hover:text-rose-600 lg:inline-flex"
                title="Log out"
                aria-label="Log out of your account"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}

            {/* Wishlist Button */}
            <button
              id="wishlist-btn"
              onClick={() => {
                setActiveTab('shop');
                setSelectedCategory('all');
              }}
              className="p-2.5 rounded-full text-[#4A3E42] hover:text-[#E84A7F] hover:bg-[#FDF2F7] transition-colors relative"
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E84A7F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Customer cart: hidden from admins and when empty */}
            {showCart && (
              <button
                id="cart-drawer-trigger-btn"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 bg-[#2D1B22] hover:bg-[#E84A7F] text-white px-4 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md group cursor-pointer"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide hidden sm:inline">Bag</span>
                <span className="bg-[#E84A7F] group-hover:bg-white group-hover:text-[#E84A7F] text-white text-xs font-bold px-1.5 py-0.2 rounded-full min-w-[20px] text-center transition-colors">
                  {cartItemCount}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F0E6EA] bg-white px-5 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium ${
                activeTab === 'home' ? 'bg-[#FDF2F7] text-[#E84A7F] font-bold' : 'text-[#2D1B22]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop', 'all')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium ${
                activeTab === 'shop' ? 'bg-[#FDF2F7] text-[#E84A7F] font-bold' : 'text-[#2D1B22]'
              }`}
            >
              Shop All Products
            </button>

            {/* Category sub-links */}
            <div className="pl-6 space-y-2 border-l-2 border-[#FDF2F7] ml-4 py-1">
              <button
                onClick={() => handleNavClick('shop', 'hair-oils')}
                className="w-full text-left py-1 text-xs text-[#6B5A63] hover:text-[#E84A7F]"
              >
                • Hair Growth Oils & Tonics
              </button>
              <button
                onClick={() => handleNavClick('shop', 'hair-creams')}
                className="w-full text-left py-1 text-xs text-[#6B5A63] hover:text-[#E84A7F]"
              >
                • Whipped Butters & Creams
              </button>
              <button
                onClick={() => handleNavClick('shop', 'hair-care')}
                className="w-full text-left py-1 text-xs text-[#6B5A63] hover:text-[#E84A7F]"
              >
                • Protein Masks & Washes
              </button>
              <button
                onClick={() => handleNavClick('shop', 'natural-hair')}
                className="w-full text-left py-1 text-xs text-[#6B5A63] hover:text-[#E84A7F]"
              >
                • 4A–4C Coils & Edge Care
              </button>
            </div>

            <button
              onClick={() => handleNavClick('services')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium ${
                activeTab === 'services' ? 'bg-[#FDF2F7] text-[#E84A7F] font-bold' : 'text-[#2D1B22]'
              }`}
            >
              Services & Consultations
            </button>

            <button
              onClick={() => handleNavClick('education')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium ${
                activeTab === 'education' ? 'bg-[#FDF2F7] text-[#E84A7F] font-bold' : 'text-[#2D1B22]'
              }`}
            >
              Hair Care Guide
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium ${
                activeTab === 'about' ? 'bg-[#FDF2F7] text-[#E84A7F] font-bold' : 'text-[#2D1B22]'
              }`}
            >
              Our Story
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium ${
                activeTab === 'contact' ? 'bg-[#FDF2F7] text-[#E84A7F] font-bold' : 'text-[#2D1B22]'
              }`}
            >
              Contact Us
            </button>

            <button
              type="button"
              onClick={() => isAuthenticated ? handleNavClick('profile') : openAuth('login')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium ${
                activeTab === 'profile' ? 'bg-[#FDF2F7] text-[#E84A7F] font-bold' : 'text-[#2D1B22]'
              }`}
            >
              {isAuthenticated ? `Signed in as ${signedInName}` : 'Sign In / Register'}
            </button>
            {isAuthenticated && !isAdmin && (
              <button
                type="button"
                onClick={() => void handleUserLogout()}
                className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
