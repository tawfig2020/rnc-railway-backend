import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await axios.get(`${API_URL}/api/auth/verify-email/${token}`);
        
        if (response.data.success) {
          setIsVerified(true);
        } else {
          setError(response.data.message || 'Verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        
        if (error.response && error.response.data) {
          setError(error.response.data.message || 'Verification failed. The link may be expired or invalid.');
        } else if (error.request) {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError('Verification failed. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    if (token) {
      verifyEmail();
    } else {
      setError('No verification token provided.');
      setIsLoading(false);
    }
  }, [token]);
  
  const handleContinue = () => {
    navigate('/login');
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" py={4}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
          <Typography variant="h6">Verifying your email...</Typography>
        </Box>
      );
    }
    
    if (isVerified) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" py={4}>
          <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Email Verified Successfully!
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
            Thank you for verifying your email address. You can now log in to your account.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={handleContinue}
          >
            Continue to Login
          </Button>
        </Box>
      );
    }
    
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={4}>
        <ErrorIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Verification Failed
        </Typography>
        <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
          {error}
        </Alert>
        <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
          You can request a new verification email from the login page.
        </Typography>
        <Box display="flex" gap={2}>
          <Button 
            component={RouterLink} 
            to="/login" 
            variant="contained" 
            color="primary"
          >
            Go to Login
          </Button>
          <Button
            component={RouterLink}
            to="/resend-verification"
            variant="outlined"
          >
            Resend Verification
          </Button>
        </Box>
      </Box>
    );
  };
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Email Verification
        </Typography>
        {renderContent()}
      </Paper>
    </Container>
  );
};

export default VerifyEmail;
