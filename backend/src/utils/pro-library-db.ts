import { SubscriptionTier } from '@rootTypes';

export interface BackendProLibraryItem {
  id: string;
  title: string;
  type: 'sample_pack' | 'preset_pack' | 'daw_project' | 'masterclass_video' | 'midi_pack';
  description: string;
  required_tier: SubscriptionTier;
  file_url: string; // URL to the actual file (e.g., S3 link)
  preview_image_url?: string; // Optional image for preview
  created_at: string;
  updated_at: string;
}

let proLibraryItems: BackendProLibraryItem[] = [
  {
    id: 'proitem1',
    title: 'Vintage Synthwave Sample Pack Vol. 1',
    type: 'sample_pack',
    description: 'Коллекция уникальных ударных, басов и лидов в стиле винтажного синтвейва.',
    required_tier: 'pro',
    file_url: 'https://example.com/pro-library/synthwave_samples.zip',
    preview_image_url: 'https://via.placeholder.com/150/B19CD9/FFFFFF?text=Samples',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proitem2',
    title: 'Ableton Live 11 Project: Cyberpunk City',
    type: 'daw_project',
    description: 'Полный проект DAW с сведением и мастерингом трека "Cyberpunk City".',
    required_tier: 'pro',
    file_url: 'https://example.com/pro-library/cyberpunk_city_ableton.zip',
    preview_image_url: 'https://via.placeholder.com/150/C0B6F2/FFFFFF?text=DAW',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proitem3',
    title: 'Serum Presets: Dark Future',
    type: 'preset_pack',
    description: 'Пак из 50 кастомных пресетов для Serum, созданных для темного электро и индастриала.',
    required_tier: 'pro',
    file_url: 'https://example.com/pro-library/dark_future_serum.zip',
    preview_image_url: 'https://via.placeholder.com/150/B19CD9/FFFFFF?text=Presets',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proitem4',
    title: 'Мастер-класс: Основы микширования бас-барабана',
    type: 'masterclass_video',
    description: 'Видеоурок по эффективному микшированию бас-барабана в различных жанрах.',
    required_tier: 'pro',
    file_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    preview_image_url: 'https://via.placeholder.com/150/C0B6F2/FFFFFF?text=Video',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const getAllProLibraryItems = async (): Promise<BackendProLibraryItem[]> => {
  return new Promise(resolve => setTimeout(() => resolve(proLibraryItems), 500));
};

export const getProLibraryItemById = async (id: string): Promise<BackendProLibraryItem | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(proLibraryItems.find(item => item.id === id)), 500));
};
