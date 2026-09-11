import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { settings, generateGeneralWhatsAppUrl, cart } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const url = generateGeneralWhatsAppUrl(message.trim() || undefined);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Interactive Popup Box */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-[#F0E6EA] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2D1B22] via-[#4A2536] to-[#E84A7F] p-4 text-white relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp chat prompt"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-[#2D1B22] font-serif-display font-bold flex items-center justify-center text-sm border-2 border-[#C89D42]">
                AJ
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm">Al-jameelah World</h4>
                  <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                </div>
                <p className="text-[11px] text-[#F9EAE1] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#E5C384]" /> Online • Hair Care Specialist
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#FAF7F5] space-y-3 text-xs text-[#4A3E42]">
            <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-[#F0E6EA] max-w-[90%]">
              <p className="leading-relaxed">
                Hello Queen! 🌸 Welcome to Al-jameelah World. How can we assist your natural hair growth journey today?
              </p>
              <span className="text-[9px] text-[#8C7A82] block text-right mt-1">Just now</span>
            </div>

            {cart.length > 0 && (
              <div className="bg-[#FDF2F7] p-2.5 rounded-xl border border-[#F2C0D4] text-[11px] text-[#2D1B22] flex items-center justify-between">
                <span>You have <strong>{cart.length} product(s)</strong> in your shopping bag!</span>
              </div>
            )}

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => {
                  const url = generateGeneralWhatsAppUrl('Hello Al-jameelah World 👋 I want to ask for advice on hair growth and edge revival products for my 4C hair.');
                  window.open(url, '_blank');
                  setIsOpen(false);
                }}
                className="w-full text-left p-2 rounded-xl bg-white hover:bg-[#FDF2F7] hover:text-[#E84A7F] border border-[#EFE5EB] text-[11px] font-medium transition-colors"
              >
                🌿 "I need help choosing products for hair growth & edges"
              </button>
              <button
                onClick={() => {
                  const url = generateGeneralWhatsAppUrl('Hello Al-jameelah World 👋 How long does doorstep delivery take to my state?');
                  window.open(url, '_blank');
                  setIsOpen(false);
                }}
                className="w-full text-left p-2 rounded-xl bg-white hover:bg-[#FDF2F7] hover:text-[#E84A7F] border border-[#EFE5EB] text-[11px] font-medium transition-colors"
              >
                🚚 "How does nationwide delivery work?"
              </button>
            </div>

            {/* Message input */}
            <form onSubmit={handleSend} className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-white border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/40"
              />
              <button
                type="submit"
                className="bg-[#25D366] hover:bg-[#20b858] text-white p-2 rounded-xl transition-transform active:scale-95 flex-shrink-0"
                aria-label="Send WhatsApp message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trigger Floating Action Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20b858] text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
        aria-label="Open WhatsApp Chat"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="font-semibold text-xs tracking-wide hidden sm:inline">WhatsApp Order & Chat</span>
      </button>
    </div>
  );
};
