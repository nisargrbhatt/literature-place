import { createTheme, type PaletteMode } from "@mui/material";
import { deepPurple, deepOrange } from "@mui/material/colors";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    typography: {
      fontFamily: '"Noto Sans", sans-serif',
    },
    palette: {
      mode,
      primary: {
        main: deepPurple["A200"],
      },
      secondary: {
        main: deepOrange["A200"],
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          text: {
            textTransform: "none",
          },
          contained: {
            textTransform: "none",
          },
          outlined: {
            textTransform: "none",
          },
        },
      },
    },
  });
