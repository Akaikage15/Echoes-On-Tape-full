import apiClient from './api';
import { BackendArtist, BackendRelease } from '../types';

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
