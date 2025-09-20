import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Chip, TextField, Dialog, DialogActions, DialogContent,
  DialogTitle, Grid, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Pagination, Snackbar, Alert, Avatar,
  Rating, Divider, List, ListItem, ListItemText, ListItemAvatar,
  Tabs, Tab
} from '@mui/material';
import { 
  Edit as EditIcon, 
  VerifiedUser as VerifiedIcon,
  Block as BlockIcon,
  Visibility as ViewIcon,
  Business as BusinessIcon,
  AccountCircle as AccountIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import api from '../../../services/api';

// Vendor management component for admin panel
const VendorManagement = () => {
  // State variables
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'newest'
  });
  const [tabValue, setTabValue] = useState(0);
  const [vendorStats, setVendorStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  // Fetch vendors when component mounts or filters/page change
  useEffect(() => {
    fetchVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  // Fetch vendor statistics
  useEffect(() => {
    fetchVendorStats();
  }, []);

  // Fetch vendors from API
  const fetchVendors = async () => {
    setLoading(true);
    try {
      let queryString = `?page=${page}`;
      if (filters.search) queryString += `&search=${filters.search}`;
      if (filters.status) queryString += `&status=${filters.status}`;
      if (filters.sortBy) queryString += `&sort=${filters.sortBy}`;
      
      const response = await api.get(`/vendors/admin/all${queryString}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      setVendors(response.data.vendors);
      setTotalPages(response.data.pagination.pages);
      setError(null);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Failed to load vendors. Please try again.');
      showSnackbar('Failed to load vendors', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch vendor statistics
  const fetchVendorStats = async () => {
    try {
      const response = await api.get('/vendors/admin/dashboard', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      setVendorStats({
        total: response.data.totalVendors || 0,
        approved: response.data.vendorsByStatus.find(s => s._id === 'approved')?.count || 0,
        pending: response.data.vendorsByStatus.find(s => s._id === 'pending')?.count || 0,
        rejected: response.data.vendorsByStatus.find(s => s._id === 'rejected')?.count || 0
      });
    } catch (err) {
      console.error('Error fetching vendor stats:', err);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    setPage(1); // Reset to first page when filters change
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Set status filter based on tab
    let status = '';
    switch (newValue) {
      case 1:
        status = 'approved';
        break;
      case 2:
        status = 'pending';
        break;
      case 3:
        status = 'rejected';
        break;
      default:
        status = '';
    }
    
    setFilters({
      ...filters,
      status
    });
  };

  // Show vendor details
  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setDetailsOpen(true);
  };

  // Open status change dialog
  const handleStatusDialogOpen = (vendor) => {
    setSelectedVendor(vendor);
    setNewStatus(vendor.status);
    setStatusReason('');
    setStatusDialogOpen(true);
  };

  // Handle status change
  const handleStatusChange = async () => {
    if (!selectedVendor || !newStatus) return;
    
    setLoading(true);
    try {
      await api.put(`/vendors/${selectedVendor._id}/status`, {
        status: newStatus,
        reason: statusReason
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      showSnackbar(`Vendor status updated to ${newStatus}`, 'success');
      setStatusDialogOpen(false);
      fetchVendors();
      fetchVendorStats();
    } catch (err) {
      console.error('Error updating vendor status:', err);
      showSnackbar('Failed to update vendor status', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
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

  // Render status chip based on status
  const renderStatusChip = (status) => {
    let color;
    switch (status) {
      case 'approved':
        color = 'success';
        break;
      case 'pending':
        color = 'warning';
        break;
      case 'rejected':
        color = 'error';
        break;
      default:
        color = 'default';
    }
    
    return <Chip label={status} color={color} size="small" />;
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Vendor Management
      </Typography>
      
      {/* Stats Cards */}
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
            <Typography variant="h6">Total Vendors</Typography>
            <Typography variant="h3">{vendorStats.total}</Typography>
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
            <Typography variant="h6">Approved</Typography>
            <Typography variant="h3">{vendorStats.approved}</Typography>
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
            <Typography variant="h3">{vendorStats.pending}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              backgroundColor: 'error.main',
              color: 'white',
              height: '100%'
            }}
          >
            <Typography variant="h6">Rejected</Typography>
            <Typography variant="h3">{vendorStats.rejected}</Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Filters and Tabs */}
      <Box mb={3}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="vendor tabs">
          <Tab label="All Vendors" />
          <Tab label="Approved" />
          <Tab label="Pending Approval" />
          <Tab label="Rejected" />
        </Tabs>
        
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={6}>
            <TextField 
              name="search"
              label="Search Vendors"
              fullWidth
              variant="outlined"
              value={filters.search}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                name="sortBy"
                value={filters.sortBy}
                label="Sort By"
                onChange={handleFilterChange}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="name-asc">Business Name (A-Z)</MenuItem>
                <MenuItem value="name-desc">Business Name (Z-A)</MenuItem>
                <MenuItem value="rating-high">Highest Rating</MenuItem>
                <MenuItem value="rating-low">Lowest Rating</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      {/* Vendors Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="vendors table">
          <TableHead>
            <TableRow>
              <TableCell>Business Name</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !vendors.length ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : vendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No vendors found
                </TableCell>
              </TableRow>
            ) : (
              vendors.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {vendor.logo ? (
                        <Avatar 
                          src={vendor.logo.startsWith('http') ? vendor.logo : `/uploads/${vendor.logo}`} 
                          alt={vendor.businessName}
                          sx={{ marginRight: 1, width: 30, height: 30 }}
                        />
                      ) : (
                        <BusinessIcon sx={{ marginRight: 1 }} />
                      )}
                      {vendor.businessName}
                    </Box>
                  </TableCell>
                  <TableCell>{vendor.user ? vendor.user.name : 'N/A'}</TableCell>
                  <TableCell>
                    {vendor.email || (vendor.user ? vendor.user.email : 'N/A')}
                  </TableCell>
                  <TableCell>
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Rating value={vendor.rating || 0} readOnly size="small" precision={0.5} />
                    <Typography variant="body2" color="text.secondary">
                      ({vendor.reviewsCount || 0})
                    </Typography>
                  </TableCell>
                  <TableCell>{renderStatusChip(vendor.status)}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleViewDetails(vendor)}
                      title="View Details"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="secondary"
                      onClick={() => handleStatusDialogOpen(vendor)}
                      title="Change Status"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
        />
      </Box>
      
      {/* Vendor Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedVendor && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center">
                {selectedVendor.logo ? (
                  <Avatar 
                    src={selectedVendor.logo.startsWith('http') ? selectedVendor.logo : `/uploads/${selectedVendor.logo}`} 
                    alt={selectedVendor.businessName}
                    sx={{ marginRight: 2, width: 50, height: 50 }}
                  />
                ) : (
                  <BusinessIcon sx={{ marginRight: 2, fontSize: 50 }} />
                )}
                <Box>
                  <Typography variant="h6">{selectedVendor.businessName}</Typography>
                  <Box display="flex" alignItems="center">
                    {renderStatusChip(selectedVendor.status)}
                    {selectedVendor.status === 'approved' && (
                      <Box display="flex" alignItems="center" ml={1}>
                        <VerifiedIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="success.main">
                          Verified
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                {/* Business Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Business Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemAvatar>
                        <BusinessIcon />
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Business Type" 
                        secondary={selectedVendor.businessType || 'Not specified'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <EmailIcon />
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Email" 
                        secondary={selectedVendor.email || 'Not specified'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <PhoneIcon />
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Phone" 
                        secondary={selectedVendor.phone || 'Not specified'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Address" 
                        secondary={
                          selectedVendor.address ? 
                          `${selectedVendor.address.street}, ${selectedVendor.address.city}, ${selectedVendor.address.state} ${selectedVendor.address.postalCode}, ${selectedVendor.address.country}` : 
                          'Not specified'
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Tax ID / Registration Number" 
                        secondary={selectedVendor.taxId || 'Not specified'} 
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="h6" gutterBottom mt={2}>
                    Owner Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemAvatar>
                        <AccountIcon />
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Name" 
                        secondary={selectedVendor.user ? selectedVendor.user.name : 'Not linked'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <EmailIcon />
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Email" 
                        secondary={selectedVendor.user ? selectedVendor.user.email : 'Not linked'} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                {/* Business Details and Status History */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Business Details
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedVendor.description || 'No business description provided.'}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Registration Date:</strong> {new Date(selectedVendor.createdAt).toLocaleDateString()}
                  </Typography>
                  
                  {selectedVendor.website && (
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Website:</strong> {selectedVendor.website}
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom>
                    Status History
                  </Typography>
                  
                  {selectedVendor.statusHistory && selectedVendor.statusHistory.length > 0 ? (
                    <List dense>
                      {selectedVendor.statusHistory.slice().reverse().map((history, index) => (
                        <ListItem key={index} alignItems="flex-start">
                          <ListItemText
                            primary={
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="subtitle2">
                                  {history.status.toUpperCase()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(history.date).toLocaleString()}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary">
                                {history.reason || 'No reason provided'}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2">
                      No status history available
                    </Typography>
                  )}
                </Grid>
                
                {/* Additional sections like products, reviews could be added */}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => handleStatusDialogOpen(selectedVendor)}
                color="primary"
                variant="contained"
              >
                Change Status
              </Button>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Change Status Dialog */}
      <Dialog 
        open={statusDialogOpen} 
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Vendor Status</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Current Status: {selectedVendor && renderStatusChip(selectedVendor.status)}
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            label="Reason for Status Change"
            fullWidth
            multiline
            rows={4}
            value={statusReason}
            onChange={(e) => setStatusReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleStatusChange} 
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default VendorManagement;
