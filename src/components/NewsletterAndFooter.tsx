import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Compass, 
  Phone, 
  MapPin, 
  Heart, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { subscribeNewsletterInFirestore } from '../lib/firebase';

export const NewsletterAndFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setLoading(true);
    try {
      await subscribeNewsletterInFirestore(email.trim());
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err) {
      console.error('Newsletter error:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="mt-16 bg-blue-950 text-white">
      
      {/* Blue Newsletter Bar - Matches Reference Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800/80 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Subscribe to our newsletter
              </h3>
              <p className="text-xs sm:text-sm font-medium text-blue-200">
                Get exclusive secret deals, travel tips, and seasonal trip inspiration directly to your inbox.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
              />
              <Send className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer shrink-0"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

        </div>

        {subscribed && (
          <div className="mt-2 text-center text-xs font-bold text-amber-300 animate-fade-in">
            ✓ Successfully subscribed to ANAR Travel updates! Welcome aboard.
          </div>
        )}
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Socials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  ANAR<span className="text-amber-400">+</span>
                </span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  Travel Agency
                </p>
              </div>
            </div>

            <p className="text-xs text-blue-200/80 leading-relaxed max-w-sm">
              Your trusted travel partner for unforgettable journeys across Bangladesh and worldwide. Licensed by the Ministry of Civil Aviation and Tourism, Government of Bangladesh.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {['Facebook', 'Instagram', 'YouTube', 'Twitter'].map((net) => (
                <span
                  key={net}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
                  title={net}
                >
                  {net[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-blue-200">
              <li>
                <button onClick={() => scrollTo('hero')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('destinations')} className="hover:text-white transition-colors cursor-pointer">
                  Destinations
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('guides')} className="hover:text-white transition-colors cursor-pointer">
                  Local District Guides
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('deals')} className="hover:text-white transition-colors cursor-pointer">
                  Top Deals & Packages
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('reviews')} className="hover:text-white transition-colors cursor-pointer">
                  Customer Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Top Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Top Destinations
            </h4>
            <ul className="space-y-2 text-xs text-blue-200">
              <li>Cox's Bazar & Marine Drive</li>
              <li>Sajek Valley & Cloud Kingdom</li>
              <li>Sundarbans Mangrove Safari</li>
              <li>Sreemangal Tea Estates</li>
              <li>Saint Martin's Coral Island</li>
              <li>Tanguar Haor Luxury Houseboat</li>
              <li>Maldives Overwater Getaway</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Contact Us
            </h4>
            <div className="space-y-2.5 text-xs text-blue-200">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">+880 1800-ANAR-TRV</p>
                  <p className="text-[11px] text-blue-300">+880 1712-345678 (24/7 Hotline)</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>support@anartravel.com</p>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>Banani Road 11, Block D, Dhaka 1213, Bangladesh</p>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright Line - Matches Reference Image */}
        <div className="mt-12 pt-8 border-t border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-blue-300">
          <p>© 2026 ANAR Travel Agency. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Payment Policy (bKash/Nagad)</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
