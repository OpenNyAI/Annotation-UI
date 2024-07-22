import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionSummary, Box, Typography } from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import { useState } from "react";
import { AdditionalInfo } from "../types/api";
import { Styles } from "../types/styles";

const styles: Styles = {
  accordionContainer: {
    border: "1px solid gray",
    maxHeight: {
      xs: "240px",
      md: "420px",
    },
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  accordionDetails: {
    overflow: "scroll",
    maxHeight: {
      xs: "180px",
      md: "320px",
    },
  },
  text: {
    textOverflow: "ellipsis",
    whiteSpace: "pre-wrap",
  },
};

type AdditionalInfoItemProps = {
  index: number;
  additionalInfo: AdditionalInfo;
};

export const AdditionalInfoItem = ({
  index,
  additionalInfo,
}: AdditionalInfoItemProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Accordion
      expanded={isOpen}
      onChange={(_, expanded) => setIsOpen(expanded)}
      sx={styles.accordionContainer}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        sx={{ maxHeight: "80px", flexShrink: 0 }}
      >
        <Typography sx={{ width: "33%", flexShrink: 0 }}>
          {`${index}) ${additionalInfo.file_name}`}
        </Typography>
        {!isOpen && (
          <Box sx={{ overflow: "hidden", maxHeight: "48px" }}>
            <Typography sx={styles.text} noWrap>
              {additionalInfo.text}
            </Typography>
          </Box>
        )}
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        <Typography sx={styles.text}>{additionalInfo.text}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};
