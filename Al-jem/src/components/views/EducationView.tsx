import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { initialEducationPosts } from '../../data/initialData';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Share2, 
  Sparkles, 
  Check, 
  MessageCircle,
  Tag 
} from 'lucide-react';
import { EducationPost } from '../../types';

export const EducationView: React.FC = () => {
  const { selectedPostId, setSelectedPostId, generateGeneralWhatsAppUrl } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const selectedPost = initialEducationPosts.find((p) => p.id === selectedPostId);

  const categories = [
    { id: 'all', label: 'All Guides' },
    { id: 'Hair Growth', label: 'Hair Growth' },
    { id: 'Moisture & Care', label: 'Moisture & Care' },
    { id: 'Styling & Maintenance', label: 'Styling & Care' },
  ];

  const filteredPosts = initialEducationPosts.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* If a post is selected, display the full Article Reader */}
      {selectedPost ? (
        <article className="max-w-3xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-[#F0E6EA] shadow-lg animate-in fade-in duration-300">
          
          <button
            onClick={() => setSelectedPostId(null)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C7A82] hover:text-[#E84A7F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Education Library</span>
          </button>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-[#FDF2F7] text-[#E84A7F] font-bold px-3 py-1 rounded-full border border-[#F2C0D4]">
                {selectedPost.category}
              </span>
              <span className="text-[#8C7A82] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {selectedPost.publishedDate}
              </span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#2D1B22] leading-tight">
              {selectedPost.title}
            </h1>

            <p className="text-sm text-[#6B5A63] italic border-l-2 border-[#E84A7F] pl-4">
              {selectedPost.excerpt}
            </p>
          </div>

          {/* Main Featured Image */}
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#FAF7F5] border border-[#F0E6EA]">
            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
          </div>

          {/* Article Full Markdown/Text Content */}
          <div className="prose prose-pink max-w-none text-xs sm:text-sm text-[#4A3E42] leading-relaxed space-y-4">
            {selectedPost.content.map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-serif-display font-bold text-xl text-[#2D1B22] pt-4">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <p key={idx} className="font-bold text-[#2D1B22]">
                    {paragraph.replace(/\*\*/g, '')}
                  </p>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>

          {/* Bottom WhatsApp Consult Prompt */}
          <div className="bg-[#FAF7F5] p-6 rounded-2xl border border-[#F0E6EA] flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-sm text-[#2D1B22]">Have specific questions about this topic?</h4>
              <p className="text-xs text-[#8C7A82]">Ask our hair care specialist on WhatsApp for free tips.</p>
            </div>
            <a
              href={generateGeneralWhatsAppUrl(`Hello Al-jameelah World 👋 I just read your article "${selectedPost.title}" and would like to ask a question.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#25D366] text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-md hover:bg-[#20b858]"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </article>
      ) : (
        /* Blog Index Library */
        <>
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E84A7F] bg-[#FDF2F7] px-4 py-1.5 rounded-full border border-[#F2C0D4]">
              Al-jameelah Knowledge Base
            </span>
            <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#2D1B22]">
              The Nigerian Natural Hair Handbook
            </h1>
            <p className="text-xs sm:text-base text-[#6B5A63] leading-relaxed">
              Master the science of 4A–4C coils, conquer Harmattan dryness, revive your hairline, and learn how to retain natural length month after month.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#E84A7F] text-white shadow-md'
                    : 'bg-white text-[#4A3E42] hover:bg-[#FAF7F5] border border-[#E8DCE2]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPostId(post.id)}
                className="bg-white rounded-3xl overflow-hidden border border-[#F0E6EA] hover:border-[#E84A7F]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-[#FAF7F5]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#8C7A82]">
                      <span className="text-[#E84A7F] font-bold">{post.category}</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="font-serif-display font-bold text-lg text-[#2D1B22] group-hover:text-[#E84A7F] transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#6B5A63] line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-[#F5ECF0] mt-4 pt-4 text-xs font-bold text-[#E84A7F]">
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};
