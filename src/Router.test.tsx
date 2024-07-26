import userEvent from "@testing-library/user-event";
import { Router } from "./Router";
import { render, screen, waitFor } from "./utility/test-utils";

vitest.mock("./pages/SignIn", () => ({
  SignIn: () => <div>SignIn page</div>,
}));

vitest.mock("./pages/SignUp", () => ({
  SignUp: () => <div>SignUp page</div>,
  PasswordSchema: vitest.fn().mockResolvedValue({}),
}));

vitest.mock("./pages/ForgotPassword", () => ({
  ForgotPassword: () => <div>Forgot password page</div>,
}));

vitest.mock("./pages/DocumentsList", () => ({
  DocumentsList: () => <div>DocumentsList page</div>,
}));

vitest.mock("./pages/DocumentAnswers", () => ({
  DocumentAnswers: () => <div>Document Answers page</div>,
}));

vitest.mock("./pages/MyAnswersList", () => ({
  MyAnswersList: () => <div>MyAnswersList page</div>,
}));

vitest.mock("./pages/AnnotationPage", () => ({
  AnnotationPage: () => <div>Annotation page</div>,
}));

vitest.mock("./pages/ReviewDocumentsList", () => ({
  ReviewDocumentsList: () => <div>Review Documents page</div>,
}));

vitest.mock("./pages/ReviewAnswersPage", () => ({
  ReviewAnswersPage: () => <div>Review Answers page</div>,
}));

describe("Router", () => {
  it("should render signin page", async () => {
    render(<Router />, { initialEntries: ["/signin"], authState: {} });

    await waitFor(() => {
      expect(screen.getByText("SignIn page")).toBeInTheDocument();
    });
  });

  it("should render signup page", async () => {
    render(<Router />, { initialEntries: ["/signup"], authState: {} });

    await waitFor(() => {
      expect(screen.getByText("SignUp page")).toBeInTheDocument();
    });
  });

  it("should render forgot password page", async () => {
    render(<Router />, { initialEntries: ["/forgot-password"], authState: {} });

    await waitFor(() => {
      expect(screen.getByText("Forgot password page")).toBeInTheDocument();
    });
  });

  describe("should render annotation routes when app is in annotation state", () => {
    it("Should render documents page when the app state is annotation", async () => {
      render(<Router />);

      expect(screen.getByText("DocumentsList page")).toBeInTheDocument();
    });

    it("Should render my answers page when route is answers", async () => {
      render(<Router />, { initialEntries: ["/answers"] });

      expect(screen.getByText("MyAnswersList page")).toBeInTheDocument();
    });

    it("Should render Annotations when the route is annotate", async () => {
      render(<Router />, { initialEntries: ["/annotate/file-1"] });

      expect(screen.getByText("Annotation page")).toBeInTheDocument();
    });

    it("Should expand drawer to show the name of navigation item", async () => {
      render(<Router />, { initialEntries: ["/annotate/file-1"] });

      expect(screen.getByText("Annotation page")).toBeInTheDocument();

      const drawerOpenIcon = screen.getByTestId("drawer-open-icon");
      await userEvent.click(drawerOpenIcon);

      const drawerCloseIcon = screen.getByTestId("drawer-close-icon");
      await userEvent.click(drawerCloseIcon);
    });

    it("Should render DocumentAnswers page when route is answers/id", async () => {
      render(<Router />, { initialEntries: ["/answers/file-1"] });

      expect(screen.getByText("Document Answers page")).toBeInTheDocument();
    });
  });

  describe("should render review routes when app is in review or expert-review state", () => {
    it("should render review documents list page", async () => {
      render(<Router />, {
        initialEntries: ["/review"],
        appConfig: { app_state: "review" },
      });

      expect(screen.getByText("Review Documents page")).toBeInTheDocument();
    });

    it("should render review qna  page", async () => {
      render(<Router />, {
        initialEntries: ["/review/doc-1"],
        appConfig: { app_state: "review" },
      });

      expect(screen.getByText("Review Answers page")).toBeInTheDocument();
    });

    it("should render review qna  page when app state is expert-review", async () => {
      render(<Router />, {
        initialEntries: ["/review/doc-1"],
        appConfig: { app_state: "expert-review" },
      });

      expect(screen.getByText("Review Answers page")).toBeInTheDocument();
    });

    it("should not render any annotation pages when state is review", async () => {
      render(<Router />, {
        initialEntries: ["/answers/file-1"],
        appConfig: { app_state: "review" },
      });

      expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    });
  });
});
