import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { server } from "../mocks/server";
import { render, screen, waitFor } from "../utility/test-utils";
import { ReviewDocumentsList } from "./ReviewDocumentsList";

describe("Review Documents List", () => {
  it("Should make an api to call to get the finished documents", async () => {
    render(<ReviewDocumentsList isExpertReview={false} />);

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(screen.getByText("File1 Answered.txt")).toBeInTheDocument();
    });
  });

  it("Should redirect to Review Q&A page on click of Document", async () => {
    render(
      <Routes>
        <Route
          path="/review"
          element={<ReviewDocumentsList isExpertReview={false} />}
        />
        <Route
          path="/review/:documentId"
          element={<div>Review Q&A page</div>}
        />
      </Routes>,
      { initialEntries: ["/review"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
    });

    const document = screen.getByTestId("1");
    await userEvent.click(document);

    expect(screen.getByText("Review Q&A page")).toBeInTheDocument();
  });

  it("Should show Error screen when the my documents api fails", async () => {
    server.use(
      http.get("/user/review-documents", () => {
        return HttpResponse.json(
          { message: "Something went wrong" },
          { status: 500 }
        );
      })
    );

    render(<ReviewDocumentsList isExpertReview={false} />);

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(
        screen.getByText("Error while fetching finished documents")
      ).toBeInTheDocument();
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  it("should show empty documents message when documents are empty", async () => {
    server.use(
      http.get("/user/review-documents", () => {
        return HttpResponse.json({ documents: [] });
      })
    );

    render(<ReviewDocumentsList isExpertReview={false} />);

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(
        screen.getByText(
          "No documents to review, please reach out to your admin."
        )
      ).toBeInTheDocument();
    });
  });

  it("should make request to change the document status to review on click of mark as reviewed", async () => {
    server.use(
      http.post("/user/document-status", () => {
        return HttpResponse.json("Document status updated successfully");
      })
    );

    render(<ReviewDocumentsList isExpertReview={false} />);

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(screen.getByText("File1 Answered.txt")).toBeInTheDocument();
    });

    const document = screen.getByLabelText("Doc_Status_1");
    await userEvent.click(document);

    expect(
      screen.getByText("Document status updated successfully")
    ).toBeInTheDocument();
  });

  it("should not show option to mark as reviewed", async () => {
    server.use(
      http.post("/user/document-status", () => {
        return HttpResponse.json("Document status updated successfully");
      })
    );

    render(<ReviewDocumentsList isExpertReview={true} />);

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(screen.getByText("File1 Answered.txt")).toBeInTheDocument();
    });

    expect(screen.queryByLabelText("Doc_Status_1")).not.toBeInTheDocument();
  });

  it("should show change document status api error when there is an error", async () => {
    server.use(
      http.post("/user/document-status", () => {
        return HttpResponse.json(
          { message: "Internal Server error" },
          { status: 500 }
        );
      })
    );

    render(<ReviewDocumentsList isExpertReview={false} />);

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(screen.getByText("File1 Answered.txt")).toBeInTheDocument();
    });

    const document = screen.getByLabelText("Doc_Status_1");
    await userEvent.click(document);

    expect(screen.getByText("Internal Server error")).toBeInTheDocument();
  });
});
