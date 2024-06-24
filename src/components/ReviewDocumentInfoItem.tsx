import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Typography,
  styled,
} from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useState } from "react";
import { DocumentInfo } from "../types/api";
import { IOSSwitch } from "./IosSwitch";

type ReviewDocumentInfoItem = DocumentInfo & {
  onClick(): void;
  onReviewChange(isReviewed: boolean): void;
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[600],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#308fe8",
  },
}));

export const ReviewDocumentInfoItem = ({
  id,
  file_name,
  max_questions,
  status,
  number_of_questions,
  onClick,
  onReviewChange,
}: ReviewDocumentInfoItem) => {
  const [checked, setChecked] = useState(status === "Reviewed");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setChecked(event.target.checked);
    onReviewChange(event.target.checked);
  };
  return (
    <Card
      data-testid={id}
      sx={{
        background: "#3b3b3b",
        "&:hover": {
          cursor: "pointer",
        },
      }}
      onClick={onClick}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <TextSnippetIcon fontSize={"small"} />
          <Typography noWrap>{file_name}</Typography>
        </Box>
        <Box
          sx={{
            flex: "1 0 auto",
            display: "flex",

            alignItems: "center",
            gap: "16px",
          }}
        >
          <BorderLinearProgress
            sx={{ width: "200px", height: "8px", borderRadius: "48px" }}
            variant="determinate"
            value={(number_of_questions / max_questions) * 100}
          />
          <Typography
            textAlign={"right"}
          >{`${number_of_questions}/${max_questions}`}</Typography>
        </Box>
        <FormControlLabel
          sx={{ width: "280px" }}
          label={"Mark as Reviewed"}
          onClick={(e) => e.stopPropagation()}
          control={
            <IOSSwitch
              value={"start"}
              sx={{ mr: 1 }}
              checked={checked}
              color="info"
              onChange={handleChange}
              inputProps={{ "aria-label": `Doc_Status_${id}` }}
            />
          }
        />
      </CardContent>
    </Card>
  );
};
