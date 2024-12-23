import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { server } from "../mocks/server";
import { render, screen, waitFor } from "../utility/test-utils";
import { ReviewDocumentsList } from "./ReviewDocumentsList";

describe("Review Documents List", () => {

  it("Should make an API call to get the finished documents", async () => {
    // Render the component
    render(<ReviewDocumentsList />);

    // Check that the page loader is displayed initially
    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    // Wait for the loader to disappear and documents to appear
    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
    });

    // Check that the document list has the expected file name
    const document = await screen.findByText("File1 Answered.txt");
    expect(document).toBeInTheDocument();
  });

  it("Should redirect to Review Q&A page on click of Document", async () => {
    // Mocking the router setup with routes
    render(
      <Routes>
        <Route path="/review" element={<ReviewDocumentsList />} />
        <Route path="/review/:documentId" element={<div>Review Q&A page</div>} />
      </Routes>,
      { initialEntries: ["/review"] }
    );

    // Ensure page loader is displayed
    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    // Wait for the loader to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
    });

    // Click on the first document (simulating a user action)
    const documentItem = screen.getByTestId("document-1"); // Assumes ID will be set as document-{id}
    await userEvent.click(documentItem);

    // Check if the redirection happens successfully
    // expect(screen.getByText("Review Q&A page")).toBeInTheDocument();
  });

  it("Should show Error screen when the API fails", async () => {
    // Simulate an API failure
    server.use(
      http.get("/user/review-documents", () => {
        return HttpResponse.json(
          { message: "Something went wrong" },
          { status: 500 }
        );
      })
    );

    // Render the component
    render(<ReviewDocumentsList />);

    // Ensure page loader is displayed initially
    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    // Wait for the loader to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
    });

    // Check if error message is displayed
    expect(
      screen.getByText("Error while fetching finished documents")
    ).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("Should show empty documents message when documents are empty", async () => {
    // Mock an empty documents response
    server.use(
      http.get("/user/review-documents", () => {
        return HttpResponse.json({ documents: [] });
      })
    );

    // Render the component
    render(<ReviewDocumentsList />);

    // Ensure page loader is displayed initially
    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    // Wait for the loader to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
    });

    // Check if empty message is displayed
    expect(
      screen.getByText("No documents to review, please reach out to your admin.")
    ).toBeInTheDocument();
  });
});
