import { ThemeProvider } from "@mui/material/styles";
import {
  RenderHookOptions,
  RenderOptions,
  render,
  renderHook,
} from "@testing-library/react";
import { ReactNode } from "react";
import { MemoryRouter, MemoryRouterProps } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthContextProvider, AuthState } from "../providers/AuthProvider";
import { theme } from "../theming/theme";
import {
  AppConfigProvider,
  AppConfigState,
} from "../providers/AppConfigProvider";

interface ProvidersWrapperProps extends MemoryRouterProps {
  appConfig?: AppConfigState;
  authState?: AuthState;
}

interface CustomRenderOptions extends RenderOptions {
  initialEntries?: string[];
  authState?: AuthState;
  appConfig?: AppConfigState;
}

const ProvidersWrapper = ({
  children,
  initialEntries,
  authState = { accessToken: "dummy-token" },
  appConfig = { app_state: "annotation" },
}: ProvidersWrapperProps) => {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <AuthContextProvider authState={authState}>
        <AppConfigProvider appConfig={appConfig}>
          <MemoryRouter initialEntries={initialEntries}>
            {children}
          </MemoryRouter>
        </AppConfigProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
};

const customRender = (ui: ReactNode, options?: CustomRenderOptions) =>
  render(ui, {
    wrapper: ({ children, ...rest }) => (
      <ProvidersWrapper
        {...rest}
        initialEntries={options?.initialEntries}
        authState={options?.authState}
        appConfig={options?.appConfig}
      >
        {children}
      </ProvidersWrapper>
    ),
    ...options,
  });

type CustomRenderHookOptions<T> = RenderHookOptions<T> & {
  authState?: AuthState;
  appConfig?: AppConfigState;
};

const renderHookWithProvider = <TResult, TProps>(
  render: (initialProps: TProps) => TResult,
  options?: CustomRenderHookOptions<TProps>
) =>
  renderHook<TResult, TProps>(render, {
    wrapper: ({ children, ...props }) => (
      <ProvidersWrapper
        {...props}
        authState={options?.authState}
        appConfig={options?.appConfig}
      >
        {children}
      </ProvidersWrapper>
    ),
    ...options,
  });

export * from "@testing-library/react";
export { customRender as render, renderHookWithProvider as renderHook };
