import * as PrismaModule from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Some Prisma v7 package typings can differ across installs; avoid relying on
// a named type export here and treat the runtime client as `any` to keep the
// code type-safe enough for our usage while satisfying the TypeScript
// build. This also preserves the adapter usage from `@prisma/adapter-pg`.
const PrismaClientCtor =
  (PrismaModule as any).PrismaClient ??
  (PrismaModule as any).default ??
  PrismaModule;

const globalForPrisma = globalThis as unknown as { prisma: any };

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClientCtor({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
