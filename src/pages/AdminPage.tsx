import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DatasetsIcon from '../assets/Datasets.png';
import UserItemIcon from '../assets/UserList.png';
import QnAIcon from '../assets/Questionmark.png';
import LogoutIcon from '../assets/logout.png';
import { useAuth } from '../hooks/useAuth';
import { DatasetInfo } from './AdminPageComponents/DatasetInfoContent';
import { MainContent } from './AdminPageComponents/MainContent';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';
import UserDetailContent from './AdminPageComponents/UserDetailContent';
import {QuestionListDataset} from './AdminPageComponents/QuesListDataset';
import { QuesDatasetContent } from './AdminPageComponents/QuesDatasetContent';

const styles = {
  container: {
    display: 'flex',
  },
  sidebar: {
    zIndex: '5',
    position: 'fixed',
    left: '0',
    height: '100vh',
    width: '240px',
    backgroundColor: '#424242',
    color: 'white',
    paddingTop: '4rem',
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateX(0)',
  },
  sidebarHidden: {
    transform: 'translateX(-100%)',
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    gap: '20px',
    padding: '10px',
    paddingLeft: '20px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#A0A0A0',
    },
  },
  content: {
    overflow: 'auto',
    marginTop: '4rem',
    flex: 1,
    backgroundColor: '#f5f5f5',
    height: 'calc(100vh - 4rem)',
    width: 'calc(100vw - 240px)',
  },
  topBar: {
    paddingLeft: '1rem',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    position: 'fixed',
    top: '0',
    width: '100vw',
    height: '4rem',
    backgroundColor: '#424242',
    zIndex: '6',
  },
  hamburger: {
    cursor: 'pointer',
  },
};

interface SidebarItemProps {
  pngSrc: string;
  label: string;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps & { isActive: boolean }> = ({ pngSrc, label, onClick, isActive }) => (
  <Box
    onClick={onClick}
    sx={{
      ...styles.sidebarItem,
      backgroundColor: isActive ? '#5c5959' : 'transparent', // Highlight active item
    }}
    data-testid={label}
  >
    <img src={pngSrc} alt={label} style={{ marginRight: '10px', width: '24px', height: '24px' }} />
    <Typography variant="body2">{label}</Typography>
  </Box>
);

enum PageState {
  Datasets,
  Users,
  QnA,
  Logout,
}

export const AdminPage = () => {
  const { makeRequest } = useAxios<any>();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [selectedDataset, setSelectedDataset] = useState<any | null>(null);
  const [selectedQuesDataset, setSelectedQuesDataset] = useState<any | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageState>(PageState.Datasets);

  useEffect(() => {
    CheckForUserRoles();
  }, []);

  const CheckForUserRoles = async () => {
    if (!localStorage.getItem('AllRoles')) {
      try {
        const response = await makeRequest('/admin/all-roles', 'GET');
        if (response) {
          localStorage.setItem('AllRoles', JSON.stringify(response));
        }
      } catch (err) {
        toast.error(`Error fetching all roles: ${err}`);
      }
    }
    if (!localStorage.getItem('UserRoles')) {
      try {
        const response = await makeRequest('/admin/user-roles', 'GET');
        if (response) {
          localStorage.setItem('UserRoles', JSON.stringify(response));
        }
      } catch (err) {
        toast.error(`Error fetching user roles: ${err}`);
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogOut = () => {
    setAuth({});
    localStorage.removeItem('AllRoles');
    localStorage.removeItem('UserRoles');
    localStorage.removeItem('accessToken');
    navigate('/signin');
  };

  const onDatasetClick = (dataset: any) => {
    setSelectedDataset(dataset);
    setCurrentPage(PageState.Datasets); 
  };

  const onQuesDatasetClick = (dataset: any)=> {
    setSelectedQuesDataset(dataset);
    setCurrentPage(PageState.QnA);
  }

  const handleSidebarClick = (page: PageState) => {
    if (page === PageState.Datasets && selectedDataset) {
      setSelectedDataset(null); // Reset dataset selection when clicking on Datasets again
    }
    else if (page === PageState.QnA && selectedQuesDataset) {
      setSelectedQuesDataset(null); // Reset dataset selection when clicking on Datasets again
    }
    
    setCurrentPage(page);
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case PageState.Datasets:
        return selectedDataset ? (
          <DatasetInfo dataset={selectedDataset} handleBack={() => setCurrentPage(PageState.Datasets)} />
        ) : (
          <MainContent onDatasetClick={onDatasetClick} />
        );
      case PageState.Users:
        return <UserDetailContent />;
      case PageState.QnA:
        return selectedQuesDataset? (
          <QuesDatasetContent dataset={selectedQuesDataset} handleBack={() => setCurrentPage(PageState.QnA)} />
        ) : (
          <QuestionListDataset onDatasetClick={onQuesDatasetClick} />
        );
      case PageState.Logout:
        handleLogOut();
        return null;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ position: 'fixed', minHeight: '100vh', minWidth: '100vw', top: '0', left: '0', backgroundColor: '#f5f5f5' }}>
      <Box sx={styles.container}>
        <Box sx={styles.topBar}>
          <Box sx={styles.hamburger} onClick={toggleSidebar} data-testid="hamburger">
            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 18L20 18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 12L20 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 6L20 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Box>
          <Box sx={{ paddingLeft: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Annotation UI
            </Typography>
          </Box>
        </Box>
        <Box sx={{ ...styles.sidebar, ...(sidebarOpen ? {} : styles.sidebarHidden) }} data-testid="sidebar">
        <SidebarItem
            pngSrc={DatasetsIcon}
            label="Datasets"
            onClick={() => handleSidebarClick(PageState.Datasets)}
            isActive={currentPage === PageState.Datasets}
          />
          <SidebarItem
            pngSrc={UserItemIcon}
            label="Users"
            onClick={() => handleSidebarClick(PageState.Users)}
            isActive={currentPage === PageState.Users}
          />
          <SidebarItem
            pngSrc={QnAIcon}
            label="Q&A"
            onClick={() => handleSidebarClick(PageState.QnA)}
            isActive={currentPage === PageState.QnA}
          />
          <SidebarItem
            pngSrc={LogoutIcon}
            label="Logout"
            onClick={() => handleSidebarClick(PageState.Logout)}
            isActive={currentPage === PageState.Logout}
          />
        </Box>
        <Box sx={{ ...styles.content, ...(sidebarOpen ? { marginLeft: '240px' } : {}) }}>
          {renderPageContent()}
        </Box>
      </Box>
    </Box>
  );
};
