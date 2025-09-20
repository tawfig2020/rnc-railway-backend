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
  Category as CategoryIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  Style as StyleIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AccountTree as TreeIcon,
  TableRows as RowsIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CategoryStats = ({ stats, loading }) => {
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

  // Format status data for pie chart
  const formatStatusData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Active', value: stats.activeCount || 0 },
      { name: 'Inactive', value: stats.inactiveCount || 0 }
    ];
  };

  // Format hierarchy data for pie chart
  const formatHierarchyData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Root Categories', value: stats.rootCategoryCount || 0 },
      { name: 'Subcategories', value: stats.subcategoryCount || 0 }
    ];
  };

  // Format top categories for bar chart
  const formatTopCategoriesData = () => {
    if (!stats || !stats.topCategories) return [];
    
    return stats.topCategories.map(item => ({
      name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
      count: item.count
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
      <Typography variant="h6" gutterBottom>Category Analytics</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Overview of product categories and their performance metrics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <CategoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Total Categories
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                {stats?.totalCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all hierarchies
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TreeIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Root Categories
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                {stats?.rootCategoryCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Top-level categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <RowsIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Subcategories
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                {stats?.subcategoryCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Child categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <StarIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Featured Categories
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                {stats?.featuredCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Highlighted on frontend
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Status Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <StyleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Category Status</Typography>
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
                      <Cell fill={theme.palette.success.main} />
                      <Cell fill={theme.palette.error.main} />
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} categories`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
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
                        Active: {stats?.activeCount || 0}
                        {stats?.totalCount > 0 && ` (${Math.round((stats.activeCount / stats.totalCount) * 100)}%)`}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
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
                        {stats?.totalCount > 0 && ` (${Math.round((stats.inactiveCount / stats.totalCount) * 100)}%)`}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Hierarchy Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TreeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Category Hierarchy</Typography>
              </Box>
              
              <Box height={300} display="flex" justifyContent="center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formatHierarchyData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill={theme.palette.primary.main} />
                      <Cell fill={theme.palette.secondary.main} />
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} categories`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.primary.main,
                          display: 'inline-block',
                          mr: 1
                        }} 
                      />
                      <Typography variant="body2">
                        Root: {stats?.rootCategoryCount || 0}
                        {stats?.totalCount > 0 && ` (${Math.round((stats.rootCategoryCount / stats.totalCount) * 100)}%)`}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.secondary.main,
                          display: 'inline-block',
                          mr: 1
                        }} 
                      />
                      <Typography variant="body2">
                        Subcategories: {stats?.subcategoryCount || 0}
                        {stats?.totalCount > 0 && ` (${Math.round((stats.subcategoryCount / stats.totalCount) * 100)}%)`}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Top Categories by Products */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <VisibilityIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Top Categories by Products</Typography>
              </Box>
              
              {stats?.topCategories && stats.topCategories.length > 0 ? (
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formatTopCategoriesData()}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 50,
                        bottom: 5,
                      }}
                    >
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill={theme.palette.primary.main} name="Products" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box height={200} display="flex" justifyContent="center" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    No products assigned to categories yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Featured Categories List */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <StarIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Featured Categories</Typography>
              </Box>
              
              {stats?.featuredCount > 0 ? (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {/* This would typically be populated from the backend with a list of featured categories */}
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    {stats.featuredCount} categories are marked as featured.
                    <br />
                    These categories will be highlighted in the marketplace.
                  </Typography>
                </List>
              ) : (
                <Box py={3} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    No featured categories yet
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Mark categories as featured to highlight them
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoryStats;
