import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useAxios from '../../hooks/useAxios';
import { toast } from 'react-toastify';
import IndexDatasetForm from '../../components/IndexDatasetForm';
import { LoadingSpinner } from "../../components/LoadingSpinner";
import AssignmentForm from '../../components/AssignmentForm';  // Import for AssignmentForm
import { useLocation, useNavigate } from 'react-router-dom';

interface FileInfo {
  id: string;
  annotator: string;
  reviewer: string;
  file_name: string;
  size: string;
  status: string;
}

interface Role {
  role_id: string;
  role_name: string;
}

interface UserRole {
  id: string;
  name: string;
  username: string;
  roles: string[];
  email?: string; // Optional property
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

export const DatasetInfo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { makeRequest } = useAxios<any>();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isIndexDatasetFormVisible, setIsIndexDatasetFormVisible] = useState(false);
  const [isAnnotatorReviewerFormVisible, setIsAnnotatorReviewerFormVisible] = useState(false);
  const [datasetState, setDatasetState] = useState(location.state?.dataset || {});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<FileInfo | null>(null);
  const [annotators, setAnnotators] = useState<UserRole[] | null>(null);
  const [reviewers, setReviewers] = useState<UserRole[] | null>(null);
  const [allAnnotatorsAssigned, setAllAnnotatorsAssigned] = useState<Boolean>(false);
  const [availablePeopleList, setAvailablePeopleList] = useState<UserRole[] | null>(null);
  const [annotatorReviewerType, setAnnotatorReviewerType] = useState<string | null>(null);

  const fetchDatasetInfo = async () => {
    setDatasetState(location.state?.dataset || {});
    try {
      const response: FileInfo[] = await makeRequest(`admin/datasets/${datasetState.id}`, 'GET');
      if (response) {
        let allAssigned = true;
        response.forEach((element) => {
          if (element.annotator == null) {
            allAssigned = false;
          }
        });

        setAllAnnotatorsAssigned(allAssigned);
        setFiles(response);
        setIsLoading(false);
      }
    } catch (err) {
      toast.error(`Error fetching dataset info: ${err}`);
      console.error('Error fetching dataset info:', err);
    }
  };

  const fetchRolesInfoAndSet = () => {
    function fetchFromLocalStorage<T>(key: string): T {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }

    const roles: Role[] = fetchFromLocalStorage<Role[]>('AllRoles') || [];
    const userRoles: UserRole[] = fetchFromLocalStorage<UserRole[]>('UserRoles') || [];

    function getRoleName(role_id: string): string | undefined {
      const role = roles.find((role) => role.role_id === role_id);
      return role ? role.role_name : undefined;
    }

    function getUsersByRole(userRoles: UserRole[], roleName: string): UserRole[] {
      return userRoles.filter((user) =>
        user.roles.some((role_id) => getRoleName(role_id) === roleName)
      );
    }

    const annotators = getUsersByRole(userRoles, 'Annotator');
    const reviewers = getUsersByRole(userRoles, 'Reviewer');

    setAnnotators(annotators);
    setReviewers(reviewers);
  };

  useEffect(() => {
    fetchDatasetInfo();
    fetchRolesInfoAndSet();
  }, [datasetState.id]);

  const handleIndexDataset = () => {
    toast.info('Indexing dataset...');
  };

  const handleIndexDatasetOpen = () => {
    setIsIndexDatasetFormVisible(true);
  };

  const handleAnnotatorAssignRandom = async () => {
    try {
      const response = await makeRequest(`admin/datasets/${datasetState.id}/random-annotator-assignment`, 'POST');
      if (response) {
        fetchDatasetInfo();
        toast.info(response);
      }
    } catch (err) {
      toast.error(`Error fetching dataset info: ${err}`);
    }
  };

  const handleIndexDatasetClose = (successStatus: Boolean) => {
    if (successStatus) {
      fetchDatasetInfo();
      setDatasetState({ ...datasetState, status: 'Indexed' });
    }
    setIsIndexDatasetFormVisible(false);
  };

  const handleAssignPersonClose = (successStatus: Boolean) => {
    if (successStatus) {
      fetchDatasetInfo();
      setDatasetState({ ...datasetState, status: 'Indexed' });
    }
    setIsAnnotatorReviewerFormVisible(false);
  };

  const handleAssignPersonOpen = (file: FileInfo, type: string) => {
    setAnnotatorReviewerType(type);
    if (type == 'annotator') {
      setAvailablePeopleList(annotators);
    } else if (type == 'reviewer') {
      setAvailablePeopleList(reviewers);
    }

    setSelectedDocument(file);
    setIsAnnotatorReviewerFormVisible(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={styles.container}>
      <AssignmentForm
        open={isAnnotatorReviewerFormVisible}
        handleClose={(successStatus: Boolean) => handleAssignPersonClose(successStatus)}
        availableEntities={availablePeopleList?.map((person) => ({ id: person.id, name: person.username })) ?? []}
        type={annotatorReviewerType ?? ''}
        additionalData={{ user_name: '', user_id: '', documentID: selectedDocument?.id }}
        submitUrl={`admin/datasets/${selectedDocument?.id}/document-assignment`}
        requestMethod={'POST'}
      />
      <IndexDatasetForm open={isIndexDatasetFormVisible} handleClose={(successStatus: Boolean) => handleIndexDatasetClose(successStatus)} datasetID={datasetState.id} />
      <Box sx={styles.header}>
        <Typography variant="h5" sx={styles.datasetName}>
          {datasetState.name}
        </Typography>
        {datasetState.status !== 'Indexed' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <Button sx={{ backgroundColor: '#2196F3', fontWeight: '400' }} variant="contained" color="primary" size="large" onClick={handleIndexDatasetOpen}>
              INDEX DATASET
            </Button>
            {!allAnnotatorsAssigned ? (
              <Button sx={{ backgroundColor: '#2196F3', fontWeight: '400' }} variant="contained" color="primary" size="medium" onClick={handleAnnotatorAssignRandom}>
                Assign Annotators
              </Button>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </Box>
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table sx={{ border: '2px solid black' }}>
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
                <TableCell sx={styles.tableCell}>{`${file.size} Bytes`}</TableCell>
                <TableCell sx={styles.tableCell}>{file.status}</TableCell>
                <TableCell sx={styles.tableCell}>
                  {file.annotator ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {file.annotator}{' '}
                      <svg onClick={() => handleAssignPersonOpen(file, 'annotator')} style={{ margin: '0 2px 0 4px', cursor: 'pointer' }} width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                          stroke="#000000"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                          stroke="#000000"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <span
                      onClick={() => handleAssignPersonOpen(file, 'annotator')}
                      style={{
                        color: '#2196F3',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Select
                    </span>
                  )}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {file.reviewer ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {file.reviewer}
                      <svg onClick={() => handleAssignPersonOpen(file, 'reviewer')} style={{ margin: '0 2px 0 4px', cursor: 'pointer' }} width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                          stroke="#000000"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                          stroke="#000000"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <span
                      onClick={() => handleAssignPersonOpen(file, 'reviewer')}
                      style={{
                        color: '#2196F3',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
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
