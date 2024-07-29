import AssistantIcon from "@mui/icons-material/Assistant";
import { Fab } from "@mui/material";

export const TallyFeedbackDialog = () => {
  return (
    <a href={import.meta.env.VITE_TALLY_FORM_URL}>
      <Fab
        color="primary"
        variant="extended"
        sx={{
          position: "fixed",
          textTransform: "none",
          bottom: 16,
          right: 16,
        }}
        aria-label="feedback"
      >
        <AssistantIcon sx={{ mr: "4px" }} /> Feedback
      </Fab>
    </a>
  );
};
