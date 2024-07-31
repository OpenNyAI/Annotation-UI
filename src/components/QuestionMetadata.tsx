import { Box, Chip, Typography } from "@mui/material";

type QuestionMetaDataProps = {
  questionType: string;
  questionCategory: string;
};

export const QuestionMetaData = ({
  questionCategory,
  questionType,
}: QuestionMetaDataProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        pl: 1,
        pt: 2,
      }}
    >
      <Typography>
        Type: <Chip label={questionType} size="small" />
      </Typography>
      <Typography>
        Category: <Chip label={questionCategory} size="small" />
      </Typography>
    </Box>
  );
};
