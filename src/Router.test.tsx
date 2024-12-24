import userEvent from "@testing-library/user-event";
import { Router } from "./Router";
import { render, screen, waitFor } from "./utility/test-utils";
import { MemoryRouter } from "react-router-dom";
import { ReactNode } from "react";




// Mocking the SignUp module and providing PasswordSchema export
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

vitest.mock("./pages/NotFound", () => ({
  NotFound: () => <div>Page Not Found</div>,
}));


// Mocking PrivateRoute and PublicRoute components
vi.mock('./components/PrivateRoute', () => ({
  PrivateRoute: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('./components/PublicRoute', () => ({
  PublicRoute: ({ children }: { children: ReactNode }) => <>{children}</>,
}));


describe("Router", () => {
  // Test for rendering SignIn page
  it("Should render signin page", async () => {
    render(<Router />, { initialEntries: ["/signin"], authState: {} });

    await waitFor(() => {
      expect(screen.getByText("Sign In")).toBeInTheDocument();
    });
  });

  // Test for rendering SignUp page
  it("Should render signup page", async () => {
    render(<Router />, { initialEntries: ["/signup"], authState: {} });

    await waitFor(() => {
      expect(screen.getByText("SignUp page")).toBeInTheDocument();
    });
  });

  // Test for rendering ForgotPassword page
  it("Should render forgot password page", async () => {
    render(<Router />, { initialEntries: ["/forgot-password"], authState: {} });

    await waitFor(() => {
      expect(screen.getByText("Forgot password page")).toBeInTheDocument();
    });
  });

 // Mocking jwt-decode
vitest.mock('jwt-decode', () => ({
  __esModule: true,
  default: vitest.fn(() => ({
    sub: "userId", // Example mock token payload
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
    role: "admin", // Example role
  })),
}));

describe("should render annotation routes when app is in annotation state", () => {
    it("should render documents page when the app state is annotation", async () => {
      render(<Router />, {
        initialEntries: ["/"],
        appConfig: { app_state: "annotation" },
      });

      await waitFor(() => {
        expect(screen.getByText("DocumentsList page")).toBeInTheDocument();
      });
    });

    it("Should render my answers page when route is answers", async () => {
      render(<Router />, {
        initialEntries: ["/answers"],
        appConfig: { app_state: "annotation" },
      });

      await waitFor(() => {
        expect(screen.getByText("MyAnswersList page")).toBeInTheDocument();
      });
    });

    it("Should render Annotation page when the route is annotate", async () => {
      render(<Router />, {
        initialEntries: ["/annotate/file-1"],
        appConfig: { app_state: "annotation" },
      });

      await waitFor(() => {
        expect(screen.getByText("Annotation page")).toBeInTheDocument();
      });
    });

    it("Should expand drawer to show the name of navigation item", async () => {
      render(<Router />, {
        initialEntries: ["/annotate/file-1"],
        appConfig: { app_state: "annotation" },
      });

      expect(screen.getByText("Annotation page")).toBeInTheDocument();

      const drawerOpenIcon = screen.getByTestId("drawer-open-icon");
      await userEvent.click(drawerOpenIcon);

      const drawerCloseIcon = screen.getByTestId("drawer-close-icon");
      await userEvent.click(drawerCloseIcon);
    });

    it("Should render DocumentAnswers page when route is answers/id", async () => {
      render(<Router />, {
        initialEntries: ["/answers/file-1"],
        appConfig: { app_state: "annotation" },
      });

      await waitFor(() => {
        expect(screen.getByText("Document Answers page")).toBeInTheDocument();
      });
    });
  });

  describe("should render review routes when app is in review state", () => {
    it("should render review documents list page", async () => {
      render(<Router />, {
        initialEntries: ["/review"],
        appConfig: { app_state: "review" },
      });

      await waitFor(() => {
        expect(screen.getByText("Review Documents page")).toBeInTheDocument();
      });
    });

    it("should render review qna page", async () => {
      render(<Router />, {
        initialEntries: ["/review/answers/doc-1"],
        appConfig: { app_state: "review" },
      });

      await waitFor(() => {
        expect(screen.getByText("Review Answers page")).toBeInTheDocument();
      });
    });

    it("should not render any annotation pages when state is review", async () => {
      render(<Router />, {
        initialEntries: ["/answers/file-1"],
        appConfig: { app_state: "review" },
      });

      await waitFor(() => {
        expect(screen.getByText("Page Not Found")).toBeInTheDocument();
      });
    });
  });

  describe("should handle invalid routes", () => {
    it("should render the NotFound page when an invalid route is accessed", async () => {
      render(<Router />, {
        initialEntries: ["/non-existent-route"],
        appConfig: { app_state: "annotation" },
      });

      await waitFor(() => {
        expect(screen.getByText("Page Not Found")).toBeInTheDocument();
      });
    });
  });
});
