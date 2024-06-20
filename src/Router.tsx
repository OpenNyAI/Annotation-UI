import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { PublicRoute } from "./components/PublicRoute";
import { ForgotPassword } from "./pages/ForgotPassword";
import { NotFound } from "./pages/NotFound";
import { ResetPassword } from "./pages/ResetPassword";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";

export const Router = () => {
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
      <Route path="/*" element={<AppLayout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
