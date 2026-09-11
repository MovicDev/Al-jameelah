import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, MessageCircle, Star, Sparkles, ArrowUpRight, PackageX } from 'lucide-react';
import { isProductOutOfStock } from '../utils/productAvailability';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    setSelectedProductId, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    generateProductWhatsAppUrl 
  } = useApp();

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = isProductOutOfStock(product);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateProductWhatsAppUrl(product, 1);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      onClick={() => setSelectedProductId(product.id)}
      className="group relative bg-white rounded-3xl border border-[#F0E6EA] hover:border-[#E84A7F]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/5] w-full bg-[#FAF7F5] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="inline-flex items-center gap-1 bg-[#2D1B22] text-[#F9EAE1] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3 text-[#C89D42]" /> Bestseller
            </span>
          )}
          {hasDiscount && (
            <span className="inline-block bg-[#E84A7F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Save ₦{(product.price - (product.discountPrice || 0)).toLocaleString('en-NG')}
            </span>
          )}
          {isOutOfStock && (
            <span className="inline-block bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleFav}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors z-10 ${
            isFavorited 
              ? 'bg-[#E84A7F] text-white' 
              : 'bg-white/80 text-[#6B5A63] hover:text-[#E84A7F] hover:bg-white'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Size tag */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[11px] font-medium text-[#4A3E42] px-2.5 py-1 rounded-lg border border-[#F0E6EA]">
          {product.size}
        </div>

        {/* Quick View Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <span className="bg-white text-[#2D1B22] text-xs font-semibold px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform flex items-center gap-1.5">
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#E84A7F]" />
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#8C7A82] mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[#C89D42]">
              {product.category.replace('-', ' ')}
            </span>
            <div className="flex items-center gap-1 text-[#2D1B22] font-semibold">
              <Star className="w-3 h-3 fill-[#C89D42] text-[#C89D42]" />
              <span>{product.rating}</span>
              <span className="text-[#9C8B93] font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif-display font-bold text-base text-[#2D1B22] group-hover:text-[#E84A7F] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#6B5A63] mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
          {isOutOfStock && (
            <div role="status" className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">
              <PackageX className="h-4 w-4 flex-shrink-0" />
              <span>Currently unavailable — please check back soon.</span>
            </div>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-4 pt-4 border-t border-[#F5ECF0] space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#2D1B22] font-serif-display">
              ₦{(product.discountPrice ?? product.price).toLocaleString('en-NG')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#9C8B93] line-through font-normal">
                ₦{product.price.toLocaleString('en-NG')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`py-2 px-3 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                isOutOfStock
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-[#FAF7F5] hover:bg-[#FDF2F7] text-[#2D1B22] hover:text-[#E84A7F] border border-[#E8DCE2]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
            </button>

            <button
              onClick={handleWhatsAppOrder}
              disabled={isOutOfStock}
              className={`py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                isOutOfStock
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-[#25D366] hover:bg-[#20b858] text-white hover:shadow-md'
              }`}
              title="Order this product directly on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
