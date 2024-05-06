import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getData } from "../../api/apiRequest";
import { theme } from "../../theming/theme";

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
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
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
              <Typography variant="h2">{item.title}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {item.content}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
