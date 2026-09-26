import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Users, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  Mail, 
  ArrowRight, 
  Clock, 
  Luggage, 
  QrCode,
  Check,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Destination, Booking, CurrencyType, LocalGuide } from '../types';
import { saveBookingToFirestore } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface BookingModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyType;
  currentUser: FirebaseUser | null;
  selectedPlanName?: Booking['planType'];
  guides: LocalGuide[];
  onBookingSuccess: (booking: Booking) => void;
  onViewMyBookings?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  destination,
  isOpen,
  onClose,
  currency,
  currentUser,
  selectedPlanName = 'Standard',
  guides,
  onBookingSuccess,
  onViewMyBookings,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [travelDate, setTravelDate] = useState('2026-10-15');
  const [returnDate, setReturnDate] = useState('2026-10-19');
  const [travelers, setTravelers] = useState(2);
  const [planType, setPlanType] = useState<Booking['planType']>(selectedPlanName);
  
  // Guest Details
  const [name, setName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('+880 1712-');
  const [departureCity, setDepartureCity] = useState('Dhaka');
  const [specialRequests, setSpecialRequests] = useState('');
  const [assignedGuideId, setAssignedGuideId] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<Booking['paymentMethod']>('bKash');
  const [bkashNumber, setBkashNumber] = useState('018');
  const [trxId, setTrxId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen || !destination) return null;

  // Filter available guides for this destination's district or division
  const matchingGuides = guides.filter(
    (g) => g.district.toLowerCase().includes(destination.district.toLowerCase()) || 
           g.division === destination.division
  );

  // Calculate pricing
  const baseRateBDT = destination.priceBDT;
  const baseRateUSD = destination.priceUSD;
  const planMultiplier = planType === 'Family Vacation' ? 2.2 : planType === 'Couple Getaway' ? 1.8 : planType === 'Solo Explorer' ? 0.9 : 1.0;
  
  const totalPriceBDT = Math.round(baseRateBDT * travelers * (planMultiplier / 2));
  const totalPriceUSD = Math.round(baseRateUSD * travelers * (planMultiplier / 2));

  const displayTotal = `৳${totalPriceBDT.toLocaleString()}`;

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill in your name, email, and phone number.');
      return;
    }
    setStep(3);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const bookingId = 'ANAR-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const assignedGuide = matchingGuides.find((g) => g.id === assignedGuideId);

    const newBooking: Booking = {
      id: bookingId,
      userId: currentUser?.uid,
      userEmail: email.trim(),
      userName: name.trim(),
      userPhone: phone.trim(),
      destinationId: destination.id,
      destinationName: destination.name,
      destinationImage: destination.image,
      travelDate,
      returnDate,
      travelers,
      planType,
      totalPriceBDT,
      totalPriceUSD,
      currency,
      paymentMethod,
      paymentStatus: paymentMethod === 'CashOnTour' ? 'Partial Advance (20%)' : 'Paid',
      bookingStatus: 'Confirmed',
      assignedGuideId: assignedGuide?.id,
      assignedGuideName: assignedGuide?.name,
      transactionId: trxId || (paymentMethod === 'Card' ? 'TXN-CARD-' + Math.floor(Math.random() * 999999) : 'BKASH-' + Math.random().toString(36).substring(2, 9).toUpperCase()),
      specialRequests: specialRequests.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const savedId = await saveBookingToFirestore(newBooking);
      newBooking.id = savedId;
      setConfirmedBooking(newBooking);
      onBookingSuccess(newBooking);
      setStep(4);

      // Trigger festive celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Booking confirmation failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 px-6 bg-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Trip Booking & Bangladeshi Gateway
              </h3>
              <p className="text-xs text-blue-200">
                {destination.name} • {destination.district || destination.country}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Indicators */}
        <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 text-center text-xs font-bold bg-slate-50 dark:bg-slate-950/40">
          <div className={`py-3 ${step >= 1 ? 'text-blue-600 dark:text-amber-400 border-b-2 border-blue-600 dark:border-amber-400' : 'text-slate-400'}`}>
            1. Trip & Plan
          </div>
          <div className={`py-3 ${step >= 2 ? 'text-blue-600 dark:text-amber-400 border-b-2 border-blue-600 dark:border-amber-400' : 'text-slate-400'}`}>
            2. Guest Details
          </div>
          <div className={`py-3 ${step >= 3 ? 'text-blue-600 dark:text-amber-400 border-b-2 border-blue-600 dark:border-amber-400' : 'text-slate-400'}`}>
            3. Payment (bKash/Card)
          </div>
        </div>

        {/* Step 1: Trip & Plan Selection */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div>
                <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400">
                  {destination.duration}
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {destination.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {destination.district ? `${destination.district}, ${destination.division} Division` : destination.country}
                </p>
              </div>
            </div>

            {/* Travel Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Return Date
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Number of Travelers */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Number of Travelers
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTravelers(num)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      travelers === num
                        ? 'bg-blue-900 text-white shadow'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {num} {num === 1 ? 'Person' : 'People'}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Tier selection */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Select Package Tier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Standard', 'Solo Explorer', 'Couple Getaway', 'Family Vacation'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setPlanType(tier)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      planType === tier
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-blue-950 dark:text-white font-extrabold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold'
                    }`}
                  >
                    <span className="text-xs block">{tier}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Estimated Total</span>
                <p className="text-2xl font-black text-blue-900 dark:text-amber-400">{displayTotal}</p>
                <p className="text-[11px] text-slate-500">Includes all taxes, guide & resort accommodations</p>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-extrabold flex items-center gap-2 shadow cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Guest Information */}
        {step === 2 && (
          <form onSubmit={handleNextToPayment} className="p-6 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Primary Traveler Details
            </h4>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Md. Tanvir Rahman"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Bangladeshi Mobile Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1712-345678"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Departure / Pickup City
                </label>
                <select
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Dhaka">Dhaka (Hazrat Shahjalal Airport / Sayedabad / Gabtoli)</option>
                  <option value="Chittagong">Chittagong (Amanat Airport / GEC / Dampara)</option>
                  <option value="Sylhet">Sylhet (Osmani Airport / Kadamtali)</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Cox's Bazar">Direct at Cox's Bazar</option>
                </select>
              </div>

              {/* Optional Local Guide Assignment */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Assign District Local Guide
                </label>
                <select
                  value={assignedGuideId}
                  onChange={(e) => setAssignedGuideId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="">Agency Auto-Assigned Best Guide</option>
                  {matchingGuides.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.district} • ★{g.rating})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Special Requests or Dietary Preferences
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Vegetarian meals, sea-facing high floor, child cot, airport pickup..."
                className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-extrabold flex items-center gap-2 shadow cursor-pointer"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Bangladeshi Payment Gateway (bKash, Nagad, Card) */}
        {step === 3 && (
          <form onSubmit={handleConfirmBooking} className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">
                Select Payment Method
              </h4>
              
              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bKash')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'bKash'
                      ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 font-extrabold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-black text-pink-600">bKash</span>
                  <span className="text-[10px] text-slate-500">Merchant Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Nagad')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'Nagad'
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 font-extrabold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-black text-orange-600">Nagad</span>
                  <span className="text-[10px] text-slate-500">Instant Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'Card'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-extrabold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-black">Visa / Master</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CashOnTour')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'CashOnTour'
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-extrabold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black">20% Advance</span>
                </button>
              </div>
            </div>

            {/* bKash Instructions & Verification UI */}
            {paymentMethod === 'bKash' && (
              <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-pink-700 dark:text-pink-300 text-xs font-bold">
                    <span className="px-2 py-0.5 rounded bg-pink-600 text-white text-[10px] font-black">bKash</span>
                    <span>Merchant Number: 01800-ANAR-TRV (01800262787)</span>
                  </div>
                  <span className="text-xs font-black text-pink-700 dark:text-pink-300">{displayTotal}</span>
                </div>

                <p className="text-[11px] text-pink-950/80 dark:text-pink-200 leading-relaxed">
                  1. Dial *247# or open bKash App &gt; Select <strong>Make Payment</strong><br />
                  2. Enter Merchant: <strong>01800262787</strong> • Amount: <strong>{displayTotal}</strong> • Reference: <strong>ANAR</strong><br />
                  3. Enter your bKash Mobile Number and 10-digit Transaction ID (TrxID) below:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Your bKash Number</label>
                    <input
                      type="text"
                      required
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      placeholder="018XXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white border border-pink-300 dark:border-pink-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Transaction ID (TrxID)</label>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 9J4K2L8P"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold uppercase text-slate-900 dark:text-white border border-pink-300 dark:border-pink-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Nagad UI */}
            {paymentMethod === 'Nagad' && (
              <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-700 dark:text-orange-300">
                    Nagad Merchant Account: 01712-998877
                  </span>
                  <span className="text-xs font-black text-orange-700 dark:text-orange-300">{displayTotal}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Nagad Wallet Number</label>
                    <input
                      type="text"
                      required
                      placeholder="017XXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white border border-orange-300 dark:border-orange-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Nagad TrxID</label>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 7N3G1D9Q"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold uppercase text-slate-900 dark:text-white border border-orange-300 dark:border-orange-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Card UI */}
            {paymentMethod === 'Card' && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      required
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cash on Tour Option */}
            {paymentMethod === 'CashOnTour' && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs space-y-1">
                <p className="font-bold">Pay 20% Advance Online & 80% on Tour Arrival</p>
                <p>Advance booking fee: <strong>৳{Math.round(totalPriceBDT * 0.2).toLocaleString()}</strong> will secure your hotel and transport booking.</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{submitting ? 'Confirming Booking...' : `Confirm & Pay ${displayTotal}`}</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Booking Confirmation & Digital Voucher */}
        {step === 4 && confirmedBooking && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase">
                Booking Confirmed & Recorded in Database
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                Get Ready for Your Journey!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                A confirmation SMS and voucher receipt have been issued for booking <strong className="text-blue-600 dark:text-amber-400">#{confirmedBooking.id}</strong>.
              </p>
            </div>

            {/* Voucher Box */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Destination</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">{confirmedBooking.destinationName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Booking ID</p>
                  <p className="text-xs font-mono font-bold text-blue-900 dark:text-amber-400">{confirmedBooking.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Dates</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{confirmedBooking.travelDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Travelers</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{confirmedBooking.travelers} Guests</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Payment</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{confirmedBooking.paymentMethod} ({confirmedBooking.paymentStatus})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Total</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">৳{confirmedBooking.totalPriceBDT.toLocaleString()}</span>
                </div>
              </div>

              {confirmedBooking.assignedGuideName && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                  <span className="text-[10px] text-slate-400">Assigned Local Guide: </span>
                  <span className="font-bold text-blue-900 dark:text-amber-400">{confirmedBooking.assignedGuideName}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {onViewMyBookings ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewMyBookings();
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Luggage className="w-4 h-4 text-slate-950" />
                  <span>View in My Bookings</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-900 hover:bg-blue-800 active:scale-95 text-white text-xs font-black shadow-md shadow-blue-900/25 cursor-pointer transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
