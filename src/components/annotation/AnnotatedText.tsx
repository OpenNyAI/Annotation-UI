import { Delete } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { MouseEvent } from "react";

type AnnotatedTextProps = {
  text: string;
  onDelete(): void;
  onClick(): void;
  onDragStart(): void;
  onDragEnter(): void;
  onDragEnd(): void;
};

export const AnnotatedText = ({
  text,
  onDelete,
  onClick,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: AnnotatedTextProps) => {
  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete();
  };

  return (
    <Box
      component={"div"}
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
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={onDragEnd}
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
      <IconButton
        data-testid="annotation-delete-button"
        size="small"
        onClick={handleDelete}
      >
        <Delete />
      </IconButton>
    </Box>
  );
};
