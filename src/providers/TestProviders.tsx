import { ThemeProvider } from "@mui/material/styles";
import { type ReactElement, type FC, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { theme } from "../theming/theme";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      suspense: true,
    },
  },
});

export interface TestProviderProps {
  children: ReactNode;
  defaultProviderValues?: {
    loggedInUser?: string | null;
    shouldHideHeader?: boolean;
  };
}

export const TestProvider: FC<TestProviderProps> = ({
  children,
  defaultProviderValues = {},
}) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          {children as ReactElement}
        </LocalizationProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);
