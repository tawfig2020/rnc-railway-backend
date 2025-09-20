import React from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Typography, Pagination, CircularProgress, Avatar
} from '@mui/material';
import {
  Visibility as ViewIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Cancel as CancelledIcon,
  Assignment as PendingIcon,
  MonetizationOn as PaidIcon,
  Block as RefundedIcon
} from '@mui/icons-material';

// Order list component for OrderManagement
const OrderList = ({ 
  orders, 
  loading, 
  error, 
  page, 
  totalPages, 
  onPageChange, 
  onViewOrder 
}) => {
  
  // Render status chip with appropriate color and icon
  const renderStatusChip = (status) => {
    let color;
    let icon;
    let label = status;
    
    switch (status) {
      case 'pending':
        color = 'default';
        icon = <PendingIcon fontSize="small" />;
        break;
      case 'confirmed':
        color = 'primary';
        icon = <PaidIcon fontSize="small" />;
        break;
      case 'shipped':
        color = 'info';
        icon = <ShippingIcon fontSize="small" />;
        break;
      case 'delivered':
        color = 'success';
        icon = <DeliveredIcon fontSize="small" />;
        break;
      case 'cancelled':
        color = 'error';
        icon = <CancelledIcon fontSize="small" />;
        break;
      case 'refunded':
        color = 'warning';
        icon = <RefundedIcon fontSize="small" />;
        break;
      default:
        color = 'default';
        icon = <PendingIcon fontSize="small" />;
    }
    
    return (
      <Chip 
        icon={icon} 
        label={label} 
        color={color} 
        size="small" 
        variant="outlined"
      />
    );
  };
  
  // Render payout status chip
  const renderPayoutChip = (payoutStatus) => {
    let color;
    let label = payoutStatus;
    
    switch (payoutStatus) {
      case 'pending':
        color = 'default';
        break;
      case 'processing':
        color = 'primary';
        break;
      case 'completed':
        color = 'success';
        break;
      case 'failed':
        color = 'error';
        break;
      default:
        color = 'default';
        label = 'N/A';
    }
    
    return (
      <Chip 
        label={label} 
        color={color} 
        size="small" 
        variant="outlined"
      />
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Paper sx={{ mt: 2, mb: 3 }}>
      <TableContainer>
        <Table aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payout</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !orders.length ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography>No orders found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" fontFamily="monospace">
                      {order.orderNumber || order._id.substring(0, 8)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar 
                        alt={order.user?.name || 'Guest'} 
                        src="/static/avatar.jpg"
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography variant="body2">
                        {order.user?.name || order.customerDetails?.name || 'Guest'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {order.vendor?.businessName || 'Multiple Vendors'}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold">
                      ${order.totalAmount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {renderStatusChip(order.orderStatus)}
                  </TableCell>
                  <TableCell>
                    {renderPayoutChip(order.vendorPayoutStatus)}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small"
                      color="primary"
                      onClick={() => onViewOrder(order)}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" p={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            color="primary"
          />
        </Box>
      )}
    </Paper>
  );
};

export default OrderList;
