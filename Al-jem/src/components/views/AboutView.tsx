import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Leaf, 
  Heart, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  Droplet, 
  CheckCircle2 
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setActiveTab, generateGeneralWhatsAppUrl } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* 1. About Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#FDF2F7] border border-[#F2C0D4] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#E84A7F]">
            <Sparkles className="w-3.5 h-3.5 text-[#C89D42]" />
            <span>The Al-jameelah World Story</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2D1B22] leading-[1.15]">
            Born in Nigeria. Crafted for <span className="text-[#E84A7F] italic font-editorial">Black Hair Excellence.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5A4A52] leading-relaxed">
            <strong>Al-jameelah World</strong> was founded with a singular purpose: to empower Nigerian women and girls to celebrate, nourish, and grow their natural coils without toxic chemicals, misleading labels, or unrealistic Western beauty standards.
          </p>

          <p className="text-sm sm:text-base text-[#5A4A52] leading-relaxed">
            Our brand name — <em>Al-jameelah</em> — signifies <strong>"The Beautiful One"</strong>. We believe your natural afro hair, tight kinks, and bouncy curls are your crown of dignity. When fed with the right pure Al-jameelah formulas, patience, and moisture, 4A–4C hair will grow long, lush, and strong.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => { setActiveTab('shop'); window.scrollTo(0, 0); }}
              className="px-8 py-3.5 rounded-full bg-[#E84A7F] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-[#D42A63] transition-colors"
            >
              Explore Our Al-jameelah Formulas
            </button>
            <a
              href={generateGeneralWhatsAppUrl('Hello Al-jameelah World 👋 I loved reading your story and would like to learn more.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-full bg-white border border-[#E8DCE2] text-[#2D1B22] text-xs font-bold hover:bg-[#FAF7F5] transition-colors"
            >
              Connect with Founder on WhatsApp
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-[#FAF7F5]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80"
              alt="Nigerian woman with lush crown of natural hair"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating Pill */}
          <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-[#F0E6EA] max-w-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C89D42]">Our Guarantee</span>
            <p className="text-xs text-[#2D1B22] font-semibold">Zero Mineral Oils, Parabens, or Artificial Fillers.</p>
          </div>
        </div>
      </div>

      {/* 2. Our 4 Core Pillars */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E84A7F]">
            Our Guiding Pillars
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#2D1B22]">
            Why Nigerian Queens Trust Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FAF7F5] p-6 rounded-3xl border border-[#F0E6EA] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF2F7] text-[#E84A7F] flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display font-bold text-lg text-[#2D1B22]">100% Pure Al-jameelah</h3>
            <p className="text-xs text-[#6B5A63] leading-relaxed">
              We extract only cold-pressed oils, raw African Shea butter, and authentic Chadian Chebe seeds.
            </p>
          </div>

          <div className="bg-[#FAF7F5] p-6 rounded-3xl border border-[#F0E6EA] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0DC] text-[#C89D42] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display font-bold text-lg text-[#2D1B22]">Tailored for Nigeria</h3>
            <p className="text-xs text-[#6B5A63] leading-relaxed">
              Built to protect against dry harmattan dust, humid coastal heat, and chlorinated hard tap water.
            </p>
          </div>

          <div className="bg-[#FAF7F5] p-6 rounded-3xl border border-[#F0E6EA] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF2F7] text-[#E84A7F] flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display font-bold text-lg text-[#2D1B22]">Sisterhood First</h3>
            <p className="text-xs text-[#6B5A63] leading-relaxed">
              Every customer gets personalized hair coaching and direct WhatsApp access to our care team.
            </p>
          </div>

          <div className="bg-[#FAF7F5] p-6 rounded-3xl border border-[#F0E6EA] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0DC] text-[#C89D42] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display font-bold text-lg text-[#2D1B22]">Honest Transparency</h3>
            <p className="text-xs text-[#6B5A63] leading-relaxed">
              No miracle overnight fairy tales — just solid trichology habits and consistent, visible length retention.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Ingredient Spotlight */}
      <div className="bg-[#2D1B22] text-white rounded-[2.5rem] p-8 sm:p-14 space-y-10 relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E5C384]">
            Ethically Sourced
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold">
            The Al-jameelah Ingredients We Stand By
          </h2>
          <p className="text-xs sm:text-sm text-[#D8C6CE]">
            Hand-selected, cold-processed, and blended to perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {[
            {
              title: 'Chadian Chebe Seed Extract',
              desc: 'World-renowned African length retention secret that seals the hair cuticle, lubricates strands, and prevents breakage.',
            },
            {
              title: 'Raw Unrefined Shea Butter',
              desc: 'Harvested from wild Shea trees in West Africa to deliver deep, rich vitamins A & E directly to thirsty hair strands.',
            },
            {
              title: 'Jamaican & Moroccan Black Castor',
              desc: 'Thick ricinoleic acid that stimulates follicle micro-circulation to revive receding temples and thinning edges.',
            },
            {
              title: 'Rosemary & Peppermint Essential Oils',
              desc: 'Clinically proven Al-jameelah stimulants that awaken dormant hair follicles and calm itchy dandruff scalp.',
            },
            {
              title: 'Cold-Pressed Argan & Jojoba Oils',
              desc: 'Mimics your scalp’s natural sebum to impart brilliant shine without leaving a greasy, suffocating film.',
            },
            {
              title: 'Hydrolyzed Wheat & Silk Protein',
              desc: 'Fills microscopic gaps in damaged hair shafts to instantly reduce shedding during detangling and wash day.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white/10 p-5 rounded-2xl border border-white/15 space-y-2">
              <h4 className="font-serif-display font-bold text-base text-[#E5C384]">{item.title}</h4>
              <p className="text-xs text-[#D8C6CE] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
