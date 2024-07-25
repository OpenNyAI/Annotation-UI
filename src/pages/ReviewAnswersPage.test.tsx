import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { server } from "../mocks/server";
import {
  AnnotatedText,
  DocumentWithContent,
  QuestionAnswer,
  QuestionAnswerVersionListResponse,
  SingleQuestionAnswer,
} from "../types/api";
import { render, screen, waitFor } from "../utility/test-utils";
import { ReviewAnswersPage } from "./ReviewAnswersPage";

const fileContent: DocumentWithContent = {
  id: "file-1",
  file_name: "File1.txt",
  content: "this is file content information annotated_text1 annotated_text2",
};

const answer1Annotations: AnnotatedText[] = [
  {
    file_name: "File-1.tx",
    text: "annotated_text1",
    start_index: 33,
    end_index: 49,
  },
  {
    file_name: "File-2.tx",
    text: "query_text",
    start_index: 0,
    end_index: 11,
    source_text: "query_text from query results",
  },
];

const answer2Annotations: AnnotatedText[] = [
  {
    file_name: "File-2.tx",
    text: "annotated_text1",
    start_index: 33,
    end_index: 49,
  },
  {
    file_name: "File-3.tx",
    text: "annotated_text2",
    start_index: 49,
    end_index: 64,
  },
];
const answer1: QuestionAnswer = {
  id: "question-1",
  flag: false,
  file_name: "File-1.txt",
  query: "Question-1",
  version_number: 2,
  answers: answer1Annotations,
  chunk_results: [
    {
      chunk: "query_text from query results",
      metadata: { file_name: "file1.txt", chunk_id: 1 },
    },
  ],
  additional_text: [
    { id: "1", file_name: "file-1", text: "answer-1 additional text" },
  ],
};

const answer2: QuestionAnswer = {
  id: "question-2",
  flag: false,
  file_name: "File-1.txt",
  query: "Question-2",
  version_number: 1,
  answers: answer2Annotations,
  chunk_results: [],
};

const answer1OldVersion: SingleQuestionAnswer = {
  file_name: "File-1.txt",
  query: "Question-1",
  version_number: 1,
  answers: answer1Annotations,
  additional_text: [],
};

const question1VersionsResponse: QuestionAnswerVersionListResponse = {
  id: "question-1",
  chunk_results: [
    {
      chunk: "query_text from query results",
      metadata: { file_name: "file1.txt", chunk_id: 1 },
    },
  ],
  flag: false,
  qna: [answer1, answer1OldVersion],
};
const question2VersionsResponse: QuestionAnswerVersionListResponse = {
  id: "question-2",
  chunk_results: [],
  flag: false,
  qna: [answer2],
};

const qnaResponse = [answer1, answer2];

