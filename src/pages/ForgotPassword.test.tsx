import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
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
