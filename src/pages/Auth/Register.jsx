import React, { useState } from 'react';
import { 
  Container, TextField, Button, Typography, Box, Paper, Alert, Grid, MenuItem, CircularProgress 
} from '@mui/material';
import apiClient from '../../api/apiClient';
import { useNavigate, Link } from 'react-router-dom';
import GroupAddIcon from '@mui/icons-material/GroupAdd'; // Icon for visual appeal

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    bloodType: '',
    contactNumber: '',
    address: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Helper for consistent Tailwind/MUI field styling ---
  const muiFieldProps = {
    fullWidth: true,
    size: "medium", 
    variant: "outlined",
    // Base style for the input field to reduce repetitive sx props
    sx: {
      marginBottom: 0, // Ensure no extra margin is applied
      '& .MuiOutlinedInput-root': { borderRadius: '10px' },
      // Use indigo for focus effect consistent with Login.jsx's styling goal
      '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' }, // indigo-600
      '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#4f46e5 !important' },
    }
  };
  // -----------------------------------------------------------

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        user_in: {
          email: formData.email,
          password: formData.password,
          role: "Patient",
        },
        patient_profile_in: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          date_of_birth: formData.dob || undefined,
          gender: formData.gender || undefined,
          blood_type: formData.bloodType || undefined,
          contact_number: formData.contactNumber || undefined,
          address: formData.address || undefined,
        },
      };

      await apiClient.post('/auth/register', payload);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error("Registration failed:", err.response?.data?.detail || err.message);
      setError(err.response?.data?.detail?.join(', ') || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="md"
      // Use the same background and container styling as Login.jsx
      className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-100 p-4"
    >
      <Paper
        elevation={6} // Consistent shadow with Login
        // Wider width for the multi-column form
        className="w-full p-8 bg-white rounded-2xl shadow-2xl"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Box className="flex justify-center items-center mb-4 text-indigo-600">
            <GroupAddIcon className="text-4xl" />
          </Box>
          <Typography variant="h4" className="text-gray-800 font-extrabold mb-1">
            Patient Registration
          </Typography>
          <Typography component="h1" variant="subtitle1" className="text-gray-500">
            Create your account to unify your patient records.
          </Typography>
        </div>

        {error && (
          <Alert severity="error" className="mb-6 rounded-lg">
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" className="mb-6 rounded-lg">
            Registration successful! Redirecting to login...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} className="space-y-6">
          
          {/* Account Details Section */}
          <Typography variant="h6" className="text-indigo-600 font-semibold pb-1">
            Account Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField {...muiFieldProps} required label="Email Address" name="email" value={formData.email} onChange={handleChange} autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...muiFieldProps} required label="Password (Min 8 chars)" type="password" name="password" value={formData.password} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...muiFieldProps} required label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </Grid>
          </Grid>

          {/* Personal Details Section */}
          <Typography variant="h6" className="text-indigo-600 font-semibold pt-4 pb-1">
            Personal Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField {...muiFieldProps} required label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...muiFieldProps} required label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...muiFieldProps}
                required
                label="Date of Birth"
                name="dob"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.dob}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...muiFieldProps}
                select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                {['Male', 'Female', 'Other'].map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField {...muiFieldProps} label="Blood Type" name="bloodType" value={formData.bloodType} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...muiFieldProps} label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...muiFieldProps}
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            // Tailwind classes for primary color, hover effect, padding, and text styling (consistent with Login)
            className="!bg-indigo-600 hover:!bg-indigo-700 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-md"
            sx={{ textTransform: 'none', fontSize: '1rem', marginTop: '1.5rem !important' }}
          >
            {loading ? (
              <Box className="flex items-center justify-center">
                <CircularProgress size={20} className="text-white mr-2" />
                Registering...
              </Box>
            ) : (
              'Register Account'
            )}
          </Button>
        </Box>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              Sign In
            </Link>
          </Typography>
        </div>
      </Paper>
    </Container>
  );
};

export default Register;