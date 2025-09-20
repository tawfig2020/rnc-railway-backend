import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Security,
  Download,
  Delete,
  Visibility,
  Email,
  Sms,
  Warning
} from '@mui/icons-material';
import api from '../services/api';
import ConsentManager from '../components/privacy/ConsentManager';

const PrivacySettings = () => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'members_only',
    dataRetention: true,
    communicationPreferences: {
      email: true,
      sms: false,
      newsletter: false
    }
  });
  const [consents, setConsents] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deletionScheduled, setDeletionScheduled] = useState(null);

  useEffect(() => {
    fetchPrivacySettings();
    fetchConsents();
  }, []);

  const fetchPrivacySettings = async () => {
    try {
      // This would be a real API call to get user privacy settings
      // For now, we'll simulate it
      setLoading(false);
    } catch (error) {
      setError('Failed to load privacy settings');
      setLoading(false);
    }
  };

  const fetchConsents = async () => {
    try {
      const response = await api.get('/privacy/consent');
      if (response.data.success) {
        setConsents(response.data.data.consents);
      }
    } catch (error) {
      console.error('Failed to load consents:', error);
    }
  };

  const handleSettingChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleCommunicationChange = (type, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      communicationPreferences: {
        ...prev.communicationPreferences,
        [type]: value
      }
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      
      const response = await api.put('/privacy/settings', privacySettings);
      
      if (response.data.success) {
        setSuccess('Privacy settings updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to update privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDataExport = async () => {
    try {
      const response = await api.post('/privacy/data-export');
      if (response.data.success) {
        setSuccess('Data export request submitted. You will receive an email with your data within 30 days.');
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (error) {
      setError('Failed to request data export');
    }
  };

  const handleAccountDeletion = async () => {
    try {
      const response = await api.post('/privacy/account-deletion', {
        reason: deleteReason
      });
      
      if (response.data.success) {
        setDeletionScheduled(response.data.data.scheduledDeletionDate);
        setDeleteDialogOpen(false);
        setSuccess(response.data.message);
      }
    } catch (error) {
      setError('Failed to schedule account deletion');
    }
  };

  const handleCancelDeletion = async () => {
    try {
      const response = await api.delete('/privacy/account-deletion');
      if (response.data.success) {
        setDeletionScheduled(null);
        setSuccess('Account deletion cancelled successfully');
      }
    } catch (error) {
      setError('Failed to cancel account deletion');
    }
  };

  const getConsentSummary = () => {
    const activeConsents = Object.entries(consents)
      .filter(([key, consent]) => key !== 'essential' && consent.given)
      .length;
    
    return `${activeConsents} of 4 optional consents granted`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 700, color: '#2A7D6F' }}>
        Privacy Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {deletionScheduled && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handleCancelDeletion}>
              Cancel Deletion
            </Button>
          }
        >
          <Typography variant="body2">
            <strong>Account Deletion Scheduled:</strong> Your account is scheduled for deletion on{' '}
            {new Date(deletionScheduled).toLocaleDateString()}. You can cancel this anytime before then.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Privacy Settings */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2A7D6F' }}>
              Privacy Settings
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Profile Visibility</InputLabel>
                <Select
                  value={privacySettings.profileVisibility}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  label="Profile Visibility"
                  startAdornment={<Visibility sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  <MenuItem value="public">Public - Visible to everyone</MenuItem>
                  <MenuItem value="members_only">Members Only - Visible to registered users</MenuItem>
                  <MenuItem value="private">Private - Only visible to you</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={privacySettings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', e.target.checked)}
                  />
                }
                label="Allow data retention for service improvement"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Communication Preferences
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={privacySettings.communicationPreferences.email}
                    onChange={(e) => handleCommunicationChange('email', e.target.checked)}
                  />
                }
                label={
                  <Box display="flex" alignItems="center">
                    <Email sx={{ mr: 1, fontSize: 20 }} />
                    Email notifications
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={privacySettings.communicationPreferences.sms}
                    onChange={(e) => handleCommunicationChange('sms', e.target.checked)}
                  />
                }
                label={
                  <Box display="flex" alignItems="center">
                    <Sms sx={{ mr: 1, fontSize: 20 }} />
                    SMS notifications
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={privacySettings.communicationPreferences.newsletter}
                    onChange={(e) => handleCommunicationChange('newsletter', e.target.checked)}
                  />
                }
                label={
                  <Box display="flex" alignItems="center">
                    <Email sx={{ mr: 1, fontSize: 20 }} />
                    Newsletter and updates
                  </Box>
                }
              />
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={saveSettings}
                disabled={saving}
                sx={{ 
                  backgroundColor: '#2A7D6F',
                  '&:hover': { backgroundColor: '#1e5a4f' }
                }}
              >
                {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Settings'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2A7D6F' }}>
              Consent Management
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {getConsentSummary()}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {Object.entries(consents).map(([key, consent]) => (
                  key !== 'essential' && (
                    <Chip
                      key={key}
                      label={key}
                      size="small"
                      color={consent.given ? 'success' : 'default'}
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  )
                ))}
              </Box>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Security />}
              onClick={() => setConsentDialogOpen(true)}
              sx={{ mb: 2 }}
            >
              Manage Consent
            </Button>
          </Paper>

          {/* Data Rights */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2A7D6F' }}>
              Your Data Rights
            </Typography>

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent sx={{ pb: 1 }}>
                <Typography variant="body2">
                  <strong>Export Your Data</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Download a copy of all your personal data
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<Download />}
                  onClick={handleDataExport}
                >
                  Request Export
                </Button>
              </CardActions>
            </Card>

            <Card variant="outlined" sx={{ border: '1px solid #f44336' }}>
              <CardContent sx={{ pb: 1 }}>
                <Typography variant="body2" color="error">
                  <strong>Delete Account</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Permanently delete your account and all data
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={!!deletionScheduled}
                >
                  {deletionScheduled ? 'Deletion Scheduled' : 'Delete Account'}
                </Button>
              </CardActions>
            </Card>
          </Paper>
        </Grid>
      </Grid>

      {/* Consent Manager Dialog */}
      <ConsentManager
        open={consentDialogOpen}
        onClose={() => setConsentDialogOpen(false)}
        onConsentUpdate={(newConsents) => {
          setConsents(newConsents);
          setSuccess('Consent preferences updated successfully');
        }}
      />

      {/* Account Deletion Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" color="error.main">
            <Warning sx={{ mr: 1 }} />
            Delete Account
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>This action cannot be undone.</strong> Your account will be scheduled for deletion in 30 days. 
              You can cancel this request anytime before then.
            </Typography>
          </Alert>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for deletion (optional)"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            placeholder="Help us improve by telling us why you're leaving..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleAccountDeletion}
          >
            Schedule Deletion
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PrivacySettings;
