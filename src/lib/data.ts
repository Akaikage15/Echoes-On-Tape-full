// Mock data for Echoes On Tape platform

export type SubscriptionTier = 'lite' | 'fan' | 'pro' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subscription: SubscriptionTier;
  subscriptionExpiry?: string;
  nextPayment?: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  genre: string;
  bio: string;
  socials: {
    telegram?: string;
    instagram?: string;
    vk?: string;
  };
}

export interface Release {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  cover: string;
  releaseDate: string;
  type: 'single' | 'album' | 'ep';
  year: number;
  genre: string;
  description: string;
  hasExclusive: boolean;
  requiredTier?: SubscriptionTier;
  tracklist: Track[];
  yandexMusicUrl?: string;
  youtubeMusicUrl?: string;
}

export interface Track {
  id: string;
  title: string;
  duration: string;
  exclusive?: boolean;
  requiredTier?: SubscriptionTier;
  downloadUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  author: string;
  isExclusive: boolean;
  requiredTier?: SubscriptionTier;
}

export interface ExclusiveContent {
  id: string;
  title: string;
  type: 'track' | 'video' | 'sample' | 'preset';
  cover: string;
  releaseDate: string;
  requiredTier: SubscriptionTier;
  downloadUrl?: string;
  streamUrl?: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  deadline: string;
  options: PollOption[];
  requiredTier: SubscriptionTier;
  status: 'active' | 'completed';
  totalVotes: number;
}

export interface PollOption {
  id: string;
  title: string;
  image?: string;
  votes: number;
}

export interface ProLibraryItem {
  id: string;
  title: string;
  type: 'sample' | 'preset' | 'midi' | 'tutorial';
  artist: string;
  cover: string;
  format: string;
  size: string;
  releaseDate: string;
  downloadUrl: string;
}

export interface MerchItem {
  id: string;
  title: string;
  image: string;
  price: number;
  discountPercent?: number;
  category: 'clothing' | 'accessories' | 'posters';
  sizes?: string[];
}

// Mock current user (null = not logged in)
export let currentUser: User | null = null;

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};

// Mock users for login
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Александр Иванов',
    email: 'fan@example.com',
    subscription: 'fan',
    subscriptionExpiry: '2025-12-18',
    nextPayment: '2025-12-18',
  },
  {
    id: '2',
    name: 'Мария Петрова',
    email: 'pro@example.com',
    subscription: 'pro',
    subscriptionExpiry: '2025-12-18',
    nextPayment: '2025-12-18',
  },
];

// Artists data
export const artists: Artist[] = [
  {
    id: '1',
    name: 'NØISE',
    image: 'artist-1',
    genre: 'Electronic / Dark Ambient',
    bio: 'Экспериментальный электронный проект, исследующий границы темного эмбиента и индустриальной музыки. Создает атмосферные саундскейпы для ночных путешествий.',
    socials: {
      telegram: 'https://t.me/noise_music',
      instagram: 'https://instagram.com/noise',
    },
  },
  {
    id: '2',
    name: 'VELVET STATIC',
    image: 'artist-2',
    genre: 'Dream Pop / Shoegaze',
    bio: 'Мечтательный шугейз-проект с бархатными текстурами и эфирными вокалами. Музыка для тех, кто находит красоту в меланхолии.',
    socials: {
      instagram: 'https://instagram.com/velvetstatic',
      vk: 'https://vk.com/velvetstatic',
    },
  },
  {
    id: '3',
    name: 'MIDNIGHT TAPE',
    image: 'artist-3',
    genre: 'Lo-fi / Synthwave',
    bio: 'Ностальгический синтвейв с нотками lo-fi hip-hop. Саундтрек к ночным поездкам по неоновым городам, которых не существует.',
    socials: {
      telegram: 'https://t.me/midnighttape',
      instagram: 'https://instagram.com/midnighttape',
    },
  },
];

