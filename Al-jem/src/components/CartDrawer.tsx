import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CustomerOrderInfo } from '../types';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    cartTotal,
    cartItemCount,
    generateCheckoutWhatsAppUrl,
    logWhatsAppOrder,
    showNotification,
    setActiveTab,
    settings
  } = useApp();

  const [customerInfo, setCustomerInfo] = useState<CustomerOrderInfo>({
    customerName: '',
    customerPhone: '',
    deliveryCityState: '',
    deliveryAddress: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState('');

  if (!isCartOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    const whatsappWindow = window.open('about:blank', '_blank');
    if (whatsappWindow) whatsappWindow.opener = null;

    try {
      // 1. Log the order into Admin state
      const logged = await logWhatsAppOrder(customerInfo);
      setCompletedOrderNumber(logged.orderNumber);

      // 2. Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E84A7F', '#C89D42', '#FDF2F7', '#FFD1E3']
      });

      // 3. Generate WhatsApp checkout URL
      const whatsappUrl = generateCheckoutWhatsAppUrl(customerInfo, logged);

      // 4. Open WhatsApp directly in new window
      if (whatsappWindow) whatsappWindow.location.replace(whatsappUrl);
      else window.location.assign(whatsappUrl);

      // 5. Show confirmation dialog
      setOrderSuccessModal(true);
      showNotification('WhatsApp order prepared! Connecting you with Al-jameelah World...');
    } catch (err) {
      whatsappWindow?.close();
      console.error(err);
      showNotification('Could not prepare WhatsApp order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#F0E6EA]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#F0E6EA] flex items-center justify-between bg-[#FAF7F5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDF2F7] border border-[#F2C0D4] flex items-center justify-center text-[#E84A7F]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-display font-bold text-lg text-[#2D1B22]">Your Shopping Bag</h3>
                <p className="text-xs text-[#8C7A82]">{cartItemCount} item{cartItemCount === 1 ? '' : 's'} selected</p>
              </div>
            </div>
            <button 
              id="close-cart-drawer-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#8C7A82] hover:text-[#2D1B22] hover:bg-white rounded-full transition-colors"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#FAF7F5] border border-[#F0E6EA] mx-auto flex items-center justify-center text-[#9C8B93]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif-display font-bold text-lg text-[#2D1B22]">Your bag is empty</h4>
                <p className="text-xs text-[#8C7A82] max-w-xs mx-auto leading-relaxed">
                  Discover our 100% natural hair growth boosters, whipped butters, and restorative herbal masks.
                </p>
                <button
                  id="browse-products-btn"
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveTab('shop');
                  }}
                  className="inline-flex items-center gap-2 bg-[#E84A7F] hover:bg-[#D42A63] text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-md"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Free Shipping / Nigerian Delivery Notice */}
                <div className="bg-[#FAF7F5] border border-[#F0E6EA] rounded-2xl p-3.5 flex items-center gap-3 text-xs text-[#4A3E42]">
                  <Truck className="w-5 h-5 text-[#C89D42] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#2D1B22]">Nationwide Doorstep Delivery</p>
                    <p className="text-[11px] text-[#8C7A82]">Lagos, Abuja, PH, Ibadan & all 36 States in Nigeria.</p>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-[#F5ECF0] space-y-4">
                  {cart.map((item) => {
                    const price = item.product.discountPrice ?? item.product.price;
                    const subtotal = price * item.quantity;

                    return (
                      <div key={`${item.product.id}-${item.selectedSize}`} className="pt-4 first:pt-0 flex gap-4">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-xl border border-[#F0E6EA] flex-shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="text-xs sm:text-sm font-semibold text-[#2D1B22] line-clamp-1">{item.product.name}</h5>
                              <span className="inline-block text-[10px] bg-[#FAF7F5] text-[#8C7A82] px-2 py-0.5 rounded-full mt-0.5 border border-[#F0E6EA]">
                                Size: {item.selectedSize}
                              </span>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                              className="text-[#9C8B93] hover:text-[#E84A7F] p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-[#E8DCE2] rounded-lg bg-white">
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                                className="p-1.5 text-[#6B5A63] hover:text-[#2D1B22] hover:bg-[#FAF7F5] rounded-l-lg transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 text-xs font-bold text-[#2D1B22]">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                                className="p-1.5 text-[#6B5A63] hover:text-[#2D1B22] hover:bg-[#FAF7F5] rounded-r-lg transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right">
                              <span className="text-xs sm:text-sm font-bold text-[#E84A7F]">
                                ₦{subtotal.toLocaleString('en-NG')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Information Form */}
                <form id="whatsapp-checkout-form" onSubmit={handleCheckout} className="bg-[#FAF7F5] p-4 rounded-2xl border border-[#F0E6EA] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2D1B22]">
                      Delivery Details for WhatsApp
                    </span>
                    <span className="text-[10px] text-[#8C7A82]">Fast 1-Step Order</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#4A3E42] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amina Bello"
                      value={customerInfo.customerName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, customerName: e.target.value })}
                      className="w-full bg-white border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-[#4A3E42] mb-1">WhatsApp Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="080... or 070..."
                        value={customerInfo.customerPhone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, customerPhone: e.target.value })}
                        className="w-full bg-white border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#4A3E42] mb-1">City / State *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lekki, Lagos"
                        value={customerInfo.deliveryCityState}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryCityState: e.target.value })}
                        className="w-full bg-white border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#4A3E42] mb-1">Street Address (Optional)</label>
                    <input
                      type="text"
                      placeholder="House address or landmark for dispatch"
                      value={customerInfo.deliveryAddress}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryAddress: e.target.value })}
                      className="w-full bg-white border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#4A3E42] mb-1">Hair Notes or Questions (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. My hair has severe breakage on edges"
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      className="w-full bg-white border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/40"
                    />
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#F0E6EA] bg-white space-y-4">
              <div className="space-y-1.5 text-xs text-[#6B5A63]">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-[#2D1B22]">₦{cartTotal.toLocaleString('en-NG')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Doorstep Delivery Fee</span>
                  <span className="text-[#E84A7F] font-medium">Calculated on WhatsApp</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2D1B22] pt-2 border-t border-[#F5ECF0]">
                  <span>Total Payable:</span>
                  <span className="text-[#E84A7F] font-serif-display text-lg">₦{cartTotal.toLocaleString('en-NG')}</span>
                </div>
              </div>

              <button
                id="submit-whatsapp-order-btn"
                type="submit"
                form="whatsapp-checkout-form"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-98"
              >
                <span>Complete Order on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C7A82]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C89D42]" />
                <span>Official WhatsApp: {settings.whatsappNumber}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {orderSuccessModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-[#F0E6EA]">
            <div className="w-16 h-16 rounded-full bg-[#E8F8EE] text-[#25D366] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-display text-xl font-bold text-[#2D1B22]">Order Prepared!</h3>
            <p className="text-xs text-[#6B5A63] leading-relaxed">
              Your order <strong>#{completedOrderNumber}</strong> with <strong>{cart.length} item(s)</strong> has been pre-filled and sent to Al-jameelah World on WhatsApp.
            </p>
            <div className="bg-[#FAF7F5] p-3 rounded-xl text-xs text-[#2D1B22] text-left">
              <p className="font-semibold">What happens next?</p>
              <p className="text-[11px] text-[#8C7A82] mt-0.5">
                Our customer representative will confirm payment details and dispatch your package immediately!
              </p>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  setOrderSuccessModal(false);
                  setIsCartOpen(false);
                  clearCart();
                }}
                className="w-full py-2.5 bg-[#2D1B22] text-white text-xs font-semibold rounded-full hover:bg-[#E84A7F] transition-colors"
              >
                Done / Clear Bag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
