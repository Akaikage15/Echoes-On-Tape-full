import bcrypt from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken } from '../utils/token';

const prisma = new PrismaClient();

export class AuthService {
  async register(email: string, password: string, name?: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password_hash, name },
    });

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = await generateRefreshToken(user.id);

    return { user: this.sanitizeUser(user), accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = await generateRefreshToken(user.id);

    return { user: this.sanitizeUser(user), accessToken, refreshToken };
  }

  async refresh(token: string) {
    const userId = await verifyRefreshToken(token);
    if (!userId) {
      throw new Error('Invalid refresh token');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Revoke old refresh token and issue a new one (Rotation)
    await revokeRefreshToken(token);
    const newRefreshToken = await generateRefreshToken(user.id);
    const newAccessToken = generateAccessToken(user.id, user.email);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(token: string) {
    await revokeRefreshToken(token);
  }

  private sanitizeUser(user: User) {
    const { password_hash, ...rest } = user;
    return rest;
  }
}

export const authService = new AuthService();
