import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Tabs, Tab, 
  CircularProgress, Snackbar, Alert
} from '@mui/material';
import OrderList from './OrderList';
import OrderDetail from './OrderDetail';
import OrderFilters from './OrderFilters';
import api from '../../../services/api';

// Main Order Management component for admin panel
const OrderManagement = () => {
  // State variables
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    vendor: '',
    startDate: '',
    endDate: '',
    minTotal: '',
    maxTotal: '',
    sort: 'newest'
  });
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    ordersByStatus: [],
    ordersByDay: []
  });

  // Fetch orders when component mounts or filters/page change
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  // Fetch order statistics
  useEffect(() => {
    fetchOrderStats();
  }, []);

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      let queryString = `?page=${page}`;
      if (filters.status) queryString += `&status=${filters.status}`;
      if (filters.vendor) queryString += `&vendor=${filters.vendor}`;
      if (filters.startDate) queryString += `&startDate=${filters.startDate}`;
      if (filters.endDate) queryString += `&endDate=${filters.endDate}`;
      if (filters.minTotal) queryString += `&minTotal=${filters.minTotal}`;
      if (filters.maxTotal) queryString += `&maxTotal=${filters.maxTotal}`;
      if (filters.sort) queryString += `&sort=${filters.sort}`;
      
      const response = await api.get(`/orders/admin/all${queryString}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      setOrders(response.data.orders);
      setTotalPages(response.data.pagination.pages);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      showSnackbar('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch order statistics
  const fetchOrderStats = async () => {
    try {
      const response = await api.get('/orders/admin/dashboard', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      setOrderStats(response.data);
    } catch (err) {
      console.error('Error fetching order stats:', err);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Set status filter based on tab
    let status = '';
    switch (newValue) {
      case 1:
        status = 'confirmed';
        break;
      case 2:
        status = 'shipped';
        break;
      case 3:
        status = 'delivered';
        break;
      case 4:
        status = 'cancelled';
        break;
      case 5:
        status = 'refunded';
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

  // Show order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  // Handle order status update
  const handleOrderStatusUpdate = async (orderId, status, trackingInfo) => {
    setLoading(true);
    try {
      await api.put(`/orders/${orderId}/status`, {
        status,
        trackingInfo
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      showSnackbar(`Order status updated to ${status}`, 'success');
      
      // Update orders list and selected order
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        const updatedOrder = { ...selectedOrder, orderStatus: status };
        if (trackingInfo) {
          updatedOrder.trackingInfo = {
            ...updatedOrder.trackingInfo,
            ...trackingInfo
          };
        }
        setSelectedOrder(updatedOrder);
      }
      
      // Refresh stats
      fetchOrderStats();
    } catch (err) {
      console.error('Error updating order status:', err);
      showSnackbar('Failed to update order status', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle vendor payout update
  const handlePayoutUpdate = async (orderId, payoutStatus) => {
    setLoading(true);
    try {
      await api.put(`/orders/${orderId}/payout`, {
        vendorPayoutStatus: payoutStatus
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      showSnackbar(`Vendor payout status updated to ${payoutStatus}`, 'success');
      
      // Update orders list and selected order
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        const updatedOrder = { 
          ...selectedOrder, 
          vendorPayoutStatus: payoutStatus 
        };
        if (payoutStatus === 'completed') {
          updatedOrder.vendorPayoutDate = new Date();
        }
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      console.error('Error updating payout status:', err);
      showSnackbar('Failed to update payout status', 'error');
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
    setSelectedOrder(null);
  };

  // Render content based on selected order
  const renderContent = () => {
    if (selectedOrder) {
      return (
        <OrderDetail
          order={selectedOrder}
          onBack={handleBackToList}
          onStatusUpdate={handleOrderStatusUpdate}
          onPayoutUpdate={handlePayoutUpdate}
          loading={loading}
        />
      );
    }
    
    return (
      <>
        {/* Order Stats Summary Cards */}
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
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h3">{orderStats.totalOrders || 0}</Typography>
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
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h3">
                ${orderStats.totalSales ? orderStats.totalSales.toFixed(2) : '0.00'}
              </Typography>
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
              <Typography variant="h6">Completed Orders</Typography>
              <Typography variant="h3">{orderStats.completedOrders || 0}</Typography>
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
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h3">
                {orderStats.ordersByStatus?.find(s => s._id === 'pending')?.count || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Tabs for quick filtering */}
        <Box mb={3}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="order tabs">
            <Tab label="All Orders" />
            <Tab label="Confirmed" />
            <Tab label="Shipped" />
            <Tab label="Delivered" />
            <Tab label="Cancelled" />
            <Tab label="Refunded" />
          </Tabs>
        </Box>
        
        {/* Filters */}
        <OrderFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        
        {/* Order List */}
        <OrderList
          orders={orders}
          loading={loading}
          error={error}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onViewOrder={handleViewOrder}
        />
      </>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Order Management
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

export default OrderManagement;
