import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ErrorMessage } from "../components/ErrorMessage";
import { LabelledInput } from "../components/LabelledInput";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AnnotationSummarySidePanel } from "../components/annotation/AnnotationSummarySidePanel";
import TextAnnotator, {
  TextAnnotation,
} from "../components/annotation/TextAnnotator";
import useAxios from "../hooks/useAxios";
import {
  ReviewAnswerState,
  reviewAnswersReducer,
} from "../reducers/reviewAnswers";
import {
  AnswersResult,
  DocumentWithContent,
  SubmitAnswerBody,
} from "../types/api";
import { Styles } from "../types/styles";

const styles: Styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    overflow: "scroll",
  },
  mainEditor: {
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
    height: "100%",
    boxSizing: "border-box",
    p: 3,
    gap: 2,
  },
  mainEditorBox: {
    border: (theme) => `0.5px solid ${theme.palette.primary.light}`,
    borderRadius: "8px",
    height: "50%",
  },
  resultsContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 2,
  },
  resultBox: {
    display: "flex",
    overflow: "scroll",
    flexDirection: "column",
    border: (theme) => `0.5px solid ${theme.palette.primary.light}`,
    borderRadius: "8px",
    mb: "16px",
    maxHeight: "340px",
  },
};

const initialState: ReviewAnswerState = {
  question: "",
  annotatedTexts: [],
  resultChunks: [],
  qnaResponse: { qna: [] },
  currentQuestion: 0,
};

