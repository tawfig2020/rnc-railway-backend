import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Skeleton,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  AddCircleOutline as ActiveIcon,
  PendingActions as PendingIcon,
  DoDisturbAlt as InactiveIcon,
  Category as CategoryIcon,
  Visibility as ViewIcon,
  Star as RatingIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ServiceStats = ({ stats, loading }) => {
  const theme = useTheme();

  // Generate colors for charts
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.grey[500],
    '#9c27b0', // purple
    '#795548', // brown
    '#607d8b', // blue-grey
  ];

  // Format category data for pie chart
  const formatCategoryData = () => {
    if (!stats || !stats.categoryCounts) return [];
    
    return stats.categoryCounts.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count
    }));
  };

  // Format data for status pie chart
  const formatStatusData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Active', value: stats.activeServices || 0 },
      { name: 'Pending', value: stats.pendingServices || 0 },
      { name: 'Inactive', value: stats.totalServices - (stats.activeServices + stats.pendingServices) || 0 }
    ];
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Format data for top viewed bar chart
  const formatTopViewedData = () => {
    if (!stats || !stats.topViewed) return [];
    
    return stats.topViewed.map(item => ({
      name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
      views: item.metrics.views
    }));
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Loading statistics...</Typography>
        <LinearProgress />
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[1, 2, 3, 4].map(i => (
            <Grid item xs={12} md={6} lg={3} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="40%" height={50} />
                  <Skeleton variant="text" width="80%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="40%" height={30} />
                <Skeleton variant="rectangular" height={250} />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="40%" height={30} />
                <Skeleton variant="rectangular" height={250} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Service Analytics Dashboard</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Overview of service statistics and performance metrics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Services
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                {stats?.totalServices || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: theme.palette.success.light,
              color: theme.palette.success.contrastText
            }}>
              <Box display="flex" alignItems="center" mb={1}>
                <ActiveIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Active Services
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                {stats?.activeServices || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {stats?.totalServices ? 
                  `${((stats.activeServices / stats.totalServices) * 100).toFixed(1)}% of total` : 
                  '0% of total'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: theme.palette.warning.light,
              color: theme.palette.warning.contrastText
            }}>
              <Box display="flex" alignItems="center" mb={1}>
                <PendingIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Pending Services
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                {stats?.pendingServices || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Awaiting review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: theme.palette.error.light,
              color: theme.palette.error.contrastText
            }}>
              <Box display="flex" alignItems="center" mb={1}>
                <InactiveIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Inactive Services
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                {stats?.totalServices ? 
                  (stats.totalServices - stats.activeServices - stats.pendingServices) : 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Currently disabled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CategoryIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Services by Category</Typography>
              </Box>
              
              <Box height={300} display="flex" justifyContent="center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formatCategoryData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {formatCategoryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} services`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>Legend</Typography>
                <Grid container spacing={1}>
                  {formatCategoryData().map((entry, index) => (
                    <Grid item xs={6} sm={4} key={`legend-${index}`}>
                      <Box display="flex" alignItems="center">
                        <Box 
                          component="span" 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            bgcolor: COLORS[index % COLORS.length],
                            display: 'inline-block',
                            mr: 1
                          }} 
                        />
                        <Typography variant="caption">{entry.name} ({entry.value})</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ViewIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Top Viewed Services</Typography>
              </Box>
              
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formatTopViewedData()}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="views" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <RatingIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Top Rated Services</Typography>
              </Box>
              
              {stats?.topRated && stats.topRated.length > 0 ? (
                <List>
                  {stats.topRated.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                            {index + 1}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.name}
                          secondary={
                            <Box display="flex" alignItems="center">
                              <RatingIcon fontSize="small" sx={{ mr: 0.5, color: '#FFB400' }} />
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ display: 'inline', fontWeight: 'bold' }}
                              >
                                {item.averageRating.toFixed(1)} / 5.0
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < stats.topRated.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No rated services yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6">Service Status Distribution</Typography>
              </Box>
              
              <Box height={300} display="flex" justifyContent="center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formatStatusData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill={theme.palette.success.main} /> {/* Active */}
                      <Cell fill={theme.palette.warning.main} /> {/* Pending */}
                      <Cell fill={theme.palette.error.main} /> {/* Inactive */}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} services`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>Legend</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Box display="flex" alignItems="center">
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.success.main,
                          display: 'inline-block',
                          mr: 1
                        }} 
                      />
                      <Typography variant="caption">Active ({stats?.activeServices || 0})</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box display="flex" alignItems="center">
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.warning.main,
                          display: 'inline-block',
                          mr: 1
                        }} 
                      />
                      <Typography variant="caption">Pending ({stats?.pendingServices || 0})</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box display="flex" alignItems="center">
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.error.main,
                          display: 'inline-block',
                          mr: 1
                        }} 
                      />
                      <Typography variant="caption">
                        Inactive ({stats?.totalServices ? 
                          (stats.totalServices - stats.activeServices - stats.pendingServices) : 0})
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServiceStats;
