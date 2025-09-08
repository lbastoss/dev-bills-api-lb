import type { FastifyInstance } from "fastify";
import createTransaction from "../controllers/transactions/createTransaction.controller";

const transactionRoutes = async (fastify: FastifyInstance) => {
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
};

export default transactionRoutes;
