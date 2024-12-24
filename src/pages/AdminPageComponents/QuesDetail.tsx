/* QuesDetail page serves as a detailed view for displaying and managing questions and answers (QnA) associated with a specific file within a dataset. 
It provides a comprehensive overview of the file, including metadata such as the file name, annotator, and number of queries. 
The main focus of the page is to show the questions and their corresponding answers, offering a clear, organized table format for easy viewing and analysis.*/

import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import useAxios from '../../hooks/useAxios'; 
import { toast } from 'react-toastify';  
import { LoadingSpinner } from '../../components/LoadingSpinner';  

// Interfaces for types used in the component
interface Answer {
  text: string;  
}

interface QnaItem {
  query: string;  // 
  answers: Answer[];  
}

interface QuesDetails {
  qna: QnaItem[];  // Array of queries and their associated answers
}

interface FileInfo {
  id: string;
  annotator: string;
  number_of_queries: string;
  reviewer: string;
  file_name: string;
  size: string;
  status: string;
}

// Styles object for the component's layout and appearance
const styles = {
  container: {
    color: 'black',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    position: 'sticky',
    top: '0',
    backgroundColor: '#f5f5f5',
    padding: '10px 0',
    zIndex: 0,
  },
  datasetName: {
    color: 'black',
  },
  tableContainer: {
    boxShadow: 'none',
    borderRadius: 0,
    marginTop: '10px',
    overflowX: 'auto',
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#F0F0F2',
  },
  tableBody: {
    backgroundColor: '#F3F3F3',
  },
  tableCellHeader: {
    fontWeight: 'bold',
    color: 'black',
    borderTop: '1px solid grey',
    borderLeft: '2px solid #333',
    borderRight: '2px solid #333',
  },
  tableCell: {
    color: 'black',
    borderTop: '2px solid lightGrey',
    borderLeft: '2px solid #333',
    borderRight: '2px solid #333',
  },
};

// Props type for the component, including dataset and file details
interface QuesDetailProps {
  dataset: {
    id: string;
    name: string;
    status: string;
    description?: string;
  };
  file: FileInfo;  // The selected file for which we are displaying details
}

export const QuesDetail: React.FC<QuesDetailProps> = ({ dataset, file }) => {
  const { makeRequest } = useAxios<QuesDetails>();  // API request hook
  const [Ques, setQues] = useState<QnaItem[]>([]);  // Store QnA data
  const [isLoading, setIsLoading] = useState(true);  // Loading state
  const [documentState, setDocumentState] = useState(file);  // Keep the current file details

  // Function to fetch QnA data for the selected file
  const fetchQues = async () => {
    try {
      const response = await makeRequest(`/admin/qna/document/${documentState.id}`, 'GET');
      if (response) {
        setQues(response.qna);  // Set the QnA data
      }
    } catch (err) {
      toast.error(`Error fetching Questions: ${err}`);
      console.error('Error fetching Questions:', err);
    } finally {
      setIsLoading(false);  // Disable the loading state
    }
  };

  // Fetch QnA data when the component is mounted
  useEffect(() => {
    fetchQues();
  }, []);  // Empty dependency array means it runs only once when the component mounts

  // Show a loading spinner while fetching the data
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={styles.container}>
      {/* Header Section */}
      <Box sx={styles.header}>
        <Typography variant="h5" sx={styles.datasetName}>
          {dataset.name}
        </Typography>
      </Box>

      {/* File Details Section */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h6">File Details</Typography><br></br>
        <Typography><strong>File Name:</strong> {file.file_name}</Typography><br></br>
        <Typography><strong>Annotator:</strong> {file.annotator || "No annotators assigned for this document"}</Typography><br></br>
        <Typography><strong>Number of Questions:</strong> {file.number_of_queries}</Typography><br></br>
      </Box>

      {/* Queries and Answers Table */}
      <Typography variant="h6">Queries and Answers:</Typography>
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table sx={{border: '2px solid black'}}>
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell sx={styles.tableCellHeader}>Query</TableCell>
              <TableCell sx={styles.tableCellHeader}>Answers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={styles.tableBody}>
            {Ques.length > 0 ? (
              Ques.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={styles.tableCell}>{item.query}</TableCell>
                  <TableCell sx={styles.tableCell}>
                    {item.answers.length > 0 ? (
                      item.answers.map((answer, ansIndex) => (
                        <Box key={ansIndex} sx={{ marginBottom: '5px' }}>
                          <Typography sx={{ color: '#2196F3', fontSize: '14px' }}>
                            {answer.text}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography>No answers available for this query</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} sx={styles.tableCell}>No Queries available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
