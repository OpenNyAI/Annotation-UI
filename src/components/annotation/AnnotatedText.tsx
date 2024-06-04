import { Delete } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React, { MouseEvent, useState } from "react";
import { Styles } from "../../types/styles";

type AnnotatedTextProps = {
  text: string;
  onDelete(): void;
  onClick(): void;
  onDragStart(): void;
  onDragEnter(): void;
  onDragEnd(): void;
};

const styles: Styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    padding: "16px",
    alignItems: "center",
    "& :hover": {
      cursor: "pointer",
    },
    justifyContent: "space-between",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#3B3B3B",
  },
  annotatedText: {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
    fontSize: "16px",
  },
};

export const AnnotatedText = ({
  text,
  onDelete,
  onClick,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: AnnotatedTextProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsHovered(false);
  };

  return (
    <Box
      component={"div"}
      style={{
        borderLeft: isHovered ? "4px solid #89CFF0" : "1px solid #e0e0e0",
        borderBottom: isHovered ? "4px solid #89CFF0" : "1px solid #e0e0e0",
      }}
      sx={styles.container}
      onClick={onClick}
      draggable
      onMouseLeave={() => setIsHovered(false)}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnd={() => {
        setIsHovered(false);
        onDragEnd();
      }}
    >
      <Typography sx={styles.annotatedText}>{text}</Typography>
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
