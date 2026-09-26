import React, { useState } from 'react';
import { 
  Compass, 
  User as UserIcon, 
  Menu, 
  X, 
  Mic, 
  Luggage, 
  LogOut,
  BookOpen
} from 'lucide-react';
import { CurrencyType } from '../types';
import { User } from 'firebase/auth';

interface NavbarProps {
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  currency?: CurrencyType;
  setCurrency?: (val: CurrencyType) => void;
  user: User | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenBookings: () => void;
  onOpenVoicePlanner: () => void;
  activeBookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onSignOut,
  onOpenBookings,
  onOpenVoicePlanner,
  activeBookingsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d2758] text-white border-b border-blue-900/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - ANAR Travel Agency */}
          <div 
            onClick={() => scrollToSection('hero')} 
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-full border-2 border-amber-400 bg-white/10 flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-inner">
              <Compass className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex flex-col -space-y-0.5">
              <span className="text-2xl font-black tracking-tight text-white flex items-center">
                ANAR<span className="text-amber-400 font-black">+</span>
              </span>
              <span className="text-[10px] font-extrabold tracking-widest text-blue-200 uppercase">
                Travel Agency
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-semibold text-white/90">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="text-white hover:text-amber-300 font-bold border-b-2 border-white pb-1 transition-all cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('destinations')} 
              className="text-blue-100 hover:text-white transition-colors cursor-pointer"
            >
              Destinations
            </button>
            <button 
              onClick={() => scrollToSection('plans')} 
              className="text-blue-100 hover:text-white transition-colors cursor-pointer"
            >
              Tour Packages
            </button>
            <button 
              onClick={() => scrollToSection('guides')} 
              className="text-blue-100 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>District Guides</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                64 Districts
              </span>
            </button>
            <button 
              onClick={() => scrollToSection('deals')} 
              className="text-blue-100 hover:text-white transition-colors cursor-pointer"
            >
              Deals
            </button>
            
            {/* Added Blog Section Navigation Link */}
            <button 
              onClick={() => scrollToSection('blogs')} 
              className="text-blue-100 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-bold"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Travel Blogs</span>
              <span className="bg-blue-800 text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                ১০টি
              </span>
            </button>

            <button 
              onClick={() => scrollToSection('about')} 
              className="text-blue-100 hover:text-white transition-colors cursor-pointer"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('footer')} 
              className="text-blue-100 hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Controls: Voice AI, My Bookings, Sign In button (BDT / Taka badge removed as requested) */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Voice AI Header Button */}
            <button
              onClick={onOpenVoicePlanner}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
              title="Voice AI Trip Planner"
            >
              <Mic className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
              <span>Voice AI</span>
            </button>

            {/* My Bookings */}
            <button
              onClick={onOpenBookings}
              className="relative p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="View My Bookings"
            >
              <Luggage className="w-4 h-4" />
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center shadow">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            {/* User Profile / Sign In Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#0d2758] font-bold text-xs shadow-md hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="User" 
                      className="w-5 h-5 rounded-full object-cover" 
                    />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5" />
                  )}
                  <span className="max-w-[90px] truncate">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'Traveler'}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-2 z-50">
                    <p className="px-3 py-1.5 text-xs text-slate-500 font-semibold truncate border-b border-slate-100">
                      {user.email}
                    </p>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenBookings();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-900 rounded-xl transition-colors cursor-pointer"
                    >
                      My Bookings
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-[#0d2758] font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#0d2758]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Hamburger Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile screen triggers */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={onOpenVoicePlanner}
              className="p-2 rounded-full bg-amber-400 text-slate-950 font-black text-xs"
              title="Voice AI"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="bg-[#0b1f47] border-t border-blue-900 px-4 py-5 space-y-3 sm:hidden">
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-white">
            <button onClick={() => scrollToSection('hero')} className="text-left py-1.5">Home</button>
            <button onClick={() => scrollToSection('destinations')} className="text-left py-1.5">Destinations</button>
            <button onClick={() => scrollToSection('plans')} className="text-left py-1.5">Packages</button>
            <button onClick={() => scrollToSection('guides')} className="text-left py-1.5">District Guides</button>
            <button onClick={() => scrollToSection('deals')} className="text-left py-1.5">Deals</button>
            <button onClick={() => scrollToSection('blogs')} className="text-left py-1.5 text-amber-300 font-bold flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Travel Blogs</span>
            </button>
            <button onClick={() => scrollToSection('about')} className="text-left py-1.5">About Us</button>
            <button onClick={() => scrollToSection('footer')} className="text-left py-1.5">Contact</button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVoicePlanner();
              }}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Voice AI Planner</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookings();
              }}
              className="w-full py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold"
            >
              My Bookings ({activeBookingsCount})
            </button>
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="w-full py-2 rounded-xl bg-red-500/20 text-red-300 text-xs font-bold"
              >
                Sign Out ({user.email})
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 rounded-xl bg-white text-[#0d2758] text-xs font-extrabold shadow"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
