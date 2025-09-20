import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  Smartphone,
  Wifi,
  QrCode,
  Home,
  School,
  VolunteerActivism,
  Store,
  AdminPanelSettings
} from '@mui/icons-material';
import QRCodeGenerator from '../components/QRCodeGenerator';

const MobileAccess = () => {
  // Get the local IP address (you'll need to update this with your actual IP)
  const localIP = '192.168.0.4'; // Your local IP from ipconfig
  const port = '3000';
  const baseUrl = `http://${localIP}:${port}`;

  const qrCodes = [
    {
      title: 'RNC Home',
      url: baseUrl,
      description: 'Main platform homepage',
      icon: <Home />,
      color: 'primary'
    },
    {
      title: 'Activities Album',
      url: `${baseUrl}/activities-album`,
      description: 'View community activities and photos',
      icon: <VolunteerActivism />,
      color: 'success'
    },
    {
      title: 'Courses & Learning',
      url: `${baseUrl}/courses`,
      description: 'Access educational content',
      icon: <School />,
      color: 'info'
    },
    {
      title: 'Community Projects',
      url: `${baseUrl}/community-projects`,
      description: 'Browse and support community initiatives',
      icon: <VolunteerActivism />,
      color: 'warning'
    },
    {
      title: 'Marketplace',
      url: `${baseUrl}/marketplace`,
      description: 'Shop products and services',
      icon: <Store />,
      color: 'secondary'
    },
    {
      title: 'Admin Panel',
      url: `${baseUrl}/admin`,
      description: 'Administrative access (staff only)',
      icon: <AdminPanelSettings />,
      color: 'error'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Smartphone sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          Mobile Access Center
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Scan QR codes to access RNC Platform on mobile devices
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Chip 
            icon={<Wifi />} 
            label={`Network: ${localIP}`} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            icon={<QrCode />} 
            label="WiFi Required" 
            color="success" 
            variant="outlined" 
          />
        </Box>
      </Box>

      {/* Instructions */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions for Mobile Access:</strong>
        </Typography>
        <Typography variant="body2" component="div">
          1. Ensure your mobile device is connected to the same WiFi network<br/>
          2. Open your mobile camera or QR code scanner app<br/>
          3. Point the camera at any QR code below<br/>
          4. Tap the notification to open the link in your mobile browser<br/>
          5. Bookmark the page for easy future access
        </Typography>
      </Alert>

      {/* Network Information Card */}
      <Card sx={{ mb: 4, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Network Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Local IP:</strong> {localIP}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Port:</strong> {port}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Base URL:</strong> {baseUrl}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* QR Codes Grid */}
      <Grid container spacing={3}>
        {qrCodes.map((qr, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Chip
                  icon={qr.icon}
                  label={qr.title}
                  color={qr.color}
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {qr.description}
                </Typography>
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <QRCodeGenerator 
                  url={qr.url} 
                  title={qr.title}
                  size={180}
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Footer Information */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          QR codes are generated for local network access. 
          Make sure all devices are connected to the same WiFi network.
        </Typography>
      </Box>
    </Container>
  );
};

export default MobileAccess;
