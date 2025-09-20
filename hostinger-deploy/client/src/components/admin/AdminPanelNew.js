import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Tabs, Tab,
  Grid, Card, CardContent
} from '@mui/material';
import { 
  SupervisorAccount, Person, Article, Event, 
  School, AdminPanelSettings, Assignment
} from '@mui/icons-material';

// Import our modular admin components
import UserManagement from './sections/UserManagement';
import ContentManagement from './sections/ContentManagement';
import EventManagement from './sections/EventManagement';
import CourseManagement from './sections/CourseManagement';
import VolunteerApplications from './sections/VolunteerApplications';
import PartnershipApplications from './sections/PartnershipApplications';

// Sample data for dashboard stats
const DASHBOARD_STATS = [
  { icon: <Person />, count: 125, label: 'Users', color: 'primary.main' },
  { icon: <Event />, count: 18, label: 'Upcoming Events', color: 'secondary.main' },
  { icon: <Article />, count: 47, label: 'Content Items', color: 'success.main' },
  { icon: <School />, count: 12, label: 'Active Courses', color: 'info.main' },
  { icon: <Assignment />, count: 24, label: 'Applications', color: 'warning.main' }
];

const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Render dashboard tab
  const renderDashboard = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Admin Dashboard</Typography>
      
      <Grid container spacing={3}>
        {DASHBOARD_STATS.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 2 
                }}>
                  {React.cloneElement(stat.icon, { 
                    sx: { fontSize: 40, color: stat.color } 
                  })}
                </Box>
                <Typography variant="h4">{stat.count}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2">
            • New user registered: Sarah Johnson (2 hours ago)
          </Typography>
          <Typography variant="body2">
            • Event updated: Career Fair 2025 (4 hours ago)
          </Typography>
          <Typography variant="body2">
            • New volunteer application: Ahmed Hassan (6 hours ago)
          </Typography>
          <Typography variant="body2">
            • Content published: "Resources for Newcomers" (yesterday)
          </Typography>
          <Typography variant="body2">
            • Partnership approved: Global Education Initiative (yesterday)
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AdminPanelSettings sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Admin Panel
        </Typography>
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<SupervisorAccount />} label="Dashboard" />
          <Tab icon={<Person />} label="Users" />
          <Tab icon={<Article />} label="Content" />
          <Tab icon={<Event />} label="Events" />
          <Tab icon={<School />} label="Courses" />
          <Tab icon={<Assignment />} label="Volunteer Apps" />
          <Tab icon={<Assignment />} label="Partnership Apps" />
        </Tabs>
      </Paper>
      
      {tabValue === 0 && renderDashboard()}
      {tabValue === 1 && <UserManagement />}
      {tabValue === 2 && <ContentManagement />}
      {tabValue === 3 && <EventManagement />}
      {tabValue === 4 && <CourseManagement />}
      {tabValue === 5 && <VolunteerApplications />}
      {tabValue === 6 && <PartnershipApplications />}
    </Box>
  );
};

export default AdminPanel;
