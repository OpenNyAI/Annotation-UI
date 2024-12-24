/* QuesDatasetContent page gives detailed view that includes File name, Number of queries and Annotator name for a specific dataset.  
Users can click on a file to view queries associated with the filename through a separate component.  
The layout is designed to be user-friendly, offering a clear overview with a table format for easy navigation and data presentation.*/

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom'; // Use navigate and location hooks
import useAxios from '../../hooks/useAxios';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface FileInfo {
  id: string;
  annotator: string;
  reviewer: string;
  file_name: string;
  size: string;
  number_of_queries: string;
  status: string;
}

const styles = {
  container: {
    padding: '30px',
    color: 'black',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    position: 'sticky',
    top: '0',
    right: '0',
    backgroundColor: '#f5f5f5',
    padding: '10px 0',
  },
  datasetName: {
    color: 'black',
  },
  tableContainer: {
    boxShadow: 'none',
    borderRadius: '0px',
    marginTop: '20px',
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
  clickable: {
    color: '#2196F3',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export const QuesDatasetContent: React.FC = () => {
  const location = useLocation();  // Hook to get the current location and passed state
  const dataset = location.state?.dataset;  // Retrieve dataset from location state
  const navigate = useNavigate();  // Hook to navigate programmatically

  const { makeRequest } = useAxios<any>(); // Hook for making API requests
  const [files, setFiles] = useState<FileInfo[]>([]); // State for storing files info
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch dataset info from the API
  const fetchDatasetInfo = async () => {
    if (dataset) {
      try {
        const response: FileInfo[] = await makeRequest(`/admin/datasets/${dataset.id}`, 'GET');
        if (response) {
          setFiles(response); 
          setIsLoading(false); 
        }
      } catch (err) {
        toast.error(`Error fetching dataset info: ${err}`); // Handle error
        console.error('Error fetching dataset info:', err);
      }
    }
  };

  // Handle file selection to navigate to the QuesDetail page with datasetId and fileId
  const handleQuesDetailOpen = (file: FileInfo) => {
    // Navigate to the QuesDetail page, passing datasetId and fileId as state
    navigate(`/admin/qna/${dataset.id}/${file.id}`, {
      state: { dataset, file }  // Pass dataset and file in state
    });
  };

  // Effect hook to fetch dataset info when the component mounts
  useEffect(() => {
    fetchDatasetInfo(); // Call fetchDatasetInfo on component mount
  }, [dataset]); // Re-fetch data if dataset changes

  // Show loading spinner while fetching data
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="h5" sx={styles.datasetName}>
          {dataset?.name} {/* Display the name of the dataset */}
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table sx={{ border: '2px solid black' }}>
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell sx={styles.tableCellHeader}>Filename</TableCell>
              <TableCell sx={styles.tableCellHeader}>Number of Questions</TableCell>
              <TableCell sx={styles.tableCellHeader}>Annotator</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={styles.tableBody}>
            {files.map((file, index) => (
              <TableRow key={index}>
                <TableCell sx={styles.tableCell}>
                  <span
                    onClick={() => handleQuesDetailOpen(file)}  // Trigger navigation
                    style={styles.clickable}
                  >
                    {file.file_name}
                  </span>
                </TableCell>
                <TableCell sx={styles.tableCell}>{file.number_of_queries}</TableCell>
                <TableCell sx={styles.tableCell}>{file.annotator}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
