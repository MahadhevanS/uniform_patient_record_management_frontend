import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const PatientDashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <Container 
      component="main"
      maxWidth={false} // Allow container to use full width for flexible background
      // --- Layout Fix: Center content vertically and horizontally ---
      className="flex justify-center items-center bg-gray-50 p-4"
      sx={{ 
        // Calculate min-height based on 100vh minus the fixed header height (approx 64px)
        minHeight: 'calc(100vh - 64px)' 
      }}
    >
      <Box 
        // Main content box with increased max-width for better visual balance
        className="w-full max-w-5xl p-10 bg-white rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl"
        textAlign="center" // Center the text content inside the box
      >
        {/* Header Section */}
        <div className="text-center border-b border-indigo-100 pb-6 mb-8">
          <Typography 
            variant="h3" 
            className="text-gray-800 font-extrabold mb-2" 
          >
            Welcome Back, {user.email}!
          </Typography>
          <Typography 
            variant="h5" 
            className="text-indigo-600 font-medium" 
          >
            Patient Portal | Role: {user.role}
          </Typography>
        </div>
        
        {/* Dashboard Actions */}
        <Box className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
          <Button 
            variant="contained" 
            component={Link} 
            to="/patient/records" 
            startIcon={<AssignmentIcon />}
            // Consistent primary button styling
            className="!bg-indigo-600 hover:!bg-indigo-700 py-3 px-8 rounded-xl font-semibold shadow-md transition-all transform hover:scale-[1.02]"
            sx={{ textTransform: 'none', fontSize: '1.1rem' }}
          >
            View My Medical Records
          </Button>
          
          <Button 
            variant="outlined" 
            component={Link} 
            to="/users/me/profile"
            startIcon={<AccountCircleIcon />}
            // Consistent secondary button styling
            className="border-indigo-600 text-indigo-600 hover:!bg-indigo-50 py-3 px-8 rounded-xl font-semibold transition-all"
            sx={{ textTransform: 'none', fontSize: '1.1rem' }}
          >
            Update Profile
          </Button>
        </Box>
        
        {/* Information Section */}
        <Box className="mt-12 pt-6 border-t border-gray-100">
            <Typography 
                variant="subtitle1" 
                className="text-gray-700 font-medium mb-3"
            >
                Platform Overview
            </Typography>
            <Typography 
                variant="body1" 
                className="text-gray-500 leading-relaxed max-w-3xl mx-auto"
            >
                From here, you can securely access all your cross-hospital medical history and health reports. The unified patient record system empowers you with complete visibility into your health journey across all affiliated healthcare providers.
            </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default PatientDashboard;