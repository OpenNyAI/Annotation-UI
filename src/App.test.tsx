import App from "./App";
import { render, screen } from "./utility/test-utils";

vitest.mock("./components/AppLayout", () => ({
  AppLayout: () => <div>Application Layout page</div>,
}));

describe("App", () => {
  it("should renders Application layout page when route is /", () => {
    render(<App />, { initialEntries: ["/"] });

    expect(screen.getByText("Application Layout page")).toBeInTheDocument();
  });
});
