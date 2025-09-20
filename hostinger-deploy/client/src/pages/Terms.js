import React from 'react';
import { Container, Typography, Box, Paper, Breadcrumbs, Link, Divider } from '@mui/material';
import { Home, ChevronRight, GavelRounded } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Terms = () => {
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
            <GavelRounded sx={{ mr: 0.5 }} fontSize="inherit" />
            Terms of Service
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
          Terms of Service
        </Typography>

        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            1. Introduction
          </Typography>
          <Typography paragraph>
            Welcome to the Refugee Network Centre (RNC). By accessing or using our website, services, or platform, you agree to comply with and be bound by these Terms of Service. Please read them carefully.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            2. Services Description
          </Typography>
          <Typography paragraph>
            RNC provides a platform connecting refugees and migrants with educational resources, career development opportunities, marketplace solutions, and community services. We act as a facilitator of connections and do not directly provide employment or guarantee outcomes.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            3. User Accounts
          </Typography>
          <Typography paragraph>
            Some features of our services require account registration. You are responsible for maintaining the confidentiality of your account information and for all activities under your account. You must provide accurate, current, and complete information and update it as necessary.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            4. User Conduct
          </Typography>
          <Typography paragraph>
            When using our platform, you agree not to:
          </Typography>
          <ul>
            <li>
              <Typography>Violate any applicable laws or regulations</Typography>
            </li>
            <li>
              <Typography>Infringe on the rights of others</Typography>
            </li>
            <li>
              <Typography>Post false, misleading, or fraudulent content</Typography>
            </li>
            <li>
              <Typography>Interfere with the proper functioning of the service</Typography>
            </li>
            <li>
              <Typography>Engage in harassment or intimidation</Typography>
            </li>
          </ul>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            5. Intellectual Property
          </Typography>
          <Typography paragraph>
            All content on our platform, including text, graphics, logos, and software, is the property of RNC or its content suppliers and is protected by copyright and other intellectual property laws. Users may not reproduce, distribute, or create derivative works without our express permission.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            6. Disclaimer of Warranties
          </Typography>
          <Typography paragraph>
            Our services are provided &quot;as is&quot; without warranties of any kind, either express or implied. RNC does not guarantee that our services will be uninterrupted, secure, or error-free.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            7. Limitation of Liability
          </Typography>
          <Typography paragraph>
            RNC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or any communications or transactions with other users or service providers found through our platform.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            8. Changes to Terms
          </Typography>
          <Typography paragraph>
            RNC reserves the right to modify these Terms at any time. We will provide notice of significant changes by posting the new Terms on our website. Your continued use of our services after such changes constitutes your acceptance of the new Terms.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            9. Governing Law
          </Typography>
          <Typography paragraph>
            These Terms shall be governed by the laws of Malaysia, without regard to its conflict of law provisions.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            10. Contact Information
          </Typography>
          <Typography paragraph>
            For questions about these Terms, please contact us at:
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

export default Terms;
