import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Alert } from '@mui/material';
import AdminPanel from '../components/admin/AdminPanel';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // In a real application, you would check if the user is authenticated and has admin privileges
  useEffect(() => {
    // Simulate authentication check
    const checkAuth = async () => {
      try {
        // This would be an API call to verify admin status in a real app
        // For now, we'll simulate authentication for demo purposes
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          // Check if user has admin role
          if (userData.role === 'admin') {
            setIsAuthorized(true);
          }
        }
        
        // For demo purposes, allow access without authentication
        // Remove this in production and use proper authentication
        setIsAuthorized(true);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5">Loading admin dashboard...</Typography>
        </Paper>
      </Container>
    );
  }

  if (!isAuthorized) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          You do not have permission to access this page.
        </Alert>
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5">Access Denied</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Please log in with an administrator account to access the admin dashboard.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 4, backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 128px)' }}>
      <Container maxWidth="xl">
        <AdminPanel />
      </Container>
    </Box>
  );
};

export default AdminDashboard;
