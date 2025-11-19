import { ExclusiveContent, SubscriptionTier } from '@rootTypes';

interface BackendExclusiveItem extends ExclusiveContent {}

let exclusives: BackendExclusiveItem[] = [
  {
    id: 'exclusive1',
    title: 'Эксклюзивный трек "Neon Dreams"',
    type: 'track',
    required_tier: 'lite',
    description: 'Ранний доступ к новому треку от LXST MXRCRY. Доступно в высоком качестве.',
    file_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio source
    preview_image_url: 'https://via.placeholder.com/150/B19CD9/FFFFFF?text=Track',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'exclusive2',
    title: 'Backstage видео со съемок клипа "Cyberpunk City"',
    type: 'video',
    required_tier: 'fan',
    description: 'Погрузитесь в процесс создания нашего последнего клипа. Только для фанатов!',
    file_url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video source
    preview_image_url: 'https://via.placeholder.com/150/C0B6F2/FFFFFF?text=Video',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'exclusive3',
    title: 'Семпл-пак "Vintage Synths Vol. 1"',
    type: 'sample_pack',
    required_tier: 'pro',
    description: 'Коллекция уникальных звуков винтажных синтезаторов, записанных в нашей студии.',
    file_url: 'https://example.com/sample_pack.zip', // Placeholder download link
    preview_image_url: 'https://via.placeholder.com/150/B19CD9/FFFFFF?text=Samples',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'exclusive4',
    title: 'Дневник разработчика "Создание LXV3 DRXWN"',
    type: 'other',
    required_tier: 'lite',
    description: 'Инсайты о процессе написания музыки и создания образов.',
    preview_image_url: 'https://via.placeholder.com/150/C0B6F2/FFFFFF?text=DevLog',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'exclusive5',
    title: 'Мастер-класс по микшированию (урок 1)',
    type: 'video',
    required_tier: 'pro',
    description: 'Подробный мастер-класс по сведению и мастерингу треков.',
    file_url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Another placeholder video source
    preview_image_url: 'https://via.placeholder.com/150/B19CD9/FFFFFF?text=Masterclass',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const getAllExclusives = async (): Promise<BackendExclusiveItem[]> => {
  // Simulate async operation
  return new Promise(resolve => setTimeout(() => resolve(exclusives), 500));
};

export const getExclusiveById = async (id: string): Promise<BackendExclusiveItem | undefined> => {
  // Simulate async operation
  return new Promise(resolve => setTimeout(() => resolve(exclusives.find(e => e.id === id)), 500));
};
