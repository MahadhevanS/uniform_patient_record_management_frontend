import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <Container 
      component="main"
      maxWidth={false} 
      className="flex justify-center items-center bg-gray-50 p-4"
      sx={{ minHeight: 'calc(100vh - 64px)' }}
    >
      <Box 
        className="w-full max-w-5xl p-10 bg-white rounded-2xl shadow-2xl transition-all duration-300"
        textAlign="center"
      >
        {/* Header Section */}
        <div className="text-center border-b border-indigo-100 pb-6 mb-8">
          <Typography 
            variant="h3" 
            className="text-gray-800 font-extrabold mb-2" 
          >
            Welcome, Hospital Administrator.
          </Typography>
          <Typography 
            variant="h5" 
            className="text-green-600 font-medium" 
          >
            Hospital Management Portal | Role: {user.role}
          </Typography>
        </div>
        
        {/* Dashboard Actions */}
        <Box className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
          <Button 
            variant="contained" 
            component={Link} 
            to="/admin/manage" 
            startIcon={<PeopleIcon />}
            className="!bg-indigo-600 hover:!bg-indigo-700 py-3 px-8 rounded-xl font-semibold shadow-md transition-all transform hover:scale-[1.02]"
            sx={{ textTransform: 'none', fontSize: '1.1rem' }}
          >
            Manage Staff & Hospitals
          </Button>
          
          <Button 
            variant="outlined" 
            component={Link} 
            to="/admin/analytics"
            startIcon={<BarChartIcon />}
            className="border-indigo-600 text-indigo-600 hover:!bg-indigo-50 py-3 px-8 rounded-xl font-semibold transition-all"
            sx={{ textTransform: 'none', fontSize: '1.1rem' }}
          >
            System Analytics
          </Button>
        </Box>
        
        {/* Information Section */}
        <Box className="mt-12 pt-6 border-t border-gray-100">
            <Typography 
                variant="body1" 
                className="text-gray-500 leading-relaxed max-w-3xl mx-auto"
            >
                Use this powerful interface to oversee hospital staff accounts, manage hospital details, and monitor platform usage statistics.
            </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminDashboard;