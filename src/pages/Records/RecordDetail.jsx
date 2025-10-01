import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Grid, Divider, CircularProgress, 
    Alert, Card, CardContent, List, ListItem, ListItemText 
} from '@mui/material';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MedicationIcon from '@mui/icons-material/Medication';
import BiotechIcon from '@mui/icons-material/Biotech';

const RecordDetail = () => {
    const { recordId } = useParams();
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecordDetail = async () => {
            try {
                // Endpoint: GET /records/{recordId}
                const response = await apiClient.get(`/records/${recordId}`);
                setRecord(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch record details:", err);
                setError(err.response?.data?.detail || "Could not load record details.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecordDetail();
    }, [recordId]);

    // Helper to render JSON data nicely (Medications)
    const renderMedications = (meds) => {
        if (!meds || meds.length === 0) return <Typography className="text-gray-500 italic">None prescribed.</Typography>;
        
        // Ensure medications is treated as an array of objects
        const medicationList = Array.isArray(meds) ? meds : (typeof meds === 'string' ? JSON.parse(meds) : []);
        
        return (
            <List dense className="p-0">
                {medicationList.map((med, index) => (
                    <ListItem key={index} disableGutters sx={{ py: 0 }}>
                        <ListItemText 
                            primary={<Typography className="font-medium">{med.name} - {med.dosage}</Typography>}
                            secondary={med.frequency ? `Frequency: ${med.frequency}` : null}
                        />
                    </ListItem>
                ))}
            </List>
        );
    };

    if (loading) {
        return (
            <Container maxWidth="md" className="flex justify-center items-center" sx={{ minHeight: 'calc(100vh - 64px)' }}>
                <CircularProgress />
                <Typography className="ml-2">Loading Record #{recordId}...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }
    
    const visitDate = new Date(record.date_of_visit).toLocaleDateString();

    return (
        <Container 
            component="main"
            maxWidth={false} 
            className="flex justify-center bg-gray-50 p-4"
            sx={{ minHeight: 'calc(100vh - 64px)' }}
        >
            <Box className="w-full max-w-6xl p-10 bg-white rounded-2xl shadow-2xl">
                {/* --- HEADER --- */}
                <Box className="flex items-center mb-6 border-b pb-4">
                    <MedicalInformationIcon className="text-indigo-600 text-3xl mr-3" />
                    <Typography variant="h4" className="text-gray-800 font-bold">
                        Medical Record Details: #{recordId}
                    </Typography>
                </Box>
                
                <Typography variant="h6" className="text-gray-600 font-medium mb-4">
                    Visit Date: <span className="text-indigo-600 font-semibold">{visitDate}</span>
                </Typography>


                <Grid container spacing={4}>
                    {/* --- Primary Visit Data --- */}
                    <Grid item xs={12} md={7}>
                        <Card elevation={3} className="rounded-xl shadow-lg">
                            <CardContent className="p-6">
                                <Typography variant="h5" className="text-indigo-700 font-semibold mb-4 border-b pb-2">
                                    Diagnosis & Summary
                                </Typography>
                                
                                <Box className="mb-4">
                                    <Typography variant="subtitle1" className="font-bold text-gray-700">Chief Complaint:</Typography>
                                    <Typography variant="body1" className="text-gray-600">{record.chief_complaint || 'N/A'}</Typography>
                                </Box>
                                <Box className="mb-4">
                                    <Typography variant="subtitle1" className="font-bold text-gray-700">Diagnosis:</Typography>
                                    <Typography variant="body1" className="text-pink-600 font-semibold">{record.diagnosis}</Typography>
                                </Box>
                                <Box className="mb-4">
                                    <Typography variant="subtitle1" className="font-bold text-gray-700">Treatment Summary:</Typography>
                                    <Typography variant="body1" className="text-gray-600">{record.treatment_summary || 'No summary provided.'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" className="font-bold text-gray-700">Doctor's Notes:</Typography>
                                    <Typography variant="body2" className="text-gray-500 italic border-l-4 border-indigo-200 pl-3">{record.notes || 'None.'}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* --- Medications and Metadata --- */}
                    <Grid item xs={12} md={5}>
                        <Card elevation={3} className="rounded-xl shadow-lg">
                            <CardContent className="p-6">
                                <Typography variant="h5" className="text-indigo-700 font-semibold mb-4 border-b pb-2">
                                    Metadata & Prescriptions
                                </Typography>

                                <Box className="mb-4">
                                    <Typography variant="subtitle1" className="font-bold text-gray-700 flex items-center">
                                        <AssignmentTurnedInIcon className="text-sm mr-2" /> Attending Doctor ID:
                                    </Typography>
                                    <Typography variant="body1" className="text-gray-600 font-mono text-sm">{record.doctor_id}</Typography>
                                </Box>
                                <Box className="mb-4">
                                    <Typography variant="subtitle1" className="font-bold text-gray-700">Hospital ID:</Typography>
                                    <Typography variant="body1" className="text-gray-600">{record.hospital_id}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" className="font-bold text-gray-700 flex items-center">
                                        <MedicationIcon className="text-sm mr-2" /> Medications Prescribed:
                                    </Typography>
                                    {renderMedications(record.medications)}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default RecordDetail;