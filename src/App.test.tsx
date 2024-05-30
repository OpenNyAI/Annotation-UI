import App from "./App";
import { render, screen } from "./utility/test-utils";

vitest.mock("./pages/home", () => ({
  Home: () => <div>Home page</div>,
}));

test("renders learn react link", () => {
  render(<App />, { initialEntries: ["/home"] });

  expect(screen.getByText("Home page")).toBeInTheDocument();
});
