import React, { useState } from 'react';
import { MessageCircle, Star, ShieldCheck, MapPin, Award, Phone, CheckCircle2 } from 'lucide-react';
import { LocalGuide, CurrencyType } from '../types';

interface DistrictGuidesProps {
  guides: LocalGuide[];
  currency: CurrencyType;
  onOpenChat: (guide: LocalGuide) => void;
  onBookGuide: (guide: LocalGuide) => void;
}

export const DistrictGuides: React.FC<DistrictGuidesProps> = ({
  guides,
  currency,
  onOpenChat,
  onBookGuide,
}) => {
  const [selectedDivision, setSelectedDivision] = useState<string>('All');

  const divisions = ['All', 'Chittagong', 'Sylhet', 'Khulna', 'Barisal', 'Dhaka'];

  const filteredGuides = guides.filter((g) => {
    if (selectedDivision === 'All') return true;
    return g.division === selectedDivision;
  });

  return (
    <section id="guides" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300/40">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Local Tour Guides
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Connect With Local Guides in Every District
        </h2>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Chat in real-time with indigenous and local district guides for custom itineraries, secret spots, transport arrangements, and authentic regional meals.
        </p>
      </div>

      {/* Division Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {divisions.map((div) => (
          <button
            key={div}
            onClick={() => setSelectedDivision(div)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedDivision === div
                ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {div === 'All' ? 'All Districts' : `${div} Division`}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredGuides.map((guide) => {
          const rate = `৳${guide.dailyRateBDT.toLocaleString()}`;

          return (
            <div
              key={guide.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Profile Header */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400">
                    <img
                      src={guide.photo}
                      alt={guide.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {guide.available && (
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-500" title="Online now" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {guide.name}
                      </h3>
                      <span title="Verified Guide">
                        <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{guide.district}</span>
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{guide.rating}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        ({guide.reviewCount} tours)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specialties & Bio */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 p-2 rounded-xl border border-blue-100 dark:border-blue-900 line-clamp-2">
                    🎯 {guide.specialty}
                  </p>
                  
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {guide.bio}
                  </p>
                </div>

                {/* Languages Badges */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {guide.languages.map((lang) => (
                    <span 
                      key={lang} 
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rate & Real-Time Chat Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Daily Rate
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {rate}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      / day
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenChat(guide)}
                    className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Live Chat</span>
                  </button>

                  <button
                    onClick={() => onBookGuide(guide)}
                    className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-95 text-white text-xs font-extrabold transition-all text-center cursor-pointer shadow-sm"
                  >
                    Book Guide
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
