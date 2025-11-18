# Схема базы данных "Echoes On Tape"

## Таблица: `Users`
*Пользователи платформы*

| Колонка | Тип | Описание |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, генерируется автоматически |
| `email` | `VARCHAR(255)` | Уникальный, используется для входа |
| `password_hash` | `VARCHAR(255)` | Хеш пароля |
| `name` | `VARCHAR(100)` | Имя пользователя |
| `avatar_url` | `TEXT` | URL аватара |
| `created_at` | `TIMESTAMPZ` | Дата создания |
| `updated_at` | `TIMESTAMPZ` | Дата обновления |

## Таблица: `Subscriptions`
*Подписки пользователей*

| Колонка | Тип | Описание |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key |
| `user_id` | `UUID` | Foreign Key -> `Users.id` |
| `tier` | `VARCHAR(20)` | `lite`, `fan`, `pro` |
| `status` | `VARCHAR(20)` | `active`, `canceled`, `past_due` |
| `current_period_end` | `TIMESTAMPZ` | Дата окончания текущего оплаченного периода |
| `payment_provider_id` | `VARCHAR(255)` | ID подписки во внешней платежной системе |
| `created_at` | `TIMESTAMPZ` | Дата создания |
| `updated_at` | `TIMESTAMPZ` | Дата обновления |

## Таблица: `Artists`
*Артисты лейбла*

| Колонка | Тип | Описание |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key |
| `name` | `VARCHAR(255)` | Имя артиста |
| `bio` | `TEXT` | Биография |
| `photo_url` | `TEXT` | URL фотографии |
| `social_links` | `JSONB` | Ссылки на соцсети |
| `created_at` | `TIMESTAMPZ` | Дата создания |
| `updated_at` | `TIMESTAMPZ` | Дата обновления |

## Таблица: `Releases`
*Музыкальные релизы*

| Колонка | Тип | Описание |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key |
| `artist_id` | `UUID` | Foreign Key -> `Artists.id` |
| `title` | `VARCHAR(255)` | Название релиза |
| `cover_art_url` | `TEXT` | URL обложки |
| `release_date` | `DATE` | Дата релиза |
| `description` | `TEXT` | Описание |
| `streaming_links` | `JSONB` | Ссылки на стриминговые сервисы |
| `created_at` | `TIMESTAMPZ` | Дата создания |
| `updated_at` | `TIMESTAMPZ` | Дата обновления |

## Таблица: `Posts`
*Посты в блоге*

| Колонка | Тип | Описание |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key |
| `author_id` | `UUID` | Foreign Key -> `Users.id` (кто из команды написал) |
| `title` | `VARCHAR(255)` | Заголовок поста |
| `content` | `TEXT` | Содержимое поста |
| `cover_image_url` | `TEXT` | URL обложки поста |
| `is_public` | `BOOLEAN` | `true` - для всех, `false` - для подписчиков |
| `min_tier` | `VARCHAR(20)` | Минимальный уровень подписки для доступа (`fan`, `pro`) |
| `created_at` | `TIMESTAMPZ` | Дата создания |
| `updated_at` | `TIMESTAMPZ` | Дата обновления |

## Таблица: `ExclusiveContent`
*Эксклюзивный контент (треки, файлы)*

| Колонка | Тип | Описание |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key |
| `release_id` | `UUID` | Foreign Key -> `Releases.id` (если привязан к релизу) |
| `title` | `VARCHAR(255)` | Название контента |
| `type` | `VARCHAR(50)` | `audio`, `video`, `sample_pack`, `daw_project` |
| `file_url` | `TEXT` | URL для скачивания/стриминга |
| `min_tier` | `VARCHAR(20)` | Минимальный уровень подписки для доступа (`fan`, `pro`) |
| `created_at` | `TIMESTAMPZ` | Дата создания |
| `updated_at` | `TIMESTAMPZ` | Дата обновления |

## Таблица: `Payments`
*История платежей*

| Колонка | Тип | Описание |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key |
| `user_id` | `UUID` | Foreign Key -> `Users.id` |
| `subscription_id` | `UUID` | Foreign Key -> `Subscriptions.id` |
| `amount` | `DECIMAL(10, 2)` | Сумма платежа |
| `currency` | `VARCHAR(3)` | `RUB`, `USD` |
| `status` | `VARCHAR(20)` | `succeeded`, `failed` |
| `payment_provider_tx_id` | `VARCHAR(255)` | ID транзакции во внешней платежной системе |
| `created_at` | `TIMESTAMPZ` | Дата создания |
