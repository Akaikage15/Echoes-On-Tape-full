/**
 * Централизованный экспорт всех валидаторов
 * Упрощает импорт в контроллерах и роутах
 */

// Auth validators
export * from './auth.validator';

// Account validators
export * from './account.validator';

// Release validators
export * from './release.validator';

// Post validators
export * from './post.validator';

// Artist validators
export * from './artist.validator';

// Subscription validators
export * from './subscription.validator';

// Common validators
export * from './common.validator';
