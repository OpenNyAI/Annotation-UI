import Quill, { Range } from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";

export type TextSelection = {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
};

type TextSelectorProps = {
  id: string;
  text: string;
  selectedTexts: TextSelection[];
  onTextSelection(text: TextSelection): void;
};

const TextSelector = ({
  id,
  text,
  selectedTexts,
  onTextSelection,
}: TextSelectorProps) => {
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
        onTextSelection({
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
  }, [id]);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.setText(text);
      selectedTexts.forEach((selectedText) => {
        const { startIndex, text } = selectedText;
        quillRef.current!.formatText(
          startIndex,
          text.length,
          "background",
          "#009973"
        );
      });
    }
  }, [selectedTexts, text]);

  return <div id={id} style={{ fontSize: "16px", height: "100%" }}></div>;
};

export default TextSelector;
