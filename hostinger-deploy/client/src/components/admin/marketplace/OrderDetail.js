import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, Divider, Button, Chip, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  FormControl, InputLabel, Select, MenuItem, CircularProgress,
  List, ListItem, ListItemText, IconButton, Avatar, Card, CardContent
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Cancel as CancelledIcon,
  Assignment as PendingIcon,
  MonetizationOn as PaidIcon,
  Block as RefundedIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Receipt as ReceiptIcon,
  PointOfSale as POSIcon
} from '@mui/icons-material';

// Order detail component for OrderManagement
const OrderDetail = ({ 
  order, 
  onBack, 
  onStatusUpdate,
  onPayoutUpdate,
  loading 
}) => {
  // State variables
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingCarrier, setTrackingCarrier] = useState('');
  const [newPayoutStatus, setNewPayoutStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render status chip with appropriate color and icon
  const renderStatusChip = (status) => {
    let color;
    let icon;
    
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
        label={status} 
        color={color} 
        variant="filled"
      />
    );
  };
  
  // Render payout status chip
  const renderPayoutChip = (payoutStatus) => {
    let color;
    
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
    }
    
    return (
      <Chip 
        label={payoutStatus || 'N/A'} 
        color={color} 
        variant="outlined"
      />
    );
  };

  // Open status change dialog
  const handleOpenStatusDialog = () => {
    setNewStatus(order.orderStatus);
    setTrackingNumber(order.trackingInfo?.number || '');
    setTrackingCarrier(order.trackingInfo?.carrier || '');
    setStatusNote('');
    setStatusDialogOpen(true);
  };

  // Open payout status dialog
  const handleOpenPayoutDialog = () => {
    setNewPayoutStatus(order.vendorPayoutStatus);
    setPayoutDialogOpen(true);
  };

  // Handle status update
  const handleUpdateStatus = () => {
    const trackingInfo = {};
    if (trackingNumber) trackingInfo.number = trackingNumber;
    if (trackingCarrier) trackingInfo.carrier = trackingCarrier;
    if (statusNote) trackingInfo.note = statusNote;
    
    onStatusUpdate(order._id, newStatus, trackingInfo);
    setStatusDialogOpen(false);
  };

  // Handle payout update
  const handleUpdatePayout = () => {
    onPayoutUpdate(order._id, newPayoutStatus);
    setPayoutDialogOpen(false);
  };

  // Calculate order totals
  const calcSubtotal = () => {
    if (!order.items || !order.items.length) return 0;
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <>
      {/* Back button and header */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Button 
          startIcon={<BackIcon />} 
          onClick={onBack}
          variant="outlined"
        >
          Back to Orders
        </Button>
        
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenStatusDialog}
            sx={{ mr: 1 }}
          >
            Update Status
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleOpenPayoutDialog}
          >
            Update Payout
          </Button>
        </Box>
      </Box>

      {/* Order Header Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h5" component="h2" sx={{ mr: 2 }}>
                Order #{order.orderNumber || order._id.substring(0, 8)}
              </Typography>
              {renderStatusChip(order.orderStatus)}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Placed on {formatDate(order.createdAt)}
            </Typography>
            {order.lastUpdated && (
              <Typography variant="body2" color="text.secondary">
                Last updated: {formatDate(order.lastUpdated)}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box textAlign="right">
              <Typography variant="h6">
                Total: ${order.totalAmount?.toFixed(2)}
              </Typography>
              
              <Box mt={1} display="flex" justifyContent="flex-end" alignItems="center">
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Vendor Payout:
                </Typography>
                {renderPayoutChip(order.vendorPayoutStatus)}
              </Box>
              
              {order.vendorPayoutDate && (
                <Typography variant="body2" color="text.secondary">
                  Paid on: {formatDate(order.vendorPayoutDate)}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Order Details in 2-column layout */}
      <Grid container spacing={3}>
        {/* Left Column - Items, Vendor, Tracking */}
        <Grid item xs={12} md={8}>
          {/* Order Items */}
          <Paper sx={{ mb: 3, overflow: 'hidden' }}>
            <Box bgcolor="primary.main" color="white" p={2}>
              <Typography variant="h6">Order Items</Typography>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Variant</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items && order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {item.image && (
                            <Avatar
                              src={item.image.startsWith('http') ? item.image : `/uploads/${item.image}`}
                              alt={item.name}
                              variant="rounded"
                              sx={{ mr: 1, width: 40, height: 40 }}
                            />
                          )}
                          <div>
                            <Typography variant="body2">{item.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              SKU: {item.sku || 'N/A'}
                            </Typography>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {item.variant ? (
                          <Typography variant="body2">
                            {Object.entries(item.variant).map(([key, value]) => (
                              `${key}: ${value}`
                            )).join(', ')}
                          </Typography>
                        ) : (
                          <Typography variant="body2">Standard</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">${item.price?.toFixed(2)}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Divider />
            
            {/* Order Summary */}
            <Box p={2}>
              <Grid container spacing={1}>
                <Grid item xs={8} md={10}>
                  <Typography align="right">Subtotal:</Typography>
                </Grid>
                <Grid item xs={4} md={2}>
                  <Typography align="right">${calcSubtotal().toFixed(2)}</Typography>
                </Grid>
                
                <Grid item xs={8} md={10}>
                  <Typography align="right">Shipping:</Typography>
                </Grid>
                <Grid item xs={4} md={2}>
                  <Typography align="right">${order.shippingFee?.toFixed(2) || '0.00'}</Typography>
                </Grid>
                
                {order.tax > 0 && (
                  <>
                    <Grid item xs={8} md={10}>
                      <Typography align="right">Tax:</Typography>
                    </Grid>
                    <Grid item xs={4} md={2}>
                      <Typography align="right">${order.tax?.toFixed(2)}</Typography>
                    </Grid>
                  </>
                )}
                
                {order.discount > 0 && (
                  <>
                    <Grid item xs={8} md={10}>
                      <Typography align="right">Discount:</Typography>
                    </Grid>
                    <Grid item xs={4} md={2}>
                      <Typography align="right">-${order.discount?.toFixed(2)}</Typography>
                    </Grid>
                  </>
                )}
                
                <Grid item xs={8} md={10}>
                  <Typography align="right" variant="h6">Total:</Typography>
                </Grid>
                <Grid item xs={4} md={2}>
                  <Typography align="right" variant="h6">${order.totalAmount?.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          
          {/* Vendor Information */}
          <Paper sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Vendor Information
            </Typography>
            
            {order.vendor ? (
              <Box display="flex" alignItems="center">
                {order.vendor.logo ? (
                  <Avatar 
                    src={order.vendor.logo.startsWith('http') ? order.vendor.logo : `/uploads/${order.vendor.logo}`}
                    alt={order.vendor.businessName}
                    sx={{ mr: 2, width: 50, height: 50 }}
                  />
                ) : null}
                
                <Box>
                  <Typography variant="subtitle1">
                    {order.vendor.businessName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.vendor.email} • {order.vendor.phone || 'No phone'}
                  </Typography>
                  {order.vendor.address && (
                    <Typography variant="body2" color="text.secondary">
                      {`${order.vendor.address.city}, ${order.vendor.address.state}`}
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Typography>Vendor information not available</Typography>
            )}
          </Paper>
          
          {/* Tracking Information */}
          <Paper sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Shipping & Tracking
            </Typography>
            
            {order.trackingInfo && (order.trackingInfo.number || order.trackingInfo.carrier) ? (
              <Box>
                {order.trackingInfo.carrier && (
                  <Typography variant="body2">
                    <strong>Carrier:</strong> {order.trackingInfo.carrier}
                  </Typography>
                )}
                
                {order.trackingInfo.number && (
                  <Typography variant="body2">
                    <strong>Tracking Number:</strong> {order.trackingInfo.number}
                  </Typography>
                )}
                
                {order.trackingInfo.url && (
                  <Button 
                    variant="outlined" 
                    size="small" 
                    href={order.trackingInfo.url} 
                    target="_blank"
                    sx={{ mt: 1 }}
                  >
                    Track Package
                  </Button>
                )}
                
                {order.trackingInfo.note && (
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Shipping Note:</strong> {order.trackingInfo.note}
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography variant="body2">No tracking information available</Typography>
            )}
          </Paper>
          
          {/* Order Timeline */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Timeline
            </Typography>
            
            {order.statusHistory && order.statusHistory.length > 0 ? (
              <List>
                {order.statusHistory.slice().reverse().map((event, index) => (
                  <ListItem key={index} divider={index < order.statusHistory.length - 1}>
                    <ListItemText
                      primary={event.status.toUpperCase()}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.secondary">
                            {formatDate(event.date)}
                          </Typography>
                          {event.note && (
                            <Typography component="div" variant="body2" mt={1}>
                              {event.note}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">No status history available</Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Right Column - Customer, Payment, Address */}
        <Grid item xs={12} md={4}>
          {/* Customer Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                  {order.user ? order.user.name.charAt(0).toUpperCase() : 
                    order.customerDetails ? order.customerDetails.name.charAt(0).toUpperCase() : 'G'}
                </Avatar>
                <Typography variant="h6">
                  Customer Information
                </Typography>
              </Box>
              
              <Typography variant="body1">
                {order.user ? order.user.name : 
                  order.customerDetails ? order.customerDetails.name : 'Guest Checkout'}
              </Typography>
              
              <Box display="flex" alignItems="center" mt={1}>
                <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {order.user ? order.user.email : 
                    order.customerDetails ? order.customerDetails.email : 'Not provided'}
                </Typography>
              </Box>
              
              {(order.user?.phone || order.customerDetails?.phone) && (
                <Box display="flex" alignItems="center" mt={1}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {order.user ? order.user.phone : order.customerDetails.phone}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          
          {/* Payment Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <POSIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Payment Information</Typography>
              </Box>
              
              <Typography variant="body2" gutterBottom>
                <strong>Method:</strong> {order.paymentInfo?.method || 'N/A'}
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                <strong>Transaction ID:</strong> {order.paymentInfo?.transactionId || 'N/A'}
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                <strong>Status:</strong> {order.paymentInfo?.status || 'N/A'}
              </Typography>
              
              {order.paymentInfo?.last4 && (
                <Typography variant="body2">
                  <strong>Card:</strong> •••• •••• •••• {order.paymentInfo.last4}
                </Typography>
              )}
            </CardContent>
          </Card>
          
          {/* Shipping Address */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Shipping Address</Typography>
              </Box>
              
              {order.shippingAddress ? (
                <>
                  <Typography variant="body2">{order.shippingAddress.name}</Typography>
                  <Typography variant="body2">{order.shippingAddress.street}</Typography>
                  {order.shippingAddress.street2 && (
                    <Typography variant="body2">{order.shippingAddress.street2}</Typography>
                  )}
                  <Typography variant="body2">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </Typography>
                  <Typography variant="body2">{order.shippingAddress.country}</Typography>
                  {order.shippingAddress.phone && (
                    <Typography variant="body2" mt={1}>
                      <strong>Phone:</strong> {order.shippingAddress.phone}
                    </Typography>
                  )}
                </>
              ) : (
                <Typography variant="body2">No shipping address provided</Typography>
              )}
            </CardContent>
          </Card>
          
          {/* Billing Address (if different) */}
          {order.billingAddress && order.billingAddress.useShippingAddress === false && (
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Billing Address</Typography>
                </Box>
                
                <Typography variant="body2">{order.billingAddress.name}</Typography>
                <Typography variant="body2">{order.billingAddress.street}</Typography>
                {order.billingAddress.street2 && (
                  <Typography variant="body2">{order.billingAddress.street2}</Typography>
                )}
                <Typography variant="body2">
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                </Typography>
                <Typography variant="body2">{order.billingAddress.country}</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
      
      {/* Status Update Dialog */}
      <Dialog 
        open={statusDialogOpen} 
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            label="Tracking Number"
            fullWidth
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Carrier</InputLabel>
            <Select
              value={trackingCarrier}
              label="Carrier"
              onChange={(e) => setTrackingCarrier(e.target.value)}
            >
              <MenuItem value="">Select Carrier</MenuItem>
              <MenuItem value="USPS">USPS</MenuItem>
              <MenuItem value="UPS">UPS</MenuItem>
              <MenuItem value="FedEx">FedEx</MenuItem>
              <MenuItem value="DHL">DHL</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            label="Status Note"
            fullWidth
            multiline
            rows={3}
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Additional information about this status update"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateStatus}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Payout Update Dialog */}
      <Dialog 
        open={payoutDialogOpen} 
        onClose={() => setPayoutDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Vendor Payout Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Payout Status</InputLabel>
            <Select
              value={newPayoutStatus}
              label="Payout Status"
              onChange={(e) => setNewPayoutStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Changing the status to "Completed" will record today's date as the payout date.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayoutDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdatePayout}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Payout Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderDetail;
