import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw Error("Should be used inside AuthContext Provider");
  }
  return authContext;
};
