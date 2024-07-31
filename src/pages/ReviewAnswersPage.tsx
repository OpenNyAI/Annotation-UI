import { Box, Button, Divider, Typography } from "@mui/material";
import { useEffect, useMemo, useReducer } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AdditionalInfoContainer } from "../components/AdditionalInfoContainer";
import { ErrorMessage } from "../components/ErrorMessage";
import { IdeaAnswerInput } from "../components/IdealAnswerInput";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { QueryResults } from "../components/QueryResults";
import { QuestionMetaData } from "../components/QuestionMetadata";
import { ReviewAnswersHeader } from "../components/ReviewAnswersHeader";
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
  AdditionalInfo,
  DocumentBaseInfoResponse,
  DocumentQuestionAnswer,
  DocumentWithContent,
  FlagQueryRequest,
  SingleQuestionAnswer,
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
    flex: 1,
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
  questionBox: {
    padding: "8px",
    borderRadius: "8px",
    border: (theme) => `0.5px solid ${theme.palette.primary.light}`,
  },
};

const initialState: ReviewAnswerState = {
  question: "",
  questionCategory: "",
  questionType: "",
  annotatedTexts: [],
  resultChunks: [],
  qnaResponse: { qna: [] },
  currentQuestion: 0,
  additionalInfoList: [],
  idealAnswer: "",
};

export const ReviewAnswersPage = () => {
  const [
    {
      question,
      questionType,
      questionCategory,
      currentQuestion,
      annotatedTexts,
      resultChunks,
      additionalInfoList,
      qnaResponse,
      idealAnswer,
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
  const { makeRequest: flagQuery } = useAxios<string>();

  const { makeRequest: queryQnA, status: qnaStatus } =
    useAxios<DocumentQuestionAnswer>();

  const {
    makeRequest: getDocumentsListApi,
    status: documentsListStatus,
    data: documentsList,
  } = useAxios<DocumentBaseInfoResponse>();

  const isValidAdditionalInfo = useMemo(() => {
    return additionalInfoList?.some(
      (info) => info.id === "" || info.file_name === "" || info.text === ""
    );
  }, [additionalInfoList]);

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
        additional_answer: additionalInfoList,
        document_id: documentId!,
        chunk_result: resultChunks,
        generation_response: idealAnswer,
        query_type: questionType,
        query_category: questionCategory,
      };
      const response = await submitAnswer(
        `/user/qna/${questionId}`,
        "POST",
        answerBody
      );
      toast.success(response);
      const res = await queryQnA(`/user/qna/document/${documentId}`, "GET");
      dispatch({ type: "initialize-state", payload: res });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleFlagQuestion = async () => {
    const qna = qnaResponse?.qna[currentQuestion];
    if (!qna) {
      return;
    }
    try {
      const flagQueryBody: FlagQueryRequest = {
        qna_id: qna.id,
        is_flagged: !qna.flag,
      };
      const response = await flagQuery(
        `/user/flag-query`,
        "POST",
        flagQueryBody
      );
      toast.success(response);
      const res = await queryQnA(`/user/qna/document/${documentId}`, "GET");
      dispatch({ type: "initialize-state", payload: res });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAdditionalInfoChange = (updatedList: AdditionalInfo[]) => {
    dispatch({
      type: "update-additional-info-list",
      payload: { updatedInfo: updatedList },
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

  const handleVersionUpdate = (answerText: SingleQuestionAnswer) => {
    dispatch({ type: "update-answer-version", payload: answerText });
  };

  const handleIdealAnswerChange = (updatedAnswer: string) => {
    dispatch({
      type: "update-ideal-answer",
      payload: { updatedValue: updatedAnswer },
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

  useEffect(() => {
    async function getDocumentsList() {
      try {
        await getDocumentsListApi(`/user/document-titles`, "GET");
      } catch (err: any) {
        toast.error(err.message);
      }
    }

    getDocumentsList();
  }, []);

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
  const selectedQuestion = qnaResponse?.qna[currentQuestion];
  const isFlagged = !!selectedQuestion?.flag;
  const isDisabled =
    isFlagged ||
    (question ? annotatedTexts.length === 0 && isValidAdditionalInfo : true);

  return (
    fileContentStatus === "resolved" &&
    selectedQuestion && (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <ReviewAnswersHeader
          question={selectedQuestion}
          questionIndex={currentQuestion}
          fileName={fileContent?.file_name || ""}
          totalQuestions={qnaResponse?.qna.length || 0}
          onFlagQuestion={handleFlagQuestion}
          onNextQuestion={handleNextQuestion}
          onPrevQuestion={handlePrevQuestion}
          onVersionUpdate={handleVersionUpdate}
        />
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  flex: 1,
                }}
              >
                <Typography variant="subtitle1">Question</Typography>
                <Typography variant="body1" sx={styles.questionBox}>
                  {question}
                </Typography>
                <QuestionMetaData
                  questionCategory={questionCategory}
                  questionType={questionType}
                />
              </Box>
              <QueryResults
                results={resultChunks}
                annotatedTexts={annotatedTexts}
                onTextAnnotation={handleTextAnnotation}
              />
              <AdditionalInfoContainer
                additionalInfoList={additionalInfoList ?? []}
                status={documentsListStatus}
                filesList={documentsList?.documents ?? []}
                onAdditionalInfoChange={handleAdditionalInfoChange}
              />
              <IdeaAnswerInput
                value={idealAnswer}
                onChange={handleIdealAnswerChange}
              />
              <Button
                variant="contained"
                sx={{ width: "120px", mx: "auto" }}
                disabled={isDisabled}
                onClick={handleUpdateAnswer}
              >
                Submit
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
