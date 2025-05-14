import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";

import AppBar from "./Components/AppBar";
import SideBar from "./Components/SideBar";
import { createTheme, PaletteMode, ThemeProvider } from "@mui/material";
import getDesignTokens from "./Theme/DarkMode";
import { Outlet } from "react-router-dom";

export default function VendorDashboard() {
  const [open, setOpen] = React.useState(true);
  const [mode, setMode] = React.useState<PaletteMode>("light");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar open={open} onDrawerOpen={handleDrawerOpen} setMode={setMode} />
        <SideBar open={open} onDrawerClose={handleDrawerClose} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />

          <Outlet></Outlet>
        </Box>
      </Box>
    </ThemeProvider>
  );
}