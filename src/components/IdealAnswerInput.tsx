import { Typography } from "@mui/material";
import { LabelledInput } from "./LabelledInput";
import { ChangeEvent } from "react";

type IdeaAnswerInputProps = {
  value?: string;
  onChange(updateVal: string): void;
};

export const IdeaAnswerInput = ({ value, onChange }: IdeaAnswerInputProps) => {
  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    onChange(text);
  };

  return (
    <LabelledInput
      label={<Typography variant="h6">Ideal Answer</Typography>}
      type="text"
      size="small"
      minRows={3}
      maxRows={5}
      multiline={true}
      spellCheck
      value={value}
      placeholder="Enter ideal answer"
      onChange={handleTextChange}
    />
  );
};
