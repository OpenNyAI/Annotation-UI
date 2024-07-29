import AssistantIcon from "@mui/icons-material/Assistant";
import { Fab } from "@mui/material";

export const TallyFeedbackDialog = () => {
  const handleOpenTallyPopup = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Tally.openPopup(import.meta.env.VITE_TALLY_FORM_ID, {
      layout: "modal",
    });
  };

  return (
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
      onClick={handleOpenTallyPopup}
    >
      <AssistantIcon sx={{ mr: "4px" }} /> Feedback
    </Fab>
  );
};
