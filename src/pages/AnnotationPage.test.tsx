import { render, screen } from "../utility/test-utils";
import { AnnotationPage } from "./AnnotationPage";

describe("Home", () => {
  it("Should render home page", () => {
    render(<AnnotationPage />);

    expect(screen.getByText("Question")).toBeInTheDocument();
  });
});
