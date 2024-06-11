import App from "./App";
import { render, screen } from "./utility/test-utils";

vitest.mock("./pages/DocumentsList", () => ({
  DocumentsList: () => <div>DocumentsList page</div>,
}));

describe("App", () => {
  it("should renders DocumentsList page when route is /", () => {
    render(<App />, { initialEntries: ["/"] });

    expect(screen.getByText("DocumentsList page")).toBeInTheDocument();
  });
});
