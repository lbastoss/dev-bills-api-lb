import type { FastifyInstance } from "fastify";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { getTransactions } from "../controllers/transactions/getTransaction.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionSummary.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

const transactionRoutes = async (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", authMiddleware);

  // criação
  fastify.route({
    method: "POST",
    url: "/",
    schema: {
      body: {
        type: "object",
        required: ["description", "amount", "date", "categoryId", "type"],
        properties: {
          description: { type: "string", minLength: 1 },
          amount: { type: "number", minimum: 0.01 },
          date: { type: "string", format: "date-time" },
          categoryId: { type: "string", minLength: 1 },
          type: { type: "string", enum: ["income", "expense"] },
        },
      },
    },
    handler: createTransaction,
  });

  //Buscar com filtros
  fastify.route({
    method: "GET",
    url: "/",
    schema: {
      querystring: {
        type: "object",
        properties: {
          month: {
            type: "string",
            pattern: "^(0?[1-9]|1[0-2])$", // validação para mes 01-12
          },
          year: {
            type: "string",
            pattern: "^[0-9]{4}$", // validação para ano com 4 dígitos
          },
          type: {
            type: "string",
            enum: ["income", "expense"],
          },
          categoryId: {
            type: "string",
            pattern: "^[0-9a-fA-F]{24}$", // validação para ObjectId do MongoDB
          },
        },
        additionalProperties: false,
      },
    },
    handler: getTransactions,
  });

  // buscar resumo
  fastify.route({
    method: "GET",
    url: "/summary",
    schema: {
      querystring: {
        type: "object",
        required: ["month", "year"],
        properties: {
          month: {
            type: "string",
            pattern: "^(0?[1-9]|1[0-2])$", // validação para mes 01-12
          },
          year: {
            type: "string",
            pattern: "^[0-9]{4}$", // validação para ano com 4 dígitos
          },
        },
        additionalProperties: false,
      },
    },
    handler: getTransactionsSummary,
  });

  // deletar transação
  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: {
      params: {
        type: "object",
        properties: {
          id: {
            type: "string",
            pattern: "^[0-9a-fA-F]{24}$", // validação para ObjectId do MongoDB
          },
        },
        required: ["id"],
        additionalProperties: false,
      },
    },
    handler: deleteTransaction,
  });
};

export default transactionRoutes;
