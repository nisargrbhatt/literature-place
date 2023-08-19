import type { Collections } from "@/api";
import { collection } from "firebase/firestore";
import { getDb } from "./db";

export function getCollection(name: Collections) {
  const db = getDb();
  return collection(db, name);
}
