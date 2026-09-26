import React from 'react';
import { ArrowRight, Clock, Check, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { Destination, CurrencyType } from '../types';

interface TopDealsProps {
  destinations: Destination[];
  currency: CurrencyType;
  onSelectDestination: (dest: Destination) => void;
  onBookNow: (dest: Destination) => void;
}

export const TopDeals: React.FC<TopDealsProps> = ({
  destinations,
  currency,
  onSelectDestination,
  onBookNow,
}) => {
  // Select top deals with discounts
  const dealDestinations = destinations.slice(0, 4);

  return (
    <section id="deals" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header - Matches Reference Image */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Top Deals & Offers
            </h2>
            <span className="text-rose-500 text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900">
              Limited Time
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Exclusive discounted packages with flights, handpicked stays, and local guide support
          </p>
        </div>

        <button 
          onClick={() => {
            const el = document.getElementById('destinations');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs font-bold text-blue-900 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <span>View all deals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Deals Grid - 4 Columns matching reference design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dealDestinations.map((dest, idx) => {
          const discount = dest.discountPercent || (idx === 0 ? 20 : idx === 1 ? 15 : idx === 2 ? 25 : 30);
          const originalPriceBDT = Math.round(dest.priceBDT / (1 - discount / 100));

          const currentPrice = `৳${dest.priceBDT.toLocaleString()}`;
          const origPrice = `৳${originalPriceBDT.toLocaleString()}`;

          return (
            <div
              key={dest.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 flex flex-col group hover:shadow-2xl transition-all duration-300"
            >
              {/* Photo with Discount Ribbon */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Discount Badge - Pink/Red pill as in reference */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-black shadow-md tracking-wider">
                    {discount}% OFF
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{dest.duration}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {dest.district ? `${dest.district}, Bangladesh` : dest.country}
                  </p>

                  {/* Included Services line */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">Includes: Resort + Meals + Guide + 4x4 Jeep</span>
                    </p>
                  </div>
                </div>

                {/* Price Row & Action */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-400 line-through mr-2">
                        {origPrice}
                      </span>
                      <span className="text-xl font-black text-blue-900 dark:text-amber-400">
                        {currentPrice}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      / person
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectDestination(dest)}
                      className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-900 dark:hover:text-amber-400 transition-colors text-center cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onBookNow(dest)}
                      className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-95 text-white text-xs font-extrabold transition-all shadow text-center cursor-pointer"
                    >
                      Book Deal
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
