import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

type JWTDecoded = {
  username: string;
  role: string[]; // Array of roles
  exp: number;
};

export const PrivateRoute = ({ children }: PropsWithChildren) => {
  const { auth } = useAuth();

  if(!auth.accessToken){
    return <Navigate to={"/signin"} />
  }
  var decodedToken: JWTDecoded | null = null;
  const token = auth.accessToken??"";
  if(token!=""){
     decodedToken = jwtDecode(token);
  }
  if (token && !decodedToken?.role.includes("Admin") && window.location.pathname === '/admin') {
    return <Navigate to="/" />;
  }
  return children;
};
