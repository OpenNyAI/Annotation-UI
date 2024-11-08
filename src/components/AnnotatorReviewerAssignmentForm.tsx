import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Chip,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { toast } from 'react-toastify';
import useAxios from '../hooks/useAxios';

interface AnnotatorReviewerFormProps {
  open: boolean;
  handleClose: (successStatus: boolean) => void;
  availablePeople: UserRole[];
  documentID: string;
  type: string;
}

interface UserRole {
  id: string;
  name: string;
  username: string;
  roles: string[];
  email?: string;
}

const AnnotatorReviewerForm: React.FC<AnnotatorReviewerFormProps> = ({
  open, //Tracks if the form is opened
  handleClose, // Handles closure of the form
  availablePeople, //List of available people
  type, // Handles type of user
  documentID,
}) => {
  const [selectedPerson, setSelectedPerson] = useState<UserRole|null>(null);
  const { makeRequest, status } = useAxios();

  useEffect(() => {
    if (open) {
      setSelectedPerson(null);
    }
  }, [open]);

  const handleSelectPerson = (person: UserRole) => {
    if (!selectedPerson) {
      setSelectedPerson(person);
    }
  };

  const handleRemovePerson = (person: UserRole|null) => {
    setSelectedPerson(null);
  };

  const handleSubmit = async () => {

    if(!selectedPerson){
      toast.error(`Please select a person for ${type}`)
      return;
    }

    let data = {};

      data = [{
        type:type,
        document_id: documentID,
        user_id: selectedPerson?.id,
      }];
    
   

    try {
      await makeRequest(`admin/datasets/${documentID}/document-assignment`, 'POST', data);
      toast.info('Annotators and Reviewers assigned successfully');
      handleClose(true);
    } catch (err: any) {
      console.log(err);
      toast.error(`Error: ${err.message || 'Failed to assign annotators/reviewers'}`);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      PaperProps={{ style: { overflowY: 'auto', backgroundColor: '#f5f5f5' } }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle style={{ textAlign: 'center', color: 'black' }}>
        Configure Document
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => handleClose(false)}
          aria-label="close"
          style={{ position: 'absolute', right: 10, top: 8, color: 'black' }}
        >
          <Close/>
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ color: 'black' }}>
        <Typography variant="h6" align="center">{type}</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
          {availablePeople.map((user) => (
            <Chip
              key={user.id}
              label={user.username}
              onClick={() => handleSelectPerson(user)}
              style={{ margin: '5px', color: 'black', backgroundColor: 'azure' }}
              clickable
              color={selectedPerson?.id === user.id ? 'primary' : 'default'}
            />
          ))}
          
          {selectedPerson && (
          <Chip
            key={selectedPerson.id}
            label={selectedPerson.username}
            onDelete={() => handleRemovePerson(selectedPerson)}
            style={{ margin: '5px', backgroundColor: '#2196F3', color: 'white' }}
            color="primary"
          />
        )}
        </div>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          style={{ width: '100%', backgroundColor: '#2196F3', fontWeight: '400', fontSize: '1rem' }}
          disabled={status === 'pending'}
        >
          {status === 'pending' ? 'Assigning...' : 'SUBMIT'}
        </Button>
      </DialogActions>
      </Dialog>
  );
};

export default AnnotatorReviewerForm;
