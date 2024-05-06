import { CssBaseline } from "@mui/material";
import "./App.css";
import { Home } from "./pages/home";
import { AppProvider } from "./providers/AppProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export const App = () => (
  <AppProvider>
    <>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  </AppProvider>
);
export default App;
