import React, { useEffect, useState } from 'react';
import { Box, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DatasetsIcon from '../assets/Datasets.png';
import ProjectsIcon from '../assets/Projects.png';
import ListItemIcon from '../assets/ListItem.png';
import LogoutIcon from '../assets/logout.png';
import { useAuth } from '../hooks/useAuth';
import { DatasetInfo } from './AdminPageComponents/DatasetInfoContent';
import { MainContent } from './AdminPageComponents/MainContent';


const styles = {
  container: {
    display: 'flex',
  },
  sidebar: {
    zIndex:'5',
    position: 'fixed',
    left: '0',
    height: '100vh',
    width: '240px',
    backgroundColor: '#424242',
    color: 'white',
    paddingTop:'4rem',
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateX(0)',
  },
  sidebarHidden: {
    transform: 'translateX(-100%)',
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:'start',
    gap:'20px',
    padding: '10px',
    paddingLeft: '20px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#A0A0A0',
    },
  },
  content: {
    overflow:'auto',
    marginTop: "4rem",
    flex: 1,
    // padding: '20px',
    backgroundColor: '#f5f5f5',
    height:'calc(100vh - 4rem)'
  },
  header: {
    color: 'black',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '20px',
    position: 'sticky',
    top: '0',
    right: '0',
    backgroundColor: '#f5f5f',
    padding: '10px 0px',
    zIndex: '0'
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
const SidebarItem: React.FC<SidebarItemProps> = ({ pngSrc, label, onClick }) => (
  <Box onClick={()=>{onClick()}} sx={styles.sidebarItem} data-testid={label}>
    <img src={pngSrc} alt={label} style={{ marginRight: '10px', width: '24px', height: '24px' }} />
    <Typography variant="body2">{label}</Typography>
  </Box>
);


//Admin Page (Main page)
export const AdminPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [selectedDataset, setSelectedDataset] = useState<any | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  useEffect(() => {
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleLogOut = () => {
    setAuth({});
    navigate("/signin");
  };
  const handleNavbarItemClick = () => {

  };
  const onDatasetClick = (dataset: any) => {
    console.log(dataset);
    setSelectedDataset(dataset);
  };
  const ShowDatasetsPage = () => {
    setSelectedDataset(null);
  };

  return (
    <Box sx={{position:'fixed',minHeight:'100vh',minWidth:'100vw',top:'0',left:'0',backgroundColor:'#f5f5f5'}}>      
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
            <Typography variant="h6" gutterBottom>Annotation UI</Typography>
          </Box>
        </Box>
        <Box sx={{ ...styles.sidebar, ...(sidebarOpen ? {} : styles.sidebarHidden) }} data-testid="sidebar">
          <SidebarItem pngSrc={DatasetsIcon} label="Datasets" onClick={ShowDatasetsPage}/>
          <SidebarItem pngSrc={ProjectsIcon} label="Projects" onClick={handleNavbarItemClick}/>
          <SidebarItem pngSrc={ListItemIcon} label="List item" onClick={handleNavbarItemClick}/>
          <SidebarItem pngSrc={LogoutIcon} label="Logout" onClick={handleLogOut}/>
        </Box>
        <Box sx={{...styles.content,...(sidebarOpen ? {marginLeft:'240px'} : {})}}>
          {
          selectedDataset ? 
          (<DatasetInfo dataset={selectedDataset} handleBack = {ShowDatasetsPage}/>) 
          : 
          ( <MainContent onDatasetClick={onDatasetClick} />)
          }
        </Box>
      </Box>
    </Box>
  );
};
