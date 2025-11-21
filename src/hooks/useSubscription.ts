import { useSessionStore } from '../lib/store';
import { SubscriptionTier } from '../types';

type Tier = 'lite' | 'fan' | 'pro';
const TIER_LEVELS: Record<Tier, number> = {
  lite: 1,
  fan: 2,
  pro: 3,
};

/**
 * Хук для работы с подпиской пользователя
 * Возвращает: tier, tierLevel, isAuthenticated, hasAccess, subscriptionEndDate
 */
export function useSubscription() {
  const { currentUser, isAuthenticated } = useSessionStore();

  // Исправлено: используем subscriptionTier напрямую из currentUser
  const tier =
    currentUser?.subscriptionTier !== 'none'
      ? currentUser?.subscriptionTier
      : null;
  const tierLevel = tier ? TIER_LEVELS[tier as Tier] : 0;
  const subscriptionEndDate = currentUser?.subscriptionEndDate;

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
    subscriptionEndDate,
  };
}
