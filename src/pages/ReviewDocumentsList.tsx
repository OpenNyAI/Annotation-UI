import { Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ReviewDocumentInfoItem } from "../components/ReviewDocumentInfoItem";
import useAxios from "../hooks/useAxios";
import { DocumentInfo } from "../types/api";

export const ReviewDocumentsList = () => {
  const navigate = useNavigate();

  const { makeRequest, data, status, error } = useAxios<{
    documents: DocumentInfo[];
  }>();

  const { makeRequest: updateDocumentStatus } = useAxios<string>();

  const handleDocumentStatusUpdate = async (
    id: string,
    isReviewed: boolean
  ) => {
    try {
      const response = await updateDocumentStatus(
        "/user/document-status",
        "POST",
        {
          document_id: id,
          document_status: isReviewed ? "Reviewed" : "OnReview",
        }
      );
      toast.success(response);
      await makeRequest("/user/review-documents", "GET");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    async function getDocuments() {
      try {
        await makeRequest("/user/review-documents", "GET");
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
        title="Error while fetching finished documents"
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
        <Typography variant="h6">Select a document to review</Typography>
      </Grid>
      {data?.documents.map((doc) => {
        return (
          <Grid item md={4} xs={6} key={doc.id}>
            <ReviewDocumentInfoItem
              {...doc}
              onClick={() => navigate(`/review/${doc.id}`)}
              onReviewChange={(isReviewed) => {
                handleDocumentStatusUpdate(doc.id, isReviewed);
              }}
            />
          </Grid>
        );
      })}
      {data?.documents.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="h6" textAlign={"center"}>
            No documents to review, please reach out to your admin.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
