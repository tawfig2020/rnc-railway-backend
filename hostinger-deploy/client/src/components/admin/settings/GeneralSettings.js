import React, { useState, useEffect } from 'react';
import {
  Box, Grid, TextField, Button, Typography, Switch, FormControlLabel,
  CircularProgress, Paper, Divider, Card, CardContent, CardHeader
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';

// General Settings component
const GeneralSettings = ({ onUpdate, onError }) => {
  // State for settings
  const [settings, setSettings] = useState({
    siteName: 'Refugee Aid Network',
    siteDescription: 'Supporting refugees with essential services and community support',
    contactEmail: 'contact@refugeeaid.org',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Main Street, Suite 200, New York, NY 10001',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    enableMaintenanceMode: false,
    maintenanceMessage: 'The site is currently undergoing scheduled maintenance. Please check back shortly.',
    enableFeatureFlags: {
      marketplace: true,
      donations: true,
      userRegistration: true,
      volunteerSignup: true,
      blog: true
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Load settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/admin/settings/general', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        
        if (response.data) {
          setSettings(response.data);
        }
      } catch (err) {
        console.error('Error fetching general settings:', err);
        onError && onError('Failed to load general settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('enableFeatureFlags.')) {
      const flag = name.split('.')[1];
      setSettings({
        ...settings,
        enableFeatureFlags: {
          ...settings.enableFeatureFlags,
          [flag]: checked
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axios.put('/api/admin/settings/general', settings, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      onUpdate && onUpdate('General settings updated successfully');
    } catch (err) {
      console.error('Error updating general settings:', err);
      onError && onError(err.response?.data?.message || 'Failed to update general settings');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Site Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Site Name"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Contact Email"
              name="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Site Description"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={settings.phoneNumber}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Address"
              name="address"
              value={settings.address}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Regional Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Timezone"
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              fullWidth
              required
              select
              SelectProps={{ native: true }}
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Central European (CET)</option>
              <option value="Asia/Tokyo">Japan (JST)</option>
              <option value="Australia/Sydney">Australia Eastern (AEST)</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Date Format"
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleChange}
              fullWidth
              required
              select
              SelectProps={{ native: true }}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Time Format"
              name="timeFormat"
              value={settings.timeFormat}
              onChange={handleChange}
              fullWidth
              required
              select
              SelectProps={{ native: true }}
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </TextField>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Maintenance Mode
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  name="enableMaintenanceMode"
                  checked={settings.enableMaintenanceMode}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Enable Maintenance Mode"
            />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              When enabled, the site will display a maintenance message to users. Admin users will still have full access.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Maintenance Message"
              name="maintenanceMessage"
              value={settings.maintenanceMessage}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              disabled={!settings.enableMaintenanceMode}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Feature Flags
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Switch
                  name="enableFeatureFlags.marketplace"
                  checked={settings.enableFeatureFlags.marketplace}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Marketplace"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Switch
                  name="enableFeatureFlags.donations"
                  checked={settings.enableFeatureFlags.donations}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Donations"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Switch
                  name="enableFeatureFlags.userRegistration"
                  checked={settings.enableFeatureFlags.userRegistration}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="User Registration"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Switch
                  name="enableFeatureFlags.volunteerSignup"
                  checked={settings.enableFeatureFlags.volunteerSignup}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Volunteer Signup"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Switch
                  name="enableFeatureFlags.blog"
                  checked={settings.enableFeatureFlags.blog}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Blog"
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mr: 2 }}
          onClick={() => window.location.reload()}
        >
          Reset
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={saving}
        >
          Save Settings
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default GeneralSettings;
