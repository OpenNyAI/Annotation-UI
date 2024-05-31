import { Delete } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { MouseEvent } from "react";

type SelectedTextProps = {
  text: string;
  onDelete(): void;
  onClick(): void;
};

export const SelectedText = ({
  text,
  onDelete,
  onClick,
}: SelectedTextProps) => {
  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        padding: "8px",
        alignItems: "center",
        "& :hover": {
          cursor: "pointer",
        },
        justifyContent: "space-between",
        border: (theme) => `0.5px solid ${theme.palette.borderGrey}`,
        borderRadius: "8px",
      }}
      onClick={onClick}
    >
      <Typography
        sx={{
          display: "-webkit-box",
          overflow: "hidden",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 3,
          fontSize: "16px",
        }}
      >
        {text}
      </Typography>
      <IconButton size="small" onClick={handleDelete}>
        <Delete />
      </IconButton>
    </Box>
  );
};