export const ReviewAnswersPage = () => {
  const [
    {
      question,
      currentQuestion,
      annotatedTexts,
      resultChunks,
      additionalInfo,
      qnaResponse,
    },
    dispatch,
  ] = useReducer(reviewAnswersReducer, initialState);

  const { documentId } = useParams();

  const {
    makeRequest,
    data: fileContent,
    error: fileContentError,
    status: fileContentStatus,
  } = useAxios<DocumentWithContent>();

  const { makeRequest: submitAnswer } = useAxios<string>();

  const { makeRequest: queryQnA, status: qnaStatus } = useAxios<{
    qna: AnswersResult[];
  }>();

  const handleTextAnnotation = (annotatedText: TextAnnotation) => {
    dispatch({
      type: "add-annotated-text",
      payload: { newAnnotation: annotatedText },
    });
  };

  const handleDeleteTextAnnotation = (index: number) => {
    dispatch({
      type: "delete-annotated-text",
      payload: { index },
    });
  };

  const handleSelectTextAnnotation = (index: number) => {
    dispatch({
      type: "select-annotated-text",
      payload: { index },
    });
  };

  const handleUpdateAnswer = async () => {
    const questionId = qnaResponse?.qna[currentQuestion].id;
    if (!question && !questionId) {
      return;
    }
    try {
      const answerBody: SubmitAnswerBody = {
        query: question,
        annotated_text: annotatedTexts,
        additional_answer: additionalInfo,
        document_id: documentId!,
      };
      const response = await submitAnswer(
        `/user/qna/${questionId}`,
        "POST",
        answerBody
      );
      toast.success(response);
      try {
        const res = await queryQnA(`/user/qna/document/${documentId}`, "GET");
        dispatch({ type: "initialize-state", payload: res });
      } catch (err: any) {
        toast.error(err.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleQuestionChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "update-question",
      payload: { updatedQuestion: event.target.value },
    });
  };

  const handleAdditionalInfoChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "update-additional-info",
      payload: { updatedInfo: event.target.value },
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < qnaResponse!.qna.length) {
      dispatch({
        type: "update-current-question",
        payload: { questionIndex: currentQuestion + 1 },
      });
    }
  };

  const handlePrevQuestion = () => {
    dispatch({
      type: "update-current-question",
      payload: { questionIndex: currentQuestion - 1 },
    });
  };

  const handleUpdateAnnotations = (updatedAnnotations: TextAnnotation[]) => {
    dispatch({
      type: "update-annotations",
      payload: { updatedAnnotations },
    });
  };

  useEffect(() => {
    async function getDocumentContents() {
      try {
        await makeRequest(`/user/documents/${documentId}`, "GET");
      } catch (err: any) {
        toast.error(err.message);
      }
    }
    async function getQnA() {
      try {
        const response = await queryQnA(
          `/user/qna/document/${documentId}`,
          "GET"
        );
        dispatch({ type: "initialize-state", payload: response });
      } catch (err: any) {
        toast.error(err.message);
      }
    }

    getDocumentContents();
    getQnA();
  }, [documentId]);

  if (fileContentStatus === "pending" || qnaStatus === "pending") {
    return <LoadingSpinner />;
  }

  if (fileContentStatus === "error" || qnaStatus === "error") {
    return (
      <ErrorMessage
        title="Error while loading the document"
        subtitle={`Error : ${fileContentError?.message}`}
      />
    );
  }

  return (
    fileContentStatus === "resolved" && (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            alignItems: "center",
            height: "64px",
          }}
        >
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
          >{`${fileContent?.file_name} (${currentQuestion + 1}/${qnaResponse!.qna.length})`}</Typography>
          <IconButton
            data-testid="nextBtn"
            disabled={currentQuestion === qnaResponse!.qna.length - 1}
            onClick={handleNextQuestion}
          >
            <ChevronRight />
          </IconButton>
        </Box>
        <Box sx={styles.container}>
          <Box sx={styles.mainEditor}>
            <Box sx={styles.mainEditorBox}>
              <TextAnnotator
                id="main-editor"
                file_name={fileContent!.file_name}
                text={fileContent!.content}
                annotatedTexts={annotatedTexts.filter(
                  (item) => !item.source_text
                )}
                onTextAnnotation={handleTextAnnotation}
              />
            </Box>
            <Box sx={styles.resultsContainer}>
              <Box sx={{ display: "flex", gap: "16px" }}>
                <LabelledInput
                  label={<Typography variant="subtitle1">Question</Typography>}
                  size="small"
                  fullWidth
                  value={question}
                  placeholder="Enter your question"
                  type="text"
                  onChange={handleQuestionChange}
                />
              </Box>
              {resultChunks && resultChunks.length > 0 && (
                <Typography variant="subtitle1">Results</Typography>
              )}
              {resultChunks?.map((result, index) => {
                const id = "result_" + index;
                const editorAnnotatedTexts = annotatedTexts.filter(
                  (item) => item.source_text == result.chunk
                );
                return (
                  <Box key={index} sx={styles.resultBox}>
                    <TextAnnotator
                      id={id}
                      file_name={result.metadata.file_name}
                      text={result.chunk}
                      annotatedTexts={editorAnnotatedTexts}
                      onTextAnnotation={(annotation) =>
                        handleTextAnnotation({
                          ...annotation,
                          source_text: result.chunk,
                        })
                      }
                    />
                  </Box>
                );
              })}
              <LabelledInput
                label={
                  <Typography sx={{ mt: "auto" }} variant="subtitle1">
                    Additional Info
                  </Typography>
                }
                size="small"
                fullWidth
                value={additionalInfo}
                placeholder="Enter additional information"
                type="text"
                onChange={handleAdditionalInfoChange}
              />
              <Button
                variant="contained"
                sx={{ width: "120px", mx: "auto" }}
                disabled={
                  question
                    ? annotatedTexts.length === 0 && !additionalInfo
                    : true
                }
                onClick={handleUpdateAnswer}
              >
                Update
              </Button>
            </Box>
          </Box>
          {annotatedTexts.length > 0 && (
            <>
              <Divider orientation="vertical" />
              <AnnotationSummarySidePanel
                textAnnotations={annotatedTexts}
                onDelete={handleDeleteTextAnnotation}
                onSelect={handleSelectTextAnnotation}
                onUpdateSelections={handleUpdateAnnotations}
              />
            </>
          )}
        </Box>
      </Box>
    )
  );
};