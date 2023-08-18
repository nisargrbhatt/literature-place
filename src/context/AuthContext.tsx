"use client";

import { onAuthStateChanged, getAuth, type User } from "firebase/auth";
import firebase_app from "@/firebase/config";
import type { ReactNode, FC } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";

const auth = getAuth(firebase_app);

export const AuthContext = createContext<{ user?: User | null }>({
  user: null,
});

export const useAuthContext = () => useContext(AuthContext);

interface Props {
  children: ReactNode;
}

const AuthContextProvider: FC<Props> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(() => user);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user: userData }}>
      {loading ? (
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          sx={{
            width: "100vw",
            height: "100vh",
          }}
          rowGap={2}
        >
          <CircularProgress />
          <Typography>Verifying Identity</Typography>
        </Stack>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
