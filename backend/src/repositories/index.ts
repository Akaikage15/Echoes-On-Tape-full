/**
 * Repositories Index
 * Экспорт всех репозиториев
 */

import { userRepository } from './user.repository';
import { artistRepository } from './artist.repository';
import { releaseRepository } from './release.repository';
import { postRepository } from './post.repository';
import { exclusiveRepository } from './exclusive.repository';
import { merchRepository } from './merch.repository';
import { pollRepository } from './poll.repository';
import { proLibraryRepository } from './pro-library.repository';
import { demoRepository } from './demo.repository';

// Экспорт классов и типов
export * from './user.repository';
export * from './artist.repository';
export * from './release.repository';
export * from './post.repository';
export * from './exclusive.repository';
export * from './merch.repository';
export * from './poll.repository';
export * from './pro-library.repository';
export * from './demo.repository';

// Экспорт экземпляров
export {
  userRepository,
  artistRepository,
  releaseRepository,
  postRepository,
  exclusiveRepository,
  merchRepository,
  pollRepository,
  proLibraryRepository,
  demoRepository,
};
