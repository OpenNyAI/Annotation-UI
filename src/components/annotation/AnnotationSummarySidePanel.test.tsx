import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";
import { fireEvent, render, screen } from "../../utility/test-utils";
import { AnnotationSummarySidePanel } from "./AnnotationSummarySidePanel";
import { TextAnnotation } from "./TextAnnotator";

const textAnnotations: TextAnnotation[] = [
  {
    id: "editor-1",
    end_index: 10,
    file_name: "file_1",
    start_index: 5,
    text: "text-1",
  },
  {
    id: "editor-1",
    end_index: 10,
    file_name: "file_1",
    start_index: 5,
    text: "text-2",
  },
  {
    id: "editor-1",
    end_index: 10,
    file_name: "file_1",
    start_index: 5,
    text: "text-3",
  },
];

const updatedAnnotations = [
  {
    id: "editor-1",
    file_name: "file_1",
    end_index: 10,
    start_index: 5,
    text: "text-2",
  },
  {
    id: "editor-1",
    file_name: "file_1",
    end_index: 10,
    start_index: 5,
    text: "text-3",
  },
  {
    id: "editor-1",
    file_name: "file_1",
    end_index: 10,
    start_index: 5,
    text: "text-1",
  },
];

describe("AnnotationSummarySidePanel", () => {
  let onDelete: Mock;
  let onSelect: Mock;
  let onUpdateSelection: Mock;

  beforeEach(() => {
    onDelete = vitest.fn();
    onSelect = vitest.fn();
    onUpdateSelection = vitest.fn();
  });

  afterEach(() => {
    vitest.resetAllMocks();
  });
  it("should render annotation summary sidePanel", () => {
    render(
      <AnnotationSummarySidePanel
        textAnnotations={textAnnotations}
        onDelete={onDelete}
        onSelect={onSelect}
        onUpdateSelections={onUpdateSelection}
      />,
      {}
    );

    const annotationTextList = screen.getByTestId("annotation-text-list");

    const children = annotationTextList.childNodes;

    expect(children.length).toEqual(3);
    expect(children[0]).toHaveTextContent("text-1");
    expect(children[1]).toHaveTextContent("text-2");
    expect(children[2]).toHaveTextContent("text-3");
  });

  it("should call onDelete when user clicks on delete icon", async () => {
    render(
      <AnnotationSummarySidePanel
        textAnnotations={textAnnotations}
        onDelete={onDelete}
        onSelect={onSelect}
        onUpdateSelections={onUpdateSelection}
      />,
      {}
    );

    const deleteAnnotationBtn = screen.getAllByTestId(
      "annotation-delete-button"
    )[0];

    await userEvent.click(deleteAnnotationBtn);

    expect(onDelete).toHaveBeenNthCalledWith(1, 0);
  });

  it("should call onSelect when user clicks on annotated text item", async () => {
    render(
      <AnnotationSummarySidePanel
        textAnnotations={textAnnotations}
        onDelete={onDelete}
        onSelect={onSelect}
        onUpdateSelections={onUpdateSelection}
      />,
      {}
    );

    const annotationTextList = screen.getByTestId("annotation-text-list");

    await userEvent.click(annotationTextList.firstElementChild!);

    expect(onSelect).toHaveBeenNthCalledWith(1, 0);
  });

  it("should update the order of annotations on drag and drop", async () => {
    render(
      <AnnotationSummarySidePanel
        textAnnotations={textAnnotations}
        onDelete={onDelete}
        onSelect={onSelect}
        onUpdateSelections={onUpdateSelection}
      />,
      {}
    );

    const annotationTextList = screen.getByTestId("annotation-text-list");

    const dragElement = annotationTextList.children[0];
    const dropElement = annotationTextList.children[2];

    await fireEvent.dragStart(dragElement);
    await fireEvent.dragEnter(dropElement);
    await fireEvent.dragOver(dropElement);
    await fireEvent.drop(dropElement);
    await fireEvent.dragLeave(dragElement);
    await fireEvent.dragEnd(dragElement);

    expect(onUpdateSelection).toHaveBeenNthCalledWith(1, updatedAnnotations);
  });

  it("should not change the order when drag and dropped on same item", async () => {
    render(
      <AnnotationSummarySidePanel
        textAnnotations={textAnnotations}
        onDelete={onDelete}
        onSelect={onSelect}
        onUpdateSelections={onUpdateSelection}
      />,
      {}
    );

    const annotationTextList = screen.getByTestId("annotation-text-list");

    const dragElement = annotationTextList.children[0];

    await fireEvent.dragStart(dragElement);
    await fireEvent.dragEnter(dragElement);
    await fireEvent.dragOver(dragElement);
    await fireEvent.drop(dragElement);
    await fireEvent.dragLeave(dragElement);
    await fireEvent.dragEnd(dragElement);

    expect(onUpdateSelection).not.toHaveBeenCalled();
  });
});
