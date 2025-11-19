import { SubscriptionTier } from '../../src/types'; // Import SubscriptionTier

export interface BackendVoteOption {
  id: string;
  label: string;
  image?: string;
  votes: number; // Current vote count for this option
}

export interface BackendVote {
  id: string;
  creator_id: string; // ID of the user/artist who created the poll
  question: string;
  options: BackendVoteOption[];
  deadline: string; // ISO string for deadline
  required_tier: SubscriptionTier | 'none'; // Renamed for backend consistency
  status: 'active' | 'completed';
  is_public: boolean; // True if visible to all, false if only for subscribers
  created_at: string;
  updated_at: string;
}

let polls: BackendVote[] = [
  {
    id: 'poll1',
    creator_id: 'artist1',
    question: 'Какой трек вы хотите услышать первым на новом альбоме?',
    options: [
      { id: 'opt1', label: 'Neon Dreams (feat. Cyber Diva)', votes: 120 },
      { id: 'opt2', label: 'Starlight Symphony', votes: 80 },
      { id: 'opt3', label: 'Midnight Rider', votes: 50 },
    ],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    required_tier: 'fan',
    status: 'active',
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'poll2',
    creator_id: 'artist2',
    question: 'Выбираем обложку для следующего сингла',
    options: [
      { id: 'optA', label: 'Вариант А', image: 'https://via.placeholder.com/150/B19CD9/FFFFFF?text=CoverA', votes: 90 },
      { id: 'optB', label: 'Вариант Б', image: 'https://via.placeholder.com/150/C0B6F2/FFFFFF?text=CoverB', votes: 110 },
    ],
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    required_tier: 'none',
    status: 'completed',
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'poll3',
    creator_id: 'label',
    question: 'Кто должен быть следующим артистом на лейбле?',
    options: [
      { id: 'candidate1', label: 'Synthwave Maestro', votes: 30 },
      { id: 'candidate2', label: 'Retrowave Princess', votes: 70 },
    ],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    required_tier: 'pro',
    status: 'active',
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const getAllPolls = async (): Promise<BackendVote[]> => {
  return new Promise(resolve => setTimeout(() => resolve(polls), 500));
};

export const getPollById = async (id: string): Promise<BackendVote | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(polls.find(poll => poll.id === id)), 500));
};

export const submitVote = async (pollId: string, optionId: string): Promise<BackendVote | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const poll = polls.find(p => p.id === pollId);
      if (poll) {
        const option = poll.options.find(opt => opt.id === optionId);
        if (option) {
          option.votes++;
          // For a real app, you'd associate the vote with the user to prevent multiple votes
          // and save it persistently. Here, we just update the count.
          poll.updated_at = new Date().toISOString();
          resolve(poll);
          return;
        }
      }
      resolve(undefined);
    }, 500);
  });
};
