import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, List, ListItem, ListItemText, 
    Divider, Alert, CircularProgress, Paper, Button
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import HistoryIcon from '@mui/icons-material/History';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const PatientRecords = () => {
    const { user, role, loading: authLoading } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get patientId from URL for Doctors, or use currentUser ID for Patients
    const { patientId: urlPatientId } = useParams(); 
    const targetPatientId = role === 'Patient' ? user?.id : urlPatientId;

    useEffect(() => {
        if (authLoading || !targetPatientId) return;

        const fetchRecords = async () => {
            try {
                // Endpoint: GET /records/{patientId or userId}
                const response = await apiClient.get(`/records/${targetPatientId}`);
                setRecords(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch medical records:", err);
                setError(err.response?.data?.detail || "Could not load records. Check patient ID or permissions.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, [authLoading, targetPatientId, role]);

    const title = role === 'Patient' ? "My Complete Medical History" : `Records for Patient ID: ${targetPatientId ? targetPatientId.substring(0, 8) + '...' : 'N/A'}`;

    if (authLoading || loading) {
        return (
            <Container maxWidth="md" className="flex justify-center items-center" sx={{ minHeight: 'calc(100vh - 64px)' }}>
                <CircularProgress />
                <Typography className="ml-2">Loading Records...</Typography>
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
    

    return (
        <Container 
            component="main"
            maxWidth={false} 
            className="flex justify-center bg-gray-50 p-4"
            sx={{ minHeight: 'calc(100vh - 64px)' }}
        >
            <Box className="w-full max-w-5xl p-10 bg-white rounded-2xl shadow-2xl">
                {/* Header */}
                <Box className="flex items-center mb-6 pt-2 border-b pb-4">
                    <HistoryIcon className="text-indigo-600 text-3xl mr-3" />
                    <Typography variant="h4" className="text-gray-800 font-bold">
                        {title}
                    </Typography>
                </Box>

                <Alert severity={records.length > 0 ? "success" : "info"} className="mb-4 rounded-lg">
                    Total Records Found: <span className="font-bold">{records.length}</span>
                    {role === 'Doctor' && records.length > 0 && 
                        <Button 
                            component={Link}
                            to={`/doctor/records/new/${targetPatientId}`}
                            size="small"
                            variant="text"
                            className="ml-4 text-indigo-600 hover:text-indigo-800"
                        >
                            + Add New Record
                        </Button>
                    }
                </Alert>

                {/* Records List */}
                <Paper elevation={0} className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                    {records.length === 0 ? (
                        <Box className="p-4">
                            <Alert severity="info">No medical records found for this patient.</Alert>
                        </Box>
                    ) : (
                        <List className="p-0">
                            {records.map((record) => (
                                <React.Fragment key={record.id}>
                                    <ListItem 
                                        button 
                                        component={Link} 
                                        // Link to the shared detail route
                                        to={`/records/${record.id}`}
                                        className="py-3 px-6 hover:bg-indigo-50 transition-colors"
                                    >
                                        <ListItemText
                                            primary={
                                                <Box className="flex justify-between items-center">
                                                    <Typography className="font-semibold text-gray-800">
                                                        {`Visit on ${new Date(record.date_of_visit).toLocaleDateString()}`}
                                                    </Typography>
                                                    <Typography className={`text-sm font-medium ${role === 'Patient' ? 'text-indigo-600' : 'text-pink-600'}`}>
                                                        Diagnosis: {record.diagnosis}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box className="flex justify-between text-gray-500 text-sm mt-1">
                                                    <span>Hospital ID: {record.hospital_id}</span>
                                                    <span>Chief Complaint: {record.chief_complaint}</span>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default PatientRecords;