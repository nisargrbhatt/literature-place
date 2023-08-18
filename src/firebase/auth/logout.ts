import { safeAsync } from "@/lib/syntax/safe";
import firebase_app from "../config";
import { signOut, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

export const logout = async () => {
  const [result, error] = await safeAsync(signOut(auth));

  if (error) {
    return {
      result: null,
      error: error.error,
    };
  }
  return { result: result.data, error: null };
};