// Releases data
export const releases: Release[] = [
  {
    id: '1',
    title: 'Nocturnal Frequencies',
    artist: 'NØISE',
    artistId: '1',
    cover: 'release-1',
    releaseDate: '2024-11-01',
    type: 'album',
    year: 2024,
    genre: 'Dark Ambient',
    description: 'Дебютный альбом NØISE — путешествие через ночные частоты и индустриальные ландшафты. Восемь треков, созданных из полевых записей заброшенных заводов и синтетических текстур.',
    hasExclusive: true,
    requiredTier: 'fan',
    yandexMusicUrl: 'https://music.yandex.ru',
    youtubeMusicUrl: 'https://music.youtube.com',
    tracklist: [
      { id: 't1', title: 'Urban Decay', duration: '5:23' },
      { id: 't2', title: 'Neon Reflections', duration: '4:56', exclusive: true, requiredTier: 'fan' },
      { id: 't3', title: 'Static Dreams', duration: '6:12' },
      { id: 't4', title: 'Midnight Factory', duration: '5:45', exclusive: true, requiredTier: 'fan' },
      { id: 't5', title: 'Echo Chamber', duration: '7:01' },
      { id: 't6', title: 'Digital Rain', duration: '4:34' },
      { id: 't7', title: 'Concrete Jungle', duration: '5:52', exclusive: true, requiredTier: 'pro' },
      { id: 't8', title: 'Terminal', duration: '8:15' },
    ],
  },
  {
    id: '2',
    title: 'Velvet Dreams',
    artist: 'VELVET STATIC',
    artistId: '2',
    cover: 'release-2',
    releaseDate: '2024-10-15',
    type: 'ep',
    year: 2024,
    genre: 'Dream Pop',
    description: 'EP из четырех композиций, погружающих слушателя в бархатную дымку мечтаний. Эфирные гитары, реверберирующие вокалы и синтезаторные подушки создают кинематографическую атмосферу.',
    hasExclusive: true,
    requiredTier: 'lite',
    youtubeMusicUrl: 'https://music.youtube.com',
    tracklist: [
      { id: 't9', title: 'Fading Light', duration: '4:23' },
      { id: 't10', title: 'Crystal Tears', duration: '3:56', exclusive: true, requiredTier: 'lite' },
      { id: 't11', title: 'Velvet Sky', duration: '5:12' },
      { id: 't12', title: 'Dissolve', duration: '4:45' },
    ],
  },
  {
    id: '3',
    title: 'Retrograde',
    artist: 'MIDNIGHT TAPE',
    artistId: '3',
    cover: 'release-3',
    releaseDate: '2024-09-20',
    type: 'single',
    year: 2024,
    genre: 'Synthwave',
    description: 'Синтвейв-сингл с нотками ностальгии по 80-м. Пульсирующие басы, аналоговые синтезаторы и ломаный бит создают атмосферу ночной поездки по неоновому городу.',
    hasExclusive: false,
    yandexMusicUrl: 'https://music.yandex.ru',
    youtubeMusicUrl: 'https://music.youtube.com',
    tracklist: [
      { id: 't13', title: 'Retrograde', duration: '3:42' },
      { id: 't14', title: 'Retrograde (Extended Mix)', duration: '5:28', exclusive: true, requiredTier: 'fan' },
    ],
  },
];

