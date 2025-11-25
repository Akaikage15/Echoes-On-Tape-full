// Типы для приложения Echoes On Tape

export type SubscriptionTier = 'none' | 'lite' | 'fan' | 'pro';

export type UserRole = 'ADMIN' | 'ARTIST' | 'PREMIUM_USER' | 'FREE_USER';

export interface BackendUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: UserRole;
  subscriptionTier?: SubscriptionTier;
  subscriptionEndDate?: string;
}

export interface AuthResponse {
  user: BackendUser;
  token?: string; // Старый формат (для обратной совместимости)
  accessToken?: string; // Новый формат
  refreshToken?: string;
  message?: string;
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
  type: 'track' | 'video' | 'sample_pack' | 'other'; // Updated to match backend
  required_tier: SubscriptionTier | null; // Renamed for consistency
  description: string;
  file_url?: string; // Backend source for content
  preview_image_url?: string; // Backend artwork
  created_at?: string; // Add created_at
  updated_at?: string; // Add updated_at
}

export interface BackendVoteOption {
  id: string;
  label: string;
  image?: string;
  votes: number;
}

export interface BackendVote {
  id: string;
  creator_id: string;
  question: string;
  options: BackendVoteOption[];
  deadline: string;
  required_tier: SubscriptionTier | 'none';
  status: 'active' | 'completed';
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vote extends BackendVote {
  hasVoted?: boolean;
  userVote?: string;
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

export interface BackendProLibraryItem {
  id: string;
  title: string;
  type: 'sample_pack' | 'preset_pack' | 'daw_project' | 'masterclass_video' | 'midi_pack';
  description: string;
  required_tier: SubscriptionTier;
  file_url: string;
  preview_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BackendDemo {
  id: string;
  user_id: string;
  artist_name: string;
  email: string;
  track_url: string;
  genre: string;
  comment: string;
  upload_date: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Demo extends Omit<BackendDemo, 'artist_name' | 'track_url' | 'upload_date' | 'user_id' | 'created_at' | 'updated_at'> {
  artistName: string; // Renamed for frontend
  trackUrl: string; // Renamed for frontend
  uploadDate: string; // Renamed for frontend
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  expiresAt: string;
  used: boolean;
}
