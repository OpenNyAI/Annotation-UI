import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AdditionalInfoItem } from "../components/AdditionalInfoItem";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useAxios from "../hooks/useAxios";
import { DocumentQuestionAnswer } from "../types/api";
import { Styles } from "../types/styles";
import { QuestionMetaData } from "../components/QuestionMetadata";

const styles: Styles = {
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "24px",
    gap: "16px",
    boxSizing: "border-box",
  },
  textContainer: {
    padding: "8px",
    height: "100%",
    boxSizing: "border-box",
    overflowY: "scroll",
    whiteSpace: "pre-wrap",
    borderRadius: "8px",
    border: (theme) => `0.5px solid ${theme.palette.borderGrey}`,
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "10%",
  },
  additionalInfoContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "16px",
  },
  prevBtn: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    alignItems: "center",
  },
};

export const DocumentAnswers = () => {
  const { makeRequest, data, error, status } =
    useAxios<DocumentQuestionAnswer>();
  const { documentId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    async function getQnA() {
      try {
        await makeRequest(`/user/qna/document/${documentId}`, "GET");
      } catch (err: any) {
        toast.error(err.message);
      }
    }

    getQnA();
  }, [documentId]);

  if (status === "pending") {
    return <LoadingSpinner />;
  }

  if (status === "error") {
    return (
      <ErrorMessage
        title="Error while loading answers"
        subtitle={`Error : ${error?.message}`}
      />
    );
  }

  const handleNextQuestion = () => {
    if (currentQuestion < data!.qna.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion !== 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = data?.qna[currentQuestion];

  return (
    data && (
      <Box sx={styles.container}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "20%" }}>
          <Box sx={styles.prevBtn}>
            <IconButton
              data-testid="prevBtn"
              disabled={currentQuestion === 0}
              onClick={handlePrevQuestion}
            >
              <ChevronLeft />
            </IconButton>
            <Typography
              variant={"h6"}
              textAlign={"center"}
            >{`${question?.file_name} (${currentQuestion + 1}/${data.qna.length})`}</Typography>
            <IconButton
              data-testid="nextBtn"
              disabled={currentQuestion === data!.qna.length - 1}
              onClick={handleNextQuestion}
            >
              <ChevronRight />
            </IconButton>
          </Box>

          <Typography variant="h6">{`Question `}</Typography>
          <Typography
            data-testid="question-box"
            variant="subtitle1"
            sx={styles.textContainer}
          >
            {question?.query}
          </Typography>
          <QuestionMetaData
            questionCategory={question!.query_category}
            questionType={question!.query_type}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", height: "65%" }}>
          <Typography variant="h6">Answer</Typography>
          <Typography
            data-testid="answer-box"
            variant="subtitle1"
            sx={styles.textContainer}
          >
            {question!.answers.map((q) => q.text).join("\n\n")}
          </Typography>
        </Box>
        <Box sx={styles.additionalInfoContainer}>
          <Typography variant="h6">Referenced Acts</Typography>
          <Box
            data-testid="additional-info-box"
            sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {question?.additional_text?.length != 0 ? (
              question?.additional_text?.map((info, index) => {
                return (
                  <AdditionalInfoItem
                    key={info.id + index}
                    additionalInfo={info}
                    index={index + 1}
                  />
                );
              })
            ) : (
              <Typography variant="subtitle1" sx={{ pl: "24px" }}>
                No additional info
              </Typography>
            )}
          </Box>
        </Box>
        <Box>
          <Typography variant="h6">Ideal Answer</Typography>
          <Typography
            data-testid="ideal-answer-box"
            variant="subtitle1"
            sx={styles.textContainer}
          >
            {question!.generation_response}
          </Typography>
        </Box>
      </Box>
    )
  );
};
