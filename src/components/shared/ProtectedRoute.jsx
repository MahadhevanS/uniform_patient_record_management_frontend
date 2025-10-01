import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, CircularProgress, Box, Typography } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

/**
 * Component to protect routes based on authentication and roles.
 * @param {string[]} allowedRoles - Array of roles allowed to view this page (e.g., ["Doctor", "Hospital Admin"])
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  // 1. Show a loading spinner while checking auth status
  if (loading) {
    return (
      <Container 
        maxWidth="md" 
        className="flex justify-center items-center bg-gray-50"
        sx={{ minHeight: '100vh' }}
      >
        <CircularProgress className="text-indigo-600" />
      </Container>
    );
  }

  // 2. If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. If authenticated, check if the user's role is allowed
  if (role && allowedRoles.includes(role)) {
    // Render the child route content
    return <Outlet />;
  }

  // 4. If role is not allowed, show an unauthorized message
  return (
    <Container 
      maxWidth="sm"
      className="flex justify-center items-center bg-gray-50 p-4"
      sx={{ minHeight: 'calc(100vh - 64px)' }}
    >
      <Box 
        className="w-full p-10 bg-white rounded-xl shadow-2xl text-center border-t-4 border-red-500"
      >
        <LockOpenIcon className="text-red-500 text-5xl mb-4 mx-auto" />
        
        <Typography variant="h4" className="text-gray-800 font-bold mb-3">
          Access Denied
        </Typography>
        
        <Typography variant="body1" className="text-gray-600 mb-6">
          Your role (<span className="font-semibold text-red-500">{role}</span>) does not have permission to view this resource.
        </Typography>
        
        {/* Link to Dashboard/Home */}
        <Typography variant="body2" sx={{ mt: 2 }} className="text-indigo-600 hover:text-indigo-700 font-medium">
          <KeyboardReturnIcon className="mr-1" fontSize="small" />
          {/* Navigate back using Link for better styling and semantic structure */}
          <Link to="/" replace>
            Go to your Dashboard
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default ProtectedRoute;