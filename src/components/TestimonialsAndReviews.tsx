import React, { useState } from 'react';
import { Star, Quote, ArrowRight, PlusCircle, CheckCircle2, ShieldCheck, Users, MapPin, ThumbsUp } from 'lucide-react';
import { UserReview } from '../types';
import { saveReviewToFirestore } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface TestimonialsAndReviewsProps {
  reviews: UserReview[];
  currentUser: FirebaseUser | null;
  onReviewAdded: (newReview: UserReview) => void;
  onOpenAuth: () => void;
}

export const TestimonialsAndReviews: React.FC<TestimonialsAndReviewsProps> = ({
  reviews,
  currentUser,
  onReviewAdded,
  onOpenAuth,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [destinationName, setDestinationName] = useState("Cox's Bazar & Saint Martin's Island");
  const [comment, setComment] = useState('');
  const [userLocation, setUserLocation] = useState('Dhaka, Bangladesh');
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    const newRev: Omit<UserReview, 'id'> = {
      userName: currentUser?.displayName || 'Authentic Traveler',
      userLocation: userLocation || 'Bangladesh',
      userAvatar: currentUser?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      destinationName,
      rating,
      comment: comment.trim(),
      date: 'Just now',
      verifiedTrip: true,
    };

    try {
      const docId = await saveReviewToFirestore(newRev);
      onReviewAdded({ ...newRev, id: docId });
      setShowAddModal(false);
      setComment('');
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    } catch (err) {
      console.error('Error saving review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header - Matches Reference Image */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            What Travelers Say
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Real stories from travelers who explored with ANAR Travel Agency
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Thank you! Your verified review has been submitted to the ANAR database and published live.</span>
        </div>
      )}

      {/* Layout: Reviews Cards (Left 3 columns) + Right Metrics Box (Matches Reference Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Testimonial Quote Cards (3 columns) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <Quote className="w-8 h-8 text-blue-200 dark:text-blue-900 mb-3" />
                
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic line-clamp-4">
                  "{rev.comment}"
                </p>

                <div className="flex text-amber-400 gap-0.5 my-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={rev.userAvatar}
                  alt={rev.userName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/50"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {rev.userName}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {rev.userLocation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Stats Block - Matches Reference Image exactly: 25,000+ Happy Travelers, 150+ Destinations, 98% Satisfaction */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 flex flex-row lg:flex-col justify-around lg:justify-center items-center gap-6">
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              25,000+
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Happy Travelers
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-6 h-6" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              150+
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Destinations & Spots
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <ThumbsUp className="w-6 h-6" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              98%
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Satisfaction Rate
            </p>
          </div>

        </div>

      </div>

      {/* Write a Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Share Your Travel Experience
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Rating selection */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= rating ? 'fill-current' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-2">
                    {rating} out of 5 stars
                  </span>
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Destination Visited
                </label>
                <input
                  type="text"
                  value={destinationName}
                  onChange={(e) => setDestinationName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Sajek Valley or Cox's Bazar"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Your City / Country
                </label>
                <input
                  type="text"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Chittagong, Bangladesh or London, UK"
                  required
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Your Review & Tips
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the tour guide, cottage, transport, or local dishes you loved..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-95 text-white text-xs font-extrabold shadow"
                >
                  {submitting ? 'Submitting to Firestore...' : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
