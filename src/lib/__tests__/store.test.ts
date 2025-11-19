import { useSessionStore } from '../store';
import apiClient from '../api';
import { act } from '@testing-library/react';
import { User } from '../../types';

// Mock the entire apiClient
jest.mock('../api', () => ({
  get: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  subscriptionTier: 'pro',
  subscriptionEndDate: '2099-12-31',
};

describe('useSessionStore (Zustand)', () => {
  
  beforeEach(() => {
    // Reset store to its initial state before each test
    act(() => {
      useSessionStore.setState({
        currentUser: null,
        token: null,
        isAuthenticated: false,
      });
    });
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should set the token and store it in localStorage', () => {
    const testToken = 'my-jwt-token';
    
    act(() => {
      useSessionStore.getState().setToken(testToken);
    });

    expect(useSessionStore.getState().token).toBe(testToken);
    expect(localStorage.getItem('jwt_token')).toBe(testToken);
  });
  
  it('should set the current user and isAuthenticated flag', () => {
    act(() => {
      useSessionStore.getState().setCurrentUser(mockUser);
    });
    
    expect(useSessionStore.getState().currentUser).toEqual(mockUser);
    expect(useSessionStore.getState().isAuthenticated).toBe(true);
  });

  it('should clear user and token on logout', () => {
    // First, set a user and token
    act(() => {
      useSessionStore.getState().setCurrentUser(mockUser);
      useSessionStore.getState().setToken('a-token');
    });

    expect(useSessionStore.getState().currentUser).not.toBeNull();
    expect(useSessionStore.getState().token).not.toBeNull();
    
    // Now, logout
    act(() => {
      useSessionStore.getState().logout();
    });

    expect(useSessionStore.getState().currentUser).toBeNull();
    expect(useSessionStore.getState().isAuthenticated).toBe(false);
    expect(useSessionStore.getState().token).toBeNull();
    expect(localStorage.getItem('jwt_token')).toBeNull();
  });

  describe('fetchUserProfile', () => {
    it('should fetch user profile successfully and update the store', async () => {
      const token = 'valid-token';
      mockedApiClient.get.mockResolvedValue({ data: { user: mockUser } });
      
      // Set token to allow fetchUserProfile to run
      act(() => {
          useSessionStore.getState().setToken(token);
      });

      await act(async () => {
        await useSessionStore.getState().fetchUserProfile();
      });

      expect(mockedApiClient.get).toHaveBeenCalledWith('/auth/profile');
      expect(useSessionStore.getState().currentUser).toEqual(mockUser);
      expect(useSessionStore.getState().isAuthenticated).toBe(true);
    });

    it('should handle fetch failure and log the user out', async () => {
      // Suppress console.error for this specific test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const token = 'invalid-token';
      mockedApiClient.get.mockRejectedValue(new Error('Network Error'));
      
      act(() => {
        useSessionStore.getState().setToken(token);
      });

      await act(async () => {
        await useSessionStore.getState().fetchUserProfile();
      });

      expect(mockedApiClient.get).toHaveBeenCalledWith('/auth/profile');
      expect(useSessionStore.getState().currentUser).toBeNull();
      expect(useSessionStore.getState().isAuthenticated).toBe(false);
      expect(useSessionStore.getState().token).toBeNull(); // Should be cleared on logout

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });

    it('should not fetch if no token exists', async () => {
        // Ensure no token is set
        act(() => {
            useSessionStore.getState().setToken(null);
        });

        await act(async () => {
            await useSessionStore.getState().fetchUserProfile();
        });

        expect(mockedApiClient.get).not.toHaveBeenCalled();
    });
  });
});
