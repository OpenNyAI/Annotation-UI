import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppBar } from "./AppBar";
import { AppDrawer, DrawerHeader } from "./Drawer";
import { useAppConfig } from "../hooks/useAppConfig";
import { AppConfigState } from "../providers/AppConfigProvider";

function getApplicationPhase(appState: AppConfigState["app_state"]) {
  switch (appState) {
    case "annotation":
      return "Annotate";
    case "onboarding":
      return "Onboard";
    case "review":
      return "Review";
    case "expert-review":
      return "Expert Review";
    case "none":
  }
}

export const DRAWER_WIDTH = 240;
const APP_BAR_HEIGHT = 64;

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const { app_state } = useAppConfig();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            data-testid="drawer-open-icon"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Annotation UI
          </Typography>
          <Typography
            noWrap
            component="div"
            sx={{
              ml: "auto",
            }}
          >
            <span
              style={{ fontSize: "16px", textDecoration: "none !important" }}
            >
              Phase:{" "}
            </span>
            <span
              style={{ fontSize: "20px", textDecoration: "wavy underline" }}
            >
              {getApplicationPhase(app_state)}
            </span>
          </Typography>
        </Toolbar>
      </AppBar>
      <AppDrawer
        open={open}
        appState={app_state}
        onDrawerClose={handleDrawerClose}
      />
      <Box
        component="main"
        sx={{ flexGrow: 1, height: `calc(100vh - ${APP_BAR_HEIGHT}px)` }}
      >
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
