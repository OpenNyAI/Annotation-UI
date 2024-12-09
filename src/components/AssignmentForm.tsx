/*The AssignmentForm is designed for assigning roles and type details to entities, such as annotators, reviewers etc. 
It dynamically handles different assignment types through customizable configurations, ensuring flexibility for various use cases. 
The form allows users to select entities from a list for specific types, and display in chip.
It integrates with backend APIs to submit data.*/

/*The AssignmentForm is more suitable than AnnotatorReviewerAssignmentForm due to its flexibility and ability to handle different scenarios, 
the AnnotatorReviewerForm is simpler and more focused for that specific task 
whereas AssignmentForm can handle multiple types of assignments at a single time and provides more dynamic option
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
interface AssignmentFormProps {
  additionalData: AdditionalData; // Additional data like user_name, user_id, documentID
  open: boolean; // Tracks if the form is opened
  handleClose: (successStatus: boolean) => void; 
  availableEntities: Entity[]; // List of available people (entities) for assignment
  type: string; // Type of assignment (e.g., annotator, reviewer)
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

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  additionalData,
  open, // Tracks if the form is opened
  handleClose, // Handles closure of the form
  availableEntities, // List of available people (entities)
  type, // Handles the type of assignment (annotator, reviewer, etc.)
  submitUrl, // API URL for form submission
  requestMethod, // HTTP method for request (GET, POST, etc.)
}) => {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null); // State to track selected entity
  const { makeRequest, status } = useAxios(); // Custom hook to handle API requests

  // Config object for different assignment types (annotator, reviewer, etc.)
  const config = {
    annotator: {
      title: 'Configure Annotator',
      successMessage: 'Annotator assigned successfully!',
      errorMessage: 'Failed to assign annotator',
      submitButtonLabel: 'Assigned Annotator',
    },

    reviewer: {
      title: 'Configure Reviewer',
      successMessage: 'Reviewer assigned successfully!',
      errorMessage: 'Failed to assign reviewer',
      submitButtonLabel: 'Assigned Reviewer',
    },
  };

  // Default config if no matching type is found
  const currentConfig = config[type as keyof typeof config] || {
    title: 'Configure Default',
    successMessage: 'Default assigned successfully!',
    errorMessage: 'Failed to assign default',
    submitButtonLabel: 'Assigned Default',
  };

  // Reset selected entity when form is opened
  useEffect(() => {
    if (open) {
      setSelectedEntity(null);
    }
  }, [open]);

  // Function to handle entity selection
  const handleSelectEntity = (entity: Entity) => {
    if (!selectedEntity) {
      setSelectedEntity(entity);
    }
  };

  // Function to handle entity removal (deselecting an entity)
  const handleRemoveEntity = (entity: Entity | null) => {
    setSelectedEntity(null);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!selectedEntity) {
      toast.error(`Please select an option for ${type}`);
      return;
    }

    // Prepare the data object for DB based on the type
    let data = {};
    if (type === "annotator" || type === "reviewer") {
      data = [{
        type,
        document_id: additionalData.documentID,
        user_id: selectedEntity?.id,
      }];
    } else {
      data = [{}];
    }

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
        <Typography variant="h6" align="center">{type}</Typography> {/* Display type of assignment */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
          {/* Render a list of available entities as clickable chips */}
          {availableEntities.map((entity) => (
            <Chip
              key={entity.id}
              label={entity.name}
              onClick={() => handleSelectEntity(entity)} // Select an entity when clicked
              style={{ margin: '5px', color: 'black', backgroundColor: 'azure' }}
              clickable
              color={selectedEntity?.id === entity.id ? 'primary' : 'default'} // Highlighting the selected entity
            />
          ))}
          
          {/* Show the selected entity with a Delete option */}
          {selectedEntity && (
            <Chip
              key={selectedEntity.id}
              label={selectedEntity.name}
              onDelete={() => handleRemoveEntity(selectedEntity)} // Remove the entity from selection
              style={{ margin: '5px', backgroundColor: '#2196F3', color: 'white' }}
              color="primary"
            />
          )}
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

export default AssignmentForm;
