import userEvent from "@testing-library/user-event";
import { AdminPage } from "./AdminPage";
import { server } from "../mocks/server";
import { Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "../utility/test-utils";


describe("Admin Page", () => {
  it("should render Admin page with datasets", async () => {
    render(<AdminPage />);
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

  it("should open Dataset information", async () => {

    render(
      <Routes>
        <Route path="/" element={<AdminPage />} />
      </Routes>,
      { initialEntries: ["/"] }
    );

    await waitFor(() => {
      expect(screen.getByText("Annotation UI")).toBeInTheDocument();
    });

    const datasetCard = await screen.findByText("Dataset 1");
    userEvent.click(datasetCard);

    await waitFor(() => {
      expect(screen.getByText("INDEX DATASET")).toBeInTheDocument();
    });
  });

  it("should open and submit IndexDatasetForm", async () => {

    render(
      <Routes>
        <Route path="/" element={<AdminPage />} />
      </Routes>,
      { initialEntries: ["/"] }
    );

    

    const datasetCard = await screen.findByText("Dataset 1");
    userEvent.click(datasetCard);

    //Open Dataset Info page
    await waitFor(() => {
      expect(screen.getByText("INDEX DATASET")).toBeInTheDocument();
    });

    const indexButton = screen.getByRole("button", { name: "INDEX DATASET" });
    userEvent.click(indexButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "INDEX" })).toBeInTheDocument();
    })

  });
});