import { getFirestore } from "firebase/firestore";
import firebase_app from "../config";

export function getDb() {
  const db = getFirestore(firebase_app);
  return db;
}
