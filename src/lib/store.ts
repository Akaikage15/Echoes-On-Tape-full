import { create } from 'zustand';
import apiClient from './api';
import { BackendUser, User, SubscriptionTier } from '../types';
import { toast } from 'sonner';

interface SessionState {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: BackendUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
}

const getInitialToken = (): string | null => {
  return localStorage.getItem('jwt_token');
};

export const useSessionStore = create<SessionState>((set, get) => ({
  currentUser: null,
  token: getInitialToken(),
  isAuthenticated: false,

  setCurrentUser: (backendUser) => {
    if (backendUser) {
      // For now, setting default subscription data. This should come from a real profile endpoint later.
      const user: User = {
        ...backendUser,
        subscriptionTier: 'none' as SubscriptionTier, // Default
        subscriptionEndDate: undefined,
      };
      set({ currentUser: user, isAuthenticated: true });
    } else {
      set({ currentUser: null, isAuthenticated: false });
    }
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem('jwt_token', token);
    } else {
      localStorage.removeItem('jwt_token');
    }
    set({ token });
  },

  logout: () => {
    get().setToken(null);
    set({ currentUser: null, isAuthenticated: false });
    toast.info('Вы вышли из аккаунта.');
  },

  fetchUserProfile: async () => {
    const token = get().token;
    if (!token) {
      get().logout();
      return;
    }

    try {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await apiClient.get<{ user: BackendUser }>('/auth/profile');
      get().setCurrentUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Ошибка при загрузке профиля. Возможно, сессия истекла.');
      get().logout(); // Clear token if profile fetching fails (e.g., token expired)
    }
  },
}));

// Initialize store: Attempt to fetch user profile if a token exists on startup
useSessionStore.getState().fetchUserProfile();
