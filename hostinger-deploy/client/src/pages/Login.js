import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Link, Grid, Alert, CircularProgress, Tabs, Tab, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'refugee'
  });
  
  const [selectedTab, setSelectedTab] = useState(0);
  const roleOptions = [
    { value: 'refugee', label: 'Refugee' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'staff', label: 'Staff' },
    { value: 'admin', label: 'Admin' },
    { value: 'partner', label: 'Partner' },
    { value: 'vendor', label: 'Vendor' }
  ];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === 'development');
  const [debugInfo, setDebugInfo] = useState(null);
  
  // API URL is now handled by the authService

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Clear field-specific errors when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setDebugInfo({});
    
    try {
      // Store request info for debugging
      setDebugInfo({
        requestData: formData
      });
      
      // Use the authService login function - only send email and password
      const loginCredentials = {
        email: formData.email,
        password: formData.password
      };
      const user = await login(loginCredentials);
      setDebugInfo(prev => ({ ...prev, response: { user } }));
      
      if (user && user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Enhanced debug info
      const debugData = {
        errorMessage: error.message,
        errorName: error.name,
        errorStack: error.stack,
        errorResponse: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response',
      };
      
      setDebugInfo(prev => ({ ...prev, error: debugData }));
      
      // Set appropriate error message
      if (error.response && error.response.data) {
        if (error.response.data.error) {
          setError(error.response.data.error);
        } else if (error.response.data.msg) {
          setError(error.response.data.msg);
        } else if (error.response.data.errors && error.response.data.errors.length > 0) {
          setError(error.response.data.errors[0].msg);
        } else {
          setError(`Error: ${error.response.status} - ${error.response.statusText}`);
        }
      } else if (error.request) {
        setError('Network error. Please check your connection or try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    
    // Set the role based on tab selection
    if (newValue === 0) {
      setFormData({ ...formData, role: 'refugee' });
    } else if (newValue === 1) {
      setFormData({ ...formData, role: formData.role || 'volunteer' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Log In
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          Access your Refugee Network Centre account
        </Typography>
        
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Refugee" />
          <Tab label="Staff & Partners" />
        </Tabs>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ mt: 1 }}>
                <Button size="small" onClick={() => setShowDebug(!showDebug)}>
                  {showDebug ? 'Hide' : 'Show'} Debug Info
                </Button>
              </Box>
            )}
          </Alert>
        )}
        
        {process.env.NODE_ENV === 'development' && showDebug && debugInfo && (
          <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, overflow: 'auto' }}>
            <Typography variant="subtitle2" gutterBottom>
              Debug Information
            </Typography>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.7rem' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </Typography>
          </Box>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          
          {selectedTab === 1 && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label">Select Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={formData.role}
                label="Select Role"
                name="role"
                onChange={handleChange}
              >
                {roleOptions.slice(1).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          {/* API URL is handled by authService */}
          <Grid container>
            <Grid item xs>
              <Link component={RouterLink} to="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
