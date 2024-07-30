import { Add, Info } from "@mui/icons-material";
import { Box, Button, Divider, Tooltip, Typography } from "@mui/material";
import { produce } from "immer";
import { AsyncState } from "../reducers/asyncState";
import { AdditionalInfo, DocumentBaseInfo } from "../types/api";
import { Styles } from "../types/styles";
import { AdditionalInformationInput } from "./AdditionalInformationInput";
import { LoadingSpinner } from "./LoadingSpinner";

const styles: Styles = {
  container: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  infoListBox: { display: "flex", flexDirection: "column", gap: "20px" },
  headerBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
};

type AdditionalInfoContainerProps = {
  additionalInfoList: AdditionalInfo[];
  status: AsyncState<unknown>["status"];
  filesList: DocumentBaseInfo[];
  onAdditionalInfoChange(updatedList: AdditionalInfo[]): void;
};
export const AdditionalInfoContainer = ({
  additionalInfoList,
  status,
  filesList,
  onAdditionalInfoChange,
}: AdditionalInfoContainerProps) => {
  const handleAddAdditionalInfo = () => {
    onAdditionalInfoChange([
      { id: "", file_name: "", text: "" },
      ...additionalInfoList,
    ]);
  };

  const handleAdditionalInfoChange = (item: AdditionalInfo, index: number) => {
    const updatedAdditionalInfo = produce(additionalInfoList, (draft) => {
      if (index === -1) {
        draft.push(item);
      } else {
        draft.splice(index, 1, item);
      }
      return draft;
    });

    onAdditionalInfoChange(updatedAdditionalInfo);
  };

  const handleRemoveAdditionalInfo = (index: number) => {
    const updatedAdditionalInfo = produce(additionalInfoList, (draft) => {
      draft.splice(index, 1);
      return draft;
    });

    onAdditionalInfoChange(updatedAdditionalInfo);
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.headerBox}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Typography variant="h6">Reference Other Acts</Typography>
          <Tooltip
            describeChild
            title="Use this option to reference the related infromation from other acts."
          >
            <Info fontSize="small" />
          </Tooltip>
        </Box>
        <Button
          onClick={handleAddAdditionalInfo}
          variant="contained"
          size="small"
          sx={{ textTransform: "none" }}
          startIcon={<Add />}
        >
          Add New
        </Button>
      </Box>
      {status === "pending" && <LoadingSpinner />}
      {status === "resolved" && (
        <Box sx={styles.infoListBox}>
          {additionalInfoList.map((additionalInfo, index) => {
            return (
              <Box key={additionalInfo.id + index}>
                <AdditionalInformationInput
                  additionalInfo={additionalInfo}
                  filesList={filesList}
                  status={status}
                  onAdditionalInfoChange={(updatedInfo) =>
                    handleAdditionalInfoChange(updatedInfo, index)
                  }
                  onRemoveAdditionalInfo={() =>
                    handleRemoveAdditionalInfo(index)
                  }
                />
                <Divider />
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
