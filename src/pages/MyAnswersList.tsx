import { Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DocumentInfoItem } from "../components/DocumentInfoItem";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useAxios from "../hooks/useAxios";
import { DocumentInfo } from "../types/api";
import { useAppConfig } from "../hooks/useAppConfig";

export const MyAnswersList = () => {
  const navigate = useNavigate();
  const { app_state } = useAppConfig();

  const { makeRequest, data, status, error } = useAxios<{
    documents: DocumentInfo[];
  }>();

  useEffect(() => {
    async function getDocuments() {
      try {
        await makeRequest("/user/users/documents", "GET");
      } catch (err: any) {
        toast.error(err.message);
      }
    }
    getDocuments();
  }, []);

  if (status === "pending") {
    return <LoadingSpinner />;
  }

  if (status === "error") {
    return (
      <ErrorMessage
        title="Error while fetching answered documents"
        subtitle={`Error : ${error?.message}`}
      />
    );
  }

  return (
    <Grid
      container
      columnSpacing={4}
      sx={{ padding: "24px", position: "relative" }}
      rowSpacing={4}
    >
      <Grid item xs={12}>
        <Typography variant="h6">Select a document to view Q&A</Typography>
      </Grid>
      {data?.documents.map((doc) => {
        return (
          <Grid item md={4} xs={6} key={doc.id}>
            <DocumentInfoItem
              id={doc.id}
              onClick={() => navigate(`/answers/${doc.id}`)}
            >
              <DocumentInfoItem.Title file_name={doc.file_name} />
                <DocumentInfoItem.Actions>
                  {doc.last_edited_by && (
                    <DocumentInfoItem.LastEditedBy
                      last_edited_by={doc.last_edited_by}
                    />
                  )}
                  <DocumentInfoItem.ProgressBar
                    number_of_questions={doc.number_of_questions}
                    max_questions={doc.max_questions}
                  />
                </DocumentInfoItem.Actions>
            </DocumentInfoItem>
          </Grid>
        );
      })}
      {data?.documents.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="h6" textAlign={"center"}>
            You have not submitted Q&A for any document, Please annotate the
            documents{" "}
            <Link
              to={"/"}
              style={{ textDecoration: "none", color: "burlywood" }}
            >
              here
            </Link>
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
