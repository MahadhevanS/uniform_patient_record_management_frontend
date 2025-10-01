// src/components/shared/Header.jsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const Header = () => {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  let dashboardPath = '/';
  if (role === 'Doctor') dashboardPath = '/doctor/dashboard';
  else if (role === 'Hospital Admin') dashboardPath = '/admin/dashboard';
  else if (role === 'Patient') dashboardPath = '/patient/dashboard';

  const buttonClassName = "font-semibold transition-colors duration-200 py-1 px-3";

  return (
    <AppBar 
      position="static"
      className="!bg-indigo-700 shadow-xl"
    >
      <Toolbar className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {/* Logo/Title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link 
            to={isAuthenticated ? dashboardPath : "/"} 
            className="flex items-center text-white hover:text-indigo-200 transition-colors"
            style={{ textDecoration: 'none' }}
          >
            <MedicalServicesIcon className="mr-2 text-2xl" />
            <span className="font-extrabold tracking-wide">PRMS</span>
          </Link>
        </Typography>

        {/* Navigation / Auth Links */}
        <Box className="space-x-3">
          {isAuthenticated ? (
            // Authenticated Links (Dashboard, Logout)
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to={dashboardPath}
                className={buttonClassName}
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' } 
                }}
              >
                Dashboard ({role})
              </Button>
              
              <Button 
                color="inherit" 
                onClick={handleLogout} 
                startIcon={<ExitToAppIcon />}
                className={buttonClassName}
              >
                Logout
              </Button>
            </>
          ) : (
            // Public Links (Login, Register)
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login" 
                startIcon={<PersonIcon />}
                className={buttonClassName}
              >
                Login
              </Button>
              
              <Button 
                color="inherit"
                component={Link} 
                to="/register"
                className={buttonClassName}
                sx={{ textTransform: 'none' }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;