import React, { useState, ChangeEvent, DragEvent } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { CloudUpload, Delete, Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';

interface IndexDatasetFormProps {
  open: boolean;
  handleClose: (successStatus:Boolean) => void;
  datasetID : string;
}

const Input = styled('input')({
  display: 'none',
});

const IndexDatasetForm: React.FC<IndexDatasetFormProps> = ({ open, handleClose, datasetID }) => {
  const [OpenAIKey, setOpenAIKey] = useState<string>('');
  const [ChunkSize, setChunkSize] = useState<string>('');
  const [ChunkOverlapSize, setChunkOverlapSize] = useState<string>('');
  
  const { makeRequest, status, error } = useAxios();

  const handleSubmit = async () => {
  
  var data = {
    "dataset_id": datasetID,
    "openai_api_key": OpenAIKey,
    "chunk_size": ChunkSize,
    "chunk_overlap_size": ChunkOverlapSize
  }
  
    try {
      console.log(data);
      // Make a request to upload the dataset
      const response = await makeRequest(
        `admin/indexing`, 
        'POST', 
        data
      );
      
      toast.info('Dataset indexing successful');
      handleClose(true); 
    } catch (err: any) {
      // Handle error
      console.log(err);
      toast.error(`Error: ${err.message || 'Failed to index dataset'}`);
    }
  };
  

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{
      style: {
        overflowY: 'auto',
        overflowX: 'clip',
        backgroundColor: '#f5f5f5',
      },
    }}>
      <DialogTitle style={{ textAlign: 'center', color: 'black' }}>Index Dataset</DialogTitle>
      <IconButton
        edge="end"
        color="inherit"
        onClick={()=>handleClose(false)}
        aria-label="close"
        style={{ position: 'absolute', right: 10, top: 8, color: 'black' }}
      >
        <Close />
      </IconButton>
      <DialogContent style={{ overflowY: 'clip', color: 'black' }}>
        <TextField
          autoFocus
          margin="dense"
          label="OpenAI Key"
          type="text"
          fullWidth
          variant="outlined"
          placeholder="Enter OpenAI Key"
          value={OpenAIKey}
          onChange={(e) => setOpenAIKey(e.target.value)}
          InputProps={{ style: { color: 'black' } }}
          InputLabelProps={{ style: { color: 'black' } }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'black',
              },
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'black',
            },
          }}
        />
        <TextField
          margin="dense"
          label="Chunk Size"
          type="text"
          fullWidth
          variant="outlined"
          placeholder="Enter Chunk Size"
          value={ChunkSize}
          onChange={(e) => setChunkSize(e.target.value)}
          InputProps={{ style: { color: 'black' } }}
          InputLabelProps={{ style: { color: 'black' } }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'black',
              },
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
          }}
        />
        <TextField
          margin="dense"
          label="Chunk Overlap Size"
          type="text"
          fullWidth
          variant="outlined"
          placeholder="Enter Chunk Overlap Size"
          value={ChunkOverlapSize}
          onChange={(e) => setChunkOverlapSize(e.target.value)}
          InputProps={{ style: { color: 'black' } }}
          InputLabelProps={{ style: { color: 'black' } }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'black',
              },
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
          }}
          style={{ paddingBottom: '20px' }}
        />
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          style={{ width: '100%', backgroundColor: '#2196F3', fontWeight: '400', fontSize: '1rem' }}
          disabled={status === 'pending'}
        >
          {status === 'pending' ? 'Indexing...' : 'INDEX'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IndexDatasetForm;
