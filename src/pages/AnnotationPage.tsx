import { Send } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Typography } from "@mui/material";
import { produce } from "immer";
import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from "react";
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
  DocumentWithContent,
  QueryResult,
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
    maxHeight: "340px",
  },
  optionalText: { fontSize: { xs: "12px", md: "14px" } },
};

export const AnnotationPage = () => {
  const [question, setQuestion] = useState("");
  const [annotatedTexts, setAnnotatedTexts] = useState<TextAnnotation[]>([]);
  const [result, setResult] = useState<QueryResult>();
  const [additionalInfo, setAdditionalInfo] = useState("");

  const { documentId } = useParams();

  const {
    makeRequest,
    data: fileContent,
    error: fileContentError,
    status: fileContentStatus,
  } = useAxios<DocumentWithContent>();

  const { makeRequest: submitAnswer } = useAxios<string>();

  const { makeRequest: queryQuestion, status: queryStatus } =
    useAxios<QueryResult>();

  const handleTextAnnotation = (annotatedText: TextAnnotation) => {
    setAnnotatedTexts((prev) => [...prev, annotatedText]);
  };

  const handleDeleteTextAnnotation = (index: number) => {
    const updatedAnnotations = produce(annotatedTexts, (draft) => {
      draft.splice(index, 1);
      return draft;
    });
    setAnnotatedTexts(updatedAnnotations);
  };

  const handleSelectTextAnnotation = (index: number) => {
    const updatedAnnotations = produce(annotatedTexts, (draft) => {
      const updatedAnnotatedTexts = draft.map((annotatedTex, idx) => {
        return {
          ...annotatedTex,
          isFocused: idx === index,
        };
      });
      return updatedAnnotatedTexts;
    });
    setAnnotatedTexts(updatedAnnotations);
  };

  const resetQuery = () => {
    setQuestion("");
    setAnnotatedTexts([]);
    setAdditionalInfo("");
    setResult(undefined);
  };

  const handleSubmitAnswer = async () => {
    if (!question) {
      return;
    }
    try {
      const answerBody: SubmitAnswerBody = {
        query: result?.query ?? question,
        annotated_text: annotatedTexts,
        additional_answer: additionalInfo,
        document_id: documentId!,
        chunk_result: result?.chunks ?? [],
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

  const handleQueryQuestion = async () => {
    if (!question) {
      return;
    }
    try {
      const response = await queryQuestion(
        `/user/query?query=${question}`,
        "GET"
      );
      setResult(response);
      setAnnotatedTexts((prevState) =>
        prevState.filter((text) => !text.source_text)
      );
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleQuestionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleAdditionalInfoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAdditionalInfo(event.target.value);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      handleQueryQuestion();
    }
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
            <Box sx={{ display: "flex", gap: "16px" }}>
              <LabelledInput
                label={<Typography variant="subtitle1">Question</Typography>}
                size="small"
                fullWidth
                placeholder="Enter your question"
                type="text"
                onChange={handleQuestionChange}
                onKeyDown={handleKeyDown}
              />
              <LoadingButton
                variant="contained"
                loading={queryStatus === "pending"}
                disabled={!question}
                sx={{ textTransform: "none", alignSelf: "center", mt: "32px" }}
                endIcon={<Send />}
                onClick={handleQueryQuestion}
              >
                Query
              </LoadingButton>
            </Box>
            {queryStatus === "resolved" && (
              <Typography variant="subtitle1">Results</Typography>
            )}
            {result?.chunks.map((result, index) => {
              const id = "result_" + index;
              const editorAnnotatedTexts = annotatedTexts.filter(
                (item) => item.source_text === result.chunk
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
                  Additional Info{" "}
                  <Typography
                    sx={styles.optionalText}
                  >{`(Optional)`}</Typography>
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
                question ? annotatedTexts.length === 0 && !additionalInfo : true
              }
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
              onUpdateSelections={setAnnotatedTexts}
            />
          </>
        )}
      </Box>
    )
  );
};
