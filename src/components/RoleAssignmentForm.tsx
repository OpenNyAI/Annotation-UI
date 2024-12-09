/*The RoleAssignmentForm component is designed for assigning roles to entities, with the flexibility to handle various assignment types like annotators and reviewers. 
It allows users to select entities from a list, displaying selected entities as clickable chips for easy selection and deselection. 
By integrating with backend APIs, the form ensures seamless data submission to update role assignments.
*/


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

// Interface for the component props
interface RoleAssignmentFormProps {
  additionalData: AdditionalData; // Additional data like user_name, user_id, documentID
  open: boolean; // Tracks if the form is opened
  handleClose: (successStatus: boolean) => void; 
  availableEntities: Entity[]; // List of available people (entities) for assignment
  submitUrl: string; // API URL for form submission
  requestMethod: "GET" | "POST" | "PUT" | "DELETE"; // HTTP method for the request
}

interface Entity {
  id: string; // ID of the entity
  name: string | string[]; // Name(s) of the entity
  roles?: string[]; // Optional roles associated with the entity
  email?: string; // Optional email of the entity
}

// Additional data for the form (user and document info)
interface AdditionalData {
  user_name?: string;
  user_id?: string;
  documentID?: string;
}

const RoleAssignmentForm: React.FC<RoleAssignmentFormProps> = ({
  additionalData,
  open, // Tracks if the form is opened
  handleClose, // Handles closure of the form
  availableEntities, // List of available people (entities)
  submitUrl, // API URL for form submission
  requestMethod, // HTTP method for request (GET, POST, etc.)
}) => {
  const [selectedRoles, setSelectedRoles] = useState<Entity[] | []>([]); // State to track selected entity
  const { makeRequest, status } = useAxios(); // Custom hook to handle API requests

  // Config object for different assignment types (annotator, reviewer, etc.)
  const currentConfig = {
      title: 'Configure Role',
      successMessage: 'Role assigned successfully!',
      errorMessage: 'Failed to assign role',
      submitButtonLabel: 'Assigned Role'
  };

  // Reset selected entity when form is opened
  useEffect(() => {
    if (open) {
      setSelectedRoles([]);
    }
  }, [open]);

  // Function to handle entity selection
  const handleSelectRole = (entity: Entity) => {
    if (selectedRoles.length <= 2 && !selectedRoles.some(role => role.id === entity.id)) {
      setSelectedRoles((prev) => [...prev, entity]);
    }
  };
  

  // Function to handle entity removal (deselecting an entity)
  const handleRemoveEntity = (entity: Entity | null) => {
    setSelectedRoles((prev)=>prev.filter(item=>item.id != entity?.id));
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!selectedRoles) {
      toast.error(`Please select a role`);
      return;
    }

    // Prepare the data object for DB based on the type

    const data = selectedRoles.map((role)=>({
        user_id:additionalData.user_id,
        role_id:role.id
    })) ;
    
    

    try {
      // Send the API request to submit the data
      await makeRequest(`${submitUrl}`, `${requestMethod}`, data);
      toast.info(currentConfig.successMessage); // Show success message
      handleClose(true); // Close the form and pass success status
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || currentConfig.errorMessage); // Show error message
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)} 
      PaperProps={{ style: { overflowY: 'auto', backgroundColor: '#f5f5f5' } }} // Customize dialog appearance
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle style={{ textAlign: 'center', color: 'black' }}>
        {currentConfig.title} {/* Display form title based on the selected type */}
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => handleClose(false)} // Close the dialog when the close button is clicked
          aria-label="close"
          style={{ position: 'absolute', right: 10, top: 8, color: 'black' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ color: 'black' }}>
        <Typography variant="h6" align="center">User Roles</Typography> {/* Display type of assignment */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
          {/* Render a list of available entities as clickable chips */}
          {availableEntities.map((entity) => (
            <Chip
              key={entity.id}
              label={entity.name}
              onClick={() => handleSelectRole(entity)} // Select an entity when clicked
              style={{ margin: '5px', color: 'black', backgroundColor: 'azure' }}
              clickable
            />
          ))}
          
          {/* Show the selected entity with a Delete option */}
          {selectedRoles.map((entity) => (
            <Chip
              key={entity.id}
              label={entity.name}
              onDelete={() => handleRemoveEntity(entity)}  // Remove the entity from selection
              style={{ margin: '5px', backgroundColor: '#2196F3', color: 'white' }}
              color="primary"
            />
          ))}

        </div>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        {/* Submit button to trigger the form submission */}
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          style={{ width: '100%', backgroundColor: '#2196F3', fontWeight: '400', fontSize: '1rem' }}
          disabled={status === 'pending'} // Disable the button while the request is pending
        >
          {status === 'pending' ? 'Assigning...' : 'SUBMIT'} {/* Show different text based on request status */}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleAssignmentForm;
