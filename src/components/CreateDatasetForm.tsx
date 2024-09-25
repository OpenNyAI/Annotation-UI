import React, { useState, ChangeEvent, DragEvent } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { CloudUpload, Delete, Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';

interface CreateDatasetFormProps {
  open: boolean;
  handleClose: (successStatus:Boolean) => void;
}

const Input = styled('input')({
  display: 'none',
});

const UploadArea = styled('div')(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: '5px',
  borderColor: '#424242',
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  marginBottom: theme.spacing(2),
  backgroundColor: '#E0E0E0',
  paddingTop: '10px'
}));

const CreateDatasetForm: React.FC<CreateDatasetFormProps> = ({ open, handleClose }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [datasetName, setDatasetName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  const { makeRequest, status, error } = useAxios();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleFileDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setFiles([...files, ...Array.from(event.dataTransfer.files)]);
    }
  };

  const handleUploadClick = () => {
    document.getElementById('file-input')?.click();
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('dataset_name', datasetName);
    formData.append('dataset_description', description);

    files.forEach((file) => {
      formData.append('files', file);
    });
    console.log(formData);
    try {
      const response = await makeRequest(`admin/datasets?dataset_name=${datasetName}&dataset_description=${description}`, 'POST', formData);
      toast.info('Dataset upload is successful');
      handleClose(true);
    } catch (err: any) {
      toast.error(`Error: ${err.message || 'Failed to upload dataset'}`);
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
      <DialogTitle style={{ textAlign: 'center', color: 'black' }}>Create Dataset</DialogTitle>
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
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          placeholder="Enter dataset name"
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
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
          label="Description (optional)"
          type="text"
          fullWidth
          variant="outlined"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        <Typography>Upload Files</Typography>
        <UploadArea
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          Drag and drop your files here to upload <br /> or <br />click to select files!
        </UploadArea>
        <Input
          id="file-input"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        <List style={{ backgroundColor: 'white' }}>
          {files.map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={file.name} style={{ color: 'black' }} />
              <IconButton style={{ color: 'black' }} edge="end" aria-label="delete" onClick={() => handleFileDelete(index)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          style={{ width: '100%', backgroundColor: '#2196F3', fontWeight: '400', fontSize: '1rem' }}
          disabled={status === 'pending'}
        >
          {status === 'pending' ? 'Uploading...' : 'CREATE'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDatasetForm;
