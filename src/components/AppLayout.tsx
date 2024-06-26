import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import useAxios from "../hooks/useAxios";
import { AnnotationPage } from "../pages/AnnotationPage";
import { DocumentAnswers } from "../pages/DocumentAnswers";
import { DocumentsList } from "../pages/DocumentsList";
import { MyAnswersList } from "../pages/MyAnswersList";
import { NotFound } from "../pages/NotFound";
import { ReviewAnswersPage } from "../pages/ReviewAnswersPage";
import { ReviewDocumentsList } from "../pages/ReviewDocumentsList";
import { AppBar } from "./AppBar";
import { AppDrawer, DrawerHeader } from "./Drawer";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingSpinner } from "./LoadingSpinner";
import { PrivateRoute } from "./PrivateRoute";

export const DRAWER_WIDTH = 240;
const APP_BAR_HEIGHT = 64;

export type AppConfig = {
  app_state: "annotation" | "review" | "expert-review" | "none";
};

const defaultAppConfig: AppConfig = {
  app_state: "none",
};

export function AppLayout() {
  const [open, setOpen] = useState(false);

  const [appConfig, setAppConfig] = useState<AppConfig>(defaultAppConfig);
  const { makeRequest, status, error } = useAxios<AppConfig>();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function getApplicationConfig() {
      try {
        const config = await makeRequest("/user/config", "GET");
        setAppConfig(config);
      } catch (err: any) {
        toast.error(err.message);
      }
    }

    getApplicationConfig();
  }, []);

  const { app_state } = appConfig;

  if (status === "pending") {
    return <LoadingSpinner />;
  }

  const homeRoute = (() => {
    switch (app_state) {
      case "annotation":
        return "/";
      case "review":
      case "expert-review":
        return "/review";
      case "none":
        return "/";
    }
  })();

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
        {status === "error" ? (
          <ErrorMessage
            title="Error while loading application config"
            subtitle={`Error : ${error?.message}`}
          />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  {app_state === "annotation" ? (
                    <DocumentsList />
                  ) : (
                    <Navigate to={homeRoute} />
                  )}
                </PrivateRoute>
              }
            />
            {homeRoute === "/" && (
              <>
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
              </>
            )}
            {homeRoute === "/review" && (
              <>
                <Route
                  path="/review"
                  element={
                    <PrivateRoute>
                      <ReviewDocumentsList
                        isExpertReview={app_state === "expert-review"}
                      />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/review/:documentId"
                  element={
                    <PrivateRoute>
                      <ReviewAnswersPage />
                    </PrivateRoute>
                  }
                />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </Box>
    </Box>
  );
}
