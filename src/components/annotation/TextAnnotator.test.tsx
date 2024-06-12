import { userEvent } from "@testing-library/user-event";
import { Mock } from "vitest";
import { render, screen } from "../../utility/test-utils";
import TextAnnotator from "./TextAnnotator";

describe("Text Annotator", () => {
  let onTextAnnotation: Mock;

  beforeEach(() => {
    Range.prototype.getBoundingClientRect = vi.fn();
    Range.prototype.getClientRects = () => ({
      item: vi.fn(),
      length: 0,
      [Symbol.iterator]: vi.fn(),
    });
    onTextAnnotation = vitest.fn();
  });

  it("should render a ready only text annotator", () => {
    render(
      <TextAnnotator
        annotatedTexts={[]}
        id="editor"
        file_name="file_1"
        text="default text"
        onTextAnnotation={onTextAnnotation}
      />
    );

    const textParagraph = screen.getByRole("paragraph");
    const editorContainer = textParagraph.parentElement;

    expect(textParagraph).toBeInTheDocument();
    expect(textParagraph).toHaveTextContent("default text");

    expect(editorContainer).toHaveAttribute("contenteditable", "false");
  });

  it("should add background color for the annotated texts", () => {
    render(
      <TextAnnotator
        annotatedTexts={[
          {
            id: "editor",
            file_name: "file_1",
            end_index: 3,
            start_index: 0,
            text: "def",
            isFocused: true,
          },
          {
            id: "editor",
            file_name: "file_1",
            end_index: 11,
            start_index: 8,
            text: "text",
          },
        ]}
        file_name="file_1"
        id="editor"
        text="default text"
        onTextAnnotation={onTextAnnotation}
      />
    );

    const annotatedSpan1 = screen.getByText("def");
    expect(annotatedSpan1).toHaveStyle({
      "background-color": "rgb(0, 153, 115)",
    });

    const annotatedSpan2 = screen.getByText("text");
    expect(annotatedSpan2).toHaveStyle({
      "background-color": "rgb(0, 153, 115)",
    });
  });

  it("should call onAnnotateText with selected text information", async () => {
    render(
      <TextAnnotator
        annotatedTexts={[
          {
            id: "editor",
            file_name: "file_1",
            end_index: 19,
            start_index: 14,
            text: "text",
          },
        ]}
        file_name="file_1"
        id="editor"
        text="this is a new text to select"
        onTextAnnotation={onTextAnnotation}
      />
    );

    const textToSelect = screen.getByText(/this/);

    expect(textToSelect).toBeInTheDocument();

    // highlight 5 characters from beginning of text element
    await userEvent.pointer([
      { target: textToSelect, offset: 0, keys: "[MouseLeft>]" },
      { offset: 5 },
      { keys: "[/MouseLeft]" },
    ]);

    expect(onTextAnnotation).toHaveBeenNthCalledWith(1, {
      end_index: 5,
      file_name: "file_1",
      id: "editor",
      start_index: 0,
      text: "this ",
    });
  });
  it("should not call onAnnotateText when the selected text is empty", async () => {
    render(
      <TextAnnotator
        annotatedTexts={[]}
        id="editor"
        file_name="file_1"
        text="this is a new text to select"
        onTextAnnotation={onTextAnnotation}
      />
    );

    const textToSelect = screen.getByText(/this/);

    expect(textToSelect).toBeInTheDocument();

    // highlight 5 characters from beginning of text element
    await userEvent.pointer([
      { target: textToSelect, offset: 0, keys: "[MouseLeft>]" },
      { offset: 0 },
      { keys: "[/MouseLeft]" },
    ]);

    expect(onTextAnnotation).not.toHaveBeenCalled();
  });
});
