import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { server } from "../mocks/server";
import { render, screen } from "../utility/test-utils";
import { ForgotPassword } from "./ForgotPassword";

describe("ForgotPassword", () => {
  it("Should render forgot password  page successfully", () => {
    render(<ForgotPassword />);

    const welcomeText = screen.getByText(
      "Welcome to Annotation UI, Forgot password"
    );

    const sendEmailBtn = screen.getByRole("button", {
      name: "Send Email",
    });

    expect(welcomeText).toBeInTheDocument();
    expect(sendEmailBtn).toBeDisabled();
  });

  it("Should make api call to send reset password email", async () => {
    render(<ForgotPassword />);

    const emailField = screen.getByPlaceholderText("Enter your email");
    const sendEmailBtn = screen.getByRole("button", {
      name: "Send Email",
    });

    await userEvent.type(emailField, "testuser@test.com");

    await userEvent.click(sendEmailBtn);

    expect(screen.getByText("Email sent Successfully")).toBeInTheDocument();
  });

  it("Should make api call and show error message on error", async () => {
    server.use(
      http.post("/auth/reset-password", () => {
        return HttpResponse.json(
          { message: "No user with this email address" },
          { status: 400 }
        );
      })
    );

    render(<ForgotPassword />);

    const emailField = screen.getByPlaceholderText("Enter your email");
    const sendEmailBtn = screen.getByRole("button", {
      name: "Send Email",
    });

    await userEvent.type(emailField, "testuser@test.com");

    await userEvent.click(sendEmailBtn);

    expect(
      screen.getByText("No user with this email address")
    ).toBeInTheDocument();
  });

  it("Should redirect to sigin page", async () => {
    render(
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signin" element={<div>Sign In Page</div>} />
      </Routes>,
      { initialEntries: ["/forgot-password"] }
    );

    const signInLink = screen.getByRole("link", {
      name: "Back to Sign in",
    });

    await userEvent.click(signInLink);

    expect(screen.getByText("Sign In Page")).toBeInTheDocument();
  });
});
