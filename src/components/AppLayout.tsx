import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { PropsWithChildren, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppConfig } from "../Router";
import { AppBar } from "./AppBar";
import { AppDrawer, DrawerHeader } from "./Drawer";

export const DRAWER_WIDTH = 240;
const APP_BAR_HEIGHT = 64;

export type AppLayoutProps = PropsWithChildren & {
  app_state: AppConfig["app_state"];
};

export function AppLayout({ app_state }: AppLayoutProps) {
  const [open, setOpen] = useState(false);

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
