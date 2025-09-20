import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Skeleton,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  LocalOffer as DiscountIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon,
  LocalShipping as ShippingIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DiscountStats = ({ stats, loading }) => {
  const theme = useTheme();

  // Generate colors for charts
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main
  ];

  // Format discount type data for pie chart
  const formatDiscountTypeData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Percentage', value: stats.percentageDiscounts || 0 },
      { name: 'Fixed Amount', value: stats.fixedDiscounts || 0 },
      { name: 'Shipping', value: stats.shippingDiscounts || 0 }
    ].filter(item => item.value > 0);
  };

  // Format status data for pie chart
  const formatStatusData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Active', value: stats.currentCount || 0 },
      { name: 'Inactive', value: stats.inactiveCount || 0 },
      { name: 'Expired', value: stats.expiredCount || 0 },
      { name: 'Upcoming', value: stats.upcomingCount || 0 }
    ].filter(item => item.value > 0);
  };

  // Format most used discounts for bar chart
  const formatMostUsedData = () => {
    if (!stats || !stats.mostUsedDiscounts) return [];
    
    return stats.mostUsedDiscounts.map(discount => ({
      name: discount.code,
      value: discount.usageCount
    }));
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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
      <Typography variant="h6" gutterBottom>Discount Analytics</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Overview of discount codes and their performance metrics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <DiscountIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Total Discounts
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                {stats?.totalCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all types
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Active Discounts
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                {stats?.currentCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently redeemable
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PercentIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Avg. Percentage
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                {stats?.avgDiscountValue ? `${stats.avgDiscountValue.toFixed(1)}%` : '0%'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                For percentage discounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Upcoming Discounts
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                {stats?.upcomingCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Not yet active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Discount Types Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DiscountIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Discount Types</Typography>
              </Box>
              
              <Box height={300} display="flex" justifyContent="center">
                {formatDiscountTypeData().length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatDiscountTypeData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {formatDiscountTypeData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} discounts`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box height={300} display="flex" justifyContent="center" alignItems="center">
                    <Typography variant="body1" color="text.secondary">No discount data available</Typography>
                  </Box>
                )}
              </Box>
              
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box display="flex" alignItems="center">
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: COLORS[0],
                          display: 'inline-block',
                          mr: 1
                        }} 
                      />
                      <Typography variant="body2">
                        Percentage: {stats?.percentageDiscounts || 0}
                      </Typography>
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
                          bgcolor: COLORS[1],
                          display: 'inline-block',
                          mr: 1
                        }} 
                      />
                      <Typography variant="body2">
                        Fixed: {stats?.fixedDiscounts || 0}
                      </Typography>
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
                          bgcolor: COLORS[2],
                          display: 'inline-block',
                          mr: 1
                        }} 
                      />
                      <Typography variant="body2">
                        Shipping: {stats?.shippingDiscounts || 0}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Status Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TimelineIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Discount Status</Typography>
              </Box>
              
              <Box height={300} display="flex" justifyContent="center">
                {formatStatusData().length > 0 ? (
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
                        <Cell fill={theme.palette.success.main} />
                        <Cell fill={theme.palette.error.main} />
                        <Cell fill={theme.palette.warning.light} />
                        <Cell fill={theme.palette.info.main} />
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} discounts`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box height={300} display="flex" justifyContent="center" alignItems="center">
                    <Typography variant="body1" color="text.secondary">No status data available</Typography>
                  </Box>
                )}
              </Box>
              
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
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
                      <Typography variant="body2">
                        Active: {stats?.currentCount || 0}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
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
                      <Typography variant="body2">
                        Inactive: {stats?.inactiveCount || 0}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Box display="flex" alignItems="center">
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.warning.light,
                          display: 'inline-block',
                          mr: 1
                        }} 
                      />
                      <Typography variant="body2">
                        Expired: {stats?.expiredCount || 0}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Box display="flex" alignItems="center">
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.info.main,
                          display: 'inline-block',
                          mr: 1
                        }} 
                      />
                      <Typography variant="body2">
                        Upcoming: {stats?.upcomingCount || 0}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Most Used Discounts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Most Used Discounts</Typography>
              </Box>
              
              <Box height={300} display="flex" justifyContent="center">
                {stats?.mostUsedDiscounts && stats.mostUsedDiscounts.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formatMostUsedData()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="Usage Count" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box height={300} display="flex" justifyContent="center" alignItems="center">
                    <Typography variant="body1" color="text.secondary">No usage data available</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DiscountStats;
