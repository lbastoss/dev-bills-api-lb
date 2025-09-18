import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { GetTransactionsSummaryQuery } from "../../schemas/transaction.schema";

dayjs.extend(utc);

export const getTransactionsSummary = async (
  request: FastifyRequest<{ Querystring: GetTransactionsSummaryQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = "hdsauhdausdh141$!@$12"; // userID > request.userID

  if (!userId) {
    reply.status(401).send({ message: "Unauthenticated user" });
    return;
  }

  const { month, year } = request.query;

  if (!month || !year) {
    reply.status(400).send({ message: "Month and year are required" });
    return;
  }
  const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
  const endDate = dayjs.utc(startDate).endOf("month").toDate();

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    console.log(transactions);

    reply.send(transactions);
  } catch (err) {
    request.log.error(err, "Error servidor:");
    reply.status(500).send({ error: "Server error" });
  }
};
