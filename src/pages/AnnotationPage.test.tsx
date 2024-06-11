import { HttpResponse, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { server } from "../mocks/server";
import { render, screen, waitFor } from "../utility/test-utils";
import { AnnotationPage } from "./AnnotationPage";

describe("Annotation Page", () => {
  it("Should render Annotation page with the file contents", async () => {
    render(
      <Routes>
        <Route path="/annotate/:documentId" element={<AnnotationPage />} />
      </Routes>,
      { initialEntries: ["/annotate/file-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(
        screen.getByText("this is file content information")
      ).toBeInTheDocument();
    });
  });

  it("Should render Error information inside Annotation page", async () => {
    server.use(
      http.get(`/user/documents/file-1`, () => {
        return HttpResponse.json(
          {
            message: "File not found",
          },
          { status: 404 }
        );
      })
    );

    render(
      <Routes>
        <Route path="/annotate/:documentId" element={<AnnotationPage />} />
      </Routes>,
      { initialEntries: ["/annotate/file-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(screen.getByText("File not found")).toBeInTheDocument();
    });
  });
});
