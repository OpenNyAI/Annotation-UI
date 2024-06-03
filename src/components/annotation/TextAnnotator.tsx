import Quill, { Range } from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";

export type TextAnnotation = {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
};

type TextAnnotatorProps = {
  id: string;
  text: string;
  annotatedTexts: TextAnnotation[];
  onTextAnnotation(text: TextAnnotation): void;
};

const TextAnnotator = ({
  id,
  text,
  annotatedTexts,
  onTextAnnotation,
}: TextAnnotatorProps) => {
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    const quillInstance = new Quill(`#${id}`, {
      modules: {
        toolbar: false,
      },
      readOnly: true,
    });

    quillInstance.root.innerHTML = text;
    quillRef.current = quillInstance;

    const handleTextSelection = (
      range: Range | null,
      _oldRange: Range | null,
      _source: string
    ): void => {
      if (range && range.length !== 0) {
        const text = quillInstance.getText(range);
        const { index, length } = range;
        onTextAnnotation({
          id,
          text,
          startIndex: index,
          endIndex: index + length,
        });
      }
    };

    quillInstance.on(Quill.events.SELECTION_CHANGE, handleTextSelection);

    return () => {
      quillInstance.off(Quill.events.SELECTION_CHANGE, handleTextSelection);
      quillInstance.setContents([]);
    };
  }, [id, text]);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.formatText(0, text.length, { background: "inherit" });
      annotatedTexts.forEach((selectedText) => {
        const { startIndex, text } = selectedText;
        quillRef.current!.formatText(
          startIndex,
          text.length,
          "background",
          "#009973"
        );
      });
    }
  }, [annotatedTexts, text]);

  return (
    <div
      id={id}
      data-testid={id}
      style={{ fontSize: "16px", height: "100%" }}
    ></div>
  );
};

export default TextAnnotator;