describe("Review Answers Page", () => {
  beforeEach(() => {
    server.use(
      http.get(`/user/documents/file-1`, () => {
        return HttpResponse.json(fileContent);
      }),
      http.get(`/user/qna/document/file-1`, () => {
        return HttpResponse.json({ qna: qnaResponse });
      }),
      http.post(`/user/qna/question-1`, () => {
        return HttpResponse.json("Submitted successfully");
      }),
      http.get(`/user/qna/question-1`, () => {
        return HttpResponse.json(question1VersionsResponse);
      }),
      http.get(`/user/qna/question-2`, () => {
        return HttpResponse.json(question2VersionsResponse);
      })
    );
  });

  it("Should render Review page with first question", async () => {
    render(
      <Routes>
        <Route path="/review/:documentId" element={<ReviewAnswersPage />} />
      </Routes>,
      { initialEntries: ["/review/file-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(
        screen.getByText("this is file content information")
      ).toBeInTheDocument();
    });
    expect(screen.getByTestId("annotation-text-answer")).toHaveTextContent(
      "annotated_text1"
    );
  });

  it("Should render Review page with next and previous question onClick of next or previous", async () => {
    render(
      <Routes>
        <Route path="/review/:documentId" element={<ReviewAnswersPage />} />
      </Routes>,
      { initialEntries: ["/review/file-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(
        screen.getByText("this is file content information")
      ).toBeInTheDocument();
    });
    expect(screen.getByTestId("annotation-text-answer")).toHaveTextContent(
      "annotated_text1"
    );

    const nextBtn = screen.getByTestId("nextBtn");
    const prevBtn = screen.getByTestId("prevBtn");

    await userEvent.click(nextBtn);

    expect(screen.getByTestId("annotation-text-answer")).toHaveTextContent(
      "annotated_text1 annotated_text2"
    );
    expect(screen.getByText("Question-2")).toBeInTheDocument();

    await userEvent.click(prevBtn);

    expect(screen.getByTestId("annotation-text-answer")).toHaveTextContent(
      "annotated_text1"
    );
    expect(screen.getByText("Question-1")).toBeInTheDocument();
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
        <Route path="/review/:documentId" element={<ReviewAnswersPage />} />
      </Routes>,
      { initialEntries: ["/review/file-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(screen.getByText("File not found")).toBeInTheDocument();
    });
  });

  it("should make an api call to update answer", async () => {
    render(
      <Routes>
        <Route path="/review/:documentId" element={<ReviewAnswersPage />} />
      </Routes>,
      { initialEntries: ["/review/file-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("this is file content information")
      ).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole("button", { name: "Submit" });

    const infoTextField = screen.getByPlaceholderText("Enter Additional Info");

    userEvent.type(infoTextField, "update additional info");
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText("Submitted successfully")).toBeInTheDocument();
    });
  });

  it("should show update answer api error message", async () => {
    server.use(
      http.post("user/qna/question-1", () => {
        return HttpResponse.json(
          {
            message: "Invalid document id",
          },
          { status: 400 }
        );
      })
    );

    render(
      <Routes>
        <Route path="/review/:documentId" element={<ReviewAnswersPage />} />
      </Routes>,
      { initialEntries: ["/review/file-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("this is file content information")
      ).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole("button", { name: "Submit" });

    const infoTextField = screen.getByPlaceholderText("Enter Additional Info");

    userEvent.type(infoTextField, "update additional info");
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Invalid document id")).toBeInTheDocument();
    });
  });

  it("should show the annotation summary with annotated text and update when user deletes the annotated text", async () => {
    render(
      <Routes>
        <Route path="/review/:documentId" element={<ReviewAnswersPage />} />
      </Routes>,
      { initialEntries: ["/review/file-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("this is file content information")
      ).toBeInTheDocument();
    });

    const text1ToSelect = screen.getByText("annotated_text2");
    expect(text1ToSelect).toBeInTheDocument();

    // highlight 15 characters from beginning of text element
    await userEvent.pointer([
      { target: text1ToSelect, offset: 0, keys: "[MouseLeft>]" },
      { offset: 16 },
      { keys: "[/MouseLeft]" },
    ]);

    expect(screen.getByText("Annotation Summary")).toBeInTheDocument();
    expect(screen.getByTestId("annotation-text-answer")).toHaveTextContent(
      "annotated_text1 query_text annotated_text2"
    );

    const deleteAnnotationBtn = screen.getAllByTestId(
      "annotation-delete-button"
    )[0];
    await userEvent.click(deleteAnnotationBtn);
    expect(screen.getByTestId("annotation-text-answer")).toHaveTextContent(
      "query_text annotated_text2"
    );
  });

  it("should show the selected version as the answer", async () => {
    render(
      <Routes>
        <Route path="/review/:documentId" element={<ReviewAnswersPage />} />
      </Routes>,
      { initialEntries: ["/review/file-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("this is file content information")
      ).toBeInTheDocument();
      expect(screen.getByText("Version 2")).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("Enter Additional Info")).toHaveValue(
      "answer-1 additional text"
    );

    const versionSelector = screen.getByTestId("version-selector");
    await userEvent.click(versionSelector);

    await waitFor(async () => {
      await userEvent.click(screen.getByRole("option", { name: "Version 1" }));
    });
    expect(screen.getByText("Version 1")).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Enter Additional Info")
    ).not.toBeInTheDocument();
  });
});
