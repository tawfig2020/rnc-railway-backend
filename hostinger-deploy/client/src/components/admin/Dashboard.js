import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, Card, CardContent, Button,
  CircularProgress, Avatar, List, ListItem, ListItemText, 
  ListItemAvatar, Divider, Alert, useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  ShoppingCart as CartIcon,
  CampaignOutlined as CampaignIcon,
  AttachMoney as MoneyIcon,
  Flag as FlagIcon,
  PersonAdd as PersonAddIcon,
  MonetizationOn as DonationIcon,
  AddShoppingCart as NewOrderIcon,
  ErrorOutline as AlertIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Main Dashboard component for admin panel
const Dashboard = () => {
  const theme = useTheme();
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    users: { total: 0, new: 0 },
    orders: { total: 0, pending: 0, revenue: 0 },
    campaigns: { active: 0, completed: 0 },
    donations: { total: 0, recent: 0, amount: 0 },
    system: { status: 'operational' }
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: []
  });
  const [userDistributionData, setUserDistributionData] = useState({
    labels: [],
    datasets: []
  });
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsResponse, activitiesResponse, alertsResponse, chartsResponse] = await Promise.all([
          axios.get('/api/admin/dashboard/stats', {
            headers: { 'x-auth-token': localStorage.getItem('token') }
          }),
          axios.get('/api/admin/dashboard/activities', {
            headers: { 'x-auth-token': localStorage.getItem('token') }
          }),
          axios.get('/api/admin/dashboard/alerts', {
            headers: { 'x-auth-token': localStorage.getItem('token') }
          }),
          axios.get('/api/admin/dashboard/charts', {
            headers: { 'x-auth-token': localStorage.getItem('token') }
          })
        ]);
        
        setStats(statsResponse.data);
        setRecentActivities(activitiesResponse.data);
        setAlerts(alertsResponse.data);
        
        // Process revenue chart data
        const revenueChartData = {
          labels: chartsResponse.data.revenue.labels,
          datasets: [
            {
              label: 'Marketplace Revenue',
              data: chartsResponse.data.revenue.marketplace,
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.primary.light + '50',
              fill: true,
              tension: 0.3
            },
            {
              label: 'Donations',
              data: chartsResponse.data.revenue.donations,
              borderColor: theme.palette.secondary.main,
              backgroundColor: theme.palette.secondary.light + '50',
              fill: true,
              tension: 0.3
            }
          ]
        };
        setRevenueData(revenueChartData);
        
        // Process user distribution chart data
        const userDistributionChartData = {
          labels: chartsResponse.data.userDistribution.labels,
          datasets: [
            {
              label: 'User Types',
              data: chartsResponse.data.userDistribution.data,
              backgroundColor: [
                theme.palette.primary.main,
                theme.palette.secondary.main,
                theme.palette.success.main,
                theme.palette.warning.main
              ],
              borderColor: [
                theme.palette.primary.dark,
                theme.palette.secondary.dark,
                theme.palette.success.dark,
                theme.palette.warning.dark
              ],
              borderWidth: 1
            }
          ]
        };
        setUserDistributionData(userDistributionChartData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
        
        // Set mock data for development and preview
        setMockData();
      }
    };
    
    fetchDashboardData();
  }, [theme.palette]);
  
  // Set mock data for preview if API fails
  const setMockData = () => {
    // Mock stats data
    setStats({
      users: { total: 1245, new: 24 },
      orders: { total: 538, pending: 17, revenue: 28750 },
      campaigns: { active: 8, completed: 14 },
      donations: { total: 876, recent: 52, amount: 38450 },
      system: { status: 'operational' }
    });
    
    // Mock activities
    setRecentActivities([
      { id: 1, type: 'user', action: 'New user registered', timestamp: '2025-07-05T15:30:00', user: 'Sarah Johnson' },
      { id: 2, type: 'order', action: 'New order placed', timestamp: '2025-07-05T14:45:00', amount: 145.99, orderId: 'ORD-3842' },
      { id: 3, type: 'donation', action: 'Donation received', timestamp: '2025-07-05T12:20:00', amount: 75, campaign: 'Clean Water Initiative' },
      { id: 4, type: 'campaign', action: 'Campaign created', timestamp: '2025-07-05T10:15:00', campaign: 'Summer Food Drive' },
      { id: 5, type: 'order', action: 'Order status updated', timestamp: '2025-07-05T09:30:00', status: 'shipped', orderId: 'ORD-3836' }
    ]);
    
    // Mock alerts
    setAlerts([
      { id: 1, type: 'warning', message: 'Low inventory for 3 products', link: '/admin/inventory' },
      { id: 2, type: 'info', message: 'System maintenance scheduled for July 10th', link: null },
      { id: 3, type: 'error', message: 'Payment gateway reporting connectivity issues', link: '/admin/settings/payment' }
    ]);
    
    // Mock chart data
    const revenueChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Marketplace Revenue',
          data: [3000, 5500, 4200, 6800, 5300, 7500],
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.light + '50',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Donations',
          data: [2200, 3300, 2700, 4600, 6200, 5400],
          borderColor: theme.palette.secondary.main,
          backgroundColor: theme.palette.secondary.light + '50',
          fill: true,
          tension: 0.3
        }
      ]
    };
    setRevenueData(revenueChartData);
    
    // Mock user distribution
    const userDistributionChartData = {
      labels: ['Refugees', 'Volunteers', 'Staff', 'Admins'],
      datasets: [
        {
          label: 'User Types',
          data: [850, 320, 60, 15],
          backgroundColor: [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.success.main,
            theme.palette.warning.main
          ],
          borderColor: [
            theme.palette.primary.dark,
            theme.palette.secondary.dark,
            theme.palette.success.dark,
            theme.palette.warning.dark
          ],
          borderWidth: 1
        }
      ]
    };
    setUserDistributionData(userDistributionChartData);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 5) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user':
        return <PersonAddIcon />;
      case 'order':
        return <NewOrderIcon />;
      case 'donation':
        return <DonationIcon />;
      case 'campaign':
        return <CampaignIcon />;
      default:
        return <DashboardIcon />;
    }
  };
  
  // Get color for alert type
  const getAlertSeverity = (type) => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>
      
      {/* System Status Alert */}
      {stats.system.status !== 'operational' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body1">
            System Status: {stats.system.status.toUpperCase()}
          </Typography>
          <Typography variant="body2">
            {stats.system.message || 'Some system components may not be functioning normally.'}
          </Typography>
        </Alert>
      )}
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* User Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.users.total.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +{stats.users.new} new this week
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Order Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                    Marketplace Orders
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.orders.total.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color={stats.orders.pending > 0 ? 'warning.main' : 'text.secondary'}>
                    {stats.orders.pending} pending orders
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', width: 56, height: 56 }}>
                  <CartIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Campaign Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                    Active Campaigns
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.campaigns.active.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.campaigns.completed} completed campaigns
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                  <FlagIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Revenue Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatCurrency(stats.orders.revenue + stats.donations.amount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(stats.donations.amount)} from donations
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.light', width: 56, height: 56 }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts & Activity Section */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Revenue Overview (Last 6 Months)
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line 
                data={revenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      mode: 'index',
                      callbacks: {
                        label: function(context) {
                          let label = context.dataset.label || '';
                          if (label) {
                            label += ': ';
                          }
                          if (context.parsed.y !== null) {
                            label += formatCurrency(context.parsed.y);
                          }
                          return label;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        drawOnChartArea: false,
                      }
                    },
                    y: {
                      ticks: {
                        callback: function(value) {
                          return formatCurrency(value);
                        }
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* User Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              User Distribution
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie 
                data={userDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          let label = context.label || '';
                          if (label) {
                            label += ': ';
                          }
                          if (context.parsed !== null) {
                            label += context.parsed;
                            label += ' (' + Math.round(context.parsed / context.dataset.data.reduce((a, b) => a + b, 0) * 100) + '%)';
                          }
                          return label;
                        }
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivities.length > 0 ? (
                recentActivities.slice(0, 5).map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 
                          activity.type === 'user' ? 'primary.light' : 
                          activity.type === 'order' ? 'info.light' :
                          activity.type === 'donation' ? 'secondary.light' :
                          'success.light'
                        }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.action}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {activity.user || activity.campaign || `Order #${activity.orderId}` || ''}
                            </Typography>
                            {activity.amount ? ` — ${formatCurrency(activity.amount)}` : ''}
                            {activity.status ? ` — Status: ${activity.status}` : ''}
                            <Typography component="span" variant="body2" display="block">
                              {formatDate(activity.timestamp)}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No recent activities found
                </Typography>
              )}
            </List>
            <Box mt={2} display="flex" justifyContent="center">
              <Button component={RouterLink} to="/admin/activity-log" variant="outlined" size="small">
                View All Activity
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* System Alerts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <AlertIcon sx={{ mr: 1 }} />
              System Alerts
            </Typography>
            
            {alerts.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {alerts.map((alert, index) => (
                  <Alert 
                    key={alert.id}
                    severity={getAlertSeverity(alert.type)}
                    sx={{ mb: 2 }}
                    action={
                      alert.link ? (
                        <Button 
                          color="inherit" 
                          size="small"
                          component={RouterLink}
                          to={alert.link}
                        >
                          VIEW
                        </Button>
                      ) : null
                    }
                  >
                    {alert.message}
                  </Alert>
                ))}
              </Box>
            ) : (
              <Box sx={{ mt: 2, textAlign: 'center', py: 4 }}>
                <Alert severity="success">All systems operational</Alert>
              </Box>
            )}
            
            <Box mt={2} display="flex" justifyContent="center">
              <Button component={RouterLink} to="/admin/settings/system" variant="outlined" size="small">
                System Status
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Quick Access Buttons */}
      <Box sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h6" gutterBottom>
          Quick Access
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              component={RouterLink}
              to="/admin/marketplace/orders"
              variant="outlined"
              fullWidth
              sx={{ py: 2, flexDirection: 'column', height: '100%' }}
            >
              <CartIcon sx={{ fontSize: 40, mb: 1 }} />
              Manage Orders
            </Button>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              component={RouterLink}
              to="/admin/donations/campaigns"
              variant="outlined"
              fullWidth
              sx={{ py: 2, flexDirection: 'column', height: '100%' }}
            >
              <CampaignIcon sx={{ fontSize: 40, mb: 1 }} />
              Campaigns
            </Button>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              component={RouterLink}
              to="/admin/users"
              variant="outlined"
              fullWidth
              sx={{ py: 2, flexDirection: 'column', height: '100%' }}
            >
              <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
              Users
            </Button>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              component={RouterLink}
              to="/admin/reports"
              variant="outlined"
              fullWidth
              sx={{ py: 2, flexDirection: 'column', height: '100%' }}
            >
              <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
              Reports
            </Button>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              component={RouterLink}
              to="/admin/donations"
              variant="outlined"
              fullWidth
              sx={{ py: 2, flexDirection: 'column', height: '100%' }}
            >
              <MoneyIcon sx={{ fontSize: 40, mb: 1 }} />
              Donations
            </Button>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              component={RouterLink}
              to="/admin/settings"
              variant="outlined"
              fullWidth
              sx={{ py: 2, flexDirection: 'column', height: '100%' }}
            >
              <DashboardIcon sx={{ fontSize: 40, mb: 1 }} />
              Settings
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
