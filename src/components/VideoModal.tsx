import React from 'react';
import { X, Sparkles, MapPin } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, onBookNow }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-950 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col">
        
        {/* Top Bar */}
        <div className="p-4 px-6 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              ANAR Travel Agency • Cinematic Destinations
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/ScMzIvxBSi4?autoplay=1&mute=1&loop=1&playlist=ScMzIvxBSi4&controls=1"
            title="ANAR Travel Cinematic Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Bottom Banner */}
        <div className="p-5 px-6 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">
              Ready to experience these breathtaking views in person?
            </h4>
            <p className="text-xs text-slate-400">
              All tours include guaranteed reservations, verified local guides, and flexible payments.
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookNow();
            }}
            className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all shadow cursor-pointer shrink-0"
          >
            Book This Trip Now
          </button>
        </div>

      </div>
    </div>
  );
};
