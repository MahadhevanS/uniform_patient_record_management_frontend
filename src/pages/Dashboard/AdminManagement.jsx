import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, TextField, Button,
    Grid, Alert, CircularProgress, MenuItem, Card, CardContent
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import SettingsIcon from '@mui/icons-material/Settings';

const AdminManagement = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'Doctor',
        specialty: '',
        license_number: '',
        contactNumber: '',
        job_title: '',
        hospitalId: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Style helper for consistent fields
    const muiFieldProps = {
        size: "medium", 
        variant: "outlined",
        fullWidth: true,
        sx: {
          // Sharper border radius
          '& .MuiOutlinedInput-root': { borderRadius: '10px' },
          // Indigo color for focus state
          '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' }, 
          '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#4f46e5 !important' },
        }
    };

    // Fetch Admin's Hospital ID upon load
    useEffect(() => {
        if (user) {
            const fetchAdminHospital = async () => {
                try {
                    const response = await apiClient.get('/users/me/profile');
                    const adminProfile = response.data;
                    setFormData(prev => ({ ...prev, hospitalId: adminProfile.hospital_id }));
                } catch (err) {
                    setError("Failed to fetch Admin profile or hospital ID.");
                }
            };
            fetchAdminHospital();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const isDoctor = formData.role === 'Doctor';
        
        const payload = {
            user_in: {
                email: formData.email,
                password: formData.password,
                role: formData.role,
            },
            profile_in: isDoctor ? {
                hospital_id: formData.hospitalId,
                specialty: formData.specialty,
                license_number: formData.license_number,
                contact_number: formData.contactNumber || undefined,
            } : {
                hospital_id: formData.hospitalId,
                job_title: formData.job_title || 'Hospital Administrator',
            }
        };

        try {
            await apiClient.post('/users/', payload);
            setSuccess(`Successfully created new ${formData.role} account: ${formData.email}`);
            
            setFormData(prev => ({
                ...prev,
                email: '', 
                password: '', 
                specialty: '', 
                license_number: '', 
                contactNumber: '',
                job_title: ''
            }));
        } catch (err) {
            console.error("Staff creation failed:", err.response?.data);
            const errorMessage = Array.isArray(err.response?.data?.detail) 
                                 ? err.response.data.detail.map(d => `${d.loc[1]}: ${d.msg}`).join('; ')
                                 : err.response?.data?.detail || "Staff creation failed. Check fields or server log.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!formData.hospitalId) {
        return (
            <Container maxWidth="md" className="flex justify-center items-center" sx={{ mt: 4, minHeight: '50vh' }}>
                <CircularProgress />
                <Typography className="ml-2">Initializing Management Tools...</Typography>
            </Container>
        );
    }
    
    return (
        <Container 
            maxWidth="lg" 
            className="flex justify-center bg-gray-50 p-4"
            sx={{ minHeight: 'calc(100vh - 64px)' }}
        >
            <Box className="w-full max-w-5xl">
                {/* --- HEADER (Staff Management Title) --- */}
                <Box className="flex items-center mb-6 pt-6 border-b border-gray-200">
                    <SettingsIcon className="text-indigo-600 text-3xl mr-3" />
                    <Typography variant="h4" className="text-gray-800 font-bold">
                        Staff Management
                    </Typography>
                </Box>
                
                {/* --- INFO ALERT --- */}
                <Alert severity="info" className="mb-6 rounded-lg shadow-sm">
                    Creating accounts for **Hospital ID {formData.hospitalId}**. You can only manage staff affiliated with your hospital.
                </Alert>

                <Card elevation={6} className="rounded-2xl shadow-xl">
                    <CardContent className="p-8">
                        <Typography 
                            variant="h5" 
                            // The issue line from your image appears to be a bottom border on this element
                            className="flex items-center text-indigo-700 font-semibold mb-6 pb-2"
                        >
                            <PersonAddIcon className="mr-2 text-3xl" /> Create New Staff User
                        </Typography>
                        
                        {error && <Alert severity="error" className="mb-4 rounded-lg">{error}</Alert>}
                        {success && <Alert severity="success" className="mb-4 rounded-lg">{success}</Alert>}

                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                
                                {/* --- ROW 1: ROLE & CREDENTIALS --- */}
                                {/* If the line issue was a persistent margin/border, the Grid spacing (3) and component structure will fix it. */}
                                
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        {...muiFieldProps}
                                        select
                                        label="Role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Doctor">Doctor</MenuItem>
                                        <MenuItem value="Hospital Admin">Hospital Admin</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField {...muiFieldProps} required label="Email" name="email" value={formData.email} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField {...muiFieldProps} required label="Password (Min 8 chars)" type="password" name="password" value={formData.password} onChange={handleChange} />
                                </Grid>

                                {/* --- ROW 2: ROLE-SPECIFIC FIELDS --- */}
                                {formData.role === 'Doctor' ? (
                                    <>
                                        <Grid item xs={12} sm={4}>
                                            <TextField {...muiFieldProps} required label="Specialty" name="specialty" value={formData.specialty} onChange={handleChange} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField {...muiFieldProps} required label="License Number" name="license_number" value={formData.license_number} onChange={handleChange} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField {...muiFieldProps} label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                                        </Grid>
                                    </>
                                ) : (
                                    <Grid item xs={12} sm={4}>
                                        <TextField {...muiFieldProps} label="Job Title" name="job_title" value={formData.job_title} onChange={handleChange} />
                                    </Grid>
                                )}
                                
                                {/* --- SUBMIT BUTTON --- */}
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<PersonAddIcon />}
                                        disabled={loading || !formData.hospitalId}
                                        className="!bg-indigo-600 hover:!bg-indigo-700 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-md"
                                        sx={{ mt: 2, textTransform: 'none', fontSize: '1rem' }}
                                    >
                                        {loading ? 'Creating...' : `Create ${formData.role}`}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default AdminManagement;