import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Chip, CircularProgress, Alert,
  TextField, FormControl, InputLabel, Select, MenuItem, Button,
  IconButton, Grid, Avatar, InputAdornment, Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Volunteer as VolunteerIcon,
  Engineering as StaffIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Block as BlockIcon,
  CheckCircle as CheckIcon,
  Campaign as CampaignIcon,
  Payments as PaymentIcon,
  Settings as SettingsIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

// ActivityLog component for admin action tracking
const ActivityLog = () => {
  // State for activities and filters
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalActivities, setTotalActivities] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    adminId: '',
    startDate: null,
    endDate: null
  });
  const [admins, setAdmins] = useState([]);
  const [expanded, setExpanded] = useState(false);
  
  // Fetch activities with filters and pagination
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: filters.search || undefined,
        type: filters.type || undefined,
        adminId: filters.adminId || undefined,
        startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
        endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined
      };
      
      const response = await axios.get('/api/admin/activities', {
        headers: { 'x-auth-token': localStorage.getItem('token') },
        params
      });
      
      setActivities(response.data.activities);
      setTotalActivities(response.data.total);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activity log. ' + (err.response?.data?.message || err.message));
      setLoading(false);
      
      // Set mock data for development/preview
      setMockData();
    }
  };

  // Fetch admin users for filter dropdown
  const fetchAdmins = async () => {
    try {
      const response = await axios.get('/api/admin/users', {
        headers: { 'x-auth-token': localStorage.getItem('token') },
        params: { role: 'admin,staff' }
      });
      
      setAdmins(response.data.users || []);
    } catch (err) {
      console.error('Error fetching admins:', err);
      
      // Mock admin data
      setAdmins([
        { _id: '1', name: 'John Admin', role: 'admin' },
        { _id: '2', name: 'Sarah Staff', role: 'staff' },
        { _id: '3', name: 'Mike Admin', role: 'admin' }
      ]);
    }
  };
  
  // Set mock data for preview if API fails
  const setMockData = () => {
    const mockActivities = [
      { _id: '1', type: 'user', action: 'create', details: 'Created new user: Jane Doe', timestamp: '2025-07-05T15:30:00.000Z', admin: { _id: '1', name: 'John Admin', role: 'admin' }, entityId: 'user123', entityType: 'user' },
      { _id: '2', type: 'donation', action: 'update', details: 'Updated donation status to completed', timestamp: '2025-07-05T14:45:00.000Z', admin: { _id: '2', name: 'Sarah Staff', role: 'staff' }, entityId: 'donation456', entityType: 'donation' },
      { _id: '3', type: 'campaign', action: 'create', details: 'Created new campaign: Summer Relief', timestamp: '2025-07-05T12:20:00.000Z', admin: { _id: '1', name: 'John Admin', role: 'admin' }, entityId: 'campaign789', entityType: 'campaign' },
      { _id: '4', type: 'user', action: 'delete', details: 'Deleted user: Spam Account', timestamp: '2025-07-04T10:15:00.000Z', admin: { _id: '3', name: 'Mike Admin', role: 'admin' }, entityId: 'user456', entityType: 'user' },
      { _id: '5', type: 'order', action: 'update', details: 'Updated order status to shipped', timestamp: '2025-07-04T09:30:00.000Z', admin: { _id: '2', name: 'Sarah Staff', role: 'staff' }, entityId: 'order789', entityType: 'order' },
      { _id: '6', type: 'system', action: 'settings', details: 'Updated payment gateway settings', timestamp: '2025-07-03T16:45:00.000Z', admin: { _id: '1', name: 'John Admin', role: 'admin' }, entityId: 'settings', entityType: 'settings' },
      { _id: '7', type: 'user', action: 'update', details: 'Updated user role: Mark Johnson from volunteer to staff', timestamp: '2025-07-03T14:20:00.000Z', admin: { _id: '3', name: 'Mike Admin', role: 'admin' }, entityId: 'user789', entityType: 'user' },
      { _id: '8', type: 'campaign', action: 'update', details: 'Updated campaign status to completed: Spring Fundraiser', timestamp: '2025-07-03T11:10:00.000Z', admin: { _id: '2', name: 'Sarah Staff', role: 'staff' }, entityId: 'campaign123', entityType: 'campaign' },
      { _id: '9', type: 'donation', action: 'delete', details: 'Deleted duplicate donation record', timestamp: '2025-07-02T15:30:00.000Z', admin: { _id: '1', name: 'John Admin', role: 'admin' }, entityId: 'donation123', entityType: 'donation' },
      { _id: '10', type: 'order', action: 'update', details: 'Refunded order #ORD-3842', timestamp: '2025-07-02T13:45:00.000Z', admin: { _id: '2', name: 'Sarah Staff', role: 'staff' }, entityId: 'order123', entityType: 'order' }
    ];
    
    setActivities(mockActivities);
    setTotalActivities(mockActivities.length);
  };
  
  // Initial load
  useEffect(() => {
    fetchActivities();
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);
  
  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };
  
  // Apply filters
  const applyFilters = () => {
    setPage(0);
    fetchActivities();
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      type: '',
      adminId: '',
      startDate: null,
      endDate: null
    });
    setTimeout(() => {
      setPage(0);
      fetchActivities();
    }, 0);
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Toggle filters expansion
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get action icon based on type
  const getActionIcon = (type) => {
    switch (type) {
      case 'user':
        return <PersonIcon />;
      case 'donation':
        return <PaymentIcon />;
      case 'campaign':
        return <CampaignIcon />;
      case 'order':
        return <ShoppingCartIcon />;
      case 'system':
        return <SettingsIcon />;
      default:
        return <AdminIcon />;
    }
  };
  
  // Get action color based on action
  const getActionColor = (action) => {
    switch (action) {
      case 'create':
        return 'success';
      case 'update':
        return 'info';
      case 'delete':
        return 'error';
      case 'settings':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  // Get action icon based on action
  const getActionOperationIcon = (action) => {
    switch (action) {
      case 'create':
        return <AddIcon fontSize="small" />;
      case 'update':
        return <EditIcon fontSize="small" />;
      case 'delete':
        return <DeleteIcon fontSize="small" />;
      case 'view':
        return <ViewIcon fontSize="small" />;
      case 'email':
        return <EmailIcon fontSize="small" />;
      case 'block':
        return <BlockIcon fontSize="small" />;
      case 'approve':
        return <CheckIcon fontSize="small" />;
      case 'settings':
        return <SettingsIcon fontSize="small" />;
      default:
        return null;
    }
  };
  
  // Get admin role icon
  const getAdminRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminIcon fontSize="small" />;
      case 'staff':
        return <StaffIcon fontSize="small" />;
      case 'volunteer':
        return <VolunteerIcon fontSize="small" />;
      default:
        return <PersonIcon fontSize="small" />;
    }
  };
  
  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Activity Log
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <FilterIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">Filters</Typography>
          </Box>
          <IconButton size="small" onClick={toggleExpanded}>
            {expanded ? <ClearIcon /> : <FilterIcon />}
          </IconButton>
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={expanded ? 8 : 10}>
            <TextField
              fullWidth
              size="small"
              label="Search Activity Log"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by details, admin name..."
            />
          </Grid>
          
          <Grid item xs={12} md={expanded ? 4 : 2}>
            <Button 
              fullWidth 
              variant="contained"
              onClick={applyFilters}
            >
              Search
            </Button>
          </Grid>
          
          {expanded && (
            <>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Activity Type</InputLabel>
                  <Select
                    value={filters.type}
                    label="Activity Type"
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="user">User Management</MenuItem>
                    <MenuItem value="donation">Donations</MenuItem>
                    <MenuItem value="campaign">Campaigns</MenuItem>
                    <MenuItem value="order">Orders</MenuItem>
                    <MenuItem value="system">System Settings</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Admin User</InputLabel>
                  <Select
                    value={filters.adminId}
                    label="Admin User"
                    onChange={(e) => handleFilterChange('adminId', e.target.value)}
                  >
                    <MenuItem value="">All Admins</MenuItem>
                    {admins.map((admin) => (
                      <MenuItem key={admin._id} value={admin._id}>
                        {admin.name} ({admin.role})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box display="flex" gap={1}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={applyFilters}
                    fullWidth
                  >
                    Apply Filters
                  </Button>
                  <IconButton 
                    onClick={resetFilters}
                    size="small"
                    title="Reset Filters"
                    color="error"
                  >
                    <ClearIcon />
                  </IconButton>
                </Box>
              </Grid>
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="From Date"
                    value={filters.startDate}
                    onChange={(date) => handleFilterChange('startDate', date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth size="small" />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="To Date"
                    value={filters.endDate}
                    onChange={(date) => handleFilterChange('endDate', date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth size="small" />
                    )}
                  />
                </Grid>
              </LocalizationProvider>
            </>
          )}
        </Grid>
      </Paper>
      
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Activity Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Activity Type</TableCell>
                <TableCell>Admin User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    No activities found
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((activity) => (
                  <TableRow key={activity._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          mr: 1,
                          bgcolor: 
                            activity.type === 'user' ? 'primary.main' : 
                            activity.type === 'donation' ? 'secondary.main' :
                            activity.type === 'campaign' ? 'success.main' :
                            activity.type === 'order' ? 'info.main' : 'warning.main'
                        }}>
                          {getActionIcon(activity.type)}
                        </Avatar>
                        <Typography variant="body2">
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {activity.admin && (
                          <>
                            <Tooltip title={activity.admin.role}>
                              <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                                {getAdminRoleIcon(activity.admin.role)}
                              </Avatar>
                            </Tooltip>
                            <Typography variant="body2">
                              {activity.admin.name}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getActionOperationIcon(activity.action)}
                        label={activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                        color={getActionColor(activity.action)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{activity.details}</TableCell>
                    <TableCell>{formatDate(activity.timestamp)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={totalActivities}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
      
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button 
          variant="outlined" 
          color="error" 
          onClick={() => alert('This would clear old activity logs after confirmation')}
        >
          Clear Old Logs (90+ days)
        </Button>
      </Box>
    </Box>
  );
};

export default ActivityLog;
