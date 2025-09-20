import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, FormControl, InputLabel, Select, MenuItem, 
  FormHelperText, Grid, Switch, FormControlLabel, Box,
  Typography, Divider, Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// User Form component for creating and editing users
const UserForm = ({ open, onClose, onSave, user, isEditing }) => {
  // Default empty user state
  const defaultUser = {
    name: '',
    email: '',
    role: 'refugee',
    status: 'active',
    password: '',
    confirmPassword: '',
    sendWelcomeEmail: true,
    sendCredentials: false
  };
  
  // Local state for form data and validation
  const [formData, setFormData] = useState(isEditing && user ? { ...user, password: '', confirmPassword: '' } : defaultUser);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Update form data when user prop changes
  useEffect(() => {
    if (isEditing && user) {
      setFormData({ 
        ...user, 
        password: '', 
        confirmPassword: '',
        sendWelcomeEmail: false,
        sendCredentials: false
      });
    } else {
      setFormData(defaultUser);
    }
  }, [isEditing, user]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation for new users or when changing password
    if (!isEditing || (formData.password && formData.password.length > 0)) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      
      // Create data object for submission
      const userData = {
        ...formData
      };
      
      // Remove unnecessary fields
      delete userData.confirmPassword;
      if (isEditing && !userData.password) {
        delete userData.password;
      }
      
      try {
        await onSave(userData);
        onClose();
      } catch (error) {
        console.error('Error saving user:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? `Edit User: ${user?.name}` : 'Create New User'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            User Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Full Name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel>User Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="User Role"
                  onChange={handleChange}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="volunteer">Volunteer</MenuItem>
                  <MenuItem value="refugee">Refugee</MenuItem>
                </Select>
                <FormHelperText>{errors.role}</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>User Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="User Status"
                  onChange={handleChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                  <MenuItem value="pending">Pending Activation</MenuItem>
                </Select>
                <FormHelperText>{errors.status}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            {isEditing ? 'Change Password' : 'Security Credentials'}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                name="password"
                label={isEditing ? "New Password (leave blank to keep current)" : "Password"}
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required={!isEditing}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required={!isEditing || formData.password.length > 0}
                disabled={isEditing && !formData.password}
              />
            </Grid>
          </Grid>
          
          {!isEditing && (
            <>
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Notifications
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="sendWelcomeEmail"
                        checked={formData.sendWelcomeEmail}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label="Send welcome email to the new user"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="sendCredentials"
                        checked={formData.sendCredentials}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label="Include login credentials in the email"
                  />
                </Grid>
              </Grid>
              
              {formData.sendCredentials && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Sending login credentials via email is less secure. Consider using a temporary password and requiring the user to change it on first login.
                  </Typography>
                </Alert>
              )}
            </>
          )}
          
          {formData.role === 'admin' && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> Admins have full access to the system including user management and configuration settings.
              </Typography>
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton 
          onClick={handleSubmit} 
          variant="contained"
          loading={loading}
        >
          {isEditing ? 'Save Changes' : 'Create User'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
