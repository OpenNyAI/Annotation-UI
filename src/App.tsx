import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/home";
import { theme } from "./theming/theme";

export const App = () => (
  <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </ThemeProvider>
  </>
);
export default App;
