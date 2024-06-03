import { userEvent } from "@testing-library/user-event";
import { Mock } from "vitest";
import { render, screen } from "../../utility/test-utils";
import TextAnnotator from "./TextAnnotator";

describe("Text Annotator", () => {
  let onTextAnnotation: Mock;

  beforeEach(() => {
    onTextAnnotation = vitest.fn();
  });

  it("should render a ready only text annotator", () => {
    render(
      <TextAnnotator
        annotatedTexts={[]}
        id="editor"
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
          { id: "editor", endIndex: 3, startIndex: 0, text: "def" },
          { id: "editor", endIndex: 11, startIndex: 8, text: "text" },
        ]}
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
          { id: "editor", endIndex: 19, startIndex: 14, text: "text" },
        ]}
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
      endIndex: 5,
      id: "editor",
      startIndex: 0,
      text: "this ",
    });
  });
  it("should not call onAnnotateText when the selected text is empty", async () => {
    render(
      <TextAnnotator
        annotatedTexts={[]}
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
      { offset: 0 },
      { keys: "[/MouseLeft]" },
    ]);

    expect(onTextAnnotation).not.toHaveBeenCalled();
  });
});
