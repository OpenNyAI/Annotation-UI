import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { server } from "../mocks/server";
import { render, screen } from "../utility/test-utils";
import { SignIn } from "./SignIn";

describe("SignIn", () => {
  it("Should render sign in page successfully", () => {
    render(<SignIn />);

    const welcomeText = screen.getByText(
      "Welcome to Annotation UI, Please Sign in"
    );

    const signInBtn = screen.getByRole("button", {
      name: "Sign In",
    });

    expect(welcomeText).toBeInTheDocument();
    expect(signInBtn).toBeDisabled();
  });

  it("Should make sign request and redirect to home on successful signin", async () => {
    render(
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>,
      { initialEntries: ["/signin"] }
    );

    const emailField = screen.getByPlaceholderText("Enter your email");
    const passwordField = screen.getByPlaceholderText("Enter your password");
    const signInBtn = screen.getByRole("button", {
      name: "Sign In",
    });

    await userEvent.type(emailField, "test@test.com");
    await userEvent.type(passwordField, "password");

    await userEvent.click(signInBtn);

    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("Should make sign request and show notification on error", async () => {
    server.use(
      http.post("/signin", () => {
        return HttpResponse.json(
          { message: "Invalid Credentials" },
          { status: 401 }
        );
      })
    );

    render(<SignIn />);

    const emailField = screen.getByPlaceholderText("Enter your email");
    const passwordField = screen.getByPlaceholderText("Enter your password");
    const signInBtn = screen.getByRole("button", {
      name: "Sign In",
    });

    await userEvent.type(emailField, "test@test.com");
    await userEvent.type(passwordField, "password");

    await userEvent.click(signInBtn);

    expect(screen.getByText("Invalid Credentials")).toBeInTheDocument();
  });

  it("Should change password visibility", async () => {
    render(<SignIn />);

    const passwordField = screen.getByPlaceholderText("Enter your password");
    const passwordVisibilityBtn = screen.getByTestId("password-visibility");

    expect(passwordField).toHaveAttribute("type", "password");

    await userEvent.click(passwordVisibilityBtn);
    expect(passwordField).toHaveAttribute("type", "text");

    await userEvent.click(passwordVisibilityBtn);
    expect(passwordField).toHaveAttribute("type", "password");
  });

  it("Should redirect to signup page", async () => {
    render(
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<div>Sign Up Page</div>} />
      </Routes>,
      { initialEntries: ["/signin"] }
    );

    const signupLink = screen.getByRole("link", {
      name: "Don't have an account? Sign up",
    });

    await userEvent.click(signupLink);

    expect(screen.getByText("Sign Up Page")).toBeInTheDocument();
  });

  it("Should redirect to forgot password page", async () => {
    render(
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/forgot-password"
          element={<div>Forgot Password Page</div>}
        />
      </Routes>,
      { initialEntries: ["/signin"] }
    );

    const forgotPassLink = screen.getByRole("link", {
      name: "Forgot password?",
    });

    await userEvent.click(forgotPassLink);

    expect(screen.getByText("Forgot Password Page")).toBeInTheDocument();
  });
});
