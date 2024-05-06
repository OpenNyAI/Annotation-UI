import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getData } from "../../api/apiRequest";

interface PageData {
  id: number;
  title: string;
  content: string;
}

export const Home = () => {
  const [apiData, setApiData] = useState<PageData[]>([]);

  useEffect(() => {
    getData().then(setApiData);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "55vh",
        width: "100%",
        maxWidth: "3xl",
        borderRadius: 8,
        border: (theme) =>
          `1px solid ${theme.palette.mode === "light" ? "#e0e0e0" : "#424242"}`,
        "&:last-child": {
          marginTop: 2,
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 4,
        }}
      >
        <Box sx={{ spaceY: 6 }}>
          {apiData.map((item) => (
            <Box key={item.id}>
              <Typography
                variant="h2"
                sx={{ fontSize: "2xl", fontWeight: "bold" }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                {item.content}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
