import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  IconButton,
  Tabs,
  Tab,
  Divider,
  useTheme,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import BarChartIcon from '@mui/icons-material/BarChart';
import ViewListIcon from '@mui/icons-material/ViewList';
import axios from 'axios';

import ServiceList from './ServiceList';
import ServiceFilters from './ServiceFilters';
import ServiceForm from './ServiceForm';
import ServiceStats from './ServiceStats';

// Main ServiceManagement component for admin panel
const ServiceManagement = () => {
  const theme = useTheme();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editService, setEditService] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState('list');
  const [filterOptions, setFilterOptions] = useState({
    search: '',
    status: '',
    category: '',
    sort: 'newest'
  });
  const [dashboardStats, setDashboardStats] = useState(null);

  // Fetch services based on filters
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query string from filter options
        const queryParams = new URLSearchParams();
        if (filterOptions.search) queryParams.append('search', filterOptions.search);
        if (filterOptions.status) queryParams.append('status', filterOptions.status);
        if (filterOptions.category) queryParams.append('category', filterOptions.category);
        if (filterOptions.sort) queryParams.append('sort', filterOptions.sort);
        
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        
        // Get services from API
        const response = await axios.get(`/api/services${queryString}`, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        
        setServices(response.data.data);
        setTotalCount(response.data.total);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [filterOptions, page, limit, refreshTrigger]);

  // Fetch dashboard stats for the stats view
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (viewMode !== 'stats') return;
      
      try {
        const response = await axios.get('/api/services/admin/dashboard', {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        
        setDashboardStats(response.data);
      } catch (err) {
        console.error('Error fetching service stats:', err);
      }
    };
    
    fetchDashboardStats();
  }, [viewMode, refreshTrigger]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Update status filter based on tab
    let statusFilter = '';
    if (newValue === 0) statusFilter = ''; // All
    if (newValue === 1) statusFilter = 'active';
    if (newValue === 2) statusFilter = 'pending';
    if (newValue === 3) statusFilter = 'inactive';
    
    setFilterOptions(prev => ({
      ...prev,
      status: statusFilter
    }));
    
    // Reset to first page
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page when changing limit
  };

  const handleFilterChange = (newFilters) => {
    setFilterOptions(prev => ({
      ...prev,
      ...newFilters
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handleCreateService = () => {
    setEditService(null);
    setOpenForm(true);
  };

  const handleEditService = (service) => {
    setEditService(service);
    setOpenForm(true);
  };

  const handleFormClose = (refreshNeeded = false) => {
    setOpenForm(false);
    setEditService(null);
    if (refreshNeeded) {
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleStatusChange = async (serviceId, newStatus) => {
    try {
      await axios.put(`/api/services/${serviceId}/status`, 
        { status: newStatus },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );
      
      // Update local state
      setServices(services.map(service => 
        service._id === serviceId 
          ? { ...service, status: newStatus } 
          : service
      ));
      
      // Update counts if needed
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error updating service status:', err);
    }
  };

  const handleToggleFeature = async (serviceId) => {
    try {
      const response = await axios.put(`/api/services/${serviceId}/feature`, 
        {},
        {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );
      
      // Update local state
      setServices(services.map(service => 
        service._id === serviceId 
          ? { ...service, isFeatured: response.data.isFeatured } 
          : service
      ));
    } catch (err) {
      console.error('Error toggling feature status:', err);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await axios.delete(`/api/services/${serviceId}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      // Remove from local state
      setServices(services.filter(service => service._id !== serviceId));
      
      // Update counts
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  // For demonstration purposes, generate mock services if empty
  const demoServices = [
    {
      _id: '1',
      name: 'Legal Consultation',
      shortDescription: 'Free legal advice for asylum seekers',
      category: 'legal',
      status: 'active',
      isFeatured: true,
      provider: {
        name: 'Refugee Legal Aid',
        organization: 'Lawyers Without Borders'
      },
      averageRating: 4.7,
      metrics: { views: 245, applications: 58 },
      createdAt: '2025-06-15T09:30:00Z'
    },
    {
      _id: '2',
      name: 'Language Classes',
      shortDescription: 'Weekly language courses in English, French, and German',
      category: 'education',
      status: 'active',
      isFeatured: false,
      provider: {
        name: 'Community Education Center',
        organization: 'Refugee Education Initiative'
      },
      averageRating: 4.2,
      metrics: { views: 189, applications: 42 },
      createdAt: '2025-06-10T11:20:00Z'
    },
    {
      _id: '3',
      name: 'Mental Health Support',
      shortDescription: 'Counseling sessions for trauma and adjustment issues',
      category: 'health',
      status: 'pending',
      isFeatured: false,
      provider: {
        name: 'Dr. Amina Khalid',
        organization: 'Healing Minds Clinic'
      },
      averageRating: 4.8,
      metrics: { views: 132, applications: 28 },
      createdAt: '2025-06-28T14:45:00Z'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" component="h1" gutterBottom>
              Services Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all services offered to refugees through the platform
            </Typography>
          </Grid>
          
          <Grid item>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={handleRefresh}
                startIcon={<RefreshIcon />}
              >
                Refresh
              </Button>
              
              <IconButton 
                color={viewMode === 'list' ? 'primary' : 'default'} 
                onClick={() => handleViewModeChange('list')}
                sx={{ ml: 1 }}
              >
                <ViewListIcon />
              </IconButton>
              
              <IconButton 
                color={viewMode === 'stats' ? 'primary' : 'default'} 
                onClick={() => handleViewModeChange('stats')}
              >
                <BarChartIcon />
              </IconButton>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateService}
                sx={{ ml: 2 }}
              >
                Add Service
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {viewMode === 'list' && (
        <>
          <Paper sx={{ mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label={`All (${totalCount || 0})`} />
              <Tab label="Active" />
              <Tab label="Pending" />
              <Tab label="Inactive" />
            </Tabs>
          </Paper>
          
          <ServiceFilters 
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
          />
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          ) : (
            <ServiceList 
              services={services.length > 0 ? services : demoServices}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
              onStatusChange={handleStatusChange}
              onToggleFeature={handleToggleFeature}
              page={page}
              limit={limit}
              total={totalCount || demoServices.length}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              loading={loading}
            />
          )}
        </>
      )}
      
      {viewMode === 'stats' && (
        <ServiceStats stats={dashboardStats} loading={!dashboardStats} />
      )}
      
      <ServiceForm 
        open={openForm}
        onClose={handleFormClose}
        service={editService}
      />
    </Box>
  );
};

export default ServiceManagement;
