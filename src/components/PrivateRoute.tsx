import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

type JWTDecoded = {
  username: string;
  role: string[];
  exp: number;
};

export const PrivateRoute = ({ children }: PropsWithChildren) => {
  const { auth } = useAuth();
  const token = auth.accessToken ?? "";

  if (!token) {
    return <Navigate to="/signin" />;
  }

  const decodedToken: JWTDecoded = jwtDecode(token);

  if (window.location.pathname === '/admin' && !decodedToken.role.includes("Admin")) {
    return <Navigate to="/" />;
  }

  if (window.location.pathname !== '/admin' && decodedToken.role.includes("Admin")) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
};
