import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Snackbar,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import axios from 'axios';

const AddressBook = ({ onAddressSelect, selectedAddressId, standalone = false }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);

  const initialAddressState = {
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    deliveryInstructions: '',
    type: 'shipping',
    isDefault: false
  };

  const [addressForm, setAddressForm] = useState(initialAddressState);

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Select address if selectedAddressId is provided
  useEffect(() => {
    if (selectedAddressId && addresses.length > 0) {
      const address = addresses.find(addr => addr._id === selectedAddressId);
      if (address) {
        setSelectedAddress(address);
      }
    }
  }, [selectedAddressId, addresses]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/addresses', {
        headers: { 'x-auth-token': token }
      });
      setAddresses(res.data);
      
      // If no address is selected and we have addresses, select the default one
      if (!selectedAddress && res.data.length > 0) {
        const defaultAddress = res.data.find(addr => addr.isDefault) || res.data[0];
        setSelectedAddress(defaultAddress);
        if (onAddressSelect) {
          onAddressSelect(defaultAddress);
        }
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Unable to load your saved addresses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };

  const openAddressForm = (address = null) => {
    if (address) {
      setAddressForm(address);
      setCurrentAddress(address);
    } else {
      setAddressForm(initialAddressState);
      setCurrentAddress(null);
    }
    setFormErrors({});
    setFormOpen(true);
  };

  const closeAddressForm = () => {
    setFormOpen(false);
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const errors = {};
    const required = ['fullName', 'addressLine1', 'city', 'state', 'postalCode', 'country', 'phone'];
    
    required.forEach(field => {
      if (!addressForm[field]) {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });
    
    // Phone validation
    if (addressForm.phone && !/^\+?[0-9\s-()]{8,20}$/.test(addressForm.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    // Postal code validation
    if (addressForm.postalCode && !/^[0-9a-zA-Z\s-]{3,10}$/.test(addressForm.postalCode)) {
      errors.postalCode = 'Please enter a valid postal/ZIP code';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let res;
      
      if (currentAddress) {
        // Update existing address
        res = await axios.put(`/api/addresses/${currentAddress._id}`, addressForm, {
          headers: { 'x-auth-token': token }
        });
        setSuccess('Address updated successfully');
      } else {
        // Create new address
        res = await axios.post('/api/addresses', addressForm, {
          headers: { 'x-auth-token': token }
        });
        setSuccess('Address added successfully');
      }
      
      await fetchAddresses();
      closeAddressForm();
    } catch (err) {
      console.error('Error saving address:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        const serverErrors = {};
        err.response.data.errors.forEach(error => {
          serverErrors[error.param] = error.msg;
        });
        setFormErrors(serverErrors);
      } else {
        setError('Unable to save address. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirm = (address) => {
    setCurrentAddress(address);
    setConfirmDeleteOpen(true);
  };

  const closeDeleteConfirm = () => {
    setConfirmDeleteOpen(false);
    setCurrentAddress(null);
  };

  const handleDeleteAddress = async () => {
    if (!currentAddress) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/addresses/${currentAddress._id}`, {
        headers: { 'x-auth-token': token }
      });
      
      setSuccess('Address removed successfully');
      
      // If this was the selected address, clear the selection
      if (selectedAddress && selectedAddress._id === currentAddress._id) {
        setSelectedAddress(null);
        if (onAddressSelect) {
          onAddressSelect(null);
        }
      }
      
      await fetchAddresses();
      closeDeleteConfirm();
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Unable to remove address. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (address) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/addresses/${address._id}/default`, {}, {
        headers: { 'x-auth-token': token }
      });
      
      setSuccess('Default address updated');
      await fetchAddresses();
    } catch (err) {
      console.error('Error setting default address:', err);
      setError('Unable to set default address. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const renderAddressForm = () => {
    return (
      <Dialog open={formOpen} onClose={closeAddressForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <form onSubmit={handleSubmitAddress}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={addressForm.fullName}
                  onChange={handleFormChange}
                  error={!!formErrors.fullName}
                  helperText={formErrors.fullName}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  name="addressLine1"
                  value={addressForm.addressLine1}
                  onChange={handleFormChange}
                  error={!!formErrors.addressLine1}
                  helperText={formErrors.addressLine1}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2 (Optional)"
                  name="addressLine2"
                  value={addressForm.addressLine2}
                  onChange={handleFormChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={addressForm.city}
                  onChange={handleFormChange}
                  error={!!formErrors.city}
                  helperText={formErrors.city}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={addressForm.state}
                  onChange={handleFormChange}
                  error={!!formErrors.state}
                  helperText={formErrors.state}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal/ZIP Code"
                  name="postalCode"
                  value={addressForm.postalCode}
                  onChange={handleFormChange}
                  error={!!formErrors.postalCode}
                  helperText={formErrors.postalCode}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!formErrors.country}>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select
                    labelId="country-label"
                    name="country"
                    value={addressForm.country}
                    onChange={handleFormChange}
                    label="Country"
                  >
                    <MenuItem value="">Select a country</MenuItem>
                    <MenuItem value="US">United States</MenuItem>
                    <MenuItem value="CA">Canada</MenuItem>
                    <MenuItem value="GB">United Kingdom</MenuItem>
                    <MenuItem value="AU">Australia</MenuItem>
                    <MenuItem value="FR">France</MenuItem>
                    <MenuItem value="DE">Germany</MenuItem>
                    <MenuItem value="IT">Italy</MenuItem>
                    <MenuItem value="ES">Spain</MenuItem>
                    <MenuItem value="JP">Japan</MenuItem>
                    <MenuItem value="CN">China</MenuItem>
                    <MenuItem value="IN">India</MenuItem>
                    <MenuItem value="BR">Brazil</MenuItem>
                    <MenuItem value="MX">Mexico</MenuItem>
                    {/* Add more countries as needed */}
                  </Select>
                  {formErrors.country && <Typography color="error" variant="caption">{formErrors.country}</Typography>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={addressForm.phone}
                  onChange={handleFormChange}
                  error={!!formErrors.phone}
                  helperText={formErrors.phone || "Include country code for international numbers"}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Instructions (Optional)"
                  name="deliveryInstructions"
                  value={addressForm.deliveryInstructions}
                  onChange={handleFormChange}
                  multiline
                  rows={2}
                  placeholder="E.g., Leave at front door, ring bell, etc."
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="type"
                    value={addressForm.type}
                    onChange={handleFormChange}
                    row
                  >
                    <FormControlLabel value="shipping" control={<Radio />} label="Shipping Address" />
                    <FormControlLabel value="billing" control={<Radio />} label="Billing Address" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={addressForm.isDefault}
                      onChange={handleFormChange}
                      name="isDefault"
                      color="primary"
                    />
                  }
                  label="Set as default address"
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={closeAddressForm}>Cancel</Button>
            <Button 
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : currentAddress ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };

  const renderAddressCard = (address) => {
    const isSelected = selectedAddress && selectedAddress._id === address._id;
    
    return (
      <Card 
        key={address._id}
        sx={{ 
          mb: 2,
          border: isSelected ? '2px solid' : '1px solid',
          borderColor: isSelected ? 'primary.main' : 'divider',
          position: 'relative'
        }}
      >
        {address.isDefault && (
          <Chip 
            label="Default" 
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8
            }}
          />
        )}
        
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={standalone ? 10 : 12}>
              <Typography variant="h6">{address.fullName}</Typography>
              <Typography variant="body2">{address.addressLine1}</Typography>
              {address.addressLine2 && <Typography variant="body2">{address.addressLine2}</Typography>}
              <Typography variant="body2">
                {address.city}, {address.state} {address.postalCode}
              </Typography>
              <Typography variant="body2" gutterBottom>{address.country}</Typography>
              <Typography variant="body2">Phone: {address.phone}</Typography>
              
              {address.deliveryInstructions && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Delivery Instructions:</strong> {address.deliveryInstructions}
                </Typography>
              )}
            </Grid>
            
            {!standalone && (
              <Grid item xs={12} sm={12}>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Button 
                    variant={isSelected ? "contained" : "outlined"}
                    color="primary"
                    size="small"
                    onClick={() => handleAddressSelect(address)}
                    startIcon={isSelected ? <CheckIcon /> : <LocationIcon />}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </Button>
                  
                  <Box>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => openAddressForm(address)}
                    >
                      <EditIcon />
                    </IconButton>
                    
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => openDeleteConfirm(address)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            )}
            
            {standalone && (
              <Grid item xs={2}>
                <Box display="flex" flexDirection="column" alignItems="flex-end" height="100%">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => openAddressForm(address)}
                  >
                    <EditIcon />
                  </IconButton>
                  
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => openDeleteConfirm(address)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  
                  {!address.isDefault && (
                    <Button 
                      size="small" 
                      onClick={() => handleSetDefault(address)}
                      sx={{ mt: 1 }}
                    >
                      Set Default
                    </Button>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {standalone && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">My Addresses</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => openAddressForm()}
          >
            Add New Address
          </Button>
        </Box>
      )}
      
      {loading && !formOpen && (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      )}
      
      {error && !formOpen && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      {!loading && addresses.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>You don&apos;t have any saved addresses.</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => openAddressForm()}
            sx={{ mt: 1 }}
          >
            Add Your First Address
          </Button>
        </Paper>
      ) : (
        <Box>
          {addresses.map(address => renderAddressCard(address))}
          
          {!standalone && (
            <Box textAlign="center" mt={2}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => openAddressForm()}
              >
                Add New Address
              </Button>
            </Box>
          )}
        </Box>
      )}
      
      {/* Address Form Dialog */}
      {renderAddressForm()}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={closeDeleteConfirm}
      >
        <DialogTitle>Delete Address</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this address?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirm}>Cancel</Button>
          <Button onClick={handleDeleteAddress} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notifications */}
      <Snackbar
        open={!!success || !!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={success ? "success" : "error"}>
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddressBook;
