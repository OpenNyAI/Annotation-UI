import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { server } from "../mocks/server";
import { render, screen } from "../utility/test-utils";
import { SignUp } from "./SignUp";

describe("Sign Up", () => {
  it("Should render sign up page successfully", () => {
    render(<SignUp />);

    const welcomeText = screen.getByText(
      "Welcome to Annotation UI, Please Sign up"
    );

    const signUpBtn = screen.getByRole("button", {
      name: "Sign Up",
    });

    expect(welcomeText).toBeInTheDocument();
    expect(signUpBtn).toBeDisabled();
  });

  it("Should make sign up request and redirect to home on successful signup", async () => {
    render(
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>,
      { initialEntries: ["/signup"] }
    );

    const nameField = screen.getByPlaceholderText("Enter your name");
    const emailField = screen.getByPlaceholderText("Enter your email");
    const passwordField = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordField = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const signUpBtn = screen.getByRole("button", {
      name: "Sign Up",
    });

    await userEvent.type(nameField, "Test User");
    await userEvent.type(emailField, "test@test.com");
    await userEvent.type(passwordField, "Password123");
    await userEvent.type(confirmPasswordField, "Password123");

    await userEvent.click(signUpBtn);

    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("Should make sign up request and show notification on error", async () => {
    server.use(
      http.post("/signup", () => {
        return HttpResponse.json({ message: "Bad request" }, { status: 400 });
      })
    );

    render(<SignUp />);

    const nameField = screen.getByPlaceholderText("Enter your name");
    const emailField = screen.getByPlaceholderText("Enter your email");
    const passwordField = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordField = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const signUpBtn = screen.getByRole("button", {
      name: "Sign Up",
    });

    await userEvent.type(nameField, "Test User");
    await userEvent.type(emailField, "test@test.com");
    await userEvent.type(passwordField, "Password123");
    await userEvent.type(confirmPasswordField, "Password123");

    await userEvent.click(signUpBtn);

    expect(screen.getByText("Bad request")).toBeInTheDocument();
  });

  it("Should change password visibility", async () => {
    render(<SignUp />);

    const passwordField = screen.getByPlaceholderText("Enter your password");
    const ConfirmPasswordField = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const passwordVisibilityBtn = screen.getByTestId("password-visibility");
    const ConfirmPasswordVisibilityBtn = screen.getByTestId(
      "confirm-password-visibility"
    );

    expect(passwordField).toHaveAttribute("type", "password");
    expect(ConfirmPasswordField).toHaveAttribute("type", "password");

    await userEvent.click(passwordVisibilityBtn);
    expect(passwordField).toHaveAttribute("type", "text");

    await userEvent.click(passwordVisibilityBtn);
    expect(passwordField).toHaveAttribute("type", "password");

    await userEvent.click(ConfirmPasswordVisibilityBtn);
    expect(ConfirmPasswordField).toHaveAttribute("type", "text");

    await userEvent.click(ConfirmPasswordVisibilityBtn);
    expect(ConfirmPasswordField).toHaveAttribute("type", "password");
  });

  it("Should redirect to signin page", async () => {
    render(
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<div>Sign In Page</div>} />
      </Routes>,
      { initialEntries: ["/signup"] }
    );

    const signInLink = screen.getByRole("link", {
      name: "Already have an account? Sign in",
    });

    await userEvent.click(signInLink);

    expect(screen.getByText("Sign In Page")).toBeInTheDocument();
  });
});
