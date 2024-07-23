import { Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DocumentInfoItem } from "../components/DocumentInfoItem";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useAxios from "../hooks/useAxios";
import { AppConfig } from "../Router";
import { DocumentInfo } from "../types/api";

export type DocumentsListProps = {
  app_state: AppConfig["app_state"];
};

export const DocumentsList = ({ app_state }: DocumentsListProps) => {
  const navigate = useNavigate();

  const { makeRequest, data, status, error } = useAxios<{
    documents: DocumentInfo[];
  }>();

  useEffect(() => {
    async function getDocuments() {
      try {
        await makeRequest("/user/documents", "GET");
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
        title="Error while fetching the documents"
        subtitle={`Error : ${error?.message}`}
      />
    );
  }

  const handleDocumentClick = (doc: DocumentInfo) => {
    if (doc.number_of_questions < doc.max_questions) {
      navigate(`/annotate/${doc.id}`);
    }
  };

  return (
    <Grid
      container
      columnSpacing={4}
      sx={{ padding: "24px", position: "relative" }}
      rowSpacing={4}
    >
      <Grid item xs={12}>
        <Typography variant="h6">Select a document to Annotate</Typography>
      </Grid>
      {data?.documents.map((doc) => {
        return (
          <Grid item md={4} xs={6} key={doc.id}>
            <DocumentInfoItem
              id={doc.id}
              onClick={() => handleDocumentClick(doc)}
            >
              <DocumentInfoItem.Title file_name={doc.file_name} />
              {app_state !== "onboarding" && (
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
              )}
            </DocumentInfoItem>
          </Grid>
        );
      })}
      {data?.documents.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="h6" textAlign={"center"}>
            No Documents present, please contact your admin to add documents
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
