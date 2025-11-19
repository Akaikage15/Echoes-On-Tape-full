import { Demo } from '@rootTypes';

export interface BackendDemo {
  id: string;
  user_id: string; // ID of the user who submitted the demo
  artist_name: string; // Renamed for consistency
  email: string;
  track_url: string; // Renamed for consistency
  genre: string;
  comment: string;
  upload_date: string; // Renamed for consistency
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

let demos: BackendDemo[] = [
  {
    id: 'demo1',
    user_id: 'user1',
    artist_name: 'Synthwave Artist X',
    email: 'artistx@example.com',
    track_url: 'https://soundcloud.com/synthwaveartistx/track1',
    genre: 'Synthwave',
    comment: 'Надеюсь, вам понравится этот трек. Он в стиле 80-х.',
    upload_date: new Date('2025-10-20').toISOString(),
    status: 'pending',
    created_at: new Date('2025-10-20').toISOString(),
    updated_at: new Date('2025-10-20').toISOString(),
  },
  {
    id: 'demo2',
    user_id: 'user2',
    artist_name: 'Future Bass Producer Y',
    email: 'producery@example.com',
    track_url: 'https://soundcloud.com/futurebassy/track2',
    genre: 'Future Bass',
    comment: 'Мой новый трек с уникальным вокалом.',
    upload_date: new Date('2025-10-25').toISOString(),
    status: 'reviewed',
    created_at: new Date('2025-10-25').toISOString(),
    updated_at: new Date('2025-10-28').toISOString(),
  },
];

export const getAllDemos = async (): Promise<BackendDemo[]> => {
  return new Promise(resolve => setTimeout(() => resolve(demos), 500));
};

export const getDemoById = async (id: string): Promise<BackendDemo | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(demos.find(demo => demo.id === id)), 500));
};

export const createDemo = async (newDemo: Omit<BackendDemo, 'id' | 'status' | 'created_at' | 'updated_at'> & { id?: string }): Promise<BackendDemo> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const demo: BackendDemo = {
                id: newDemo.id || `demo${demos.length + 1}`,
                ...newDemo,
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            demos.push(demo);
            resolve(demo);
        }, 500);
    });
};

export const updateDemoStatus = async (id: string, status: BackendDemo['status']): Promise<BackendDemo | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const demo = demos.find(d => d.id === id);
            if (demo) {
                demo.status = status;
                demo.updated_at = new Date().toISOString();
                resolve(demo);
            } else {
                resolve(undefined);
            }
        }, 500);
    });
};
