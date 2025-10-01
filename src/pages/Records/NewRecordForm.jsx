import React, { useState } from 'react';
import { 
    Container, Typography, Box, Button, TextField, Paper, Alert, Grid,
    CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const NewRecordForm = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        chief_complaint: '',
        diagnosis: '',
        treatment_summary: '',
        notes: '',
        medication_name: '', 
        medication_dosage: ''
    });
    const [error, setError] = useState(null);

    // Style helper for consistent fields
    const muiFieldProps = {
        size: "medium", 
        variant: "outlined",
        fullWidth: true,
        sx: {
          '& .MuiOutlinedInput-root': { borderRadius: '10px' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' }, 
          '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#4f46e5 !important' },
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const medications = (formData.medication_name && formData.medication_dosage) ? 
            [{ name: formData.medication_name, dosage: formData.medication_dosage }] : [];

        const payload = {
            patient_id: patientId, 
            chief_complaint: formData.chief_complaint,
            diagnosis: formData.diagnosis,
            treatment_summary: formData.treatment_summary,
            notes: formData.notes,
            medications: medications
        };
        
        try {
            await apiClient.post('/records/', {
                record_in: payload
            });
            
            alert("Record created successfully!");
            navigate(`/doctor/records/${patientId}`);

        } catch (error) {
            console.error("Record creation failed:", error.response?.data);
            const errorMessage = Array.isArray(error.response?.data?.detail) 
                                 ? error.response.data.detail.map(d => `${d.loc[1]}: ${d.msg}`).join('; ')
                                 : error.response?.data?.detail || "Network Error";
            setError(`Failed to create record: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container 
            component="main"
            maxWidth={false} 
            className="flex justify-center bg-gray-50 p-4"
            sx={{ minHeight: 'calc(100vh - 64px)' }}
        >
            <Box className="w-full max-w-4xl p-10 bg-white rounded-2xl shadow-2xl">
                <Box className="flex items-center mb-6 border-b pb-4">
                    <AddCircleIcon className="text-pink-600 text-3xl mr-3" />
                    <Typography variant="h4" className="text-gray-800 font-bold">
                        Create New Medical Record
                    </Typography>
                </Box>
                
                <Typography variant="h6" className="text-gray-600 mb-3">
                    For Patient ID: <span className="text-pink-600 font-mono">{patientId.substring(0, 8)}...</span>
                </Typography>
                
                {error && <Alert severity="error" className="mb-4">{error}</Alert>}

                <Paper elevation={0} className="p-0">
                    <Box component="form" onSubmit={handleSubmit} className="space-y-6">
                        <Grid container spacing={3}>
                            
                            {/* Chief Complaint */}
                            <Grid item xs={12}>
                                <TextField {...muiFieldProps} label="Chief Complaint" name="chief_complaint" multiline rows={2} value={formData.chief_complaint} onChange={handleChange} required />
                            </Grid>
                            {/* Diagnosis */}
                            <Grid item xs={12}>
                                <TextField {...muiFieldProps} label="Diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} required />
                            </Grid>
                            {/* Treatment Summary */}
                            <Grid item xs={12}>
                                <TextField {...muiFieldProps} label="Treatment Summary" name="treatment_summary" multiline rows={3} value={formData.treatment_summary} onChange={handleChange} />
                            </Grid>
                            
                            {/* Medication Inputs (FIXED: Using Grid for proper spacing) */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" className="text-indigo-600 font-semibold mb-2 mt-4">Prescribed Medication (Simple)</Typography>
                                
                                {/* 🚨 FIX: Use inner Grid container to manage 50/50 layout 🚨 */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField {...muiFieldProps} label="Medication Name" name="medication_name" value={formData.medication_name} onChange={handleChange} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField {...muiFieldProps} label="Dosage (e.g., 200mg, 5ml)" name="medication_dosage" value={formData.medication_dosage} onChange={handleChange} />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Doctor's Notes */}
                            <Grid item xs={12}>
                                <TextField {...muiFieldProps} label="Doctor's Notes" name="notes" multiline rows={3} value={formData.notes} onChange={handleChange} />
                            </Grid>
                            
                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    startIcon={loading ? <CircularProgress size={20} className="text-white" /> : <SaveIcon />}
                                    disabled={loading}
                                    className="!bg-indigo-600 hover:!bg-indigo-700 py-3 rounded-xl font-semibold shadow-md transition-colors"
                                    sx={{ mt: 2, textTransform: 'none', fontSize: '1rem' }}
                                >
                                    {loading ? 'Saving Record...' : 'Submit Medical Record'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default NewRecordForm;