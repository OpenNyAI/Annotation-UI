import { createContext, PropsWithChildren } from "react";

export type AppConfigState = {
  app_state: "annotation" | "review" | "none";
};

export const AppConfigContext = createContext<AppConfigState | undefined>(
  undefined
);

type AppConfigProviderProps = PropsWithChildren & {
  appConfig: AppConfigState;
};

export const AppConfigProvider = ({
  appConfig,
  children,
}: AppConfigProviderProps) => {
  return (
    <AppConfigContext.Provider value={appConfig}>
      {children}
    </AppConfigContext.Provider>
  );
};
