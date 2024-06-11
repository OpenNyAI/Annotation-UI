import { Router } from "./Router";
import { render, screen } from "./utility/test-utils";

vitest.mock("./pages/FilesList", () => ({
  FilesList: () => <div>FilesList page</div>,
}));

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

describe("Router", () => {
  it("should renders Files list page when route is /", () => {
    render(<Router />, { initialEntries: ["/"] });

    expect(screen.getByText("FilesList page")).toBeInTheDocument();
  });

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

  it("should renders not found page when invalid path is given", () => {
    render(<Router />, { initialEntries: ["/error"] });

    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });

  it("should redirect users to files listing page when authState is having accessToken", () => {
    render(<Router />, { initialEntries: ["/signin"] });

    expect(screen.getByText("FilesList page")).toBeInTheDocument();
  });

  it("should redirect users to sign-in page when user is not logged in", () => {
    render(<Router />, { initialEntries: ["/"], authState: {} });

    expect(screen.getByText("SignIn page")).toBeInTheDocument();
  });
});
