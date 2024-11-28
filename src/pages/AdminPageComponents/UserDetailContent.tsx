/* This UserDetailContent page is designed to display a list of users along with their assigned roles in a tabular format. 
It fetches user data, including role information, from an API when the page loads.
It allows an admin to modify user roles by providing a clickable "Select" option for each user, 
which opens a form (AssignmentForm) where the admin can assign or update the user's roles. 
This page is intended for managing user roles.*/


import React, { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import useAxios from '../../hooks/useAxios';
import AssignmentForm from '../../components/AssignmentForm';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface UserInfo {
  id: string;
  name : string;
  username : string;
  roles : string[];
  }
  
interface Role {
  role_id: string;
  role_name: string;
}
  
interface Entity {
  id: string;
  name: string| string[];
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
    overflowX: 'auto',  // Enable horizontal scrolling in case of overflow
  },
  table: {
    minWidth: '650px',  // Set a minimum width to trigger overflow if necessary
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
  const [availableRoleList, setAvailableRoleList] = useState<Entity[]|null>(null);
  const [roleType,setRoleType] = useState<string|null>(null);
  const [selectedUser, setSelectedUser] = useState<UserInfo|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchRolesInfoAndSet = (): Role[] | null => {
    const roles = JSON.parse(localStorage.getItem("AllRoles") || "[]") as Role[];
    return roles;
  };
  
  const getRoleName = (role_id: string, roles: Role[]): string => {
    const role = roles.find(role => role.role_id === role_id);
    return role ? role.role_name : role_id; // Return role_id if no match is found
  };
  
  // Function to fetch and update roles in localStorage

  const FetchUserRoles = async ()=>{
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
    
  }


  const UpdateRoles = async () => {

    if (localStorage.getItem('UserRoles')) {
        const userRoles = await FetchUserRoles();
        localStorage.setItem('UserRoles', JSON.stringify(userRoles));

    }
  };

  const fetchUserInfo = async () => {
    try {
      const response: UserInfo[] = await FetchUserRoles();
      if (response) {
        const roles = fetchRolesInfoAndSet() || []; // Get roles from localStorage

        const updatedUserRoles= response.map(user => ({
          ...user,
          roles: user.roles.map(role_id => getRoleName(role_id, roles)), // Map role_id to role_name
        }));

        setUserRoles(updatedUserRoles);
        const rolesAsEntities = 
          roles?.filter(role => role.role_name !== 'Admin').map(role => ({ id: role.role_id, name: role.role_name })) ?? [];// Converting Roles(excluding Admin Role) to entityType to pass it to AssignmentForm 

        setAvailableRoleList(rolesAsEntities);
        setIsLoading(false);
      }
    } catch (err) {
      toast.error(`Error fetching user roles: ${err}`);
      console.error('Error fetching user roles:', err);
    }
  };
  
  useEffect(() => {
    fetchUserInfo();
  },[]);
  const handleAssignRoleOpen = (userfile: UserInfo, type: string) => {
    
    setRoleType(type);
    setIsRoleFormVisible(true);
    setSelectedUser(userfile);
  };

  const handleAssignRoleClose = (successStatus: Boolean)=>{
        if (successStatus) {
          fetchUserInfo();
          UpdateRoles();
        }
        setIsRoleFormVisible(false);
  };

  if(isLoading){
    return(    
      <LoadingSpinner/>
    );
  }

  return (
    <Box sx={styles.container}>
      <AssignmentForm open={isRoleFormVisible} 
        handleClose={(successStatus: Boolean) => handleAssignRoleClose(successStatus)} 
        availableEntities={availableRoleList??[]}
        type={roleType ?? ""} 
        additionalData={{user_name:"",user_id:selectedUser?.id,documentID:""}} 
        submitUrl={'admin/user-roles'}
        requestMethod={'PUT'}/>
      <Box sx={styles.header}>
        <Typography variant="h5" sx={styles.datasetName}>
          {"Users List"}
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table sx={{border:'2px solid black'}}>
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell sx={styles.tableCellHeader}>Name</TableCell>
              <TableCell sx={styles.tableCellHeader}>Username</TableCell>
              <TableCell sx={styles.tableCellHeader}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={styles.tableBody}>
            {userRoles.map((file, index) => (
              <TableRow key={index}>
              <TableCell sx={styles.tableCell}>{file.name}</TableCell>
              <TableCell sx={styles.tableCell}>{file.username}</TableCell>
              <TableCell sx={styles.tableCell}>
                {file.roles ? <div style={{display:'flex', justifyContent:'space-between'}}>{file.roles} {<svg onClick={()=>handleAssignRoleOpen(file,"roleSelector")} style={{margin:'0 2px 0 4px', cursor:'pointer'}} width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>}</div> : (
                  <span
                    onClick={()=>handleAssignRoleOpen(file,"roleSelector")}
                    style={{
                      color: "#2196F3",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}>
                    Select
                  </span>
                )}
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