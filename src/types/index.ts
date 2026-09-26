export type CurrencyType = 'BDT' | 'USD';

export interface Destination {
  id: string;
  name: string;
  nameBn?: string;
  subtitleBn?: string;
  division: string;
  district: string;
  country: string;
  isDomestic: boolean;
  category: 'Beach' | 'Hill' | 'Forest' | 'Haor & River' | 'Heritage';
  image: string;
  gallery: string[];
  rating: number;
  reviewsCount: number;
  priceBDT: number;
  priceUSD: number;
  duration: string;
  badge?: string;
  discountPercent?: number;
  description: string;
  highlights: string[];
  inclusions: string[];
  itinerary: { day: number; title: string; activities: string }[];
  bestTimeToVisit: string;
  localSpecialties: string[];
}

export interface LocalGuide {
  id: string;
  name: string;
  district: string;
  division: string;
  photo: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  languages: string[];
  dailyRateBDT: number;
  dailyRateUSD: number;
  specialty: string;
  verified: boolean;
  bio: string;
  toursCount: number;
  phone: string;
  available: boolean;
}

export interface Booking {
  id: string;
  userId?: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  destinationId: string;
  destinationName: string;
  destinationImage: string;
  travelDate: string;
  returnDate: string;
  travelers: number;
  planType: 'Standard' | 'Solo Explorer' | 'Couple Getaway' | 'Family Vacation' | 'Custom';
  totalPriceBDT: number;
  totalPriceUSD: number;
  currency: CurrencyType;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Card' | 'CashOnTour';
  paymentStatus: 'Paid' | 'Pending' | 'Partial Advance (20%)';
  bookingStatus: 'Confirmed' | 'Pending Review' | 'Cancelled';
  assignedGuideId?: string;
  assignedGuideName?: string;
  transactionId?: string;
  specialRequests?: string;
  createdAt: string;
}

export interface UserReview {
  id: string;
  userName: string;
  userLocation: string;
  userAvatar: string;
  destinationName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedTrip: boolean;
}

export interface GuideMessage {
  id: string;
  guideId: string;
  guideName: string;
  sender: 'user' | 'guide';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface BlogPost {
  id: string;
  destinationId: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  category: 'Beach' | 'Hill' | 'Forest' | 'Haor & River' | 'Heritage';
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  coverImage: string;
  gallery?: string[];
  excerpt: string;
  content: {
    introduction: string;
    mustVisitSpots: { spotName: string; description: string }[];
    howToReach: string;
    bestTimeToTravel: string;
    localFoodGuide: string[];
    travelerTips: string[];
  };
}
