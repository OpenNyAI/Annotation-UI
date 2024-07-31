import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import { ChangeEvent, Dispatch, KeyboardEventHandler } from "react";
import { toast } from "react-toastify";
import useAxios from "../hooks/useAxios";
import {
  AnnotateAnswersAction,
  AnnotateAnswersState,
} from "../reducers/annotateAnswers";
import { QueryResult } from "../types/api";
import { LabelledInput } from "./LabelledInput";
import { QuestionMetaDataInput } from "./QuestionMetaDataInput";

type QuestionInputFormProps = {
  state: AnnotateAnswersState;
  dispatch: Dispatch<AnnotateAnswersAction>;
};

export const QuestionInputForm = ({
  state: { question, questionCategory, questionType },
  dispatch,
}: QuestionInputFormProps) => {
  const { makeRequest: queryQuestion, status: queryStatus } =
    useAxios<QueryResult>();

  const handleQueryQuestion = async () => {
    if (!question) {
      return;
    }
    try {
      const response = await queryQuestion(
        `/user/query?query=${question}`,
        "GET"
      );
      dispatch({
        type: "update-query-result",
        payload: { result: response },
      });
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

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      handleQueryQuestion();
    }
  };

  const handleQueryCategoryChange = (updatedCategory: string) => {
    dispatch({
      type: "update-question-category",
      payload: { category: updatedCategory },
    });
  };
  const handleQueryTypeChange = (updatedType: string) => {
    dispatch({
      type: "update-question-type",
      payload: { type: updatedType },
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
        <LabelledInput
          label={<Typography variant="subtitle1">Question</Typography>}
          size="small"
          value={question}
          fullWidth
          spellCheck
          placeholder="Enter your question"
          type="text"
          onChange={handleQuestionChange}
          onKeyDown={handleKeyDown}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={queryStatus === "pending"}
          sx={{
            textTransform: "none",
            alignSelf: "center",
            mt: "32px",
          }}
          onClick={handleQueryQuestion}
        >
          Query
        </LoadingButton>
      </Box>
      <QuestionMetaDataInput
        queryCategory={questionCategory}
        queryType={questionType}
        onQueryCategoryChange={handleQueryCategoryChange}
        onQueryTypeChange={handleQueryTypeChange}
      />
    </Box>
  );
};
