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
import { theme } from "../theming/theme";

interface ProvidersWrapperProps extends MemoryRouterProps {}

interface CustomRenderOptions extends RenderOptions {
  initialEntries?: string[];
}

const ProvidersWrapper = ({
  children,
  initialEntries,
}: ProvidersWrapperProps) => {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </ThemeProvider>
  );
};

const customRender = (ui: ReactNode, options?: CustomRenderOptions) =>
  render(ui, {
    wrapper: ({ children, ...rest }) => (
      <ProvidersWrapper {...rest} initialEntries={options?.initialEntries}>
        {children}
      </ProvidersWrapper>
    ),
    ...options,
  });

const renderHookWithProvider = <T,>(
  ui: (initialProps: unknown) => unknown,
  options?: RenderHookOptions<T>
) =>
  renderHook(ui, {
    wrapper: ({ children, ...props }) => (
      <ProvidersWrapper {...props}>{children}</ProvidersWrapper>
    ),
    ...options,
  });

export * from "@testing-library/react";
export { customRender as render, renderHookWithProvider };
