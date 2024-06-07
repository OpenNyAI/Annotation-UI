import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const PrivateRoute = ({ children }: PropsWithChildren) => {
  const { auth } = useAuth();

  return auth.accessToken ? children : <Navigate to={"/signin"} />;
};
