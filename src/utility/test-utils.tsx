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

interface ProvidersWrapperProps extends MemoryRouterProps {
  authState?: AuthState;
}

interface CustomRenderOptions extends RenderOptions {
  initialEntries?: string[];
  authState?: AuthState;
}

const ProvidersWrapper = ({
  children,
  initialEntries,
  authState = { accessToken: "dummy-token" },
}: ProvidersWrapperProps) => {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <AuthContextProvider authState={authState}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
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
      >
        {children}
      </ProvidersWrapper>
    ),
    ...options,
  });

type CustomRenderHookOptions<T> = RenderHookOptions<T> & {
  authState?: AuthState;
};

const renderHookWithProvider = <TResult, TProps>(
  render: (initialProps: TProps) => TResult,
  options?: CustomRenderHookOptions<TProps>
) =>
  renderHook<TResult, TProps>(render, {
    wrapper: ({ children, ...props }) => (
      <ProvidersWrapper {...props} authState={options?.authState}>
        {children}
      </ProvidersWrapper>
    ),
    ...options,
  });

export * from "@testing-library/react";
export { customRender as render, renderHookWithProvider as renderHook };
