import admin from "firebase-admin";
import { env } from "./env";

const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) return;

  const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } = env;

  if (!FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_PROJECT_ID) {
    throw new Error(" 🚨 Failed to start firebase, missing credentials");
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
      }),
    });
  } catch (err) {
    console.error(" 🚨 Failed to connect Firebase ", err);
    process.exit(1);
  }
};

export default initializeFirebaseAdmin;
