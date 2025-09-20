import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  LocalOffer as DiscountIcon,
  Assessment as StatsIcon
} from '@mui/icons-material';
import api from '../../../services/api';
import DiscountList from './DiscountList';
import DiscountForm from './DiscountForm';
import DiscountStats from './DiscountStats';

const DiscountManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    isActive: '',
    discountType: '',
    search: '',
    sort: 'createdAt',
    order: 'desc'
  });
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch discounts based on current filters and pagination
  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const { page, limit } = pagination;
      const { isActive, discountType, search, sort, order } = filters;
      
      let queryParams = `page=${page}&limit=${limit}&sort=${sort}&order=${order}`;
      if (isActive !== '') queryParams += `&isActive=${isActive}`;
      if (discountType) queryParams += `&discountType=${discountType}`;
      if (search) queryParams += `&search=${search}`;
      
      const res = await api.get(`/discounts?${queryParams}`);
      
      setDiscounts(res.data.discounts);
      setPagination(prev => ({
        ...prev,
        total: res.data.pagination.total,
        pages: res.data.pagination.pages
      }));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching discounts:', err);
      setError('Failed to fetch discounts. Please try again.');
      setLoading(false);
    }
  };

  // Compute discount statistics
  const fetchDiscountStats = async () => {
    setStatsLoading(true);
    try {
      // In a real implementation, this would be a dedicated endpoint
      // For now, we'll calculate stats from the discount list
      const res = await api.get('/discounts?limit=100');
      
      const allDiscounts = res.data.discounts;
      const now = new Date();
      
      // Calculate statistics
      const calculatedStats = {
        totalCount: allDiscounts.length,
        activeCount: allDiscounts.filter(d => d.isActive).length,
        inactiveCount: allDiscounts.filter(d => !d.isActive).length,
        expiredCount: allDiscounts.filter(d => new Date(d.endDate) < now).length,
        upcomingCount: allDiscounts.filter(d => new Date(d.startDate) > now).length,
        currentCount: allDiscounts.filter(
          d => d.isActive && new Date(d.startDate) <= now && new Date(d.endDate) >= now
        ).length,
        percentageDiscounts: allDiscounts.filter(d => d.discountType === 'percentage').length,
        fixedDiscounts: allDiscounts.filter(d => d.discountType === 'fixed').length,
        shippingDiscounts: allDiscounts.filter(d => d.discountType === 'shipping').length,
        avgDiscountValue: allDiscounts.length > 0 ? 
          allDiscounts.reduce((sum, d) => {
            if (d.discountType === 'percentage') return sum + d.value;
            return sum;
          }, 0) / allDiscounts.filter(d => d.discountType === 'percentage').length : 0,
        mostUsedDiscounts: [...allDiscounts]
          .sort((a, b) => b.usageCount - a.usageCount)
          .slice(0, 5)
      };
      
      setStats(calculatedStats);
      setStatsLoading(false);
    } catch (err) {
      console.error('Error fetching discount stats:', err);
      setError('Failed to fetch discount statistics');
      setStatsLoading(false);
    }
  };

  // Load discounts on initial render and when filters/pagination change
  useEffect(() => {
    fetchDiscounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, filters]);

  // Load stats when switching to the stats tab
  useEffect(() => {
    if (tabValue === 2 && !stats) {
      fetchDiscountStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (event) => {
    setPagination(prev => ({
      ...prev,
      limit: parseInt(event.target.value),
      page: 1
    }));
  };

  const handleFilterChange = (filters) => {
    setFilters(filters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCreateDiscount = () => {
    setCurrentDiscount(null);
    setFormOpen(true);
  };

  const handleEditDiscount = (discount) => {
    setCurrentDiscount(discount);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setCurrentDiscount(null);
  };

  const handleFormSubmit = async (discountData) => {
    try {
      if (currentDiscount) {
        // Update existing discount
        await api.put(`/discounts/${currentDiscount._id}`, discountData);
        setSuccess('Discount updated successfully');
      } else {
        // Create new discount
        await api.post('/discounts', discountData);
        setSuccess('Discount created successfully');
      }
      
      setFormOpen(false);
      fetchDiscounts();
      // Refresh stats if they were previously loaded
      if (stats) {
        fetchDiscountStats();
      }
    } catch (err) {
      console.error('Error saving discount:', err);
      if (err.response && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Failed to save discount. Please try again.');
      }
    }
  };

  const handleDeleteDiscount = async (id) => {
    try {
      await api.delete(`/discounts/${id}`);
      
      setSuccess('Discount deleted successfully');
      fetchDiscounts();
      // Refresh stats if they were previously loaded
      if (stats) {
        fetchDiscountStats();
      }
    } catch (err) {
      console.error('Error deleting discount:', err);
      setError('Failed to delete discount');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.put(`/discounts/${id}/status`, {});
      
      setSuccess('Discount status updated');
      fetchDiscounts();
      // Refresh stats if they were previously loaded
      if (stats) {
        fetchDiscountStats();
      }
    } catch (err) {
      console.error('Error updating discount status:', err);
      setError('Failed to update discount status');
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="h1">
          <DiscountIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Discount Management
        </Typography>
        
        {tabValue === 0 && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateDiscount}
          >
            New Discount
          </Button>
        )}
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Discounts" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>
      
      {/* Discount List Tab */}
      {tabValue === 0 && (
        <DiscountList
          discounts={discounts}
          loading={loading}
          pagination={pagination}
          filters={filters}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onFilterChange={handleFilterChange}
          onEdit={handleEditDiscount}
          onDelete={handleDeleteDiscount}
          onToggleStatus={handleToggleStatus}
        />
      )}
      
      {/* Analytics Tab */}
      {tabValue === 1 && (
        <DiscountStats 
          stats={stats}
          loading={statsLoading}
        />
      )}
      
      {/* Discount Form Dialog */}
      <DiscountForm
        open={formOpen}
        discount={currentDiscount}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
      
      {/* Snackbar Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DiscountManagement;
