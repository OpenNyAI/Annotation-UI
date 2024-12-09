/* This UserDetailContent page is designed to display a list of users along with their assigned roles in a tabular format. 
It fetches user data, including role information, from an API when the page loads.
It allows an admin to modify user roles by providing a clickable "Select" option for each user, 
which opens a form (AssignmentForm) where the admin can assign or update the user's roles. 
This page is intended for managing user roles.*/


import React, { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import useAxios from '../../hooks/useAxios';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import RoleAssignmentForm from '../../components/RoleAssignmentForm';

interface UserInfo {
  id: string;
  name: string;
  username: string;
  roles: string[];
}

interface Role {
  role_id: string;
  role_name: string;
}

interface Entity {
  id: string;
  name: string | string[];
  roles?: string[];
  email?: string;
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
    padding: '10px 0px',
    zIndex: '0',
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
  table: {
    minWidth: '650px',
    Border: '2px solid black',
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#F0F0F2',
  },
  tableBody: {
    backgroundColor: '#F3F3F3',
  },
  tableRow: {},
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

const UserDetailContent: React.FC = () => {
  const { makeRequest } = useAxios<any>();
  const [userRoles, setUserRoles] = useState<UserInfo[]>([]);
  const [isRoleFormVisible, setIsRoleFormVisible] = useState(false);
  const [availableRoleList, setAvailableRoleList] = useState<Entity[] | null>(null);
  const [roleType, setRoleType] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserInfo | null>(null);

  // Fetch roles info from localStorage and return them
  const fetchRolesInfoAndSet = (): Role[] | null => {
    const roles = JSON.parse(localStorage.getItem("AllRoles") || "[]") as Role[];
    return roles;
  };

  // Function to map role_id to role name
  const getRoleName = (role_id: string, roles: Role[]): string => {
    const role = roles.find(role => role.role_id === role_id);
    return role ? role.role_name : role_id; // Return role_id if no match is found
  };

  // Function to fetch user roles from the server
  const FetchUserRoles = async () => {
    try {
      const response: UserInfo[] = await makeRequest('/admin/user-roles', 'GET');
      if (response) {
        return response;
      }
      return [];
    } catch (err) {
      toast.error(`Error fetching user roles: ${err}`);
      return [];
    }
  };

  // Update local storage with latest user roles
  const UpdateRoles = async () => {
    if (localStorage.getItem('UserRoles')) {
      const userRoles = await FetchUserRoles();
      localStorage.setItem('UserRoles', JSON.stringify(userRoles));
    }
  };

  // Fetch user info and roles
  const fetchUserInfo = async () => {
    try {
      const response: UserInfo[] = await FetchUserRoles();
      if (response) {
        const roles = fetchRolesInfoAndSet() || [];

        const updatedUserRoles = response.map(user => ({
          ...user,
          roles: user.roles.map(role_id => getRoleName(role_id, roles)), // Map role_ids to names
        }));

        setUserRoles(updatedUserRoles); // Set the updated user roles
        const rolesAsEntities =
          roles?.filter(role => role.role_name !== 'Admin').map(role => ({ id: role.role_id, name: role.role_name })) ?? [];

        setAvailableRoleList(rolesAsEntities); // Set the available roles excluding 'Admin'
        setIsLoading(false);
      }
    } catch (err) {
      toast.error(`Error fetching user roles: ${err}`);
      console.error('Error fetching user roles:', err);
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Fetch user info when the component mounts
  },[]);

  // Handle role assignment form opening
  const handleAssignRoleOpen = (user: UserInfo, type: string) => {
    setRoleType(type); // Set the role assignment type (e.g. "roleSelector")
    setIsRoleFormVisible(true); // Show the role assignment form
    setSelectedUser(user); // Set the selected user for role assignment
  };

  // Handle closing the role assignment form and reload
  const handleAssignRoleClose = (successStatus: Boolean) => {
    if (successStatus) {
      fetchUserInfo();
      UpdateRoles(); 
    }
    setIsRoleFormVisible(false); 
  };

  // Delete all roles for a user
  const handleDeleteAllRoles = async (user: UserInfo) => {
    const data = [user.id]; // Prepare data with the user's ID
  
    try {
      await makeRequest('admin/user-roles', 'DELETE', data); // Send DELETE request to server
      await fetchUserInfo(); // Reload user info after deletion
      UpdateRoles(); // Update roles in local storage
      toast.info("All roles deleted successfully");
      setIsDeleteDialogOpen(false); // Close the delete dialog
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Some error occurred while deleting user roles");
      setIsDeleteDialogOpen(false); // Close the dialog on error
    }
  };

  // Open the delete confirmation dialog
  const openDeleteDialog = (user: UserInfo) => {
    setUserToDelete(user); 
    setIsDeleteDialogOpen(true);
  };

  // Close the delete confirmation dialog
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <Box sx={styles.container}>
      {/* Role Assignment Form */}
      <RoleAssignmentForm 
        open={isRoleFormVisible} 
        handleClose={(successStatus: Boolean) => handleAssignRoleClose(successStatus)} 
        availableEntities={availableRoleList ?? []} 
        additionalData={{user_name: "", user_id: selectedUser?.id, documentID: ""}} 
        submitUrl={'admin/user-roles'}
        requestMethod={'PUT'}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all roles for {userToDelete?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => userToDelete && handleDeleteAllRoles(userToDelete)} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box sx={styles.header}>
        <Typography variant="h5" sx={styles.datasetName}>
          {"Users List"}
        </Typography>
      </Box>

      {/* Table displaying user details */}
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table sx={{ border: '2px solid black' }}>
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell sx={styles.tableCellHeader}>Name</TableCell>
              <TableCell sx={styles.tableCellHeader}>Username</TableCell>
              <TableCell sx={styles.tableCellHeader}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={styles.tableBody}>
            {userRoles.map((user, index) => (
              <TableRow key={index}>
                <TableCell sx={styles.tableCell}>{user.name}</TableCell>
                <TableCell sx={styles.tableCell}>{user.username}</TableCell>
                <TableCell sx={{ ...styles.tableCell, maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'auto', textOverflow: 'ellipsis' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems:'center'}}>
                    <div style={{ flex: 1 }}>
                      {user.roles && user.roles.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px'}}>
                          {user.roles.map((role, index) => (
                            <span key={index}>{role}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Buttons for assigning roles and deleting roles */}
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
                      <button
                        onClick={() => handleAssignRoleOpen(user, "roleSelector")}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                          <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      <button
                        onClick={() => openDeleteDialog(user)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="24" height="24">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserDetailContent;
