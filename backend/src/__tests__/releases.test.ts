/**
 * Тесты для Releases Controller
 * Проверка получения, создания и обновления релизов
 */

import request from 'supertest';
import app from '../app';
import { prisma } from './setup';

describe('Releases Controller', () => {
  let token: string;
  let artistId: string;

  beforeEach(async () => {
    // Регистрация пользователя
    const authResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'releases@example.com',
        password: 'Test123!',
        name: 'Releases User',
      });
    token = authResponse.body.token;

    // Создание артиста
    const artist = await prisma.artist.create({
      data: {
        name: 'Test Artist',
        bio: 'Test bio',
        photo_url: 'https://example.com/image.jpg',
      },
    });
    artistId = artist.id;
  });

  describe('GET /api/releases', () => {
    beforeEach(async () => {
      await prisma.release.createMany({
        data: [
          {
            title: 'Release 1',
            artist_id: artistId,
            release_date: new Date(),
            cover_art_url: 'https://example.com/cover1.jpg',
            type: 'ALBUM',
            description: 'Description 1',
          },
          {
            title: 'Release 2',
            artist_id: artistId,
            release_date: new Date(),
            cover_art_url: 'https://example.com/cover2.jpg',
            type: 'EP',
            description: 'Description 2',
          },
        ],
      });
    });

    it('должен вернуть список релизов', async () => {
      const response = await request(app).get('/api/releases');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('должен фильтровать по типу', async () => {
      const response = await request(app).get('/api/releases?type=ALBUM');

      expect(response.status).toBe(200);
      expect(response.body.every((r: any) => r.type === 'ALBUM')).toBe(true);
    });
  });

  describe('GET /api/releases/:id', () => {
    let releaseId: string;

    beforeEach(async () => {
      const release = await prisma.release.create({
        data: {
          title: 'Single Release',
          artist_id: artistId,
          release_date: new Date(),
          cover_art_url: 'https://example.com/cover.jpg',
          type: 'SINGLE',
          description: 'Single Description',
        },
      });
      releaseId = release.id;
    });

    it('должен вернуть релиз по ID', async () => {
      const response = await request(app).get(`/api/releases/${releaseId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(releaseId);
      expect(response.body.title).toBe('Single Release');
    });

    it('должен вернуть 404 для несуществующего релиза', async () => {
      const response = await request(app).get('/api/releases/nonexistent-id');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/releases', () => {
    it('должен создать новый релиз с валидными данными', async () => {
      const response = await request(app)
        .post('/api/releases')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Release',
          artist_id: artistId,
          release_date: new Date().toISOString(),
          cover_art_url: 'https://example.com/new-cover.jpg',
          type: 'ALBUM',
          description: 'New Description',
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Release');
    });

    it('должен вернуть 400 при невалидных данных', async () => {
      const response = await request(app)
        .post('/api/releases')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '',
          artist_id: 'invalid-id',
        });

      expect(response.status).toBe(400);
    });

    it('должен вернуть 401 без токена', async () => {
      const response = await request(app)
        .post('/api/releases')
        .send({
          title: 'New Release',
          artist_id: artistId,
        });

      expect(response.status).toBe(401);
    });
  });
});
