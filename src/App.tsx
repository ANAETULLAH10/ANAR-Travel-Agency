/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SearchFilter } from './components/SearchFilter';
import { PopularDestinations } from './components/PopularDestinations';
import { WhyTravelWithUs } from './components/WhyTravelWithUs';
import { RecommendationFilter } from './components/RecommendationFilter';
import { TopDeals } from './components/TopDeals';
import { AdventureBanner } from './components/AdventureBanner';
import { DistrictGuides } from './components/DistrictGuides';
import { BlogSection } from './components/BlogSection';
import { GuideChatModal } from './components/GuideChatModal';
import { VoicePlannerModal } from './components/VoicePlannerModal';
import { TestimonialsAndReviews } from './components/TestimonialsAndReviews';
import { ChooseYourPlan } from './components/ChooseYourPlan';
import { BookingModal } from './components/BookingModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { VoucherReceiptModal } from './components/VoucherReceiptModal';
import { AuthModal } from './components/AuthModal';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { VideoModal } from './components/VideoModal';
import { NewsletterAndFooter } from './components/NewsletterAndFooter';

import { DESTINATIONS_DATA } from './data/destinations';
import { LOCAL_GUIDES_DATA } from './data/guides';
import { INITIAL_REVIEWS } from './data/reviews';
import { Destination, LocalGuide, Booking, UserReview, CurrencyType } from './types';
import { auth, fetchUserBookings, fetchReviewsFromFirestore, logOut } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function App() {
  // Pure Bangladeshi Currency (BDT ৳)
  const currency: CurrencyType = 'BDT';

  // Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // Data Collections (100% Bangladeshi Destinations)
  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS_DATA);
  const [guides] = useState<LocalGuide[]>(LOCAL_GUIDES_DATA);
  const [reviews, setReviews] = useState<UserReview[]>(INITIAL_REVIEWS);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [bookingsModalOpen, setBookingsModalOpen] = useState(false);
  const [voicePlannerOpen, setVoicePlannerOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  
  // Selection Modals
  const [selectedDestinationForDetail, setSelectedDestinationForDetail] = useState<Destination | null>(null);
  const [bookingDestination, setBookingDestination] = useState<Destination | null>(null);
  const [selectedPlanTier, setSelectedPlanTier] = useState<Booking['planType']>('Standard');
  const [chatGuide, setChatGuide] = useState<LocalGuide | null>(null);
  const [voucherBooking, setVoucherBooking] = useState<Booking | null>(null);

  // Force clean theme (no dark mode button)
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('anar_theme');
  }, []);

  // Firebase Auth Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      loadBookings(user?.email || undefined, user?.uid || undefined);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Firestore Reviews & Bookings on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const firestoreReviews = await fetchReviewsFromFirestore();
        if (firestoreReviews && firestoreReviews.length > 0) {
          setReviews(firestoreReviews);
        }
      } catch (e) {
        console.warn('Reviews fetch fallback to initial data:', e);
      }
      loadBookings();
    };
    loadData();
  }, []);

  const loadBookings = async (email?: string, uid?: string) => {
    try {
      const list = await fetchUserBookings(email, uid);
      setUserBookings(list);
    } catch (e) {
      console.warn('Bookings load fallback:', e);
    }
  };

  // Search Filter Handler
  const handleSearch = (filters: {
    searchTerm: string;
    checkInDate: string;
    checkOutDate: string;
    travelers: number;
    category: string;
    division: string;
  }) => {
    const term = filters.searchTerm.trim().toLowerCase();
    const filtered = DESTINATIONS_DATA.filter((dest) => {
      const matchName = dest.name.toLowerCase().includes(term) || (dest.nameBn && dest.nameBn.toLowerCase().includes(term));
      const matchDistrict = dest.district.toLowerCase().includes(term);
      const matchDivision = filters.division === 'All' ? true : dest.division === filters.division;
      return (term === '' || matchName || matchDistrict) && matchDivision;
    });

    setDestinations(filtered.length > 0 ? filtered : DESTINATIONS_DATA);
    
    // Scroll to destinations
    const el = document.getElementById('destinations');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Recommendation Filter Handler (100% Bangladeshi plans & BDT)
  const handleRecommendation = (preference: string, budgetRange: string) => {
    const filtered = DESTINATIONS_DATA.filter((dest) => {
      let prefMatch = true;
      if (preference === 'Beach') prefMatch = dest.category === 'Beach';
      if (preference === 'Hill') prefMatch = dest.category === 'Hill';
      if (preference === 'Forest') prefMatch = dest.category === 'Forest';
      if (preference === 'Haor') prefMatch = dest.category === 'Haor & River';
      if (preference === 'Heritage') prefMatch = dest.category === 'Heritage';

      let budgetMatch = true;
      if (budgetRange === 'budget') budgetMatch = dest.priceBDT <= 10000;
      if (budgetRange === 'moderate') budgetMatch = dest.priceBDT > 10000 && dest.priceBDT <= 20000;
      if (budgetRange === 'luxury') budgetMatch = dest.priceBDT > 20000;

      return prefMatch && budgetMatch;
    });

    setDestinations(filtered.length > 0 ? filtered : DESTINATIONS_DATA);
    const el = document.getElementById('destinations');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Start booking for a destination
  const handleOpenBooking = (dest: Destination, planTier: Booking['planType'] = 'Standard') => {
    setBookingDestination(dest);
    setSelectedPlanTier(planTier);
  };

  // Booking from Choose Your Plan
  const handleSelectPlanTier = (planName: 'Solo Explorer' | 'Couple Getaway' | 'Family Vacation') => {
    const defDest = DESTINATIONS_DATA[0]; // Cox's Bazar Flagship
    handleOpenBooking(defDest, planName);
  };

  // Sign out
  const handleSignOut = async () => {
    await logOut();
    setCurrentUser(null);
  };

  // Booking confirmed handler
  const handleBookingConfirmed = (newBooking: Booking) => {
    setUserBookings((prev) => [newBooking, ...prev]);
  };

  // Booking cancelled handler
  const handleBookingCancelled = (bookingId: string) => {
    setUserBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: 'Cancelled' as const } : b))
    );
  };

  // New review added
  const handleReviewAdded = (newReview: UserReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 transition-colors duration-200">
      
      {/* 1. Header Navigation Bar (without BDT / currency badge) */}
      <Navbar
        currency={currency}
        user={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onOpenBookings={() => setBookingsModalOpen(true)}
        onOpenVoicePlanner={() => setVoicePlannerOpen(true)}
        activeBookingsCount={userBookings.filter((b) => b.bookingStatus === 'Confirmed').length}
      />

      <main>
        {/* 2. Cinematic Hero Section */}
        <Hero
          currency={currency}
          onExploreClick={() => {
            const el = document.getElementById('destinations');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onWatchVideoClick={() => setVideoModalOpen(true)}
          onBookHeroPackage={() => handleOpenBooking(DESTINATIONS_DATA[0], 'Couple Getaway')}
          onOpenVoicePlanner={() => setVoicePlannerOpen(true)}
        />

        {/* 3. Floating Search Interface */}
        <SearchFilter onSearch={handleSearch} />

        {/* 4. Popular Destinations Grid (10 Single Dedicated Packages) */}
        <PopularDestinations
          destinations={destinations}
          currency={currency}
          onSelectDestination={(dest) => setSelectedDestinationForDetail(dest)}
          onBookNow={(dest) => handleOpenBooking(dest)}
        />

        {/* 5. Why Travel With Us Deep Blue Banner */}
        <WhyTravelWithUs />

        {/* 6. "Not sure where to go?" Interactive Recommendation Box with Neumorphic Dropdowns */}
        <RecommendationFilter onShowRecommendations={handleRecommendation} />

        {/* 7. Top Deals & Special Offers in BDT */}
        <TopDeals
          destinations={DESTINATIONS_DATA}
          currency={currency}
          onSelectDestination={(dest) => setSelectedDestinationForDetail(dest)}
          onBookNow={(dest) => handleOpenBooking(dest)}
        />

        {/* 8. Cinematic Drone Adventure Banner */}
        <AdventureBanner
          onWatchVideo={() => setVideoModalOpen(true)}
          onExploreClick={() => {
            const el = document.getElementById('destinations');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 9. Bangladeshi Local District Guides & Real-time Chat */}
        <DistrictGuides
          guides={guides}
          currency={currency}
          onOpenChat={(guide) => setChatGuide(guide)}
          onBookGuide={(guide) => {
            const matchDest = DESTINATIONS_DATA.find((d) => d.district.toLowerCase().includes(guide.district.toLowerCase())) || DESTINATIONS_DATA[0];
            handleOpenBooking(matchDest);
          }}
        />

        {/* 10. Travel Blog Section with Complete Guides for all 10 Destinations */}
        <BlogSection
          destinations={destinations}
          onBookDestination={(dest) => handleOpenBooking(dest)}
        />

        {/* 11. Customer Testimonials & Live User Review System */}
        <TestimonialsAndReviews
          reviews={reviews}
          currentUser={currentUser}
          onReviewAdded={handleReviewAdded}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

        {/* 12. Choose Your Perfect Plan in BDT */}
        <ChooseYourPlan
          currency={currency}
          onSelectPlan={handleSelectPlanTier}
        />
      </main>

      {/* 13. Newsletter Subscription & Detailed Footer */}
      <NewsletterAndFooter />

      {/* PERMANENT COMPACT ROUND FLOATING VOICE AI IN RIGHT-DOWN CORNER */}
      <div className="fixed bottom-6 right-6 z-50 group flex items-center justify-center">
        <button
          type="button"
          onClick={() => setVoicePlannerOpen(true)}
          className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-tr from-[#0d2758] to-blue-900 border-2 border-amber-400 text-white shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer shadow-blue-950/40"
          title="ANAR Voice AI - কথা বলে ট্যুর খুঁজুন"
          aria-label="Voice AI Trip Planner"
        >
          {/* Animated Glowing Ring */}
          <span className="absolute -inset-1 rounded-full bg-amber-400 opacity-30 animate-ping pointer-events-none" />

          {/* Inner Mic Icon */}
          <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-inner">
            <Mic className="w-5 h-5 text-slate-950 animate-pulse stroke-[2.5]" />
          </div>

          {/* Mini Live Dot Badge */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow" />
        </button>

        {/* Sleek Tooltip on Hover */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-[11px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-slate-700">
          ভয়েস এআই দিয়ে ট্যুর খুঁজুন 🎙️
        </div>
      </div>

      {/* MODALS */}

      {/* Destination Detail Itinerary Modal */}
      <DestinationDetailModal
        destination={selectedDestinationForDetail}
        isOpen={Boolean(selectedDestinationForDetail)}
        onClose={() => setSelectedDestinationForDetail(null)}
        currency={currency}
        onBookNow={(dest) => {
          setSelectedDestinationForDetail(null);
          handleOpenBooking(dest);
        }}
      />

      {/* Complete Booking & Bangladeshi Payment Modal */}
      <BookingModal
        destination={bookingDestination}
        isOpen={Boolean(bookingDestination)}
        onClose={() => setBookingDestination(null)}
        currency={currency}
        currentUser={currentUser}
        selectedPlanName={selectedPlanTier}
        guides={guides}
        onBookingSuccess={handleBookingConfirmed}
        onViewMyBookings={() => setBookingsModalOpen(true)}
      />

      {/* Real-Time Guide Chat Modal */}
      <GuideChatModal
        guide={chatGuide}
        isOpen={Boolean(chatGuide)}
        onClose={() => setChatGuide(null)}
        currentUser={currentUser}
        onBookGuide={(guide) => {
          setChatGuide(null);
          const matchDest = DESTINATIONS_DATA.find((d) => d.district.toLowerCase().includes(guide.district.toLowerCase())) || DESTINATIONS_DATA[0];
          handleOpenBooking(matchDest);
        }}
      />

      {/* Gemini Live Voice Concierge Modal */}
      <VoicePlannerModal
        isOpen={voicePlannerOpen}
        onClose={() => setVoicePlannerOpen(false)}
        onSelectDestinationById={(id) => {
          const dest = DESTINATIONS_DATA.find((d) => d.id === id);
          if (dest) {
            setVoicePlannerOpen(false);
            setSelectedDestinationForDetail(dest);
          }
        }}
      />

      {/* My Bookings History & Management Modal */}
      <MyBookingsModal
        isOpen={bookingsModalOpen}
        onClose={() => setBookingsModalOpen(false)}
        bookings={userBookings}
        currency={currency}
        onBookingCancelled={handleBookingCancelled}
        onViewVoucher={(b) => setVoucherBooking(b)}
      />

      {/* Official Voucher Receipt Modal */}
      <VoucherReceiptModal
        isOpen={Boolean(voucherBooking)}
        onClose={() => setVoucherBooking(null)}
        booking={voucherBooking}
        currency={currency}
      />

      {/* Auth Modal with Neumorphism UI */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          loadBookings(auth.currentUser?.email || undefined, auth.currentUser?.uid || undefined);
        }}
      />

      {/* Video Preview Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onBookNow={() => {
          setVideoModalOpen(false);
          handleOpenBooking(DESTINATIONS_DATA[0]);
        }}
      />

    </div>
  );
}
