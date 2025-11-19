import { v4 as uuidv4 } from 'uuid';

interface Post {
  id: string;
  author_id: string; // Assuming we'll have users later
  title: string;
  content: string;
  cover_image_url?: string;
  is_public: boolean;
  min_tier?: 'lite' | 'fan' | 'pro';
  created_at: Date;
  updated_at: Date;
}

const posts: Post[] = [
  {
    id: uuidv4(),
    author_id: uuidv4(), // Mock author ID
    title: 'Новый альбом NØISE выходит через неделю',
    content: `Мы рады анонсировать релиз дебютного альбома NØISE "Nocturnal Frequencies". 
Альбом выйдет 1 ноября на всех стриминговых платформах. Подписчики Fan и Pro получат ранний доступ к трем эксклюзивным трекам уже сегодня.
"Nocturnal Frequencies" — это путешествие через ночные частоты и индустриальные ландшафты. Восемь треков были созданы из полевых записей заброшенных заводов, синтетических текстур и модульных синтезаторов.
Особое внимание было уделено созданию иммерсивного звукового опыта — рекомендуем слушать в наушниках в темное время суток.`,
    cover_image_url: '/images/blog-1.jpg', // Placeholder image
    is_public: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: uuidv4(),
    author_id: uuidv4(), // Mock author ID
    title: 'Behind the Scenes: Создание Velvet Dreams',
    content: `В этом материале мы раскрываем все секреты создания EP "Velvet Dreams".
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
    cover_image_url: '/images/blog-2.jpg', // Placeholder image
    is_public: false,
    min_tier: 'lite',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: uuidv4(),
    author_id: uuidv4(), // Mock author ID
    title: 'Планы на 2025: новые артисты и коллаборации',
    content: `Мы готовим большие изменения для Echoes On Tape в 2025 году.
НОВЫЕ АРТИСТЫ:
Мы в процессе переговоров с тремя новыми артистами, работающими в жанрах post-rock, ambient techno и experimental hip-hop. Официальные анонсы будут в январе.
КОЛЛАБОРАЦИИ:
Планируем серию совместных релизов между артистами лейбла. Первая коллаборация NØISE x MIDNIGHT TAPE выйдет в феврале.
МЕРОПРИЯТИЯ:
Для подписчиков Fan и Pro организуем закрытые listening parties в Москве и Санкт-Петербурге. Детали скоро.
PRO-подписчики получат доступ к мастер-классам от наших артистов по продакшену и саунд-дизайну.
Спасибо, что остаетесь с нами!`,
    cover_image_url: '/images/blog-3.jpg', // Placeholder image
    is_public: false,
    min_tier: 'fan',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const getAllPosts = async (): Promise<Post[]> => {
  return posts;
};

export const getPostById = async (id: string): Promise<Post | undefined> => {
  return posts.find(post => post.id === id);
};

export const clearPostsData = () => {
  posts.length = 0;
};
