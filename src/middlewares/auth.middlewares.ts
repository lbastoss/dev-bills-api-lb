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
  // const authHeader = request.headers.authorization;
  const authHeader =
    "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjlkMjEzMGZlZjAyNTg3ZmQ4ODYxODg2OTgyMjczNGVmNzZhMTExNjUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTHVjYXMgQmFzdG9zIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lYeGNqMFRRWDliLUtGMm0wSTZ3b29aV2hneS1palhrdDJwdlBDS0lJX25EeWpJZz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9kZXZsYmlsbHMiLCJhdWQiOiJkZXZsYmlsbHMiLCJhdXRoX3RpbWUiOjE3NjA0NzcwMDAsInVzZXJfaWQiOiJzT0UyYWUxVzVmaER3S3U3RGFSV1JqY3c2VWgyIiwic3ViIjoic09FMmFlMVc1ZmhEd0t1N0RhUldSamN3NlVoMiIsImlhdCI6MTc2MDk4OTMzOCwiZXhwIjoxNzYwOTkyOTM4LCJlbWFpbCI6ImJhc3Rvc2xzMTdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDA3MjUxNDMwNTc2MDQ1ODg4OTAiXSwiZW1haWwiOlsiYmFzdG9zbHMxN0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.jFC-DYYIFDbbdhdXwzWlbiTbWXgLYePQLz5p-iBGnDHgTQ_tWQLfQmxrn0EB8L3Eqx0p2M13HGuO08OfyCTHtzaI0pvrIms3-IpSek9Pz4sOSLUeerfpjH_WJWcpRfTQmmc1DB9HzqRdatO4INy-35NGQgw41_rjReeb016MIG4cQ_P0Vd_AbDjVRFB25C17K-8dQ8C-sYpjUEG68pspeHO5GfzAmmIa0ILVHXWw9aTkumT0NUeoFA0YN7QVexUccxL5ev5y0EV37WU-6t2HoGxQ-cDVpQMLvHck_XEWcrt1gIYbPaTFlRvYAbVTg-W2RHY4GSLhPn-qjUVmN4u76A";

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
