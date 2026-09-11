import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Phone, 
  Mail, 
  Instagram, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Send, 
  Sparkles,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { settings, generateGeneralWhatsAppUrl, showNotification } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Order Inquiry',
    message: '',
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Al-jameelah World 👋\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Subject:* ${formData.subject}\n*Message:* ${formData.message}`;
    const url = generateGeneralWhatsAppUrl(text);
    window.open(url, '_blank', 'noopener,noreferrer');
    showNotification('Message redirected to WhatsApp!');
  };

  const faqs = [
    {
      q: 'How do I place an order?',
      a: 'Browse our catalog, add your desired hair oils, butters, or masks to your bag, click "Complete Order on WhatsApp", and your message will automatically be sent to our official line (+234 708 380 7419). Our customer rep will send payment details and confirm dispatch immediately.',
    },
    {
      q: 'How long does delivery take in Nigeria?',
      a: 'Deliveries within Lagos take 24–48 hours. Orders to Abuja, Port Harcourt, Ibadan, and other Nigerian states typically arrive within 2–4 business days via reliable interstate courier services.',
    },
    {
      q: 'Are your products safe for 4C hair and children?',
      a: 'Yes! All Al-jameelah World products use 100% pure Al-jameelah formulas, completely free of mineral oils, harsh parabens, and synthetic sulfates. They are gentle and deeply nourishing for kids, natural coils, locs, and sensitive scalps.',
    },
    {
      q: 'How soon can I expect to see visible hair growth results?',
      a: 'Most customers notice reduced shedding and edge revival within 2 to 3 weeks of consistent daily usage (especially when massaging our Tressence Hair Growth Oil onto edges nightly and locking in moisture with our Whipped Butter).',
    },
    {
      q: 'Can I get personalized advice for my specific hair problem?',
      a: 'Absolutely! Send a clear photo of your hair or hairline to our WhatsApp line or book a 1-on-1 Hair Consultation in our Services section.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#E84A7F] bg-[#FDF2F7] px-4 py-1 rounded-full border border-[#F2C0D4]">
          We Are Here For You
        </span>
        <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#2D1B22]">
          Get in Touch with Al-jameelah
        </h1>
        <p className="text-xs sm:text-base text-[#6B5A63] leading-relaxed">
          Need help picking the right formula, checking your dispatch tracking status, or scheduling a consultation? Reach out across any of our official channels.
        </p>
      </div>

      {/* Main Grid: Contact Channels + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#25D366]/10 border border-[#25D366]/30 p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <h3 className="font-serif-display font-bold text-lg text-[#2D1B22]">Official WhatsApp Channel</h3>
            <p className="text-xs text-[#5A4A52]">
              Fastest response for orders, hair consultations, and immediate customer assistance.
            </p>
            <a
              href={generateGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#25D366] hover:underline"
            >
              <span>{settings.whatsappNumber}</span>
              <span>→</span>
            </a>
          </div>

          <div className="bg-white border border-[#F0E6EA] p-6 rounded-3xl space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF2F7] text-[#E84A7F] flex items-center justify-center">
              <Instagram className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display font-bold text-lg text-[#2D1B22]">Instagram Community</h3>
            <p className="text-xs text-[#5A4A52]">
              Follow for daily wash-day tips, customer video reviews, and live Q&A sessions.
            </p>
            <span className="text-xs font-bold text-[#E84A7F]">{settings.instagram}</span>
          </div>

          <div className="bg-white border border-[#F0E6EA] p-6 rounded-3xl space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF0DC] text-[#C89D42] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display font-bold text-lg text-[#2D1B22]">Headquarters & Dispatch</h3>
            <p className="text-xs text-[#5A4A52]">
              {settings.address}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8C7A82]">
              <Clock className="w-3.5 h-3.5" />
              <span>Monday – Saturday: 8:00 AM – 7:00 PM</span>
            </div>
          </div>
        </div>

        {/* Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#F0E6EA] shadow-md space-y-6">
          <div>
            <h3 className="font-serif-display font-bold text-2xl text-[#2D1B22]">Send a Direct Inquiry</h3>
            <p className="text-xs text-[#8C7A82] mt-1">
              Fill out the form below and click submit to instantly dispatch your message to WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3E42] mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chioma Okafor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-4 py-2.5 text-xs text-[#2D1B22] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3E42] mb-1">WhatsApp Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="080... or 090..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-4 py-2.5 text-xs text-[#2D1B22] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3E42] mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-4 py-2.5 text-xs text-[#2D1B22] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3E42] mb-1">Topic / Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2.5 text-xs text-[#2D1B22] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/40"
                >
                  <option value="Order & Delivery Inquiry">Order & Delivery Inquiry</option>
                  <option value="Hair Consultation & Advice">Hair Consultation & Advice</option>
                  <option value="Product Recommendation">Product Recommendation</option>
                  <option value="Wholesale / Reseller">Wholesale / Reseller Partnership</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3E42] mb-1">Your Message or Hair Details *</label>
              <textarea
                required
                rows={4}
                placeholder="Describe what you need assistance with..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-4 py-2.5 text-xs text-[#2D1B22] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/40"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20b858] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-green-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Send Message to WhatsApp</span>
            </button>
          </form>
        </div>

      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-[#FAF7F5] rounded-3xl p-8 sm:p-12 border border-[#F0E6EA] space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C89D42]">
            Answers & Clarity
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2D1B22]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#F0E6EA] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
              >
                <span className="font-bold text-xs sm:text-sm text-[#2D1B22]">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#8C7A82] transition-transform ${openFaq === idx ? 'rotate-180 text-[#E84A7F]' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-[#5A4A52] leading-relaxed border-t border-[#F5ECF0] pt-3 animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
