import App from "./App";
import { render, screen } from "./utility/test-utils";

vitest.mock("./pages/FilesList", () => ({
  FilesList: () => <div>FilesList page</div>,
}));

describe("App", () => {
  it("should renders filesList page when route is /", () => {
    render(<App />, { initialEntries: ["/"] });

    expect(screen.getByText("FilesList page")).toBeInTheDocument();
  });
});
