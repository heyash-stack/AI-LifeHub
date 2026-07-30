import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { env } from './env.config';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const db: PrismaClient =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = db;
}

export const connectDatabase = async (): Promise<void> => {
  try {
    await db.$connect();
    logger.info('✅ Successfully connected to database');
  } catch (error) {
    logger.error('❌ Failed to connect to database', error);
    process.exit(1);
  }
};
