import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Button, TextField, CircularProgress, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const VerificationPending = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResendEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/auth/resend-verification', { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Email Verification Required
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your account has been created, but you need to verify your email address before you can log in.
          </Typography>
        </Box>

        <Box sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
          <Typography variant="body1" paragraph>
            A verification email has been sent to your email address. Please check your inbox and click the verification link to activate your account.
          </Typography>
          
          <Typography variant="body1" paragraph>
            If you don&apos;t see the email in your inbox, please check your spam or junk folder.
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Once you verify your email, you&apos;ll be able to log in to your account and access all features of the Refugee Network Centre.
            </Typography>
          </Alert>
        </Box>

        <Box sx={{ maxWidth: '400px', mx: 'auto', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Didn&apos;t receive the email?
          </Typography>
          
          <form onSubmit={handleResendEmail}>
            <TextField
              fullWidth
              label="Your Email Address"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              type="submit"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </form>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button component={RouterLink} to="/login" variant="text" color="primary">
              Back to Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerificationPending;
