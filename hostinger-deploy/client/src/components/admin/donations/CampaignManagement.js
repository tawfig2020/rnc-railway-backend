import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Tabs, Tab, 
  CircularProgress, Snackbar, Alert, Button
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CampaignList from './CampaignList';
import CampaignDetail from './CampaignDetail';
import CampaignForm from './CampaignForm';
import CampaignFilters from './CampaignFilters';
import axios from 'axios';

// Main Campaign Management component for admin panel
const CampaignManagement = () => {
  // State variables
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
    sort: 'newest'
  });
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [campaignStats, setCampaignStats] = useState({
    totalCampaigns: 0,
    totalActive: 0,
    totalCompleted: 0,
    totalDrafts: 0,
    totalDonations: 0,
    totalAmount: 0
  });

  // Fetch campaigns when component mounts or filters/page change
  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  // Fetch campaign statistics
  useEffect(() => {
    fetchCampaignStats();
  }, []);

  // Fetch campaigns from API
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      let queryString = `?page=${page}`;
      if (filters.status) queryString += `&status=${filters.status}`;
      if (filters.category) queryString += `&category=${filters.category}`;
      if (filters.search) queryString += `&search=${filters.search}`;
      if (filters.sort) queryString += `&sort=${filters.sort}`;
      
      const response = await axios.get(`/api/campaigns/admin/all${queryString}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      setCampaigns(response.data.campaigns);
      setTotalPages(response.data.pagination.pages);
      setError(null);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to load campaigns. Please try again.');
      showSnackbar('Failed to load campaigns', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch campaign statistics
  const fetchCampaignStats = async () => {
    try {
      const response = await axios.get('/api/campaigns/admin/dashboard', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      setCampaignStats(response.data);
    } catch (err) {
      console.error('Error fetching campaign stats:', err);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Set status filter based on tab
    let status = '';
    switch (newValue) {
      case 1:
        status = 'active';
        break;
      case 2:
        status = 'completed';
        break;
      case 3:
        status = 'draft';
        break;
      default:
        status = '';
    }
    
    setFilters({
      ...filters,
      status
    });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Show campaign details
  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setFormOpen(false);
  };

  // Open add campaign form
  const handleAddCampaign = () => {
    setSelectedCampaign(null);
    setIsEditing(false);
    setFormOpen(true);
  };

  // Open edit campaign form
  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setIsEditing(true);
    setFormOpen(true);
  };

  // Handle campaign submission (create or update)
  const handleSubmitCampaign = async (campaignData, files) => {
    setLoading(true);
    
    try {
      // Create FormData object for file uploads
      const formData = new FormData();
      
      // Add campaign data
      Object.keys(campaignData).forEach(key => {
        if (key !== 'mainImage' && key !== 'additionalImages' && key !== 'logo') {
          formData.append(key, campaignData[key]);
        }
      });
      
      // Add files if present
      if (files.mainImage) {
        formData.append('mainImage', files.mainImage);
      }
      
      if (files.logo) {
        formData.append('logo', files.logo);
      }
      
      if (files.additionalImages && files.additionalImages.length > 0) {
        files.additionalImages.forEach((file, index) => {
          formData.append('additionalImages', file);
        });
      }
      
      let response;
      
      if (isEditing && selectedCampaign) {
        // Update existing campaign
        response = await axios.put(
          `/api/campaigns/${selectedCampaign._id}`,
          formData,
          {
            headers: { 
              'x-auth-token': localStorage.getItem('token'),
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        showSnackbar('Campaign updated successfully', 'success');
      } else {
        // Create new campaign
        response = await axios.post(
          '/api/campaigns',
          formData,
          {
            headers: { 
              'x-auth-token': localStorage.getItem('token'),
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        showSnackbar('Campaign created successfully', 'success');
      }
      
      // Refresh campaigns list
      fetchCampaigns();
      fetchCampaignStats();
      
      // Close form and show campaign details
      setFormOpen(false);
      setSelectedCampaign(response.data);
      
    } catch (err) {
      console.error('Error submitting campaign:', err);
      showSnackbar(
        err.response?.data?.message || 'Failed to submit campaign',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle campaign status update
  const handleStatusUpdate = async (campaignId, status) => {
    setLoading(true);
    try {
      await axios.put(`/api/campaigns/${campaignId}/status`, {
        status
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      showSnackbar(`Campaign status updated to ${status}`, 'success');
      
      // Update campaigns list and selected campaign
      fetchCampaigns();
      if (selectedCampaign && selectedCampaign._id === campaignId) {
        const updatedCampaign = { ...selectedCampaign, status };
        setSelectedCampaign(updatedCampaign);
      }
      
      // Refresh stats
      fetchCampaignStats();
    } catch (err) {
      console.error('Error updating campaign status:', err);
      showSnackbar('Failed to update campaign status', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle campaign update (adding campaign update message)
  const handleAddUpdate = async (campaignId, updateData) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/campaigns/${campaignId}/updates`, updateData, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      showSnackbar('Campaign update added successfully', 'success');
      
      // Refresh campaign details
      if (selectedCampaign && selectedCampaign._id === campaignId) {
        const updatedCampaign = { 
          ...selectedCampaign, 
          updates: [...(selectedCampaign.updates || []), response.data]
        };
        setSelectedCampaign(updatedCampaign);
      }
    } catch (err) {
      console.error('Error adding campaign update:', err);
      showSnackbar('Failed to add campaign update', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle comment moderation
  const handleModerateComment = async (campaignId, commentId, action) => {
    setLoading(true);
    try {
      await axios.put(`/api/campaigns/${campaignId}/comments/${commentId}`, {
        action
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      showSnackbar(`Comment ${action}d successfully`, 'success');
      
      // Refresh campaign details
      if (selectedCampaign && selectedCampaign._id === campaignId) {
        // Update the comments in the selected campaign
        const updatedComments = selectedCampaign.comments.map(comment => {
          if (comment._id === commentId) {
            if (action === 'approve') {
              return { ...comment, approved: true };
            } else if (action === 'reject') {
              return { ...comment, approved: false };
            } else if (action === 'delete') {
              return null; // Will be filtered out below
            }
          }
          return comment;
        }).filter(comment => comment !== null);
        
        const updatedCampaign = { 
          ...selectedCampaign, 
          comments: updatedComments
        };
        setSelectedCampaign(updatedCampaign);
      }
    } catch (err) {
      console.error('Error moderating comment:', err);
      showSnackbar('Failed to moderate comment', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Handle back to list view
  const handleBackToList = () => {
    setSelectedCampaign(null);
    setFormOpen(false);
  };

  // Render content based on selected campaign and form state
  const renderContent = () => {
    if (formOpen) {
      return (
        <CampaignForm
          campaign={selectedCampaign}
          isEditing={isEditing}
          onSubmit={handleSubmitCampaign}
          onCancel={handleBackToList}
          loading={loading}
        />
      );
    }
    
    if (selectedCampaign) {
      return (
        <CampaignDetail
          campaign={selectedCampaign}
          onBack={handleBackToList}
          onEdit={() => handleEditCampaign(selectedCampaign)}
          onStatusUpdate={handleStatusUpdate}
          onAddUpdate={handleAddUpdate}
          onModerateComment={handleModerateComment}
          loading={loading}
        />
      );
    }
    
    return (
      <>
        {/* Campaign Stats Summary Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                backgroundColor: 'primary.main',
                color: 'white',
                height: '100%'
              }}
            >
              <Typography variant="h6">Total Campaigns</Typography>
              <Typography variant="h3">{campaignStats.totalCampaigns || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                backgroundColor: 'success.main',
                color: 'white',
                height: '100%'
              }}
            >
              <Typography variant="h6">Active Campaigns</Typography>
              <Typography variant="h3">{campaignStats.totalActive || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                backgroundColor: 'info.main',
                color: 'white',
                height: '100%'
              }}
            >
              <Typography variant="h6">Total Donations</Typography>
              <Typography variant="h3">{campaignStats.totalDonations || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                backgroundColor: 'warning.main',
                color: 'white',
                height: '100%'
              }}
            >
              <Typography variant="h6">Total Amount</Typography>
              <Typography variant="h3">
                ${campaignStats.totalAmount ? campaignStats.totalAmount.toFixed(2) : '0.00'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Add Campaign Button */}
        <Box mb={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddCampaign}
          >
            New Campaign
          </Button>
        </Box>
        
        {/* Tabs for quick filtering */}
        <Box mb={3}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="campaign tabs">
            <Tab label="All Campaigns" />
            <Tab label="Active" />
            <Tab label="Completed" />
            <Tab label="Drafts" />
          </Tabs>
        </Box>
        
        {/* Filters */}
        <CampaignFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        
        {/* Campaign List */}
        <CampaignList
          campaigns={campaigns}
          loading={loading}
          error={error}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onViewCampaign={handleViewCampaign}
          onEditCampaign={handleEditCampaign}
          onStatusUpdate={handleStatusUpdate}
        />
      </>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Campaign Management
      </Typography>
      
      {renderContent()}
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CampaignManagement;
