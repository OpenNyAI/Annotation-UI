import { http, HttpResponse } from "msw";
import App from "./App";
import { server } from "./mocks/server";
import { render, screen, waitFor } from "./utility/test-utils";

vitest.mock("./components/AppLayout", () => ({
  AppLayout: () => <div>Application Layout page</div>,
}));

describe("App", () => {
  it("should renders Application layout page when route is /", async () => {
    render(<App />, { initialEntries: ["/"] });

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Application Layout page")).toBeInTheDocument();
    });
  });

  it("should renders Application layout page when route is /", async () => {
    server.use(
      http.get("/user/config", () => {
        return HttpResponse.json(
          { message: "Something went wrong" },
          { status: 500 }
        );
      })
    );
    render(<App />, { initialEntries: ["/"] });

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});
