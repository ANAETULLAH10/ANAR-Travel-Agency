import React, { useState } from 'react';
import { Star, Heart, ArrowRight, MapPin, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { Destination, CurrencyType } from '../types';

interface PopularDestinationsProps {
  destinations: Destination[];
  currency?: CurrencyType;
  onSelectDestination: (dest: Destination) => void;
  onBookNow: (dest: Destination) => void;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({
  destinations,
  onSelectDestination,
  onBookNow,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Beach' | 'Hill' | 'Forest' | 'Haor & River' | 'Heritage'>('All');
  const [favorites, setFavorites] = useState<string[]>(['coxs-bazar-deluxe', 'sajek-valley-clouds']);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredDestinations = destinations.filter((item) => {
    if (activeFilter === 'Beach') return item.category === 'Beach';
    if (activeFilter === 'Hill') return item.category === 'Hill';
    if (activeFilter === 'Forest') return item.category === 'Forest';
    if (activeFilter === 'Haor & River') return item.category === 'Haor & River';
    if (activeFilter === 'Heritage') return item.category === 'Heritage';
    return true;
  });

  return (
    <section id="destinations" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black mb-2">
            <span>🇧🇩 ১০টি অফিশিয়াল লোকাল ট্যুর প্যাকেজ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            বাংলাদেশের সেরা ১০টি ডেডিকেটেড ট্যুরিজম প্যাকেজ
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1 max-w-2xl">
            কক্সবাজার থেকে সাজেক, সুন্দরবন থেকে টাঙ্গুয়ার হাওড়—প্রতিটি জায়গার জন্য আলাদা একক ট্যুর প্যাকেজ, লাইসেন্সপ্রাপ্ত গাইড এবং নিশ্চিত বুকিং
          </p>
        </div>

        <button 
          onClick={() => setActiveFilter('All')} 
          className="text-xs font-black text-blue-900 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto bg-blue-50 px-3.5 py-2 rounded-xl"
        >
          <span>সবগুলো প্যাকেজ দেখুন ({destinations.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {[
          { id: 'All', label: 'সবগুলো গন্তব্য (১০টি)' },
          { id: 'Beach', label: '🏖️ সমুদ্র সৈকত ও দ্বীপ' },
          { id: 'Hill', label: '⛰️ পাহাড় ও মেঘের রাজ্য' },
          { id: 'Forest', label: '🌿 সুন্দরবন ম্যানগ্রোভ' },
          { id: 'Haor & River', label: '⛵ চা বাগান, হাওড় ও লেক' },
          { id: 'Heritage', label: '🏛️ প্রত্নতাত্ত্বিক ঐতিহ্য' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 10 Single Destination Package Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {filteredDestinations.map((dest) => {
          const isFav = favorites.includes(dest.id);
          const priceDisplay = `৳${dest.priceBDT.toLocaleString()}`;

          return (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer bg-white border border-slate-200 flex flex-col justify-between"
            >
              {/* Photo & Ribbon */}
              <div className="relative h-56 overflow-hidden bg-slate-900">
                <img
                  src={dest.image}
                  alt={dest.nameBn || dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/30" />

                {/* Top Badge & Favorite */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  {dest.badge ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black tracking-wide uppercase shadow">
                      {dest.badge}
                    </span>
                  ) : <span />}

                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(dest.id, e)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                      isFav 
                        ? 'bg-red-500 text-white shadow-sm scale-110' 
                        : 'bg-black/40 text-white/90 hover:text-white hover:bg-black/60'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Duration & Rating on Image */}
                <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-white text-[11px] font-bold z-10">
                  <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-lg">
                    <Clock className="w-3 h-3 text-amber-300" />
                    <span>{dest.duration}</span>
                  </span>

                  <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-lg text-amber-300">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-white">{dest.rating}</span>
                  </span>
                </div>
              </div>

              {/* Package Content Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-blue-900 font-extrabold">
                    <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">{dest.district}, বাংলাদেশ</span>
                  </div>

                  {/* Bengali Title */}
                  <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-1 group-hover:text-blue-900 transition-colors">
                    {dest.nameBn || dest.name}
                  </h3>

                  {/* Bengali Subtitle */}
                  <p className="text-[11px] font-semibold text-slate-500 line-clamp-2 leading-relaxed">
                    {dest.subtitleBn || dest.description}
                  </p>
                </div>

                {/* Price & Action Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                      প্যাকেজ রেট
                    </span>
                    <span className="text-base font-black text-[#0d2758]">
                      {priceDisplay}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookNow(dest);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    বুক করুন
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
