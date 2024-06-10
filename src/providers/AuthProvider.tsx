import { PropsWithChildren, createContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export type AuthState = {
  accessToken?: string;
};

export type AuthContextValue = {
  auth: AuthState;
  setAuth(authState: AuthState): void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export type AuthContextProviderProps = PropsWithChildren & {
  authState?: AuthState;
};

export const AuthContextProvider = ({
  children,
  authState,
}: AuthContextProviderProps) => {
  const [storedAccessToken, setStoredAccessToken] = useLocalStorage(
    "accessToken",
    null
  );

  const [auth, setAuth] = useState<AuthState>(
    authState ?? { accessToken: storedAccessToken ?? undefined }
  );

  const updateAuthState = (updatedAuthState: AuthState) => {
    setAuth(updatedAuthState);
    setStoredAccessToken(updatedAuthState.accessToken!);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth: updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
