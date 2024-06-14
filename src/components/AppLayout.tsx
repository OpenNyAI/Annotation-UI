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
import { AnnotationPage } from "../pages/AnnotationPage";
import { DocumentAnswers } from "../pages/DocumentAnswers";
import { DocumentsList } from "../pages/DocumentsList";
import { MyAnswersList } from "../pages/MyAnswersList";
import { NotFound } from "../pages/NotFound";
import { AppBar } from "./AppBar";
import { Drawer, DrawerHeader } from "./Drawer";
import { NavigationItem } from "./NavigationItem";
import { PrivateRoute } from "./PrivateRoute";

export const DRAWER_WIDTH = 240;
const APP_BAR_HEIGHT = 64;

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
        <List
          sx={{
            mx: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <NavigationItem
            title="Annotate"
            to="/"
            isSelected={pathname === "/" || pathname.includes("annotate")}
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
      <Box
        component="main"
        sx={{ flexGrow: 1, height: `calc(100vh - ${APP_BAR_HEIGHT}px)` }}
      >
        <DrawerHeader />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DocumentsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/annotate/:documentId"
            element={
              <PrivateRoute>
                <AnnotationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/answers"
            element={
              <PrivateRoute>
                <MyAnswersList />
              </PrivateRoute>
            }
          />
          <Route
            path="/answers/:documentId"
            element={
              <PrivateRoute>
                <DocumentAnswers />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}
