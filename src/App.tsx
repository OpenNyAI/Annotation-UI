import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorMessage } from "./components/ErrorMessage";
import { LoadingSpinner } from "./components/LoadingSpinner";
import useAxios from "./hooks/useAxios";
import {
  AppConfigProvider,
  AppConfigState,
} from "./providers/AppConfigProvider";
import { Router } from "./Router";
import { theme } from "./theming/theme";

export const App = () => {
  const { makeRequest, status, error, data } = useAxios<AppConfigState>();

  useEffect(() => {
    async function getApplicationConfig() {
      try {
        await makeRequest("/user/config", "GET");
      } catch (err: any) {
        toast.error(err.message);
      }
    }

    getApplicationConfig();
  }, []);

  if (status === "pending") {
    return <LoadingSpinner />;
  }

  if (status === "error") {
    return (
      <ErrorMessage
        title="Unable to load Application State"
        subtitle={error!.message}
      />
    );
  }

  return (
    status === "resolved" &&
    data && (
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <CssBaseline />
        <AppConfigProvider appConfig={data}>
          <Router />
        </AppConfigProvider>
      </ThemeProvider>
    )
  );
};
export default App;
