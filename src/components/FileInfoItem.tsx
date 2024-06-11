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
export const FileInfoItem = () => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{ background: "#3b3b3b" }}
      onClick={() => navigate("/annotate/1")}
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
          <Typography>File Name</Typography>
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
          <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Typography>Last Edited by</Typography>
            <Avatar sx={{ height: "24px", width: "24px", fontSize: "16px" }}>
              N
            </Avatar>
          </Box>
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
