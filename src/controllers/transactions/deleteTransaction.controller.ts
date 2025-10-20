import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { DeleteTransactionParams } from "../../schemas/transaction.schema";

export const deleteTransaction = async (
  request: FastifyRequest<{ Params: DeleteTransactionParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;
  const { id } = request.params;

  if (!userId) {
    reply.status(401).send({ message: "Unauthenticated user" });
    return;
  }

  try {
    // Lógica para deletar a transação
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      reply.status(400).send({ error: "Transaction ID not found" });
      return;
    }
    await prisma.transaction.delete({ where: { id } });

    reply.status(200).send({ message: "Transaction deleted successfully" });
  } catch (err) {
    request.log.error({ message: "Error deleting transaction", error: err });
    reply.status(500).send({ error: "Internal Server Error, failed to delete transaction" });
  }
};
