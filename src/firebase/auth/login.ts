import { safeAsync } from "@/lib/syntax/safe";
import firebase_app from "../config";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const auth = getAuth(firebase_app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");
export const loginWithGoogle = async () => {
  const [result, error] = await safeAsync(
    signInWithPopup(auth, googleProvider)
  );

  if (error) {
    return {
      result: null,
      error: error.error,
    };
  }
  return { result: result.data, error: null };
};
