import { Box, Button, Divider } from "@mui/material";
import { useEffect, useMemo, useReducer } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AdditionalInfoContainer } from "../components/AdditionalInfoContainer";
import { ErrorMessage } from "../components/ErrorMessage";
import { IdeaAnswerInput } from "../components/IdealAnswerInput";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { QueryResults } from "../components/QueryResults";
import { QuestionInputForm } from "../components/QuestionInputForm";
import { AnnotationSummarySidePanel } from "../components/annotation/AnnotationSummarySidePanel";
import TextAnnotator, {
  TextAnnotation,
} from "../components/annotation/TextAnnotator";
import useAxios from "../hooks/useAxios";
import {
  annotateAnswersReducer,
  AnnotateAnswersState,
} from "../reducers/annotateAnswers";
import {
  AdditionalInfo,
  AnnotatedText,
  DocumentBaseInfoResponse,
  DocumentWithContent,
  SubmitAnswerBody,
} from "../types/api";
import { Styles } from "../types/styles";

const styles: Styles = {
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
  },
  mainEditor: {
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
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
    flex: "1",
    gap: 2,
  },
  resultBox: {
    display: "flex",
    overflow: "scroll",
    flexDirection: "column",
    border: (theme) => `0.5px solid ${theme.palette.primary.light}`,
    borderRadius: "8px",
    mb: "16px",
    minHeight: "240px",
    maxHeight: "340px",
  },
  optionalText: { fontSize: { xs: "12px", md: "14px" } },
};

const initialState: AnnotateAnswersState = {
  question: "",
  questionType: "",
  questionCategory: "",
  annotatedTexts: [],
  additionalInfoList: [],
  idealAnswer: "",
};

export const AnnotationPage = () => {
  const [state, dispatch] = useReducer(annotateAnswersReducer, initialState);
  const {
    question,
    annotatedTexts,
    questionCategory,
    questionType,
    result,
    additionalInfoList,
    idealAnswer,
  } = state;
  const { documentId } = useParams();

  const {
    makeRequest,
    data: fileContent,
    error: fileContentError,
    status: fileContentStatus,
  } = useAxios<DocumentWithContent>();

  const { makeRequest: submitAnswer } = useAxios<string>();

  const {
    makeRequest: getDocumentsListApi,
    status: documentsListStatus,
    data: documentsList,
  } = useAxios<DocumentBaseInfoResponse>();

  const handleTextAnnotation = (annotatedText: TextAnnotation) => {
    dispatch({
      type: "add-annotated-text",
      payload: { newAnnotation: annotatedText },
    });
  };

  const isValidAdditionalInfo = useMemo(() => {
    return additionalInfoList.every(
      (info) => info.id !== "" && info.file_name !== "" && info.text !== ""
    );
  }, [additionalInfoList]);

  const isValidQuestionInfo = useMemo(() => {
    return (
      question.length > 0 &&
      questionType.length > 0 &&
      questionCategory.length > 0
    );
  }, [question, questionCategory, questionType]);

  const handleDeleteTextAnnotation = (index: number) => {
    dispatch({ type: "delete-annotated-text", payload: { index } });
  };

  const handleSelectTextAnnotation = (index: number) => {
    dispatch({ type: "select-annotated-text", payload: { index } });
  };

  const resetQuery = () => {
    dispatch({ type: "reset", payload: { annotateAnswerState: initialState } });
  };

  const handleSubmitAnswer = async () => {
    if (!question) {
      return;
    }
    try {
      const answerBody: SubmitAnswerBody = {
        query: result?.query ?? question,
        query_type: questionType,
        query_category: questionCategory,
        annotated_text: annotatedTexts,
        additional_answer: additionalInfoList,
        document_id: documentId!,
        chunk_result: result?.chunks ?? [],
        generation_response: idealAnswer,
      };
      const response = await submitAnswer(`/user/submit`, "POST", answerBody);
      resetQuery();
      toast.success(response);
      try {
        await makeRequest(`/user/documents/${documentId}`, "GET");
      } catch (err: any) {
        toast.error(err.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateAnnotationsOrder = (annotations: AnnotatedText[]) => {
    dispatch({
      type: "update-annotations",
      payload: { updatedAnnotations: annotations },
    });
  };

  const handleIdealAnswerChange = (answer: string) => {
    dispatch({
      type: "update-ideal-answer",
      payload: { updatedValue: answer },
    });
  };

  const handleAdditionalInfoChange = (
    updatedAdditionalInfo: AdditionalInfo[]
  ) => {
    dispatch({
      type: "update-additional-info-list",
      payload: { updatedInfo: updatedAdditionalInfo },
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

    getDocumentContents();
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

  if (fileContentStatus === "pending") {
    return <LoadingSpinner />;
  }

  if (fileContentStatus === "error") {
    return (
      <ErrorMessage
        title="Error while loading the document"
        subtitle={`Error : ${fileContentError?.message}`}
      />
    );
  }

  const canSubmit =
    isValidQuestionInfo &&
    (annotatedTexts.length > 0 ||
      (additionalInfoList.length > 0 && isValidAdditionalInfo));

  return (
    fileContentStatus === "resolved" && (
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
            <QuestionInputForm state={state} dispatch={dispatch} />
            <QueryResults
              results={result?.chunks ?? []}
              annotatedTexts={annotatedTexts}
              onTextAnnotation={handleTextAnnotation}
            />
            <AdditionalInfoContainer
              additionalInfoList={additionalInfoList}
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
              disabled={!canSubmit}
              onClick={handleSubmitAnswer}
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
              onUpdateSelections={handleUpdateAnnotationsOrder}
            />
          </>
        )}
      </Box>
    )
  );
};
