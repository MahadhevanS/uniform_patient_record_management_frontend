import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Alert, Card, CardContent, 
    CircularProgress, List, ListItem, ListItemText, Grid, Divider
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; 
import apiClient from '../../api/apiClient';

const AdminAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await apiClient.get('/users/admin/analytics');
                setAnalytics(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch analytics:", err.response?.data || err.message);
                setError(err.response?.data?.detail || "Failed to load analytics data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <Container maxWidth="md" className="flex justify-center items-center" sx={{ mt: 4 }}>
                <CircularProgress />
                <Typography className="ml-2">Loading System Analytics...</Typography>
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
    
    if (!analytics) return <Alert severity="info">No data available.</Alert>;


    // Helper component for KPI Cards
    const MetricCard = ({ title, value, icon: Icon, colorClass }) => (
        <Card elevation={4} className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <Box className={`p-4 ${colorClass}`}>
                <Box className="flex items-center justify-between">
                    <Icon className="text-white text-3xl opacity-80" />
                    <Typography variant="h4" className="text-white font-extrabold">
                        {value}
                    </Typography>
                </Box>
            </Box>
            <CardContent className="p-3">
                <Typography variant="subtitle2" className="font-semibold text-gray-600">
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );


    return (
        <Container 
            component="main" // Ensure this uses component="main" if needed for semantic structure
            maxWidth={false} 
            className="flex justify-center bg-gray-50 p-4" // Main container sets the light gray background and centers content
            sx={{ minHeight: 'calc(100vh - 64px)' }}
        >
            {/* 🚨 FIX: This Box wraps the content, giving it a white background and shadow 🚨 */}
            <Box className="w-full max-w-6xl p-10 bg-white rounded-2xl shadow-2xl transition-all duration-300">
                <Box className="flex items-center mb-6 pt-6 border-b pb-4">
                    <BarChartIcon className="text-indigo-600 text-3xl mr-3" />
                    <Typography variant="h4" className="text-gray-800 font-bold">
                        Platform Analytics & Reporting
                    </Typography>
                </Box>
                
                <Alert severity="success" className="mb-6 rounded-lg">
                    Data fetched successfully as of {new Date().toLocaleTimeString()}. Hospital ID: {analytics.hospital_id}.
                </Alert>
                
                {/* --- KPI Cards (Row 1) --- */}
                <Grid container spacing={4} className="mb-6" justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <MetricCard 
                            title="Total Registered Patients" 
                            value={analytics.total_patients} 
                            icon={GroupIcon} 
                            colorClass="bg-indigo-600" 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <MetricCard 
                            title="Total Medical Records" 
                            value={analytics.total_records} 
                            icon={MedicalInformationIcon} 
                            colorClass="bg-blue-600" 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <MetricCard 
                            title="Staff Affiliated to Your Hospital" 
                            value={analytics.hospital_staff_count} 
                            icon={PersonAddIcon} 
                            colorClass="bg-green-600" 
                        />
                    </Grid>
                </Grid>

                {/* --- Detailed Metrics (Row 2) --- */}
                <Card elevation={3} className="rounded-xl shadow-lg mt-8">
                    <CardContent className="p-6">
                        <Typography variant="h6" className="text-indigo-700 font-semibold mb-4 border-b pb-2">
                            Detailed System Breakdown
                        </Typography>
                        <List dense>
                            <ListItemText primary={`Hospital ID Reporting`} secondary={analytics.hospital_id} />
                            <Divider component="li" />
                            <ListItemText primary={`Total Patients (Global)`} secondary={analytics.total_patients} />
                            <Divider component="li" />
                            <ListItemText primary={`Total Records (Global)`} secondary={analytics.total_records} />
                            <Divider component="li" />
                            <ListItemText primary={`Total Doctors in Your Network`} secondary={analytics.hospital_staff_count} />
                        </List>
                    </CardContent>
                </Card>
            </Box> {/* 🚨 END FIX WRAPPER BOX 🚨 */}
        </Container>
    );
};

export default AdminAnalytics;