import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { chunks } from "../mocks/documents";
import { server } from "../mocks/server";
import { QueryResult } from "../types/api";
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

  it("should make an api call to get the query results", async () => {
    render(
      <Routes>
        <Route path="/annotate/:documentId" element={<AnnotationPage />} />
      </Routes>,
      { initialEntries: ["/annotate/file-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("this is file content information")
      ).toBeInTheDocument();
    });

    const questionField = screen.getByPlaceholderText("Enter your question");
    const queryBtn = screen.getByRole("button", { name: "Query" });

    await userEvent.type(questionField, "test-query");
    await userEvent.click(queryBtn);

    chunks.forEach((chunk) => {
      expect(screen.getByText(chunk.chunk)).toBeInTheDocument();
    });
  });

  it("should show query error when query results api fails", async () => {
    render(
      <Routes>
        <Route path="/annotate/:documentId" element={<AnnotationPage />} />
      </Routes>,
      { initialEntries: ["/annotate/file-1"] }
    );

    server.use(
      http.get("/user/query", () => {
        return HttpResponse.json(
          { message: "Invalid query string" },
          { status: 500 }
        );
      })
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("this is file content information")
      ).toBeInTheDocument();
    });

    const questionField = screen.getByPlaceholderText("Enter your question");
    const queryBtn = screen.getByRole("button", { name: "Query" });

    await userEvent.type(questionField, "test-query");
    await userEvent.click(queryBtn);

    expect(screen.getByText("Invalid query string")).toBeInTheDocument();
  });

  it("should make an api call to submit answer for the query", async () => {
    render(
      <Routes>
        <Route path="/annotate/:documentId" element={<AnnotationPage />} />
      </Routes>,
      { initialEntries: ["/annotate/file-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("this is file content information")
      ).toBeInTheDocument();
    });

    const questionField = screen.getByPlaceholderText("Enter your question");
    const queryBtn = screen.getByRole("button", { name: "Query" });
    const addNewBtn = screen.getByRole("button", { name: "Add New" });

    await userEvent.click(addNewBtn);

    const chooseDocument = screen.getByPlaceholderText("Choose Document");
    const additionalInfoField = screen.getByPlaceholderText(
      "Enter Additional Info"
    );
    await userEvent.type(additionalInfoField, "answer");

    await userEvent.click(chooseDocument);
    const documentOption = screen.getByRole("option", {
      name: "file-1.txt",
    });
    await userEvent.click(documentOption);

    await userEvent.type(questionField, "test-query");
    await userEvent.click(queryBtn);

    const submitBtn = screen.getByRole("button", { name: "Submit" });

    await userEvent.type(additionalInfoField, "anwer");
    await userEvent.click(submitBtn);

    expect(screen.getByText("Submitted successfully")).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Enter Additional Info")
    ).not.toBeInTheDocument();
  });

  it("should show submit answer api error message", async () => {
    server.use(
      http.post("user/submit", () => {
        return HttpResponse.json(
          {
            message: "Maximum limit of answer reached",
          },
          { status: 400 }
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
      expect(
        screen.getByText("this is file content information")
      ).toBeInTheDocument();
    });

    const questionField = screen.getByPlaceholderText("Enter your question");
    const queryBtn = screen.getByRole("button", { name: "Query" });
    const addNewBtn = screen.getByRole("button", { name: "Add New" });

    await userEvent.click(addNewBtn);

    const chooseDocument = screen.getByPlaceholderText("Choose Document");
    const additionalInfoField = screen.getByPlaceholderText(
      "Enter Additional Info"
    );
    await userEvent.type(additionalInfoField, "answer");

    await userEvent.click(chooseDocument);
    const documentOption = screen.getByRole("option", {
      name: "file-1.txt",
    });
    await userEvent.click(documentOption);

    await userEvent.type(questionField, "test-query");
    await userEvent.click(queryBtn);

    const submitBtn = screen.getByRole("button", { name: "Submit" });

    await userEvent.click(submitBtn);

    expect(screen.getByText("Results")).toBeInTheDocument();
    expect(
      screen.getByText("Maximum limit of answer reached")
    ).toBeInTheDocument();
  });

  it("should not make an api call to get the query results if the question is empty", async () => {
    render(
      <Routes>
        <Route path="/annotate/:documentId" element={<AnnotationPage />} />
      </Routes>,
      { initialEntries: ["/annotate/file-1"] }
    );

    server.use(
      http.get("/user/query", () => {
        return HttpResponse.json<QueryResult>({
          query: "test-query",
          chunks,
        });
      })
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("this is file content information")
      ).toBeInTheDocument();
    });

    const questionField = screen.getByPlaceholderText("Enter your question");

    await userEvent.type(questionField, "{enter}");

    chunks.forEach((chunk) => {
      expect(screen.queryByText(chunk.chunk)).not.toBeInTheDocument();
    });
  });

  it("should show the annotation summary with annotated text and update when user deletes the annotated text", async () => {
    render(
      <Routes>
        <Route path="/annotate/:documentId" element={<AnnotationPage />} />
      </Routes>,
      { initialEntries: ["/annotate/file-1"] }
    );

    server.use(
      http.get("/user/query", () => {
        return HttpResponse.json<QueryResult>({
          query: "test-query",
          chunks,
        });
      })
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("this is file content information")
      ).toBeInTheDocument();
    });

    const questionField = screen.getByPlaceholderText("Enter your question");
    const queryBtn = screen.getByRole("button", { name: "Query" });

    await userEvent.type(questionField, "test-query");
    await userEvent.click(queryBtn);

    const text1ToSelect = screen.getByText(chunks[0].chunk);
    expect(text1ToSelect).toBeInTheDocument();
    const text2ToSelect = screen.getByText(chunks[1].chunk);
    expect(text2ToSelect).toBeInTheDocument();

    // highlight 5 characters from beginning of text element
    await userEvent.pointer([
      { target: text1ToSelect, offset: 0, keys: "[MouseLeft>]" },
      { offset: 5 },
      { keys: "[/MouseLeft]" },
    ]);

    // highlight 6 characters from beginning of text element
    await userEvent.pointer([
      { target: text2ToSelect, offset: 0, keys: "[MouseLeft>]" },
      { offset: 7 },
      { keys: "[/MouseLeft]" },
    ]);

    expect(screen.getByText("Annotation Summary")).toBeInTheDocument();
    expect(screen.getByTestId("annotation-text-answer")).toHaveTextContent(
      "chunk chunk-2"
    );

    const deleteAnnotationBtn = screen.getAllByTestId(
      "annotation-delete-button"
    )[0];
    await userEvent.click(deleteAnnotationBtn);
    expect(screen.getByTestId("annotation-text-answer")).toHaveTextContent(
      "chunk-2"
    );
  });
});
