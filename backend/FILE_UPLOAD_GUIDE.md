# Руководство по загрузке файлов

## Обзор

Система загрузки файлов поддерживает три типа контента:
- **Аватары** - изображения профиля пользователей
- **Обложки** - изображения для релизов
- **Аудио** - музыкальные файлы

## Эндпоинты

### POST /api/upload/avatar
Загрузка аватара пользователя (доступно всем авторизованным)

**Параметры:**
- `avatar` (file) - изображение JPG, PNG или WEBP (макс. 5MB)

**Ответ:**
```json
{
  "message": "Аватар успешно загружен",
  "url": "/uploads/avatars/avatar-1234567890-123456789.jpg",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "avatar_url": "/uploads/avatars/avatar-1234567890-123456789.jpg"
  }
}
```

### POST /api/upload/cover
Загрузка обложки релиза (только артисты и админы)

**Параметры:**
- `cover` (file) - изображение JPG, PNG или WEBP (макс. 10MB)

**Ответ:**
```json
{
  "message": "Обложка успешно загружена",
  "url": "/uploads/covers/cover-1234567890-123456789.jpg",
  "filename": "cover-1234567890-123456789.jpg",
  "size": 2048576
}
```

### POST /api/upload/audio
Загрузка аудио-файла (только артисты и админы)

**Параметры:**
- `audio` (file) - аудио MP3, WAV или FLAC (макс. 100MB)

**Ответ:**
```json
{
  "message": "Аудио успешно загружено",
  "url": "/uploads/audio/audio-1234567890-123456789.mp3",
  "filename": "audio-1234567890-123456789.mp3",
  "size": 10485760,
  "mimetype": "audio/mpeg"
}
```

## Ограничения

### Аватары
- Форматы: JPG, PNG, WEBP
- Максимальный размер: 5MB
- Автоматически обновляет профиль пользователя

### Обложки
- Форматы: JPG, PNG, WEBP
- Максимальный размер: 10MB
- Требуется роль ARTIST или ADMIN

### Аудио
- Форматы: MP3, WAV, FLAC
- Максимальный размер: 100MB
- Требуется роль ARTIST или ADMIN

## Использование на фронтенде

### Загрузка аватара

```typescript
import { uploadAvatar } from '@/lib/api';

const handleAvatarUpload = async (file: File) => {
  try {
    const response = await uploadAvatar(file);
    console.log('Аватар загружен:', response.url);
    // Обновляем UI
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
};
```

### Компонент AvatarUpload

```tsx
import { AvatarUpload } from '@/components/AvatarUpload';

<AvatarUpload 
  currentAvatar={user?.avatar_url}
  onUploadSuccess={(url) => {
    console.log('Новый аватар:', url);
  }}
/>
```

### Загрузка обложки

```typescript
import { uploadCover } from '@/lib/api';

const handleCoverUpload = async (file: File) => {
  try {
    const response = await uploadCover(file);
    // Используем response.url при создании релиза
    await createRelease({
      title: 'New Release',
      cover_art_url: response.url,
      // ...
    });
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
};
```

### Загрузка аудио

```typescript
import { uploadAudio } from '@/lib/api';

const handleAudioUpload = async (file: File) => {
  try {
    const response = await uploadAudio(file);
    // Используем response.url для создания контента
    await createExclusiveContent({
      title: 'New Track',
      file_url: response.url,
      // ...
    });
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
};
```

## Обработка ошибок

### 400 Bad Request
Файл не загружен или неверный формат:
```json
{
  "error": "Файл не загружен"
}
```

### 401 Unauthorized
Требуется аутентификация:
```json
{
  "error": "Требуется аутентификация"
}
```

### 403 Forbidden
Недостаточно прав (для cover/audio):
```json
{
  "error": "Недостаточно прав доступа",
  "required": ["ADMIN", "ARTIST"],
  "current": "FREE_USER"
}
```

