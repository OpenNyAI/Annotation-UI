import { Delete } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, MouseEventHandler, useMemo } from "react";
import { AsyncState } from "../reducers/asyncState";
import { AdditionalInfo, DocumentBaseInfo } from "../types/api";
import { Styles } from "../types/styles";

const styles: Styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "8px",
  },
  autoCompleteInputBox: { display: "flex", gap: "48px" },
  removeBtn: { textTransform: "none", fontSize: "small", padding: "16px" },
};

type AdditionalInformationInputProps = {
  status: AsyncState<unknown>["status"];
  additionalInfo?: AdditionalInfo;
  filesList: DocumentBaseInfo[];
  onAdditionalInfoChange(additionalInfo: AdditionalInfo): void;
  onRemoveAdditionalInfo(): void;
};

export const AdditionalInformationInput = ({
  status,
  additionalInfo,
  filesList,
  onAdditionalInfoChange,
  onRemoveAdditionalInfo,
}: AdditionalInformationInputProps) => {
  const handleDocumentChange = (document: DocumentBaseInfo | null) => {
    onAdditionalInfoChange({
      id: document?.id ?? "",
      file_name: document?.file_name ?? "",
      text: additionalInfo?.text ?? "",
    });
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    onAdditionalInfoChange({
      id: additionalInfo?.id ?? "",
      file_name: additionalInfo?.file_name ?? "",
      text,
    });
  };

  const handleRemoveAdditionalInfo: MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.stopPropagation();
    onRemoveAdditionalInfo();
  };

  const selectedDoc = useMemo(() => {
    return filesList.find((doc) => additionalInfo?.id === doc.id);
  }, [additionalInfo?.id, filesList]);

  return (
    <Box sx={styles.container}>
      <Autocomplete
        id="virtualize-demo"
        loading={status === "pending"}
        disableListWrap
        value={selectedDoc}
        sx={{ flex: 1, maxWidth: "sm" }}
        options={filesList}
        renderInput={(params) => (
          <Box sx={styles.autoCompleteInputBox}>
            <TextField
              {...params}
              placeholder="Choose Document"
              label={<Typography>Choose Document</Typography>}
              size="small"
            />
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              startIcon={<Delete />}
              sx={styles.removeBtn}
              onClick={handleRemoveAdditionalInfo}
            >
              Remove
            </Button>
          </Box>
        )}
        getOptionLabel={(option) => option.file_name}
        onChange={(_, val) => handleDocumentChange(val)}
      />
      <TextField
        type="text"
        size="small"
        minRows={3}
        maxRows={5}
        multiline={true}
        spellCheck
        value={additionalInfo?.text}
        placeholder="Enter Additional Info"
        label={<Typography>Enter Info</Typography>}
        onChange={handleTextChange}
      />
    </Box>
  );
};
