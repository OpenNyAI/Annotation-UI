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
});
