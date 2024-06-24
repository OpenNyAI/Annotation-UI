import { Box, Button, Typography } from "@mui/material";
import { AnswersResult } from "../types/api";
import { Styles } from "../types/styles";
import { QnAVersionSelector } from "./QnAVersionSelector";

type ReviewAnswersHeaderProps = {
  currentQuestion: number;
  currenQuestionId: string;
  fileName: string;
  totalQuestions: number;
  reviewedUser?: string;
  onPrevQuestion(): void;
  onNextQuestion(): void;
  onVersionUpdate(answerResult: AnswersResult): void;
};

const styles: Styles = {
  headerBox: {
    paddingX: "24px",
    display: "flex",
    gap: "16px",
    alignItems: "center",
    height: "80px",
  },
};

export const ReviewAnswersHeader = ({
  currentQuestion,
  currenQuestionId,
  fileName,
  totalQuestions,
  reviewedUser,
  onNextQuestion,
  onPrevQuestion,
  onVersionUpdate,
}: ReviewAnswersHeaderProps) => {
  return (
    <Box sx={styles.headerBox}>
      <Box>
        <Typography variant={"h6"} textAlign={"center"}>
          {`${fileName} (${currentQuestion + 1}/${totalQuestions})`}
        </Typography>
        {reviewedUser && (
          <Typography variant={"subtitle2"} textAlign={"center"}>
            {`Last reviewed by ${reviewedUser}`}
          </Typography>
        )}
      </Box>
      <QnAVersionSelector
        qnaId={currenQuestionId}
        onVersionChange={onVersionUpdate}
      />

      <Box sx={{ gap: "12px", display: "flex", ml: "auto" }}>
        <Button
          variant="contained"
          size="small"
          data-testid="prevBtn"
          disabled={currentQuestion === 0}
          onClick={onPrevQuestion}
        >
          Prev
        </Button>
        <Button
          variant="contained"
          size="small"
          data-testid="nextBtn"
          disabled={currentQuestion === totalQuestions - 1}
          onClick={onNextQuestion}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};
