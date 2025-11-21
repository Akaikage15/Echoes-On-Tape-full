/**
 * Poll Repository
 * Слой доступа к голосованиям
 */

import prisma from '../lib/prisma';
import { Poll, PollOption } from '@prisma/client';

export type PollWithOptions = Poll & { options: PollOption[] };

export class PollRepository {
  /**
   * Получить все голосования с опциями
   */
  async findAll(): Promise<PollWithOptions[]> {
    return await prisma.poll.findMany({
      include: {
        options: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Найти голосование по ID
   */
  async findById(id: string): Promise<PollWithOptions | null> {
    return await prisma.poll.findUnique({
      where: { id },
      include: {
        options: true,
      },
    });
  }

  /**
   * Проголосовать
   */
  async vote(userId: string, pollId: string, optionId: string): Promise<PollWithOptions> {
    // Проверяем, не голосовал ли пользователь уже
    const existingVote = await prisma.userVote.findUnique({
      where: {
        user_id_poll_id: {
          user_id: userId,
          poll_id: pollId,
        },
      },
    });

    if (existingVote) {
      throw new Error('Вы уже проголосовали в этом опросе');
    }

    // Создаем голос и увеличиваем счетчик
    await prisma.$transaction([
      prisma.userVote.create({
        data: {
          user_id: userId,
          poll_id: pollId,
          option_id: optionId,
        },
      }),
      prisma.pollOption.update({
        where: { id: optionId },
        data: {
          votes: {
            increment: 1,
          },
        },
      }),
    ]);

    // Возвращаем обновленное голосование
    const updatedPoll = await this.findById(pollId);
    if (!updatedPoll) {
      throw new Error('Голосование не найдено');
    }
    return updatedPoll;
  }

  /**
   * Проверить, голосовал ли пользователь
   */
  async hasUserVoted(userId: string, pollId: string): Promise<boolean> {
    const vote = await prisma.userVote.findUnique({
      where: {
        user_id_poll_id: {
          user_id: userId,
          poll_id: pollId,
        },
      },
    });
    return !!vote;
  }

  /**
   * Получить голос пользователя
   */
  async getUserVote(userId: string, pollId: string): Promise<string | null> {
    const vote = await prisma.userVote.findUnique({
      where: {
        user_id_poll_id: {
          user_id: userId,
          poll_id: pollId,
        },
      },
    });
    return vote?.option_id || null;
  }
}

export const pollRepository = new PollRepository();
