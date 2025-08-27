import dotenv from "dotenv";
import app from "./app";
import { prismaConnect } from "./config/prisma";
import { initalizeGlobalCategories } from "./services/globalCategories.service";

dotenv.config();

const PORT = Number(process.env.PORT);

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
