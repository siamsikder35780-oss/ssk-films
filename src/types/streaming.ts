export type LanguageCategory = 'Bengali' | 'Hindi' | 'English' | 'Korean';

export type VideoQuality = '4K UHD' | 'HDR' | 'HD';

export type MembershipTier = 'Free' | 'Standard' | 'Premium';

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  duration: string;
  overview: string;
  thumbnail: string;
  videoUrl?: string;
}

export interface Review {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseYear: number;
  ageRating: string; // e.g. "16+", "18+", "U/A 13+", "PG"
  duration: string; // e.g. "2h 18m" or "2 Seasons"
  matchScore: number; // e.g. 98 (representing 98% Match)
  quality: VideoQuality;
  genres: string[];
  language: LanguageCategory;
  isSeries?: boolean;
  seasonsCount?: number;
  episodes?: Episode[];
  director?: string;
  cast?: string[];
  videoUrl?: string; // Authorized video stream link
  topTenRank?: number; // 1 to 10
  isFeatured?: boolean;
  continueProgress?: number; // 0 - 100 percentage for Continue Watching
  isPremiumOnly?: boolean; // Requires Standard or Premium subscription
  averageRating?: number; // e.g. 4.8 out of 5
  ratingsCount?: number; // e.g. 184 ratings
  reviews?: Review[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl: string;
  isKids: boolean;
  membershipPlan: MembershipTier;
  subscriptionStatus: 'active' | 'cancelled' | 'trial';
  renewalDate: string;
  paymentMethod?: {
    cardBrand: string;
    lastFour: string;
    expiry: string;
  };
  myList: string[]; // List of movie IDs
  continueWatching: { movieId: string; progress: number }[];
  createdAt: string;
}

export type UserProfile = UserAccount;

export interface MembershipPlan {
  id: MembershipTier;
  name: string;
  price: string;
  numericPrice: number;
  billingPeriod: string;
  videoQuality: string;
  resolution: string;
  supportedDevices: string;
  simultaneousScreens: number;
  downloadDevices: number;
  audio: string;
  badge?: string;
  features: string[];
}
