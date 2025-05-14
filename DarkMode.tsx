import { PaletteMode } from "@mui/material";

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Define light mode colors here if needed
          primary: {
            main: "#1976d2", // Example primary color for light mode
          },
          background: {
            default: "#f5f5f5",
            paper: "#ffffff",
          },
        }
      : {
          // Define dark mode colors here if needed
          primary: {
            main: "#90caf9", // Example primary color for dark mode
          },
          background: {
            default: "#121212",
            paper: "#1e1e1e",
          },
        }),
  },
});

export default getDesignTokens;
