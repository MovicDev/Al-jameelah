import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';
import { 
  Sparkles, 
  Phone, 
  Mail, 
  Instagram, 
  ShieldCheck, 
  Truck, 
  Lock,
  MapPin
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { 
    setActiveTab, 
    setSelectedCategory, 
    settings,
  } = useApp();
  const { isAdmin, openAuth } = useAuth();

  const openAdminPortal = () => {
    setActiveTab('admin');
    if (!isAdmin) openAuth('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#181215] text-[#E8DCE2] pt-16 pb-12 border-t border-[#2F1F26]">
      {/* Brand Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#2F1F26]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E84A7F]/10 border border-[#E84A7F]/30 flex items-center justify-center flex-shrink-0 text-[#E84A7F]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Pure Al-jameelah</h4>
              <p className="text-xs text-[#9C8B93] mt-0.5">
                Chadian Chebe, cold-pressed oils & raw African Shea.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C89D42]/10 border border-[#C89D42]/30 flex items-center justify-center flex-shrink-0 text-[#C89D42]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Tested on 4A–4C Coils</h4>
              <p className="text-xs text-[#9C8B93] mt-0.5">
                Tailored for low/high porosity, edges & afro textures.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E84A7F]/10 border border-[#E84A7F]/30 flex items-center justify-center flex-shrink-0 text-[#E84A7F]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Nationwide Dispatch</h4>
              <p className="text-xs text-[#9C8B93] mt-0.5">
                Fast doorstep delivery across Lagos, Abuja & 36 States.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#E84A7F] to-[#C89D42] p-[2px]">
                <div className="w-full h-full bg-[#181215] rounded-full flex items-center justify-center">
                  <span className="font-serif-display font-bold text-[#E84A7F] text-base">AJ</span>
                </div>
              </div>
              <span className="font-serif-display text-xl font-bold text-white tracking-wide">
                Al-jameelah <span className="text-[#C89D42] font-light">World</span>
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-[#A8969F] leading-relaxed max-w-sm">
              Healthy Hair. Natural Beauty. Confidence. Premium handcrafted Nigerian natural hair solutions, growth elixirs, and bespoke regimens.
            </p>

          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Shop</h5>
            <ul className="space-y-2 text-xs text-[#A8969F]">
              <li>
                <button 
                  onClick={() => { setActiveTab('shop'); setSelectedCategory('hair-oils'); window.scrollTo(0, 0); }}
                  className="hover:text-[#E84A7F] transition-colors"
                >
                  Hair Growth Oils
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('shop'); setSelectedCategory('hair-creams'); window.scrollTo(0, 0); }}
                  className="hover:text-[#E84A7F] transition-colors"
                >
                  Whipped Hair Butters
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('shop'); setSelectedCategory('hair-care'); window.scrollTo(0, 0); }}
                  className="hover:text-[#E84A7F] transition-colors"
                >
                  Protein Masks & Washes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('shop'); setSelectedCategory('natural-hair'); window.scrollTo(0, 0); }}
                  className="hover:text-[#E84A7F] transition-colors"
                >
                  4A–4C Curl & Edge Care
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('shop'); setSelectedCategory('all'); window.scrollTo(0, 0); }}
                  className="hover:text-[#E84A7F] transition-colors"
                >
                  View All Products
                </button>
              </li>
            </ul>
          </div>

          {/* Services & Hair Tips */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Discover</h5>
            <ul className="space-y-2 text-xs text-[#A8969F]">
              <li>
                <button 
                  onClick={() => { setActiveTab('services'); window.scrollTo(0, 0); }}
                  className="hover:text-[#E84A7F] transition-colors"
                >
                  Hair Consultations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('education'); window.scrollTo(0, 0); }}
                  className="hover:text-[#E84A7F] transition-colors"
                >
                  Moisture Retention Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('education'); window.scrollTo(0, 0); }}
                  className="hover:text-[#E84A7F] transition-colors"
                >
                  Edge Revival Routine
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('about'); window.scrollTo(0, 0); }}
                  className="hover:text-[#E84A7F] transition-colors"
                >
                  About Our Brand
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('contact'); window.scrollTo(0, 0); }}
                  className="hover:text-[#E84A7F] transition-colors"
                >
                  Contact & Delivery
                </button>
              </li>
            </ul>
          </div>

          {/* Official Contact & Socials */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Contact & Location</h5>
            <ul className="space-y-2.5 text-xs text-[#A8969F]">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C89D42] shrink-0" />
                <span className="text-white font-medium">{settings.address || 'Ogbomoso, Oyo State, Nigeria'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E84A7F] shrink-0" />
                <span className="text-white font-medium">{settings.phoneDisplay}</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-[#E84A7F] shrink-0" />
                <span className="text-white">{settings.instagram}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C89D42] shrink-0" />
                <span className="truncate">{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Discreet Staff Login Gateway */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#2F1F26] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7E6C74] gap-4">
        <p>© {new Date().getFullYear()} {settings.brandName}. All rights reserved. Handcrafted in Ogbomoso, Oyo State, Nigeria.</p>
        
        <div className="flex items-center gap-4 text-xs">
          <span>Nigeria (NGN ₦)</span>
          <span>•</span>
          {/* Subtle Staff / Admin Gate Button */}
          <button 
            onClick={openAdminPortal}
            className="hover:text-[#E84A7F] text-[#8C7A82] transition-colors flex items-center gap-1 cursor-pointer"
            title="Store Staff Login"
          >
            <Lock className="w-3 h-3 text-[#C89D42]" />
            <span>{isAdmin ? 'Admin Dashboard' : 'Staff Access'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
