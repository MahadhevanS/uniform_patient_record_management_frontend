import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/shared/Header';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import NotFound from './pages/NotFound';
import { Container, Box, Typography } from '@mui/material'; 


import PatientRecords from './pages/Records/PatientRecords';
import RecordDetail from './pages/Records/RecordDetail';
import DoctorPatientSearch from './pages/Dashboard/DoctorPatientSearch'; 
import NewRecordForm from './pages/Records/NewRecordForm';
import DoctorSchedule from './pages/Dashboard/DoctorSchedule';
import AdminManagement from './pages/Dashboard/AdminManagement';
import AdminAnalytics from './pages/Dashboard/AdminAnalytics';
// --- End Corrected Imports ---

// --- Placeholder Components ---
const HomePage = () => <Container sx={{ mt: 4 }}><Typography variant="h4">Welcome to the Platform</Typography></Container>;
// --- End Placeholder Components ---


function App() {
  const { isAuthenticated, role } = useAuth();

  // Function to determine where to send the authenticated user upon navigating to '/'
  const getDashboardPath = () => {
    if (role === 'Doctor') return '/doctor/dashboard';
    if (role === 'Hospital Admin') return '/admin/dashboard';
    if (role === 'Patient') return '/patient/dashboard';
    // If authenticated but role is null/unknown (shouldn't happen), default to root
    return '/'; 
  };

  return (
    <>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          {/* -------------------- Public Routes -------------------- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to={getDashboardPath()} /> : <Login />} />
          <Route path="/register" element={<Register />} /> 
          {/* -------------------- Authenticated Routes (RBAC) -------------------- */}
          
          {/* PATIENT ROUTES (View self-records) */}
          <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            {/* The /patient/records route relies on the context user ID */}
            <Route path="/patient/records" element={<PatientRecords />} /> 
          </Route>

          {/* DOCTOR ROUTES (Search, view other patients' records, create new) */}
          <Route element={<ProtectedRoute allowedRoles={['Doctor']} />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<DoctorPatientSearch />} />
            
            <Route path="/doctor/schedule" element={<DoctorSchedule />} /> 
            {/* Doctor views A SPECIFIC PATIENT'S records (uses patientId from URL) */}
            <Route path="/doctor/records/:patientId" element={<PatientRecords />} />
            
            {/* Route to create a new record for a patient */}
            <Route path="/doctor/records/new/:patientId" element={<NewRecordForm />} />
          </Route>
          
          {/* HOSPITAL ADMIN ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['Hospital Admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage" element={<AdminManagement />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
          </Route>

          {/* SHARED/DETAIL ROUTE: RecordDetail is accessible by Patient (of that record), Doctor, and Admin */}
          <Route element={<ProtectedRoute allowedRoles={['Patient', 'Doctor', 'Hospital Admin']} />}>
            <Route path="/records/:recordId" element={<RecordDetail />} />
          </Route>


          {/* -------------------- Fallback -------------------- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;