import { useContext } from "react";
import { AppConfigContext } from "../providers/AppConfigProvider";

export const useAppConfig = () => {
  const appConfig = useContext(AppConfigContext);
  if (!appConfig) {
    throw Error("Should be used inside AppConfig Provider");
  }
  return appConfig;
};
