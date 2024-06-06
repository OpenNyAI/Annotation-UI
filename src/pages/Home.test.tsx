import { render, screen } from "../utility/test-utils";
import { Home } from "./Home";

describe("Home", () => {
  it("Should render home page", () => {
    render(<Home />);

    expect(screen.getByText("Question")).toBeInTheDocument();
  });
});
