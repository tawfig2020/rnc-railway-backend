import React, { useState } from 'react';
import {
  Box, Typography, Paper, Tabs, Tab, Divider, Container, Button, 
  Alert, Snackbar
} from '@mui/material';
import {
  Settings as GeneralIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Payments as PaymentIcon,
  Storage as BackupIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';
import GeneralSettings from './GeneralSettings';
import EmailSettings from './EmailSettings';
import PaymentSettings from './PaymentSettings';
import SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationSettings';
import BackupSettings from './BackupSettings';

// Tab panel component for settings sections
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Admin Settings main component
const AdminSettings = () => {
  // State variables
  const [currentTab, setCurrentTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Handle settings save/update
  const handleSettingsUpdate = (message) => {
    setSnackbar({
      open: true,
      message: message || 'Settings updated successfully',
      severity: 'success'
    });
  };

  // Handle settings error
  const handleSettingsError = (message) => {
    setSnackbar({
      open: true,
      message: message || 'Error updating settings',
      severity: 'error'
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        System Settings
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Configure system settings for the entire application. Changes will affect all users.
      </Alert>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<GeneralIcon />} label="General" iconPosition="start" />
          <Tab icon={<EmailIcon />} label="Email" iconPosition="start" />
          <Tab icon={<PaymentIcon />} label="Payments" iconPosition="start" />
          <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" />
          <Tab icon={<NotificationIcon />} label="Notifications" iconPosition="start" />
          <Tab icon={<BackupIcon />} label="Backup & Data" iconPosition="start" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <GeneralSettings 
            onUpdate={handleSettingsUpdate} 
            onError={handleSettingsError} 
          />
        </TabPanel>
        
        <TabPanel value={currentTab} index={1}>
          <EmailSettings 
            onUpdate={handleSettingsUpdate} 
            onError={handleSettingsError} 
          />
        </TabPanel>
        
        <TabPanel value={currentTab} index={2}>
          <PaymentSettings 
            onUpdate={handleSettingsUpdate} 
            onError={handleSettingsError} 
          />
        </TabPanel>
        
        <TabPanel value={currentTab} index={3}>
          <SecuritySettings 
            onUpdate={handleSettingsUpdate} 
            onError={handleSettingsError} 
          />
        </TabPanel>
        
        <TabPanel value={currentTab} index={4}>
          <NotificationSettings 
            onUpdate={handleSettingsUpdate} 
            onError={handleSettingsError} 
          />
        </TabPanel>
        
        <TabPanel value={currentTab} index={5}>
          <BackupSettings 
            onUpdate={handleSettingsUpdate} 
            onError={handleSettingsError} 
          />
        </TabPanel>
      </Paper>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminSettings;
