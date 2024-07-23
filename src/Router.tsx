import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import { AppLayout } from "./components/AppLayout";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { PrivateRoute } from "./components/PrivateRoute";
import { PublicRoute } from "./components/PublicRoute";
import useAxios from "./hooks/useAxios";
import { AnnotationPage } from "./pages/AnnotationPage";
import { DocumentAnswers } from "./pages/DocumentAnswers";
import { DocumentsList } from "./pages/DocumentsList";
import { ForgotPassword } from "./pages/ForgotPassword";
import { MyAnswersList } from "./pages/MyAnswersList";
import { NotFound } from "./pages/NotFound";
import { ResetPassword } from "./pages/ResetPassword";
import { ReviewAnswersPage } from "./pages/ReviewAnswersPage";
import { ReviewDocumentsList } from "./pages/ReviewDocumentsList";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";

export type AppConfig = {
  app_state: "annotation" | "review" | "expert-review" | "onboarding" | "none";
};

const defaultAppConfig: AppConfig = {
  app_state: "none",
};

export const Router = () => {
  const [appConfig, setAppConfig] = useState<AppConfig>(defaultAppConfig);
  const { makeRequest, status, error } = useAxios<AppConfig>();

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
      case "onboarding":
        return "/";
      case "review":
      case "expert-review":
        return "/review";
      case "none":
        return "/";
    }
  })();

  return (
    <Routes>
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route
        path="/signin"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route element={<AppLayout app_state={appConfig.app_state} />}>
        <Route
          path="/"
          element={
            <PrivateRoute>
              {["annotation", "onboarding"].includes(app_state) ? (
                <DocumentsList app_state={app_state} />
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
                  <MyAnswersList app_state={app_state} />
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
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
