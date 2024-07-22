import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxios from "../hooks/useAxios";
import {
  QuestionAnswerVersionListResponse,
  SingleQuestionAnswer,
} from "../types/api";

type QnAVersionSelectorProps = {
  qnaId: string;
  onVersionChange(answerResult: SingleQuestionAnswer): void;
};

export const QnAVersionSelector = ({
  qnaId,
  onVersionChange,
}: QnAVersionSelectorProps) => {
  const [version, setVersion] = useState<number>();
  const [versionedAnswers, setVersionedAnswers] = useState<
    SingleQuestionAnswer[]
  >([]);
  const { makeRequest } = useAxios<QuestionAnswerVersionListResponse>();

  useEffect(() => {
    async function getAllVersions() {
      try {
        const response = await makeRequest(`/user/qna/${qnaId}`, "GET");
        setVersionedAnswers(response.qna);
        const totalVersions = response.qna.length;
        if (totalVersions > 0) {
          setVersion(response.qna[0].version_number);
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    }

    getAllVersions();
  }, [qnaId]);

  return (
    <FormControl sx={{ width: "180px" }}>
      <InputLabel>Version</InputLabel>
      <Select
        label="Choose version"
        size="small"
        data-testid="version-selector"
        onChange={(event) => {
          const version = event.target.value;
          const answer = versionedAnswers.find(
            (v) => v.version_number === Number(version)
          );
          setVersion(Number(version));
          onVersionChange(answer!);
        }}
        value={version ?? ""}
      >
        {versionedAnswers.map((version) => {
          return (
            <MenuItem
              key={version.version_number}
              value={version.version_number}
            >
              {`Version ${version.version_number}`}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
