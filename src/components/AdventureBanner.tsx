import React from 'react';
import { Play, Compass, ArrowRight } from 'lucide-react';

interface AdventureBannerProps {
  onWatchVideo: () => void;
  onExploreClick: () => void;
}

export const AdventureBanner: React.FC<AdventureBannerProps> = ({
  onWatchVideo,
  onExploreClick,
}) => {
  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[320px] flex items-center justify-center text-center p-8 shadow-2xl">
        
        {/* Background Aerial Drone Beach Image */}
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85"
          alt="Aerial Coastal Adventure"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Deep Oceanic Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/70 to-blue-950/85" />

        {/* Center Content */}
        <div className="relative z-10 max-w-2xl mx-auto space-y-4 text-white">
          
          {/* Main Headline with Script Font */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Your next adventure
            </h2>
            <span className="font-script text-amber-400 text-5xl sm:text-6xl lg:text-7xl block font-bold leading-none mt-1 -rotate-1">
              starts here!
            </span>
          </div>

          {/* Center Play Button */}
          <div className="py-2">
            <button
              onClick={onWatchVideo}
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer group"
              title="Watch destination cinematic preview"
            >
              <Play className="w-6 h-6 fill-white ml-0.5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-blue-100 uppercase">
            Amazing destinations • Unbeatable prices • Memories for a lifetime
          </p>

          {/* Action button */}
          <div>
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-blue-950 hover:bg-blue-50 font-extrabold text-xs transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
