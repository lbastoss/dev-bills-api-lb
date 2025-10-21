import type { FastifyReply, FastifyRequest } from "fastify";

import admin from "firebase-admin";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    reply.code(401).send({ error: "Authorization token not provided" });
    return;
  }
  const token = authHeader.replace("Bearer ", "");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    request.userId = decodedToken.uid;
  } catch (err) {
    request.log.error(err, "Error verifying Firebase ID token:");
    reply.code(401).send({ error: "Invalid or expired token" });
    return;
  }
};
