import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { PrivateRoute } from "./components/PrivateRoute";
import { PublicRoute } from "./components/PublicRoute";
import { useAppConfig } from "./hooks/useAppConfig";
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
import { AdminPage } from "./pages/AdminPage";

export const Router = () => {
  const { app_state } = useAppConfig();

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
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        }
      />

      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <PrivateRoute>
              {["annotation", "onboarding"].includes(app_state) ? (
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
                  <ReviewDocumentsList />
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
