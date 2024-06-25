import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxios from "../hooks/useAxios";
import { AnswersResult } from "../types/api";

type QnAVersionSelectorProps = {
  qnaId: string;
  onVersionChange(answerResult: AnswersResult): void;
};

export const QnAVersionSelector = ({
  qnaId,
  onVersionChange,
}: QnAVersionSelectorProps) => {
  const [selectedVersion, setSelectedVersion] = useState<number>();
  const [versionedAnswers, setVersionedAnswers] = useState<AnswersResult[]>([]);
  const { makeRequest } = useAxios<{ qna: AnswersResult[] }>();

  useEffect(() => {
    async function getAllVersions() {
      try {
        const response = await makeRequest(`/user/qna/${qnaId}`, "GET");
        setVersionedAnswers(response.qna);
        const totalVersions = response.qna.length;
        if (totalVersions > 0) {
          setSelectedVersion(response.qna[totalVersions - 1].version_number);
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    }

    getAllVersions();
  }, []);

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
          setSelectedVersion(Number(version));
          onVersionChange(answer!);
        }}
        value={selectedVersion ?? ""}
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
