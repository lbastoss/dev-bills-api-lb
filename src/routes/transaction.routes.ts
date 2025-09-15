import type { FastifyInstance } from "fastify";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { getTransactions } from "../controllers/transactions/getTransaction.controller";

const transactionRoutes = async (fastify: FastifyInstance) => {
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
};
export default transactionRoutes;
