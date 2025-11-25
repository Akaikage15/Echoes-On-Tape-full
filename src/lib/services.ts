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

export const fetchAllExclusives = async (): Promise<ExclusiveContent[]> => {
  const response = await apiClient.get<ExclusiveContent[]>('/exclusives');
  return response.data;
};

export const fetchExclusiveById = async (id: string): Promise<ExclusiveContent> => {
  const response = await apiClient.get<ExclusiveContent>(`/exclusives/${id}`);
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

export const fetchAllMerchItems = async (): Promise<MerchItem[]> => {
  const response = await apiClient.get<MerchItem[]>('/merch');
  return response.data;
};

export const fetchAllPolls = async (): Promise<Vote[]> => {
  const response = await apiClient.get<Vote[]>('/polls');
  return response.data;
};

export const fetchPollById = async (id: string): Promise<Vote> => {
  const response = await apiClient.get<Vote>(`/polls/${id}`);
  return response.data;
};

export const submitPollVote = async (pollId: string, optionId: string): Promise<Vote> => {
  const response = await apiClient.post<Vote>(`/polls/${pollId}/vote`, { optionId });
  return response.data;
};

export const fetchAllProLibraryItems = async (): Promise<BackendProLibraryItem[]> => {
  const response = await apiClient.get<BackendProLibraryItem[]>('/pro-library');
  return response.data;
};

export const fetchProLibraryItemById = async (id: string): Promise<BackendProLibraryItem> => {
  const response = await apiClient.get<BackendProLibraryItem>(`/pro-library/${id}`);
  return response.data;
};

export const fetchAllDemos = async (): Promise<BackendDemo[]> => {
  const response = await apiClient.get<BackendDemo[]>('/demos');
  return response.data;
};

export const fetchDemoById = async (id: string): Promise<BackendDemo> => {
  const response = await apiClient.get<BackendDemo>(`/demos/${id}`);
  return response.data;
};

export const createDemoSubmission = async (demo: Omit<BackendDemo, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at'>): Promise<BackendDemo> => {
  const response = await apiClient.post<BackendDemo>('/demos', demo);
  return response.data;
};

export const updateDemoStatus = async (id: string, status: BackendDemo['status']): Promise<BackendDemo> => {
  const response = await apiClient.put<BackendDemo>(`/demos/${id}/status`, { status });
  return response.data;
};
