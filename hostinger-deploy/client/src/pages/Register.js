import React, { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Link, Grid, Checkbox, FormControlLabel, Alert, Snackbar, CircularProgress, Card, CardContent } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

// API URL for debugging display
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Clear any previous errors when component mounts
    setError('');
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'agreeTerms' ? e.target.checked : e.target.value,
    });
    
    // Clear errors when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await register(formData);
      
      if (result.success) {
        setSuccess(result.message || 'Registration successful!');
        
        // Clear form after successful registration
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          location: '',
          agreeTerms: false
        });
        
        // Redirect based on whether verification is required
        setTimeout(() => {
          if (result.requiresVerification) {
            navigate('/verify-email');
          } else {
            navigate('/login');
          }
        }, 2000);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Registration failed');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Join the Refugee Network Centre community
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Box sx={{ mt: 1 }}>
              <Button size="small" onClick={() => setShowDebug(!showDebug)}>
                {showDebug ? 'Hide' : 'Show'} Debug Info
              </Button>
            </Box>
          </Alert>
        )}
        
        {showDebug && debugInfo && (
          <Card variant="outlined" sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Debug Information
              </Typography>
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.7rem' }}>
                {JSON.stringify(debugInfo, null, 2)}
              </Typography>
            </CardContent>
          </Card>
        )}
        
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Registration successful! Redirecting to login...
          </Alert>
        </Snackbar>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="location"
                label="Location"
                name="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location || 'Enter your city or location'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    name="agreeTerms" 
                    color="primary" 
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                }
                label="I agree to the Terms of Service and Privacy Policy"
              />
              {errors.agreeTerms && (
                <Typography color="error" variant="caption" display="block">
                  {errors.agreeTerms}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !formData.agreeTerms}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
          
          <Typography variant="caption" color="textSecondary" display="block" align="center" sx={{ mb: 1 }}>
            Using API: {API_URL}/api
          </Typography>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
