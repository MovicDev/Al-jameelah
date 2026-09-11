import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  ArrowRight,
  UserCheck,
  FileText
} from 'lucide-react';
import { Service } from '../../types';

export const ServicesView: React.FC = () => {
  const { services, generateServiceWhatsAppUrl, settings } = useApp();

  const handleBookService = (service: Service) => {
    const url = generateServiceWhatsAppUrl(service);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Services Hero */}
      <div className="bg-gradient-to-br from-[#FAF5F7] via-[#FFFDFD] to-[#FAF0DC] rounded-3xl p-8 sm:p-14 border border-[#F0E6EA] text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#FDF2F7] border border-[#F2C0D4] px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#E84A7F]">
          <Sparkles className="w-3.5 h-3.5 text-[#C89D42]" />
          <span>Professional Hair Trichology & Care</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#2D1B22]">
          Natural Hair Services & Consultations
        </h1>
        <p className="text-xs sm:text-base text-[#5A4A52] max-w-2xl mx-auto leading-relaxed">
          Unlock your hair’s full genetic potential. Book 1-on-1 personalized growth consultations, scalp detox therapy, or custom regimen blueprints directly with Al-jameelah World specialists.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl border border-[#F0E6EA] hover:border-[#E84A7F]/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image & Badges */}
              <div className="aspect-[16/9] w-full bg-[#FAF7F5] relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-[#2D1B22]/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C89D42]" />
                    <span>{service.duration}</span>
                  </span>
                  {service.popular && (
                    <span className="bg-[#E84A7F] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                      Most Popular
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-serif-display font-bold text-xl sm:text-2xl text-[#2D1B22]">
                    {service.name}
                  </h3>
                  <span className="font-serif-display font-bold text-xl text-[#E84A7F] whitespace-nowrap">
                    ₦{service.price.toLocaleString('en-NG')}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#5A4A52] leading-relaxed">
                  {service.description}
                </p>

                {/* Deliverable info */}
                <div className="p-3 bg-[#FAF7F5] rounded-2xl border border-[#F0E6EA] text-xs text-[#4A3E42] flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#C89D42] flex-shrink-0" />
                  <span><strong>Format:</strong> {service.deliverable}</span>
                </div>

                {/* Benefits List */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D1B22] block">
                    What is included:
                  </span>
                  <ul className="space-y-1.5">
                    {service.benefits.map((ben, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#4A3E42]">
                        <CheckCircle2 className="w-4 h-4 text-[#E84A7F] flex-shrink-0 mt-0.5" />
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Booking CTA */}
            <div className="p-6 sm:p-8 pt-0 border-t border-[#F5ECF0] mt-4">
              <button
                onClick={() => handleBookService(service)}
                className="w-full py-3.5 rounded-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-green-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Book / Request Service on WhatsApp</span>
              </button>
              <p className="text-center text-[10px] text-[#8C7A82] mt-2">
                Opens pre-formatted message directly to {settings.whatsappNumber}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* How Consultation Works */}
      <div className="bg-[#FAF7F5] rounded-3xl p-8 sm:p-12 border border-[#F0E6EA] text-center space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E84A7F]">
            Simple & Seamless Process
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2D1B22] mt-1">
            How Your Service Booking Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-2xl border border-[#F0E6EA] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FDF2F7] text-[#E84A7F] font-serif-display font-bold text-base flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-sm text-[#2D1B22]">Select Service</h4>
            <p className="text-xs text-[#6B5A63] leading-relaxed">
              Choose the service tailored to your hair struggle and click "Book on WhatsApp".
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#F0E6EA] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF0DC] text-[#C89D42] font-serif-display font-bold text-base flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-sm text-[#2D1B22]">Schedule Time</h4>
            <p className="text-xs text-[#6B5A63] leading-relaxed">
              Confirm your preferred date, video call slot, or studio time directly with our consultant.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#F0E6EA] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#E8F8EE] text-[#25D366] font-serif-display font-bold text-base flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-sm text-[#2D1B22]">Get Results</h4>
            <p className="text-xs text-[#6B5A63] leading-relaxed">
              Receive your custom 90-day Regimen PDF and ongoing WhatsApp accountability checks!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
