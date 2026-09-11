import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../ProductCard';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Grid, 
  ListFilter, 
  ArrowUpDown, 
  X, 
  Check, 
  Tag 
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { isProductOutOfStock } from '../../utils/productAvailability';

export const ShopView: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery 
  } = useApp();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedConcern, setSelectedConcern] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const categories: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Products', count: products.filter(p => p.status !== 'hidden').length },
    { id: 'hair-oils', label: 'Hair Oils & Tonics', count: products.filter(p => p.category === 'hair-oils' && p.status !== 'hidden').length },
    { id: 'hair-creams', label: 'Whipped Butters & Creams', count: products.filter(p => p.category === 'hair-creams' && p.status !== 'hidden').length },
    { id: 'hair-care', label: 'Protein Masks & Shampoos', count: products.filter(p => p.category === 'hair-care' && p.status !== 'hidden').length },
    { id: 'natural-hair', label: '4A–4C Essentials', count: products.filter(p => p.category === 'natural-hair' && p.status !== 'hidden').length },
  ];

  const concerns = [
    { id: 'all', label: 'All Concerns' },
    { id: 'growth', label: 'Hair Growth & Edges' },
    { id: 'moisture', label: 'Deep Moisture & Softness' },
    { id: 'breakage', label: 'Breakage & Shedding' },
    { id: 'scalp', label: 'Scalp Detox & Dandruff' },
  ];

  // Filter and sort products dynamically
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status === 'hidden') return false;
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (inStockOnly && isProductOutOfStock(p)) return false;
        
        if (selectedConcern !== 'all') {
          const text = (p.name + ' ' + p.description + ' ' + p.shortDescription + ' ' + p.benefits.join(' ')).toLowerCase();
          if (selectedConcern === 'growth' && !text.includes('growth') && !text.includes('edge')) return false;
          if (selectedConcern === 'moisture' && !text.includes('moisture') && !text.includes('butter') && !text.includes('soft')) return false;
          if (selectedConcern === 'breakage' && !text.includes('breakage') && !text.includes('protein') && !text.includes('strengthen')) return false;
          if (selectedConcern === 'scalp' && !text.includes('scalp') && !text.includes('shampoo') && !text.includes('tonic') && !text.includes('itch')) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches = p.name.toLowerCase().includes(q) || 
                          p.shortDescription.toLowerCase().includes(q) ||
                          p.category.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        if (sortBy === 'price-asc') return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
        if (sortBy === 'price-desc') return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, selectedConcern, inStockOnly, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2D1B22] via-[#4A2536] to-[#2D1B22] rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E84A7F]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 max-w-xl z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E5C384] bg-white/10 px-3 py-1 rounded-full border border-white/10">
            Official Al-jameelah Store
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold">
            Natural Hair Formulations
          </h1>
          <p className="text-xs sm:text-sm text-[#D8C6CE] leading-relaxed">
            100% natural boosters, whipped butters, and salon-grade restorative treatments designed to nourish, strengthen, and support Nigerian 4A–4C natural hair.
          </p>
        </div>

        {/* WhatsApp Direct Ordering Notice */}
       
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-[#E84A7F] text-white shadow-md'
                  : 'bg-white text-[#4A3E42] hover:bg-[#FAF7F5] border border-[#E8DCE2]'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#FAF7F5] text-[#8C7A82]'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Secondary Filter Controls: Search, Concern, Sort, In-Stock */}
        <div className="space-y-4 rounded-2xl border border-[#F0E6EA] bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(240px,1fr)_auto] lg:items-center">
            <div className="relative min-w-0">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C7A82]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-xl border border-[#E8DCE2] bg-[#FAF7F5] py-2.5 pl-10 pr-9 text-xs text-[#2D1B22] outline-none transition focus:border-[#E84A7F]/50 focus:ring-2 focus:ring-[#E84A7F]/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#8C7A82] hover:bg-white hover:text-[#2D1B22]"
                  aria-label="Clear product search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-center">
              <label className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-xl border border-[#E8DCE2] bg-[#FAF7F5] px-3 text-xs font-medium text-[#4A3E42]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(event) => setInStockOnly(event.target.checked)}
                  className="h-4 w-4 rounded border-[#D6C5CD] text-[#E84A7F] focus:ring-[#E84A7F]"
                />
                <span className="whitespace-nowrap">In-stock products only</span>
              </label>

              <div className="flex min-h-10 items-center gap-2 rounded-xl border border-[#E8DCE2] bg-[#FAF7F5] px-3">
                <ArrowUpDown className="h-3.5 w-3.5 flex-shrink-0 text-[#8C7A82]" />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                  className="min-w-0 flex-1 bg-transparent py-2 text-xs text-[#2D1B22] outline-none"
                  aria-label="Sort products"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 border-t border-[#F5ECF0] pt-4 sm:flex-row sm:items-start">
            <span className="pt-2 text-[11px] font-bold uppercase tracking-wider text-[#8C7A82] sm:w-28 sm:flex-shrink-0">Hair concern</span>
            <div className="flex min-w-0 flex-wrap gap-2">
              {concerns.map((concern) => (
                <button
                  key={concern.id}
                  onClick={() => setSelectedConcern(concern.id)}
                  className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-[11px] font-semibold transition-all ${
                    selectedConcern === concern.id
                      ? 'border-[#2D1B22] bg-[#2D1B22] text-white shadow-sm'
                      : 'border-[#E8DCE2] bg-[#FAF7F5] text-[#6B5A63] hover:border-[#F2C0D4] hover:bg-[#FDF2F7] hover:text-[#E84A7F]'
                  }`}
                >
                  {concern.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-[#F0E6EA] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F5] text-[#9C8B93] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif-display font-bold text-xl text-[#2D1B22]">No products found</h3>
          <p className="text-xs text-[#8C7A82] max-w-sm mx-auto">
            Try adjusting your search keywords, hair concern filters, or clearing the in-stock restriction.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedConcern('all');
              setSearchQuery('');
              setInStockOnly(false);
            }}
            className="px-6 py-2.5 bg-[#E84A7F] text-white text-xs font-semibold rounded-full hover:bg-[#D42A63] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
