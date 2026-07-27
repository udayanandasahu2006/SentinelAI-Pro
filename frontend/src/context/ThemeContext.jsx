import { createContext, useMemo, useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline
} from "@mui/material";

export const ColorModeContext = createContext();

export default function ThemeContext({ children }) {

  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) =>
          prev === "dark" ? "light" : "dark"
        );
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({

        palette: {

          mode,

          primary: {
            main: "#00E5FF",
          },

          secondary: {
            main: "#00C853",
          },

          background: {

            default:
              mode === "dark"
                ? "#020617"
                : "#f5f5f5",

            paper:
              mode === "dark"
                ? "#0f172a"
                : "#ffffff",

          },

          text: {

            primary:
              mode === "dark"
                ? "#ffffff"
                : "#111827",

          },

        },

        shape: {
          borderRadius: 18,
        },

      }),
    [mode]
  );

  return (

    <ColorModeContext.Provider value={colorMode}>

      <ThemeProvider theme={theme}>

        <CssBaseline />

        {children}

      </ThemeProvider>

    </ColorModeContext.Provider>

  );

}