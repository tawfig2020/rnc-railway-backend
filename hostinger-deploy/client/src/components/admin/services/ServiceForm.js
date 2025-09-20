import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Box,
  Chip,
  FormHelperText,
  Switch,
  FormControlLabel,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

const ServiceForm = ({ open, onClose, service }) => {
  const initialState = {
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    image: '',
    status: 'pending',
    eligibilityCriteria: '',
    applicationProcess: '',
    provider: {
      name: '',
      organization: '',
      contact: {
        email: '',
        phone: '',
        website: ''
      }
    },
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      isRemote: false
    },
    schedule: {
      availability: '',
      startDate: '',
      endDate: ''
    },
    capacity: '',
    cost: 'Free',
    isFeatured: false,
    languages: [],
    requiredDocuments: []
  };
  
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validation, setValidation] = useState({});
  
  // For handling arrays
  const [newLanguage, setNewLanguage] = useState('');
  const [newDocument, setNewDocument] = useState('');
  
  // Categories list
  const categories = [
    'legal',
    'education',
    'health',
    'employment',
    'housing',
    'counseling',
    'language',
    'cultural',
    'other'
  ];
  
  // Initialize form with service data if editing
  useEffect(() => {
    if (service) {
      // Deep clone the service to avoid direct mutation
      const serviceData = JSON.parse(JSON.stringify(service));
      
      // Format dates for input fields if they exist
      if (serviceData.schedule?.startDate) {
        serviceData.schedule.startDate = new Date(serviceData.schedule.startDate)
          .toISOString()
          .split('T')[0];
      }
      
      if (serviceData.schedule?.endDate) {
        serviceData.schedule.endDate = new Date(serviceData.schedule.endDate)
          .toISOString()
          .split('T')[0];
      }
      
      // Ensure all required objects exist
      if (!serviceData.provider) serviceData.provider = initialState.provider;
      if (!serviceData.location) serviceData.location = initialState.location;
      if (!serviceData.schedule) serviceData.schedule = initialState.schedule;
      if (!serviceData.provider.contact) serviceData.provider.contact = initialState.provider.contact;
      
      setFormData(serviceData);
    } else {
      // Reset form for new service
      setFormData(initialState);
    }
    
    // Clear states
    setError(null);
    setSuccess(false);
    setValidation({});
  }, [service, open]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: value
          }
        });
      } else if (parts.length === 3) {
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: {
              ...formData[parts[0]][parts[1]],
              [parts[2]]: value
            }
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear validation error for this field
    if (validation[name]) {
      setValidation({
        ...validation,
        [name]: null
      });
    }
  };
  
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    
    // Handle nested switches
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: checked
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: checked
      });
    }
  };
  
  const handleAddLanguage = () => {
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage]
      });
      setNewLanguage('');
    }
  };
  
  const handleRemoveLanguage = (language) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(lang => lang !== language)
    });
  };
  
  const handleAddDocument = () => {
    if (newDocument && !formData.requiredDocuments.includes(newDocument)) {
      setFormData({
        ...formData,
        requiredDocuments: [...formData.requiredDocuments, newDocument]
      });
      setNewDocument('');
    }
  };
  
  const handleRemoveDocument = (document) => {
    setFormData({
      ...formData,
      requiredDocuments: formData.requiredDocuments.filter(doc => doc !== document)
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!formData.name) errors.name = 'Service name is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.shortDescription) errors.shortDescription = 'Short description is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.provider?.name) errors['provider.name'] = 'Provider name is required';
    
    // Field length validation
    if (formData.name && formData.name.length > 100) {
      errors.name = 'Name cannot exceed 100 characters';
    }
    if (formData.shortDescription && formData.shortDescription.length > 200) {
      errors.shortDescription = 'Short description cannot exceed 200 characters';
    }
    if (formData.description && formData.description.length > 2000) {
      errors.description = 'Description cannot exceed 2000 characters';
    }
    
    // Email validation for provider contact
    if (formData.provider?.contact?.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.provider.contact.email)) {
        errors['provider.contact.email'] = 'Please enter a valid email address';
      }
    }
    
    // Website URL validation
    if (formData.provider?.contact?.website) {
      try {
        new URL(formData.provider.contact.website);
      } catch (e) {
        errors['provider.contact.website'] = 'Please enter a valid URL (including http:// or https://)';
      }
    }
    
    // Date validation
    if (formData.schedule?.startDate && formData.schedule?.endDate) {
      const start = new Date(formData.schedule.startDate);
      const end = new Date(formData.schedule.endDate);
      if (start > end) {
        errors['schedule.endDate'] = 'End date must be after start date';
      }
    }
    
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      let response;
      
      if (service?._id) {
        // Update existing service
        response = await axios.put(
          `/api/services/${service._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': localStorage.getItem('token')
            }
          }
        );
        
        setSuccess('Service updated successfully!');
      } else {
        // Create new service
        response = await axios.post(
          '/api/services',
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': localStorage.getItem('token')
            }
          }
        );
        
        setSuccess('Service created successfully!');
      }
      
      // Close form after 1 second to show success message
      setTimeout(() => {
        onClose(true); // true indicates refresh needed
      }, 1000);
    } catch (err) {
      console.error('Error saving service:', err);
      
      // Extract error message
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.msg ||
                          'An error occurred while saving the service';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onClose()}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="service-form-dialog"
    >
      <DialogTitle id="service-form-dialog">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {service ? 'Edit Service' : 'Add New Service'}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={() => onClose()} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
        )}
        
        <form id="service-form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Service Name"
                    fullWidth
                    variant="outlined"
                    value={formData.name || ''}
                    onChange={handleChange}
                    error={Boolean(validation.name)}
                    helperText={validation.name}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="shortDescription"
                    label="Short Description"
                    fullWidth
                    variant="outlined"
                    value={formData.shortDescription || ''}
                    onChange={handleChange}
                    error={Boolean(validation.shortDescription)}
                    helperText={validation.shortDescription || 'Brief summary shown in listings (max 200 characters)'}
                    required
                    inputProps={{ maxLength: 200 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Full Description"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={formData.description || ''}
                    onChange={handleChange}
                    error={Boolean(validation.description)}
                    helperText={validation.description || 'Detailed description of the service (max 2000 characters)'}
                    required
                    inputProps={{ maxLength: 2000 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={Boolean(validation.category)}>
                    <InputLabel id="category-label" required>Category</InputLabel>
                    <Select
                      labelId="category-label"
                      name="category"
                      value={formData.category || ''}
                      label="Category"
                      onChange={handleChange}
                      required
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                    {validation.category && <FormHelperText>{validation.category}</FormHelperText>}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      name="status"
                      value={formData.status || 'pending'}
                      label="Status"
                      onChange={handleChange}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="image"
                    label="Image URL"
                    fullWidth
                    variant="outlined"
                    value={formData.image || ''}
                    onChange={handleChange}
                    helperText="URL to an image representing the service"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isFeatured || false}
                        onChange={handleSwitchChange}
                        name="isFeatured"
                        color="primary"
                      />
                    }
                    label="Feature this service on homepage"
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* Provider Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Provider Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="provider.name"
                    label="Provider Name"
                    fullWidth
                    variant="outlined"
                    value={formData.provider?.name || ''}
                    onChange={handleChange}
                    error={Boolean(validation['provider.name'])}
                    helperText={validation['provider.name']}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="provider.organization"
                    label="Organization"
                    fullWidth
                    variant="outlined"
                    value={formData.provider?.organization || ''}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="provider.contact.email"
                    label="Contact Email"
                    fullWidth
                    variant="outlined"
                    value={formData.provider?.contact?.email || ''}
                    onChange={handleChange}
                    error={Boolean(validation['provider.contact.email'])}
                    helperText={validation['provider.contact.email']}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="provider.contact.phone"
                    label="Contact Phone"
                    fullWidth
                    variant="outlined"
                    value={formData.provider?.contact?.phone || ''}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="provider.contact.website"
                    label="Website"
                    fullWidth
                    variant="outlined"
                    value={formData.provider?.contact?.website || ''}
                    onChange={handleChange}
                    error={Boolean(validation['provider.contact.website'])}
                    helperText={validation['provider.contact.website']}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* Location */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Location & Availability
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.location?.isRemote || false}
                        onChange={handleSwitchChange}
                        name="location.isRemote"
                        color="primary"
                      />
                    }
                    label="This is a remote service"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="cost"
                    label="Cost"
                    fullWidth
                    variant="outlined"
                    value={formData.cost || 'Free'}
                    onChange={handleChange}
                    helperText="Cost of the service (e.g., 'Free', '$10/hour', etc.)"
                  />
                </Grid>
                
                {!formData.location?.isRemote && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        name="location.address"
                        label="Address"
                        fullWidth
                        variant="outlined"
                        value={formData.location?.address || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="location.city"
                        label="City"
                        fullWidth
                        variant="outlined"
                        value={formData.location?.city || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="location.state"
                        label="State/Province"
                        fullWidth
                        variant="outlined"
                        value={formData.location?.state || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="location.country"
                        label="Country"
                        fullWidth
                        variant="outlined"
                        value={formData.location?.country || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                  </>
                )}
                
                <Grid item xs={12}>
                  <TextField
                    name="schedule.availability"
                    label="Availability"
                    fullWidth
                    variant="outlined"
                    value={formData.schedule?.availability || ''}
                    onChange={handleChange}
                    helperText="E.g., 'Monday-Friday, 9am-5pm' or 'By appointment only'"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="schedule.startDate"
                    label="Start Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={formData.schedule?.startDate || ''}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="schedule.endDate"
                    label="End Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={formData.schedule?.endDate || ''}
                    onChange={handleChange}
                    error={Boolean(validation['schedule.endDate'])}
                    helperText={validation['schedule.endDate']}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="capacity"
                    label="Capacity"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={formData.capacity || ''}
                    onChange={handleChange}
                    helperText="Maximum number of refugees who can use this service (leave empty if unlimited)"
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* Requirements & Eligibility */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Requirements & Eligibility
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="eligibilityCriteria"
                    label="Eligibility Criteria"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    value={formData.eligibilityCriteria || ''}
                    onChange={handleChange}
                    helperText="Who is eligible to receive this service"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="applicationProcess"
                    label="Application Process"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    value={formData.applicationProcess || ''}
                    onChange={handleChange}
                    helperText="Steps needed to apply for this service"
                  />
                </Grid>
                
                {/* Languages */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Available Languages
                  </Typography>
                  
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <TextField
                      label="Add Language"
                      size="small"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      sx={{ mr: 1, flexGrow: 1 }}
                      InputProps={{
                        startAdornment: (
                          <LanguageIcon color="action" sx={{ mr: 1 }} />
                        ),
                      }}
                    />
                    <Button 
                      variant="outlined" 
                      startIcon={<AddIcon />}
                      onClick={handleAddLanguage}
                    >
                      Add
                    </Button>
                  </Box>
                  
                  <Box sx={{ mt: 1, mb: 2 }}>
                    {formData.languages?.length > 0 ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {formData.languages.map((language, index) => (
                          <Chip
                            key={index}
                            label={language}
                            onDelete={() => handleRemoveLanguage(language)}
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No languages added yet
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                {/* Required Documents */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Required Documents
                  </Typography>
                  
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <TextField
                      label="Add Document"
                      size="small"
                      value={newDocument}
                      onChange={(e) => setNewDocument(e.target.value)}
                      sx={{ mr: 1, flexGrow: 1 }}
                    />
                    <Button 
                      variant="outlined" 
                      startIcon={<AddIcon />}
                      onClick={handleAddDocument}
                    >
                      Add
                    </Button>
                  </Box>
                  
                  <Box sx={{ mt: 1 }}>
                    {formData.requiredDocuments?.length > 0 ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {formData.requiredDocuments.map((doc, index) => (
                          <Chip
                            key={index}
                            label={doc}
                            onDelete={() => handleRemoveDocument(doc)}
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No required documents added yet
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button
          type="submit"
          form="service-form"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {service ? 'Update Service' : 'Create Service'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceForm;
