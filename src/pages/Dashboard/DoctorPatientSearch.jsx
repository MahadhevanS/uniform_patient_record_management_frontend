import React, { useState } from 'react';
import { 
    Container, Typography, Box, TextField, Button, 
    Paper, CircularProgress, Alert, List, ListItem, 
    ListItemText, Divider 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';

const DoctorPatientSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const muiFieldProps = {
        sx: { '& .MuiOutlinedInput-root': { borderRadius: '8px' } }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setSearchResults([]);

        if (searchTerm.length < 2) {
            setError("Please enter at least 2 characters to search.");
            setLoading(false);
            return;
        }

        try {
            const response = await apiClient.get('/users/patients/search', {
                params: { query: searchTerm }
            });
            
            setSearchResults(response.data);
            
        } catch (err) {
            console.error("Patient search failed:", err.response?.data?.detail || err.message);
            
            if (err.response?.status === 404) {
                 setError("No patients found matching your query.");
            } else {
                 setError(err.response?.data?.detail || "An error occurred during search. Check server logs or permissions.");
            }
            
        } finally {
            setLoading(false);
        }
    };

    const handleViewRecords = (patientId) => {
        navigate(`/doctor/records/${patientId}`);
    };

    return (
        <Container 
            maxWidth="lg" 
            className="py-8 min-h-[calc(100vh-64px)] bg-gray-50"
        >
            <Box className="mx-auto max-w-4xl p-8 bg-white rounded-xl shadow-2xl">
                <Typography variant="h4" className="text-gray-800 font-bold mb-2">
                    Patient Search Tool
                </Typography>
                <Typography variant="body1" className="text-gray-500 mb-6 border-b pb-3">
                    Search by Name or Email to access unified health records.
                </Typography>

                <Paper elevation={0} className="p-4 mb-6 border border-indigo-200 bg-indigo-50 rounded-lg">
                    <Box component="form" onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <TextField
                            {...muiFieldProps}
                            fullWidth
                            label="Patient Name or Email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                        />
                        <Button 
                            type="submit" 
                            variant="contained" 
                            startIcon={<SearchIcon />} 
                            disabled={loading || searchTerm.length < 2}
                            className="!bg-indigo-600 hover:!bg-indigo-700 py-3 rounded-lg font-semibold transition-colors"
                            sx={{ minWidth: { sm: '150px' } }}
                        >
                            {loading ? <CircularProgress size={24} className="text-white" /> : 'Search'}
                        </Button>
                    </Box>
                </Paper>

                {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                
                {/* Display Results */}
                {searchResults.length > 0 && (
                    <Paper elevation={1} className="p-4 mt-6 border border-gray-200 rounded-lg">
                        <Typography variant="h6" className="text-indigo-700 font-semibold mb-3">
                            Search Results ({searchResults.length})
                        </Typography>
                        <List className="p-0">
                            {searchResults.map((patient) => (
                                <div key={patient.user_id}>
                                    <ListItem
                                        className="py-3 px-0 hover:bg-gray-50 transition-colors"
                                        secondaryAction={
                                            <Button 
                                                variant="outlined" 
                                                size="small"
                                                startIcon={<VisibilityIcon fontSize="small" />}
                                                onClick={() => handleViewRecords(patient.user_id)}
                                                className="border-indigo-500 text-indigo-500 hover:!bg-indigo-50"
                                            >
                                                View Records
                                            </Button>
                                        }
                                    >
                                        <ListItemText
                                            primary={<Typography className="font-medium">{patient.full_name}</Typography>}
                                            secondary={`DOB: ${patient.date_of_birth || 'N/A'} | Contact: ${patient.contact_number || 'N/A'} | ID: ${patient.user_id.substring(0, 8)}...`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>
        </Container>
    );
};

export default DoctorPatientSearch;