import React from 'react';
import { Tag, Building2, Headphones, ShieldCheck, HeartHandshake } from 'lucide-react';

export const WhyTravelWithUs: React.FC = () => {
  const benefits = [
    {
      icon: <Tag className="w-6 h-6 text-amber-400" />,
      title: 'Best Price Guarantee',
      desc: 'Get the best prices with no hidden fees or extra surcharges.',
      bgColor: 'bg-amber-400/10 text-amber-400',
    },
    {
      icon: <Building2 className="w-6 h-6 text-sky-400" />,
      title: 'Handpicked Hotels',
      desc: 'Comfortable beach resorts, wooden cottages & luxury houseboats.',
      bgColor: 'bg-sky-400/10 text-sky-400',
    },
    {
      icon: <Headphones className="w-6 h-6 text-emerald-400" />,
      title: '24/7 Local Support',
      desc: "We're here for you anytime, anywhere with district on-ground teams.",
      bgColor: 'bg-emerald-400/10 text-emerald-400',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-400" />,
      title: 'Secure Booking',
      desc: '100% safe payment with bKash, Nagad, Rocket, or Credit/Debit card.',
      bgColor: 'bg-indigo-400/10 text-indigo-400',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-pink-400" />,
      title: 'Trusted by Millions',
      desc: 'Join over 25,000+ satisfied travelers exploring Bangladesh and beyond.',
      bgColor: 'bg-pink-400/10 text-pink-400',
    },
  ];

  return (
    <section id="about" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-blue-950/20">
        
        {/* Header - Matches reference image */}
        <div className="text-center space-y-2 mb-10">
          <span className="text-[11px] font-black tracking-widest uppercase text-amber-400">
            WHY TRAVEL WITH US
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            We make your journey amazing
          </h2>
        </div>

        {/* 5 Feature Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {benefits.map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${item.bgColor}`}>
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-blue-100/75 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
