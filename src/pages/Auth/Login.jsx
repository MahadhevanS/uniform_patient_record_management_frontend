import React, { useState } from 'react';
import { 
  Container, TextField, Button, Typography, Box, Paper, Alert, CircularProgress 
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login'; // New icon for visual appeal

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, role } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      // Redirect based on role
      if (role === 'Doctor') navigate('/doctor/dashboard');
      else if (role === 'Hospital Admin') navigate('/admin/dashboard');
      else if (role === 'Patient') navigate('/patient/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Simplified style customization for MUI components using classes/sx:
  // We remove the complex `sx` overrides and rely on Tailwind where possible.
  const muiFieldProps = {
    // Standard MUI properties to use Tailwind for spacing/appearance
    size: "medium", 
    variant: "outlined",
    fullWidth: true,
    required: true,
    // Note: The borderRadius and color focus handling is often better left to MUI theme or complex sx overrides,
    // but here we simplify to focus on clean Tailwind spacing and button styles.
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      // Added background pattern and slightly darker shadow for a richer look
      className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-100 p-4"
    >
      <Paper
        elevation={6} // Increased elevation for depth
        // Modernized shadow and border radius
        className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl"
      >
        {/* Logo/Title Section */}
        <div className="text-center mb-10">
          <Box className="flex justify-center items-center mb-4 text-blue-600">
            <LoginIcon className="text-4xl" />
          </Box>
          <Typography variant="h4" className="text-gray-800 font-extrabold mb-1">
            Welcome to PRMS
          </Typography>
          <Typography component="h1" variant="subtitle1" className="text-gray-500">
            Sign in to access your uniform patient records.
          </Typography>
        </div>

        {error && (
          <Alert severity="error" className="mb-6 rounded-lg">
            {error}
          </Alert>
        )}

        {/* Form Section */}
        <Box component="form" onSubmit={handleSubmit} className="space-y-6">
          <TextField
            {...muiFieldProps}
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            {...muiFieldProps}
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            // Tailwind classes for primary color, hover effect, padding, and text styling
            className="!bg-indigo-600 hover:!bg-indigo-700 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-md"
            sx={{ textTransform: 'none', fontSize: '1rem', marginTop: '1.5rem !important' }} // Override MUI margin
          >
            {loading ? (
              <Box className="flex items-center">
                <CircularProgress size={20} className="text-white mr-2" />
                Signing in...
              </Box>
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              Register here
            </Link>
          </Typography>
        </div>
      </Paper>
    </Container>
  );
};

export default Login;