import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControlLabel,
  Switch,
  Box,
  Divider,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import {
  ExpandMore,
  Security,
  Analytics,
  Campaign,
  DataUsage,
  Share
} from '@mui/icons-material';
import api from '../../services/api';

const ConsentManager = ({ open, onClose, onConsentUpdate }) => {
  const [consents, setConsents] = useState({
    essential: { given: true, timestamp: null },
    analytics: { given: false, timestamp: null },
    marketing: { given: false, timestamp: null },
    dataProcessing: { given: false, timestamp: null },
    thirdParty: { given: false, timestamp: null }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) {
      fetchConsents();
    }
  }, [open]);

  const fetchConsents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/privacy/consent');
      if (response.data.success) {
        setConsents(response.data.data.consents);
      }
    } catch (error) {
      setError('Failed to load consent preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleConsentChange = (consentType, value) => {
    setConsents(prev => ({
      ...prev,
      [consentType]: {
        ...prev[consentType],
        given: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      const response = await api.post('/privacy/consent', {
        analytics: consents.analytics.given,
        marketing: consents.marketing.given,
        dataProcessing: consents.dataProcessing.given,
        thirdParty: consents.thirdParty.given,
        consentMethod: 'explicit_consent'
      });

      if (response.data.success) {
        setSuccess('Consent preferences updated successfully');
        if (onConsentUpdate) {
          onConsentUpdate(consents);
        }
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 2000);
      }
    } catch (error) {
      setError('Failed to update consent preferences');
    } finally {
      setSaving(false);
    }
  };

  const consentCategories = [
    {
      key: 'essential',
      title: 'Essential Cookies & Functionality',
      description: 'Required for the website to function properly. These cannot be disabled.',
      icon: <Security color="primary" />,
      required: true,
      details: [
        'User authentication and session management',
        'Security features and fraud prevention',
        'Basic website functionality',
        'Accessibility features'
      ]
    },
    {
      key: 'analytics',
      title: 'Analytics & Performance',
      description: 'Help us understand how you use our website to improve your experience.',
      icon: <Analytics color="info" />,
      required: false,
      details: [
        'Website usage statistics',
        'Performance monitoring',
        'Error tracking and debugging',
        'User journey analysis'
      ]
    },
    {
      key: 'marketing',
      title: 'Marketing & Communications',
      description: 'Allow us to send you relevant updates and promotional content.',
      icon: <Campaign color="warning" />,
      required: false,
      details: [
        'Newsletter and program updates',
        'Event notifications',
        'Promotional offers',
        'Personalized content recommendations'
      ]
    },
    {
      key: 'dataProcessing',
      title: 'Data Processing & Improvement',
      description: 'Use your data to improve our services and develop new features.',
      icon: <DataUsage color="success" />,
      required: false,
      details: [
        'Service improvement analysis',
        'Feature development insights',
        'User experience optimization',
        'Research and development'
      ]
    },
    {
      key: 'thirdParty',
      title: 'Third-Party Integrations',
      description: 'Share data with trusted partners to enhance your experience.',
      icon: <Share color="secondary" />,
      required: false,
      details: [
        'Social media integrations',
        'Payment processing',
        'Map and location services',
        'External content and widgets'
      ]
    }
  ];

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading consent preferences...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Security sx={{ mr: 1, color: '#2A7D6F' }} />
          <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            Privacy & Consent Settings
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Manage how your data is collected and used. You can change these settings at any time.
        </Typography>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          {consentCategories.map((category, index) => (
            <Accordion key={category.key} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <Box display="flex" alignItems="center">
                    {category.icon}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {category.title}
                        {category.required && (
                          <Chip 
                            label="Required" 
                            size="small" 
                            color="primary" 
                            sx={{ ml: 1, height: 20 }}
                          />
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </Box>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={consents[category.key]?.given || false}
                        onChange={(e) => handleConsentChange(category.key, e.target.checked)}
                        disabled={category.required}
                        color="primary"
                      />
                    }
                    label=""
                    onClick={(e) => e.stopPropagation()}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ pl: 5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    This category includes:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {category.details.map((detail, idx) => (
                      <li key={idx}>
                        <Typography variant="body2" color="text.secondary">
                          {detail}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                  {consents[category.key]?.timestamp && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      Last updated: {new Date(consents[category.key].timestamp).toLocaleString()}
                    </Typography>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Your Privacy Rights:</strong> You can withdraw consent at any time. 
            Essential cookies are required for the website to function and cannot be disabled. 
            For more information, please read our{' '}
            <Button 
              variant="text" 
              size="small" 
              sx={{ p: 0, minWidth: 'auto', textDecoration: 'underline' }}
              onClick={() => window.open('/privacy', '_blank')}
            >
              Privacy Policy
            </Button>.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ 
            minWidth: 120,
            backgroundColor: '#2A7D6F',
            '&:hover': { backgroundColor: '#1e5a4f' }
          }}
        >
          {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Preferences'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsentManager;
