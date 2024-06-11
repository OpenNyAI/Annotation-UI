import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { server } from "../mocks/server";
import { render, screen, waitFor } from "../utility/test-utils";
import { DocumentsList } from "./DocumentsList";

describe("Documents List", () => {
  it("Should make an api to call to get the documents", async () => {
    render(<DocumentsList />);

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(screen.getByText("File1.txt")).toBeInTheDocument();
    });
  });

  it("Should show Error screen when the documents api fails", async () => {
    server.use(
      http.get("/user/documents", () => {
        return HttpResponse.json(
          { message: "Something went wrong" },
          { status: 500 }
        );
      })
    );

    render(<DocumentsList />);

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(
        screen.getByText("Error while fetching the documents")
      ).toBeInTheDocument();
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  it("Should redirect to annotation UI on click of DocumentListItem", async () => {
    render(
      <Routes>
        <Route path="/" element={<DocumentsList />} />
        <Route path="/annotate/:fileId" element={<div>Annotation page</div>} />
      </Routes>,
      { initialEntries: ["/"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
    });

    const document = screen.getByTestId("1");
    await userEvent.click(document);

    expect(screen.getByText("Annotation page")).toBeInTheDocument();
  });

  it("should show empty documents message when documents are empty", async () => {
    server.use(
      http.get("/user/documents", () => {
        return HttpResponse.json({ documents: [] });
      })
    );

    render(<DocumentsList />);

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(
        screen.getByText(
          "No Documents present, please contact your admin to add documents"
        )
      ).toBeInTheDocument();
    });
  });
});
