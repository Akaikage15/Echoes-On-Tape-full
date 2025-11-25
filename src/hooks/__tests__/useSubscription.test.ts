import { renderHook } from '@testing-library/react';
import { useSubscription } from '../useSubscription';
import { useSessionStore } from '../../lib/store';
import { User } from '../../types';

// Mock the zustand store
jest.mock('../../lib/store');

const mockUseSessionStore = useSessionStore as jest.Mock;

describe('useSubscription Hook', () => {
  
  const mockUser = (tier: 'none' | 'lite' | 'fan' | 'pro'): User => ({
    id: '1',
    email: 'test@test.com',
    subscriptionTier: tier,
    name: 'Test User',
    // other fields can be mocked as needed
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  it('should return not authenticated and no access when user is not logged in', () => {
    mockUseSessionStore.mockReturnValue({
      currentUser: null,
      isAuthenticated: false,
    });
    
    const { result } = renderHook(() => useSubscription());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.tier).toBe('none');
    expect(result.current.tierLevel).toBe(0);
    expect(result.current.hasAccess('lite')).toBe(false);
  });

  it('should grant access correctly for a "pro" user', () => {
    mockUseSessionStore.mockReturnValue({
      currentUser: mockUser('pro'),
      isAuthenticated: true,
    });

    const { result } = renderHook(() => useSubscription());

    expect(result.current.tier).toBe('pro');
    expect(result.current.tierLevel).toBe(3);
    expect(result.current.hasAccess('lite')).toBe(true);
    expect(result.current.hasAccess('fan')).toBe(true);
    expect(result.current.hasAccess('pro')).toBe(true);
  });

  it('should grant access correctly for a "fan" user', () => {
    mockUseSessionStore.mockReturnValue({
      currentUser: mockUser('fan'),
      isAuthenticated: true,
    });

    const { result } = renderHook(() => useSubscription());

    expect(result.current.tier).toBe('fan');
    expect(result.current.tierLevel).toBe(2);
    expect(result.current.hasAccess('lite')).toBe(true);
    expect(result.current.hasAccess('fan')).toBe(true);
    expect(result.current.hasAccess('pro')).toBe(false);
  });

  it('should grant access correctly for a "lite" user', () => {
    mockUseSessionStore.mockReturnValue({
      currentUser: mockUser('lite'),
      isAuthenticated: true,
    });

    const { result } = renderHook(() => useSubscription());

    expect(result.current.tier).toBe('lite');
    expect(result.current.tierLevel).toBe(1);
    expect(result.current.hasAccess('lite')).toBe(true);
    expect(result.current.hasAccess('fan')).toBe(false);
    expect(result.current.hasAccess('pro')).toBe(false);
  });

  it('should not grant access for a user with no subscription', () => {
    mockUseSessionStore.mockReturnValue({
      currentUser: mockUser('none'),
      isAuthenticated: true,
    });

    const { result } = renderHook(() => useSubscription());

    expect(result.current.tier).toBe('none');
    expect(result.current.tierLevel).toBe(0);
    expect(result.current.hasAccess('lite')).toBe(false);
    expect(result.current.hasAccess('fan')).toBe(false);
    expect(result.current.hasAccess('pro')).toBe(false);
  });
  
  it('should handle null requiredTier gracefully', () => {
    mockUseSessionStore.mockReturnValue({
      currentUser: mockUser('pro'),
      isAuthenticated: true,
    });

    const { result } = renderHook(() => useSubscription());
    
    // If content doesn't require a tier, access should be denied (or based on app logic, here false)
    expect(result.current.hasAccess(null)).toBe(false);
  });
});
