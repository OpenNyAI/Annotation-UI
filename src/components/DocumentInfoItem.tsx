import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  styled,
} from "@mui/material";
import React from "react";

type DocumentInfoItemProps = {
  id: string;
  onClick(): void;
  children: React.ReactNode;
};

// const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
//   height: 10,
//   borderRadius: 5,
//   [`&.${linearProgressClasses.colorPrimary}`]: {
//     backgroundColor: theme.palette.grey[600],
//   },
//   [`& .${linearProgressClasses.bar}`]: {
//     borderRadius: 5,
//     backgroundColor: "#308fe8",
//   },
// }));

const DocumentInfoItem = ({ id, onClick, children }: DocumentInfoItemProps) => (
  <Card
    data-testid={id}
    sx={{
      background: "#3b3b3b",
      "&:hover": {
        cursor: "pointer",
      },
    }}
    onClick={onClick}
  >
    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {children}
    </CardContent>
  </Card>
);

DocumentInfoItem.Title = ({ file_name }: { file_name: string }) => (
  <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
    <TextSnippetIcon fontSize={"medium"} />
    <Typography fontSize={"24px"}noWrap>{file_name}</Typography>
  </Box>
);

// DocumentInfoItem.LastEditedBy = ({
//   last_edited_by,
// }: {
//   last_edited_by: string;
// }) => (
//   <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
//     <Typography>Last Edited by</Typography>
//     <Avatar sx={{ height: "24px", width: "24px", fontSize: "16px" }}>
//       {last_edited_by.charAt(0)}
//     </Avatar>
//   </Box>
// );

DocumentInfoItem.TotalQna = ({number_of_questions}: {number_of_questions: number}) => (
  <Box sx={{ display: "flex", gap: "8px", alignItems: "center"}}>
    <QuestionAnswer fontSize={"medium"}/>
    <Typography fontSize={"15px"} noWrap>Total Number of Questions: {`${number_of_questions}`}</Typography>
  </Box> 
/* <Box
    sx={{
      flex: "1 0 auto",
      display: "flex",
      justifyContent: {
        md: "start",
      },
      alignItems: "center",
      gap: "8px",
    }}
  >
    <QuestionAnswer fontSize={"small"}/>
    <Typography textAlign={"left"}>Total Number of Questions: {`${number_of_questions}`}</Typography>
  </Box> */
);

DocumentInfoItem.Actions = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: {
        xs: "column",
        md: "row",
      },
      alignItems: {
        md: "center",
      },
      justifyContent: "space-between",
      gap: "16px",
    }}
  >
    {children}
  </Box>
);

export { DocumentInfoItem };
