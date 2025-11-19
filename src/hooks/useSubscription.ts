import { useSessionStore } from '../lib/store';

type Tier = 'lite' | 'fan' | 'pro';
const TIER_LEVELS: Record<Tier, number> = {
  lite: 1,
  fan: 2,
  pro: 3,
};

export function useSubscription() {
  const { currentUser, isAuthenticated } = useSessionStore();

  const tier = currentUser?.subscription?.tier ?? null;
  const tierLevel = tier ? TIER_LEVELS[tier] : 0;

  const hasAccess = (requiredTier: Tier) => {
    if (!isAuthenticated) return false;
    const requiredLevel = TIER_LEVELS[requiredTier];
    return tierLevel >= requiredLevel;
  };

  return {
    tier,
    tierLevel,
    isAuthenticated,
    hasAccess,
  };
}
