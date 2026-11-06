
import { PrismaClient } from "@prisma/client";

// Reuse one Prisma Client instance during development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use the existing instance or create a new one
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["warn", "error"],
  });

// Prevent multiple Prisma Client instances during hot reload
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
