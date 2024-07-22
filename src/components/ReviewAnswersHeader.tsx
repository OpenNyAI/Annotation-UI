import { Flag } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { QuestionAnswer, SingleQuestionAnswer } from "../types/api";
import { Styles } from "../types/styles";
import { QnAVersionSelector } from "./QnAVersionSelector";

type ReviewAnswersHeaderProps = {
  question: QuestionAnswer;
  questionIndex: number;
  fileName: string;
  totalQuestions: number;
  onPrevQuestion(): void;
  onNextQuestion(): void;
  onFlagQuestion(): void;
  onVersionUpdate(answerResult: SingleQuestionAnswer): void;
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
  question,
  questionIndex,
  fileName,
  totalQuestions,
  onFlagQuestion,
  onNextQuestion,
  onPrevQuestion,
  onVersionUpdate,
}: ReviewAnswersHeaderProps) => {
  return (
    <Box sx={styles.headerBox}>
      <Box>
        <Typography variant={"h6"} textAlign={"center"}>
          {`${fileName} (${questionIndex + 1}/${totalQuestions})`}
        </Typography>
      </Box>
      <QnAVersionSelector
        qnaId={question.id}
        onVersionChange={onVersionUpdate}
      />
      <Button
        size="small"
        variant="contained"
        sx={{ textTransform: "none" }}
        startIcon={<Flag />}
        onClick={onFlagQuestion}
      >
        {!question.flag ? "Flag Answer" : "Unflag Answer"}
      </Button>
      <Box sx={{ gap: "12px", display: "flex", ml: "auto" }}>
        <Button
          variant="contained"
          size="small"
          data-testid="prevBtn"
          disabled={questionIndex === 0}
          onClick={onPrevQuestion}
        >
          Prev
        </Button>
        <Button
          variant="contained"
          size="small"
          data-testid="nextBtn"
          disabled={questionIndex === totalQuestions - 1}
          onClick={onNextQuestion}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};
