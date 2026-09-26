import React from 'react';
import { Backpack, Heart, Users2, Check, ArrowRight, ShieldCheck, Globe, Camera } from 'lucide-react';
import { CurrencyType } from '../types';

interface ChooseYourPlanProps {
  currency: CurrencyType;
  onSelectPlan: (planName: 'Solo Explorer' | 'Couple Getaway' | 'Family Vacation', priceBDT: number, priceUSD: number) => void;
}

export const ChooseYourPlan: React.FC<ChooseYourPlanProps> = ({
  currency,
  onSelectPlan,
}) => {
  const plans = [
    {
      id: 'solo',
      name: 'Solo Explorer' as const,
      icon: <Backpack className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      desc: 'Perfect for solo travelers seeking adventure and self-discovery.',
      priceBDT: 8500,
      priceUSD: 120,
      popular: false,
      features: [
        'Dedicated district local guide',
        'Budget eco-cottage / boutique stay',
        'Local transport & bus/jeep booking',
        'Authentic regional food trail',
      ],
    },
    {
      id: 'couple',
      name: 'Couple Getaway' as const,
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      desc: 'Romantic trips made memorable with privacy and scenery.',
      priceBDT: 18500,
      priceUSD: 250,
      popular: true,
      badge: 'Most Popular',
      features: [
        'Sea-view luxury suite or cloud-top cottage',
        'Candlelight beach or hilltop dinner',
        'Private 4x4 Jeep / boat charter',
        'Couple photo shoot assistance',
      ],
    },
    {
      id: 'family',
      name: 'Family Vacation' as const,
      icon: <Users2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      desc: 'Fun and safe trips for the whole family with zero hassle.',
      priceBDT: 35000,
      priceUSD: 490,
      popular: false,
      features: [
        'Spacious interconnecting family rooms',
        'Kid-safe excursions & first-aid support',
        'Private air-conditioned minibus / van',
        'Customized kid & elder meal options',
      ],
    },
  ];

  return (
    <section id="plans" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Choose Your Perfect Tour Plan
        </h2>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
          Flexible transparent packages suited for solo wanderers, romantic couples, and joyful families across Bangladesh
        </p>
      </div>

      {/* Grid: 3 Plan Cards + 1 Peace of Mind Card - Matches Reference Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        
        {plans.map((p) => {
          const price = `৳${p.priceBDT.toLocaleString()}`;

          return (
            <div
              key={p.id}
              className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                p.popular
                  ? 'bg-white dark:bg-slate-900 border-2 border-blue-600 shadow-xl shadow-blue-900/10 lg:-translate-y-2'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg'
              }`}
            >
              {/* Most Popular Badge */}
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3.5 py-1 rounded-full bg-blue-900 text-white text-[10px] font-black uppercase tracking-wider shadow">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  {p.icon}
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {p.name}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
                  {p.desc}
                </p>

                {/* Features list */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mb-6">
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Select Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  From
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                  {price}
                </div>

                <button
                  onClick={() => onSelectPlan(p.name, p.priceBDT, p.priceUSD)}
                  className={`w-full py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                    p.popular
                      ? 'bg-blue-900 hover:bg-blue-800 text-white shadow-md shadow-blue-900/20 active:scale-95'
                      : 'border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-600 hover:text-blue-600 dark:hover:border-amber-400 dark:hover:text-amber-400 hover:bg-blue-50/50 dark:hover:bg-slate-800/80'
                  }`}
                >
                  Select Plan
                </button>
              </div>

            </div>
          );
        })}

        {/* 4th Card: "Explore Bangladesh with complete peace of mind" */}
        <div className="bg-gradient-to-br from-blue-50 to-sky-100 dark:from-slate-900 dark:to-blue-950 rounded-3xl p-6 border border-blue-200/60 dark:border-blue-900/40 flex flex-col justify-between relative overflow-hidden">
          
          <div className="space-y-2 z-10">
            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-snug">
              Explore Bangladesh with complete peace of mind.
            </h3>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
              Every trip includes on-ground local assistance, full refund protection, and verified emergency support across all 64 districts.
            </p>
          </div>

          {/* Decorative Travel Element */}
          <div className="relative h-32 flex items-center justify-center my-2">
            <div className="w-24 h-24 rounded-full bg-blue-500/10 border-2 border-dashed border-blue-400/40 flex items-center justify-center animate-spin-slow">
              <Globe className="w-12 h-12 text-blue-600 dark:text-sky-400" />
            </div>
            <Camera className="w-8 h-8 text-amber-500 absolute bottom-1 right-8" />
          </div>

          <div className="z-10 pt-2 border-t border-blue-200/50 dark:border-blue-900/40">
            <span className="text-[11px] font-bold text-blue-900 dark:text-sky-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Guaranteed Booking
            </span>
          </div>

        </div>

      </div>

    </section>
  );
};
