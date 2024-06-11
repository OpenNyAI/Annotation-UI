import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DocumentInfo } from "../types/api";

type DocumentInfoItemProps = DocumentInfo;

export const DocumentInfoItem = ({
  id,
  file_name,
  last_edited_by,
  max_questions,
  number_of_questions,
}: DocumentInfoItemProps) => {
  const navigate = useNavigate();
  return (
    <Card
      data-testid={id}
      sx={{
        background: "#3b3b3b",
        "&:hover": {
          cursor: "pointer",
        },
      }}
      onClick={() => navigate(`/annotate/${id}`)}
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
            <LinearProgress
              sx={{ width: "200px", height: "8px", borderRadius: "48px" }}
              variant="determinate"
              color="success"
              value={5}
              valueBuffer={25}
            />
            <Typography textAlign={"right"}>1/25</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
