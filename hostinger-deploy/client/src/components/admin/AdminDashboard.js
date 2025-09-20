import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tab,
  Tabs,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Store as MarketplaceIcon,
  School as CoursesIcon,
  Article as BlogIcon,
  Forum as ForumIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Admin Components (to be created)
import UserManagement from './UserManagement';
import ContentManagement from './ContentManagement';
import MarketplaceManagement from './MarketplaceManagement';
import AnalyticsDashboard from './AnalyticsDashboard';

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProducts: 0,
    pendingApprovals: 0,
    totalRevenue: 0
  });
  const { user } = useAuth();

  // Check if user has admin privileges
  if (!user || !['super_admin', 'admin', 'moderator'].includes(user.role)) {
    return (
      <Alert severity="error">
        Access Denied. You don't have permission to view this page.
      </Alert>
    );
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const adminTabs = [
    { label: 'Dashboard', icon: <DashboardIcon />, component: <AnalyticsDashboard /> },
    { label: 'Users', icon: <UsersIcon />, component: <UserManagement /> },
    { label: 'Content', icon: <BlogIcon />, component: <ContentManagement /> },
    { label: 'Marketplace', icon: <MarketplaceIcon />, component: <MarketplaceManagement /> },
    { label: 'Settings', icon: <SettingsIcon />, component: <div>Settings Panel</div> }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#2A7D6F' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            RNC Admin Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={stats.pendingApprovals} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          {adminTabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        {adminTabs[currentTab]?.component}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
