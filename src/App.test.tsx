import App from "./App";
import { render, screen } from "./utility/test-utils";

vitest.mock("./pages/home", () => ({
  Home: () => <div>Home page</div>,
}));

test("renders home page", () => {
  render(<App />, { initialEntries: ["/"] });

  expect(screen.getByText("Home page")).toBeInTheDocument();
});
