import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import { createTransactionSchema } from "../../schemas/transaction.schema";

const createTransaction = async (
  request: FastifyRequest<{ Body: typeof createTransactionSchema }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = "hdsauhdausdh141$!@$12"; // userID > request.userID

  if (!userId) {
    reply.status(401).send({ message: "Unauthenticated user" });
    return;
  }

  const result = createTransactionSchema.safeParse(request.body);

  if (!result.success) {
    const errorMessage = result.error.issues[0].message || "Invalid validation";

    reply.status(400).send({ error: errorMessage });
    return;
  }

  const transaction = result.data;

  try {
    const category = await prisma.category.findFirst({
      where: {
        id: transaction.categoryId,
        type: transaction.type,
      },
    });

    if (!category) {
      reply.status(404).send({ message: "Category not found" });
      return;
    }

    const parsedDate = new Date(transaction.date);

    const newTransaction = await prisma.transaction.create({
      data: {
        ...transaction,
        userId,
        date: parsedDate,
      },

      include: {
        category: true,
      },
    });

    reply.status(201).send(newTransaction);
  } catch (err) {
    request.log.error(err, "Error creating transaction");
    reply.status(500).send({ error: "Internal server error" });
  }
};

export default createTransaction;
