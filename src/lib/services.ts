import apiClient from './api';
import { BackendArtist, BackendRelease, BackendPost, BackendUser, SubscriptionTier } from '../types';

export const fetchAllReleases = async (): Promise<BackendRelease[]> => {
  const response = await apiClient.get<BackendRelease[]>('/releases');
  return response.data;
};

export const fetchReleaseById = async (id: string): Promise<BackendRelease> => {
  const response = await apiClient.get<BackendRelease>(`/releases/${id}`);
  return response.data;
};

export const fetchAllArtists = async (): Promise<BackendArtist[]> => {
  const response = await apiClient.get<BackendArtist[]>('/artists');
  return response.data;
};

export const fetchArtistById = async (id: string): Promise<BackendArtist> => {
  const response = await apiClient.get<BackendArtist>(`/artists/${id}`);
  return response.data;
};

export const fetchAllPosts = async (): Promise<BackendPost[]> => {
  const response = await apiClient.get<BackendPost[]>('/posts');
  return response.data;
};

export const fetchPostById = async (id: string): Promise<BackendPost> => {
  const response = await apiClient.get<BackendPost>(`/posts/${id}`);
  return response.data;
};

interface PurchaseSubscriptionResponse {
  message: string;
  user: BackendUser & { subscriptionTier: SubscriptionTier, subscriptionEndDate: string };
}

export const purchaseSubscription = async (tier: SubscriptionTier): Promise<PurchaseSubscriptionResponse> => {
  const response = await apiClient.post<PurchaseSubscriptionResponse>('/subscriptions/purchase', { tier });
  return response.data;
};
