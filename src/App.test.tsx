import App from "./App";
import { render, screen } from "./utility/test-utils";

vitest.mock("./pages/home", () => ({
  Home: () => <div>Home page</div>,
}));

describe("App", () => {
  it("should renders home page when route is /", () => {
    render(<App />, { initialEntries: ["/"] });

    expect(screen.getByText("Home page")).toBeInTheDocument();
  });

  it("should renders not found page when invalid path is given", () => {
    render(<App />, { initialEntries: ["/error"] });

    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });
});
