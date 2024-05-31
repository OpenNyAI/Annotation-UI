import { Box, TextField, TextFieldProps } from "@mui/material";
import { ReactElement } from "react";

export type LabelledInputProps = {
  label: ReactElement;
} & Exclude<TextFieldProps, "label">;

export const LabelledInput = ({ label, sx, ...rest }: LabelledInputProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
      {label}
      <TextField
        {...rest}
        sx={[
          ...(Array.isArray(sx) ? sx : [sx]),
          {
            "& legend": { display: "none" },
            "& .MuiInputLabel-shrink": {
              opacity: 0,
              transition: "all 0.2s ease-in",
            },
          },
        ]}
      />
    </Box>
  );
};
