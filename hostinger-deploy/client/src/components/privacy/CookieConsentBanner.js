import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Collapse,
  FormControlLabel,
  Switch,
  Divider,
  Link
} from '@mui/material';
import {
  Close,
  ExpandMore,
  ExpandLess,
  Cookie,
  Settings
} from '@mui/icons-material';
import api from '../../services/api';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consents, setConsents] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    dataProcessing: false,
    thirdParty: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkConsentStatus();
  }, []);

  const checkConsentStatus = async () => {
    try {
      // Check if user has already given consent
      const consentGiven = localStorage.getItem('cookieConsentGiven');
      const token = localStorage.getItem('token');
      
      if (!consentGiven) {
        setShowBanner(true);
      } else if (token) {
        // If logged in, sync with server
        const response = await api.get('/privacy/consent');
        if (response.data.success) {
          const serverConsents = response.data.data.consents;
          setConsents({
            essential: serverConsents.essential?.given || true,
            analytics: serverConsents.analytics?.given || false,
            marketing: serverConsents.marketing?.given || false,
            dataProcessing: serverConsents.dataProcessing?.given || false,
            thirdParty: serverConsents.thirdParty?.given || false
          });
        }
      }
    } catch (error) {
      console.error('Failed to check consent status:', error);
      // Show banner if we can't determine consent status
      setShowBanner(true);
    }
  };

  const handleConsentChange = (type, value) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    
    setConsents(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleAcceptAll = async () => {
    const allConsents = {
      essential: true,
      analytics: true,
      marketing: true,
      dataProcessing: true,
      thirdParty: true
    };
    
    await saveConsents(allConsents);
  };

  const handleAcceptSelected = async () => {
    await saveConsents(consents);
  };

  const handleRejectAll = async () => {
    const minimalConsents = {
      essential: true,
      analytics: false,
      marketing: false,
      dataProcessing: false,
      thirdParty: false
    };
    
    await saveConsents(minimalConsents);
  };

  const saveConsents = async (consentData) => {
    try {
      setLoading(true);
      
      // Save to localStorage
      localStorage.setItem('cookieConsentGiven', 'true');
      localStorage.setItem('cookieConsents', JSON.stringify(consentData));
      
      // If user is logged in, save to server
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/privacy/consent', {
          analytics: consentData.analytics,
          marketing: consentData.marketing,
          dataProcessing: consentData.dataProcessing,
          thirdParty: consentData.thirdParty,
          consentMethod: 'cookie_banner'
        });
      }
      
      // Apply consents immediately
      applyConsents(consentData);
      
      setShowBanner(false);
    } catch (error) {
      console.error('Failed to save consents:', error);
      // Still hide banner and save locally even if server fails
      setShowBanner(false);
    } finally {
      setLoading(false);
    }
  };

  const applyConsents = (consentData) => {
    // Apply analytics consent
    if (consentData.analytics) {
      // Enable analytics tracking (Google Analytics, etc.)
      console.log('Analytics tracking enabled');
    } else {
      // Disable analytics tracking
      console.log('Analytics tracking disabled');
    }

    // Apply marketing consent
    if (consentData.marketing) {
      // Enable marketing cookies and tracking
      console.log('Marketing tracking enabled');
    } else {
      // Disable marketing cookies
      console.log('Marketing tracking disabled');
    }

    // Apply third-party consent
    if (consentData.thirdParty) {
      // Enable third-party integrations
      console.log('Third-party integrations enabled');
    } else {
      // Disable third-party integrations
      console.log('Third-party integrations disabled');
    }
  };

  if (!showBanner) {
    return null;
  }

  const consentOptions = [
    {
      key: 'essential',
      title: 'Essential Cookies',
      description: 'Required for the website to function properly',
      required: true
    },
    {
      key: 'analytics',
      title: 'Analytics Cookies',
      description: 'Help us understand how you use our website'
    },
    {
      key: 'marketing',
      title: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements'
    },
    {
      key: 'dataProcessing',
      title: 'Data Processing',
      description: 'Process your data to improve our services'
    },
    {
      key: 'thirdParty',
      title: 'Third-Party Cookies',
      description: 'Enable integrations with external services'
    }
  ];

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        borderRadius: '16px 16px 0 0',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        maxHeight: '80vh',
        overflow: 'auto'
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Cookie sx={{ mr: 1, color: '#2A7D6F' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A7D6F' }}>
              Cookie Preferences
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setShowBanner(false)}
            sx={{ color: 'text.secondary' }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Main message */}
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
          We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
          By continuing to browse, you consent to our use of cookies.
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          You can customize your preferences below or{' '}
          <Link href="/privacy" target="_blank" sx={{ color: '#2A7D6F' }}>
            read our Privacy Policy
          </Link>{' '}
          for more information.
        </Typography>

        {/* Quick action buttons */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          <Button
            variant="contained"
            onClick={handleAcceptAll}
            disabled={loading}
            sx={{ 
              backgroundColor: '#2A7D6F',
              '&:hover': { backgroundColor: '#1e5a4f' }
            }}
          >
            Accept All
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleRejectAll}
            disabled={loading}
            sx={{ 
              borderColor: '#2A7D6F',
              color: '#2A7D6F',
              '&:hover': { borderColor: '#1e5a4f', backgroundColor: 'rgba(42, 125, 111, 0.04)' }
            }}
          >
            Reject All
          </Button>
          
          <Button
            variant="text"
            startIcon={showDetails ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setShowDetails(!showDetails)}
            sx={{ color: '#2A7D6F' }}
          >
            Customize
          </Button>
        </Box>

        {/* Detailed consent options */}
        <Collapse in={showDetails}>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Customize Your Preferences
          </Typography>

          <Box sx={{ mb: 3 }}>
            {consentOptions.map((option) => (
              <Box key={option.key} sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {option.title}
                      {option.required && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ 
                            ml: 1, 
                            px: 1, 
                            py: 0.25, 
                            backgroundColor: '#2A7D6F', 
                            color: 'white', 
                            borderRadius: 1,
                            fontSize: '0.7rem'
                          }}
                        >
                          Required
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={consents[option.key]}
                        onChange={(e) => handleConsentChange(option.key, e.target.checked)}
                        disabled={option.required}
                        color="primary"
                      />
                    }
                    label=""
                  />
                </Box>
              </Box>
            ))}
          </Box>

          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              onClick={handleAcceptSelected}
              disabled={loading}
              sx={{ 
                backgroundColor: '#2A7D6F',
                '&:hover': { backgroundColor: '#1e5a4f' }
              }}
            >
              Save Preferences
            </Button>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default CookieConsentBanner;
