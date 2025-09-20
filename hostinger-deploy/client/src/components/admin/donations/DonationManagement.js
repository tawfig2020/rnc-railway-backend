import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Alert, Snackbar,
  Tabs, Tab, Card, CardContent, useMediaQuery, useTheme
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon,
  TrendingUp as TrendingIcon,
  ReceiptLong as ReceiptIcon
} from '@mui/icons-material';
import axios from 'axios';
import DonationList from './DonationList';
import DonationFilters from './DonationFilters';
import DonationDetail from './DonationDetail';

// Main Donation Management component for admin panel
const DonationManagement = () => {
  // Theme for responsive design
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // State variables
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    campaignId: '',
    search: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    sort: 'newest'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    totalDonors: 0,
    activeCampaigns: 0,
    recentDonations: 0
  });

  // Fetch donations based on filters and pagination
  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, [page, filters]);

  // Fetch donations from API
  const fetchDonations = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });
      
      // Make API request
      const response = await axios.get(`/api/admin/donations?${queryParams}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      // Update state with response data
      setDonations(response.data.donations);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError('Failed to fetch donations. Please try again.');
      setLoading(false);
    }
  };

  // Fetch donation statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/donations/stats', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching donation stats:', err);
    }
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Update filters based on tab
    let statusFilter = '';
    
    switch (newValue) {
      case 0: // All
        statusFilter = '';
        break;
      case 1: // Completed
        statusFilter = 'completed';
        break;
      case 2: // Pending
        statusFilter = 'pending';
        break;
      case 3: // Failed
        statusFilter = 'failed';
        break;
      default:
        statusFilter = '';
    }
    
    setFilters({
      ...filters,
      status: statusFilter
    });
  };

  // View donation details
  const handleViewDonation = (donation) => {
    setSelectedDonation(donation);
  };

  // Close donation detail view
  const handleCloseDetail = () => {
    setSelectedDonation(null);
    fetchDonations(); // Refresh list after editing
  };

  // Update donation status
  const handleUpdateStatus = async (donationId, newStatus) => {
    try {
      await axios.put(`/api/admin/donations/${donationId}/status`, 
        { status: newStatus },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Donation status updated successfully',
        severity: 'success'
      });
      
      // If viewing details, update the selected donation
      if (selectedDonation && selectedDonation._id === donationId) {
        setSelectedDonation({
          ...selectedDonation,
          status: newStatus
        });
      }
      
      // Refresh donations list
      fetchDonations();
      fetchStats();
    } catch (err) {
      console.error('Error updating donation status:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update donation status',
        severity: 'error'
      });
    }
  };

  // Delete donation
  const handleDeleteDonation = async (donationId) => {
    try {
      await axios.delete(`/api/admin/donations/${donationId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Donation deleted successfully',
        severity: 'success'
      });
      
      // Close detail view if open
      if (selectedDonation && selectedDonation._id === donationId) {
        setSelectedDonation(null);
      }
      
      // Refresh donations list
      fetchDonations();
      fetchStats();
    } catch (err) {
      console.error('Error deleting donation:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete donation',
        severity: 'error'
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Render donation detail view
  if (selectedDonation) {
    return (
      <DonationDetail
        donation={selectedDonation}
        onBack={handleCloseDetail}
        onStatusUpdate={handleUpdateStatus}
        onDelete={handleDeleteDonation}
      />
    );
  }

  // Render donation management dashboard
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Donation Management
      </Typography>
      
      {/* Stats Dashboard */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Total Donations */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <MoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Amount
                </Typography>
              </Box>
              <Typography variant="h4" component="div">
                ${stats.totalAmount?.toFixed(2) || '0.00'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                From {stats.totalDonations} donations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Total Donors */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PeopleIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Donors
                </Typography>
              </Box>
              <Typography variant="h4" component="div">
                {stats.totalDonors || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique donors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Active Campaigns */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <CampaignIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Active Campaigns
                </Typography>
              </Box>
              <Typography variant="h4" component="div">
                {stats.activeCampaigns || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accepting donations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Donations */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <ReceiptIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Recent Donations
                </Typography>
              </Box>
              <Typography variant="h4" component="div">
                {stats.recentDonations || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 7 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Average Donation */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Average Donation
                </Typography>
              </Box>
              <Typography variant="h4" component="div">
                ${stats.totalDonations ? (stats.totalAmount / stats.totalDonations).toFixed(2) : '0.00'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Per donation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Status Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant={isSmallScreen ? "scrollable" : "standard"}
          scrollButtons={isSmallScreen ? "auto" : false}
        >
          <Tab label="All Donations" />
          <Tab label="Completed" />
          <Tab label="Pending" />
          <Tab label="Failed" />
        </Tabs>
      </Box>
      
      {/* Filters */}
      <DonationFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      {/* Donations List */}
      <DonationList 
        donations={donations}
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onViewDonation={handleViewDonation}
        onStatusUpdate={handleUpdateStatus}
      />
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DonationManagement;
