import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
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
import { UserDetailContent } from "./pages/AdminPageComponents/UserDetailContent";
import { MainContent } from "./pages/AdminPageComponents/MainContent";
import { QuesListDataset } from "./pages/AdminPageComponents/QuesListDataset";
import { useState } from "react";
import { DatasetInfo } from "./pages/AdminPageComponents/DatasetInfoContent";
import { QuesDatasetContent } from "./pages/AdminPageComponents/QuesDatasetContent";
import { QuesDetail } from "./pages/AdminPageComponents/QuesDetail";

export const Router = () => {
  const { app_state } = useAppConfig();
  const [selectedDataset, setSelectedDataset] = useState<any | null>(null);
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Determine the home route based on the app_state
  const homeRoute = (() => {
    switch (app_state) {
      case "annotation":
        return "/";
      case "review":
        return "/review";
      case "none":
        return "/";
      default:
        return "/";
    }
  })();

  // Update `onDatasetClick` to navigate and pass dataset via state
  const onDatasetClick = (dataset: any) => {
    setSelectedDataset(dataset);
    console.log('Selected dataset:', dataset);
    // Navigate to the DatasetInfo page and pass the dataset via state
    navigate(`/admin/dataset/${dataset.id}`, {
      state: { dataset }
    });
  };

  return (
    <Routes>
      {/* Public Routes */}
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

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        }
      >
        {/* Admin Sub-routes */}
        <Route
          path="users"
          element={<UserDetailContent />}
        />
        <Route
          path=""
          element={<MainContent />}
        />
        <Route
          path="dataset/:datasetId"
          element={<DatasetInfo />}
        />
        <Route
          path="qna"
          element={<QuesListDataset />} // Pass onDatasetClick to QuesListDataset
        />
        <Route
          path="qna/:datasetId"
          element={<QuesDatasetContent/>} // Pass onDatasetClick to QuesListDataset
        />
        <Route
          path="qna/:datasetId/:fileId"
          element={<QuesDetail/>} // Pass onDatasetClick to QuesListDataset
        />
      </Route>

      {/* App Layout Routes */}
      <Route element={<AppLayout />}>
        {/* Default Home Route Based on app_state */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              {["annotation"].includes(app_state) ? (
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
              path="/review/answers/:documentId"
              element={
                <PrivateRoute>
                  <ReviewAnswersPage />
                </PrivateRoute>
              }
            />
          </>
        )}
      </Route>

      {/* Catch All Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
