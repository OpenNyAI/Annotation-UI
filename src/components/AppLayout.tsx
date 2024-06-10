import { QuestionAnswerTwoTone, TextSnippetTwoTone } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";
import { QuestionAndAnswers } from "../pages/QuestionAndAnswers";
import { AppBar } from "./AppBar";
import { Drawer, DrawerHeader } from "./Drawer";
import { NavigationItem } from "./NavigationItem";
import { PrivateRoute } from "./PrivateRoute";

export const drawerWidth = 240;

export default function AppLayout() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

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
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ mx: "4px" }}>
          <NavigationItem
            title="Annotate"
            to="/"
            isSelected={pathname === "/"}
            isOpen={open}
            icon={<TextSnippetTwoTone />}
          />
          <NavigationItem
            title="Question&Answers"
            to="/answers"
            isSelected={pathname.includes("/answers")}
            isOpen={open}
            icon={<QuestionAnswerTwoTone />}
          />
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <DrawerHeader />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/answers"
            element={
              <PrivateRoute>
                <QuestionAndAnswers />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}
