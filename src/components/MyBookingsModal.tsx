import React, { useState } from 'react';
import { 
  X, 
  Luggage, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  FileText, 
  Trash2, 
  MapPin, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { Booking, CurrencyType } from '../types';
import { cancelBookingInFirestore } from '../lib/firebase';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  currency: CurrencyType;
  onBookingCancelled: (bookingId: string) => void;
  onOpenGuideChat?: (guideId?: string, guideName?: string) => void;
  onViewVoucher?: (booking: Booking) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  currency,
  onBookingCancelled,
  onOpenGuideChat,
  onViewVoucher,
}) => {
  const [filter, setFilter] = useState<'All' | 'Confirmed' | 'Cancelled'>('All');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'Confirmed') return b.bookingStatus === 'Confirmed';
    if (filter === 'Cancelled') return b.bookingStatus === 'Cancelled';
    return true;
  });

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Full refund is processed according to ANAR cancellation policy.')) {
      return;
    }
    setCancellingId(bookingId);
    try {
      await cancelBookingInFirestore(bookingId);
      onBookingCancelled(bookingId);
    } catch (err) {
      console.error('Cancellation error:', err);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 px-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-amber-400 flex items-center justify-center font-bold">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                My Travel Bookings ({bookings.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your trips, download receipts, and contact your assigned guide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          {(['All', 'Confirmed', 'Cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Luggage className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                No bookings found in this category.
              </p>
              <p className="text-xs text-slate-400">
                Explore our popular destinations and packages to start your next adventure!
              </p>
            </div>
          ) : (
            filteredBookings.map((b) => {
              const price = `৳${b.totalPriceBDT.toLocaleString()}`;
              const isConfirmed = b.bookingStatus === 'Confirmed';

              return (
                <div
                  key={b.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={b.destinationImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80'}
                      alt={b.destinationName}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-amber-400">
                          #{b.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {b.destinationName}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {b.travelDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {b.travelers} Guests
                        </span>
                        <span>
                          {b.paymentMethod} ({b.paymentStatus})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right actions and price */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-700">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {price}
                    </span>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          if (onViewVoucher) {
                            onViewVoucher(b);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/80 text-blue-900 dark:text-amber-400 hover:bg-blue-50 dark:hover:bg-slate-700 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        title="View Official Travel Ticket & Details"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Ticket</span>
                      </button>

                      {isConfirmed && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          disabled={cancellingId === b.id}
                          className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        >
                          {cancellingId === b.id ? 'Cancelling...' : 'Cancel Trip'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
