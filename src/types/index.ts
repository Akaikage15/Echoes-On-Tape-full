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

export interface Artist {
  id: string;
  name: string;
  photo: string;
  genre: string;
  bio: string;
  socials: {
    telegram?: string;
    instagram?: string;
    vk?: string;
  };
}

export interface Release {
  id: string;
  title: string;
  artist: Artist;
  cover: string;
  type: 'single' | 'ep' | 'album';
  releaseDate: string;
  genre: string;
  description: string;
  tracks: Track[];
  isExclusive?: boolean;
  requiredTier?: SubscriptionTier;
  yandexMusicUrl?: string;
  youtubeUrl?: string;
}

export interface Track {
  id: string;
  title: string;
  duration: number;
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

export interface BlogPost {
  id: string;
  title: string;
  coverImage: string;
  date: string;
  author: string;
  preview: string;
  content: string;
  isExclusive: boolean;
  requiredTier?: SubscriptionTier;
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
