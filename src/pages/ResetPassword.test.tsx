import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { server } from "../mocks/server";
import { render, screen } from "../utility/test-utils";
import { ResetPassword } from "./ResetPassword";

describe("ResetPassword", () => {
  it("Should render reset password  page successfully", () => {
    render(<ResetPassword />);

    const welcomeText = screen.getByText(
      "Welcome to Annotation UI, Reset password"
    );

    const sendEmailBtn = screen.getByRole("button", {
      name: "Reset",
    });

    expect(welcomeText).toBeInTheDocument();
    expect(sendEmailBtn).toBeDisabled();
  });

  it("should make api call to update the password", async () => {
    render(
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signin" element={<div>Sign In Page</div>} />
      </Routes>,
      { initialEntries: ["/reset-password"] }
    );

    const resetIdField = screen.getByPlaceholderText("Enter Reset ID");
    const verificationField = screen.getByPlaceholderText(
      "Enter Verification code"
    );
    const passwordField = screen.getByPlaceholderText("Enter new password");
    const confirmPasswordField = screen.getByPlaceholderText(
      "Confirm new password"
    );
    const restBtn = screen.getByRole("button", {
      name: "Reset",
    });

    await userEvent.type(resetIdField, "23");
    await userEvent.type(verificationField, "CODE123");
    await userEvent.type(passwordField, "Password@123");
    await userEvent.type(confirmPasswordField, "Password@123");

    await userEvent.click(restBtn);

    expect(
      screen.getByText("Password updated successfully")
    ).toBeInTheDocument();
    expect(screen.getByText("Sign In Page")).toBeInTheDocument();
  });

  it("should make api call to update the password and show the error", async () => {
    server.use(
      http.post("/auth/update-password", () => {
        return HttpResponse.json(
          { message: "Invalid Verification Code" },
          { status: 400 }
        );
      })
    );
    render(<ResetPassword />);

    const resetIdField = screen.getByPlaceholderText("Enter Reset ID");
    const verificationField = screen.getByPlaceholderText(
      "Enter Verification code"
    );
    const passwordField = screen.getByPlaceholderText("Enter new password");
    const confirmPasswordField = screen.getByPlaceholderText(
      "Confirm new password"
    );
    const restBtn = screen.getByRole("button", {
      name: "Reset",
    });

    await userEvent.type(resetIdField, "23");
    await userEvent.type(verificationField, "CODE123");
    await userEvent.type(passwordField, "Password@123");
    await userEvent.type(confirmPasswordField, "Password@123");

    await userEvent.click(restBtn);

    expect(screen.getByText("Invalid Verification Code")).toBeInTheDocument();
  });

  it("Should change password visibility", async () => {
    render(<ResetPassword />);

    const passwordField = screen.getByPlaceholderText("Enter new password");
    const ConfirmPasswordField = screen.getByPlaceholderText(
      "Confirm new password"
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
});
