// import { PropsWithChildren } from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { jwtDecode } from "jwt-decode";

// type JWTDecoded = {
//   username: string;
//   role: string[];
//   exp: number;
// };

// export const PrivateRoute = ({ children }: PropsWithChildren) => {
//   const { auth } = useAuth();
//   const token = auth.accessToken ?? "";

//   if (!token) {
//     return <Navigate to="/signin" />;
//   }

//   const decodedToken: JWTDecoded = jwtDecode(token);

//   if (window.location.pathname === '/admin' && !decodedToken.role.includes("Admin")) {
//     return <Navigate to="/" />;
//   }

//   if (window.location.pathname !== '/admin' && decodedToken.role.includes("Admin")) {
//     return <Navigate to="/admin" />;
//   }

//   return <>{children}</>;
// };


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
  

  // Check if the user is accessing an admin-only page
  const isAdmin = decodedToken.role.includes("Admin");

  // Allow access to `/admin/user` and other `/admin/*` routes if the user is an admin
  if (window.location.pathname.startsWith('/admin') && !isAdmin) {
    return <Navigate to="/" />;
  }

  // Redirect to the admin page if the user is an admin and tries to go to a non-admin page
  if (!window.location.pathname.startsWith('/admin') && isAdmin) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
};
