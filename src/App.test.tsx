import App from "./App";
import { render, screen, waitFor } from "./utility/test-utils";

vitest.mock("./components/AppLayout", () => ({
  AppLayout: () => <div>Application Layout page</div>,
}));

describe("App", () => {
  it("should renders Application layout page when route is /", async () => {
    render(<App />, { initialEntries: ["/"] });

    await waitFor(() => {
      expect(screen.getByText("Application Layout page")).toBeInTheDocument();
    });
  });
});
