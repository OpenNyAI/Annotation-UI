import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../utility/test-utils";
import {AdminPage} from "./AdminPage";

describe("Admin Page", () => {
  it("should render Admin page with datasets", async () => {
    const mockDatasets = [
      {
        name: "Dataset 1",
        date: "2023-10-26",
        created_by: "John Doe",
        status: "Active",
      },
      {
        name: "Dataset 2",
        date: "2023-10-27",
        created_by: "Jane Doe",
        status: "Inactive",
      },
    ];

    render(
        <AdminPage />
    );

    await waitFor(() => {
      expect(screen.getByText("Annotation UI")).toBeInTheDocument();
    });
  });

  it("should open and close Create Dataset form", async () => {
    render(
        <AdminPage />
    );

    await waitFor(() => {
      expect(screen.getByText("Annotation UI")).toBeInTheDocument();
    });

    const createDatasetButton = screen.getByRole("button", {
      name: "+ CREATE DATASET",
    });
    expect(screen.queryByText("Drag and drop")).not.toBeInTheDocument();
    await userEvent.click(createDatasetButton);
    expect(screen.getByText("Create Dataset")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    await userEvent.click(closeButton);
    expect(screen.queryByText("Drag and drop")).not.toBeInTheDocument();
  });

  it("should toggle sidebar visibility", async () => {
    render(
        <AdminPage />
    );

    const hamburgerButton = screen.getByTestId("hamburger");
    await userEvent.click(hamburgerButton);

    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toHaveStyle("transform: translateX(-100%)"); // When hidden
    await userEvent.click(hamburgerButton);
    expect(sidebar).toHaveStyle("transform: translateX(0)"); // When visible

  });
});