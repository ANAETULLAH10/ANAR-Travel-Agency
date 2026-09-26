import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Check, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Utensils, 
  Sun 
} from 'lucide-react';
import { Destination, CurrencyType } from '../types';

interface DestinationDetailModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyType;
  onBookNow: (dest: Destination) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  isOpen,
  onClose,
  currency,
  onBookNow,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');

  if (!isOpen || !destination) return null;

  const currentPhoto = selectedPhoto || destination.image;
  const priceDisplay = `৳${destination.priceBDT.toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Photo & Gallery Header */}
        <div className="relative h-72 sm:h-80 overflow-hidden bg-slate-950">
          <img
            src={currentPhoto}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badge & Location */}
          <div className="absolute bottom-5 inset-x-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              {destination.badge && (
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
                  {destination.badge}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
                {destination.duration}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {destination.name}
            </h2>

            <p className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{destination.district ? `${destination.district}, ${destination.division}, Bangladesh` : destination.country}</span>
            </p>
          </div>
        </div>

        {/* Thumbnail switcher if gallery exists */}
        {destination.gallery && destination.gallery.length > 1 && (
          <div className="flex gap-2 p-3 px-6 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
            {destination.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhoto(img)}
                className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 transition-all ${
                  currentPhoto === img ? 'ring-2 ring-blue-600' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[55vh] overflow-y-auto">
          
          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
              About This Experience
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {destination.description}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Key Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {destination.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Included Services */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              What's Included
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {destination.inclusions.map((inc, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day by Day Itinerary */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
              Day-by-Day Itinerary
            </h3>
            <div className="space-y-3">
              {destination.itinerary.map((day) => (
                <div 
                  key={day.day} 
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">
                      {day.day}
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Day {day.day}: {day.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                    {day.activities}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Best Time & Local Cuisine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                <Sun className="w-4 h-4" />
                <span>Best Season to Visit</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300">{destination.bestTimeToVisit}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <Utensils className="w-4 h-4" />
                <span>Local Food Specialties</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300">{destination.localSpecialties.join(', ')}</p>
            </div>
          </div>

        </div>

        {/* Footer Pricing & CTA */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Starting Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-blue-900 dark:text-amber-400">
                {priceDisplay}
              </span>
              <span className="text-xs text-slate-500">/ person</span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookNow(destination);
            }}
            className="px-8 py-3 rounded-2xl bg-blue-900 hover:bg-blue-800 active:scale-95 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-900/30 flex items-center gap-2 cursor-pointer"
          >
            <span>Book This Tour</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
