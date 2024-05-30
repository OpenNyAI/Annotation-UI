import { Box, Button, TextField, Typography } from "@mui/material";
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
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleClick = () => {
    console.log("Clicked next");
  };

  useEffect(() => {
    getData().then(setApiData);
  }, []);

  return (
    <Box sx={{ margin: "32px" }}>
      <Typography>Custom UI</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "55vh",
          maxWidth: "3xl",
          border: "1px solid",
          borderColor: theme.palette.borderGrey,
          borderRadius: "4px",
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: 4,
          }}
        >
          <Box>
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
      <Box
        sx={{
          marginTop: 5,
          borderRadius: "4px",
        }}
      >
        <TextField
          id="question"
          data-testid="question"
          label="Question"
          value={question}
          onChange={handleQuestionChange}
          variant="outlined"
          sx={{
            width: "100%",
          }}
        />
      </Box>
      <Box
        sx={{
          marginTop: 5,
          borderRadius: "4px",
        }}
      >
        <TextField
          id="answer"
          data-testid="answer"
          label="Answer"
          value={answer}
          onChange={handleAnswerChange}
          variant="outlined"
          sx={{
            width: "100%",
          }}
        />
      </Box>
      <Box
        sx={{
          marginTop: 5,
          borderRadius: "4px",
        }}
      >
        <Button
          data-testid="nextButton"
          variant="contained"
          type="submit"
          onClick={handleClick}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};
