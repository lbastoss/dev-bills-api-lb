import type { FastifyReply, FastifyRequest } from "fastify";

const createTransaction = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const userID = "hdsauhdausdh141$!@$12"; // userID > request.userID

  if (!userID) {
    reply.status(401).send({ message: "Unauthenticated user" });
  }

  // validação dos dados
};

export default createTransaction;
