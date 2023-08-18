"use client";

import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { THEME_MODE } from "@/lib/constant/cookie";
import { z } from "zod";
import { getTheme } from "@/lib/theme/mui";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";

const themeSchema = z.enum(["light", "dark"]);

type ThemeMode = z.infer<typeof themeSchema>;

export const ThemeContext = createContext<{
  mode: ThemeMode;
  changeMode: (mode: ThemeMode) => void;
}>({
  mode: "light",
  changeMode: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface Props {
  children: ReactNode;
}

const ThemeContextProvider: FC<Props> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const themeCookie = themeSchema.safeParse(Cookies.get(THEME_MODE));

    if (themeCookie.success) {
      setTheme(() => themeCookie.data);
    } else {
      setTheme(() => "light");
      Cookies.set(THEME_MODE, "light");
    }
  }, []);

  const changeMode = (mode: ThemeMode) => {
    setTheme(() => mode);
    Cookies.set(THEME_MODE, "light");
  };

  const currentTheme = useMemo(() => getTheme(theme), [theme]);

  return (
    <ThemeContext.Provider
      value={{
        mode: theme,
        changeMode,
      }}
    >
      <ThemeProvider theme={currentTheme}>
        <SnackbarProvider>
          <CssBaseline />
          {children}
        </SnackbarProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
