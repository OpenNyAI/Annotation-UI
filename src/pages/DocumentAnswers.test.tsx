import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { server } from "../mocks/server";
import { render, screen, waitFor } from "../utility/test-utils";
import { DocumentAnswers } from "./DocumentAnswers";

describe("Document Answers", () => {
  it("should make an api to call to get the q&a for the document", async () => {
    render(
      <Routes>
        <Route path="/answers/:documentId" element={<DocumentAnswers />} />
      </Routes>,
      { initialEntries: ["/answers/doc-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
    });

    const questionBox = screen.getByTestId("question-box");
    const answerBox = screen.getByTestId("answer-box");
    const additionalInfoBox = screen.getByTestId("additional-info-box");

    expect(screen.getByText("File-1.txt (1/2)")).toBeInTheDocument();
    expect(questionBox).toHaveTextContent("Question-1");
    expect(answerBox).toHaveTextContent(
      "annotated answer 1 annotated answer 2"
    );
    expect(additionalInfoBox).toHaveTextContent("answer-1 additional text");
  });

  it("should show next question answer on click of next and show prev on click of prev", async () => {
    render(
      <Routes>
        <Route path="/answers/:documentId" element={<DocumentAnswers />} />
      </Routes>,
      { initialEntries: ["/answers/doc-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
    });

    const questionBox = screen.getByTestId("question-box");
    const answerBox = screen.getByTestId("answer-box");
    const additionalInfoBox = screen.getByTestId("additional-info-box");

    const prevBtn = screen.getByTestId("prevBtn");
    const nextBtn = screen.getByTestId("nextBtn");

    expect(screen.getByText("File-1.txt (1/2)")).toBeInTheDocument();
    expect(questionBox).toHaveTextContent("Question-1");
    expect(answerBox).toHaveTextContent(
      "annotated answer 1 annotated answer 2"
    );
    expect(additionalInfoBox).toHaveTextContent("answer-1 additional text");

    // simulate next click
    await userEvent.click(nextBtn);

    expect(screen.getByText("File-1.txt (2/2)")).toBeInTheDocument();
    expect(questionBox).toHaveTextContent("Question-2");
    expect(answerBox).toHaveTextContent(
      "annotated answer 3 annotated answer 4"
    );
    expect(additionalInfoBox).toHaveTextContent("");

    //simulate prev click
    await userEvent.click(prevBtn);

    expect(screen.getByText("File-1.txt (1/2)")).toBeInTheDocument();
    expect(questionBox).toHaveTextContent("Question-1");
    expect(answerBox).toHaveTextContent(
      "annotated answer 1 annotated answer 2"
    );
    expect(additionalInfoBox).toHaveTextContent("answer-1 additional text");
  });

  it("should show Error screen when the documents api fails", async () => {
    server.use(
      http.get("/user/qna/document/doc-1", () => {
        return HttpResponse.json(
          { message: "Something went wrong" },
          { status: 500 }
        );
      })
    );

    render(
      <Routes>
        <Route path="/answers/:documentId" element={<DocumentAnswers />} />
      </Routes>,
      { initialEntries: ["/answers/doc-1"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(
        screen.getByText("Error while loading answers")
      ).toBeInTheDocument();
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});
