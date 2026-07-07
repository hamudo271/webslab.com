import { PrismaClient } from '@prisma/client';

// Next.js dev 핫리로드 시 커넥션 누수 방지용 싱글턴
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
