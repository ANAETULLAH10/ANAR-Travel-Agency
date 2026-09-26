import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Plane, Hotel, Compass, Filter } from 'lucide-react';

interface SearchFilterProps {
  onSearch: (filters: {
    searchTerm: string;
    checkInDate: string;
    checkOutDate: string;
    travelers: number;
    category: string;
    division: string;
  }) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState<'tours' | 'hotels' | 'flights' | 'guides'>('tours');
  const [searchTerm, setSearchTerm] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-10-15');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-20');
  const [travelers, setTravelers] = useState(2);
  const [division, setDivision] = useState('All');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      searchTerm,
      checkInDate,
      checkOutDate,
      travelers,
      category: activeTab,
      division,
    });
  };

  const quickPicks = ["Cox's Bazar", 'Sajek Valley', 'Sundarbans', 'Sreemangal', "Saint Martin's", 'Tanguar Haor', 'Bandarban', 'Kuakata'];

  return (
    <div className="relative -mt-10 lg:-mt-12 z-30 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-blue-950/10 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 transition-all">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2 border-b border-slate-100 dark:border-slate-800 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('tours')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tours'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Tour Packages</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hotels')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'hotels'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" />
            <span>Hotels & Resorts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('flights')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'flights'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Domestic Flights</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('guides');
              const el = document.getElementById('guides');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guides'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>District Local Guides</span>
          </button>
        </div>

        {/* 4-Field Search Grid */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          {/* 1. Destination Field */}
          <div className="lg:col-span-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400 transition-colors">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Where to?</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Cox's Bazar, Sajek, Sundarbans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* 2. Check In Date */}
          <div className="lg:col-span-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400 transition-colors">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Check In</span>
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-white focus:outline-none"
            />
          </div>

          {/* 3. Check Out Date */}
          <div className="lg:col-span-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400 transition-colors">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Check Out</span>
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-white focus:outline-none"
            />
          </div>

          {/* 4. Travelers Field */}
          <div className="lg:col-span-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400 transition-colors">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Travelers</span>
            </label>
            <select
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value={1} className="dark:bg-slate-900">1 Solo Traveler</option>
              <option value={2} className="dark:bg-slate-900">2 Adults (Couple)</option>
              <option value={3} className="dark:bg-slate-900">3 Travelers</option>
              <option value={4} className="dark:bg-slate-900">4 Family Members</option>
              <option value={6} className="dark:bg-slate-900">6+ Group Tour</option>
            </select>
          </div>

          {/* 5. Bright Yellow Search Button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Search</span>
            </button>
          </div>

        </form>

        {/* Quick Pick Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 text-xs">
          <span className="font-bold text-slate-400 mr-1">Trending:</span>
          {quickPicks.map((pick) => (
            <button
              key={pick}
              type="button"
              onClick={() => {
                setSearchTerm(pick);
                onSearch({
                  searchTerm: pick,
                  checkInDate,
                  checkOutDate,
                  travelers,
                  category: activeTab,
                  division,
                });
              }}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300 text-slate-600 font-semibold transition-colors cursor-pointer"
            >
              {pick}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
