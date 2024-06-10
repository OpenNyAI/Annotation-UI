import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Router } from "./Router";
import { theme } from "./theming/theme";

export const App = () => (
  <>
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <CssBaseline />
      <Router />
    </ThemeProvider>
  </>
);
export default App;
