import type { Collections } from "@/api";
import { getFirestore } from "firebase/firestore";
import firebase_app from "../config";
import { collection } from "firebase/firestore";

export function getCollection(name: Collections) {
  const db = getFirestore(firebase_app);
  return collection(db, name);
}
