import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const prismaConnect = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to the DB");
  } catch (err) {
    console.error("❌ Error connecting to the DB");
  }
};

export default prisma;
