import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import { type GetTransactionsQuery, getTransactionsSchema } from "../../schemas/transaction.schema";
import type { TransactionFilter } from "../../types/transaction.types";

dayjs.extend(utc);

export const getTransactions = async (
  request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.status(401).send({ message: "Unauthenticated user" });
    return;
  }

  const validationResult = getTransactionsSchema.safeParse(request.query);

  if (!validationResult.success) {
    return reply.status(400).send({
      error: "Invalid query parameters",
      message: validationResult.error.issues,
    });
  }

  const { month, year, type, categoryId } = validationResult.data;

  const filters: TransactionFilter = { userId };

  if (month && year) {
    const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = dayjs.utc(startDate).endOf("month").toDate();
    filters.date = { gte: startDate, lte: endDate };
  }

  if (type) {
    filters.type = type;
  }

  if (categoryId) {
    filters.categoryId = categoryId;
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: filters,
      orderBy: { date: "desc" },
      include: {
        category: {
          select: {
            color: true,
            name: true,
            type: true,
          },
        },
      },
    });

    reply.send(transactions);
  } catch (err) {
    request.log.error(err, "Error servidor:");
    reply.status(500).send({ error: "Server error" });
  }
};
