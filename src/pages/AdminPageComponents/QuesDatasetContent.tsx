/* QuesDatasetContent page gives detailed view that includes File name, Number of queries and Annotator name for a specific dataset.  
Users can click on a file to view queries associated with the filename through a separate component.  
The layout is designed to be user-friendly, offering a clear overview with a table format for easy navigation and data presentation.*/

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useAxios from '../../hooks/useAxios';  
import { toast } from 'react-toastify';  
import { LoadingSpinner } from "../../components/LoadingSpinner";  
import { QuesDetail } from './QuesDetail';  

interface QuesDatasetInfoProps {
  dataset: {
    id: string;
    name: string;
    status: string;
    description?: string;
  };
  handleBack: () => void;  
}

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

export const QuesDatasetContent: React.FC<QuesDatasetInfoProps> = ({ dataset }) => {
  const { makeRequest } = useAxios<any>();  // Hook for making API requests
  const [files, setFiles] = useState<FileInfo[]>([]);  // State for storing files info
  const [isLoading, setIsLoading] = useState(true);  // Loading state
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);  // State for selected file

  // Fetch dataset info from the API
  const fetchDatasetInfo = async () => {
    try {
      const response: FileInfo[] = await makeRequest(`admin/datasets/${dataset.id}`, 'GET');
      if (response) {
        setFiles(response);  
        setIsLoading(false);  
      }
    } catch (err) {
      toast.error(`Error fetching dataset info: ${err}`);  
      console.error('Error fetching dataset info:', err);
    }
  };

  // Handle file selection to view details
  const handleQuesDetailOpen = (file: FileInfo) => {
    setSelectedFile(file); 
  };

  // Handle back button to go back to the dataset list view
  const handleBack = () => {
    setSelectedFile(null);  
  };

  // Effect to fetch dataset info on component mount
  useEffect(() => {
    fetchDatasetInfo();
  }, []);  

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={styles.container}>
      {selectedFile ? (
        <QuesDetail dataset={dataset} file={selectedFile} />
      ) : (
        <>
          <Box sx={styles.header}>
            <Typography variant="h5" sx={styles.datasetName}>
              {dataset.name}  {/* Display dataset name */}
            </Typography>
          </Box>
          <TableContainer component={Paper} sx={styles.tableContainer}>
            <Table sx={{border: '2px solid black'}}>
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
                        onClick={() => handleQuesDetailOpen(file)}  // Open file details on click
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
        </>
      )}
    </Box>
  );
};
