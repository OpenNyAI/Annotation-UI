import { Router } from "./Router";
import { render, screen } from "./utility/test-utils";

vitest.mock("./pages/SignIn", () => ({
  SignIn: () => <div>SignIn page</div>,
}));

vitest.mock("./pages/SignUp", () => ({
  SignUp: () => <div>SignUp page</div>,
  PasswordSchema: vitest.fn().mockResolvedValue({}),
}));

vitest.mock("./pages/ForgotPassword", () => ({
  ForgotPassword: () => <div>Forgot password page</div>,
}));

vitest.mock("./components/AppLayout", () => ({
  AppLayout: () => <div>AppLayout page</div>,
}));

describe("Router", () => {
  it("should render signin page", () => {
    render(<Router />, { initialEntries: ["/signin"], authState: {} });

    expect(screen.getByText("SignIn page")).toBeInTheDocument();
  });

  it("should render signup page", () => {
    render(<Router />, { initialEntries: ["/signup"], authState: {} });

    expect(screen.getByText("SignUp page")).toBeInTheDocument();
  });

  it("should render forgot password page", () => {
    render(<Router />, { initialEntries: ["/forgot-password"], authState: {} });

    expect(screen.getByText("Forgot password page")).toBeInTheDocument();
  });

  it("should renders app layout for any other route", () => {
    render(<Router />, { initialEntries: ["/"] });

    expect(screen.getByText("AppLayout page")).toBeInTheDocument();
  });
});