// Blog posts
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Новый альбом NØISE выходит через неделю',
    excerpt: 'Мы рады анонсировать релиз дебютного альбома NØISE "Nocturnal Frequencies". Восемь треков темного эмбиента и индустриальной музы��и.',
    content: `Мы рады анонсировать релиз дебютного альбома NØISE "Nocturnal Frequencies". 

Альбом выйдет 1 ноября на всех стриминговых платформах. Подписчики Fan и Pro получат ранний доступ к трем эксклюзивным трекам уже сегодня.

"Nocturnal Frequencies" — это путешествие через ночные частоты и индустриальные ландшафты. Восемь треков были созданы из полевых записей заброшенных заводов, синтетических текстур и модульных синтезаторов.

Особое внимание было уделено созданию иммерсивного звукового опыта — рекомендуем слушать в наушниках в темное время суток.`,
    coverImage: 'blog-1',
    date: '2024-10-25',
    author: 'Echoes On Tape',
    isExclusive: false,
  },
  {
    id: '2',
    title: 'Behind the Scenes: Создание Velvet Dreams',
    excerpt: 'Эксклюзивный взгляд за кулисы создания EP "Velvet Dreams" от VELVET STATIC. Процесс записи, оборудование и вдохновение.',
    content: `[ЭКСКЛЮЗИВНЫЙ КОНТЕНТ ДЛЯ ПОДПИСЧИКОВ]

В этом материале мы раскрываем все секреты создания EP "Velvet Dreams".

ОБОРУДОВАНИЕ:
- Fender Jazzmaster через Strymon Big Sky
- Roland Juno-106 для синтезаторных партий
- Neumann U87 для вокала
- Multiple tape delays для создания глубины

ПРОЦЕСС:
Запись проходила в течение трех месяцев в домашней студии. Основной акцент был сделан на создании атмосферы через реверберацию и задержки.

Вокальные партии записывались поздно ночью, чтобы передать нужное настроение. Использовалось много слоев гитар, прогнанных через различные эффекты.

ВДОХНОВЕНИЕ:
Основное вдохновение пришло от фильмов Дэвида Линча и альбомов Cocteau Twins, Slowdive и My Bloody Valentine.`,
    coverImage: 'blog-2',
    date: '2024-10-20',
    author: 'VELVET STATIC',
    isExclusive: true,
    requiredTier: 'lite',
  },
  {
    id: '3',
    title: 'Планы на 2025: новые артисты и коллаборации',
    excerpt: 'Делимся планами развития лейбла на следующий год. Новые подписанты, совместные релизы и эксклюзивные мероприятия для подписчиков.',
    content: `[ЭКСКЛЮЗИВНЫЙ КОНТЕНТ ДЛЯ ПОДПИСЧИКОВ FAN И PRO]

Мы готовим большие изменения для Echoes On Tape в 2025 году.

НОВЫЕ АРТИСТЫ:
Мы в процессе переговоров с тремя новыми артистами, работающими в жанрах post-rock, ambient techno и experimental hip-hop. Официальные анонсы будут в январе.

КОЛЛАБОРАЦИИ:
Планируем серию совместных релизов между артистами лейбла. Первая коллаборация NØISE x MIDNIGHT TAPE выйдет в феврале.

МЕРОПРИЯТИЯ:
Для подписчиков Fan и Pro организуем закрытые listening parties в Москве и Санкт-Петербурге. Детали скоро.

PRO-подписчики получат доступ к мастер-классам от наших артистов по продакшену и саунд-дизайну.

Спасибо, что остаетесь с нами!`,
    coverImage: 'blog-3',
    date: '2024-11-10',
    author: 'Echoes On Tape',
    isExclusive: true,
    requiredTier: 'fan',
  },
];

// Exclusive content
export const exclusiveContent: ExclusiveContent[] = [
  {
    id: 'ex1',
    title: 'Neon Reflections (Exclusive Mix)',
    type: 'track',
    cover: 'exclusive-1',
    releaseDate: '2024-10-28',
    requiredTier: 'fan',
    downloadUrl: '#',
    streamUrl: '#',
  },
  {
    id: 'ex2',
    title: 'Making of Nocturnal Frequencies',
    type: 'video',
    cover: 'exclusive-2',
    releaseDate: '2024-10-25',
    requiredTier: 'fan',
    streamUrl: '#',
  },
  {
    id: 'ex3',
    title: 'Dark Ambient Sample Pack Vol.1',
    type: 'sample',
    cover: 'exclusive-3',
    releaseDate: '2024-10-20',
    requiredTier: 'pro',
    downloadUrl: '#',
  },
  {
    id: 'ex4',
    title: 'Reverb & Delay Presets',
    type: 'preset',
    cover: 'exclusive-4',
    releaseDate: '2024-10-15',
    requiredTier: 'pro',
    downloadUrl: '#',
  },
  {
    id: 'ex5',
    title: 'Crystal Tears (Stems)',
    type: 'track',
    cover: 'exclusive-5',
    releaseDate: '2024-10-10',
    requiredTier: 'pro',
    downloadUrl: '#',
  },
  {
    id: 'ex6',
    title: 'Velvet Dreams Studio Session',
    type: 'video',
    cover: 'exclusive-6',
    releaseDate: '2024-10-05',
    requiredTier: 'lite',
    streamUrl: '#',
  },
];

