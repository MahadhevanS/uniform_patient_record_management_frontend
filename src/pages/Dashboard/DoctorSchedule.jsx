import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Paper, List, ListItem, 
    ListItemText, Divider, Alert, CircularProgress 
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

const DoctorSchedule = () => {
    const { user } = useAuth();
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedule = () => {
            setLoading(true);
            setError(null);
            
            // --- SIMULATED FETCH FOR SCHEDULE DATA (Keep as placeholder) ---
            setTimeout(() => {
                try {
                    const fakeSchedule = [
                        { id: 1, date: '2025-10-01', time: '08:00 - 16:00', location: 'City General Hospital, Ward C', type: 'Clinical Shift' },
                        { id: 2, date: '2025-10-02', time: '10:00 - 14:00', location: 'Regional Care Center, Outpatient', type: 'Appointments' },
                        { id: 3, date: '2025-10-04', time: '14:00 - 18:00', location: 'City General Hospital, ER', type: 'Emergency Duty' },
                    ];
                    setSchedule(fakeSchedule);
                } catch (e) {
                    setError("Failed to load schedule data.");
                } finally {
                    setLoading(false);
                }
            }, 1000);
        };

        if (user) {
            fetchSchedule();
        }
    }, [user]);

    if (!user) return <Alert severity="warning">Please log in to view your schedule.</Alert>;
    
    if (loading) {
        return (
            <Container maxWidth="md" className="flex justify-center items-center" sx={{ mt: 4 }}>
                <CircularProgress />
                <Typography className="ml-2">Loading Schedule...</Typography>
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
            maxWidth="lg" 
            className="py-8 min-h-[calc(100vh-64px)] bg-gray-50"
        >
            <Box className="mx-auto max-w-4xl p-8 bg-white rounded-xl shadow-xl">
                <Box className="flex items-center mb-6 border-b pb-4">
                    <CalendarTodayIcon className="text-indigo-600 text-3xl mr-3" />
                    <Typography variant="h4" className="text-gray-800 font-bold">
                        Dr. {user.email}'s Schedule
                    </Typography>
                </Box>
                
                <Typography variant="body1" className="text-gray-600 mb-6">
                    Upcoming shifts and duties managed by your affiliated hospital.
                </Typography>

                <Paper elevation={0} className="border border-gray-200 rounded-lg">
                    {schedule && schedule.length > 0 ? (
                        <List className="p-0">
                            {schedule.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <ListItem className="py-3 px-4 hover:bg-indigo-50 transition-colors">
                                        <ListItemText
                                            primary={
                                                <Box className="flex justify-between items-center">
                                                    <Typography className="font-semibold text-indigo-700">
                                                        {item.date} ({item.time})
                                                    </Typography>
                                                    <Typography className="text-sm text-gray-500">
                                                        {item.type}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={item.location}
                                        />
                                    </ListItem>
                                    {index < schedule.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Alert severity="info" className="m-4">No upcoming schedule entries found.</Alert>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default DoctorSchedule;