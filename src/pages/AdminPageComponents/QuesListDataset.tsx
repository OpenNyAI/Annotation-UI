/* QuesListDataset page displays a list of datasets in a tabular format, allowing users to view key information such as the dataset name, description, and status.
  Each dataset name is clickable, and when clicked, it triggers a function (onDatasetClick) that can be used to view or 
  interact with more detailed information about the selected dataset.*/

import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { toast } from "react-toastify";
import useAxios from '../../hooks/useAxios';
import { LoadingSpinner } from "../../components/LoadingSpinner";

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

interface ContentProps {
  onDatasetClick: (dataset: any) => void;
}

export const QuestionListDataset: React.FC<ContentProps> = ({ onDatasetClick }) => {
  const { makeRequest } = useAxios<any[]>();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch datasets from the backend API
  const fetchDatasets = async () => {
    try {
      const response = await makeRequest('/admin/datasets', 'GET');
      if (response) {
        setDatasets(response);
      }
    } catch (err) {
      toast.error(`Error fetching datasets: ${err}`);
      console.error('Error fetching datasets:', err);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchDatasets();  // Fetch datasets when the component mounts
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="h5" sx={styles.datasetName}>
          Datasets List
        </Typography>
      </Box>
      
      {/* Table displaying datasets */}
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table sx={{border: '2px solid black'}}>
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell sx={styles.tableCellHeader}>Dataset Name</TableCell>
              <TableCell sx={styles.tableCellHeader}>Description</TableCell>
              <TableCell sx={styles.tableCellHeader}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={styles.tableBody}>
            {datasets.map((dataset, index) => (
              <TableRow key={index}>
                <TableCell sx={styles.tableCell}>
                  {/* Dataset name is clickable and triggers onDatasetClick */}
                  <span
                    onClick={() => onDatasetClick(dataset)}
                    style={styles.clickable}
                  >
                    {dataset.name}
                  </span>
                </TableCell>
                <TableCell sx={styles.tableCell}>{dataset.description}</TableCell>
                <TableCell sx={styles.tableCell}>{dataset.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