### 413 Payload Too Large
Файл слишком большой:
```json
{
  "error": "Недопустимый формат изображения. Разрешены: JPG, PNG, WEBP"
}
```

## Хранение файлов

### Локальное хранилище (текущая реализация)

Файлы сохраняются в директории `backend/uploads/`:
```
backend/uploads/
├── avatars/
│   └── avatar-1234567890-123456789.jpg
├── covers/
│   └── cover-1234567890-123456789.jpg
└── audio/
    └── audio-1234567890-123456789.mp3
```

Доступ к файлам: `http://localhost:3001/uploads/avatars/filename.jpg`

### Миграция на облачное хранилище (будущее)

Для продакшена рекомендуется использовать:
- **AWS S3** - надёжное и масштабируемое хранилище
- **Cloudinary** - с автоматической оптимизацией изображений
- **DigitalOcean Spaces** - доступная альтернатива S3

Пример интеграции с AWS S3:

```typescript
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export const uploadAvatar = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    acl: 'public-read',
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `avatars/avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
```

## Оптимизация изображений

### Рекомендации для продакшена

1. **Автоматическая оптимизация**
   - Сжатие JPEG/PNG
   - Конвертация в WebP
   - Генерация thumbnails

2. **Responsive images**
   - Создание нескольких размеров
   - Использование srcset на фронтенде

3. **CDN**
   - Раздача через CloudFront/Cloudflare
   - Кэширование на edge серверах

### Пример с Sharp (Node.js)

```typescript
import sharp from 'sharp';

const optimizeImage = async (inputPath: string, outputPath: string) => {
  await sharp(inputPath)
    .resize(800, 800, { fit: 'inside' })
    .webp({ quality: 80 })
    .toFile(outputPath);
};
```

## Безопасность

### Валидация на сервере

1. **Проверка MIME-типа**
   ```typescript
   const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
   if (!allowedTypes.includes(file.mimetype)) {
     throw new Error('Недопустимый формат');
   }
   ```

2. **Проверка расширения файла**
   ```typescript
   const ext = path.extname(file.originalname).toLowerCase();
   if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
     throw new Error('Недопустимое расширение');
   }
   ```

3. **Проверка размера**
   ```typescript
   limits: {
     fileSize: 5 * 1024 * 1024 // 5MB
   }
   ```

### Защита от вредоносных файлов

1. **Сканирование антивирусом** (для продакшена)
2. **Проверка magic bytes** (не только расширения)
3. **Изоляция загруженных файлов** (отдельный домен/CDN)

## Тестирование

### Пример теста загрузки

```typescript
describe('File Upload', () => {
  it('должен загрузить аватар', async () => {
    const response = await request(app)
      .post('/api/upload/avatar')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', Buffer.from('fake image'), 'test.jpg');

    expect(response.status).toBe(200);
    expect(response.body.url).toContain('/uploads/avatars/');
  });

  it('должен отклонить слишком большой файл', async () => {
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
    
    const response = await request(app)
      .post('/api/upload/avatar')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', largeBuffer, 'large.jpg');

    expect(response.status).toBe(413);
  });
});
```

## Мониторинг

### Метрики для отслеживания

1. **Количество загрузок** (по типу файла)
2. **Средний размер файлов**
3. **Ошибки загрузки** (по причинам)
4. **Использование дискового пространства**
5. **Время обработки загрузки**

### Логирование

```typescript
console.log(`[UPLOAD] User ${req.user.id} uploaded ${file.mimetype} (${file.size} bytes)`);
```

## Roadmap

- [ ] Интеграция с AWS S3/Cloudinary
- [ ] Автоматическая оптимизация изображений
- [ ] Генерация thumbnails
- [ ] Поддержка видео-файлов
- [ ] Прогресс-бар загрузки на фронтенде
- [ ] Drag & Drop для всех типов файлов
- [ ] Обрезка изображений перед загрузкой
- [ ] Batch upload (множественная загрузка)
