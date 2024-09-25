import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import DatasetsIcon from '../assets/Datasets.png';
import ProjectsIcon from '../assets/Projects.png';
import ListItemIcon from '../assets/ListItem.png';
import LogoutIcon from '../assets/logout.png';
import CreateDatasetForm from '../components/CreateDatasetForm';
import { useAuth } from '../hooks/useAuth';
import useAxios from '../hooks/useAxios';

const styles = {
  container: {
    display: 'flex',
  },
  sidebar: {
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
    padding: '20px',
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
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor:'#D9D9D9',
    cursor:'pointer',
    '&:hover': {
      backgroundColor: '#A0A0A0',
    },
  },
  cardContent: {
    color:'black',
    flexGrow: 1,
  },
  statusChip: {
    fontWeight: 'bold',
    fontSize: '0.75rem',
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
    zIndex: '2',
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

interface DatasetCardProps {
  name: string;
  created_at: string;
  created_by: string;
  status: string;
}
const DatasetCard: React.FC<DatasetCardProps> = ({ name, created_at, created_by, status }) => {
  const date = new Date(created_at);
  return (
    <Card sx={styles.card}>
      <CardContent sx={styles.cardContent}>
        <Typography variant="body2" color="black" fontWeight={'bold'} gutterBottom>{name}</Typography>
        <br/><br/>
        <Typography variant="body2" color="black" sx={{paddingTop:'20px', fontSize:'0.8rem'}} >{date.toISOString().split('T')[0]}</Typography> 
        <br/>
      <Box sx={{ paddingTop: 2, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <Box>
        <Typography variant="body3" color="black" fontWeight={'bold'}>Created By: </Typography>
        <Typography variant="body3" color="black">{created_by}</Typography>
        </Box>
        <Typography 
          variant="body2" 
          sx={{
            ...styles.statusChip,
            // backgroundColor: 'white',
            color: 'black',
          }}
        >
          {status}
        </Typography>
      </Box>
      </CardContent>
    </Card>
  );
};


// Content (This is the main content)
// Create similar structures and route using a Admin Page state variable to navigate
const Content: React.FC = () => {
  const { makeRequest, data, status, error } = useAxios<any[]>();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [isCreateDatasetFormVisible,setIsCreateDatasetFormVisible] = useState(false);

  // Fetch datasets
  const fetchDatasets = async () => {
    try {
      const response = await makeRequest('admin/datasets', 'GET');
      if (response) {
        setDatasets(response);
      }
    } catch (err) {
      toast.error(`Error fetching datasets: + ${err}`);
      console.error('Error fetching datasets:', err);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleCreateDatasetOpen = () => {
    setIsCreateDatasetFormVisible(true);
  };
  const handleCreateDatasetClose = (successStatus:Boolean) => {
    if(successStatus){
      fetchDatasets();
    }
    setIsCreateDatasetFormVisible(false);
  };

  return (
    <Box>
      <Box sx={styles.header}>
        <Button
          sx={{backgroundColor:"#2196F3", fontWeight:'400'}}
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreateDatasetOpen}
        >
          + CREATE DATASET
        </Button>
      </Box>
      <CreateDatasetForm open={isCreateDatasetFormVisible} handleClose={(successStatus:Boolean)=>handleCreateDatasetClose(successStatus)}/>
      <Grid container spacing={3}>
        {datasets.map((dataset, index) => (
          <Grid item xs={14} sm={6} md={4} key={index}>
            <DatasetCard {...dataset} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

//Admin Page (Main page)
export const AdminPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
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
          <SidebarItem pngSrc={DatasetsIcon} label="Datasets" onClick={handleNavbarItemClick}/>
          <SidebarItem pngSrc={ProjectsIcon} label="Projects" onClick={handleNavbarItemClick}/>
          <SidebarItem pngSrc={ListItemIcon} label="List item" onClick={handleNavbarItemClick}/>
          <SidebarItem pngSrc={LogoutIcon} label="Logout" onClick={handleLogOut}/>
        </Box>
        <Box sx={{...styles.content,...(sidebarOpen ? {marginLeft:'240px'} : {})}}>
          <Content/> 
        </Box>
      </Box>
    </Box>
  );
};
