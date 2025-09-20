import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Grid, Button, Paper, CircularProgress,
  FormControlLabel, Switch, Divider, MenuItem, Alert, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  Send as SendIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import axios from 'axios';

// Email Settings component
const EmailSettings = ({ onUpdate, onError }) => {
  // State for settings
  const [settings, setSettings] = useState({
    emailProvider: 'smtp',
    smtpHost: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
    smtpSecure: true,
    fromEmail: '',
    fromName: 'Refugee Aid Network',
    replyTo: '',
    enableEmailNotifications: true,
    emailTemplates: {
      welcome: {
        subject: 'Welcome to Refugee Aid Network',
        enabled: true
      },
      donation: {
        subject: 'Thank You for Your Donation',
        enabled: true
      },
      orderConfirmation: {
        subject: 'Your Order Confirmation',
        enabled: true
      },
      passwordReset: {
        subject: 'Password Reset Request',
        enabled: true
      }
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [testEmailDialogOpen, setTestEmailDialogOpen] = useState(false);
  
  // Load settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/admin/settings/email', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        
        if (response.data) {
          // Mask password if it exists
          const data = response.data;
          if (data.smtpPassword) {
            data.smtpPassword = '••••••••';
          }
          setSettings(data);
        }
      } catch (err) {
        console.error('Error fetching email settings:', err);
        onError && onError('Failed to load email settings');
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
    
    if (name.includes('.')) {
      // Handle nested properties
      const [parent, child, subChild] = name.split('.');
      if (subChild) {
        setSettings({
          ...settings,
          [parent]: {
            ...settings[parent],
            [child]: {
              ...settings[parent][child],
              [subChild]: type === 'checkbox' ? checked : value
            }
          }
        });
      } else {
        setSettings({
          ...settings,
          [parent]: {
            ...settings[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        });
      }
    } else {
      setSettings({
        ...settings,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Open test email dialog
  const openTestEmailDialog = () => {
    setTestEmailAddress('');
    setTestEmailDialogOpen(true);
  };
  
  // Send test email
  const sendTestEmail = async () => {
    setSendingTestEmail(true);
    
    try {
      await axios.post('/api/admin/settings/email/test', 
        { email: testEmailAddress },
        { headers: { 'x-auth-token': localStorage.getItem('token') }}
      );
      
      onUpdate && onUpdate('Test email sent successfully');
      setTestEmailDialogOpen(false);
    } catch (err) {
      console.error('Error sending test email:', err);
      onError && onError(err.response?.data?.message || 'Failed to send test email');
    } finally {
      setSendingTestEmail(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Don't send password if it's masked
      const dataToSend = {...settings};
      if (dataToSend.smtpPassword === '••••••••') {
        delete dataToSend.smtpPassword;
      }
      
      await axios.put('/api/admin/settings/email', dataToSend, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      onUpdate && onUpdate('Email settings updated successfully');
    } catch (err) {
      console.error('Error updating email settings:', err);
      onError && onError(err.response?.data?.message || 'Failed to update email settings');
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
          Email Provider Configuration
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Email Provider"
              name="emailProvider"
              value={settings.emailProvider}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="smtp">SMTP Server</MenuItem>
              <MenuItem value="sendgrid">SendGrid</MenuItem>
              <MenuItem value="mailchimp">Mailchimp</MenuItem>
              <MenuItem value="ses">Amazon SES</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  name="enableEmailNotifications"
                  checked={settings.enableEmailNotifications}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Enable Email Notifications"
            />
          </Grid>
          
          {settings.emailProvider === 'smtp' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  label="SMTP Host"
                  name="smtpHost"
                  value={settings.smtpHost}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="SMTP Port"
                  name="smtpPort"
                  type="number"
                  value={settings.smtpPort}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="SMTP Username"
                  name="smtpUsername"
                  value={settings.smtpUsername}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="SMTP Password"
                  name="smtpPassword"
                  type={showPassword ? "text" : "password"}
                  value={settings.smtpPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="smtpSecure"
                      checked={settings.smtpSecure}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Use Secure Connection (TLS/SSL)"
                />
              </Grid>
            </>
          )}
          
          {settings.emailProvider === 'sendgrid' && (
            <Grid item xs={12}>
              <TextField
                label="SendGrid API Key"
                name="sendgridApiKey"
                type={showPassword ? "text" : "password"}
                value={settings.sendgridApiKey || ''}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
              />
            </Grid>
          )}
          
          {/* Similar config for other providers... */}
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Email Identity
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="From Email"
              name="fromEmail"
              type="email"
              value={settings.fromEmail}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="From Name"
              name="fromName"
              value={settings.fromName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Reply To Email (optional)"
              name="replyTo"
              type="email"
              value={settings.replyTo}
              onChange={handleChange}
              fullWidth
              helperText="Leave empty to use From Email"
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Email Templates
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => alert('This would open the email template editor')}
          >
            Edit Templates
          </Button>
        </Box>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          You can enable/disable system email templates below. To edit the content of each template, click the 'Edit Templates' button.
        </Alert>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1" fontWeight="medium">
                  Welcome Email
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      name="emailTemplates.welcome.enabled"
                      checked={settings.emailTemplates.welcome.enabled}
                      onChange={handleChange}
                      color="primary"
                      size="small"
                    />
                  }
                  label="Enabled"
                />
              </Box>
              <TextField
                label="Subject"
                name="emailTemplates.welcome.subject"
                value={settings.emailTemplates.welcome.subject}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1" fontWeight="medium">
                  Donation Receipt
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      name="emailTemplates.donation.enabled"
                      checked={settings.emailTemplates.donation.enabled}
                      onChange={handleChange}
                      color="primary"
                      size="small"
                    />
                  }
                  label="Enabled"
                />
              </Box>
              <TextField
                label="Subject"
                name="emailTemplates.donation.subject"
                value={settings.emailTemplates.donation.subject}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1" fontWeight="medium">
                  Order Confirmation
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      name="emailTemplates.orderConfirmation.enabled"
                      checked={settings.emailTemplates.orderConfirmation.enabled}
                      onChange={handleChange}
                      color="primary"
                      size="small"
                    />
                  }
                  label="Enabled"
                />
              </Box>
              <TextField
                label="Subject"
                name="emailTemplates.orderConfirmation.subject"
                value={settings.emailTemplates.orderConfirmation.subject}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1" fontWeight="medium">
                  Password Reset
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      name="emailTemplates.passwordReset.enabled"
                      checked={settings.emailTemplates.passwordReset.enabled}
                      onChange={handleChange}
                      color="primary"
                      size="small"
                    />
                  }
                  label="Enabled"
                />
              </Box>
              <TextField
                label="Subject"
                name="emailTemplates.passwordReset.subject"
                value={settings.emailTemplates.passwordReset.subject}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button 
          variant="outlined"
          color="info"
          sx={{ mr: 2 }}
          onClick={openTestEmailDialog}
          startIcon={<SendIcon />}
        >
          Test Email
        </Button>
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
      
      {/* Test Email Dialog */}
      <Dialog open={testEmailDialogOpen} onClose={() => setTestEmailDialogOpen(false)}>
        <DialogTitle>Send Test Email</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph sx={{ mt: 1 }}>
            Send a test email to verify your email configuration is working correctly.
          </Typography>
          <TextField
            label="Recipient Email"
            type="email"
            fullWidth
            value={testEmailAddress}
            onChange={(e) => setTestEmailAddress(e.target.value)}
            required
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestEmailDialogOpen(false)}>Cancel</Button>
          <LoadingButton 
            onClick={sendTestEmail} 
            loading={sendingTestEmail}
            variant="contained"
            disabled={!testEmailAddress || !testEmailAddress.includes('@')}
          >
            Send Test
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailSettings;
