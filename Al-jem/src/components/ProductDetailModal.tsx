import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShoppingBag, 
  MessageCircle, 
  Heart, 
  Star, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Plus, 
  Minus, 
  Layers, 
  Droplet, 
  Share2,
  PackageX
} from 'lucide-react';
import { isProductOutOfStock } from '../utils/productAvailability';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductId, 
    setSelectedProductId, 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    generateProductWhatsAppUrl,
    showNotification 
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'howToUse' | 'hairTypes'>('benefits');

  const product = products.find((p) => p.id === selectedProductId);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = isProductOutOfStock(product);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const effectivePrice = product.discountPrice ?? product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setSelectedProductId(null);
  };

  const handleWhatsAppCheckout = () => {
    const url = generateProductWhatsAppUrl(product, quantity);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} — Al-jameelah World`,
        text: product.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Product link copied to clipboard!');
    }
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.status !== 'hidden' && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#F0E6EA] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductId(null)}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white text-[#2D1B22] rounded-full shadow-md transition-colors"
          aria-label="Close Product Details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* Left: Product Images Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF7F5] border border-[#F0E6EA] relative">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {product.featured && (
                <span className="absolute top-3 left-3 bg-[#2D1B22] text-[#F9EAE1] text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C89D42]" /> 100% Authentic Nigerian Formula
                </span>
              )}

              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white text-[#2D1B22] font-bold text-sm px-4 py-2 rounded-full shadow-lg uppercase tracking-wider">
                    Currently Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#E84A7F] ring-2 ring-[#E84A7F]/30 scale-105'
                        : 'border-[#F0E6EA] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees */}
            <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-[#F0E6EA] space-y-2 text-xs text-[#4A3E42]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C89D42]" />
                <span>Doorstep delivery across all 36 Nigerian states.</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E84A7F]" />
                <span>100% Pure & Unadulterated Al-jameelah Formulas.</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C89D42] bg-[#FAF7F5] px-3 py-1 rounded-full border border-[#F0E6EA]">
                  {product.category.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 rounded-full border transition-colors ${
                      isFavorited
                        ? 'bg-[#FDF2F7] border-[#F2C0D4] text-[#E84A7F]'
                        : 'border-[#E8DCE2] text-[#8C7A82] hover:text-[#E84A7F]'
                    }`}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full border border-[#E8DCE2] text-[#8C7A82] hover:text-[#2D1B22] transition-colors"
                    aria-label="Share Product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Size */}
              <div>
                <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2D1B22]">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs font-medium text-[#8C7A82]">Volume / Size: <strong>{product.size}</strong></span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-xs text-[#2D1B22] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-[#C89D42] text-[#C89D42]" />
                    <span>{product.rating}</span>
                    <span className="text-[#8C7A82] font-normal">({product.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Price & Stock Status */}
              <div className="flex items-baseline gap-3 p-3 bg-[#FAF7F5] rounded-2xl border border-[#F0E6EA]">
                <span className="font-serif-display text-2xl sm:text-3xl font-bold text-[#E84A7F]">
                  ₦{effectivePrice.toLocaleString('en-NG')}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-[#8C7A82] line-through">
                    ₦{product.price.toLocaleString('en-NG')}
                  </span>
                )}
                <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${
                  isOutOfStock ? 'bg-neutral-200 text-neutral-600' : 'bg-[#E8F8EE] text-[#1E7E34]'
                }`}>
                  {isOutOfStock ? 'Out of Stock' : 'In Stock • Ready to Dispatch'}
                </span>
              </div>

              {isOutOfStock && (
                <div role="status" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-800">
                  <PackageX className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold">This product is currently out of stock</p>
                    <p className="mt-0.5 text-[11px] text-rose-700">Ordering is unavailable until the product is restocked.</p>
                  </div>
                </div>
              )}

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#4A3E42] leading-relaxed">
                {product.description}
              </p>

              {/* Tabs Section */}
              <div className="pt-2">
                <div className="flex border-b border-[#F0E6EA] gap-4 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('benefits')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'benefits' ? 'border-[#E84A7F] text-[#E84A7F]' : 'border-transparent text-[#8C7A82] hover:text-[#2D1B22]'
                    }`}
                  >
                    Key Benefits
                  </button>
                  <button
                    onClick={() => setActiveTab('ingredients')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'ingredients' ? 'border-[#E84A7F] text-[#E84A7F]' : 'border-transparent text-[#8C7A82] hover:text-[#2D1B22]'
                    }`}
                  >
                    100% Natural Ingredients
                  </button>
                  <button
                    onClick={() => setActiveTab('howToUse')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'howToUse' ? 'border-[#E84A7F] text-[#E84A7F]' : 'border-transparent text-[#8C7A82] hover:text-[#2D1B22]'
                    }`}
                  >
                    How To Use
                  </button>
                  <button
                    onClick={() => setActiveTab('hairTypes')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'hairTypes' ? 'border-[#E84A7F] text-[#E84A7F]' : 'border-transparent text-[#8C7A82] hover:text-[#2D1B22]'
                    }`}
                  >
                    Hair Types
                  </button>
                </div>

                <div className="py-3 text-xs text-[#4A3E42]">
                  {activeTab === 'benefits' && (
                    <ul className="space-y-1.5">
                      {product.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#E84A7F] flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'ingredients' && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-[#8C7A82] italic">
                        100% Free from Sulfates, Parabens, Mineral Oil, Silicones, and Synthetic Fragrances.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {product.ingredients.map((ing, i) => (
                          <span key={i} className="bg-[#FAF7F5] border border-[#F0E6EA] px-2.5 py-1 rounded-lg text-[11px]">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'howToUse' && (
                    <p className="leading-relaxed bg-[#FAF7F5] p-3 rounded-xl border border-[#F0E6EA]">
                      {product.howToUse}
                    </p>
                  )}

                  {activeTab === 'hairTypes' && (
                    <div className="flex flex-wrap gap-1.5">
                      {product.hairTypes.map((type, i) => (
                        <span key={i} className="bg-[#FDF2F7] text-[#2D1B22] border border-[#F2C0D4] px-2.5 py-1 rounded-full text-[11px] font-medium">
                          ✓ {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity & Dual Purchase CTAs */}
            <div className="space-y-4 pt-4 border-t border-[#F0E6EA]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2D1B22]">Quantity:</span>
                <div className="flex items-center border border-[#E8DCE2] rounded-xl bg-[#FAF7F5]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="p-2 text-[#6B5A63] hover:text-[#2D1B22] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-[#2D1B22]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock}
                    className="p-2 text-[#6B5A63] hover:text-[#2D1B22] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#8C7A82] block">Subtotal:</span>
                  <span className="font-bold text-sm text-[#2D1B22]">₦{(effectivePrice * quantity).toLocaleString('en-NG')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`py-3 px-4 rounded-full font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      : 'bg-[#2D1B22] hover:bg-[#E84A7F] text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
                </button>

                <button
                  onClick={handleWhatsAppCheckout}
                  disabled={isOutOfStock}
                  className={`py-3 px-4 rounded-full font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      : 'bg-[#25D366] hover:bg-[#20b858] text-white shadow-md hover:shadow-green-500/30'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Instant WhatsApp Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="bg-[#FAF7F5] p-6 sm:p-8 border-t border-[#F0E6EA] rounded-b-3xl">
            <h4 className="font-serif-display font-bold text-base text-[#2D1B22] mb-4">
              Pairs Perfectly With
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    setSelectedProductId(rel.id);
                    setSelectedImageIndex(0);
                  }}
                  className="bg-white p-3 rounded-2xl border border-[#F0E6EA] hover:border-[#E84A7F]/40 flex items-center gap-3 cursor-pointer group transition-all"
                >
                  <img src={rel.images[0]} alt={rel.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#2D1B22] group-hover:text-[#E84A7F] truncate">{rel.name}</p>
                    <p className="text-xs text-[#E84A7F] font-bold">₦{(rel.discountPrice ?? rel.price).toLocaleString('en-NG')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
