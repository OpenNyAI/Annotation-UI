import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const styles = {
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
};

interface DatasetCardProps {
  name: string;
  created_at: string;
  created_by: string;
  status: string;
  onClick: () => void;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({ name, created_at, created_by, status, onClick }) => {
  const date = new Date(created_at);

  return (
    <Card sx={styles.card} onClick={onClick}>
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