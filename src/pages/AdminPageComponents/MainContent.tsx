import React, { useEffect, useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { toast } from "react-toastify";
import CreateDatasetForm from '../../components/CreateDatasetForm';
import useAxios from '../../hooks/useAxios';
import { DatasetCard } from './DatasetCard';
import { LoadingSpinner } from "../../components/LoadingSpinner";

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

interface ContentProps {
  onDatasetClick: (dataset: any) => void;
}

export const MainContent: React.FC<ContentProps> = ({ onDatasetClick }) => {
  const { makeRequest } = useAxios<any[]>();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDatasetFormVisible, setIsCreateDatasetFormVisible] = useState(false);

  const fetchDatasets = async () => {
    try {
      const response = await makeRequest('/admin/datasets', 'GET');
      if (response) {
        // console.log(response);
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

  const handleCreateDatasetOpen = () => {
    setIsCreateDatasetFormVisible(true);
  };

  const handleCreateDatasetClose = (successStatus: Boolean) => {
    if (successStatus) {
      fetchDatasets();
    }
    setIsCreateDatasetFormVisible(false);
  };

  if(isLoading){
    return(<LoadingSpinner/>)
  }

  return (
    <Box sx={styles.main}>
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
      <CreateDatasetForm open={isCreateDatasetFormVisible} handleClose={(successStatus: Boolean) => handleCreateDatasetClose(successStatus)} />
      <Grid container spacing={3}>
        {(
          datasets.map((dataset, index) => (
            <Grid item xs={14} sm={6} md={4} key={index}>
              <DatasetCard {...dataset} onClick={() => onDatasetClick(dataset)} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};
