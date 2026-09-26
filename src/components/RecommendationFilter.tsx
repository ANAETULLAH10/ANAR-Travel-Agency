import React, { useState, useRef, useEffect } from 'react';
import { 
  Luggage, 
  Send, 
  ChevronDown, 
  Check, 
  MapPin, 
  Coins, 
  Waves, 
  Mountain, 
  Trees, 
  Anchor, 
  Landmark 
} from 'lucide-react';

interface RecommendationFilterProps {
  onShowRecommendations: (preference: string, budgetRange: string) => void;
}

export const RecommendationFilter: React.FC<RecommendationFilterProps> = ({
  onShowRecommendations,
}) => {
  const [destinationType, setDestinationType] = useState('Anywhere');
  const [budget, setBudget] = useState('Any Budget');
  
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  const destRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setIsDestOpen(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(event.target as Node)) {
        setIsBudgetOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const destinationOptions = [
    { value: 'Anywhere', label: 'Anywhere in Bangladesh', desc: 'All 8 Divisions & Top 64 Districts', icon: MapPin },
    { value: 'Beach', label: 'Beach & Coral Island', desc: "Cox's Bazar, Saint Martin, Kuakata", icon: Waves },
    { value: 'Hill', label: 'Hill Tracts & Cloud Valley', desc: 'Sajek, Bandarban, Rangamati', icon: Mountain },
    { value: 'Forest', label: 'Mangrove & Rainforest', desc: 'Sundarbans, Lawachara', icon: Trees },
    { value: 'Haor', label: 'Haor & Houseboat Stays', desc: 'Tanguar Haor, Kaptai Lake', icon: Anchor },
    { value: 'Heritage', label: 'Heritage & Archaeology', desc: 'Paharpur, Mahasthangarh', icon: Landmark },
  ];

  const budgetOptions = [
    { value: 'Any Budget', label: 'Any Budget', desc: 'Show all pricing tiers' },
    { value: 'budget', label: 'Under ৳10,000', desc: 'Budget-friendly weekend trips' },
    { value: 'moderate', label: '৳10,000 - ৳20,000', desc: 'Popular standard full packages' },
    { value: 'luxury', label: '৳20,000+ Premium', desc: 'Luxury resort & private houseboats' },
  ];

  const selectedDestObj = destinationOptions.find((d) => d.value === destinationType) || destinationOptions[0];
  const selectedBudgetObj = budgetOptions.find((b) => b.value === budget) || budgetOptions[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDestOpen(false);
    setIsBudgetOpen(false);
    onShowRecommendations(destinationType, budget);
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#eef2f7] neu-raised rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 border border-white/70">
        
        {/* Left Side: Luggage Icon & Headline */}
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl neu-raised flex items-center justify-center shrink-0 text-amber-500 border border-white/80">
            <div className="w-11 h-11 rounded-xl neu-inset flex items-center justify-center text-amber-600">
              <Luggage className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full neu-inset-sm text-[#0d2758] text-[10px] font-black uppercase tracking-wider mb-1">
              <span>🇧🇩 100% Local Tours</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Not sure where to explore?
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              Get personalized recommendations tailored for your style and budget in Bangladesh.
            </p>
          </div>
        </div>

        {/* Right Side: 2 Custom Interactive Neumorphic Dropdowns + Submit Button */}
        <form onSubmit={handleSubmit} className="flex flex-wrap sm:flex-nowrap items-center gap-3.5 w-full lg:w-auto relative z-30">
          
          {/* Dropdown 1: I want to go */}
          <div ref={destRef} className="relative flex-1 sm:w-64">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1 px-1">
              I want to go
            </label>
            <button
              type="button"
              onClick={() => {
                setIsDestOpen(!isDestOpen);
                setIsBudgetOpen(false);
              }}
              className="w-full text-left neu-inset rounded-2xl p-3 px-4 flex items-center justify-between gap-2 cursor-pointer transition-all hover:bg-slate-100"
            >
              <div className="flex items-center gap-2.5 truncate">
                <selectedDestObj.icon className="w-4 h-4 text-[#0d2758] shrink-0" />
                <span className="text-xs font-black text-slate-900 truncate">
                  {selectedDestObj.label}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isDestOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Custom Popover Dropdown - Absolute guarantee of NO white-on-white text */}
            {isDestOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-fade-in divide-y divide-slate-100">
                {destinationOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = opt.value === destinationType;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setDestinationType(opt.value);
                        setIsDestOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-50 text-[#0d2758] font-black' 
                          : 'text-slate-800 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-900 text-amber-400' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-900 font-extrabold">{opt.label}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{opt.desc}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-900 shrink-0 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dropdown 2: Budget */}
          <div ref={budgetRef} className="relative flex-1 sm:w-56">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1 px-1">
              Budget (BDT ৳)
            </label>
            <button
              type="button"
              onClick={() => {
                setIsBudgetOpen(!isBudgetOpen);
                setIsDestOpen(false);
              }}
              className="w-full text-left neu-inset rounded-2xl p-3 px-4 flex items-center justify-between gap-2 cursor-pointer transition-all hover:bg-slate-100"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-black text-slate-900 truncate">
                  {selectedBudgetObj.label}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isBudgetOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Custom Popover Dropdown - Absolute guarantee of NO white-on-white text */}
            {isBudgetOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-fade-in divide-y divide-slate-100">
                {budgetOptions.map((opt) => {
                  const isSelected = opt.value === budget;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setBudget(opt.value);
                        setIsBudgetOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-50 text-slate-950 font-black' 
                          : 'text-slate-800 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <div>
                        <div className="text-xs text-slate-900 font-extrabold">{opt.label}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{opt.desc}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="w-full sm:w-auto pt-5 sm:pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl neu-btn-primary font-black text-xs flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-transform active:scale-95"
            >
              <span>Show Recommendations</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>

      </div>
    </section>
  );
};
