import { UserReview } from '../types';

export const INITIAL_REVIEWS: UserReview[] = [
  {
    id: 'rev-01',
    userName: 'Emily R.',
    userLocation: 'New York, USA',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    destinationName: "Cox's Bazar & Saint Martin's Island",
    rating: 5,
    comment: 'The trip was beyond amazing! Perfect planning and great support from our guide Tanvir. The Marine Drive ride and beach BBQ at sunset were unforgettable.',
    date: 'September 2026',
    verifiedTrip: true,
  },
  {
    id: 'rev-02',
    userName: 'James T.',
    userLocation: 'London, UK',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    destinationName: 'Sajek Valley - Kingdom of Clouds',
    rating: 5,
    comment: 'Best vacation ever! Every single detail was taken care of. Standing above the sea of clouds at sunrise while drinking hot tea in Sajek was magical.',
    date: 'August 2026',
    verifiedTrip: true,
  },
  {
    id: 'rev-03',
    userName: 'Sophia L.',
    userLocation: 'Sydney, Australia',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    destinationName: 'Tanguar Haor Luxury Houseboat',
    rating: 5,
    comment: 'Highly recommended! The traditional wooden Bajra boat was so cozy and clean. Swimming in Niladri Lake with Meghalaya mountains in the background was a dream.',
    date: 'August 2026',
    verifiedTrip: true,
  },
  {
    id: 'rev-04',
    userName: 'Md. Rahat Chowdhury',
    userLocation: 'Dhaka, Bangladesh',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    destinationName: 'Sundarbans Royal Mangrove Safari',
    rating: 5,
    comment: 'Payment with bKash was seamless and instant confirmation came via email. Our forest guide Aminul bhai was exceptionally knowledgeable. We even saw fresh tiger tracks at Kotka!',
    date: 'July 2026',
    verifiedTrip: true,
  }
];
