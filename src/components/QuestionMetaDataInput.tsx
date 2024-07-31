import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useAxios from "../hooks/useAxios";
import { QuestionConfigResponse } from "../types/api";
import { LoadingSpinner } from "./LoadingSpinner";

type QuestionMetaDataInputProps = {
  queryType?: string;
  queryCategory?: string;
  onQueryTypeChange(updatedType: string): void;
  onQueryCategoryChange(updatedCategory: string): void;
};

export const QuestionMetaDataInput = ({
  queryCategory,
  queryType,
  onQueryCategoryChange,
  onQueryTypeChange,
}: QuestionMetaDataInputProps) => {
  const { makeRequest, data, error, status } =
    useAxios<QuestionConfigResponse>();

  useEffect(() => {
    async function getQuestionConfig() {
      try {
        await makeRequest("/user/question-config", "GET");
      } catch (err: any) {
        toast.error(err.message);
      }
    }

    getQuestionConfig();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {status === "pending" && <LoadingSpinner />}
      {status === "resolved" && (
        <>
          <FormControl>
            <FormLabel id="question-type" sx={{ fontSize: "16px" }}>
              Type
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="question-type"
              name="question-type"
              value={queryType}
              onChange={(e) => onQueryTypeChange(e.target.value)}
            >
              {data?.["question_type"].map((option) => {
                return (
                  <FormControlLabel
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    control={<Radio size="small" color="info" />}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel id="question-type" sx={{ fontSize: "16px" }}>
              Category
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="question-category"
              name="question-category"
              value={queryCategory}
              onChange={(e) => onQueryCategoryChange(e.target.value)}
            >
              {data?.["question_category"].map((option) => {
                return (
                  <FormControlLabel
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    control={<Radio size="small" color="info" />}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </>
      )}
    </Box>
  );
};
