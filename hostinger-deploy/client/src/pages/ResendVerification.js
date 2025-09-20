import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Link, Alert, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/api/auth/resend-verification`, 
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess(true);
    } catch (error) {
      console.error('Resend verification error:', error);
      
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Failed to resend verification email');
      } else if (error.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to send verification email. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Resend Verification Email
        </Typography>
        
        {success ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={2}>
            <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
              If your email exists in our system and is not already verified, a new verification email has been sent.
            </Alert>
            <Typography variant="body1" align="center" sx={{ mb: 3 }}>
              Please check your inbox and spam folder for the verification link.
            </Typography>
            <Button component={RouterLink} to="/login" variant="contained" color="primary">
              Return to Login
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="body1" align="center" sx={{ mb: 3 }}>
              Enter your email address below to receive a new verification email.
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Send Verification Email'
              )}
            </Button>
            
            <Box display="flex" justifyContent="center" mt={2}>
              <Link component={RouterLink} to="/login" variant="body2">
                Return to login
              </Link>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ResendVerification;
