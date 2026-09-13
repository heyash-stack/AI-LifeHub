import { db } from '../config/db.config';
import { RegisterInput, LoginInput } from '../models/auth.dto';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.util';
import { AppError } from '../middlewares/error.middleware';

export class AuthService {
  static async register(data: RegisterInput) {
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      const error: AppError = new Error('User with this email already exists');
      error.statusCode = 400;
      throw error;
    }

    const passwordHash = await hashPassword(data.password);

    const user = await db.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        profile: {
          create: {},
        },
        usage: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await db.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { user, accessToken, refreshToken };
  }

  static async login(data: LoginInput) {
    const user = await db.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      const error: AppError = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isValid = await comparePassword(data.password, user.passwordHash);
    if (!isValid) {
      const error: AppError = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await db.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshTokens(token: string) {
    const payload = verifyRefreshToken(token);
    const storedToken = await db.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      const error: AppError = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }

    // Revoke used refresh token
    await db.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    await db.refreshToken.create({
      data: {
        userId: payload.userId,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async logout(refreshToken: string) {
    if (!refreshToken) return;
    try {
      await db.refreshToken.update({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    } catch (error) {
      // Ignore if token not found or already revoked
    }
  }
}
