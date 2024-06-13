import { Box, Typography } from "@mui/material";

type ErrorMessageProps = {
  title: string;
  subtitle: string;
};

export const ErrorMessage = ({
  title,
  subtitle: subTitle,
}: ErrorMessageProps) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography variant="subtitle1">{subTitle}</Typography>
    </Box>
  );
};
