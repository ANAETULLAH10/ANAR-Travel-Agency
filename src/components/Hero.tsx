import React from 'react';
import { Play, ArrowRight, Star, ShieldCheck, Sparkles, Mic, MapPin, Calendar, Heart } from 'lucide-react';
import { CurrencyType } from '../types';

interface HeroProps {
  currency?: CurrencyType;
  onExploreClick: () => void;
  onWatchVideoClick: () => void;
  onBookHeroPackage: () => void;
  onOpenVoicePlanner: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onWatchVideoClick,
  onBookHeroPackage,
  onOpenVoicePlanner,
}) => {
  const heroPrice = '৳14,500';

  return (
    <section id="hero" className="relative min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden">
      {/* Background Cinematic Image with Blue Ocean & Tropical Coastal Feel */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2400&q=85"
          alt="Tropical Beach Horizon - ANAR Travel Agency"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Soft Blue Vignette Overlay to match reference image aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2758]/90 via-[#0d2758]/65 to-transparent dark:from-slate-950/95 dark:via-[#0d2758]/80 dark:to-slate-900/60" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Subtitle, CTA and Social Proof */}
          <div className="lg:col-span-7 space-y-6 text-white">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>🇧🇩 Explore Bangladesh With ANAR</span>
            </div>

            {/* Main Headline - Matches Reference Image Typography */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] drop-shadow-sm">
                Travel Farther,
              </h1>
              <span className="font-script text-amber-400 text-6xl sm:text-7xl lg:text-8xl block font-bold leading-none drop-shadow-md -rotate-1 transform origin-left">
                Live Better
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-blue-50/90 max-w-xl font-medium leading-relaxed drop-shadow">
              Discover breathtaking places across Bangladesh — from the unbroken sands of Cox’s Bazar and the cloud kingdom of Sajek to the royal Sundarbans and floating houseboats of Tanguar Haor.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-amber-500/25 cursor-pointer"
              >
                <span>Explore Bangladesh</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onWatchVideoClick}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-bold text-sm transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-white text-blue-900 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>Watch Video</span>
              </button>

              <button
                onClick={onOpenVoicePlanner}
                className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-sky-500/30 hover:bg-sky-500/40 backdrop-blur-md border border-sky-300/40 text-sky-100 font-bold text-sm transition-all cursor-pointer"
                title="Talk with Gemini Live voice assistant"
              >
                <Mic className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>AI Voice Guide</span>
              </button>
            </div>

            {/* Social Proof Row */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {/* Stacked Avatars */}
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Traveler 1"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Traveler 2"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Traveler 3"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                  alt="Traveler 4"
                />
              </div>

              {/* Star Rating Text */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-white/95">
                  <span className="font-bold">4.95/5</span> from 14,000+ local travelers
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Highlight Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl shadow-blue-950/40 border border-slate-100 transition-all hover:scale-[1.02]">
              
              {/* Top Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black tracking-wide uppercase">
                  Flagship Tour
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Guide
                </span>
              </div>

              {/* Destination Photo Preview */}
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4 group">
                <img
                  src="https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=600&q=80"
                  alt="Cox's Bazar Sea Beach"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-xs font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Cox's Bazar • Marine Drive
                  </span>
                </div>
              </div>

              {/* Package Details */}
              <div className="space-y-1 mb-4">
                <h3 className="text-2xl font-black text-slate-900">
                  Cox's Bazar Deluxe
                </h3>
                <p className="text-sm font-semibold text-slate-500">
                  5-Star Beach Resort & Marine Drive Jeep
                </p>
              </div>

              {/* Metadata tags */}
              <div className="flex items-center gap-4 text-xs font-bold text-slate-600 py-2 border-y border-slate-100 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>4 Days / 3 Nights</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>All Inclusions</span>
                </div>
              </div>

              {/* Price & Book Button */}
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Starting From
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-blue-900">
                      {heroPrice}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      / Per Person
                    </span>
                  </div>
                </div>

                <button
                  onClick={onBookHeroPackage}
                  className="w-full py-3.5 rounded-2xl bg-blue-900 hover:bg-blue-800 active:scale-[0.99] text-white font-extrabold text-sm transition-all shadow-md shadow-blue-900/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Package Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
