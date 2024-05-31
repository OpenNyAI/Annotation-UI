import { Box, Divider, Typography } from "@mui/material";
import { SelectedText } from "./SelectedText";
import { TextSelection } from "./TextSelector";

type SelectionSummarySidePanelProps = {
  textSelections: TextSelection[];
  onDelete(index: number): void;
  onSelect(index: number): void;
};

export const SelectionSummarySidePanel = ({
  textSelections,
  onDelete,
  onSelect,
}: SelectionSummarySidePanelProps) => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "30%",
        display: "flex",
        overflowY: "hidden",
        overflowX: "hidden",
        flexDirection: "column",
        padding: 3,
        gap: 1,
      }}
    >
      <Typography variant="h6" sx={{ textDecoration: "underline" }}>
        Selection Summary
      </Typography>
      <Box
        sx={{
          height: "60%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflow: "scroll",
        }}
      >
        {textSelections.map((selectedText, index) => {
          return (
            <SelectedText
              key={index}
              text={selectedText.text}
              onClick={() => onSelect(index)}
              onDelete={() => onDelete(index)}
            />
          );
        })}
      </Box>
      <Divider />
      <Typography variant="h6" sx={{ textDecoration: "underline" }}>
        Answer
      </Typography>
      <Box
        sx={{
          height: "40%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflow: "scroll",
        }}
      >
        <Typography
          sx={{
            whiteSpace: "pre-wrap",
            height: "100%",
            border: "0.5px solid grey",
            borderRadius: "8px",
            padding: 1,
            fontSize: "16px",
          }}
        >
          {textSelections.map((item) => item.text).join("\n\n")}
        </Typography>
      </Box>
    </Box>
  );
};
