import React, { useEffect, useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import CreateDatasetForm from '../../components/CreateDatasetForm';
import useAxios from '../../hooks/useAxios';
import { DatasetCard } from './DatasetCard';
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useNavigate } from 'react-router-dom';

const styles = {
  header: {
    color: 'black',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '20px',
    position: 'sticky',
    top: '0',
    right: '0',
    backgroundColor: '#f5f5f5',
    padding: '10px 0px',
    zIndex: '0'
  },
  main: {
    padding: '30px',
  }
};

interface Dataset {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
  status: string;
  description?: string;
}

export const MainContent: React.FC = () => {
  const navigate = useNavigate();  // Use navigate hook for routing
  const { makeRequest } = useAxios<any[]>();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDatasetFormVisible, setIsCreateDatasetFormVisible] = useState(false);

  // Fetch the list of datasets from the server
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
    fetchDatasets();
  }, []);

  // Handle opening the dataset creation form
  const handleCreateDatasetOpen = () => {
    setIsCreateDatasetFormVisible(true);
  };

  // Handle closing the dataset creation form
  const handleCreateDatasetClose = (successStatus: Boolean) => {
    if (successStatus) {
      fetchDatasets();
    }
    setIsCreateDatasetFormVisible(false);
  };

  // Handle the click on a dataset to navigate to DatasetInfoContent page
  const handleDatasetClick = (dataset: Dataset) => {
    // Navigate to the dataset details page and pass the dataset as state
    navigate(`/admin/dataset/${dataset.id}`, { state: { dataset } });
  };

  // Show loading spinner while datasets are being fetched
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={styles.main}>
      {/* Header with create dataset button */}
      <Box sx={styles.header}>
        <Button
          sx={{ backgroundColor: "#2196F3", fontWeight: '400' }}
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreateDatasetOpen}
        >
          + CREATE DATASET
        </Button>
      </Box>
      
      {/* Dataset creation form */}
      <CreateDatasetForm open={isCreateDatasetFormVisible} handleClose={handleCreateDatasetClose} />
      
      {/* Display the list of datasets */}
      <Grid container spacing={3}>
        {datasets.map((dataset) => (
          <Grid item xs={14} sm={6} md={4} key={dataset.id}>
            {/* Pass the dataset details and the click handler to DatasetCard */}
            <DatasetCard {...dataset} onClick={() => handleDatasetClick(dataset)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
