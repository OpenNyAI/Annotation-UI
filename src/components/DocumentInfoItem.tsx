import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  styled,
} from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { DocumentInfo } from "../types/api";

type DocumentInfoItemProps = DocumentInfo & {
  onClick(): void;
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[600],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#308fe8",
  },
}));

export const DocumentInfoItem = ({
  id,
  file_name,
  last_edited_by,
  max_questions,
  number_of_questions,
  onClick,
}: DocumentInfoItemProps) => {
  return (
    <Card
      data-testid={id}
      sx={{
        background: "#3b3b3b",
        "&:hover": {
          cursor: "pointer",
        },
      }}
      onClick={onClick}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <TextSnippetIcon fontSize={"small"} />
          <Typography noWrap>{file_name}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            alignItems: {
              md: "center",
            },
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {last_edited_by && (
            <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Typography>Last Edited by</Typography>
              <Avatar sx={{ height: "24px", width: "24px", fontSize: "16px" }}>
                {last_edited_by.charAt(0)}
              </Avatar>
            </Box>
          )}
          <Box
            sx={{
              flex: "1 0 auto",
              display: "flex",
              justifyContent: {
                md: "end",
              },
              alignItems: "center",
              gap: "16px",
            }}
          >
            <BorderLinearProgress
              sx={{ width: "200px", height: "8px", borderRadius: "48px" }}
              variant="determinate"
              value={(number_of_questions / max_questions) * 100}
            />
            <Typography
              textAlign={"right"}
            >{`${number_of_questions}/${max_questions}`}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
