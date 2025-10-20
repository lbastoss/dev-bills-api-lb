import app from "./app";
import { env } from "./config/env";
import initializeFirebaseAdmin from "./config/firebase";
import { prismaConnect } from "./config/prisma";
import { initalizeGlobalCategories } from "./services/globalCategories.service";

const PORT = env.PORT;

initializeFirebaseAdmin();

const startServer = async () => {
  try {
    await prismaConnect();

    await initalizeGlobalCategories();

    await app.listen({ port: PORT }).then(() => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

startServer();
