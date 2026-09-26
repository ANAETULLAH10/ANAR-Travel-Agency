import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  User, 
  ArrowRight, 
  X, 
  MapPin, 
  Utensils, 
  Compass, 
  CheckCircle2, 
  Sparkles,
  Luggage,
  Share2
} from 'lucide-react';
import { BLOGS_DATA } from '../data/blogs';
import { BlogPost, Destination } from '../types';

interface BlogSectionProps {
  destinations: Destination[];
  onBookDestination: (dest: Destination) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  destinations,
  onBookDestination,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);

  const filteredBlogs = selectedCategory === 'All' 
    ? BLOGS_DATA 
    : BLOGS_DATA.filter((b) => b.category === selectedCategory);

  const handleOpenBlog = (blog: BlogPost) => {
    setActiveBlog(blog);
  };

  const handleBookFromBlog = (destinationId: string) => {
    const dest = destinations.find((d) => d.id === destinationId) || destinations[0];
    setActiveBlog(null);
    onBookDestination(dest);
  };

  return (
    <section id="blogs" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-900 text-xs font-black mb-2">
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            <span>বাংলাদেশ ভ্রমণ ব্লগ ও গাইড</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ১০টি সেরা ভ্রমণ গন্তব্যের কমপ্লিট ট্রাভেল ব্লগ
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1 max-w-2xl">
            বাংলাদেশের প্রতিটি দর্শনীয় স্থানের পূর্ণাঙ্গ যাতায়াত তথ্য, খাবারের গাইড, সেরা সময় ও হিডেন স্পট নিয়ে আমাদের অভিজ্ঞ ট্রাভেলারদের লেখা গল্প
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500">
          সর্বমোট ১০টি বিস্তারিত ভ্রমণ গাইড
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {[
          { id: 'All', label: 'সব ব্লগ (১০টি গন্তব্য)' },
          { id: 'Beach', label: '🏖️ সমুদ্র সৈকত ও দ্বীপ' },
          { id: 'Hill', label: '⛰️ পাহাড় ও মেঘের রাজ্য' },
          { id: 'Forest', label: '🌿 রয়্যাল সুন্দরবন' },
          { id: 'Haor & River', label: '⛵ চা বাগান, হাওড় ও লেক' },
          { id: 'Heritage', label: '🏛️ ঐতিহাসিক প্রত্নতত্ত্ব' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-[#0d2758] text-white shadow-md shadow-blue-950/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => {
          return (
            <article
              key={blog.id}
              onClick={() => handleOpenBlog(blog)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
            >
              {/* Image & Badges */}
              <div className="relative h-52 overflow-hidden bg-slate-900">
                <img
                  src={blog.coverImage}
                  alt={blog.titleBn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black tracking-wide uppercase shadow">
                    {blog.subtitleBn.split(' ')[0]}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 text-amber-300" />
                    <span>{blog.readTime}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    <Calendar className="w-3 h-3 text-blue-300" />
                    <span>{blog.date}</span>
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="text-[11px] font-black text-amber-600 uppercase tracking-wider">
                    {blog.subtitleBn}
                  </div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
                    {blog.titleBn}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Author & Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={blog.authorAvatar}
                      alt={blog.author}
                      className="w-7 h-7 rounded-full object-cover border border-amber-400"
                    />
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {blog.author}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400">
                        {blog.authorRole}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-black text-blue-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>পড়ুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            </article>
          );
        })}
      </div>

      {/* FULL BLOG READER MODAL */}
      {activeBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveBlog(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Header Hero Image */}
            <div className="relative h-64 sm:h-80 overflow-hidden bg-slate-950">
              <img
                src={activeBlog.coverImage}
                alt={activeBlog.titleBn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-5 inset-x-5 text-white space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                  {activeBlog.subtitleBn}
                </span>
                <h1 className="text-xl sm:text-2xl font-black leading-snug">
                  {activeBlog.titleBn}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-300" />
                    <span>{activeBlog.author} • {activeBlog.authorRole}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>{activeBlog.readTime}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    <span>{activeBlog.date}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-6 text-slate-800 max-h-[60vh] overflow-y-auto">
              
              {/* Introduction */}
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>গন্তব্যের পরিচিতি ও পটভূমি</span>
                </h3>
                <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                  {activeBlog.content.introduction}
                </p>
              </div>

              {/* Must Visit Spots Grid */}
              <div className="space-y-3">
                <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>অবশ্যই দর্শনীয় প্রধান স্থানসমূহ</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {activeBlog.content.mustVisitSpots.map((spot, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-900 text-amber-300 flex items-center justify-center text-[10px] font-black shrink-0">
                          {i + 1}
                        </span>
                        <span>{spot.spotName}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 leading-relaxed pl-6">
                        {spot.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Reach & Best Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1.5">
                  <h4 className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-blue-700" />
                    <span>যাতায়াত মাধ্যম ও কীভাবে যাবেন</span>
                  </h4>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">
                    {activeBlog.content.howToReach}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1.5">
                  <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>ভ্রমণের সেরা সময়</span>
                  </h4>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">
                    {activeBlog.content.bestTimeToTravel}
                  </p>
                </div>
              </div>

              {/* Local Food Guide */}
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-rose-500" />
                  <span>ঐতিহ্যবাহী স্থানীয় খাবার দাবার</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {activeBlog.content.localFoodGuide.map((food, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-amber-500 font-black">✦</span>
                      <span>{food}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traveler Tips */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 space-y-2">
                <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ভ্রমণকারীদের গুরুত্বপূর্ণ পরামর্শ ও টিপস</span>
                </h4>
                <ul className="space-y-1.5 text-xs font-medium text-emerald-900 pl-2">
                  {activeBlog.content.travelerTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Modal Bottom CTA */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <div className="text-[11px] font-bold text-slate-500">
                  পছন্দ হয়েছে গন্তব্যটি?
                </div>
                <div className="text-xs font-black text-slate-900">
                  নিশ্চিন্তে বুক করুন ANAR ট্রাভেলের অফিসিয়াল প্যাকেজ
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveBlog(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  বন্ধ করুন
                </button>
                <button
                  onClick={() => handleBookFromBlog(activeBlog.destinationId)}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Luggage className="w-4 h-4" />
                  <span>এই প্যাকেজটি বুক করুন</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
