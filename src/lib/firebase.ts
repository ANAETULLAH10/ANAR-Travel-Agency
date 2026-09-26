import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { Booking, UserReview, GuideMessage } from '../types';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore using the configured database ID
export const db = firebaseConfigData.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId) 
  : getFirestore(app);

// Auth helper functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-in error:', error);
    throw error;
  }
};

export const logOut = async () => {
  return signOut(auth);
};

// Firestore helper: Bookings
const BOOKINGS_COLLECTION = 'bookings';
const REVIEWS_COLLECTION = 'reviews';
const GUIDE_MESSAGES_COLLECTION = 'guide_messages';
const NEWSLETTER_COLLECTION = 'newsletter_subscribers';

export const saveBookingToFirestore = async (booking: Booking): Promise<string> => {
  try {
    const bookingDoc = {
      ...booking,
      createdAt: booking.createdAt || new Date().toISOString(),
      updatedAt: serverTimestamp(),
    };
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), bookingDoc);
    
    // Also backup in localStorage for offline resilience
    const existing = JSON.parse(localStorage.getItem('anar_local_bookings') || '[]');
    localStorage.setItem('anar_local_bookings', JSON.stringify([{ ...bookingDoc, id: docRef.id }, ...existing]));
    
    return docRef.id;
  } catch (error) {
    console.warn('Firestore booking save fallback to localStorage:', error);
    const existing = JSON.parse(localStorage.getItem('anar_local_bookings') || '[]');
    const localId = 'ANAR-LOCAL-' + Date.now().toString().slice(-6);
    const fallbackBooking = { ...booking, id: localId };
    localStorage.setItem('anar_local_bookings', JSON.stringify([fallbackBooking, ...existing]));
    return localId;
  }
};

export const fetchUserBookings = async (userEmail?: string, userId?: string): Promise<Booking[]> => {
  const localList: Booking[] = JSON.parse(localStorage.getItem('anar_local_bookings') || '[]');
  try {
    const bookingsRef = collection(db, BOOKINGS_COLLECTION);
    const q = (userEmail || userId) 
      ? query(bookingsRef, where('userEmail', '==', userEmail || ''))
      : query(bookingsRef);
      
    const querySnapshot = await getDocs(q);
    const firestoreBookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
      firestoreBookings.push({ id: doc.id, ...doc.data() } as Booking);
    });

    // Merge unique by ID
    const map = new Map<string, Booking>();
    firestoreBookings.forEach((b) => map.set(b.id, b));
    localList.forEach((b) => {
      if (!map.has(b.id)) map.set(b.id, b);
    });

    return Array.from(map.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.warn('Could not fetch from Firestore, returning local bookings:', error);
    return localList;
  }
};

export const cancelBookingInFirestore = async (bookingId: string): Promise<void> => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, { bookingStatus: 'Cancelled' });
  } catch (err) {
    console.warn('Firestore updateDoc failed, updating local storage:', err);
  }
  // Update local storage
  const localList: Booking[] = JSON.parse(localStorage.getItem('anar_local_bookings') || '[]');
  const updated = localList.map((b) => b.id === bookingId ? { ...b, bookingStatus: 'Cancelled' as const } : b);
  localStorage.setItem('anar_local_bookings', JSON.stringify(updated));
};

// Firestore helper: User Reviews
export const saveReviewToFirestore = async (review: Omit<UserReview, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
      ...review,
      timestamp: serverTimestamp(),
    });
    
    // Backup locally
    const existing = JSON.parse(localStorage.getItem('anar_local_reviews') || '[]');
    localStorage.setItem('anar_local_reviews', JSON.stringify([{ ...review, id: docRef.id }, ...existing]));
    return docRef.id;
  } catch (error) {
    console.warn('Firestore review save fallback to local:', error);
    const localId = 'rev-' + Date.now();
    const existing = JSON.parse(localStorage.getItem('anar_local_reviews') || '[]');
    localStorage.setItem('anar_local_reviews', JSON.stringify([{ ...review, id: localId }, ...existing]));
    return localId;
  }
};

export const fetchReviewsFromFirestore = async (): Promise<UserReview[]> => {
  const localReviews: UserReview[] = JSON.parse(localStorage.getItem('anar_local_reviews') || '[]');
  try {
    const q = query(collection(db, REVIEWS_COLLECTION));
    const snapshot = await getDocs(q);
    const items: UserReview[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as UserReview);
    });
    
    // Merge
    const map = new Map<string, UserReview>();
    items.forEach((r) => map.set(r.id, r));
    localReviews.forEach((r) => { if (!map.has(r.id)) map.set(r.id, r); });
    return Array.from(map.values());
  } catch (error) {
    console.warn('Reviews firestore fetch fallback:', error);
    return localReviews;
  }
};

// Firestore helper: Guide Chat Messages
export const sendGuideChatMessage = async (msg: Omit<GuideMessage, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, GUIDE_MESSAGES_COLLECTION), {
      ...msg,
      timestamp: new Date().toISOString(),
      createdServerTime: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.warn('Guide chat firestore fallback:', error);
    return 'msg-' + Date.now();
  }
};

export const subscribeGuideChat = (guideId: string, callback: (messages: GuideMessage[]) => void) => {
  try {
    const q = query(
      collection(db, GUIDE_MESSAGES_COLLECTION),
      where('guideId', '==', guideId)
    );
    return onSnapshot(q, (snapshot) => {
      const messages: GuideMessage[] = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as GuideMessage);
      });
      messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      callback(messages);
    }, (error) => {
      console.warn('onSnapshot guide message error:', error);
    });
  } catch (err) {
    console.warn('Could not establish Firestore snapshot listener for guide chat:', err);
    return () => {};
  }
};

// Firestore helper: Newsletter
export const subscribeNewsletterInFirestore = async (email: string): Promise<void> => {
  try {
    await addDoc(collection(db, NEWSLETTER_COLLECTION), {
      email,
      subscribedAt: new Date().toISOString(),
      serverTimestamp: serverTimestamp()
    });
  } catch (err) {
    console.warn('Newsletter firestore save:', err);
    const list = JSON.parse(localStorage.getItem('anar_subscribers') || '[]');
    list.push({ email, date: new Date().toISOString() });
    localStorage.setItem('anar_subscribers', JSON.stringify(list));
  }
};
