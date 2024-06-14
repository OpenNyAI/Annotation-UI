import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { server } from "../mocks/server";
import { render, screen, waitFor } from "../utility/test-utils";
import { MyAnswersList } from "./MyAnswersList";

describe("MyAnswers List", () => {
  it("Should make an api to call to get the current logged-in user answer documents", async () => {
    render(<MyAnswersList />);

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(screen.getByText("File1 Answered.txt")).toBeInTheDocument();
    });
  });

  it("Should show Error screen when the my documents api fails", async () => {
    server.use(
      http.get("/user/users/documents", () => {
        return HttpResponse.json(
          { message: "Something went wrong" },
          { status: 500 }
        );
      })
    );

    render(<MyAnswersList />);

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(
        screen.getByText("Error while fetching answered documents")
      ).toBeInTheDocument();
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  it("Should redirect to Q&A view page on click of Document", async () => {
    render(
      <Routes>
        <Route path="/answers" element={<MyAnswersList />} />
        <Route path="/answers/:fileId" element={<div>Q&A page</div>} />
      </Routes>,
      { initialEntries: ["/answers"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
    });

    const document = screen.getByTestId("1");
    await userEvent.click(document);

    expect(screen.getByText("Q&A page")).toBeInTheDocument();
  });

  it("should show empty documents message when documents are empty", async () => {
    server.use(
      http.get("/user/users/documents", () => {
        return HttpResponse.json({ documents: [] });
      })
    );

    render(
      <Routes>
        <Route path="/answers" element={<MyAnswersList />} />
        <Route path="/" element={<div>Annotation page</div>} />
      </Routes>,
      { initialEntries: ["/answers"] }
    );

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
      expect(
        screen.getByText(
          "You have not submitted Q&A for any document, Please annotate the documents"
        )
      ).toBeInTheDocument();
    });

    const annotationLink = screen.getByRole("link", { name: "here" });
    await userEvent.click(annotationLink);

    expect(screen.getByText("Annotation page")).toBeInTheDocument();
  });
});
