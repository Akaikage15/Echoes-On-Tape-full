/**
 * Seed-скрипт для заполнения БД начальными данными
 * Запуск: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение БД...');

  // Очистка БД (опционально, для dev окружения)
  console.log('🗑️  Очистка существующих данных...');
  await prisma.userVote.deleteMany();
  await prisma.pollOption.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.demo.deleteMany();
  await prisma.proLibraryItem.deleteMany();
  await prisma.merchItem.deleteMany();
  await prisma.exclusiveContent.deleteMany();
  await prisma.post.deleteMany();
  await prisma.release.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();

  // 1. Создание пользователей
  console.log('👤 Создание пользователей...');
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@echoes.tape',
      password_hash: passwordHash,
      name: 'Admin',
      subscriptionTier: 'pro',
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  const testUser = await prisma.user.create({
    data: {
      email: 'test@test.com',
      password_hash: passwordHash,
      name: 'Test User',
      subscriptionTier: 'fan',
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const freeUser = await prisma.user.create({
    data: {
      email: 'free@test.com',
      password_hash: passwordHash,
      name: 'Free User',
      subscriptionTier: 'none',
    },
  });

  // 2. Создание артистов
  console.log('🎤 Создание артистов...');
  const artist1 = await prisma.artist.create({
    data: {
      name: 'LXST MXRCRY',
      bio: 'Пионер российской phonk-сцены. Создатель атмосферного и мрачного звучания.',
      photo_url: '/images/artist1.jpg',
      social_links: {
        instagram: 'https://instagram.com/lxstmxrcry',
        spotify: 'https://open.spotify.com/artist/lxstmxrcry',
      },
    },
  });

  const artist2 = await prisma.artist.create({
    data: {
      name: 'KORDHELL',
      bio: 'Мастер агрессивного phonk и hard bass. Известен своими энергичными треками.',
      photo_url: '/images/artist2.jpg',
      social_links: {
        instagram: 'https://instagram.com/kordhell',
        spotify: 'https://open.spotify.com/artist/kordhell',
      },
    },
  });

  const artist3 = await prisma.artist.create({
    data: {
      name: 'GHOSTRIDER',
      bio: 'Экспериментальный продюсер, сочетающий phonk с элементами trap и drill.',
      photo_url: '/images/artist3.jpg',
      social_links: {
        instagram: 'https://instagram.com/ghostrider',
        soundcloud: 'https://soundcloud.com/ghostrider',
      },
    },
  });

  // 3. Создание релизов
  console.log('💿 Создание релизов...');
  const release1 = await prisma.release.create({
    data: {
      artist_id: artist1.id,
      title: 'Dark Echoes',
      cover_art_url: '/images/release-dark-echoes.jpg',
      release_date: new Date('2024-01-15'),
      type: 'album',
      description: 'Дебютный альбом, погружающий в мрачную атмосферу ночного города.',
      streaming_links: {
        spotify: 'https://open.spotify.com/album/dark-echoes',
        apple_music: 'https://music.apple.com/album/dark-echoes',
      },
    },
  });

  const release2 = await prisma.release.create({
    data: {
      artist_id: artist2.id,
      title: 'Adrenaline Rush',
      cover_art_url: '/images/release-adrenaline.jpg',
      release_date: new Date('2024-03-20'),
      type: 'ep',
      description: 'EP с самыми агрессивными треками для тренировок и драйва.',
      streaming_links: {
        spotify: 'https://open.spotify.com/album/adrenaline-rush',
        soundcloud: 'https://soundcloud.com/kordhell/adrenaline-rush',
      },
    },
  });

  const release3 = await prisma.release.create({
    data: {
      artist_id: artist3.id,
      title: 'Midnight Ride',
      cover_art_url: '/images/release-midnight.jpg',
      release_date: new Date('2024-06-10'),
      type: 'single',
      description: 'Сингл, идеально подходящий для ночных поездок.',
      streaming_links: {
        spotify: 'https://open.spotify.com/track/midnight-ride',
      },
    },
  });

  // 4. Создание постов
  console.log('📝 Создание постов...');
  await prisma.post.create({
    data: {
      author_id: adminUser.id,
      title: 'Добро пожаловать в Echoes On Tape!',
      content: 'Мы рады представить вам наш новый лейбл, посвященный phonk-музыке и андеграундной культуре. Здесь вы найдете эксклюзивные релизы, прямую связь с артистами и уникальный контент.',
      cover_image_url: '/images/blog-welcome.jpg',
      is_public: true,
    },
  });

  await prisma.post.create({
    data: {
      author_id: adminUser.id,
      title: 'Интервью с LXST MXRCRY',
      content: 'Эксклюзивное интервью с одним из самых ярких представителей российской phonk-сцены. Узнайте о его творческом пути, вдохновении и планах на будущее.',
      cover_image_url: '/images/blog-interview.jpg',
      is_public: false,
      min_tier: 'fan',
    },
  });

  // 5. Создание эксклюзивного контента
  console.log('🔒 Создание эксклюзивного контента...');
  await prisma.exclusiveContent.create({
    data: {
      release_id: release1.id,
      title: 'Dark Echoes - Extended Mix',
      type: 'track',
      required_tier: 'fan',
      description: 'Расширенная версия трека с дополнительными 2 минутами атмосферы.',
      file_url: '/audio/dark-echoes-extended.mp3',
      preview_image_url: '/images/release-dark-echoes.jpg',
    },
  });

  await prisma.exclusiveContent.create({
    data: {
      title: 'Phonk Production Masterclass',
      type: 'video',
      required_tier: 'pro',
      description: 'Полный мастер-класс по созданию phonk-треков от KORDHELL.',
      file_url: '/video/masterclass-phonk.mp4',
      preview_image_url: '/images/masterclass-preview.jpg',
    },
  });

  // 6. Создание товаров мерча
  console.log('👕 Создание товаров мерча...');
  await prisma.merchItem.createMany({
    data: [
      {
        title: 'Echoes On Tape Hoodie',
        image: '/images/merch-hoodie.jpg',
        price: 3500,
        type: 'clothing',
        sizes: ['S', 'M', 'L', 'XL'],
      },
      {
        title: 'Phonk Vibes T-Shirt',
        image: '/images/merch-tshirt.jpg',
        price: 1500,
        type: 'clothing',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        title: 'Vinyl Sticker Pack',
        image: '/images/merch-stickers.jpg',
        price: 500,
        type: 'accessory',
      },
    ],
  });

  // 7. Создание голосований
  console.log('🗳️  Создание голосований...');
  const poll1 = await prisma.poll.create({
    data: {
      creator_id: adminUser.id,
      question: 'Какой следующий релиз вы хотите услышать?',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      is_public: true,
      status: 'active',
    },
  });

  await prisma.pollOption.createMany({
    data: [
      { poll_id: poll1.id, label: 'Новый альбом LXST MXRCRY', votes: 45 },
      { poll_id: poll1.id, label: 'Коллаборация KORDHELL x GHOSTRIDER', votes: 78 },
      { poll_id: poll1.id, label: 'Compilation от лейбла', votes: 23 },
    ],
  });

  // 8. Создание PRO-библиотеки
  console.log('📚 Создание PRO-библиотеки...');
  await prisma.proLibraryItem.createMany({
    data: [
      {
        title: 'Phonk Drum Kit Vol.1',
        type: 'sample_pack',
        description: '200+ уникальных сэмплов для создания phonk-треков.',
        required_tier: 'fan',
        file_url: '/downloads/phonk-drum-kit-v1.zip',
        preview_image_url: '/images/drum-kit-preview.jpg',
      },
      {
        title: 'Serum Presets - Dark Vibes',
        type: 'preset_pack',
        description: '50 пресетов для Serum в стиле dark phonk.',
        required_tier: 'pro',
        file_url: '/downloads/serum-dark-vibes.zip',
        preview_image_url: '/images/serum-presets.jpg',
      },
      {
        title: 'FL Studio Project - "Midnight"',
        type: 'daw_project',
        description: 'Полный проект трека "Midnight" для изучения.',
        required_tier: 'pro',
        file_url: '/downloads/midnight-flp.zip',
        preview_image_url: '/images/flp-preview.jpg',
      },
    ],
  });

  console.log('✅ Заполнение БД завершено!');
  console.log(`
📊 Создано:
- Пользователей: 3
- Артистов: 3
- Релизов: 3
- Постов: 2
- Эксклюзивного контента: 2
- Товаров мерча: 3
- Голосований: 1
- PRO-библиотека: 3 элемента

🔑 Тестовые аккаунты:
- admin@echoes.tape / password123 (Pro подписка)
- test@test.com / password123 (Fan подписка)
- free@test.com / password123 (Без подписки)
  `);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении БД:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
