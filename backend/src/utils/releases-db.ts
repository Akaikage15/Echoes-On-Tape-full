import { v4 as uuidv4 } from 'uuid';

interface Artist {
  id: string;
  name: string;
  bio: string;
  photo_url: string;
  social_links: Record<string, string>;
  created_at: Date;
  updated_at: Date;
}

interface Release {
  id: string;
  artist_id: string;
  title: string;
  cover_art_url: string;
  release_date: string; // YYYY-MM-DD
  description: string;
  streaming_links: Record<string, string>;
  created_at: Date;
  updated_at: Date;
}

const artists: Artist[] = [
  {
    id: uuidv4(),
    name: 'Meadown Cushion',
    bio: 'An experimental electronic artist.',
    photo_url: '/images/artist1.webp',
    social_links: { telegram: 'https://t.me/meadowcushion' },
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: uuidv4(),
    name: 'The Sonic Glitch',
    bio: 'Synthwave and retro electro.',
    photo_url: '/images/artist2.jpg',
    social_links: { instagram: 'https://instagram.com/thesonicglitch' },
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const releases: Release[] = [
  {
    id: uuidv4(),
    artist_id: artists[0].id,
    title: 'Whispers in the Static',
    cover_art_url: '/images/release-meadown-cushion.jpg',
    release_date: '2023-10-27',
    description: 'Meadown Cushion delivers a haunting blend of ambient textures and glitchy beats.',
    streaming_links: { spotify: 'https://spotify.com/whispers', youtube: 'https://youtube.com/whispers' },
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: uuidv4(),
    artist_id: artists[1].id,
    title: 'Neon Dreams',
    cover_art_url: '/images/release-neon-dreams.jpg', // Placeholder
    release_date: '2023-09-15',
    description: 'The Sonic Glitch takes you on a nostalgic journey through 80s synth landscapes.',
    streaming_links: { spotify: 'https://spotify.com/neondreams', applemusic: 'https://applemusic.com/neondreams' },
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const getAllArtists = async (): Promise<Artist[]> => {
  return artists;
};

export const getArtistById = async (id: string): Promise<Artist | undefined> => {
  return artists.find(artist => artist.id === id);
};

export const getAllReleases = async (): Promise<Release[]> => {
  // Simulate joining with artist data
  return releases.map(release => ({
    ...release,
    artist: artists.find(artist => artist.id === release.artist_id),
  })) as any; // Type assertion due to simplified Artist type in Release for join
};

export const getReleaseById = async (id: string): Promise<Release | undefined> => {
  const release = releases.find(release => release.id === id);
  if (release) {
    return {
      ...release,
      artist: artists.find(artist => artist.id === release.artist_id),
    } as any;
  }
  return undefined;
};

export const clearReleaseData = () => {
  artists.length = 0;
  releases.length = 0;
};
