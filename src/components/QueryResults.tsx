import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { AnnotatedText, ResultChunk } from "../types/api";
import { Styles } from "../types/styles";
import TextAnnotator from "./annotation/TextAnnotator";

type QueryResultsProps = {
  results: ResultChunk[];
  annotatedTexts: AnnotatedText[];
  onTextAnnotation(annotatedText: AnnotatedText): void;
};

const styles: Styles = {
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
};

export const QueryResults = ({
  results,
  annotatedTexts,
  onTextAnnotation,
}: QueryResultsProps) => {
  const groupedQueryResults = useMemo(
    () =>
      results.reduce<Map<string, ResultChunk[]>>((prev, current) => {
        const val = prev.get(current.retriever_name);
        if (!val) {
          prev.set(current.retriever_name, [current]);
        } else {
          prev.set(current.retriever_name, [...val, current]);
        }
        return prev;
      }, new Map()),
    [results]
  );
  return (
    <>
      {!!groupedQueryResults && (
        <Typography variant="subtitle1">Results</Typography>
      )}
      {[...(groupedQueryResults?.entries() ?? [])].map(
        ([key, queryResults]) => {
          return (
            <Box key={key}>
              <Typography
                sx={{ mb: "16px" }}
                variant="subtitle1"
              >{`Retriever: ${key}`}</Typography>
              {queryResults.map((queryResult, index) => {
                const id = "result_" + key + index;
                const editorAnnotatedTexts = annotatedTexts.filter(
                  (item) => item.source_text === queryResult.chunk
                );
                return (
                  <Box key={index} sx={styles.resultBox}>
                    <TextAnnotator
                      id={id}
                      file_name={queryResult.metadata.file_name}
                      text={queryResult.chunk}
                      annotatedTexts={editorAnnotatedTexts}
                      onTextAnnotation={(annotation) =>
                        onTextAnnotation({
                          ...annotation,
                          source_text: queryResult.chunk,
                        })
                      }
                    />
                  </Box>
                );
              })}
            </Box>
          );
        }
      )}
    </>
  );
};
