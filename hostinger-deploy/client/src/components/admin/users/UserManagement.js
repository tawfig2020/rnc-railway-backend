import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Button, IconButton, Chip,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
  Snackbar, Avatar, Tooltip, Tab, Tabs, InputAdornment, Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as VerifyIcon,
  PersonAdd as InviteIcon,
  MoreVert as MoreIcon,
  AdminPanelSettings as AdminIcon,
  Volunteer as VolunteerIcon,
  Engineering as StaffIcon,
  Person as RefugeeIcon
} from '@mui/icons-material';
import axios from 'axios';
import UserForm from './UserForm';

const UserManagement = () => {
  // State variables
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('volunteer');
  
  // Fetch users with pagination and filters
  const fetchUsers = async () => {
    setLoading(true);
    try {
      let filterRole = roleFilter;
      
      // Handle tabs as role filters
      if (tabValue === 1) filterRole = 'admin';
      else if (tabValue === 2) filterRole = 'staff';
      else if (tabValue === 3) filterRole = 'volunteer';
      else if (tabValue === 4) filterRole = 'refugee';
      else filterRole = roleFilter; // Use the dropdown filter if on "All" tab
      
      const response = await axios.get('/api/admin/users', {
        headers: { 'x-auth-token': localStorage.getItem('token') },
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm,
          role: filterRole,
          status: statusFilter
        }
      });
      
      setUsers(response.data.users);
      setTotalUsers(response.data.totalUsers);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. ' + (err.response?.data?.message || err.message));
      setLoading(false);
      
      // Fallback mock data for development
      setMockData();
    }
  };
  
  // Set mock data for preview if API fails
  const setMockData = () => {
    const mockUsers = [
      { _id: '1', name: 'John Admin', email: 'john@example.com', role: 'admin', status: 'active', registeredAt: '2025-01-15T12:00:00.000Z', lastLogin: '2025-07-05T08:30:00.000Z' },
      { _id: '2', name: 'Sarah Staff', email: 'sarah@example.com', role: 'staff', status: 'active', registeredAt: '2025-02-10T12:00:00.000Z', lastLogin: '2025-07-04T14:20:00.000Z' },
      { _id: '3', name: 'Mike Volunteer', email: 'mike@example.com', role: 'volunteer', status: 'active', registeredAt: '2025-03-20T12:00:00.000Z', lastLogin: '2025-07-03T09:45:00.000Z' },
      { _id: '4', name: 'Anna Refugee', email: 'anna@example.com', role: 'refugee', status: 'active', registeredAt: '2025-04-05T12:00:00.000Z', lastLogin: '2025-06-28T16:10:00.000Z' },
      { _id: '5', name: 'David Volunteer', email: 'david@example.com', role: 'volunteer', status: 'blocked', registeredAt: '2025-02-25T12:00:00.000Z', lastLogin: '2025-05-15T11:30:00.000Z' }
    ];
    
    setUsers(mockUsers);
    setTotalUsers(mockUsers.length);
  };
  
  // Load users on component mount and when filters/pagination change
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, tabValue]);
  
  // Apply search and filters
  const handleApplyFilters = () => {
    setPage(0); // Reset to first page when applying new filters
    fetchUsers();
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
    setTabValue(0);
    setPage(0);
    setTimeout(() => fetchUsers(), 0);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
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
  
  // Open user form for creating new user
  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setFormOpen(true);
  };
  
  // Open user form for editing
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setFormOpen(true);
  };
  
  // Open delete confirmation dialog
  const handleDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };
  
  // Delete user
  const handleDeleteUser = async () => {
    try {
      await axios.delete(`/api/admin/users/${selectedUser._id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      setSnackbar({
        open: true,
        message: `User ${selectedUser.name} has been deleted`,
        severity: 'success'
      });
      
      fetchUsers();
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting user:', err);
      setSnackbar({
        open: true,
        message: `Error: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    }
  };
  
  // Open block/unblock dialog
  const handleBlockDialog = (user) => {
    setSelectedUser(user);
    setBlockDialogOpen(true);
  };
  
  // Toggle user active status (block/unblock)
  const handleToggleUserStatus = async () => {
    const newStatus = selectedUser.status === 'active' ? 'blocked' : 'active';
    
    try {
      await axios.put(`/api/admin/users/${selectedUser._id}/status`, 
        { status: newStatus },
        { headers: { 'x-auth-token': localStorage.getItem('token') }}
      );
      
      setSnackbar({
        open: true,
        message: `User ${selectedUser.name} has been ${newStatus === 'active' ? 'unblocked' : 'blocked'}`,
        severity: 'success'
      });
      
      fetchUsers();
      setBlockDialogOpen(false);
    } catch (err) {
      console.error('Error updating user status:', err);
      setSnackbar({
        open: true,
        message: `Error: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    }
  };
  
  // Open invite dialog
  const handleOpenInviteDialog = () => {
    setInviteEmail('');
    setInviteRole('volunteer');
    setInviteDialogOpen(true);
  };
  
  // Send user invitation
  const handleSendInvite = async () => {
    try {
      await axios.post('/api/admin/users/invite', 
        { email: inviteEmail, role: inviteRole },
        { headers: { 'x-auth-token': localStorage.getItem('token') }}
      );
      
      setSnackbar({
        open: true,
        message: `Invitation sent to ${inviteEmail}`,
        severity: 'success'
      });
      
      setInviteDialogOpen(false);
    } catch (err) {
      console.error('Error sending invitation:', err);
      setSnackbar({
        open: true,
        message: `Error: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    }
  };
  
  // Handle user save from form
  const handleSaveUser = async (userData) => {
    try {
      if (isEditing) {
        await axios.put(`/api/admin/users/${userData._id}`, userData, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        
        setSnackbar({
          open: true,
          message: `User ${userData.name} has been updated`,
          severity: 'success'
        });
      } else {
        await axios.post('/api/admin/users', userData, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        
        setSnackbar({
          open: true,
          message: `User ${userData.name} has been created`,
          severity: 'success'
        });
      }
      
      setFormOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      setSnackbar({
        open: true,
        message: `Error: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    }
  };
  
  // Get user role icon
  const getUserRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminIcon />;
      case 'staff':
        return <StaffIcon />;
      case 'volunteer':
        return <VolunteerIcon />;
      case 'refugee':
        return <RefugeeIcon />;
      default:
        return <PersonIcon />;
    }
  };
  
  // Get role chip color
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'staff':
        return 'secondary';
      case 'volunteer':
        return 'info';
      case 'refugee':
        return 'success';
      default:
        return 'default';
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        User Management
      </Typography>
      
      {/* Filters and Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Search Users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Name, email, etc."
            />
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
                disabled={tabValue !== 0}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="admin">Admins</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="volunteer">Volunteers</MenuItem>
                <MenuItem value="refugee">Refugees</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
                <MenuItem value="pending">Pending Activation</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Box display="flex" gap={1}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleApplyFilters}
                fullWidth
              >
                Filter
              </Button>
              <IconButton 
                onClick={handleResetFilters}
                size="small"
                title="Reset Filters"
                color="error"
              >
                <BlockIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Users" />
            <Tab 
              label="Admins" 
              icon={<AdminIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Staff" 
              icon={<StaffIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Volunteers" 
              icon={<VolunteerIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Refugees" 
              icon={<RefugeeIcon />}
              iconPosition="start"
            />
          </Tabs>
          
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<InviteIcon />}
              onClick={handleOpenInviteDialog}
              sx={{ mr: 1 }}
            >
              Invite
            </Button>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleCreateUser}
            >
              New User
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Users Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Registered</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 2,
                            bgcolor: user.role === 'admin' ? 'error.main' : 
                                    user.role === 'staff' ? 'secondary.main' :
                                    user.role === 'volunteer' ? 'info.main' : 'success.main'
                          }}
                        >
                          {getUserInitials(user.name)}
                        </Avatar>
                        <Typography variant="body1">
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getUserRoleIcon(user.role)}
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === 'active' ? 'success' : user.status === 'blocked' ? 'error' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.registeredAt)}</TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small"
                          onClick={() => handleEditUser(user)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title={user.status === 'active' ? 'Block' : 'Unblock'}>
                        <IconButton 
                          size="small" 
                          color={user.status === 'active' ? 'error' : 'success'}
                          onClick={() => handleBlockDialog(user)}
                        >
                          {user.status === 'active' ? <BlockIcon fontSize="small" /> : <VerifyIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteDialog(user)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={totalUsers}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
      
      {/* User Form Dialog */}
      {formOpen && (
        <UserForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSaveUser}
          user={selectedUser}
          isEditing={isEditing}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to delete the following user?
              </Typography>
              <Typography variant="body2">
                <strong>Name:</strong> {selectedUser.name}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {selectedUser.email}
              </Typography>
              <Typography variant="body2">
                <strong>Role:</strong> {selectedUser.role}
              </Typography>
              
              <Alert severity="warning" sx={{ mt: 2 }}>
                This action cannot be undone. All user data will be permanently removed.
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Block/Unblock Dialog */}
      <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)}>
        <DialogTitle>
          {selectedUser?.status === 'active' ? 'Block User' : 'Unblock User'}
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to {selectedUser.status === 'active' ? 'block' : 'unblock'} the following user?
              </Typography>
              <Typography variant="body2">
                <strong>Name:</strong> {selectedUser.name}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {selectedUser.email}
              </Typography>
              <Typography variant="body2">
                <strong>Role:</strong> {selectedUser.role}
              </Typography>
              
              {selectedUser.status === 'active' ? (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Blocking this user will prevent them from logging in and accessing the system.
                </Alert>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Unblocking this user will restore their access to the system.
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleToggleUserStatus} 
            color={selectedUser?.status === 'active' ? 'error' : 'success'} 
            variant="contained"
          >
            {selectedUser?.status === 'active' ? 'Block' : 'Unblock'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
        <DialogTitle>Invite User</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
            Send an invitation email to a new user. They will receive instructions to set up their account.
          </Typography>
          
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>User Role</InputLabel>
            <Select
              value={inviteRole}
              label="User Role"
              onChange={(e) => setInviteRole(e.target.value)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="volunteer">Volunteer</MenuItem>
              <MenuItem value="refugee">Refugee</MenuItem>
            </Select>
          </FormControl>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> The invitation link will be valid for 48 hours.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSendInvite} 
            color="primary" 
            variant="contained"
            disabled={!inviteEmail || !inviteEmail.includes('@')}
          >
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;
