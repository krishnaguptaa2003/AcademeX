// server/src/prisma.js
import { PrismaClient } from "@prisma/client";

/**
 * Single Prisma Client instance
 * (prevents connection explosion in dev)
 */
const prisma = new PrismaClient();

/**
 * ✅ DEFAULT EXPORT
 * Allows: import prisma from "../prisma.js"
 */
export default prisma;

/**
 * ✅ NAMED EXPORT
 * Allows: import { prisma } from "../prisma.js"
 */
export { prisma };
