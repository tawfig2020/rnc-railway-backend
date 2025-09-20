import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  FormControl, InputLabel, Select, MenuItem, Alert
} from '@mui/material';
import { Add, Edit, Delete, PersonAdd } from '@mui/icons-material';

// Role definitions
const ROLES = [
  { value: 'admin', label: 'Administrator', description: 'Full access to all features' },
  { value: 'staff', label: 'Staff', description: 'Can manage content and events' },
  { value: 'volunteer', label: 'Volunteer', description: 'Limited access to assigned areas' },
  { value: 'intern', label: 'Intern', description: 'Training access with supervision' },
  { value: 'user', label: 'User', description: 'Basic access to public features' }
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'pending',
    password: ''
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use sample data
      const sampleUsers = [
        { id: 1, name: 'Admin User', email: 'admin@rnc.org', role: 'admin', status: 'active' },
        { id: 2, name: 'Staff Member', email: 'staff@rnc.org', role: 'staff', status: 'active' },
        { id: 3, name: 'Volunteer Coordinator', email: 'volunteer@rnc.org', role: 'volunteer', status: 'active' },
        { id: 4, name: 'Intern User', email: 'intern@rnc.org', role: 'intern', status: 'pending' },
        { id: 5, name: 'Regular User', email: 'user@example.com', role: 'user', status: 'active' }
      ];
      
      setUsers(sampleUsers);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
      console.error('Error fetching users:', err);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open dialog for adding/editing user
  const handleOpenDialog = (user = null) => {
    if (user) {
      // Edit mode
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: '' // Don't populate password for security
      });
    } else {
      // Add mode
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'user',
        status: 'pending',
        password: ''
      });
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedUser) {
        // Update existing user
        // In a real app, this would be an API call
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id ? { ...user, ...formData } : user
        );
        setUsers(updatedUsers);
        setSuccessMessage('User updated successfully');
      } else {
        // Add new user
        // In a real app, this would be an API call
        const newUser = {
          id: users.length + 1,
          ...formData
        };
        setUsers([...users, newUser]);
        setSuccessMessage('User added successfully');
      }
      
      handleCloseDialog();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to save user');
      console.error('Error saving user:', err);
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setConfirmDelete(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setConfirmDelete(false);
    setUserToDelete(null);
  };

  // Delete user
  const handleDeleteUser = async () => {
    try {
      // In a real app, this would be an API call
      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      setSuccessMessage('User deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">User Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<PersonAdd />}
          onClick={() => handleOpenDialog()}
        >
          Add New User
        </Button>
      </Box>

      {/* Success message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Users table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Loading users...</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No users found</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={ROLES.find(role => role.value === user.role)?.label || user.role} 
                      color={user.role === 'admin' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status} 
                      color={user.status === 'active' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenDialog(user)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleOpenDeleteDialog(user)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedUser ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="name"
              label="Full Name"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            {!selectedUser && (
              <TextField
                margin="dense"
                name="password"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                value={formData.password}
                onChange={handleInputChange}
                required={!selectedUser}
                sx={{ mb: 2 }}
              />
            )}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                label="Role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                {ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user &quot;{userToDelete?.name}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