// Polls
export const polls: Poll[] = [
  {
    id: 'poll1',
    title: 'Выберите обложку для нового сингла MIDNIGHT TAPE',
    description: 'Помогите выбрать финальную обложку для предстоящего релиза',
    deadline: '2024-12-01',
    requiredTier: 'fan',
    status: 'active',
    totalVotes: 247,
    options: [
      { id: 'opt1', title: 'Вариант A - Neon City', image: 'poll-1-a', votes: 132 },
      { id: 'opt2', title: 'Вариант B - Dark Highway', image: 'poll-1-b', votes: 89 },
      { id: 'opt3', title: 'Вариант C - Retro Sunset', image: 'poll-1-c', votes: 26 },
    ],
  },
  {
    id: 'poll2',
    title: 'Какой трек из альбома снять в виде клипа?',
    description: 'PRO-подписчики выбирают следующий видеоклип',
    deadline: '2024-12-15',
    requiredTier: 'pro',
    status: 'active',
    totalVotes: 84,
    options: [
      { id: 'opt4', title: 'Urban Decay', votes: 42 },
      { id: 'opt5', title: 'Midnight Factory', votes: 28 },
      { id: 'opt6', title: 'Terminal', votes: 14 },
    ],
  },
];

// PRO Library
export const proLibrary: ProLibraryItem[] = [
  {
    id: 'pro1',
    title: 'Dark Ambient Textures Vol.1',
    type: 'sample',
    artist: 'NØISE',
    cover: 'pro-1',
    format: 'WAV',
    size: '485 MB',
    releaseDate: '2024-10-20',
    downloadUrl: '#',
  },
  {
    id: 'pro2',
    title: 'Reverb Cathedral Presets',
    type: 'preset',
    artist: 'VELVET STATIC',
    cover: 'pro-2',
    format: 'VST3',
    size: '12 MB',
    releaseDate: '2024-10-15',
    downloadUrl: '#',
  },
  {
    id: 'pro3',
    title: 'Synthwave MIDI Pack',
    type: 'midi',
    artist: 'MIDNIGHT TAPE',
    cover: 'pro-3',
    format: 'MIDI',
    size: '2 MB',
    releaseDate: '2024-10-10',
    downloadUrl: '#',
  },
  {
    id: 'pro4',
    title: 'Mixing Dark Ambient in Ableton',
    type: 'tutorial',
    artist: 'NØISE',
    cover: 'pro-4',
    format: 'MP4 + Project',
    size: '1.2 GB',
    releaseDate: '2024-10-05',
    downloadUrl: '#',
  },
];

// Merch
export const merchItems: MerchItem[] = [
  {
    id: 'merch1',
    title: 'Echoes On Tape Logo Tee',
    image: 'merch-1',
    price: 2500,
    discountPercent: 15,
    category: 'clothing',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'merch2',
    title: 'Nocturnal Frequencies Vinyl',
    image: 'merch-2',
    price: 3500,
    category: 'accessories',
  },
  {
    id: 'merch3',
    title: 'NØISE Tour Hoodie',
    image: 'merch-3',
    price: 4500,
    discountPercent: 15,
    category: 'clothing',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'merch4',
    title: 'Velvet Dreams Poster',
    image: 'merch-4',
    price: 800,
    discountPercent: 15,
    category: 'posters',
  },
  {
    id: 'merch5',
    title: 'Echoes Tote Bag',
    image: 'merch-5',
    price: 1200,
    category: 'accessories',
  },
  {
    id: 'merch6',
    title: 'Limited Edition Cap',
    image: 'merch-6',
    price: 1800,
    discountPercent: 15,
    category: 'accessories',
  },
];

// Payment history for account page
export const paymentHistory = [
  { id: 'pay1', date: '2024-11-18', amount: 500, status: 'Оплачено', description: 'Подписка Fan' },
  { id: 'pay2', date: '2024-10-18', amount: 500, status: 'Оплачено', description: 'Подписка Fan' },
  { id: 'pay3', date: '2024-09-18', amount: 500, status: 'Оплачено', description: 'Подписка Fan' },
];

// Downloaded materials for account page
export const downloadedMaterials = [
  { id: 'dl1', title: 'Dark Ambient Sample Pack Vol.1', date: '2024-11-10', type: 'Сэмплы' },
  { id: 'dl2', title: 'Neon Reflections (Exclusive Mix)', date: '2024-11-05', type: 'Трек' },
  { id: 'dl3', title: 'Making of Nocturnal Frequencies', date: '2024-10-28', type: 'Видео' },
];

// Promo codes for account page
export const promoCodes = [
  { id: 'promo1', code: 'ECHOES15', discount: '15%', validUntil: '2024-12-31', description: 'Скидка на мерч' },
  { id: 'promo2', code: 'FAN20', discount: '20%', validUntil: '2025-01-15', description: 'Скидка на винил' },
];
