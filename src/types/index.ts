// Типы для приложения Echoes On Tape

export type SubscriptionTier = 'none' | 'lite' | 'fan' | 'pro';

export interface BackendUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  user: BackendUser;
  token: string;
}

export interface User extends BackendUser {
  subscriptionTier: SubscriptionTier;
  subscriptionEndDate?: string;
  promoCodes?: PromoCode[];
}

export interface BackendArtist {
  id: string;
  name: string;
  bio: string;
  photo_url: string;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Artist extends BackendArtist {
  // Frontend-specific fields if any, or just extend BackendArtist
}

export interface BackendRelease {
  id: string;
  artist_id: string;
  title: string;
  cover_art_url: string;
  release_date: string; // YYYY-MM-DD
  description: string;
  streaming_links: Record<string, string>;
  created_at: string;
  updated_at: string;
  // Potentially include nested artist object from backend join
  artist?: BackendArtist;
}

export interface Release extends BackendRelease {
  // Frontend-specific fields if any, or just extend BackendRelease
  // For example, if we want to parse release_date into a Date object on frontend
  // parsedReleaseDate: Date;
}

export interface BackendPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  cover_image_url?: string;
  is_public: boolean;
  min_tier?: SubscriptionTier;
  created_at: string;
  updated_at: string;
}

export interface BlogPost extends BackendPost {
  // Frontend-specific fields if any
  // e.g., author name if joined from backend, or formatted date
  authorName?: string;
}


export interface Track {
  id: string;
  title: string;
  duration: number; // Duration in seconds, from backend
  exclusiveUrl?: string;
  isExclusive?: boolean;
  requiredTier?: SubscriptionTier;
}

export interface ExclusiveContent {
  id: string;
  title: string;
  type: 'track' | 'video' | 'sample' | 'preset';
  thumbnail: string;
  addedDate: string;
  requiredTier: SubscriptionTier;
  fileUrl?: string;
  fileSize?: string;
  format?: string;
  artistId: string;
}

export interface Vote {
  id: string;
  question: string;
  options: VoteOption[];
  deadline: string;
  requiredTier: SubscriptionTier;
  status: 'active' | 'completed';
  hasVoted?: boolean;
  userVote?: string;
}

export interface VoteOption {
  id: string;
  label: string;
  image?: string;
  votes: number;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  description: string;
}

export interface PromoCode {
  code: string;
  discount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface MerchItem {
  id: string;
  title: string;
  image: string;
  price: number;
  type: 'clothing' | 'accessory' | 'poster';
  sizes?: string[];
  discount?: number;
}

export interface Demo {
  id: string;
  artistName: string;
  email: string;
  trackUrl: string;
  genre: string;
  comment: string;
  uploadDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}
