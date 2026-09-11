import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../ProductCard';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  MessageCircle, 
  Droplets,
  ShieldCheck,
  Heart,
  ChevronRight,
  Award
} from 'lucide-react';
import { initialTestimonials } from '../../data/initialData';

export const HomeView: React.FC = () => {
  const { 
    products, 
    setActiveTab, 
    setSelectedCategory, 
    setSelectedProductId, 
    generateGeneralWhatsAppUrl,
    settings 
  } = useApp();

  // Highlighted bestsellers
  const bestSellers = products.filter(p => p.status !== 'hidden' && p.featured).slice(0, 4);
  const displayProducts = bestSellers.length > 0 ? bestSellers : products.filter(p => p.status !== 'hidden').slice(0, 4);

  // Quick 2-Step Hair Routine Matcher
  const [selectedType, setSelectedType] = useState('4c-coils');
  const [selectedGoal, setSelectedGoal] = useState('growth');

  const getRecommendedProducts = () => {
    if (selectedGoal === 'growth') {
      return products.filter(p => p.category === 'hair-oils' || p.slug.includes('growth')).slice(0, 2);
    }
    if (selectedGoal === 'moisture') {
      return products.filter(p => p.category === 'hair-creams' || p.slug.includes('butter')).slice(0, 2);
    }
    return products.filter(p => p.category === 'hair-care' || p.slug.includes('mask')).slice(0, 2);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      
      {/* 1. ULTRA-MODERN HERO BANNER */}
      <section className="relative bg-gradient-to-b from-[#FAF4F7] via-[#FCFBFC] to-white border-b border-[#F0E6EA] pt-8 pb-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Hero Text (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#FDF2F7] border border-[#F2C0D4] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#E84A7F]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Pure Al-jameelah Hair Care</span>
              </div>

              <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#241A1E] leading-[1.12] tracking-tight">
                Nurturing Natural Hair,<br className="hidden sm:inline" />
                <span className="text-[#E84A7F]">From Root to Strand</span>
              </h1>

              <p className="text-sm sm:text-base text-[#6B5861] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Expert hair ebooks, premium Ayurvedic herbs, and curated care products — all secured in your personal library.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 text-xs text-[#4A3E42]">
                <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#EFE5EB] shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C89D42]" /> Cold-Pressed Oils
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#EFE5EB] shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C89D42]" /> Nationwide Delivery
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-shop-btn"
                  onClick={() => {
                    setActiveTab('shop');
                    setSelectedCategory('all');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#E84A7F] hover:bg-[#D42A63] text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-pink-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Shop Bestsellers</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-routine-btn"
                  onClick={() => {
                    const el = document.getElementById('routine-matcher');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-[#FDF2F7] text-[#241A1E] hover:text-[#E84A7F] border border-[#E8DCE2] font-semibold text-sm tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Find Your Hair Routine</span>
                  <Sparkles className="w-4 h-4 text-[#C89D42]" />
                </button>
              </div>

              {/* Customer Rating Proof */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-xs text-[#6B5861]">
                <div className="flex text-[#C89D42]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-medium text-[#241A1E]">
                  Loved by <strong>1,200+ Naturalistas</strong> in Lagos, Abuja & across Nigeria
                </span>
              </div>
            </div>

            {/* Right Hero Visual (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-[#FAF7F5]">
                  <img
                    src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=1000&q=85"
                    alt="Nigerian woman with healthy natural hair"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1418]/70 via-transparent to-transparent"></div>

                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-white/40 shadow-xl flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1608248597359-5407d57c79e6?auto=format&fit=crop&w=200&q=80" 
                      alt="Hair Growth Oil" 
                      className="w-12 h-12 rounded-xl object-cover border border-[#F0E6EA] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#E84A7F] uppercase">#1 Bestseller</span>
                      <h4 className="text-xs font-bold text-[#241A1E] truncate">Tressence Hair Growth Oil</h4>
                      <p className="text-[11px] text-[#C89D42] font-bold">₦7,500</p>
                    </div>
                    <button
                      onClick={() => {
                        const oil = products.find(p => p.id === 'prod-growth-oil');
                        if (oil) setSelectedProductId(oil.id);
                      }}
                      className="p-2 rounded-full bg-[#E84A7F] text-white hover:bg-[#D42A63] transition-colors cursor-pointer"
                      aria-label="View Product"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STREAMLINED CATEGORY QUICK SELECTOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            onClick={() => { setActiveTab('shop'); setSelectedCategory('hair-oils'); window.scrollTo(0, 0); }}
            className="group p-5 rounded-2xl bg-white border border-[#F0E6EA] hover:border-[#E84A7F]/50 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF0DC] text-[#C89D42] flex items-center justify-center mb-3">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#241A1E] group-hover:text-[#E84A7F] transition-colors">
                Hair Growth Oils
              </h3>
              <p className="text-xs text-[#8C7A82] mt-0.5">Scalp tonics & elixirs</p>
            </div>
            <div className="mt-3 flex items-center text-xs font-bold text-[#E84A7F] gap-1">
              <span>Explore</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => { setActiveTab('shop'); setSelectedCategory('hair-creams'); window.scrollTo(0, 0); }}
            className="group p-5 rounded-2xl bg-white border border-[#F0E6EA] hover:border-[#E84A7F]/50 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F7] text-[#E84A7F] flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#241A1E] group-hover:text-[#E84A7F] transition-colors">
                Whipped Butters
              </h3>
              <p className="text-xs text-[#8C7A82] mt-0.5">7-day moisture sealers</p>
            </div>
            <div className="mt-3 flex items-center text-xs font-bold text-[#E84A7F] gap-1">
              <span>Explore</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => { setActiveTab('shop'); setSelectedCategory('hair-care'); window.scrollTo(0, 0); }}
            className="group p-5 rounded-2xl bg-white border border-[#F0E6EA] hover:border-[#E84A7F]/50 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F0EBF5] text-[#7A4988] flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#241A1E] group-hover:text-[#E84A7F] transition-colors">
                Protein & Washes
              </h3>
              <p className="text-xs text-[#8C7A82] mt-0.5">Deep repair & shampoos</p>
            </div>
            <div className="mt-3 flex items-center text-xs font-bold text-[#E84A7F] gap-1">
              <span>Explore</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => { setActiveTab('shop'); setSelectedCategory('natural-hair'); window.scrollTo(0, 0); }}
            className="group p-5 rounded-2xl bg-white border border-[#F0E6EA] hover:border-[#E84A7F]/50 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8F8EE] text-[#25D366] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#241A1E] group-hover:text-[#E84A7F] transition-colors">
                4A–4C Edge & Coils
              </h3>
              <p className="text-xs text-[#8C7A82] mt-0.5">Protective style care</p>
            </div>
            <div className="mt-3 flex items-center text-xs font-bold text-[#E84A7F] gap-1">
              <span>Explore</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. BESTSELLERS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E84A7F]">Customer Holy Grails</span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#241A1E] mt-1">
              Bestselling Formulations
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveTab('shop');
              setSelectedCategory('all');
              window.scrollTo(0, 0);
            }}
            className="text-xs font-bold text-[#E84A7F] hover:text-[#D42A63] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. CLEAN 2-STEP ROUTINE MATCHER */}
      <section id="routine-matcher" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#241A1E] to-[#361F29] rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="items-center">
            {/* Recommended Products Result */}
            <div className="lg:col-span-12 bg-white/5 border border-white/10 p-5 sm:p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-[#E5C384]">Recommended Pairing</span>
                <span className="text-[11px] text-neutral-400">Step 1 & Step 2 Essentials</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getRecommendedProducts().map((prod) => (
                  <div 
                    key={prod.id}
                    onClick={() => setSelectedProductId(prod.id)}
                    className="bg-white text-[#241A1E] p-4 rounded-2xl flex items-center gap-3.5 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <img 
                      src={prod.images[0]} 
                      alt={prod.name} 
                      className="w-14 h-14 object-cover rounded-xl border border-[#F0E6EA] flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#E84A7F] uppercase tracking-wider">
                        {prod.category.replace('-', ' ')}
                      </span>
                      <h4 className="text-xs font-bold text-[#241A1E] truncate">{prod.name}</h4>
                      <p className="text-xs text-[#C89D42] font-bold mt-0.5">₦{prod.price.toLocaleString('en-NG')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-neutral-300">
                  Ready to start your journey? Get direct guidance on WhatsApp.
                </p>
                <a
                  href={generateGeneralWhatsAppUrl(`Hello Al-jameelah! I took the quiz for ${selectedType} focusing on ${selectedGoal}. Please advise me on the best routine.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20b858] text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat With Specialist</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHY AL-JAMEELAH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E84A7F]">The Al-jameelah Standard</span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#241A1E]">
            Pure Ingredients, Real Growth
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#F0E6EA] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F7] text-[#E84A7F] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#241A1E]">Authentic Chadian Chebe</h3>
            <p className="text-xs text-[#6B5861] leading-relaxed">
              Sourced directly from Chad, known for centuries of intense length retention and moisture sealing on dense curls.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#F0E6EA] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0DC] text-[#C89D42] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#241A1E]">Zero Harsh Chemicals</h3>
            <p className="text-xs text-[#6B5861] leading-relaxed">
              No mineral oils, drying alcohols, parabens, or heavy waxes that cause scalp buildup and clogged follicles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#F0E6EA] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F8EE] text-[#25D366] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#241A1E]">Handcrafted in Nigeria</h3>
            <p className="text-xs text-[#6B5861] leading-relaxed">
              Freshly blended in small batches using raw African Shea butter, Jamaican Black Castor oil, and Rosemary distillates.
            </p>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED NIGERIAN CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E84A7F]">Real Experiences</span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#241A1E] mt-1">
              What Nigerian Queens Say
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialTestimonials.slice(0, 3).map((test) => (
            <div key={test.id} className="p-6 rounded-2xl bg-white border border-[#F0E6EA] shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-[#C89D42]">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#4A3E42] italic leading-relaxed">
                  "{test.review}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#F5ECF0]">
                <img 
                  src={test.image} 
                  alt={test.name} 
                  className="w-10 h-10 rounded-full object-cover border border-[#F0E6EA]"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#241A1E]">{test.name}</h4>
                  <p className="text-[11px] text-[#8C7A82]">{test.location} • Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
