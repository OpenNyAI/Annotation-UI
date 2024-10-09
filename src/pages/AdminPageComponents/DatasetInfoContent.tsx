import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useAxios from '../../hooks/useAxios';
import { toast } from 'react-toastify';
import IndexDatasetForm from '../../components/IndexDatasetForm';
import { LoadingSpinner } from "../../components/LoadingSpinner";


interface DatasetInfoProps {
  dataset: {
    id: string;
    name: string;
    created_at: string;
    created_by: string;
    status: string;
    description?: string;
  };
  handleBack: () => void;
}

interface FileInfo {
  annotator : string;
  reviewer : string;
  file_name : string;
  size: string;
  status: string;
}

const styles = {
  container: {
    padding: '20px',
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
    padding: '10px 0px',
    zIndex: '0'
  },
  datasetName: {
    color: 'black',
  },
  indexButton: {
    backgroundColor: '#4285F4',
    color: 'white',
    '&:hover': {
      backgroundColor: '#3367D6',
    },
  },
  tableContainer: {
    boxShadow: 'none',
    borderRadius: '0px',
    marginTop: '20px',
  },
  table: {
    Border: '2px solid black',
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#F0F0F2',
  },
  tableBody: {
    backgroundColor: '#F3F3F3',
  },
  tableRow: {
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
  backButton: {
    marginBottom: 2,
    color: 'black',
    textTransform: 'none',
  },
};

export const DatasetInfo: React.FC<DatasetInfoProps> = ({ dataset, handleBack }) => {
  const { makeRequest } = useAxios<any>();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isIndexDatasetFormVisible, setIsIndexDatasetFormVisible] = useState(false);
  const [datasetState, setDatasetState] = useState(dataset);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDatasetInfo = async () => {
    setDatasetState(dataset);
    try {
      const response = await makeRequest(`admin/datasets/${datasetState.id}`, 'GET');
      if (response) {
        console.log(response);
        setFiles(response);
        setIsLoading(false);
      }
    } catch (err) {
      toast.error(`Error fetching dataset info: ${err}`);
      console.error('Error fetching dataset info:', err);
    }
  };

  useEffect(() => {
    fetchDatasetInfo();
  }, [datasetState.id]);

  const handleIndexDataset = () => {
    toast.info('Indexing dataset...');
  };
  const handleIndexDatasetOpen = () => {
    setIsIndexDatasetFormVisible(true);
  };

  const handleIndexDatasetClose = (successStatus: Boolean) => {
    if (successStatus) {
      fetchDatasetInfo();
      setDatasetState({...datasetState,status:"Indexed"});
    }
    setIsIndexDatasetFormVisible(false);
  };

  if(isLoading){
    return(    
      <LoadingSpinner/>
    );
  }

  return (
    <Box sx={styles.container}>
      {/* <Button onClick={handleBack} sx={styles.backButton}>
        Back to List
      </Button> */}
      <IndexDatasetForm open={isIndexDatasetFormVisible} handleClose={(successStatus:Boolean)=>handleIndexDatasetClose(successStatus)} datasetID={datasetState.id}/>
      <Box sx={styles.header}>
        <Typography variant="h5" sx={styles.datasetName}>
          {datasetState.name}
        </Typography>
        {datasetState.status!="Indexed" ?  <Button
          sx={{ backgroundColor: "#2196F3", fontWeight: '400' }}
          variant="contained"
          color="primary"
          size="large"
          onClick={handleIndexDatasetOpen}
        >
          INDEX DATASET
        </Button> : <h3>INDEXED</h3>
        }
        
      </Box>
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table sx={{border:'2px solid black'}}>
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell sx={styles.tableCellHeader}>Filename</TableCell>
              <TableCell sx={styles.tableCellHeader}>Size</TableCell>
              <TableCell sx={styles.tableCellHeader}>Status</TableCell>
              <TableCell sx={styles.tableCellHeader}>Annotator</TableCell>
              <TableCell sx={styles.tableCellHeader}>Reviewer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={styles.tableBody}>
            {files.map((file, index) => (
              <TableRow key={index}>
                <TableCell sx={styles.tableCell}>{file.file_name}</TableCell>
                <TableCell sx={styles.tableCell}>{file.size}</TableCell>
                <TableCell sx={styles.tableCell}>{file.status}</TableCell>
                <TableCell sx={styles.tableCell}>{file.annotator??'-'}</TableCell>
                <TableCell sx={styles.tableCell}>{file.reviewer??'-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};