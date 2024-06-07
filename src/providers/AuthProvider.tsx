import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from "react";

export type AuthState = {
  accessToken?: string;
};

export type AuthContextValue = {
  auth: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
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
  const [auth, setAuth] = useState<AuthState>(authState ?? {});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
