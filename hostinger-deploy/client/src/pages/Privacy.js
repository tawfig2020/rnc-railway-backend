import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Breadcrumbs, 
  Link, 
  Divider,
  Button,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@mui/material';
import { 
  Home, 
  ChevronRight, 
  SecurityRounded, 
  ExpandMore,
  CheckCircle,
  Settings
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Privacy = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState(null);
  const [userConsent, setUserConsent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrivacyPolicy();
    fetchUserConsent();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      const response = await api.get('/privacy/policy');
      if (response.data.success) {
        setPrivacyPolicy(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch privacy policy:', error);
    }
  };

  const fetchUserConsent = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/privacy/consent');
        if (response.data.success) {
          setUserConsent(response.data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user consent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPolicy = async () => {
    try {
      const response = await api.post('/privacy/accept-policy', {
        version: privacyPolicy?.version || '1.0'
      });
      if (response.data.success) {
        setConsentAccepted(true);
      }
    } catch (error) {
      console.error('Failed to accept privacy policy:', error);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      py: 6, 
      background: `linear-gradient(to bottom, #F9F4EF, rgba(249, 244, 239, 0.7))`,
    }}>
      <Container maxWidth="lg">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs separator={<ChevronRight fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <SecurityRounded sx={{ mr: 0.5 }} fontSize="inherit" />
            Privacy Policy
          </Typography>
        </Breadcrumbs>

        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            color: '#2A7D6F',
            mb: 4,
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: 0,
              width: 100,
              height: 4,
              backgroundColor: '#D36135',
              borderRadius: 2
            }
          }}
        >
          Privacy Policy
        </Typography>

        {/* Dynamic Privacy Policy Status */}
        {privacyPolicy?.lastUpdated && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Last updated: {new Date(privacyPolicy.lastUpdated).toLocaleDateString()}
          </Typography>
        )}

        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {!loading && userConsent && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body2">
                You accepted this privacy policy on {new Date(userConsent.lastUpdated).toLocaleDateString()}
              </Typography>
              <Button
                size="small"
                onClick={() => navigate('/privacy-settings')}
                sx={{ color: '#2A7D6F' }}
              >
                Manage Settings
              </Button>
            </Box>
          </Alert>
        )}

        {!loading && !userConsent && localStorage.getItem('token') && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body2">
                Please review and accept our privacy policy to continue using our services.
              </Typography>
              <Button
                size="small"
                variant="contained"
                onClick={handleAcceptPolicy}
                sx={{ 
                  ml: 2,
                  backgroundColor: '#2A7D6F',
                  '&:hover': { backgroundColor: '#1e5a4f' }
                }}
              >
                Accept Policy
              </Button>
            </Box>
          </Alert>
        )}

        {consentAccepted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you for accepting our privacy policy. You can manage your preferences anytime.
          </Alert>
        )}

        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            1. Introduction
          </Typography>
          <Typography paragraph>
            The Refugee Network Centre (RNC) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this policy carefully.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            2. Information We Collect
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
            2.1 Personal Information
          </Typography>
          <Typography paragraph>
            We may collect personal information that you voluntarily provide to us when you:
          </Typography>
          <ul>
            <li>
              <Typography>Register for an account</Typography>
            </li>
            <li>
              <Typography>Apply for programs or services</Typography>
            </li>
            <li>
              <Typography>Fill out contact forms or surveys</Typography>
            </li>
            <li>
              <Typography>Subscribe to newsletters or communications</Typography>
            </li>
            <li>
              <Typography>Participate in marketplace activities</Typography>
            </li>
          </ul>
          
          <Typography paragraph>
            This information may include your name, email address, phone number, mailing address, employment history, education information, and other details relevant to our services.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
            2.2 Non-Personal Information
          </Typography>
          <Typography paragraph>
            We may automatically collect certain information when you visit our website, including:
          </Typography>
          <ul>
            <li>
              <Typography>IP address</Typography>
            </li>
            <li>
              <Typography>Browser type</Typography>
            </li>
            <li>
              <Typography>Device information</Typography>
            </li>
            <li>
              <Typography>Pages visited and time spent</Typography>
            </li>
            <li>
              <Typography>Referring websites</Typography>
            </li>
          </ul>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            3. How We Use Your Information
          </Typography>
          <Typography paragraph>
            We may use the information we collect for various purposes, including:
          </Typography>
          <ul>
            <li>
              <Typography>Providing and improving our services</Typography>
            </li>
            <li>
              <Typography>Processing applications and registrations</Typography>
            </li>
            <li>
              <Typography>Communicating with you about programs, events, or updates</Typography>
            </li>
            <li>
              <Typography>Analyzing usage patterns to enhance user experience</Typography>
            </li>
            <li>
              <Typography>Protecting against unauthorized access or misuse</Typography>
            </li>
          </ul>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            4. Information Sharing
          </Typography>
          <Typography paragraph>
            We do not sell, trade, or otherwise transfer your personal information to outside parties except in the following circumstances:
          </Typography>
          <ul>
            <li>
              <Typography>With your consent</Typography>
            </li>
            <li>
              <Typography>To trusted partners who assist us in operating our website or providing services</Typography>
            </li>
            <li>
              <Typography>To comply with legal obligations or protect rights</Typography>
            </li>
            <li>
              <Typography>In the event of a merger, acquisition, or sale of assets</Typography>
            </li>
          </ul>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            5. Data Security
          </Typography>
          <Typography paragraph>
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            6. Your Rights and Choices
          </Typography>
          <Typography paragraph>
            You have certain rights regarding your personal information, including:
          </Typography>
          <ul>
            <li>
              <Typography>Accessing, correcting, or deleting your information</Typography>
            </li>
            <li>
              <Typography>Opting out of marketing communications</Typography>
            </li>
            <li>
              <Typography>Requesting restrictions on certain processing</Typography>
            </li>
            <li>
              <Typography>Data portability where applicable</Typography>
            </li>
          </ul>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            7. Children&apos;s Privacy
          </Typography>
          <Typography paragraph>
            Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            8. Changes to This Privacy Policy
          </Typography>
          <Typography paragraph>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            9. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about this Privacy Policy, please contact us at:
          </Typography>
          <Typography paragraph>
            Email: refugeenc@gmail.com<br />
            Phone: +60 18-203 5784<br />
            Address: 43-2, Jalan Sulaiman 3, Taman Putra Sulaiman, 68000 Ampang, Selangor, Malaysia
          </Typography>
        </Paper>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Last Updated: July 5, 2025
        </Typography>
      </Container>
    </Box>
  );
};

export default Privacy;
